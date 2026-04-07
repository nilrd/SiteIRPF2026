import { groqLlama, MODELS, callWithFallback, type FallbackResult } from "./llm-providers";
import { prisma } from "./prisma";
import { IRPF_DATA_CONTEXT } from "./irpf-context";
import { getBrainContext, saveToKnowledge } from "./knowledge-brain";

type ResearchItem = {
  title: string;
  url: string;
  snippet: string;
};

type ExistingPostSnapshot = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  keywords: string[];
};

// Fontes raspadas via HTTP (HTML) — cobertura máxima oficial + jornalismo econômico
const TRUSTED_SOURCE_URLS = [
  // Receita Federal — páginas específicas do IRPF 2026
  "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda",
  "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf",
  "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/malha-fiscal/malha-fina",
  // Legislação federal — lei específica
  "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm",
  // Banco Central — Selic e economia
  "https://www.bcb.gov.br/controleinflacao/taxaselic",
  // Previdência Social / INSS
  "https://www.gov.br/inss/pt-br",
  // Jornalismo financeiro especializado
  "https://www.infomoney.com.br/guias/imposto-de-renda/",
  "https://www.contabeis.com.br/noticias/categoria/imposto-de-renda/",
  "https://g1.globo.com/economia/imposto-de-renda/",
  "https://g1.globo.com/economia/imposto-de-renda/noticia/2026/03/16/imposto-de-renda-2026-prazo-comeca-em-23-marco-e-se-estende-ate-29-de-maio-veja-quem-deve-declarar.ghtml",
] as const;

// Fontes estáticas permanentes — sempre incluídas no contexto, independente de scraping
// Usadas quando o scraping de TRUSTED_SOURCE_URLS falha
const STATIC_SOURCES: ResearchItem[] = [
  {
    title: "Receita Federal — IRPF 2026: prazo oficial 23/03/2026 a 29/05/2026 (DOU em 16/03/2026)",
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda",
    snippet: "IRPF 2026 (ano-base 2025): prazo oficial de 23 de março a 29 de maio de 2026, conforme publicação da Receita Federal no DOU em 16/03/2026. Obrigados: rendimentos tributáveis acima de R$ 35.584,00 em 2025. Multa mínima por atraso: R$ 165,74 ou 1% ao mês (limite de 20%).",
  },
  {
    title: "G1 Economia — Receita informa prazo IRPF 2026: 23/03 a 29/05 e critérios de obrigatoriedade",
    url: "https://g1.globo.com/economia/imposto-de-renda/noticia/2026/03/16/imposto-de-renda-2026-prazo-comeca-em-23-marco-e-se-estende-ate-29-de-maio-veja-quem-deve-declarar.ghtml",
    snippet: "Cobertura jornalística com base na divulgação da Receita Federal: prazo de entrega de 23 de março a 29 de maio de 2026; obrigatoriedade para rendimentos tributáveis acima de R$ 35.584,00; desconto simplificado de 20% limitado a R$ 16.754,34; parcelamento em até 8 quotas, mínimo de R$ 50 por quota.",
  },
  {
    title: "Lei nº 15.270/2025 — Nova tabela IRPF e isenção até R$ 5.000",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm",
    snippet: "Lei nº 15.270/2025 — altera tabela progressiva do IRPF a partir de 2026: isenção integral até R$ 2.428,80/mês; isenção efetiva até R$ 5.000/mês via dedução especial de R$ 1.571,19 para quem aplica o desconto simplificado. Faixas: 7,5% / 15% / 22,5% / 27,5%.",
  },
  {
    title: "Receita Federal — Deduções permitidas no IRPF 2026",
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf",
    snippet: "Deduções IRPF 2026: saúde (sem limite), educação até R$ 3.561,50 por dependente, dependente R$ 2.275,08/ano, pensão alimentícia integral, previdência oficial e PGBL até 12% da renda bruta. Livro-caixa para autônomos.",
  },
  {
    title: "Banco Central do Brasil — Taxa Selic e tributação de renda fixa",
    url: "https://www.bcb.gov.br/controleinflacao/taxaselic",
    snippet: "Taxa Selic definida pelo COPOM. Usada como referência para tributação de renda fixa (CDB, LCI, LCA, Tesouro Direto), atualização de débitos tributários e planejamento financeiro.",
  },
  {
    title: "INSS — Tabela de contribuição 2026 e deduções no IRPF",
    url: "https://www.gov.br/inss/pt-br",
    snippet: "Contribuições ao INSS são dedutíveis integralmente no IRPF. Tabela 2026: alíquotas de 7,5% a 14% conforme salário. Aposentados com doenças graves têm isenção de IR sobre proventos.",
  },
  {
    title: "Receita Federal — Malha fina: como evitar e regularizar",
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/malha-fiscal/malha-fina",
    snippet: "Principais motivos de malha fina 2026: omissão de rendimentos, despesas médicas incompatíveis, divergência de informes, pensão alimentícia irregular, deduções sem comprovante. Prazo para autorregularização antes da intimação.",
  },
  {
    title: "CVM — Tributação de renda variável e fundos de investimento",
    url: "https://www.gov.br/cvm/pt-br",
    snippet: "Operações em bolsa: IR de 15% (swing trade) ou 20% (day trade) sobre lucros. Isenção para vendas de ações até R$ 20.000/mês no mercado à vista. FIIs: rendimentos isentos para PF; ganho de capital tributado a 20%.",
  },
];

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithTimeout(url: string, timeoutMs = 9000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 IRPF-NSB-BlogBot/1.0" },
      next: { revalidate: 3600 },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getTrendTopicFromInternet(): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(
      "https://trends.google.com/trending/rss?geo=BR",
      8000
    );
    if (!res.ok) return null;
    const xml = await res.text();
    const titles = Array.from(xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g))
      .map((m) => m[1]?.trim())
      .filter(Boolean)
      .slice(1, 20) as string[];

    const financePattern = /(imposto|irpf|receita federal|inss|aposentadoria|fgts|mei|selic|ipca|salario|renda)/i;
    const picked = titles.find((t) => financePattern.test(t));
    return picked ?? null;
  } catch {
    return null;
  }
}

