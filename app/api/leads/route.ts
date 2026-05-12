import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { notifyNewLead } from "@/lib/notify";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z.string().max(20).optional(),
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
    const WA_DIRETO = "https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson%21%20Quero%20declarar%20meu%20IRPF%202026.";
    const primeiroNome = data.nome.split(" ")[0];
    const diasRestantes = Math.max(
      0,
      Math.ceil((new Date("2026-05-29T23:59:59-03:00").getTime() - Date.now()) / 86400000)
    );

    // Email de boas-vindas imediato para o LEAD (email #1 da sequência)
    const welcomeHtml = `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
  <tr><td align="center" style="padding:40px 20px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #222222;">
      <tr><td style="background:#C6FF00;padding:16px 32px;">
        <p style="margin:0;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:#000000;">Consultoria IRPF NSB — Nilson Brites</p>
      </td></tr>
      <tr><td style="padding:40px 32px;color:#F5F5F2;">
        <h2 style="font-size:26px;font-weight:900;text-transform:uppercase;color:#FFFFFF;margin:0 0 16px 0;">Olá, ${primeiroNome}! Recebemos seu contato.</h2>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">Obrigado por entrar em contato com a <strong style="color:#FFFFFF;">Consultoria IRPF NSB</strong>. Sou Nilson Brites, Analista Financeiro com mais de 10 anos de experiência exclusiva em declarações de Imposto de Renda.</p>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">Entrarei em contato pessoalmente. Enquanto isso, podemos começar agora pelo WhatsApp:</p>
        <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
          <tr><td style="background:#C6FF00;">
            <a href="${WA_DIRETO}" style="display:inline-block;padding:16px 32px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#000000;text-decoration:none;">Falar Agora pelo WhatsApp →</a>
          </td></tr>
        </table>
        <div style="background:#1A1A1A;border-left:3px solid #C6FF00;padding:16px 20px;margin:24px 0;">
          <p style="margin:0 0 8px 0;font-size:13px;color:#C6FF00;font-weight:900;text-transform:uppercase;letter-spacing:1px;">⏳ Prazo IRPF 2026 — faltam ${diasRestantes} dias</p>
          <p style="margin:0;font-size:13px;color:#AAAAAA;line-height:1.6;">O prazo termina em <strong style="color:#FFFFFF;">29 de maio de 2026</strong>. Entregas fora do prazo geram multa mínima de <strong style="color:#FF4444;">R$ 165,74</strong>.</p>
        </div>
        <h3 style="font-size:13px;color:#FFFFFF;text-transform:uppercase;letter-spacing:2px;margin:24px 0 12px 0;">O que você pode esperar:</h3>
        <ul style="padding-left:16px;margin:0 0 16px 0;color:#AAAAAA;font-size:13px;line-height:2.2;">
          <li>Análise personalizada do seu perfil tributário</li>
          <li>Declaração preparada com todas as deduções legais</li>
          <li>Entrega em até 24h após receber os documentos</li>
          <li>Transmissão oficial à Receita Federal com comprovante</li>
          <li>Suporte gratuito por 12 meses após a declaração</li>
        </ul>
        <p style="font-size:12px;color:#555555;margin:24px 0 0 0;">Você receberá um próximo email com a lista completa de documentos necessários.</p>
        <p style="font-size:13px;color:#AAAAAA;margin:16px 0 0 0;">Atenciosamente,<br/><strong style="color:#FFFFFF;">Nilson Brites</strong><br/><span style="color:#555555;font-size:11px;">Analista Financeiro — Especialista IRPF</span></p>
      </td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid #222222;">
        <p style="margin:0;font-size:10px;color:#555555;line-height:1.6;">Você recebe este email por ter solicitado atendimento em <a href="https://irpf.qaplay.com.br" style="color:#C6FF00;">irpf.qaplay.com.br</a>.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

    const fromLead = process.env.FROM_EMAIL || "Nilson Brites - IRPF <onboarding@resend.dev>";
    const fromAdmin = process.env.FROM_EMAIL || "IRPF NSB <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!process.env.FROM_EMAIL) {
      console.warn("[leads] FROM_EMAIL nao configurado. Usando fallback onboarding@resend.dev.");
    }
    if (!adminEmail) {
      console.warn("[leads] ADMIN_EMAIL nao configurado. Notificacao para admin sera ignorada.");
    }

    const leadEmailResult = await safeSendEmail({
      from: fromLead,
      to: data.email,
      subject: `${primeiroNome}, recebemos seu contato - IRPF 2026 (prazo: 29 de maio)`,
      html: welcomeHtml,
    });

    const adminEmailResult = adminEmail
      ? await safeSendEmail({
          from: fromAdmin,
          to: adminEmail,
          subject: `Novo lead: ${data.nome}`,
          html: `
            <h2>Novo lead capturado</h2>
            <p><strong>Nome:</strong> ${data.nome}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefone:</strong> ${data.telefone || "Nao informado"}</p>
            <p><strong>Servico:</strong> ${data.servico || "IRPF"}</p>
            <p><strong>Origem:</strong> ${data.origem || "site"}</p>
            ${data.mensagem ? `<p><strong>Mensagem:</strong> ${data.mensagem}</p>` : ""}
            <br>
            <a href="${waLink}" style="background:#25D366;color:white;padding:12px 24px;text-decoration:none;font-weight:bold;">Abrir WhatsApp do Lead</a>
          `,
        })
      : {
          success: false,
          skipped: true,
          id: null,
          error: "ADMIN_EMAIL nao configurado",
        };

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
