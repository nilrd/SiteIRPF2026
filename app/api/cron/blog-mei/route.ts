import { NextResponse } from "next/server";
import { finishAutomationRun, startAutomationRun, failAutomationRun } from "@/lib/automation-runs";
import { generateMeiBlogPost, saveMeiBlogPost, ALL_MEI_CLUSTERS } from "@/lib/mei-blog-engine";
import { MEI_KEYWORD_CLUSTERS, DESENROLA_KEYWORD_CLUSTERS } from "@/lib/mei-context";
import { resend } from "@/lib/resend";
import { notifySystemAlert } from "@/lib/notify";

export const dynamic = "force-dynamic";
export const maxDuration = 180; // 3min — gera 2 posts MEI por cron run

const NUM_POSTS = 2;
const DELAY_MS = 4000;
const MAX_CRON_MS = 150_000; // 150s de segurança

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Seleção aleatória ponderada: 50% MEI, 50% Desenrola — sem memória (funciona em cold start)
function pickClusterIdx(): number {
  const useDesenrola = Math.random() < 0.5 && DESENROLA_KEYWORD_CLUSTERS.length > 0;
  if (useDesenrola) {
    const i = Math.floor(Math.random() * DESENROLA_KEYWORD_CLUSTERS.length);
    return MEI_KEYWORD_CLUSTERS.length + i;
  }
  return Math.floor(Math.random() * MEI_KEYWORD_CLUSTERS.length);
}

export async function GET(request: Request) {
  let runId: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const run = await startAutomationRun({
      automationKey: "blog-mei",
      metadata: {
        targetPosts: NUM_POSTS,
        maxCronMs: MAX_CRON_MS,
      },
    });
    runId = run.id;

    const results: { id: string; title: string; slug: string; published: boolean; categoria: string }[] = [];
    const errors: { index: number; error: string }[] = [];
    const cronStart = Date.now();

    for (let i = 0; i < NUM_POSTS; i++) {
      if (i > 0) await delay(DELAY_MS);

      const elapsed = Date.now() - cronStart;
      if (elapsed > MAX_CRON_MS) {
        console.warn(`[Cron MEI] Orçamento de ${MAX_CRON_MS / 1000}s atingido após ${i} posts. Encerrando.`);
        break;
      }

      try {
        const clusterIdx = pickClusterIdx();
        const clusterName = ALL_MEI_CLUSTERS[clusterIdx]?.primary ?? "mei";
        console.log(`[Cron MEI][${i + 1}/${NUM_POSTS}] Gerando post — cluster: ${clusterName}`);
        const post = await generateMeiBlogPost(clusterIdx);
        const saved = await saveMeiBlogPost(post);
        results.push({
          id: saved.id,
          title: saved.title,
          slug: saved.slug,
          published: saved.published,
          categoria: saved.categoria,
        });
        console.log(
          `[Cron MEI][${i + 1}/${NUM_POSTS}] ${saved.published ? "✅ Publicado" : "⏸ Retido"}: ${saved.title}`
        );
      } catch (postErr) {
        const msg = postErr instanceof Error ? postErr.message : String(postErr);
        console.error(`[Cron MEI][${i + 1}/${NUM_POSTS}] ❌ Erro:`, msg);
        errors.push({ index: i + 1, error: msg });
      }
    }

    const durationMs = Date.now() - cronStart;
    const elapsed = Math.round(durationMs / 1000);
    const published = results.filter((result) => result.published);
    const retained = results.filter((result) => !result.published);

    if (runId) {
      await finishAutomationRun(runId, {
        generatedCount: results.length,
        publishedCount: published.length,
        retainedCount: retained.length,
        errorCount: errors.length,
        durationMs,
        metadata: {
          results,
          errors,
        },
      });
    }

    if (process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
          to: process.env.ADMIN_EMAIL,
          subject: `[Cron MEI] ${results.length} posts gerados — ${new Date().toLocaleDateString("pt-BR")}`,
          html: `
            <h2>Blog Auto MEI — Relatório do Dia</h2>
            <p><strong>${published.length} publicados</strong> | ${retained.length} retidos | ${errors.length} erros</p>
            <p>Duração: ${elapsed}s</p>
            ${published.length > 0 ? `<h3>Publicados</h3><ul>${published.map((p) => `<li><a href="https://irpf.qaplay.com.br/blog/${p.slug}">${p.title}</a> (${p.categoria})</li>`).join("")}</ul>` : "<p>Nenhum post publicado nesta execução.</p>"}
            ${retained.length > 0 ? `<h3>Retidos</h3><ul>${retained.map((p) => `<li>${p.title}</li>`).join("")}</ul>` : ""}
            ${errors.length > 0 ? `<h3>Erros</h3><ul>${errors.map((e) => `<li>Post ${e.index}: ${e.error}</li>`).join("")}</ul>` : ""}
          `,
        });
      } catch (emailError) {
        console.error("[Cron MEI] Falha ao enviar resumo por email:", emailError);
      }
    }

    if (errors.length > 0 || results.length === 0) {
      const message = [
        "[ALERTA BLOG MEI]",
        `Gerados: ${results.length}`,
        `Publicados: ${published.length}`,
        `Retidos: ${retained.length}`,
        `Erros: ${errors.length}`,
      ].join("\n");

      await notifySystemAlert(message);

      if (process.env.ADMIN_EMAIL) {
        try {
          await resend.emails.send({
            from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
            to: process.env.ADMIN_EMAIL,
            subject: `[ALERTA][Blog MEI] ${results.length === 0 ? "Nenhum post gerado" : `${errors.length} erro(s)`}`,
            html: `
              <h2>Alerta do Blog MEI</h2>
              <p>Gerados: ${results.length}</p>
              <p>Publicados: ${published.length}</p>
              <p>Retidos: ${retained.length}</p>
              <p>Erros: ${errors.length}</p>
              ${errors.length > 0 ? `<ul>${errors.map((e) => `<li>Post ${e.index}: ${e.error}</li>`).join("")}</ul>` : ""}
            `,
          });
        } catch (emailError) {
          console.error("[Cron MEI] Falha ao enviar alerta por email:", emailError);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      generated: results.length,
      published: published.length,
      retained: retained.length,
      elapsed_seconds: elapsed,
      runId,
      results,
      errors,
    });
  } catch (err) {
    if (runId) {
      await failAutomationRun(runId, err, {
        automationKey: "blog-mei",
      }).catch((runError) => {
        console.error("[Cron MEI] Falha ao registrar erro no monitor:", runError);
      });
    }

    await notifySystemAlert(
      [
        "[ALERTA BLOG MEI]",
        "Falha fatal no cron do blog MEI.",
        err instanceof Error ? err.message : String(err),
      ].join("\n")
    ).catch((notifyError) => {
      console.error("[Cron MEI] Falha ao enviar alerta operacional:", notifyError);
    });

    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: "[ALERTA][Blog MEI] Falha fatal no cron",
        html: `
          <h2>Falha fatal no cron do Blog MEI</h2>
          <p>${err instanceof Error ? err.message : String(err)}</p>
        `,
      }).catch((emailError) => {
        console.error("[Cron MEI] Falha ao enviar alerta fatal por email:", emailError);
      });
    }

    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Cron MEI] Erro fatal:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