async function getGoogleNewsResearch(keyword: string): Promise<ResearchItem[]> {
  try {
    const q = encodeURIComponent(
      `${keyword} site:gov.br OR site:receita.fazenda.gov.br OR site:bcb.gov.br OR site:planalto.gov.br OR site:g1.globo.com OR site:veja.abril.com.br OR site:infomoney.com.br`
    );
    const url = `https://news.google.com/rss/search?q=${q}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const res = await fetchWithTimeout(url, 9000);
    if (!res.ok) return [];
    const xml = await res.text();

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g))
      .slice(0, 12)
      .map((m) => m[1]);

    const rssItems = items
      .map((item) => {
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
        const title = titleMatch?.[1]?.trim() || "";
        const url = linkMatch?.[1]?.trim() || "";
        const snippet = stripHtml(descMatch?.[1] || "").slice(0, 280);
        if (!title || !url) return null;
        return { title, url, snippet };
      })
      .filter(Boolean) as ResearchItem[];

    // Enriquece os 4 artigos mais recentes com conteudo real da pagina
    const enriched = await Promise.all(
      rssItems.slice(0, 4).map(async (item) => {
        const deep = await fetchArticleDeep(item.url);
        return deep.length > 80 ? { ...item, snippet: deep } : item;
      })
    );

    return [...enriched, ...rssItems.slice(4)];
  } catch {
    return [];
  }
}

/** Busca o corpo real de um artigo — usa tags semanticas <article>/<main> se disponiveis */
async function fetchArticleDeep(articleUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 IRPF-NSB-BlogBot/1.0" },
      next: { revalidate: 0 },
    });
    clearTimeout(timer);
    if (!res.ok) return "";
    const html = await res.text();
    // Tenta extrair corpo do artigo de tags semanticas
    const semantic =
      html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ??
      html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ??
      html.match(/<div[^>]*class="[^"]*(?:content|article|post|corpo|materia|news-body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const source = semantic ? semantic[1] : html;
    const text = stripHtml(source)
      .replace(/\s+/g, " ")
      .trim();
    // Pula os primeiros 120 chars (geralmente nav/header) e retorna ate 700 chars de corpo real
    return text.slice(120, 820).trim();
  } catch {
    return "";
  }
}

async function collectResearchContext(keyword: string): Promise<ResearchItem[]> {
  // STATIC_SOURCES: contexto factual permanente (prazos, tabela, deducoes)
  // getGoogleNewsResearch: artigos recentes com conteudo profundo (top 4 deep-fetched)
  const news = await getGoogleNewsResearch(keyword);
  const merged = [...STATIC_SOURCES, ...news];
  const dedup = new Map<string, ResearchItem>();
  for (const item of merged) {
    if (!dedup.has(item.url)) dedup.set(item.url, item);
  }
  return Array.from(dedup.values()).slice(0, 16);
}

function ensureSourcesSection(
  content: string,
  sources: ResearchItem[],
  usedUrls?: string[]
): string {
  if (/fontes/i.test(content)) return content;
  if (!sources.length) return content;

  let usedSources: ResearchItem[];
  if (usedUrls && usedUrls.length > 0) {
    // IA declarou quais fontes usou — usar diretamente (mais preciso)
    usedSources = sources.filter((s) => usedUrls.includes(s.url));
  } else {
    // Fallback: checar se URL aparece no HTML; se nao, limitar a 3 sources
    const cited = sources.filter((s) => content.includes(s.url));
    usedSources = cited.length > 0 ? cited : sources.slice(0, 3);
  }

  if (!usedSources.length) return content;

  const links = usedSources
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`)
    .join("");
  return `${content}\n<h2>Fontes</h2><ul>${links}</ul>`;
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtmlAndUrls(input: string): string {
  return input
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type LanguageCheck = {
  isPortuguese: boolean;
  portugueseHits: number;
  englishHits: number;
};

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

function detectPortugueseContent(sample: string): LanguageCheck {
  const text = stripHtmlAndUrls(sample).toLowerCase();
  const portugueseWords = [
    "de", "para", "com", "que", "nao", "não", "voce", "você", "seu", "sua",
    "declaracao", "declaração", "imposto", "renda", "receita", "federal", "prazo",
    "deducao", "dedução", "educacao", "educação", "saude", "saúde", "malha", "fina",
    "restituicao", "restituição", "como", "quando", "brasil", "contribuinte",
  ];
  const englishWords = [
    "the", "and", "for", "with", "that", "this", "from", "into", "your", "you",
    "income", "tax", "deduction", "deadline", "refund", "federal", "return", "guide",
    "how", "what", "when", "should", "must", "can", "article", "tips",
  ];

  const portugueseHits = countWordHits(text, portugueseWords);
  const englishHits = countWordHits(text, englishWords);
  const isPortuguese = portugueseHits >= 12 && portugueseHits >= englishHits * 1.2;

  return { isPortuguese, portugueseHits, englishHits };
}

function tokenSet(input: string): Set<string> {
  const tokens = normalizeText(input)
    .split(" ")
    .filter((t) => t.length >= 4);
  return new Set(tokens);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  a.forEach((v) => {
    if (b.has(v)) intersection += 1;
  });
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function isTitleTooSimilar(candidateTitle: string, existingTitles: string[]): boolean {
  const candNorm = normalizeText(candidateTitle);
  const candSet = tokenSet(candidateTitle);

  return existingTitles.some((title) => {
    const existingNorm = normalizeText(title);
    if (!existingNorm) return false;
    if (candNorm === existingNorm) return true;
    if (candNorm.includes(existingNorm) || existingNorm.includes(candNorm)) return true;

    const score = jaccardSimilarity(candSet, tokenSet(title));
    return score >= 0.62;
  });
}

async function getExistingPublishedPosts(): Promise<ExistingPostSnapshot[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 120,
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
        keywords: true,
      },
    });

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      tags: Array.isArray(r.tags) ? r.tags : [],
      keywords: Array.isArray(r.keywords) ? r.keywords : [],
    }));
  } catch {
    return [];
  }
}

/* ---- Selic API do Banco Central ---- */
export async function getSelicAtual(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json",
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    return parseFloat(data[0]?.valor || "13.25");
  } catch {
    return 13.25;
  }
}

/* ---- Imagens de capa rotativas (Unsplash curado — finanças/documentos) ---- */
const COVER_IMAGES = [
  // Documentos / formularios fiscais
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&h=630&q=80",
  // Calculadora / financas
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
  // Dinheiro / notas
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=630&q=80",
  // Reuniao de negocios / contabilidade
  "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=630&q=80",
  // Grafico / dados financeiros
  "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&h=630&q=80",
];
function getRandomCoverImage(): string {
  return COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)];
}

/* ---- Mapa keyword → visual query para Unsplash (en) ---- */
const VISUAL_QUERY_MAP: Record<string, string> = {
  // IRPF
  "malha fina": "tax audit inspection document warning",
  "multa": "penalty deadline overdue bill calendar",
  "restituicao": "money refund success finance",
  "atrasado": "late deadline clock urgent",
  "retific": "edit document correction",
  "dependente": "family child document care",
  "deducao": "savings reduce money calculator",
  "aposentado": "retirement senior pension savings",
  "autonomo": "freelancer laptop work independent",
  "aluguel": "real estate house keys property",
  "heranca": "inheritance signing document family",
  "previdencia": "retirement planning pension fund",
  "fgts": "savings worker protection fund",
  "cpf bloqueado": "blocked identity document locked",
  "investimento": "investment chart growth stocks",
  "renda fixa": "bond certificate bank savings",
  "declaracao": "tax documents paperwork professional",
  "imposto de renda": "income tax form calculator",
  "irpf": "tax documents calculator finance",
  "tabela": "spreadsheet data numbers finance",
  // Financas gerais
  "planejamento financeiro": "financial planning budget notebook",
  "selic": "interest rate economy central bank",
  "inss": "social security welfare document",
  "mei": "small business entrepreneur office",
  "salario minimo": "minimum wage paycheck worker",
  "divida": "debt finance stress money",
  "inflacao": "inflation economy market chart",
};

function getVisualQuery(keyword: string): string {
  const lower = keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [key, query] of Object.entries(VISUAL_QUERY_MAP)) {
    if (lower.includes(key)) return query;
  }
  return "finance tax brazil professional document";
}

// Localizações que devem ser excluídas do Unsplash (evitar fotos asiáticas genéricas)
const EXCLUDED_LOCATIONS = [
  "china", "japan", "korea", "taiwan", "hong kong", "beijing",
  "shanghai", "tokyo", "singapore", "thailand", "vietnam",
  "indonesia", "malaysia", "philippines", "myanmar",
];

function isExcludedLocation(location?: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase();
  return EXCLUDED_LOCATIONS.some((l) => loc.includes(l));
}

type UnsplashAttribution = {
  photographerName: string;
  photographerUrl: string;
  photoUrl: string;
};

type ImageResult = {
  url: string;
  attribution: UnsplashAttribution | null;
};

/** Usa Groq para gerar 3 keywords visuais em ingles para busca no Unsplash.
 * Retorna null em caso de falha (usar fallback VISUAL_QUERY_MAP).
 */
