import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyLead } from "@/lib/notification-hub";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .refine(
      (tel) => /\d{10,}/g.test(tel.replace(/\D/g, "")),
      "Telefone inválido. Use formato (XX) 9XXXX-XXXX",
    ),
  origem: z.string().max(100).optional(),
  servico: z.enum(["IRPF", "MEI", "GERAL"]).optional().default("IRPF"),
  mensagem: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone || "",
        origem: data.origem || "site",
        servico: data.servico || "IRPF",
        mensagem: data.mensagem || "",
        emailSeqStep: 1,
        emailSeqAt: new Date(),
      },
    });

    const waNum = (data.telefone || "").replace(/\D/g, "");
    const waLink = waNum
      ? `https://wa.me/55${waNum}?text=${encodeURIComponent(`Olá ${data.nome}! Vi que você se cadastrou no nosso site. Como posso ajudar com seu IRPF?`)}`
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
      telefone: data.telefone,
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
