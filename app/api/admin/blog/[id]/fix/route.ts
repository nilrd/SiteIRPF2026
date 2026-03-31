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

    const systemPrompt = `Você é editor sênior de conteúdo tributário brasileiro para o blog do Nilson Brites.
Corrija o post com base no feedback do administrador.

REGRAS OBRIGATÓRIAS:
- Idioma: 100% português do Brasil (pt-BR), sem trechos em inglês
- Manter foco em IRPF 2026 e contexto brasileiro
- Preservar HTML válido no campo content
- Melhorar clareza, precisão e conversão sem inventar leis ou números
- Não remover CTAs do WhatsApp, apenas ajustar se necessário
- Não alterar o slug (será preservado pelo sistema)

Retorne APENAS JSON válido com este formato:
{
  "title": "...",
  "summary": "...",
  "content": "...",
  "tags": ["..."],
  "keywords": ["..."],
  "metaTitle": "...",
  "metaDesc": "...",
  "readTime": 8,
  "imageAlt": "..."
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
      `Tarefa: devolva uma versão corrigida completa em JSON estrito.`;

    const llm = await callWithFallback(systemPrompt, userPrompt, 7000, {
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

    return NextResponse.json({
      success: true,
      model: llm.model,
      corrected,
    });
  } catch (err) {
    console.error("[admin/blog/fix POST]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