async function getGroqImageKeywords(title: string, summary: string): Promise<string | null> {
  try {
    const completion = await groqLlama.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "user",
          content:
            `You are an expert stock photo researcher specializing in Brazilian financial and tax content.\n\n` +
            `Given this blog post title about Brazilian income tax (IRPF), generate the BEST Unsplash search query to find a relevant, professional photo.\n\n` +
            `RULES:\n` +
            `- Query must be in English\n` +
            `- Use 3 to 5 words maximum\n` +
            `- Focus on OBJECTS and SCENES visible in the photo\n` +
            `- NEVER use abstract words: tax, finance, money, economy, brazil, investment, wealth\n` +
            `- Think: what physical objects appear in a photo that illustrates this topic?\n` +
            `- Examples:\n` +
            `  'prazo declaração IRPF' → 'calendar paperwork deadline office'\n` +
            `  'deduções médicas' → 'doctor prescription medical receipt'\n` +
            `  'herança doação' → 'family signing documents notary'\n` +
            `  'malha fina' → 'audit documents magnifying glass desk'\n` +
            `  'retificação' → 'person reviewing tax forms desk'\n` +
            `  'autônomo freelancer' → 'freelancer laptop home office invoice'\n\n` +
            `POST TITLE: ${title}\n\n` +
            `IMPORTANT: Prefer objects and scenes commonly found in Brazilian/South American work environments. ` +
            `Avoid queries that would return East Asian, Chinese, or Japanese stock photos. ` +
            `Return ONLY the search query, nothing else. No quotes.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 30,
    });
    const raw = (completion.choices?.[0]?.message?.content ?? "").trim()
      .replace(/^["']|["']$/g, ""); // remove aspas se o modelo retornar
    // Valida: 3 a 5 palavras simples em ingles
    if (/^[a-zA-Z]+( [a-zA-Z]+){2,4}$/.test(raw)) return raw;
    return null;
  } catch {
    return null;
  }
}

/** Busca imagem contextual via Unsplash API.
 * - Usa Groq para gerar 3 keywords visuais especificas (melhor relevancia)
 * - Fallback: imageQuery da IA → VISUAL_QUERY_MAP → query generica
 * - Triggera o endpoint de download (obrigatorio pela politica da Unsplash)
 * - Retorna URL 1200x630 + dados de atribuicao do fotografo
 */
async function getTopicSpecificImage(keyword: string, title?: string, summary?: string): Promise<ImageResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return { url: getRandomCoverImage(), attribution: null };

  // Tenta Groq primeiro para keywords mais relevantes e visuais
  let groqQuery: string | null = null;
  if (title && summary) {
    groqQuery = await getGroqImageKeywords(title, summary);
  }

  const queries = [
    ...(groqQuery ? [encodeURIComponent(groqQuery)] : []),
    encodeURIComponent(getVisualQuery(keyword)),
    encodeURIComponent("tax return document calculator finance brazil"),
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&content_filter=high&per_page=10`,
        {
          headers: { Authorization: `Client-ID ${accessKey}` },
          next: { revalidate: 0 },
        }
      );
      if (!res.ok) continue;

      const searchData = (await res.json()) as {
        total?: number;
        results?: Array<{
          id?: string;
          urls?: { regular?: string };
          user?: { name?: string; links?: { html?: string }; location?: string };
          links?: { html?: string; download_location?: string };
        }>;
      };

      // Se menos de 3 resultados, considerar query fraca — pular para fallback
      if (!searchData.results || searchData.results.length < 3) continue;

      // Filtra fotos de fotógrafos baseados em países asiáticos
      const filtered = searchData.results.filter(
        (p) => !isExcludedLocation(p.user?.location)
      );
      // Usa pool filtrado se >= 2 resultados; caso contrário usa conjunto original
      const pool = (filtered.length >= 2 ? filtered : searchData.results).slice(0, 8);
      const data = pool[Math.floor(Math.random() * pool.length)];

      const rawUrl = data?.urls?.regular;
      if (!rawUrl) continue;

      const base = rawUrl.split("?")[0];
      const finalUrl = `${base}?auto=format&fit=crop&w=1200&h=630&q=85`;

      const downloadLocation = data.links?.download_location;
      if (downloadLocation) {
        fetch(`${downloadLocation}&client_id=${accessKey}`, { method: "GET" }).catch(() => {});
      }

      const attribution: UnsplashAttribution | null =
        data.user?.name
          ? {
              photographerName: data.user.name,
              photographerUrl: (data.user.links?.html ?? "https://unsplash.com") + "?utm_source=irpf_nsb&utm_medium=referral",
              photoUrl: (data.links?.html ?? "https://unsplash.com") + "?utm_source=irpf_nsb&utm_medium=referral",
            }
          : null;

      return { url: finalUrl, attribution };
    } catch {
      // tenta proxima query
    }
  }

  // Fallback inteligente: query generica se nenhuma das anteriores retornou 3+ resultados
  try {
    const fallbackRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent("office documents desk professional")}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 0 },
      }
    );
    if (fallbackRes.ok) {
      const data = (await fallbackRes.json()) as {
        urls?: { regular?: string };
        user?: { name?: string; links?: { html?: string } };
        links?: { html?: string; download_location?: string };
      };
      const rawUrl = data.urls?.regular;
      if (rawUrl) {
        const base = rawUrl.split("?")[0];
        if (data.links?.download_location) {
          fetch(`${data.links.download_location}&client_id=${accessKey}`, { method: "GET" }).catch(() => {});
        }
        return {
          url: `${base}?auto=format&fit=crop&w=1200&h=630&q=85`,
          attribution: data.user?.name
            ? {
                photographerName: data.user.name,
                photographerUrl: (data.user.links?.html ?? "https://unsplash.com") + "?utm_source=irpf_nsb&utm_medium=referral",
                photoUrl: (data.links?.html ?? "https://unsplash.com") + "?utm_source=irpf_nsb&utm_medium=referral",
              }
            : null,
        };
      }
    }
  } catch { /* usa cover estatica */ }

  return { url: getRandomCoverImage(), attribution: null };
}

