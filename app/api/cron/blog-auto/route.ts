import { NextResponse } from "next/server";
import { generateBlogPost, saveBlogPost, KEYWORD_CLUSTERS } from "@/lib/blog-engine";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pick 2 random non-repeating cluster indexes
    const totalClusters = KEYWORD_CLUSTERS.length;
    const idx1 = Math.floor(Math.random() * totalClusters);
    let idx2 = Math.floor(Math.random() * (totalClusters - 1));
    if (idx2 >= idx1) idx2++;

    // Generate 2 posts in parallel
    const [post1, post2] = await Promise.all([
      generateBlogPost(idx1),
      generateBlogPost(idx2),
    ]);

    // Save to DB
    const [saved1, saved2] = await Promise.all([
      saveBlogPost(post1),
      saveBlogPost(post2),
    ]);

    // Notify admin via email
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: `2 novos posts publicados automaticamente — ${new Date().toLocaleDateString("pt-BR")}`,
        html: `
          <h2>Posts publicados automaticamente no blog</h2>
          <p><strong>1.</strong> ${saved1.title}</p>
          <p><strong>2.</strong> ${saved2.title}</p>
          <p>Os artigos ja estao disponiveis em <a href="https://irpf.qaplay.com.br/blog">irpf.qaplay.com.br/blog</a>.</p>
          <p>Se precisar editar ou despublicar algum, acesse o painel administrativo.</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      posts: [
        { id: saved1.id, title: saved1.title },
        { id: saved2.id, title: saved2.title },
      ],
    });
  } catch (error) {
    console.error("Blog cron error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog posts" },
      { status: 500 }
    );
  }
}
