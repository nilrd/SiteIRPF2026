import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { TrendResearchService } from "@/lib/trend-research";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const service = new TrendResearchService();

    const [trends, quota] = await Promise.all([
      service.getAllTrendsForAdmin(200),
      service.getQuotaStatus(),
    ]);

    const now = new Date();
    const enriched = trends.map((t) => ({
      ...t,
      active: t.cachedUntil > now,
      inScope: TrendResearchService.isInIRPFScope(t.keyword),
    }));

    return NextResponse.json({ ok: true, trends: enriched, quota });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 },
    );
  }
}
