import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z.string().max(20).optional(),
  servico: z.string().max(50).optional(),
  mensagem: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Save to DB
    const contato = await prisma.contato.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone || "",
        mensagem: `${data.servico ? `[${data.servico}] ` : ""}${data.mensagem || ""}`,
      },
    });

    // Email admin — usa FROM_EMAIL do env ou onboarding@resend.dev (plano free)
    const fromAddress = process.env.FROM_EMAIL || "IRPF NSB <onboarding@resend.dev>";
    const isTestDomain = fromAddress.includes("resend.dev");
    const adminEmail = process.env.ADMIN_EMAIL;

    if (adminEmail) {
      const { data: adminData, error: adminError } = await resend.emails.send({
        from: fromAddress,
        to: adminEmail,
        subject: `Novo contato: ${data.nome}`,
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
      if (adminError) {
        console.error("[contato] Falha ao enviar email admin:", JSON.stringify(adminError));
      } else {
        console.log("[contato] Email admin enviado. ID:", adminData?.id);
      }
    } else {
      console.warn("[contato] ADMIN_EMAIL não configurada — email de notificação não enviado.");
    }

    // Confirmation email to user — só funciona com domínio verificado no Resend
    // Com onboarding@resend.dev, Resend só permite enviar para o email da conta
    if (!isTestDomain) {
      const { data: userEmailData, error: userEmailError } = await resend.emails.send({
        from: fromAddress,
        to: data.email,
        subject: "Recebemos seu contato - Consultoria IRPF NSB",
        html: `
          <h2>Ola, ${data.nome}!</h2>
          <p>Recebemos sua mensagem e entraremos em contato em ate 24 horas.</p>
          <p>Se preferir atendimento imediato, fale conosco pelo WhatsApp:</p>
          <a href="https://wa.me/5511940825120">Abrir WhatsApp</a>
          <br><br>
          <p>Consultoria IRPF NSB</p>
        `,
      });
      if (userEmailError) {
        console.error("[contato] Falha ao enviar email confirmação:", JSON.stringify(userEmailError));
      } else {
        console.log("[contato] Email confirmação enviado. ID:", userEmailData?.id);
      }
    } else {
      console.log("[contato] Email confirmação ao usuário DESABILITADO (onboarding@resend.dev só envia para conta própria). Verifique domínio em resend.com/domains.");
    }

    return NextResponse.json({ success: true, id: contato.id });
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
