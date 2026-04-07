import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalPageviews30d,
      sessionRows30d,
      totalPageviews7d,
      waClicks30d,
      ctaClicks30d,
      topPages,
      topReferrers,
      deviceBreakdown,
      countryBreakdown,
      avgScrollByPage,
      topCtaElements,
      timeOnPageAvg,
      utmSources,
    ] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { type: "pageview", createdAt: { gte: since30d } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["sessionId"],
        where: { type: "pageview", createdAt: { gte: since30d } },
        _count: { id: true },
      }),
      prisma.analyticsEvent.count({
        where: { type: "pageview", createdAt: { gte: since7d } },
      }),
      prisma.analyticsEvent.count({
        where: { type: "whatsapp_click", createdAt: { gte: since30d } },
      }),
      prisma.analyticsEvent.count({
        where: { type: "cta_click", createdAt: { gte: since30d } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["page"],
        where: { type: "pageview", createdAt: { gte: since30d } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 15,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["referrer"],
        where: {
          type: "pageview",
          referrer: { not: null },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["device"],
        where: { type: "pageview", createdAt: { gte: since30d } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["country"],
        where: {
          type: "pageview",
          country: { not: null },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["page"],
        where: { type: "scroll", createdAt: { gte: since30d } },
        _avg: { scrollDepth: true },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["element", "type"],
        where: {
          type: { in: ["whatsapp_click", "cta_click"] },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 15,
      }),
      prisma.analyticsEvent.aggregate({
        where: { type: "time_on_page", createdAt: { gte: since30d } },
        _avg: { timeOnPage: true },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["utmSource", "utmCampaign"],
        where: {
          type: "pageview",
          utmSource: { not: null },
          createdAt: { gte: since30d },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
    ]);

    const uniqueSessions30d = sessionRows30d.length;
    const avgTimeOnPage = Math.round(timeOnPageAvg._avg.timeOnPage ?? 0);

    return NextResponse.json({
      overview: {
        pageviews30d: totalPageviews30d,
        sessions30d: uniqueSessions30d,
        pageviews7d: totalPageviews7d,
        waClicks30d,
        ctaClicks30d,
        avgTimeOnPageSec: avgTimeOnPage,
      },
      topPages: topPages.map((p) => ({ page: p.page, views: p._count.id })),
      topReferrers: topReferrers.map((r) => ({
        referrer: r.referrer ?? "(direto)",
        views: r._count.id,
      })),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        device: d.device ?? "desconhecido",
        count: d._count.id,
      })),
      countryBreakdown: countryBreakdown.map((c) => ({
        country: c.country ?? "desconhecido",
        count: c._count.id,
      })),
      avgScrollByPage: avgScrollByPage.map((s) => ({
        page: s.page,
        avgScroll: Math.round(s._avg.scrollDepth ?? 0),
        events: s._count.id,
      })),
      topCtaClicks: topCtaElements.map((e) => ({
        element: e.element ?? "(sem texto)",
        type: e.type,
        count: e._count.id,
      })),
      utmSources: utmSources.map((u) => ({
        utmSource: u.utmSource,
        utmCampaign: u.utmCampaign,
        visits: u._count.id,
      })),
    });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Erro ao obter analytics" }, { status: 500 });
  }
}
