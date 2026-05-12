import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    // Tenta deletar como Lead; se não existir, tenta como Contato
    const tipo = request.nextUrl.searchParams.get("tipo") ?? "lead";

    if (tipo === "contato") {
      await prisma.contato.delete({ where: { id } });
    } else {
      await prisma.lead.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Registro não encontrado" }, { status: 404 });
    }
    console.error("[admin/leads/:id DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
