import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import {
  generateAmazonAffiliatePost,
  getMissingAmazonAffiliateSlugs,
  saveAmazonAffiliatePost,
} from "@/lib/amazon-affiliate-engine";
import {
  AMAZON_AFFILIATE_POSTS,
  getAmazonAffiliatePostByIndex,
  getAmazonAffiliatePostBySlug,
} from "@/lib/amazon-affiliate-content-map";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/blog/generate-amazon
 * Body:
 *  - { mode: "status" }
 *  - { mode: "batch" }
 *  - { mode: "single", slug: "..." }
 *  - { mode: "single", index: 0 }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const cronSecret = process.env.CRON_SECRET;
    const isCronAuth = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);

    const token = isCronAuth
      ? null
      : await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!isCronAuth && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const mode = typeof body.mode === "string" ? body.mode : "single";
    const overwrite = body.overwrite === true;

    if (mode === "status") {
      const missing = await getMissingAmazonAffiliateSlugs();
      const total = AMAZON_AFFILIATE_POSTS.length;
      return NextResponse.json({
        total,
        generated: total - missing.length,
        pending: missing.length,
        pendingSlugs: missing,
        allSlugs: AMAZON_AFFILIATE_POSTS.map((post, index) => ({
          index,
          slug: post.slug,
          keyword: post.keyword,
          productTitle: post.productTitle,
          exists: !missing.includes(post.slug),
        })),
      });
    }

    if (mode === "batch") {
      const missing = await getMissingAmazonAffiliateSlugs();
      if (missing.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Todos os posts Amazon já foram gerados.",
          total: AMAZON_AFFILIATE_POSTS.length,
          pending: 0,
        });
      }

      const nextSlug = missing[0];
      const postDef = getAmazonAffiliatePostBySlug(nextSlug);
      if (!postDef) {
        return NextResponse.json(
          { error: `Definição não encontrada para slug: ${nextSlug}` },
          { status: 500 },
        );
      }

      const result = await generateAmazonAffiliatePost(postDef);
      const saved = await saveAmazonAffiliatePost(result, {
        overwriteExisting: overwrite,
      });
      revalidatePath(`/blog/${saved.slug}`);

      return NextResponse.json({
        success: true,
        generated: { id: saved.id, slug: saved.slug, title: saved.title },
        needsReview: saved.needsReview,
        remaining: missing.length - 1,
      });
    }

    let postDef =
      typeof body.slug === "string"
        ? getAmazonAffiliatePostBySlug(body.slug)
        : typeof body.index === "number"
          ? getAmazonAffiliatePostByIndex(body.index)
          : undefined;

    if (!postDef) {
      const missing = await getMissingAmazonAffiliateSlugs();
      if (missing.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Todos os posts Amazon já foram gerados.",
          total: AMAZON_AFFILIATE_POSTS.length,
          pending: 0,
        });
      }
      postDef = getAmazonAffiliatePostBySlug(missing[0]);
    }

    if (!postDef) {
      return NextResponse.json(
        {
          error: "Post Amazon não encontrado. Informe slug ou index válido.",
          availableSlugs: AMAZON_AFFILIATE_POSTS.map((post) => post.slug),
        },
        { status: 404 },
      );
    }

    const result = await generateAmazonAffiliatePost(postDef);
    const saved = await saveAmazonAffiliatePost(result, {
      overwriteExisting: overwrite,
    });
    revalidatePath(`/blog/${saved.slug}`);

    return NextResponse.json({
      success: true,
      post: {
        id: saved.id,
        slug: saved.slug,
        title: saved.title,
        hiddenFromBlogList: true,
        needsReview: saved.needsReview,
      },
    });
  } catch (error) {
    console.error("[generate-amazon] Erro:", error);
    const msg = error instanceof Error ? error.message : "Falha ao gerar post Amazon";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
