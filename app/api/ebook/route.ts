import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

const schema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await prisma.ebookDownload.create({
      data: {
        nome: data.nome,
        email: data.email,
      },
    });

    // Send ebook PDF via email
    await resend.emails.send({
      from: "Consultoria IRPF NSB <noreply@irpf.qaplay.com.br>",
      to: data.email,
      subject: "Seu E-book Gratuito - Guia IRPF",
      html: `
        <h2>Ola, ${data.nome}!</h2>
        <p>Obrigado por baixar nosso Guia Completo do IRPF.</p>
        <p>Qualquer duvida sobre sua declaracao, estamos a disposicao:</p>
        <a href="https://wa.me/5511940825120">Falar pelo WhatsApp</a>
        <br><br>
        <p>Consultoria IRPF NSB</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados invalidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Ebook API error:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
