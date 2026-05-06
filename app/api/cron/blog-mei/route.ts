import { NextResponse } from "next/server";
import { generateMeiBlogPost, saveMeiBlogPost, ALL_MEI_CLUSTERS } from "@/lib/mei-blog-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 180; // 3min — gera 2 posts MEI por cron run

const NUM_POSTS = 2;
const DELAY_MS = 4000;
const MAX_CRON_MS = 150_000; // 150s de segurança

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Rastreia índice do último cluster usado (em memória — por instância)
let lastClusterIdx = -1;

function nextClusterIdx(): number {
  lastClusterIdx = (lastClusterIdx + 1) % ALL_MEI_CLUSTERS.length;
  return lastClusterIdx;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        const clusterIdx = nextClusterIdx();
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

    const elapsed = Math.round((Date.now() - cronStart) / 1000);
    return NextResponse.json({
      ok: true,
      generated: results.length,
      published: results.filter((r) => r.published).length,
      retained: results.filter((r) => !r.published).length,
      elapsed_seconds: elapsed,
      results,
      errors,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Cron MEI] Erro fatal:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
