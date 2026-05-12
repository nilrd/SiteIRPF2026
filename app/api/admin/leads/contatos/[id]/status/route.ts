import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["novo", "em_contato", "convertido", "perdido"]),
});

export async function PATCH(
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
      return NextResponse.json({ error: "ID do contato é obrigatório" }, { status: 400 });
    }

    const body = await request.json();
    const data = statusSchema.parse(body);

    const contato = await prisma.contato.update({
      where: { id },
      data: { status: data.status },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, contato });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Status inválido", details: error.issues },
        { status: 400 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 });
    }

    console.error("[admin/leads/contatos/:id/status PATCH]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
