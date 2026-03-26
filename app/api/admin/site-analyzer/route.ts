import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 90;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é um diretor de marketing digital sênior e copywriter de resposta direta, com 20+ anos de experiência em conversão de leads para serviços financeiros no Brasil.

NEGÓCIO ANALISADO:
- Nome: Nilson Brites — Analista Financeiro, especialista IRPF
- Serviço: Declaração IRPF (novas, atrasadas/anos anteriores, retificações, malha fina)
- Canal: 100% online, todo Brasil
- WhatsApp: +55 11 94082-5120 | Site: irpf.qaplay.com.br

CONTEXTO FISCAL IRPF 2026:
- Prazo: 29 de maio de 2026. Data atual: 25/03/2026. Restam ~65 dias.
- Obrigatoriedade: rendimentos anuais > R$ 35.584,00
- Multa: R$ 165,74 mínimo OU 1% ao mês sobre imposto devido (máx 20%)
- Tabela: 0% ≤ R$2.259,20 | 7,5% até R$2.826,65 | 15% até R$3.751,05 | 22,5% até R$4.664,68 | 27,5% acima
- ~46 milhões de contribuintes obrigados
- Declarações atrasadas (anos anteriores): multa acumulada + CPF irregular

REGRAS OBRIGATÓRIAS DE QUALIDADE:
1. NUNCA entregue copy genérica. Cada texto deve mencionar datas reais, valores reais, o nome do serviço.
2. Cada campo de texto narrativo deve ter MÍNIMO 150 palavras quando for descrição/copy longa.
3. oportunidadesAds: cada oportunidade deve ter copy 100% pronta para colar no gerenciador de anúncios — headlines já escritas, descrições prontas, storytelling completo com 4+ parágrafos.
4. problemas.promptCorrecao: deve ser um prompt de engenharia detalhado (200+ palavras) especificando exatamente qual arquivo alterar, qual código criar e qual resultado esperado.
5. postsParaCriar: cada post deve ter esboço real dos H2s, intro já escrita, meta description pronta.
6. promptsIA: cada prompt deve ter 300+ palavras e ser diretamente utilizável no GitHub Copilot sem nenhuma edição adicional.
7. Identifique MÍNIMO 5 problemas, MÍNIMO 4 oportunidades de ads em plataformas diferentes, MÍNIMO 7 posts para criar.

