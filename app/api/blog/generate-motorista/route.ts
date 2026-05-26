import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import {
  generateMotoristPost,
  saveMotoristPost,
  getMissingMotoristaSlugs,
} from "@/lib/motorista-engine";
import {
  MOTORISTA_POSTS,
  getMotoristPostBySlug,
  getMotoristPostByIndex,
} from "@/lib/motorista-content-map";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Geração de posts sobre motoristas de app (ocultos da listagem, visíveis no Google).
 * Autenticação: CRON_SECRET (header) OU sessão admin (NextAuth token).
 *
 * Body (JSON):
 *   - mode: "single" | "batch" | "status"
 *   - slug?: string       — modo single por slug específico
 *   - index?: number      — modo single por índice no content-map
 *
 * Exemplos:
 *   POST { mode: "status" }          → lista todos os slugs e quais já existem
 *   POST { mode: "single", slug: "como-se-cadastrar-uber-motorista-passo-a-passo" }
 *   POST { mode: "single", index: 0 }
 *   POST { mode: "batch" }           → gera todos os posts que ainda não existem (1 por request)
 */
export async function POST(request: NextRequest) {
  try {
    // ── Autenticação: aceita CRON_SECRET ou sessão admin ──────────────────────
    const authHeader = request.headers.get("authorization") ?? "";
    const cronSecret = process.env.CRON_SECRET;
    const isCronAuth =
      cronSecret &&
      authHeader === `Bearer ${cronSecret}`;

    const token = isCronAuth
      ? null
      : await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
        });

    if (!isCronAuth && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const mode = typeof body.mode === "string" ? body.mode : "single";

    // ── MODE: status ──────────────────────────────────────────────────────────
    if (mode === "status") {
      const missing = await getMissingMotoristaSlugs();
      const total = MOTORISTA_POSTS.length;
      const generated = total - missing.length;
      return NextResponse.json({
        total,
        generated,
        pending: missing.length,
        pendingSlugs: missing,
        allSlugs: MOTORISTA_POSTS.map((p, i) => ({
          index: i,
          slug: p.slug,
          cluster: p.cluster,
          keyword: p.keyword,
          exists: !missing.includes(p.slug),
        })),
      });
    }

    // ── MODE: batch — gera o próximo post ainda não existente ─────────────────
    if (mode === "batch") {
      const missing = await getMissingMotoristaSlugs();
      if (missing.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Todos os 18 posts já foram gerados.",
          total: MOTORISTA_POSTS.length,
          pending: 0,
        });
      }

      // Gera apenas o primeiro da fila (evita timeout)
      const nextSlug = missing[0];
      const postDef = getMotoristPostBySlug(nextSlug);
      if (!postDef) {
        return NextResponse.json(
          { error: `Definição não encontrada para slug: ${nextSlug}` },
          { status: 500 },
        );
      }

      const result = await generateMotoristPost(postDef);
      const saved = await saveMotoristPost(result);

      revalidatePath(`/blog/${saved.slug}`);

      return NextResponse.json({
        success: true,
        generated: { id: saved.id, slug: saved.slug, title: saved.title },
        remaining: missing.length - 1,
        aiModel: result.aiModel,
      });
    }

    // ── MODE: single — gera um post específico ────────────────────────────────
    let postDef =
      typeof body.slug === "string"
        ? getMotoristPostBySlug(body.slug)
        : typeof body.index === "number"
          ? getMotoristPostByIndex(body.index)
          : undefined;

    // Fallback: se nenhum parâmetro fornecido, gera o próximo pendente
    if (!postDef) {
      const missing = await getMissingMotoristaSlugs();
      if (missing.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Todos os posts já foram gerados.",
          total: MOTORISTA_POSTS.length,
          pending: 0,
        });
      }
      postDef = getMotoristPostBySlug(missing[0]);
    }

    if (!postDef) {
      return NextResponse.json(
        {
          error: "Post não encontrado. Forneça slug ou index válido.",
          availableSlugs: MOTORISTA_POSTS.map((p) => p.slug),
        },
        { status: 404 },
      );
    }

    const result = await generateMotoristPost(postDef);
    const saved = await saveMotoristPost(result);

    revalidatePath(`/blog/${saved.slug}`);

    return NextResponse.json({
      success: true,
      post: {
        id: saved.id,
        slug: saved.slug,
        title: saved.title,
        aiModel: result.aiModel,
        hiddenFromBlogList: true,
        categoria: "RENDA_EXTRA",
      },
    });
  } catch (error) {
    console.error("[generate-motorista] Erro:", error);
    const msg =
      error instanceof Error ? error.message : "Falha ao gerar post";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
