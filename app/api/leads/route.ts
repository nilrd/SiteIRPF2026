import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyLead } from "@/lib/notification-hub";
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
  servico: z.enum(["IRPF", "MEI", "GERAL"]).optional().default("IRPF"),
  mensagem: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const phoneValidation = isValidBrWhatsApp(data.telefone);
    const telefoneNormalizado = phoneValidation.normalized;

    const lead = await prisma.lead.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: telefoneNormalizado,
        origem: data.origem || "site",
        servico: data.servico || "IRPF",
        mensagem: data.mensagem || "",
        emailSeqStep: 1,
        emailSeqAt: new Date(),
      },
    });

    const waNum = telefoneNormalizado;
    const waLink = waNum
      ? `https://wa.me/55${waNum}?text=${encodeURIComponent(`Olá ${data.nome}! Aqui é o Nilson Brites. Vi seu cadastro no site e posso te ajudar com sua IRPF 2026 com segurança. Se quiser, já te explico os próximos passos.`)}`
      : null;
    const diasRestantes = Math.max(
      0,
      Math.ceil(
        (new Date("2026-05-29T23:59:59-03:00").getTime() - Date.now()) /
          86400000,
      ),
    );

    const notifications = await notifyLead({
      nome: data.nome,
      email: data.email,
      telefone: telefoneNormalizado,
      origem: data.origem || "site",
      servico: data.servico || "IRPF",
      mensagem: data.mensagem,
      diasRestantes,
      whatsappUrl: waLink,
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      emailSent: {
        lead: notifications.emailToUser,
        admin: notifications.emailToAdmin,
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
    console.error("Leads API error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
