import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { notifyNewContato } from "@/lib/notify";

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
  servico: z.string().max(50).optional(),
  mensagem: z.string().max(2000).optional(),
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

    // Save to DB — Contato + Lead (para o painel admin contar corretamente)
    const [contato] = await Promise.all([
      prisma.contato.create({
        data: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || "",
          origem: "site",
          status: "novo",
          mensagem: `${data.servico ? `[${data.servico}] ` : ""}${data.mensagem || ""}`,
        },
      }),
      prisma.lead.create({
        data: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || "",
          origem: "site",
          status: "novo",
          mensagem: `${data.servico ? `[${data.servico}] ` : ""}${data.mensagem || ""}`,
        },
      }),
    ]);

    // Email — usa FROM_EMAIL do env (onboarding@resend.dev ou dominio verificado)
    const fromAddress = process.env.FROM_EMAIL || "IRPF NSB <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL || "nilson.brites@gmail.com";

    if (!process.env.FROM_EMAIL) {
      console.warn("[contato] FROM_EMAIL nao configurado. Usando fallback onboarding@resend.dev.");
    }
    if (!process.env.ADMIN_EMAIL) {
      console.warn("[contato] ADMIN_EMAIL nao configurado. Usando fallback nilson.brites@gmail.com.");
    }

    // EMAIL 1 — Notificação para o Nilson
    const adminEmailResult = await safeSendEmail({
      from: fromAddress,
      to: adminEmail,
      subject: `Novo contato via site — ${data.nome}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${data.nome}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.telefone || "Nao informado"}</p>
        <p><strong>Servico:</strong> ${data.servico || "Nao especificado"}</p>
        <p><strong>Mensagem:</strong> ${data.mensagem || "Nenhuma"}</p>
        <br>
        <a href="https://wa.me/55${(data.telefone || "").replace(/\D/g, "")}">Abrir WhatsApp</a>
      `,
    });
    if (!adminEmailResult.success) {
      console.error("[contato] Falha ao enviar email admin:", adminEmailResult.error);
    } else {
      console.log("[contato] Email admin enviado. ID:", adminEmailResult.id, "| to:", adminEmail);
    }

    // EMAIL 2 — Confirmação para o usuário
    // Nota: com onboarding@resend.dev, só envia para o email da conta Resend.
    // Quando domínio for verificado (FROM_EMAIL = noreply@irpf.qaplay.com.br), envia para qualquer email.
    const userEmailResult = await safeSendEmail({
      from: fromAddress,
      to: data.email,
      subject: "Recebemos seu contato — IRPF NSB",
      html: `
        <h2>Ola, ${data.nome}!</h2>
        <p>Recebemos sua mensagem e entraremos em contato em ate 24 horas.</p>
        <p>Se preferir atendimento imediato, fale conosco pelo WhatsApp:</p>
        <a href="https://wa.me/5511940825120">Abrir WhatsApp</a>
        <br><br>
        <p>Consultoria IRPF NSB</p>
      `,
    });
    if (!userEmailResult.success) {
      console.error("[contato] Falha ao enviar email confirmacao:", userEmailResult.error);
    } else {
      console.log("[contato] Email confirmacao enviado. ID:", userEmailResult.id);
    }

    const webhookResults = await notifyNewContato({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      origem: "site",
      servico: data.servico,
      mensagem: data.mensagem,
    });

    return NextResponse.json({
      success: true,
      id: contato.id,
      emailSent: {
        admin: adminEmailResult,
        user: userEmailResult,
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
    console.error("Contato API error:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
