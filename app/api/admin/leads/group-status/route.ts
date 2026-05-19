import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const groupStatusSchema = z.object({
  status: z.enum(["novo", "em_contato", "convertido", "perdido"]),
  relatedItems: z
    .array(
      z.object({
        id: z.string().min(1),
        itemType: z.enum(["lead", "contato"]),
      }),
    )
    .min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const data = groupStatusSchema.parse(body);

    const leadIds = data.relatedItems
      .filter((item) => item.itemType === "lead")
      .map((item) => item.id);
    const contatoIds = data.relatedItems
      .filter((item) => item.itemType === "contato")
      .map((item) => item.id);

    const { leadCount, contatoCount } = await prisma.$transaction(
      async (tx) => {
        const leadResult = leadIds.length
          ? await tx.lead.updateMany({
              where: { id: { in: leadIds } },
              data: { status: data.status },
            })
          : { count: 0 };

        const contatoResult = contatoIds.length
          ? await tx.contato.updateMany({
              where: { id: { in: contatoIds } },
              data: { status: data.status },
            })
          : { count: 0 };

        return {
          leadCount: leadResult.count,
          contatoCount: contatoResult.count,
        };
      },
    );

    return NextResponse.json({
      success: true,
      updated: leadCount + contatoCount,
      status: data.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Payload inválido", details: error.issues },
        { status: 400 },
      );
    }

    console.error("[admin/leads/group-status PATCH]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
