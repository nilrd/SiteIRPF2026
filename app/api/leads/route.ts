import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAdminNotificationEmail, buildLeadWelcomeEmail } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { notifyNewLead } from "@/lib/notify";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z.string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .refine(
      (tel) => /\d{10,}/g.test(tel.replace(/\D/g, "")),
      "Telefone inválido. Use formato (XX) 9XXXX-XXXX"
    ),
  origem: z.string().max(100).optional(),
  servico: z.enum(["IRPF", "MEI", "GERAL"]).optional().default("IRPF"),
  mensagem: z.string().max(500).optional(),
});

type SafeEmailResult = {
  success: boolean;
  skipped: boolean;
  id: string | null;
  error: string | null;
};

async function safeSendEmail(params: Parameters<typeof resend.emails.send>[0]): Promise<SafeEmailResult> {
  try {
    const { data, error } = await resend.emails.send(params);
    if (error) {
      return {
        success: false,
        skipped: false,
        id: null,
        error: typeof error === "string" ? error : JSON.stringify(error),
      };
    }

    return {
      success: true,
      skipped: false,
      id: data?.id ?? null,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      skipped: false,
      id: null,
      error: err instanceof Error ? err.message : "Erro desconhecido ao enviar email",
    };
  }
}

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
      : "#";
    const primeiroNome = data.nome.split(" ")[0];
    const diasRestantes = Math.max(
      0,
      Math.ceil((new Date("2026-05-29T23:59:59-03:00").getTime() - Date.now()) / 86400000)
    );

    const fromLead = process.env.FROM_EMAIL || "Nilson Brites - IRPF <onboarding@resend.dev>";
    const fromAdmin = process.env.FROM_EMAIL || "IRPF NSB <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL || "nilson.brites@gmail.com";

    if (!process.env.FROM_EMAIL) {
      console.warn("[leads] FROM_EMAIL nao configurado. Usando fallback onboarding@resend.dev.");
    }
    if (!process.env.ADMIN_EMAIL) {
      console.warn("[leads] ADMIN_EMAIL nao configurado. Usando fallback nilson.brites@gmail.com.");
    }

    const leadEmailResult = await safeSendEmail({
      from: fromLead,
      to: data.email,
      subject: `${primeiroNome}, recebemos seu contato - IRPF 2026 (prazo: 29 de maio)`,
      html: buildLeadWelcomeEmail({
        primeiroNome,
        diasRestantes,
      }),
    });

    const adminEmailResult = await safeSendEmail({
      from: fromAdmin,
      to: adminEmail,
      subject: `Novo lead: ${data.nome}`,
      html: buildAdminNotificationEmail({
        kind: "lead",
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        origem: data.origem || "site",
        servico: data.servico || "IRPF",
        mensagem: data.mensagem,
        whatsappUrl: waLink === "#" ? null : waLink,
      }),
    });

    const webhookResults = await notifyNewLead({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      origem: data.origem || "site",
      servico: data.servico || "IRPF",
      mensagem: data.mensagem,
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      emailSent: {
        lead: leadEmailResult,
        admin: adminEmailResult,
      },
      webhookSent: webhookResults,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados invalidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Leads API error:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