/* ---- Keyword clusters para SEO ---- */
export const KEYWORD_CLUSTERS = [
  {
    primary: "como declarar IRPF 2026",
    secondary: ["passo a passo IRPF", "declaracao imposto de renda 2026"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "quem e obrigado declarar imposto de renda 2025",
    secondary: ["obrigatoriedade IRPF", "limite isencao IR"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "tabela IRPF 2026 atualizada",
    secondary: ["aliquotas imposto de renda", "faixas IR 2026"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "restituicao IRPF como maximizar",
    secondary: ["deducoes imposto de renda", "aumentar restituicao"],
    volume: "media",
    intent: "transacional",
  },
  {
    primary: "IRPF atrasado multa",
    secondary: ["multa atraso declaracao", "regularizar IRPF atrasado"],
    volume: "media",
    intent: "transacional",
  },
  {
    primary: "malha fina IRPF como resolver",
    secondary: ["cair na malha fina", "pendencias Receita Federal"],
    volume: "media",
    intent: "transacional",
  },
  {
    primary: "deducoes IRPF saude educacao",
    secondary: ["despesas dedutiveis IR", "limite educacao IRPF"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "declaracao IRPF dependentes",
    secondary: ["incluir dependentes IR", "quem pode ser dependente"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "retificacao IRPF como fazer",
    secondary: ["corrigir declaracao IR", "retificar imposto de renda"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "isencao imposto de renda 2026",
    secondary: ["quem esta isento IRPF", "nova faixa isencao IR"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "IRPF investimentos renda variavel",
    secondary: ["declarar acoes IR", "imposto operacoes bolsa"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "prazo declaracao IRPF 2025",
    secondary: ["data final IRPF", "calendario Receita Federal"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "CPF irregular imposto de renda como regularizar",
    secondary: ["CPF bloqueado Receita Federal", "regularizar CPF pendente"],
    volume: "alta",
    intent: "transacional",
  },
  {
    primary: "declarar aluguel imposto de renda",
    secondary: ["inquilino IRPF", "proprietario aluguel IR", "livro caixa aluguel"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "autônomo profissional liberal como declarar IR",
    secondary: ["carnê-leão MEI IR", "profissional liberal IRPF", "calculo IR mensal autonomo"],
    volume: "media",
    intent: "transacional",
  },
  {
    primary: "aposentado INSS precisa declarar imposto de renda",
    secondary: ["IR aposentado", "isencao IRPF doenca grave", "INSS e IRPF"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "previdencia privada PGBL imposto de renda",
    secondary: ["PGBL deducao IR", "VGBL diferenca IR", "PGBL 12 por cento renda"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "heranca e doacao IRPF como declarar",
    secondary: ["receber heranca IR", "doacao bens ITCMD IRPF", "declarar imovel herdado"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "rendimentos recebidos acumuladamente RRA imposto de renda",
    secondary: ["calculo RRA", "rescisao trabalhista IR", "acao trabalhista IRPF"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "renda fixa CDB LCI LCA imposto de renda",
    secondary: ["IR rendimentos bancarios", "isencao LCI LCA IR", "declarar CDB IRPF"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "pensao alimenticia imposto de renda",
    secondary: ["pensao alimenticia e tributavel", "declarar pensao IRPF", "pensionista deducao IR"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "simplificado x completo IRPF qual e melhor",
    secondary: ["desconto padrao IR", "declaracao completa vantagens", "calcular melhor modelo IRPF"],
    volume: "media",
    intent: "transacional",
  },
];

/* ---- Clusters de finanças pessoais (tráfego amplo, sempre relacionado a finanças) ---- */
export const FINANCE_CLUSTERS = [
  {
    primary: "nova lei isencao imposto de renda 2026 lei 15270",
    secondary: ["isencao IR salario 5000", "quem nao paga imposto de renda 2026"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "planejamento financeiro pessoal 2026",
    secondary: ["como organizar financas pessoais", "metas financeiras ano novo"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "investimentos renda fixa 2026 melhores opcoes selic",
    secondary: ["CDB LCI LCA rendimento 2026", "onde investir com selic alta"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "FGTS saque regras 2026",
    secondary: ["FGTS aniversario saque antecipado", "FGTS demissao sem justa causa calculo"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "aposentadoria INSS regras pontuacao 2026",
    secondary: ["tempo de contribuicao aposentadoria", "calculo beneficio INSS 2026"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "MEI simples nacional imposto 2026 limite faturamento",
    secondary: ["MEI quanto paga de imposto mensal", "limite MEI 2026 microempreendedor"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "salario minimo 2026 reajuste impacto",
    secondary: ["novo salario minimo valor 2026", "impacto salario minimo beneficios sociais"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "como sair das dividas planejamento financeiro 2026",
    secondary: ["renegociacao divida bancaria", "educacao financeira para iniciantes"],
    volume: "alta",
    intent: "informacional",
  },
  {
    primary: "inflacao IPCA 2026 impacto poder de compra",
    secondary: ["IPCA acumulado 2025 resultado", "correcao salarial inflacao meta"],
    volume: "media",
    intent: "informacional",
  },
  {
    primary: "previdencia privada PGBL VGBL vale a pena 2026",
    secondary: ["diferenca PGBL VGBL imposto renda", "previdencia privada vantagens desvantagens"],
    volume: "media",
    intent: "informacional",
  },
];

/* ---- Pool unificado para rotacao automatica ---- */
export const ALL_CLUSTERS = [...KEYWORD_CLUSTERS, ...FINANCE_CLUSTERS];

/* ---- Templates de formato de título (20 opções — rotação automática) ---- */
const TITLE_FORMATS = [
  "N erros que fazem declaração do IRPF cair na malha fina",
  "N documentos que você precisa reunir antes de declarar o IRPF",
  "N mitos sobre [tema] no imposto de renda que custarão seu bolso",
  "N situações em que o brasileiro paga mais imposto sem precisar",
  "Como declarar [tema] no IRPF sem erro — passo a passo",
  "Como pagar menos imposto em [tema] de forma totalmente legal",
  "Por que [tema] é o principal erro dos contribuintes na Receita Federal",
  "Por que a Receita Federal retém declarações com [tema] e como evitar",
  "Declaração aprovada ou retida? O que define o destino do seu IRPF",
  "[Tema no IRPF]: você está declarando certo?",
  "Malha fina por [tema]: o que fazer agora para regularizar",
  "Receita Federal confirma mudança em [tema] — entenda o impacto",
  "Checklist IRPF: tudo para declarar [tema] dentro do prazo",
  "[Tema A] vs [Tema B] no IRPF: qual a diferença que a Receita cobra",
  "A verdade sobre [tema] que a maioria dos contribuintes desconhece",
  "Entenda de uma vez: como [tema] funciona na sua declaração",
  "Declarou [tema] errado? Veja como retificar antes da Receita notificar",
  "IRPF [ano]: o que muda em [tema] e o que continua igual",
  "O contribuinte que [situação] pode perder a restituição — entenda",
  "Antes do prazo fechar: o que revisar em [tema] na sua declaração",
] as const;

/** Seleciona formato de título evitando os mais recentemente usados */
function selectMandatoryTitleFormat(existingPosts: ExistingPostSnapshot[]): string {
  const recentFormats = new Set(
    existingPosts.slice(0, 6).map((p) => detectTitleFormat(p.title))
  );
  // Map grosseiro: cada template do array para formatos internos
  const templateFormats: string[] = [
    "lista-numerada", "lista-numerada", "mitos", "lista-numerada",
    "pergunta-indireta", "pergunta-indireta", "pergunta-indireta", "pergunta-indireta",
    "pergunta", "pergunta", "novidade", "novidade",
    "checklist", "comparativo", "descubra", "descubra",
    "descubra", "novidade", "descubra", "descubra",
  ];
  // Prefere templates cujo formato não apareceu nos recentes
  const candidates = TITLE_FORMATS.map((t, i) => ({ t, fmt: templateFormats[i] ?? "outro" }))
    .filter(({ fmt }) => !recentFormats.has(fmt))
    .map(({ t }) => t);
  const pool = candidates.length > 0 ? candidates : [...TITLE_FORMATS];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ---- Detecta o formato de titulo de um post ---- */
function detectTitleFormat(title: string): string {
  if (!title || typeof title !== "string") return "outro";
  const t = title.trim();
  if (/^\d+\s/.test(t)) return "lista-numerada";
  if (/\?$/.test(t)) return "pergunta";
  if (/^(como|por que|quando|quem|onde|qual)\b/i.test(t)) return "pergunta-indireta";
  if (/\bguia\b|\bpasso a passo\b|\bcompleto\b/i.test(t)) return "guia";
  if (/\bchecklist\b/i.test(t)) return "checklist";
  if (/\bo que muda\b|\bnovas regras\b|\bnovidades\b/i.test(t)) return "novidade";
  if (/\bvs\b|\bdiferenca\b|\bcomparativo\b/i.test(t)) return "comparativo";
  if (/\bentenda\b|\bdescubra\b|\bveja\b|\bsaiba\b/i.test(t)) return "descubra";
  if (/\bmitos?\b|\bverdades?\b|\bmentira\b/i.test(t)) return "mitos";
  if (/^(irpf|imposto|declaracao|receita|tributacao)/i.test(t)) return "tema-direto";
  return "outro";
}

/* ---- Gera instrucao de diversidade de formato ---- */
function buildFormatDiversityNotice(existingPosts: ExistingPostSnapshot[]): string {
  const recent = existingPosts.slice(0, 8);
  if (!recent.length) return "";

  // Conta formatos dos posts recentes
  const formatCounts: Record<string, number> = {};
  const recentFormats = recent.map((p) => {
    const f = detectTitleFormat(p.title);
    formatCounts[f] = (formatCounts[f] ?? 0) + 1;
    return f;
  });

  // Formatos usados nos 3 posts mais recentes
  const last3Formats = recentFormats.slice(0, 3);
  const overdoneFormats = Object.entries(formatCounts)
    .filter(([, count]) => count >= 2)
    .map(([fmt]) => fmt);

  const parts: string[] = [];
  if (last3Formats.length) {
    parts.push(`Formatos usados nos ultimos ${last3Formats.length} posts: ${last3Formats.join(", ")}.`);
  }
  if (overdoneFormats.length) {
    parts.push(`Formatos ja repetidos (evite): ${overdoneFormats.join(", ")}.`);
  }
  parts.push("Escolha o formato que cria o MAIOR CONTRASTE com esses posts recentes, preservando relevancia para o tema.");
  return parts.join(" ");
}

/* ---- System prompt para blog ---- */
function blogSystemPrompt(
  selicAtual: number,
  research: ResearchItem[],
  existingPosts: ExistingPostSnapshot[],
  mandatoryFormat: string,
  compactMode: boolean = false,
  brainContext: string = ""
) {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const researchBlock = research.length
    ? research
        .map((r, idx) => `${idx + 1}. ${r.title}\nURL: ${r.url}\nResumo: ${r.snippet}`)
        .join("\n\n")
    : "Sem dados recentes de internet disponiveis. Use apenas fontes oficiais atemporais e explicite incertezas de data.";

  const existingBlock = existingPosts.length
    ? existingPosts
        .slice(0, compactMode ? 10 : 40)
        .map((p, i) => `${i + 1}. ${p.title} | slug: ${p.slug}`)
        .join("\n")
    : "Sem historico de posts publicado disponivel.";

  // --- MODO COMPACTO para modelos com contexto pequeno (8b) ---
  if (compactMode) {
    return `Ghostwriter de Nilson Brites, consultor IRPF 10+ anos, atendimento 100% online.
Tom: direto, humano, empático. Parágrafos curtos. Sem emojis.
IDIOMA OBRIGATÓRIO: português do Brasil (pt-BR) em 100% do conteúdo, sem trechos em inglês.

DADOS IRPF 2026: Prazo 23/03 a 29/05/2026. Obrigatório se rendimentos > R$ 35.584,00. Multa mínima R$ 165,74. Selic ${selicAtual}%.
Tabela: até R$ 2.428,80 isento; até R$ 2.826,65: 7,5%; até R$ 3.751,05: 15%; até R$ 4.664,68: 22,5%; acima: 27,5%.

REGRAS: Nunca invente dados. Cite fonte oficial. H2 como perguntas. 1 exemplo numérico. 1 tabela HTML.
Lead: comece com dor/situação real, NUNCA "O IRPF é...". 6 FAQs obrigatórias.
Formato título: ${mandatoryFormat}. Max 65 chars. Proibido "Tudo sobre X", "O que você precisa saber".

CTA meio do artigo (usar HTML exato):
<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Ficou com dúvida?</p><p style="margin:0 0 16px;">Nilson Brites atende 100% online. 10+ anos de experiência.</p><a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Preciso%20de%20ajuda%20com%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Falar no WhatsApp</a></div>

CTA final (usar HTML exato):
<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;">Precisa de ajuda?</h3><p style="margin:0 0 24px;">Nilson Brites: declarações novas, atrasadas e retificações.</p><a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20declarar%20meu%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;text-decoration:none;">Declarar meu IRPF agora</a></div>

NUNCA escreva "CTA para WhatsApp:" como texto. Use os blocos HTML acima.
Nunca "todas as pessoas devem declarar". Nunca cite leis fora de Lei 15.270/2025 e IN RFB 2.255/2025.

${brainContext ? `DADOS VERIFICADOS (CÉREBRO):\n${brainContext.substring(0, 600)}\n\n` : ""}PESQUISA: ${researchBlock}

POSTS EXISTENTES (não repetir): ${existingBlock}

SAÍDA: JSON estrito com campos: title, slug, summary, content (HTML min 2500 palavras), tags, keywords, faqs (6), usedSourceUrls, imageQuery (inglês), imageAlt, articleSection, isNewsworthy.`;
  }

  const formatDiversityNotice = buildFormatDiversityNotice(existingPosts);

  return `${IRPF_DATA_CONTEXT}

Você é o ghostwriter do Nilson Brites — Analista Financeiro com mais de 10 anos de experiência em declaração de IRPF, atendendo brasileiros de todo o país 100% online.
IDIOMA OBRIGATÓRIO: português do Brasil (pt-BR) em 100% do conteúdo, sem trechos em inglês.

ESCREVA EXATAMENTE COMO ELE FALARIA: direto, humano, sem jargão acadêmico, com a autoridade de quem já resolveu milhares de casos reais.
O blog existe para CONVERTER LEITORES EM CLIENTES — não apenas para informar.

PERSONALIDADE DO BLOG:
- Tom: especialista acessível, como um amigo contador que explica sem enrolar
- Nilson fala em primeira pessoa ocasionalmente: "Na minha experiência...", "Já vi muitos casos de..."
- Empatia + urgência: o leitor procurou esse artigo porque tem um problema real
- Parágrafos curtos (máximo 4 linhas), frase de impacto no início de cada seção
- Zero emojis no texto corrido. Zero jargão tributário sem explicação imediata.

CONTEXTO TEMPORAL OBRIGATÓRIO — LEIA ANTES DE ESCREVER:
- Hoje: ${hoje}
- IRPF 2026 = declaração entregue em 2026, rendimentos de 01/01/2025 a 31/12/2025 (ano-base 2025)
- Chame SEMPRE de "IRPF 2026" (NUNCA "IRPF 2025" para esta declaração)
- PRAZO IRPF 2026 (OFICIAL — Receita Federal / DOU 16/03/2026): 23 de março a 29 de maio de 2026
- Multa por atraso: mínimo R$ 165,74 ou 1% ao mês sobre o imposto devido (máximo 20%)
- Restituições em 5 lotes: primeiro lote em junho/2026, último em 30/09/2026
- OBRIGATORIEDADE: rendimentos tributáveis acima de R$ 35.584,00 em 2025 — NÃO são "todos os contribuintes"
- Taxa Selic: ${selicAtual}% a.a. (Fonte: Banco Central do Brasil, ${hoje})
- Tabela IRPF 2026 (Fonte: Receita Federal / Lei 15.270/2025):
  • Até R$ 2.428,80/mês: isento
  • R$ 2.428,81 a R$ 2.826,65: 7,5% (dedução R$ 182,16)
  • R$ 2.826,66 a R$ 3.751,05: 15% (dedução R$ 394,16)
  • R$ 3.751,06 a R$ 4.664,68: 22,5% (dedução R$ 675,49)
  • Acima de R$ 4.664,68: 27,5% (dedução R$ 908,73)
- NUNCA invente prazos, datas, valores ou leis fora dos DADOS OFICIAIS acima.

═══════════════════════════════════════════
ESTRUTURA OBRIGATÓRIA DO ARTIGO
═══════════════════════════════════════════

1. TÍTULO
   Use o formato sorteado na REGRA 15 abaixo.
   Deve ser específico, provocar curiosidade legítima. Máximo 65 caracteres.
   NUNCA use: "Tudo sobre X", "O que você precisa saber", "Guia Completo de X".

2. LEAD — 1º PARÁGRAFO (COMEÇA COM DOR, MEDO OU SITUAÇÃO REAL)
   NUNCA abra com definição enciclopédica.
   NUNCA comece com "O IRPF é um imposto..." ou "O Imposto de Renda..."

   RUIM: "O Imposto de Renda da Pessoa Física (IRPF) é um tributo federal cobrado anualmente sobre os rendimentos dos contribuintes brasileiros."
   BOM:  "Você deixou passar o prazo do IRPF e agora não sabe o que fazer? A multa mínima é R$ 165,74 — mas pode chegar a 20% do imposto devido dependendo do seu caso."
   BOM:  "Seu nome pode estar numa lista que a Receita Federal cruza automaticamente. E você pode nem saber disso."
   BOM:  "Muita gente perde dinheiro toda vez que declara o IRPF. Não por falta de documentos — mas por não conhecer essas deduções."

   O primeiro parágrafo deve responder diretamente a pergunta principal em 2-3 frases. Este trecho aparece no Google Discover e como featured snippet — seja direto: sujeito-verbo-dado.

3. BLOCO TL;DR (logo após o lead — OBRIGATÓRIO para Google Discover):
   <div class="tldr-box" style="background:#f5f5f2;border-left:4px solid #2D4033;padding:16px 20px;margin:24px 0;">
   <strong>Resumo rápido:</strong>
   <ul><li>[ponto 1 com dado concreto — valor, percentual ou prazo]</li>
   <li>[ponto 2 com dado concreto]</li>
   <li>[ponto 3 com dado concreto]</li></ul>
   </div>

4. CORPO DO ARTIGO (mínimo 2.500 palavras total):
   - H2 formulados como perguntas reais do Google: "Como declarar aluguel no IRPF 2026?"
   - H3 para subtópicos dentro de cada H2
   - Parágrafos curtos (máximo 4 linhas) — quebre parágrafos longos
   - Pelo menos 1 exemplo numérico calculado passo a passo com os dados reais da tabela
   - Pelo menos 1 <table> HTML com dados oficiais (faixas, prazos ou deduções)
   - Use <strong> em: valores em R$, percentuais, datas, nomes de leis, prazos
   - Pelo menos 1 alerta de risco (malha fina, multa, prazo) destacado

5. CTA INTEGRADO (inserir após o 3º ou 4º H2 — OBRIGATÓRIO — use exatamente este HTML):
   <div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;">
   <p style="margin:0 0 12px;font-weight:600;">Ficou com dúvida sobre sua situação específica?</p>
   <p style="margin:0 0 16px;">Nilson Brites atende 100% online para todo o Brasil. Mais de 10 anos declarando IRPF para autônomos, assalariados e investidores.</p>
   <a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Li%20o%20artigo%20do%20blog%20e%20preciso%20de%20ajuda%20com%20minha%20declara%C3%A7%C3%A3o%20de%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">💬 Falar com especialista no WhatsApp</a>
   </div>

6. BLOCO KEY FACTS (antes das FAQs — OBRIGATÓRIO para IA Search):
   <div class="key-facts" style="background:#2D4033;color:#F9F7F2;padding:20px 24px;margin:32px 0;">
   <strong style="display:block;margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;font-size:0.8em;">Dados Essenciais</strong>
   <ul style="margin:0;padding-left:20px;">
   <li>[dado 1: valor monetário, percentual ou prazo oficial]</li>
   <li>[dado 2]</li><li>[dado 3]</li><li>[dado 4]</li></ul>
   </div>
   IAs de busca (Perplexity, ChatGPT, Google AI Overview) extraem este bloco para citações.

7. FAQs (exatamente 6 — OBRIGATÓRIO):
   Perguntas reais que o leitor digitaria no Google. Respostas diretas com dado numérico quando possível (50-100 palavras cada).

8. CONCLUSÃO COM URGÊNCIA (não resumir — criar tensão e próximo passo):
   Foco no custo de não agir: multa, malha fina, restituição perdida, juros.
   Inclua dados concretos. Termine com chamada para ação urgente.
   Nilson pode aparecer em primeira pessoa aqui: "Na minha experiência, quem deixa para a última semana..."

9. CTA FINAL (OBRIGATÓRIO — use exatamente este HTML):
   <div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;">
   <h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Precisa de ajuda com sua declaração?</h3>
   <p style="margin:0 0 8px;">Nilson Brites atende 100% online para todo o Brasil.</p>
   <p style="margin:0 0 24px;">Mais de 10 anos de experiência. Novas declarações, atrasadas e retificações.</p>
   <a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20declarar%20meu%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">📱 Declarar meu IRPF agora — falar com Nilson</a>
   <p style="margin:16px 0 0;font-size:0.85em;color:#999;">Atendimento rápido · Sem burocracia · Todo o Brasil</p>
   </div>

10. NOTA DE RODAPÉ (sempre ao final):
    <p class="disclaimer" style="font-size:0.8em;color:#666;border-top:1px solid #eee;padding-top:16px;margin-top:32px;">Conteúdo de caráter educativo. Para análise do seu caso específico, consulte o especialista <strong>Nilson Brites — Consultoria IRPF NSB</strong>. WhatsApp: +55 11 94082-5120.</p>

═══════════════════════════════════════════
REGRAS DE RESPONSABILIDADE FACTUAL (RF) — ABSOLUTAS
═══════════════════════════════════════════

RF-1. DADOS NUMÉRICOS: Nunca escreva valores em R$ específicos, datas exatas ou percentuais sem que estejam na seção DADOS OFICIAIS acima ou na seção DADOS PESQUISADOS abaixo. Se não tiver o dado exato: use "conforme tabela vigente da Receita Federal" ou "verifique em gov.br/receitafederal".
RF-2. OBRIGATORIEDADE: NUNCA use "todas as pessoas devem declarar", "qualquer contribuinte é obrigado" ou afirmações absolutas. Use sempre "quem superou os limites legais" — o limite é R$ 35.584,00 em rendimentos tributáveis em 2025.
RF-3. ISENÇÃO R$ 5.000: NUNCA diga "quem ganha até R$ 5.000 não paga imposto" sem explicar que é uma isenção EFETIVA via dedução especial (não isenção total automática). Sempre explique a mecânica da dedução complementar de R$ 1.571,19.
RF-4. FÓRMULAS E CÁLCULOS: Nunca publique fórmulas matemáticas de cálculo de benefícios, aposentadoria ou tributos sem que estejam na seção DADOS OFICIAIS. Se não tiver: direcione o usuário para gov.br/receitafederal.
RF-5. ESCOPO: Este blog é de consultoria IRPF. NÃO gere conteúdo sobre cálculo de aposentadoria pelo INSS, pontuação previdenciária, regras de elegibilidade ao INSS, BPC/LOAS ou direito trabalhista. PERMITIDO: dedução de contribuição INSS no IRPF, aposentado declarando IRPF.
RF-6. LEIS: Nunca cite número de lei sem que esteja na seção DADOS OFICIAIS. Leis pré-autorizadas: Lei 15.270/2025 e IN RFB 2.255/2025.

REGRA DE FONTES:
- Para cada dado numérico ou legal citado, informe a fonte: Receita Federal (gov.br/receitafederal), BCB (bcb.gov.br), Previdência (gov.br/previdencia), Planalto (planalto.gov.br), IBGE (ibge.gov.br).
- No campo "usedSourceUrls" do JSON: liste APENAS os URLs da lista DADOS PESQUISADOS abaixo que você efetivamente referenciou — máximo 5. URLs inventados = PROIBIDO.

═══════════════════════════════════════════
REGRA 15 — FORMATO DO TÍTULO (SORTEADO — SIGA OBRIGATORIAMENTE)
═══════════════════════════════════════════

   FORMATO SORTEADO PARA ESTE ARTIGO (USE COMO BASE — adapte ao tema específico):
   >> ${mandatoryFormat} <<
   Substitua [tema], [ano], [N] etc pelo conteúdo real do artigo.
   Use números concretos quando possível (ex: N = 5, 7, 8...).

   PROIBIDO ABSOLUTAMENTE nestas estruturas de título:
   - "O que você precisa saber sobre [X]"
   - "Tudo que você precisa saber sobre [X]"
   - "Tudo sobre [X]"
   - "O que é e como funciona [X]"
   - "Guia Completo do [X]" (use "Guia definitivo" ou "Guia prático" se quiser guia)
   - Qualquer título com mais de 70 caracteres

   ANÁLISE DE DIVERSIDADE (gerada automaticamente com base nos posts publicados):
   ${formatDiversityNotice || "Sem histórico. Escolha o formato mais adequado ao tema."}

   CATÁLOGO DE FORMATOS — referência adicional:
   A) Lista numerada:    "7 erros que a Receita detecta automaticamente no IRPF 2026"
   B) Pergunta direta:   "Quem é obrigado a declarar o IRPF 2026?"
   C) Como/Por que:      "Como declarar aluguel no IRPF 2026 sem cair na malha fina"
   D) Guia definitivo:   "Guia definitivo do IRPF 2026: prazos, tabelas e deduções"
   E) O que muda:        "O que muda no IRPF 2026 para quem recebe até R$ 5.000"
   F) Checklist:         "Checklist IRPF 2026: documentos e prazo para não perder"
   G) Descubra/Entenda:  "Entenda por que tantos brasileiros caem na malha fina"
   H) Mitos:             "Os maiores mitos sobre deduções médicas no IRPF 2026"
   I) Comparativo:       "IRPF 2026 vs 2025: o que mudou na declaração"
   J) Novidade/Urgente:  "IRPF 2026 começa em março: o que fazer antes do prazo"

${brainContext ? `═══════════════════════════════════════════
DADOS VERIFICADOS — CÉREBRO (FONTES CACHEADAS E VERIFICADAS)
═══════════════════════════════════════════

Use estes dados prioritariamente — são de fontes verificadas e mais estáveis que o Google News:
${brainContext}

` : ""}═══════════════════════════════════════════
DADOS PESQUISADOS NA INTERNET
═══════════════════════════════════════════

Use os relevantes. Declare em "usedSourceUrls" SOMENTE os URLs efetivamente referenciados:
${researchBlock}

═══════════════════════════════════════════
POSTS JÁ PUBLICADOS (NÃO REPETIR TÍTULO NEM ÂNGULO)
═══════════════════════════════════════════

${existingBlock}

═══════════════════════════════════════════
PROIBIÇÕES ABSOLUTAS
═══════════════════════════════════════════

- NUNCA use "CTA para WhatsApp:" como texto no artigo — use os blocos HTML fornecidos acima
- NUNCA abra o artigo com "O IRPF é um imposto..." ou qualquer definição enciclopédica
- NUNCA use títulos no padrão: "O que você precisa saber sobre X", "Tudo sobre X", "Guia Completo de X"
- NUNCA invente dados, leis, percentuais ou datas não presentes nas seções DADOS OFICIAIS ou DADOS PESQUISADOS
- NUNCA repita título ou ângulo de posts já publicados listados acima
- NUNCA escreva parágrafo com mais de 5 linhas sem quebra
- NUNCA inclua "Nilson Brites" ou "Consultoria IRPF NSB" no título do artigo (vai no CTA, não no título)

═══════════════════════════════════════════
FORMATO DE SAÍDA (JSON estrito — TODOS os campos obrigatórios)
═══════════════════════════════════════════

{
  "title": "título com fórmula Discover + keyword principal, max 65 caracteres",
  "slug": "slug-seo-com-keywords-principais",
  "summary": "resposta direta à pergunta do título em 150-160 caracteres, com dado numérico — este texto é o card do Discover",
  "content": "HTML completo: h2 (como perguntas), h3, p, ul, li, table, strong — mínimo 2500 palavras — TL;DR, Key Facts e CTAs HTML inclusos",
  "tags": ["tag1", "tag2", "tag3"],
  "keywords": ["keyword-principal", "keyword-secundaria-1", "keyword-secundaria-2"],
  "faqs": [{"question": "pergunta real exatamente como usuário digita no Google", "answer": "resposta direta em 50-100 palavras com dado numérico quando possível"}],
  "usedSourceUrls": ["cole aqui APENAS os URLs da lista de pesquisa que você efetivamente usou no artigo, máximo 5"],
  "imageQuery": "3 a 5 palavras em INGLÊS para buscar no Unsplash — seja ESPECÍFICO ao tema do artigo. Exemplos: 'tax audit letter envelope penalty', 'medical receipt health expenses deduction', 'self-employed freelancer home office tax', 'stock market investment income tax brazil', 'retirement pension senior finance'. NUNCA use frases genéricas como 'tax documents' ou 'finance calculator'.",
  "imageAlt": "texto alternativo descritivo em português para a imagem de capa (acessibilidade + SEO)",
  "articleSection": "categoria do artigo (ex: IRPF 2026, Malha Fina, Deduções, Finanças Pessoais)",
  "isNewsworthy": false
}`;
}

/* ---- Filtro de temas fora do escopo IRPF ---- */
const BLOCKED_TOPICS = [
  "inss", "aposentadoria", "previdencia", "fgts", "clt", "trabalhista",
  "beneficio previdenciario", "bpc", "loas", "auxilio doenca", "seguro desemprego",
] as const;

function isTopicOnScope(topic: string): boolean {
  const lower = topic
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  // Permitir menção ao INSS apenas no contexto de deduções do IRPF
  const isInssDeduction = lower.includes("deducao") || lower.includes("contribuicao");
  return !BLOCKED_TOPICS.some((blocked) => {
    if ((blocked === "inss" || blocked === "previdencia") && isInssDeduction) return false;
    return lower.includes(blocked);
  });
}

/* ---- Verificador factual pós-geração (llama-3.1-8b-instant) ---- */
type PostReview = {
  aprovado: boolean;
  nivel_risco: "baixo" | "medio" | "alto" | "critico";
  itens_de_risco: string[];
  resumo: string;
};

async function verificarPost(content: string): Promise<PostReview> {
  try {
    const completion = await groqLlama.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "system",
          content: `Voce e um verificador de fatos tributarios brasileiro. Analise o post e identifique:
1. Valores em R$ especificos inviaveis ou sem fonte (ex: R$ 28.123,91 nao existe na RF)
2. Datas exatas sem confirmacao oficial
3. Numeros de leis inventados
4. Formulas matematicas de calculo sem base legal citada
5. Afirmacoes absolutas de obrigatoriedade ("todos devem declarar")
6. Conteudo fora do IRPF: calculo de aposentadoria INSS, pontuacao previdenciaria, FGTS, CLT
7. Idioma diferente de portugues do Brasil (ingles total ou parcial)

Retorne APENAS JSON valido:
{
  "aprovado": true ou false,
  "nivel_risco": "baixo" | "medio" | "alto" | "critico",
  "itens_de_risco": ["descricao de cada problema encontrado"],
  "resumo": "frase curta explicando a decisao"
}

Criterios: baixo/medio = aprovado:true (publicar); alto/critico = aprovado:false (reter para revisao).`,
        },
        {
          role: "user",
          content: `POST PARA VERIFICAR:\n\n${content.slice(0, 6000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      aprovado: parsed.aprovado === true,
      nivel_risco: parsed.nivel_risco || "medio",
      itens_de_risco: Array.isArray(parsed.itens_de_risco) ? parsed.itens_de_risco : [],
      resumo: parsed.resumo || "Verificacao sem resultado claro",
    };
  } catch {
    // Se o verificador falhar, deixa passar com aviso registrado
    return {
      aprovado: true,
      nivel_risco: "baixo",
      itens_de_risco: [],
      resumo: "Verificador indisponivel — publicado sem verificacao",
    };
  }
}

/* ---- Generate blog post ---- */
export async function generateBlogPost(
  clusterIndex?: number,
  customKeyword?: string
) {
  const selicAtual = await getSelicAtual();
  const existingPosts = await getExistingPublishedPosts();
  const existingTitles = existingPosts.map((p) => p.title);
  const cluster = clusterIndex !== undefined
    ? ALL_CLUSTERS[clusterIndex % ALL_CLUSTERS.length]
    : null;

  const trendKeyword = customKeyword ? null : await getTrendTopicFromInternet();
  const keyword = customKeyword || trendKeyword || cluster?.primary || "IRPF 2026";
  const secundarias = cluster?.secondary?.join(", ") || "";

  // Bloqueia temas fora do escopo IRPF antes de qualquer chamada de IA
  if (!isTopicOnScope(keyword)) {
    throw new Error(`Tema "${keyword}" esta fora do escopo do blog IRPF (INSS, aposentadoria, FGTS, etc). Post nao gerado.`);
  }

  const research = await collectResearchContext(keyword);

  // Busca contexto do cérebro (dados cacheados de fontes oficiais)
  const brainCtx = await getBrainContext(keyword).catch(() => "");

  // Salva pesquisa realizada no cérebro para acúmulo orgânico de conhecimento
  void Promise.all(
    research
      .filter((item) => item.snippet.length > 100)
      .slice(0, 6)
      .map((item) =>
        saveToKnowledge({
          url: item.url,
          title: item.title,
          content: item.snippet,
          category: "noticia",
          year: 2026,
          ttlDays: 7,
        })
      )
  );

  const mandatoryFormat = selectMandatoryTitleFormat(existingPosts);

  async function runGeneration(extraInstruction?: string) {
    const customNotice = customKeyword
      ? `\n\nATENCAO MAXIMA: O usuario solicitou especificamente o tema "${customKeyword}". O titulo, o conteudo e todas as secoes DEVEM abordar exclusivamente este tema. NAO desvie para outro assunto mesmo que ele seja mais amplo ou relevante para o IRPF.`
      : "";

    const systemContent =
      blogSystemPrompt(selicAtual, research, existingPosts, mandatoryFormat, false, brainCtx) + customNotice;

    // Versão compacta para o modelo 8b (último recurso — contexto menor)
    const compactSystemContent =
      blogSystemPrompt(selicAtual, research, existingPosts, mandatoryFormat, true, brainCtx) + customNotice;

    const userContent = `TEMA OBRIGATORIO DO ARTIGO: "${keyword}". Voce DEVE escrever exclusivamente sobre este tema — nao mude para outro assunto.${
      secundarias ? ` Keywords secundarias a incluir: ${secundarias}.` : ""
    } ${extraInstruction || ""} Retorne APENAS o JSON valido, sem markdown.`;

    const result = await callWithFallback(systemContent, userContent, 16000, {
      temperature: 0.35,
      response_format: { type: "json_object" },
      compactSystemPrompt: compactSystemContent,
    });

    console.log(`[Blog] Post gerado com modelo: ${result.model}`);
    const raw = result.text;

    // Remove markdown code fences caso o modelo as adicione (ex: ```json\n{...}\n```)
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      // Modelo retornou JSON inválido — tenta extrair o objeto JSON da resposta
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error(`Modelo retornou resposta não-JSON: ${cleaned.slice(0, 200)}`);
    }
  }

  let parsed = await runGeneration();

  // Trava de idioma: se vier em inglês, força regeneração em pt-BR.
  let forceUnpublished = false;
  let languageCheck = detectPortugueseContent(
    `${parsed?.title || ""}\n${parsed?.summary || ""}\n${parsed?.content || ""}`.slice(0, 12000)
  );
  if (!languageCheck.isPortuguese) {
    parsed = await runGeneration(
      "REGENERE O ARTIGO IMEDIATAMENTE EM PORTUGUES DO BRASIL. O post anterior saiu em ingles e foi rejeitado. Retorne TODO o JSON em pt-BR, incluindo title, summary, content e FAQs."
    );

    languageCheck = detectPortugueseContent(
      `${parsed?.title || ""}\n${parsed?.summary || ""}\n${parsed?.content || ""}`.slice(0, 12000)
    );
  }

  if (!languageCheck.isPortuguese) {
    // Não lança exceção — salva como rascunho para revisão manual
    forceUnpublished = true;
    console.warn(
      `[Blog] Idioma suspeito após 2 tentativas (ptHits=${languageCheck.portugueseHits}, enHits=${languageCheck.englishHits}). Salvando como rascunho para revisão.`
    );
  }

  if (parsed?.title && isTitleTooSimilar(parsed.title, existingTitles)) {
    parsed = await runGeneration(
      "O titulo proposto ficou parecido com outro post existente. Gere NOVO titulo e NOVO angulo editorial com foco em curiosidade legitima e alto CTR, sem sensacionalismo."
    );
  }

  // Slug sanitizado: remove acentos e caracteres especiais
  const baseSlug = (parsed.slug || keyword)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const content = ensureSourcesSection(
    parsed.content || "",
    research,
    Array.isArray(parsed.usedSourceUrls) ? (parsed.usedSourceUrls as string[]) : undefined
  );

  // Usa imageQuery gerado pela IA (mais específico ao contexto do artigo)
  // Fallback: getVisualQuery(keyword) via VISUAL_QUERY_MAP
  const imageSearchTerm =
    typeof parsed.imageQuery === "string" && parsed.imageQuery.trim().length > 5
      ? parsed.imageQuery.trim()
      : keyword;
  // Passa titulo e resumo para Groq gerar keywords visuais mais relevantes
  const imageResult = await getTopicSpecificImage(
    imageSearchTerm,
    parsed.title || keyword,
    parsed.summary || ""
  );

  // Segunda chamada Groq (modelo leve) — verifica fatos antes de publicar
  const review = await verificarPost(`${parsed.title || keyword}\n\n${content}`);

  return {
    keyword,
    title: parsed.title || keyword,
    slug: baseSlug,
    summary: parsed.summary || "",
    content,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
    coverImage: imageResult.url,
    imageAttribution: imageResult.attribution
      ? JSON.stringify(imageResult.attribution)
      : null,
    imageAlt: (typeof parsed.imageAlt === "string" && parsed.imageAlt ? parsed.imageAlt : null) ?? (parsed.title || keyword),
    articleSection: (typeof parsed.articleSection === "string" ? parsed.articleSection : null) ?? "IRPF",
    isNewsworthy: typeof parsed.isNewsworthy === "boolean" ? parsed.isNewsworthy : false,
    reviewApproved: forceUnpublished ? false : review.aprovado,
    reviewJson: JSON.stringify(review),
  };
}

/* ---- Save post to DB ---- */
export async function saveBlogPost(post: Awaited<ReturnType<typeof generateBlogPost>>) {
  // Deduplicação de slug: se já existe, adiciona sufixo de timestamp
  let slug = post.slug;
  const exists = await prisma.blogPost.findFirst({ where: { slug }, select: { id: true } });
  if (exists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  return prisma.blogPost.create({
    data: {
      title: post.title,
      slug,
      summary: post.summary,
      content: post.content,
      tags: post.tags,
      keywords: post.keywords,
      faqsJson: JSON.stringify(post.faqs),
      coverImage: post.coverImage,
      imageAttribution: post.imageAttribution ?? null,
      imageAlt: post.imageAlt ?? post.title,
      published: post.reviewApproved ?? true,
      reviewJson: post.reviewJson ?? "",
    },
  });
}
