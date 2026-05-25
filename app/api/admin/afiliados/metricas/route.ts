/**
 * GET /api/admin/afiliados/metricas
 * Retorna métricas agregadas de toda a estratégia Mercado Pago.
 */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalPages,
      publishedPages,
      indexablePages,
      sitemapPages,
      pagesWithCta,
      pagesWithAlerts,
      eventCounts30d,
      eventCounts7d,
      topPages,
      recentEvents,
    ] = await Promise.all([
      prisma.affiliatePage.count(),
      prisma.affiliatePage.count({ where: { status: "publicado" } }),
      prisma.affiliatePage.count({ where: { indexable: true } }),
      prisma.affiliatePage.count({ where: { inSitemap: true } }),
      prisma.affiliatePage.count({ where: { mainCta: { not: null } } }),
      // Pages with SEO alerts: sem metaTitle ou sem metaDesc
      prisma.affiliatePage.count({
        where: {
          OR: [
            { metaTitle: null },
            { metaDesc: null },
            { targetKeyword: null },
          ],
        },
      }),
      // Event counts 30d
      prisma.analyticsEvent.groupBy({
        by: ["type"],
        where: {
          type: { in: ["affiliate_page_view", "affiliate_cta_click", "mp_point_smart_click", "mp_point_pro_click", "mp_app_click", "maquininha_quiz_start", "maquininha_quiz_complete", "cartao_calculator_use"] },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
      }),
      // Event counts 7d
      prisma.analyticsEvent.groupBy({
        by: ["type"],
        where: {
          type: { in: ["affiliate_page_view", "affiliate_cta_click", "mp_point_smart_click", "mp_point_pro_click", "mp_app_click"] },
          createdAt: { gte: since7d },
        },
        _count: { id: true },
      }),
      // Top pages by affiliate clicks
      prisma.analyticsEvent.groupBy({
        by: ["page"],
        where: {
          type: { in: ["mp_point_smart_click", "mp_point_pro_click", "mp_app_click"] },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      // Recent events
      prisma.analyticsEvent.findMany({
        where: {
          type: { in: ["mp_point_smart_click", "mp_point_pro_click", "mp_app_click", "maquininha_quiz_complete"] },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { type: true, page: true, element: true, device: true, createdAt: true },
      }),
    ]);

    // Build counts map
    const countsMap: Record<string, number> = {};
    for (const ev of eventCounts30d) countsMap[ev.type] = ev._count.id;

    const counts7dMap: Record<string, number> = {};
    for (const ev of eventCounts7d) counts7dMap[ev.type] = ev._count.id;

    const totalAffiliateClicks30d =
      (countsMap["mp_point_smart_click"] ?? 0) +
      (countsMap["mp_point_pro_click"] ?? 0) +
      (countsMap["mp_app_click"] ?? 0);

    const totalViews30d = countsMap["affiliate_page_view"] ?? 0;
    const avgCtr = totalViews30d > 0
      ? Math.round((totalAffiliateClicks30d / totalViews30d) * 1000) / 10
      : 0;

    return NextResponse.json({
      summary: {
        totalPages,
        publishedPages,
        indexablePages,
        sitemapPages,
        pagesOutOfSitemap: totalPages - sitemapPages,
        pagesWithCta,
        pagesWithoutCta: totalPages - pagesWithCta,
        pagesWithAlerts,
      },
      metrics30d: {
        pageViews: totalViews30d,
        ctaClicks: countsMap["affiliate_cta_click"] ?? 0,
        smartClicks: countsMap["mp_point_smart_click"] ?? 0,
        proClicks: countsMap["mp_point_pro_click"] ?? 0,
        appClicks: countsMap["mp_app_click"] ?? 0,
        totalAffiliateClicks: totalAffiliateClicks30d,
        quizStarts: countsMap["maquininha_quiz_start"] ?? 0,
        quizCompletes: countsMap["maquininha_quiz_complete"] ?? 0,
        calcUses: countsMap["cartao_calculator_use"] ?? 0,
        avgCtr,
      },
      metrics7d: {
        pageViews: counts7dMap["affiliate_page_view"] ?? 0,
        smartClicks: counts7dMap["mp_point_smart_click"] ?? 0,
        proClicks: counts7dMap["mp_point_pro_click"] ?? 0,
        appClicks: counts7dMap["mp_app_click"] ?? 0,
      },
      topPages: topPages.map((p) => ({ path: p.page, clicks: p._count.id })),
      recentEvents,
    });
  } catch (err) {
    console.error("[afiliados/metricas GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
