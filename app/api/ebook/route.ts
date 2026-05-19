import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend, getFromEmail } from "@/lib/resend";
import { buildEbookEmailHtml, buildEbookEmailText } from "@/lib/email-templates";

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

    await resend.emails.send({
      from: getFromEmail(),
      to: data.email,
      subject: "Seu Guia IRPF chegou — acesse o material completo",
      html: buildEbookEmailHtml(data.nome),
      text: buildEbookEmailText(data.nome),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados invalidos", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Ebook API error:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 },
    );
  }
}
