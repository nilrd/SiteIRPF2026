/**
 * GET  /api/admin/afiliados/search-console  → lista entradas manuais
 * POST /api/admin/afiliados/search-console  → criar/upsert entrada
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

    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    const entries = await prisma.affiliateSearchConsole.findMany({
      where: path ? { pagePath: path } : undefined,
      orderBy: [{ clicks: "desc" }, { impressions: "desc" }],
    });

    return NextResponse.json({ entries });
  } catch (err) {
    console.error("[search-console GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as {
      pagePath: string;
      targetKeyword?: string | null;
      impressions?: number;
      clicks?: number;
      ctr?: number;
      avgPosition?: number;
      notes?: string;
    };

    if (!body.pagePath) {
      return NextResponse.json({ error: "pagePath obrigatório" }, { status: 400 });
    }

    const entry = await prisma.affiliateSearchConsole.upsert({
      where: {
        pagePath_targetKeyword: {
          pagePath: body.pagePath,
          targetKeyword: body.targetKeyword ?? "",
        },
      },
      create: {
        pagePath: body.pagePath,
        targetKeyword: body.targetKeyword ?? null,
        impressions: body.impressions ?? 0,
        clicks: body.clicks ?? 0,
        ctr: body.ctr ?? 0,
        avgPosition: body.avgPosition ?? 0,
        notes: body.notes ?? null,
        lastUpdated: new Date(),
      },
      update: {
        impressions: body.impressions ?? 0,
        clicks: body.clicks ?? 0,
        ctr: body.ctr ?? 0,
        avgPosition: body.avgPosition ?? 0,
        notes: body.notes ?? undefined,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    console.error("[search-console POST]", err);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
