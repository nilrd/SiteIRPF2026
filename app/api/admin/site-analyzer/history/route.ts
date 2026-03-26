import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const analises = await prisma.analise.findMany({
      select: {
        id: true,
        resumo: true,
        totalPosts: true,
        totalLeads: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ analises });
  } catch (err) {
    console.error("[site-analyzer/history]", err);
    return NextResponse.json({ analises: [] });
  }
}
