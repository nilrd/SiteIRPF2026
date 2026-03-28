import { NextResponse } from "next/server";
import { generateBlogPost, saveBlogPost, ALL_CLUSTERS } from "@/lib/blog-engine";
import { resend } from "@/lib/resend";
import { feedBrainFromOfficialSources, isKeywordRecent, markKeywordUsed } from "@/lib/knowledge-brain";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro: permite até 60s para geração via Groq

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Alimenta o cérebro com fontes oficiais antes de gerar qualquer post.
    // Respeita TTL — não re-busca se dados ainda válidos.
    console.log("[Cron] Alimentando cérebro com fontes oficiais...");
    await feedBrainFromOfficialSources();

    // Seleciona cluster aleatório — evita repetir keyword usada nos últimos 7 dias
    let idx = Math.floor(Math.random() * ALL_CLUSTERS.length);
    for (let attempt = 0; attempt < 5; attempt++) {
      const primary = ALL_CLUSTERS[idx % ALL_CLUSTERS.length]?.primary;
      if (!primary || !(await isKeywordRecent(primary, 7))) break;
      console.log(`[Cron] Keyword recente, tentando outro cluster: ${primary}`);
      idx = Math.floor(Math.random() * ALL_CLUSTERS.length);
    }
    const clusterName = ALL_CLUSTERS[idx % ALL_CLUSTERS.length]?.primary ?? "irpf";
    const post = await generateBlogPost(idx);
    const saved = await saveBlogPost(post);
    // Registra keyword usada para evitar repetição futura
    void markKeywordUsed(post.keyword, clusterName, saved.id);

    // Notifica admin por email
    if (process.env.ADMIN_EMAIL) {
      const statusTag = saved.published ? "✅ PUBLICADO" : "⚠️ RETIDO PARA REVISÃO — não publicado";
      let reviewInfo = "";
      if (!saved.published && saved.reviewJson) {
        try {
          const rv = JSON.parse(saved.reviewJson) as {
            nivel_risco?: string;
            resumo?: string;
            itens_de_risco?: string[];
          };
          reviewInfo = `
            <p><strong>Nível de risco:</strong> ${rv.nivel_risco || "?"}</p>
            <p><strong>Motivo:</strong> ${rv.resumo || "?"}</p>
            ${rv.itens_de_risco?.length ? `<ul>${rv.itens_de_risco.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
            <p>Acesse o painel para revisar e publicar manualmente.</p>`;
        } catch { /* JSON inválido — ignora */ }
      }
      await resend.emails.send({
        from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
        to: process.env.ADMIN_EMAIL,
        subject: `[${saved.published ? "Publicado" : "REVISÃO"}] Post gerado — ${new Date().toLocaleDateString("pt-BR")}`,
        html: `
          <h2>${statusTag}</h2>
          <p><strong>${saved.title}</strong></p>
          ${saved.published
            ? `<p>Disponivel em: <a href="https://irpf.qaplay.com.br/blog/${saved.slug}">irpf.qaplay.com.br/blog/${saved.slug}</a></p>`
            : `<p>Post salvo como rascunho aguardando revisão humana.</p>${reviewInfo}`}
          <p>Para gerenciar, acesse o painel administrativo.</p>
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
