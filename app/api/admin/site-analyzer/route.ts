import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 90;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é um diretor de marketing digital sênior especializado em serviços financeiros tributários no Brasil, com 15+ anos de experiência gerenciando captação de clientes para consultores fiscais e contadores.

NEGÓCIO ANALISADO:
- Nome: Consultoria IRPF NSB — Nilson Brites, Analista Financeiro
- Serviço: Declaração IRPF (novas, atrasadas/anos anteriores, retificações, resolução de malha fina)
- Canal: 100% online, atende todo o Brasil
- WhatsApp: +55 11 94082-5120 | Site: irpf.qaplay.com.br
- Diferencial: atendimento personalizado, sem burocracia, rápido

CONTEXTO FISCAL (Março/Abril/Maio 2026):
- Temporada IRPF 2026: prazo 29 de maio de 2026
- Obrigatoriedade: rendimentos anuais > R$ 35.584,00
- Multa por atraso: R$ 165,74 mínimo ou 1% ao mês (máx 20%)
- Tabela vigente: 0% até R$ 2.259,20; 7,5% até R$ 2.826,65; 15% até R$ 3.751,05; 22,5% até R$ 4.664,68; 27,5% acima
- ~46 milhões de brasileiros obrigados a declarar

MISSÃO: Fazer análise PROFUNDA e ESTRATÉGICA. Identificar exatamente onde estão os problemas, as oportunidades imediatas de captação de clientes e o que precisa ser corrigido com urgência. Entregue insights acionáveis, não genéricos.

Retorne APENAS JSON válido e completo. Zero texto fora do JSON.`;

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const [posts, leads, contatos, totalLeads] = await Promise.all([
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
          readTime: true,
        },
        orderBy: { views: "desc" },
        take: 50,
      }),
      prisma.lead.groupBy({
        by: ["origem", "status", "tipoDecl"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.contato.count(),
      prisma.lead.count(),
    ]);

    const lowViewsPosts = posts.filter((p) => p.views < 10).length;
    const blogSummary = posts
      .map(
        (p) =>
          `"${p.title}" | views:${p.views} | tags:[${p.tags.slice(0, 3).join(",")}] | kws:[${p.keywords.slice(0, 3).join(",")}]`
      )
      .join("\n");

    const leadSummary = leads
      .map(
        (l) =>
          `origem:${l.origem} | tipo:${l.tipoDecl ?? "não informado"} | status:${l.status} | qtd:${l._count.id}`
      )
      .join("\n");

    const diasRestantes = Math.ceil(
      (new Date("2026-05-29").getTime() - Date.now()) / 86400000
    );

    const contexto = `=== DADOS DO SITE ===
Total de posts publicados: ${posts.length}
Posts com menos de 10 views: ${lowViewsPosts}
Post mais visto: "${posts[0]?.title ?? "nenhum"}" (${posts[0]?.views ?? 0} views)

=== POSTS (ordem por views) ===
${blogSummary || "Nenhum post publicado ainda"}

=== LEADS E CONVERSÕES ===
Total de leads captados: ${totalLeads}
${leadSummary || "Nenhum lead registrado ainda"}

=== CONTATOS VIA FORMULÁRIO ===
Total: ${contatos}

=== DATA DE HOJE ===
${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
Restam ${diasRestantes} dias para o prazo da IRPF 2026 (29/05/2026).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${contexto}

Analise profundamente e retorne JSON com EXATAMENTE esta estrutura:

{
  "resumoGeral": "string — parágrafo executivo: situação atual, maior oportunidade e risco imediato",
  "pontuacaoGeral": 0,
  "contextoSazonal": "string — contexto da temporada IRPF agora, urgência da janela de oportunidade, quantos dias restam e o que isso significa para o negócio",
  "funil": {
    "tofu": "string — análise do topo do funil: alcance, blog, SEO, consciência de marca",
    "mofu": "string — análise do meio: engajamento, conteúdo educativo, nurturing",
    "bofu": "string — análise do fundo: conversão, CTAs, formulário, WhatsApp, processo de venda",
    "gaps": ["string — problema específico e crítico encontrado no funil"]
  },
  "problemas": [
    {
      "area": "string — ex: SEO, Conversão, Conteúdo, UX, Técnico, Captação",
      "titulo": "string — título conciso do problema",
      "descricao": "string — descrição detalhada do problema, causa raiz e impacto real nos negócios",
      "prioridade": "alta",
      "impactoEstimado": "string — ex: pode estar perdendo 5-10 clientes/semana por isso",
      "promptCorrecao": "string — prompt COMPLETO e ESPECÍFICO para GitHub Copilot resolver o problema, incluindo o que criar/modificar"
    }
  ],
  "oportunidadesAds": [
    {
      "plataforma": "string",
      "publico": "string — perfil detalhado do público ideal para essa plataforma",
      "dor": "string — dor específica que esse público sente e que o serviço resolve",
      "urgencia": "string — por que agir agora (contexto sazonal, prazo, consequência de não agir)",
      "hookPrincipal": "string — headline de altíssima conversão, direto na dor",
      "copyCurta": "string — copy 125 chars (formato Meta)",
      "copyMedia": "string — copy 250 chars com dor + urgência + CTA",
      "storytelling": "string — copy longa emocional 3-5 parágrafos curtos para Facebook/Instagram",
      "keywordsGoogle": ["string"],
      "orcamentoSugerido": "string — investimento diário sugerido e CPL estimado",
      "formatoRecomendado": "string — formato de anúncio que melhor funciona para este público"
    }
  ],
  "postsParaCriar": [
    {
      "titulo": "string — título com keyword principal incluída, SEO-otimizado",
      "keyword": "string — keyword principal",
      "volumeEstimado": "string — potencial de tráfego mensal estimado",
      "intencao": "string — intenção de busca e momento do funil",
      "urgencia": "alta",
      "angulo": "string — ângulo editorial único que diferencia do conteúdo genérico de outros sites",
      "cta": "string — CTA específico para converter visitante em lead neste post"
    }
  ],
  "acoesPrioritarias": ["string — ação específica com o que fazer, onde e impacto esperado"],
  "promptsIA": {
    "melhorarCTAs": "string — prompt completo e detalhado para GitHub Copilot melhorar todos os CTAs do site para aumentar conversão",
    "criarLandingPage": "string — prompt completo para criar landing page de alta conversão focada em captar leads IRPF 2026",
    "emailMarketing": "string — prompt completo para criar sequência de 5 emails de nutrição para leads captados"
  }
}`,
        },
      ],
      temperature: 0.25,
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(
      completion.choices[0]?.message?.content ?? "{}"
    );

    // Salvar no banco
    try {
      await prisma.analise.create({
        data: {
          resumo: String(analysis.resumoGeral ?? "").slice(0, 2000),
          dados: JSON.stringify(analysis),
          totalPosts: posts.length,
          totalLeads,
        },
      });
    } catch (dbErr) {
      console.error("[site-analyzer] DB save error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      analysis,
      meta: { totalPosts: posts.length, totalLeads },
    });
  } catch (err) {
    console.error("[site-analyzer]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 }
    );
  }
}