Retorne APENAS JSON válido. Zero texto fora do JSON.`;

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

Analise profundamente e retorne JSON com EXATAMENTE esta estrutura.

REGRAS DE QUALIDADE ABSOLUTAS para esta resposta:
- oportunidadesAds.storytelling: mínimo 4 parágrafos, cada parágrafo com 40-80 palavras. Copy emocional pronta para colar no Meta/Google Ads.
- oportunidadesAds.manchetes: EXATAMENTE 3 headlines. Cada uma com abordagem diferente: (1) urgência de prazo, (2) dor/medo, (3) benefício/facilidade. Máx 30 chars cada.
- oportunidadesAds.descricoes: EXATAMENTE 2 descrições. Máx 90 chars cada. Prontas para colar no gerenciador.
- oportunidadesAds.configuracaoSegmentacao: listar interesses reais disponíveis na plataforma (não inventar). Mínimo 6 interesses.
- postsParaCriar: MÍNIMO 7 posts. Cada post com esbocoH2 (3 subtítulos reais), metaDescricao (155 chars max, pronta para uso), introSugerida (100-130 palavras prontas para iniciar o post).
- problemas.promptCorrecao: mínimo 200 palavras cada, especificando arquivo, componente, código e resultado esperado.
- promptsIA.*: mínimo 300 palavras cada, prompt diretamente utilizável no GitHub Copilot sem nenhuma edição.
- Tudo em português brasileiro. Zero inglesismos desnecessários.

{
  "resumoGeral": "parágrafo executivo: situação atual, maior oportunidade e risco imediato para o negócio de Nilson Brites na temporada IRPF 2026",
  "pontuacaoGeral": 0,
  "contextoSazonal": "análise detalhada da temporada IRPF agora: quantos dias restam (calcule a partir de 25/03/2026), janela de oportunidade, comportamento do consumidor nesse momento, o que ocorre se o negócio não agir",
  "funil": {
    "tofu": "análise detalhada do topo do funil com base nos dados: alcance, posts mais vistos, lacunas de SEO, keywords que deveriam ter conteúdo mas não têm",
    "mofu": "análise do meio do funil: existe nurturing? os leads captados recebem follow-up? o conteúdo educa e aquece? O que está faltando?",
    "bofu": "análise crítica do fundo: taxa de conversão estimada, eficácia dos CTAs, processo de venda via WhatsApp, o que impede a conversão final",
    "gaps": ["gap específico com impact real no funil de vendas"]
  },
  "problemas": [
    {
      "area": "SEO | Conversão | Conteúdo | UX | Técnico | Captação | Blogs",
      "titulo": "título em até 8 palavras",
      "descricao": "descrição detalhada: qual é o problema exato, por que está acontecendo, qual o impacto real em número de clientes perdidos ou oportunidades desperdiçadas",
      "prioridade": "alta | media | baixa",
      "impactoEstimado": "estimativa concreta: ex: pode estar perdendo 5-10 leads/semana por este problema específico",
      "promptCorrecao": "PROMPT COMPLETO para GitHub Copilot corrigir o problema. Especifique: (1) arquivo ou rota a criar/editar, (2) componente React a implementar, (3) lógica de negócio necessária, (4) resultado final esperado após a correção. Mínimo 200 palavras."
    }
  ],
  "oportunidadesAds": [
    {
      "plataforma": "Meta Ads (Facebook + Instagram) | Google Search Ads | Google Display | YouTube Ads | TikTok Ads",
      "publico": "perfil completo: faixa etária, situação trabalhista, renda estimada, nível de urgência com IRPF, comportamento online desta persona",
      "dor": "dor emocional específica desta persona: o que ela sente quando pensa no IR, qual o maior medo real, o que a faz postergar",
      "urgencia": "urgência contextual: prazo restante, consequência concreta de não agir (multa em R$, CPF irregular, etc.), janela que se fecha",
      "hookPrincipal": "frase de abertura de altíssima conversão que corta o scroll e atinge a dor na ferida aberta",
      "manchetes": [
        "headline urgência (ex: IRPF 2026: Declare Antes de 29/05)",
        "headline dor/medo (ex: CPF Bloqueado por Não Declarar?)",
        "headline benefício (ex: IR Online Sem Filas — 100% Pronto)"
      ],
      "descricoes": [
        "descrição 1 máx 90 chars — foco na solução e credencial",
        "descrição 2 máx 90 chars — foco no prazo e no risco de não agir"
      ],
      "copyCurta": "copy de 125 chars para stories/posts pagos com CTA explícito",
      "copyMedia": "copy de 250 chars com dor + contexto sazonal + prova social implícita + CTA com WhatsApp",
      "storytelling": "copy longa emocional para feed Facebook/Instagram. 4 parágrafos: (1) abertura com a dor real cotidiana, (2) agravamento: o que acontece se não agir, (3) virada: como é simples com o serviço, (4) CTA direto com WhatsApp. Cada parágrafo 50-70 palavras.",
      "configuracaoSegmentacao": {
        "idadeMin": 0,
        "idadeMax": 0,
        "genero": "Todos | Feminino | Masculino",
        "localizacao": "segmentação geográfica específica por plataforma",
        "interesses": ["interesse real existente na plataforma — mínimo 6"],
        "comportamentos": ["comportamento real para segmentar nesta plataforma — mínimo 3"],
        "publicoNegativo": ["o que excluir para não desperdiçar budget — mínimo 3 exclusões"]
      },
      "keywordsGoogle": ["keyword real de busca no Google — mínimo 8 para Google Ads ou Search"],
      "orcamentoFaseTeste": "valor diário × 7-14 dias com total = quanto investir para testar e validar CPL",
      "orcamentoFaseEscala": "quando e quanto escalar: gatilho de CPL + valor diário na fase de escala",
      "formatoRecomendado": "formato específico com justificativa: por que este formato supera outros para este público"
    }
  ],
  "postsParaCriar": [
    {
      "titulo": "título com keyword principal inclusa, otimizado para CTR no Google",
      "keyword": "keyword principal exata de busca",
      "volumeEstimado": "estimativa realista de buscas/mês no Brasil",
      "intencao": "informacional | transacional | navegacional | comparativa — em qual etapa do funil está quem busca isso",
      "urgencia": "alta | media | baixa",
      "angulo": "ângulo único que diferencia — não é o mesmo artigo de todo site de contabilidade",
      "esbocoH2": [
        "H2 subtítulo 1 — seção principal do post",
        "H2 subtítulo 2 — segunda seção lógica",
        "H2 subtítulo 3 — seção de conversão/CTA"
      ],
      "metaDescricao": "meta description SEO pronta, 120-155 chars, com keyword e CTA implícito",
      "introSugerida": "primeiro parágrafo do post já escrito, 100-130 palavras, conversacional, com a keyword, contexto de prazo e gancho para continuar lendo",
      "cta": "CTA específico dentro do post para converter visitante em lead via WhatsApp"
    }
  ],
  "acoesPrioritarias": ["ação específica: O QUÊ fazer + ONDE (qual página/rota) + resultado esperado. Ordenadas por impacto imediato nos próximos 7 dias."],
  "promptsIA": {
    "melhorarCTAs": "prompt completo 300+ palavras para GitHub Copilot auditar e reescrever todos os CTAs do site irpf.qaplay.com.br. Especifique: quais arquivos editar, qual copywriting usar em cada seção (hero, blog, formulário, footer), como criar urgência de prazo IRPF 2026 nos botões, qual tom usar e qual resultado de conversão esperar.",
    "criarLandingPage": "prompt completo 300+ palavras para GitHub Copilot criar uma landing page de captura de leads '/declarar-agora' no Next.js 14 App Router. Especifique: estrutura de seções (hero com countdown, benefícios, formulário, FAQ, social proof), componentes React necessários, integração com API de leads existente, design visual seguindo o padrão preto/branco/verde néon do site.",
    "emailMarketing": "prompt completo 300+ palavras para GitHub Copilot criar sequência de 5 emails de nutrição para leads captados pelo formulário. Especifique: assunto de cada email, timing de envio (imediato, dia 2, dia 4, dia 7, urgência final), conteúdo de cada email, integração com Resend API, template HTML responsivo com brand do Nilson Brites."
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

