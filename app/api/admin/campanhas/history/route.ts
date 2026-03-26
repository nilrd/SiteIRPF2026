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

    const campanhas = await prisma.campanhaGerada.findMany({
      select: {
        id: true,
        nome: true,
        objetivo: true,
        plataforma: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ campanhas });
  } catch (err) {
    console.error("[campanhas/history]", err);
    return NextResponse.json({ campanhas: [] });
  }
}
