import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: unknown[] = Array.isArray(body) ? body : [body];

    if (events.length > 30) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const country = req.headers.get("x-vercel-ip-country") ?? undefined;
    const region = req.headers.get("x-vercel-ip-region") ?? undefined;
    const city = decodeURIComponent(req.headers.get("x-vercel-ip-city") ?? "") || undefined;

    await prisma.analyticsEvent.createMany({
      data: events.map((ev) => {
        const e = ev as Record<string, unknown>;
        return {
          sessionId: String(e.sessionId ?? "").slice(0, 64),
          type: String(e.type ?? "unknown").slice(0, 50),
          page: String(e.page ?? "/").slice(0, 500),
          referrer: e.referrer ? String(e.referrer).slice(0, 500) : null,
          utmSource: e.utmSource ? String(e.utmSource).slice(0, 100) : null,
          utmMedium: e.utmMedium ? String(e.utmMedium).slice(0, 100) : null,
          utmCampaign: e.utmCampaign ? String(e.utmCampaign).slice(0, 100) : null,
          utmContent: e.utmContent ? String(e.utmContent).slice(0, 100) : null,
          utmTerm: e.utmTerm ? String(e.utmTerm).slice(0, 100) : null,
          scrollDepth:
            typeof e.scrollDepth === "number"
              ? Math.min(100, Math.max(0, e.scrollDepth))
              : null,
          timeOnPage:
            typeof e.timeOnPage === "number"
              ? Math.min(7200, Math.max(0, e.timeOnPage))
              : null,
          element: e.element ? String(e.element).slice(0, 200) : null,
          country: country ?? null,
          region: region ?? null,
          city: city ?? null,
          device: e.device ? String(e.device).slice(0, 20) : null,
          browser: e.browser ? String(e.browser).slice(0, 50) : null,
          os: e.os ? String(e.os).slice(0, 50) : null,
          screenW: typeof e.screenW === "number" ? e.screenW : null,
          screenH: typeof e.screenH === "number" ? e.screenH : null,
        };
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[analytics/event]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
