/**
 * knowledge-brain.ts
 * "Cérebro" do jornalista-robô — memória persistente e auto-alimentável.
 *
 * Responsabilidades:
 *  - Salvar conteúdo pesquisado a cada geração de post (acúmulo orgânico)
 *  - Alimentar o banco com fontes oficiais (chamado no início do cron)
 *  - Fornecer contexto relevante para cada keyword antes da geração
 *  - Registrar histórico de keywords usadas (evitar repetição em 7 dias)
 */

import { prisma } from "./prisma";

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type KnowledgeCategory =
  | "legislacao"
  | "tabela"
  | "noticia"
  | "faq_receita"
  | "tendencia";

// ─── FONTES OFICIAIS PERMANENTES ─────────────────────────────────────────────
// Alimentadas automaticamente pelo cron (feedBrainFromOfficialSources)

const OFFICIAL_SOURCES: Array<{
  url: string;
  category: KnowledgeCategory;
  ttlDays: number;
  title: string;
}> = [
  {
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas",
    category: "tabela",
    ttlDays: 90,
    title: "Tabela IRPF — Receita Federal",
  },
  {
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/restituicao",
    category: "legislacao",
    ttlDays: 7,
    title: "Calendário Restituição — Receita Federal",
  },
  {
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/perguntas-frequentes",
    category: "faq_receita",
    ttlDays: 30,
    title: "FAQ Oficial — Receita Federal",
  },
  {
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm",
    category: "legislacao",
    ttlDays: 90,
    title: "Lei 15.270/2025 — Tabela IRPF",
  },
];

// ─── DADOS OFICIAIS IRPF 2026 (fallback hardcoded) ───────────────────────────
// FONTE: Receita Federal / IN RFB 2.255/2025
// VERIFICAR anualmente no início da temporada de IR

export const IRPF_2026_DADOS_OFICIAIS = {
  exercicio: 2026,
  anoBase: 2025,
  prazoInicio: "23/03/2026",
  prazoFim: "29/05/2026",
  fontePrazo: "Receita Federal / DOU 16/03/2026",
  limiteObrigatoriedade: 35584.0,
  descontoSimplificadoPerc: 20,
  descontoSimplificadoMax: 16754.34,
  tabelaProgressivaMensal: [
    { faixa: "Até R$ 2.428,80", aliquota: "Isento", deducao: "-" },
    { faixa: "R$ 2.428,81 a R$ 2.826,65", aliquota: "7,5%", deducao: "R$ 182,16" },
    { faixa: "R$ 2.826,66 a R$ 3.751,05", aliquota: "15%", deducao: "R$ 394,16" },
    { faixa: "R$ 3.751,06 a R$ 4.664,68", aliquota: "22,5%", deducao: "R$ 675,49" },
    { faixa: "Acima de R$ 4.664,68", aliquota: "27,5%", deducao: "R$ 908,73" },
  ],
  deducaoPorDependente: 2275.08,
  deducaoEducacaoMax: 3561.5,
  multaAtrasoMinima: 165.74,
  multaAtrasoPercentual: "1% ao mês",
  multaAtrasoMaxima: "20% do imposto devido",
  fonteLegal: "Lei 15.270/2025 e IN RFB 2.255/2025",
} as const;

// ─── FUNÇÕES DE ACESSO À MEMÓRIA ─────────────────────────────────────────────

/**
 * Busca contexto relevante do cérebro para uma keyword.
 * Retorna string formatada pronta para injetar no system prompt.
 * Nunca lança exceção — retorna string vazia em caso de falha.
 */
