import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callWithFallback } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";

function stripHtmlAndUrls(input: string): string {
  return input
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWordHits(text: string, words: string[]): number {
  let hits = 0;
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = text.match(re);
    hits += matches ? matches.length : 0;
  }
  return hits;
}

function isPortugueseContent(sample: string): boolean {
  const text = stripHtmlAndUrls(sample).toLowerCase();
  const portugueseWords = [
    "de", "para", "com", "que", "nao", "não", "voce", "você", "seu", "sua",
    "declaracao", "declaração", "imposto", "renda", "receita", "prazo", "deducao",
    "dedução", "educacao", "educação", "saude", "saúde", "restituicao", "restituição",
  ];
  const englishWords = [
    "the", "and", "for", "with", "that", "this", "from", "into", "your", "you",
    "income", "tax", "deduction", "deadline", "refund", "guide", "article",
  ];

  const pt = countWordHits(text, portugueseWords);
  const en = countWordHits(text, englishWords);
  return pt >= 12 && pt >= en * 1.2;
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const issue = cleanString(body?.issue);
    if (!issue || issue.length < 8) {
      return NextResponse.json(
        { error: "Descreva melhor o que está errado (mínimo 8 caracteres)." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const systemPrompt = `Você é o ghostwriter sênior do Nilson Brites — Analista Financeiro, 10+ anos em IRPF, atendimento 100% online para todo o Brasil.

Sua tarefa é REESCREVER COMPLETAMENTE o post abaixo com base no feedback do administrador.

REGRAS ABSOLUTAS:
1. IDIOMA: 100% português do Brasil (pt-BR) em TODOS os campos — título, resumo, conteúdo, tags, keywords, metaTitle, metaDesc, imageAlt. ZERO palavras em inglês no texto do artigo.
2. REESCREVA TUDO: título, resumo e o artigo completo do zero. Não reaproveite nada que viole o feedback.
3. CONTEÚDO MÍNIMO: o campo "content" deve ter no mínimo 2.500 palavras em HTML válido.
4. FOCO: o artigo deve tratar exclusivamente de IRPF 2026 / imposto de renda no Brasil.
5. DADOS OFICIAIS: use apenas dados reais — tabela IRPF 2026 (até R$ 2.428,80 isento; 7,5% / 15% / 22,5% / 27,5%), prazo 23/03 a 29/05/2026, multa mínima R$ 165,74. Nunca invente leis ou valores.
6. ESTRUTURA HTML: use h2 (como perguntas), h3, p, ul, li, table, strong. Parágrafos curtos (máx 4 linhas).
7. CTAs obrigatórios: mantenha os blocos HTML de CTA para WhatsApp (wa.me/5511940825120).
8. Tom: direto, humano, empático — como um consultor experiente falando com o cliente.
9. Não altere o slug (preservado pelo sistema).

Retorne APENAS JSON válido (sem markdown, sem explicações fora do JSON):
{
  "title": "título em pt-BR, máx 65 caracteres, específico ao tema",
  "summary": "resumo em pt-BR, 150-160 caracteres, com dado numérico",
  "content": "HTML completo do artigo reescrito em pt-BR, mínimo 2500 palavras",
  "tags": ["tag1 pt-BR", "tag2 pt-BR"],
  "keywords": ["keyword-principal", "keyword-secundaria"],
  "metaTitle": "meta título pt-BR para Google, máx 60 caracteres",
  "metaDesc": "meta descrição pt-BR, máx 160 caracteres, com dado numérico",
  "readTime": 10,
  "imageAlt": "descrição da imagem em pt-BR para acessibilidade"
}`;

    const userPrompt = `FEEDBACK DO ADMIN (o que está errado):\n${issue}\n\n` +
      `POST ATUAL:\n` +
      `Título: ${post.title}\n` +
      `Resumo: ${post.summary ?? ""}\n` +
      `Tags: ${(post.tags ?? []).join(", ")}\n` +
      `Keywords: ${(post.keywords ?? []).join(", ")}\n` +
      `MetaTitle: ${post.metaTitle ?? ""}\n` +
      `MetaDesc: ${post.metaDesc ?? ""}\n` +
      `Tempo de leitura: ${post.readTime}\n` +
      `ImageAlt: ${post.imageAlt ?? ""}\n\n` +
      `HTML atual:\n${post.content}\n\n` +
      `TAREFA: Reescreva COMPLETAMENTE o post acima em português do Brasil (pt-BR), corrigindo TODOS os problemas indicados no feedback. O campo "content" deve ter no mínimo 2.500 palavras. Devolva apenas o JSON estrito, sem backticks ou explicações fora do JSON.`;

    const llm = await callWithFallback(systemPrompt, userPrompt, 14000, {
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const raw = llm.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const corrected = {
      title: cleanString(parsed.title) || post.title,
      summary: cleanString(parsed.summary) || post.summary || "",
      content: cleanString(parsed.content) || post.content,
      tags: cleanStringArray(parsed.tags),
      keywords: cleanStringArray(parsed.keywords),
      metaTitle: cleanString(parsed.metaTitle),
      metaDesc: cleanString(parsed.metaDesc),
      readTime: Number.isFinite(Number(parsed.readTime))
        ? Math.max(1, Math.min(60, Number(parsed.readTime)))
        : post.readTime,
      imageAlt: cleanString(parsed.imageAlt) || post.imageAlt || post.title,
    };

    const sample = `${corrected.title}\n${corrected.summary}\n${corrected.content}`.slice(0, 12000);
    if (!isPortugueseContent(sample)) {
      return NextResponse.json(
        { error: "A correção foi rejeitada: IA retornou conteúdo fora de pt-BR." },
        { status: 422 }
      );
    }

    const modelFriendly = llm.model.startsWith("gemini") ? "Gemini" : "Groq Llama";

    return NextResponse.json({
      success: true,
      model: modelFriendly,
      corrected,
    });
  } catch (err) {
    console.error("[admin/blog/fix POST]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
