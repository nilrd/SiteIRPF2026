import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const analise = await prisma.analise.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        resumo: true,
        dados: true,
        totalPosts: true,
        totalLeads: true,
        createdAt: true,
      },
    });

    if (!analise) {
      return NextResponse.json(
        { error: "Análise não encontrada" },
        { status: 404 }
      );
    }

    let dados: unknown;
    try {
      dados = JSON.parse(analise.dados);
    } catch {
      dados = {};
    }

    return NextResponse.json({
      analise: {
        id: analise.id,
        resumo: analise.resumo,
        totalPosts: analise.totalPosts,
        totalLeads: analise.totalLeads,
        createdAt: analise.createdAt,
        dados,
      },
    });
  } catch (err) {
    console.error("[site-analyzer/history/[id]]", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar análise" },
      { status: 500 }
    );
  }
}
