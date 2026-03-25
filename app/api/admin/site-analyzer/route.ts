import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Coleta dados do site em paralelo
    const [posts, leads, contatos] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        select: {
          title: true,
          slug: true,
          summary: true,
          tags: true,
          keywords: true,
          views: true,
          createdAt: true,
        },
        orderBy: { views: "desc" },
        take: 30,
      }),
      prisma.lead.groupBy({
        by: ["origem", "status", "tipoDecl"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.contato.count(),
    ]);

    const totalLeads = await prisma.lead.count();

    // Monta resumo para o GPT-4o
    const blogSummary = posts
      .map((p) => `- "${p.title}" (${p.views} views) | tags: ${p.tags.join(", ")} | keywords: ${p.keywords.join(", ")}`)
      .join("\n");

    const leadSummary = leads
      .map((l) => `- Origem: ${l.origem} | Tipo: ${l.tipoDecl ?? "não informado"} | Status: ${l.status} | Qtd: ${l._count.id}`)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em marketing digital para serviços financeiros no Brasil, com foco em declaração do IRPF.
Analise os dados do site e retorne um relatório JSON estruturado com análise estratégica.

CONTEXTO DO NEGÓCIO:
- Serviço: Declaração IRPF (novas, atrasadas, retificações)
- Atendimento: 100% online, todo Brasil
- WhatsApp: +55 11 94082-5120
- Site: irpf.qaplay.com.br
- Perfil do cliente: Pessoas físicas, 25-60 anos, que precisam declarar IR

RETORNE SOMENTE JSON VÁLIDO com esta estrutura exata:
{
  "resumoGeral": "string — 2-3 frases sobre o estado atual do site",
  "problemas": [
    {
      "area": "SEO|Conteúdo|Conversão|Blog",
      "descricao": "string — problema identificado",
      "prioridade": "alta|media|baixa",
      "promptCorrecao": "string — prompt pronto para colar no Copilot e corrigir"
    }
  ],
  "oportunidadesAds": [
    {
      "plataforma": "Google Ads|Facebook Ads|LinkedIn Ads|Instagram Ads",
      "publico": "string — público-alvo específico",
      "hookPrincipal": "string — frase de impacto para o anúncio (max 30 chars para Google, 125 para Meta)",
      "dor": "string — dor/problema que o anúncio resolve",
      "copyCurta": "string — texto curto do anúncio",
      "copyMedia": "string — texto médio do anúncio",
      "keywordsGoogle": ["string"] // apenas se plataforma for Google Ads
    }
  ],
  "postsParaCriar": [
    {
      "titulo": "string — título do post sugerido",
      "keyword": "string — keyword principal",
      "intencao": "string — por que esse post atrai clientes",
      "urgencia": "alta|media|baixa"
    }
  ],
  "acoesPrioritarias": ["string"] // lista de 5 ações para fazer essa semana
}`,
        },
        {
          role: "user",
          content: `Analise o site irpf.qaplay.com.br com base nos dados abaixo:

POSTS PUBLICADOS (${posts.length} posts, ordenados por views):
${blogSummary || "Nenhum post publicado ainda"}

LEADS CAPTADOS (total: ${totalLeads}):
${leadSummary || "Nenhum lead captado ainda"}

CONTATOS RECEBIDOS: ${contatos}

Identifique:
1. Problemas de SEO, conteúdo ou conversão (gere prompts prontos para eu corrigir)
2. Oportunidades de ads para cada plataforma baseadas nos dados reais de leads
3. Posts que devo criar para atrair mais clientes
4. As 5 ações mais urgentes desta semana`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const analysis = JSON.parse(raw);

    return NextResponse.json({ success: true, analysis, meta: { totalPosts: posts.length, totalLeads } });
  } catch (err) {
    console.error("[site-analyzer]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
