/**
 * GET  /api/admin/afiliados/paginas  → lista com métricas agregadas
 * PUT  /api/admin/afiliados/paginas  → body { id, ...fields } → update
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

    const [pages, clickEvents] = await Promise.all([
      prisma.affiliatePage.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.analyticsEvent.groupBy({
        by: ["page", "type"],
        where: {
          type: { in: ["affiliate_page_view", "affiliate_cta_click", "mp_point_smart_click", "mp_point_pro_click", "mp_app_click", "maquininha_quiz_start", "maquininha_quiz_complete", "cartao_calculator_use"] },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
      }),
    ]);

    // Build metrics map por page
    const metricsMap: Record<string, { views: number; ctaClicks: number; smartClicks: number; proClicks: number; appClicks: number; quizStarts: number; quizCompletes: number; calcUses: number }> = {};
    for (const row of clickEvents) {
      if (!metricsMap[row.page]) {
        metricsMap[row.page] = { views: 0, ctaClicks: 0, smartClicks: 0, proClicks: 0, appClicks: 0, quizStarts: 0, quizCompletes: 0, calcUses: 0 };
      }
      const m = metricsMap[row.page];
      if (row.type === "affiliate_page_view") m.views += row._count.id;
      if (row.type === "affiliate_cta_click") m.ctaClicks += row._count.id;
      if (row.type === "mp_point_smart_click") m.smartClicks += row._count.id;
      if (row.type === "mp_point_pro_click") m.proClicks += row._count.id;
      if (row.type === "mp_app_click") m.appClicks += row._count.id;
      if (row.type === "maquininha_quiz_start") m.quizStarts += row._count.id;
      if (row.type === "maquininha_quiz_complete") m.quizCompletes += row._count.id;
      if (row.type === "cartao_calculator_use") m.calcUses += row._count.id;
    }

    // Get last click per page
    const lastClicks = await prisma.analyticsEvent.findMany({
      where: {
        type: { in: ["mp_point_smart_click", "mp_point_pro_click", "mp_app_click"] },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { page: true, createdAt: true },
    });
    const lastClickMap: Record<string, Date> = {};
    for (const c of lastClicks) {
      if (!lastClickMap[c.page]) lastClickMap[c.page] = c.createdAt;
    }

    const enriched = pages.map((p) => {
      const m = metricsMap[p.path] ?? { views: 0, ctaClicks: 0, smartClicks: 0, proClicks: 0, appClicks: 0, quizStarts: 0, quizCompletes: 0, calcUses: 0 };
      const totalClicks = m.smartClicks + m.proClicks + m.appClicks;
      const ctr = m.views > 0 ? Math.round((totalClicks / m.views) * 1000) / 10 : 0;

      // SEO audit flags
      const seoAlerts: string[] = [];
      if (!p.metaTitle) seoAlerts.push("sem-meta-title");
      if (!p.metaDesc) seoAlerts.push("sem-meta-desc");
      if (!p.targetKeyword) seoAlerts.push("sem-keyword-alvo");
      if (!p.mainProduct) seoAlerts.push("sem-produto");
      if (!p.mainCta) seoAlerts.push("sem-cta");
      if (!p.inSitemap) seoAlerts.push("fora-do-sitemap");
      if (!p.indexable) seoAlerts.push("noindex-ativo");

      return {
        ...p,
        metrics: {
          views: m.views,
          ctaClicks: m.ctaClicks,
          smartClicks: m.smartClicks,
          proClicks: m.proClicks,
          appClicks: m.appClicks,
          totalAffiliateClicks: totalClicks,
          quizStarts: m.quizStarts,
          quizCompletes: m.quizCompletes,
          calcUses: m.calcUses,
          ctr,
          lastClickAt: lastClickMap[p.path] ?? null,
        },
        seoAlerts,
      };
    });

    return NextResponse.json({ pages: enriched });
  } catch (err) {
    console.error("[afiliados/paginas GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as { id: string; [key: string]: unknown };
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const allowed = ["status", "indexable", "inSitemap", "allowRelated", "metaTitle", "metaDesc", "targetKeyword", "mainProduct", "mainCta", "notes", "pageType"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in fields) data[key] = fields[key];
    }

    const updated = await prisma.affiliatePage.update({ where: { id }, data });
    return NextResponse.json({ ok: true, page: updated });
  } catch (err) {
    console.error("[afiliados/paginas PUT]", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
