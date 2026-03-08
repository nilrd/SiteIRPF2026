import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  telefone: z.string().max(20).optional(),
  origem: z.string().max(100).optional(),
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
      },
    });

    // Notify admin with direct WA link
    if (process.env.ADMIN_EMAIL) {
      const waNum = (data.telefone || "").replace(/\D/g, "");
      const waLink = waNum
        ? `https://wa.me/55${waNum}?text=${encodeURIComponent(`Olá ${data.nome}! Vi que você se cadastrou no nosso site. Como posso ajudar com seu IRPF?`)}`
        : "#";

      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: `Novo lead: ${data.nome}`,
        html: `
          <h2>Novo lead capturado</h2>
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefone:</strong> ${data.telefone || "Nao informado"}</p>
          <p><strong>Origem:</strong> ${data.origem || "site"}</p>
          <br>
          <a href="${waLink}" style="background:#25D366;color:white;padding:12px 24px;text-decoration:none;font-weight:bold;">Abrir WhatsApp do Lead</a>
        `,
      });
    }

    return NextResponse.json({ success: true, id: lead.id });
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