export async function getBrainContext(keyword: string): Promise<string> {
  try {
    const now = new Date();
    const firstWord = keyword.split(" ")[0] ?? "IRPF";

    const knowledge = await prisma.knowledgeBase.findMany({
      where: {
        isActive: true,
        expiresAt: { gt: now },
        OR: [
          { category: "tabela" },
          { category: "legislacao" },
          { category: "faq_receita" },
          {
            AND: [
              { category: "noticia" },
              { content: { contains: firstWord, mode: "insensitive" } },
            ],
          },
        ],
      },
      orderBy: [{ category: "asc" }, { fetchedAt: "desc" }],
      take: 5,
      select: {
        sourceTitle: true,
        content: true,
        category: true,
        fetchedAt: true,
      },
    });

    if (knowledge.length === 0) {
      return `DADOS OFICIAIS IRPF 2026 (hardcoded — verificar em gov.br/receitafederal):\n${JSON.stringify(IRPF_2026_DADOS_OFICIAIS, null, 2)}`;
    }

    return knowledge
      .map(
        (k) =>
          `[${k.category.toUpperCase()} — ${k.sourceTitle ?? "sem título"} — ${k.fetchedAt.toLocaleDateString("pt-BR")}]\n${k.content.substring(0, 800)}`
      )
      .join("\n\n---\n\n");
  } catch {
    return "";
  }
}

/**
 * Salva conteúdo no cérebro (upsert por url+category).
 * Chamado após cada pesquisa bem-sucedida de collectResearchContext.
 * Nunca lança exceção.
 */
export async function saveToKnowledge(params: {
  url: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  year?: number;
  ttlDays: number;
}): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + params.ttlDays);

    await prisma.knowledgeBase.upsert({
      where: {
        sourceUrl_category: {
          sourceUrl: params.url,
          category: params.category,
        },
      },
      create: {
        sourceUrl: params.url,
        sourceTitle: params.title,
        content: params.content,
        category: params.category,
        year: params.year,
        expiresAt,
      },
      update: {
        content: params.content,
        fetchedAt: new Date(),
        expiresAt,
        isActive: true,
      },
    });
  } catch {
    // Não falhar geração de post por erro no cérebro
  }
}

/**
 * Alimenta o cérebro com fontes oficiais.
 * Chamado no início do cron diário (blog-auto).
 * Respeita TTL — não re-busca se dado ainda é válido.
 */
export async function feedBrainFromOfficialSources(): Promise<void> {
  const now = new Date();

  for (const source of OFFICIAL_SOURCES) {
    try {
      // Verifica se já tem dado válido
      const existing = await prisma.knowledgeBase.findFirst({
        where: {
          sourceUrl: source.url,
          category: source.category,
          expiresAt: { gt: now },
          isActive: true,
        },
        select: { id: true },
      });

      if (existing) {
        console.log(`[Brain] Cache válido: ${source.title}`);
        continue;
      }

      const response = await fetch(source.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; IRPF-Blog/2.0; +https://irpf.qaplay.com.br)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.warn(`[Brain] HTTP ${response.status}: ${source.url}`);
        continue;
      }

      const html = await response.text();
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 4000);

      await saveToKnowledge({
        url: source.url,
        title: source.title,
        content: text,
        category: source.category,
        year: 2026,
        ttlDays: source.ttlDays,
      });

      console.log(`[Brain] ✅ Atualizado: ${source.title}`);

      // Delay respeitoso entre requests
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.error(`[Brain] ❌ Falha ao buscar: ${source.url}`, err);
    }
  }
}

/**
 * Verifica se keyword foi usada nos últimos N dias.
 */
export async function isKeywordRecent(
  keyword: string,
  days: number = 7
): Promise<boolean> {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recent = await prisma.keywordHistory.findFirst({
      where: {
        keyword: { equals: keyword, mode: "insensitive" },
        usedAt: { gt: cutoff },
      },
      select: { id: true },
    });

    return !!recent;
  } catch {
    return false;
  }
}

/**
 * Registra keyword como usada.
 * Chamado após cada post gerado com sucesso.
 */
export async function markKeywordUsed(
  keyword: string,
  cluster: string,
  postId?: string
): Promise<void> {
  try {
    await prisma.keywordHistory.create({
      data: { keyword, cluster, postId },
    });
  } catch {
    // Não falhar geração de post por erro no histórico
  }
}
