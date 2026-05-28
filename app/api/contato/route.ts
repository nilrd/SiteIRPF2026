import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyContato } from "@/lib/notification-hub";
import { isValidBrWhatsApp } from "@/lib/phone-validation";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z
    .string()
    .min(11, "WhatsApp deve ter DDD + 9 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .refine(
      (tel) => isValidBrWhatsApp(tel).valid,
      "WhatsApp inválido. Use formato (XX) 9XXXX-XXXX",
    ),
  origem: z.string().max(100).optional(),
  servico: z.string().max(50).optional(),
  mensagem: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const phoneValidation = isValidBrWhatsApp(data.telefone);
    const telefoneNormalizado = phoneValidation.normalized;
    const origem = data.origem || "site";
    const mensagem = `${data.servico ? `[${data.servico}] ` : ""}${data.mensagem || ""}`;
    const waNum = telefoneNormalizado;
    const waLink = waNum
      ? `https://wa.me/55${waNum}?text=${encodeURIComponent(`Olá ${data.nome}! Aqui é o Nilson Brites. Recebi seu contato e posso te ajudar com sua IRPF 2026. Se quiser, já te envio os próximos passos.`)}`
      : null;

    const contato = await prisma.contato.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: telefoneNormalizado,
        origem,
        status: "novo",
        mensagem,
      },
    });

    const notifications = await notifyContato({
      nome: data.nome,
      email: data.email,
      telefone: telefoneNormalizado,
      origem,
      servico: data.servico,
      mensagem: data.mensagem,
      whatsappUrl: waLink,
    });

    return NextResponse.json({
      success: true,
      id: contato.id,
      emailSent: {
        admin: notifications.emailToAdmin,
        user: notifications.emailToUser,
      },
      webhookSent: notifications.webhook,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados invalidos", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Contato API error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
