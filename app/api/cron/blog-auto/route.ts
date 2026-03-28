import { NextResponse } from "next/server";
import { generateBlogPost, saveBlogPost, ALL_CLUSTERS } from "@/lib/blog-engine";
import { resend } from "@/lib/resend";
import { feedBrainFromOfficialSources, isKeywordRecent, markKeywordUsed } from "@/lib/knowledge-brain";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel Pro: até 300s para gerar 8 posts em sequência

const NUM_POSTS = 8;
const DELAY_BETWEEN_POSTS_MS = 3000;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Alimenta o cérebro com fontes oficiais antes de gerar qualquer post.
    console.log("[Cron] Alimentando cérebro com fontes oficiais...");
    await feedBrainFromOfficialSources();

    const results: { id: string; title: string; slug: string; published: boolean }[] = [];
    const errors: { index: number; error: string }[] = [];

    for (let i = 0; i < NUM_POSTS; i++) {
      if (i > 0) await delay(DELAY_BETWEEN_POSTS_MS);

      try {
        // Seleciona cluster aleatório — evita repetir keyword usada nos últimos 7 dias
        let idx = Math.floor(Math.random() * ALL_CLUSTERS.length);
        for (let attempt = 0; attempt < 5; attempt++) {
          const primary = ALL_CLUSTERS[idx % ALL_CLUSTERS.length]?.primary;
          if (!primary || !(await isKeywordRecent(primary, 7))) break;
          console.log(`[Cron][${i + 1}/${NUM_POSTS}] Keyword recente, tentando outro cluster: ${primary}`);
          idx = Math.floor(Math.random() * ALL_CLUSTERS.length);
        }
        const clusterName = ALL_CLUSTERS[idx % ALL_CLUSTERS.length]?.primary ?? "irpf";
        console.log(`[Cron][${i + 1}/${NUM_POSTS}] Gerando post — cluster: ${clusterName}`);
        const post = await generateBlogPost(idx);
        const saved = await saveBlogPost(post);
        void markKeywordUsed(post.keyword, clusterName, saved.id);
        results.push({ id: saved.id, title: saved.title, slug: saved.slug, published: saved.published });
        console.log(`[Cron][${i + 1}/${NUM_POSTS}] ✅ ${saved.published ? "Publicado" : "Retido"}: ${saved.title}`);
      } catch (postErr) {
        const msg = postErr instanceof Error ? postErr.message : String(postErr);
        console.error(`[Cron][${i + 1}/${NUM_POSTS}] ❌ Erro:`, msg);
        errors.push({ index: i + 1, error: msg });
      }
    }

    // Notifica admin com resumo de todos os posts gerados
    if (process.env.ADMIN_EMAIL && results.length > 0) {
      const published = results.filter((r) => r.published);
      const retained = results.filter((r) => !r.published);
      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: `[Cron] ${results.length} posts gerados — ${new Date().toLocaleDateString("pt-BR")}`,
        html: `
          <h2>Blog Auto — Relatório do Dia</h2>
          <p><strong>${published.length} publicados</strong> | ${retained.length} retidos para revisão | ${errors.length} erros</p>
          <h3>Publicados</h3>
          <ul>${published.map((p) => `<li><a href="https://irpf.qaplay.com.br/blog/${p.slug}">${p.title}</a></li>`).join("")}</ul>
          ${retained.length > 0 ? `<h3>Aguardando revisão</h3><ul>${retained.map((p) => `<li>${p.title}</li>`).join("")}</ul>` : ""}
          ${errors.length > 0 ? `<h3>Erros (${errors.length})</h3><ul>${errors.map((e) => `<li>Post ${e.index}: ${e.error}</li>`).join("")}</ul>` : ""}
          <p>Acesse o painel para revisar e publicar os rascunhos.</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      errors: errors.length,
      posts: results,
    });
  } catch (error) {
    console.error("Blog cron error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
