import { NextResponse } from "next/server";
import { generateBlogPost, saveBlogPost, ALL_CLUSTERS } from "@/lib/blog-engine";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro: permite até 60s para geração via Groq

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Seleciona cluster aleatório do pool completo (IRPF + finanças)
    const idx = Math.floor(Math.random() * ALL_CLUSTERS.length);
    const post = await generateBlogPost(idx);
    const saved = await saveBlogPost(post);

    // Notifica admin por email
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: `Novo post publicado — ${new Date().toLocaleDateString("pt-BR")}`,
        html: `
          <h2>Post publicado automaticamente</h2>
          <p><strong>${saved.title}</strong></p>
          <p>Disponivel em: <a href="https://irpf.qaplay.com.br/blog/${saved.slug}">irpf.qaplay.com.br/blog/${saved.slug}</a></p>
          <p>Para revisar ou despublicar, acesse o painel administrativo.</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      post: { id: saved.id, title: saved.title, slug: saved.slug },
    });
  } catch (error) {
    console.error("Blog cron error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
