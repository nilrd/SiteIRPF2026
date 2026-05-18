/**
 * MEI Blog Engine — Gerador de conteúdo dedicado para temas MEI e Desenrola Brasil.
 * Usa GROQ_API_KEY_MEI (chave separada) para não competir com o blog IRPF.
 * Formato e qualidade seguem o mesmo padrão do blog-engine.ts, com contexto MEI.
 */

import { groqMei, callWithFallbackMei, MODELS } from "./llm-providers";
import { prisma } from "./prisma";
import {
  MEI_DATA_CONTEXT,
  MEI_DISCLAIMER,
  MEI_KEYWORD_CLUSTERS,
  DESENROLA_KEYWORD_CLUSTERS,
  getMeiEditorialPhase,
  type MeiEditorialPhase,
  type ClusterIntent,
  type MeiKeywordCluster,
} from "./mei-context";
import { TrendResearchService } from "./trend-research";
import {
  getCurrentCampaignModes,
  getDailyPautaDistribution,
} from "./campaign-priority";
import {
  classifyPostType,
  rankKeywords,
  selectDailyPauta,
} from "./keyword-scoring";
import { isKeywordRecent } from "./knowledge-brain";

export const ALL_MEI_CLUSTERS: MeiKeywordCluster[] = [
  ...MEI_KEYWORD_CLUSTERS,
  ...DESENROLA_KEYWORD_CLUSTERS,
];

function inferMeiIntent(keyword: string, fallback: ClusterIntent): ClusterIntent {
  const k = keyword.toLowerCase();
  if (/atrasad|multa|regulariz|parcel|divida|pendente/.test(k)) {
    return "Regularization Post";
  }
  if (/prazo|vence|ultimo dia|dasn|simei/.test(k)) {
    return "Urgency Post";
  }
  if (/consultoria|irpf|analise|servico|procred|pronampe/.test(k)) {
    return "Service Intent Post";
  }
  if (/limite|obrigado|faturamento|cpf/.test(k)) {
    return "Lead Post";
  }
  return fallback;
}

// ─── Tipos de imagem (isolados — sem importar blog-engine) ───────────────────
type UnsplashAttribution = {
  photographerName: string;
  photographerUrl: string;
  photoUrl: string;
};
type ImageResult = { url: string; attribution: UnsplashAttribution | null };
type ResearchItem = { title: string; url: string; snippet: string };

// ─── Imagens de capa estáticas para MEI (fallback final) ────────────────────
const MEI_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=630&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&h=630&q=80",
];
function getRandomMeiCoverImage(): string {
  return MEI_COVER_IMAGES[Math.floor(Math.random() * MEI_COVER_IMAGES.length)];
}

// ─── Mapa keyword MEI → visual query Unsplash (inglês) ──────────────────────
const MEI_VISUAL_QUERY_MAP: Record<string, string> = {
  mei: "small business entrepreneur office laptop",
  dasn: "tax form deadline calendar documents",
  divida: "debt documents finance stress notebook",
  cancelamento: "closing business documents office",
  abertura: "new business registration documents",
  desenrola: "debt relief financial agreement signing",
  parcelamento: "installments payment agreement finance",
  empreendedor: "entrepreneur small business startup office",
  das: "tax payment receipt documents",
  simei: "small business tax simplified",
  cnpj: "business registration document certificate",
  faturamento: "invoice billing small business",
  irpf: "tax documents calculator professional",
  "nota fiscal": "invoice receipt business documents",
  regularizar: "documents compliance checklist office",
};

function getMeiVisualQuery(keyword: string): string {
  const lower = keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [key, query] of Object.entries(MEI_VISUAL_QUERY_MAP)) {
    if (lower.includes(key)) return query;
  }
  return "small business entrepreneur office brazil";
}

const MEI_EXCLUDED_LOCATIONS = [
  "china",
  "japan",
  "korea",
  "taiwan",
  "hong kong",
  "beijing",
  "shanghai",
  "tokyo",
  "singapore",
  "thailand",
  "vietnam",
];
function isMeiExcludedLocation(location?: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase();
  return MEI_EXCLUDED_LOCATIONS.some((l) => loc.includes(l));
}

/** Usa groqMei para gerar keywords visuais em inglês para busca no Unsplash. */
async function getMeiImageKeywords(title: string): Promise<string | null> {
  try {
    const completion = await groqMei.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "user",
          content:
            `You are a stock photo researcher for Brazilian MEI (Microempreendedor Individual) content.\n` +
            `Given this blog post title about MEI/Desenrola Brasil, generate the BEST Unsplash search query.\n\n` +
            `RULES:\n` +
            `- Query must be in English\n` +
            `- Use 3 to 5 words maximum\n` +
            `- Focus on OBJECTS and SCENES visible in photos\n` +
            `- NEVER use abstract words: tax, finance, money, brazil, mei\n` +
            `- Examples:\n` +
            `  'DASN-SIMEI prazo 2026' → 'calendar documents deadline office'\n` +
            `  'abrir MEI passo a passo' → 'new business registration documents'\n` +
            `  'dívidas MEI Desenrola' → 'debt relief agreement signing documents'\n` +
            `  'cancelar MEI' → 'closing business documents office'\n\n` +
            `POST TITLE: ${title}\n\n` +
            `Return ONLY the search query, nothing else.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 30,
    });
    const raw = (completion.choices?.[0]?.message?.content ?? "")
      .trim()
      .replace(/^["']|["']$/g, "");
    if (/^[a-zA-Z]+( [a-zA-Z]+){2,4}$/.test(raw)) return raw;
    return null;
  } catch {
    return null;
  }
}

/** Busca imagem no Unsplash para post MEI. */
async function getMeiCoverImage(
  keyword: string,
  title?: string,
): Promise<ImageResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return { url: getRandomMeiCoverImage(), attribution: null };

  const groqQuery = title ? await getMeiImageKeywords(title) : null;

  const queries = [
    ...(groqQuery ? [encodeURIComponent(groqQuery)] : []),
    encodeURIComponent(getMeiVisualQuery(keyword)),
    encodeURIComponent("small business entrepreneur office professional"),
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&content_filter=high&per_page=10`,
        {
          headers: { Authorization: `Client-ID ${accessKey}` },
          next: { revalidate: 0 },
        },
      );
      if (!res.ok) continue;
      const searchData = (await res.json()) as {
        results?: Array<{
          id?: string;
          urls?: { regular?: string };
          user?: {
            name?: string;
            links?: { html?: string };
            location?: string;
          };
          links?: { html?: string; download_location?: string };
        }>;
      };
      if (!searchData.results || searchData.results.length < 3) continue;

      const filtered = searchData.results.filter(
        (p) => !isMeiExcludedLocation(p.user?.location),
      );
      const pool = (filtered.length >= 2 ? filtered : searchData.results).slice(
        0,
        8,
      );
      const data = pool[Math.floor(Math.random() * pool.length)];
      const rawUrl = data?.urls?.regular;
      if (!rawUrl) continue;

      const finalUrl = `${rawUrl.split("?")[0]}?auto=format&fit=crop&w=1200&h=630&q=85`;
      if (data.links?.download_location) {
        fetch(`${data.links.download_location}&client_id=${accessKey}`, {
          method: "GET",
        }).catch(() => {});
      }
      const attribution: UnsplashAttribution | null = data.user?.name
        ? {
            photographerName: data.user.name,
            photographerUrl:
              (data.user.links?.html ?? "https://unsplash.com") +
              "?utm_source=irpf_nsb&utm_medium=referral",
            photoUrl:
              (data.links?.html ?? "https://unsplash.com") +
              "?utm_source=irpf_nsb&utm_medium=referral",
          }
        : null;
      return { url: finalUrl, attribution };
    } catch {
      /* tenta próxima query */
    }
  }

  return { url: getRandomMeiCoverImage(), attribution: null };
}

// ─── Pesquisa GOV.BR para contexto factual MEI ──────────────────────────────
const MEI_STATIC_SOURCES: ResearchItem[] = [
  {
    title: "Gov.br — Portal MEI Oficial: abertura, DAS, DASN e obrigações 2026",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
    snippet:
      "Portal oficial MEI 2026: limite faturamento R$ 81.000/ano. DAS mensal: R$ 73,00 comércio/indústria, R$ 79,90 serviços, R$ 80,90 misto. DASN-SIMEI: prazo até 31 de maio de 2026 (ano-base 2025). Abertura gratuita e online. Cancelamento (baixa) gratuito pelo portal.",
  },
  {
    title: "Gov.br — O que você precisa saber antes de ser MEI",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/o-que-voce-precisa-saber-antes-de-se-tornar-um-mei",
    snippet:
      "Pré-requisitos MEI: ser maior de 18 anos, ter CPF regular, não ser sócio ou administrador de outra empresa, limite de faturamento R$ 81.000/ano, ter no máximo 1 empregado. Vedado a profissões regulamentadas (médico, advogado, engenheiro, contador). Abertura gratuita em menos de 10 minutos pelo gov.br/mei.",
  },
  {
    title: "Gov.br — Atividades permitidas para MEI 2026",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/atividades-permitidas",
    snippet:
      "Lista oficial de mais de 600 ocupações permitidas ao MEI conforme Resolução CGSN 140/2018. MEI pode exercer atividades de comércio, indústria ou serviços (não regulamentadas). Exemplos: cabeleireiro, eletricista, pedreiro, vendedor ambulante, costureira, motorista de transporte por app.",
  },
  {
    title: "Gov.br — Direitos e obrigações do MEI",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/direitos-e-obrigacoes",
    snippet:
      "Obrigações MEI: pagar DAS mensalmente até dia 20, entregar DASN-SIMEI até 31 de maio, emitir nota fiscal para PJ. Direitos: INSS (aposentadoria por idade, auxílio-doença, salário-maternidade), CNPJ gratuito, acesso a crédito, sem contabilidade obrigatória, pode contratar 1 empregado.",
  },
  {
    title: "Gov.br — Verificar débitos do MEI",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/verificar-debitos-do-mei",
    snippet:
      "Ferramenta oficial para verificar débitos de DAS e outras pendências do MEI. Permite parcelamento do DAS em atraso em até 60 meses. Débitos acima de 90 dias geram juros Selic + multa máx 20%. MEI inadimplente pode perder o regime MEI e ir a dívida ativa.",
  },
  {
    title: "Gov.br — Receita Federal: MEI e Imposto de Renda Pessoa Física",
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda",
    snippet:
      "MEI e IRPF PF 2026: o MEI é empresa (CNPJ), mas o titular continua sendo Pessoa Física. Se rendimentos totais da PF (pró-labore, aluguéis, salários) ultrapassaram R$ 35.584,00 em 2025, deve declarar IRPF 2026 (prazo 23/03 a 29/05/2026). Lucros MEI distribuídos ao titular são isentos de IR PF dentro dos limites do SIMEI.",
  },
  {
    title:
      "Novo Desenrola Brasil 2026 — Ministério da Fazenda: regras oficiais",
    url: "https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/novo-desenrola-brasil",
    snippet:
      "Novo Desenrola Brasil 2026: mobilização de 90 dias para renegociação de dívidas. Desenrola Famílias: renda até R$ 8.105 (5 SM), dívidas cartão/cheque/CDC atrasadas 90 dias a 2 anos contratadas até 31/01/2026, descontos 30–90%, juros máx 1,99%/mês, prazo 48 meses, limite R$ 15 mil/IF. Garantia FGO. Uso de FGTS: 20% do saldo ou R$ 1.000 (maior) após renegociação.",
  },
  {
    title: "Gov.br Fazenda — Anúncio Novo Desenrola Brasil maio 2026",
    url: "https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/maio/governo-federal-anuncia-programa-para-renegociacao-de-dividas-de-familias-estudantes-e-empresas",
    snippet:
      "Governo Federal anuncia Novo Desenrola Brasil em maio/2026: Famílias (cartão/cheque/CDC, descontos até 90%, FGO), FIES (desconto até 99% CadÚnico), Empresas — Procred (MEI/ME, crédito até 50% faturamento, teto R$ 180 mil, carência 24 meses, prazo 96 meses) e Pronampe (MPE faturamento até R$ 4,8 mi, limite R$ 500 mil), Rural (prazo até 20/12/2026).",
  },
  {
    title: "SEBRAE — O que é MEI e como se formalizar: passo a passo",
    url: "https://sebrae.com.br/empreendedores/conteudos/comecar/o-que-e-mei-e-como-se-formalizar-passo-a-passo-para-comecar",
    snippet:
      "SEBRAE explica o MEI: Microempreendedor Individual é a categoria mais simples do Simples Nacional para quem fatura até R$ 81.000/ano. Abertura gratuita no Portal do Empreendedor (gov.br/mei) em menos de 10 minutos. Após abertura: emitir DAS todo mês, entregar DASN-SIMEI anual (até 31/mai) e emitir nota fiscal para pessoa jurídica.",
  },
  {
    title: "Banco do Brasil — Desenrola Brasil: como aderir",
    url: "https://www.bb.com.br/site/pra-voce/desenrola-brasil/",
    snippet:
      "Banco do Brasil participa do Novo Desenrola Brasil 2026. Clientes BB podem renegociar dívidas elegíveis com descontos conforme tabela oficial. Acesso pelo app BB, internet banking ou agências. Dívidas elegíveis: cartão de crédito, cheque especial e crédito pessoal contratados até 31/01/2026 com atraso de 90 dias a 2 anos.",
  },
];

async function fetchWithTimeoutMei(
  url: string,
  timeoutMs = 8000,
): Promise<Response> {
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

async function getMeiGoogleNewsResearch(
  keyword: string,
): Promise<ResearchItem[]> {
  try {
    // Busca news sobre MEI/Desenrola em fontes confiáveis (gov.br, sebrae, g1, cnn, istoé, contábeis)
    const q = encodeURIComponent(
      `${keyword} site:gov.br OR site:sebrae.com.br OR site:g1.globo.com OR site:cnnbrasil.com.br OR site:istoedinheiro.com.br OR site:contabeis.com.br OR site:infomoney.com.br`,
    );
    const url = `https://news.google.com/rss/search?q=${q}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const res = await fetchWithTimeoutMei(url, 8000);
    if (!res.ok) return [];
    const xml = await res.text();

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g))
      .slice(0, 8)
      .map((m) => m[1]);

    return items
      .map((item) => {
        const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        const linkMatch = item.match(/<link>(.*?)<\/link>/);
        const descMatch = item.match(
          /<description><!\[CDATA\[(.*?)\]\]><\/description>/,
        );
        const t = titleMatch?.[1]?.trim() || "";
        const u = linkMatch?.[1]?.trim() || "";
        const snippet = (descMatch?.[1] || "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 260);
        if (!t || !u) return null;
        return { title: t, url: u, snippet } as ResearchItem;
      })
      .filter(Boolean) as ResearchItem[];
  } catch {
    return [];
  }
}

// Fontes oficiais complementares para scraping direto (gov.br + confiáveis)
const MEI_LIVE_SOURCES: { url: string; label: string }[] = [
  {
    url: "https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/novo-desenrola-brasil",
    label: "Gov Fazenda Desenrola",
  },
  {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/direitos-e-obrigacoes",
    label: "Gov MEI Direitos",
  },
  {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/verificar-debitos-do-mei",
    label: "Gov MEI Débitos",
  },
  {
    url: "https://sebrae.com.br/empreendedores/conteudos/comecar/o-que-e-mei-e-como-se-formalizar-passo-a-passo-para-comecar",
    label: "SEBRAE MEI formalizacao",
  },
];

/** Scraping direto de até 3 fontes vivas (gov.br/sebrae) para enriquecer o contexto */
async function fetchLiveMeiSources(keyword: string): Promise<ResearchItem[]> {
  const lower = keyword
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  // Seleciona as 3 fontes mais relevantes para a keyword
  const desenrolaKeywords = [
    "desenrola",
    "divida",
    "renegociar",
    "debito",
    "procred",
    "pronampe",
    "fgts",
    "fies",
  ];
  const isDesenrola = desenrolaKeywords.some((k) => lower.includes(k));
  const sources = isDesenrola
    ? [MEI_LIVE_SOURCES[0], MEI_LIVE_SOURCES[2], MEI_LIVE_SOURCES[3]]
    : [MEI_LIVE_SOURCES[1], MEI_LIVE_SOURCES[2], MEI_LIVE_SOURCES[3]];

  const results: ResearchItem[] = [];
  await Promise.allSettled(
    sources.map(async ({ url, label }) => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 IRPF-NSB-BlogBot/1.0" },
          next: { revalidate: 3600 },
        });
        clearTimeout(timer);
        if (!res.ok) return;
        const html = await res.text();
        const semantic =
          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ??
          html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        const source = semantic ? semantic[1] : html;
        const text = source
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(200, 900);
        if (text.length > 100) {
          results.push({ title: label, url, snippet: text });
        }
      } catch {
        /* ignora falha individual */
      }
    }),
  );
  return results;
}

async function collectMeiResearchContext(
  keyword: string,
): Promise<ResearchItem[]> {
  // 3 fontes em paralelo: estáticas + Google News + scraping gov.br/sebrae ao vivo
  const [news, live] = await Promise.all([
    getMeiGoogleNewsResearch(keyword),
    fetchLiveMeiSources(keyword),
  ]);
  const merged = [...MEI_STATIC_SOURCES, ...live, ...news];
  const dedup = new Map<string, ResearchItem>();
  for (const item of merged) {
    if (!dedup.has(item.url)) dedup.set(item.url, item);
  }
  return Array.from(dedup.values()).slice(0, 16);
}

// WA link para CTAs
const WA_MEI_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent("Olá Nilson! Li o artigo do blog sobre MEI e preciso de ajuda.")}`;
const WA_IRPF_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Vi o artigo sobre MEI e quero declarar meu IRPF 2026.")}`;

// ─── System prompt para blog MEI ─────────────────────────────────────────────
function meiSystemPrompt(
  keyword: string,
  categoria: "MEI" | "DESENROLA",
  postIntent: ClusterIntent,
  meiPhase: MeiEditorialPhase,
): string {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const ctaByIntent: Record<
    ClusterIntent,
    { inline: string; final: string; line: string }
  > = {
    "Traffic Post": {
      line: "Se você não tem certeza sobre sua situação, solicite uma análise antes de enviar.",
      inline: `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Seu caso é diferente do exemplo do artigo?</p><p style="margin:0 0 16px;">Uma análise individual ajuda a evitar erros de preenchimento e retrabalho.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Solicitar análise</a></div>`,
      final: `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Quer revisar seu caso com segurança?</h3><p style="margin:0 0 24px;">Nilson Brites atende MEI e IRPF com análise personalizada para cada situação.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">Falar com especialista</a></div>`,
    },
    "Lead Post": {
      line: "Se há dúvida sobre enquadramento, faturamento ou obrigação, o ideal é revisar antes de enviar.",
      inline: `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Tem dúvida sobre sua obrigação como MEI?</p><p style="margin:0 0 16px;">Uma análise evita decisões por suposição e reduz risco de pendência futura.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Analisar meu caso</a></div>`,
      final: `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Prefere enviar com clareza do que se aplica ao seu caso?</h3><p style="margin:0 0 24px;">Receba orientação para MEI e IRPF sem promessas irreais e com foco em conformidade.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">Quero orientação</a></div>`,
    },
    "Urgency Post": {
      line: "Com o prazo perto, revise o caso antes de transmitir para evitar correções depois.",
      inline: `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Prazo apertado para DASN-SIMEI?</p><p style="margin:0 0 16px;">Uma revisão rápida pode evitar erro de envio e dor de cabeça na regularização.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Atendimento rápido</a></div>`,
      final: `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Faltam poucos dias para o prazo?</h3><p style="margin:0 0 24px;">Organize os documentos e valide o envio com apoio especializado.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">Finalizar com apoio</a></div>`,
    },
    "Regularization Post": {
      line: "Com DASN atrasada ou pendência, o ideal é entender a causa antes de regularizar.",
      inline: `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Tem pendência ou atraso no MEI?</p><p style="margin:0 0 16px;">Antes de pagar ou parcelar, revise multa, período e documentação para evitar novo erro.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Analisar regularização</a></div>`,
      final: `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Precisa regularizar MEI ou IRPF?</h3><p style="margin:0 0 24px;">Em casos com atraso, multa e parcelamento, revisão técnica reduz risco de retrabalho.</p><a href="${WA_IRPF_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">Regularizar com suporte</a></div>`,
    },
    "Service Intent Post": {
      line: "Se o caso envolve múltiplas pendências, uma análise individual costuma ser o caminho mais seguro.",
      inline: `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Seu cenário envolve MEI + IRPF + pendências?</p><p style="margin:0 0 16px;">Cada combinação exige estratégia própria para enviar com segurança fiscal.</p><a href="${WA_IRPF_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">Falar com especialista</a></div>`,
      final: `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Quer um plano para regularizar e seguir em conformidade?</h3><p style="margin:0 0 24px;">Atendimento 100% online com foco em diagnóstico e decisão técnica por caso.</p><a href="${WA_IRPF_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">Quero análise especializada</a></div>`,
    },
  };

  const ctaWhatsApp = ctaByIntent[postIntent].inline;
  const ctaFinal = ctaByIntent[postIntent].final;
  const ctaLine = ctaByIntent[postIntent].line;

  return `${MEI_DATA_CONTEXT}

Você é o ghostwriter do Nilson Brites — Analista Financeiro com mais de 10 anos de experiência, especializado em declarações IRPF para MEI e microempreendedores, atendendo brasileiros 100% online.
IDIOMA OBRIGATÓRIO: português do Brasil (pt-BR), 100% do conteúdo.
Hoje: ${hoje}.
FASE MEI/DASN ATUAL: ${meiPhase}
INTENÇÃO COMERCIAL DO POST: ${postIntent}
CTA recomendado: ${ctaLine}

TEMA DO ARTIGO: "${keyword}"
CATEGORIA: ${categoria}

REGRAS ABSOLUTAS — RESPONSABILIDADE FACTUAL:
1. NUNCA invente valores de DAS, limites de faturamento, percentuais de desconto ou prazos não presentes no CONTEXTO FACTUAL MEI acima.
2. Valores oficiais MEI 2026 que PODE usar: limite R$ 81.000/ano, DAS comércio R$ 73,00, DAS serviços R$ 79,90, prazo DASN-SIMEI 31/maio/2026, parcelamento DAS até 60 meses.
3. Desenrola Empresas (se categoria = DESENROLA): descontos 30–90% conforme atraso, prazo 48 meses, limite R$ 15.000/IF (Famílias); Procred MEI: carência 24 meses, prazo 96 meses, crédito até 50% faturamento máx. R$ 180k.
4. NUNCA escreva fórmulas de cálculo de benefícios INSS, regras de aposentadoria ou direito trabalhista — fuja do escopo.
5. IRPF do MEI: apenas mencionar a relação MEI-IRPF PF e direcionar para a consultoria. Nunca ensine a declarar sozinho.
6. Link interno obrigatório: ao falar de IRPF do MEI, sempre linkar para /mei/mei-e-irpf com texto âncora.
7. Regras temporais MEI: antes de 31/05 priorize DASN-SIMEI, prazo, faturamento e documentos; nos últimos 14 dias aumente urgência responsável; após 31/05, pode tratar DASN atrasada, multa, regularização e parcelamento.

ESTRUTURA OBRIGATÓRIA:
1. Título SEO: específico, com keyword principal, máx 65 chars. NÃO use "guia completo", "tudo sobre", "o que você precisa saber".
2. Lead (1º parágrafo): começa com situação real / dor / urgência. NUNCA com definição.
3. TL;DR box (após lead):
   <div class="tldr-box" style="background:#f5f5f2;border-left:4px solid #2D4033;padding:16px 20px;margin:24px 0;"><strong>Resumo rápido:</strong><ul><li>[ponto 1 com dado concreto]</li><li>[ponto 2]</li><li>[ponto 3]</li></ul></div>
4. Corpo: mínimo 1.800 palavras, H2 como perguntas, parágrafos curtos (máx 4 linhas), 1 tabela HTML, 1 exemplo prático.
5. CTA inline (após 3º H2): ${ctaWhatsApp}
6. Key Facts box (antes das FAQs): <div class="key-facts" style="background:#2D4033;color:#F9F7F2;padding:20px 24px;margin:32px 0;"><strong style="display:block;margin-bottom:12px;text-transform:uppercase;font-size:0.8em;">Dados Essenciais</strong><ul style="margin:0;padding-left:20px;"><li>[dado 1]</li><li>[dado 2]</li><li>[dado 3]</li></ul></div>
7. FAQs: exatamente 6 perguntas reais.
8. Conclusão com urgência (custo de não agir).
9. CTA final: ${ctaFinal}
10. Disclaimer: ${MEI_DISCLAIMER}

LINK INTERNO OBRIGATÓRIO (incluir no corpo quando relevante):
- Para posts MEI: ao mencionar "IRPF do MEI", linkar: <a href="/mei/mei-e-irpf">como o MEI se relaciona com o IRPF</a>
- Para posts Desenrola: ao mencionar "declarar IRPF", linkar: <a href="/declarar-agora">declarar IRPF agora</a>

SAÍDA: JSON estrito, sem markdown, sem fence:
{
  "title": "título otimizado para SEO, máx 65 chars",
  "slug": "slug-com-keywords-kebab-case",
  "summary": "metadescription de 150–160 chars com dado concreto",
  "content": "HTML completo mínimo 1800 palavras",
  "tags": ["tag1", "tag2"],
  "keywords": ["keyword-principal", "keyword-secundaria"],
  "faqs": [{"question": "...", "answer": "..."}],
  "imageQuery": "3–5 palavras em inglês para Unsplash",
  "imageAlt": "descrição da imagem em português"
}`;
}

// ─── Verificador factual MEI ──────────────────────────────────────────────────
type MeiReview = {
  aprovado: boolean;
  nivel_risco: "baixo" | "medio" | "alto" | "critico";
  itens_de_risco: string[];
  resumo: string;
};

async function verificarPostMei(
  content: string,
  categoria: "MEI" | "DESENROLA",
): Promise<MeiReview> {
  try {
    const completion = await groqMei.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "system",
          content: `Você é um verificador de fatos sobre MEI e Desenrola Brasil.
Verifique o post e identifique:
1. Valores MEI inventados (DAS diferente de R$ 73/79,90/80,90; limite diferente de R$ 81.000/ano)
2. Prazos DASN-SIMEI inventados (prazo correto: 31 de maio)
3. Percentuais de desconto do Desenrola inventados (corretos: 30–90% famílias, conforme tabela)
4. Afirmações absolutas erradas (ex: "todo MEI é obrigado a declarar IR")
5. Fórmulas de cálculo sem base legal (cálculo de aposentadoria INSS, benefícios, etc.)
6. Conteúdo fora do escopo MEI/Desenrola (política, medicina, etc.)
7. Conteúdo em inglês ou idioma diferente de português do Brasil

Retorne APENAS JSON válido:
{"aprovado":true/false,"nivel_risco":"baixo"|"medio"|"alto"|"critico","itens_de_risco":["..."],"resumo":"..."}

Critérios: baixo/médio = aprovado:true; alto/crítico = aprovado:false.`,
        },
        {
          role: "user",
          content: `CATEGORIA: ${categoria}\n\nPOST:\n\n${content.slice(0, 5000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(
      raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim(),
    );
    return {
      aprovado: parsed.aprovado === true,
      nivel_risco: parsed.nivel_risco || "medio",
      itens_de_risco: Array.isArray(parsed.itens_de_risco)
        ? parsed.itens_de_risco
        : [],
      resumo: parsed.resumo || "Verificação sem resultado claro",
    };
  } catch {
    return {
      aprovado: true,
      nivel_risco: "baixo",
      itens_de_risco: [],
      resumo: "Verificador indisponível",
    };
  }
}

// ─── Gerador principal ────────────────────────────────────────────────────────
export async function generateMeiBlogPost(
  clusterIndex?: number,
  customKeyword?: string,
) {
  const cluster =
    clusterIndex !== undefined
      ? ALL_MEI_CLUSTERS[clusterIndex % ALL_MEI_CLUSTERS.length]
      : ALL_MEI_CLUSTERS[Math.floor(Math.random() * ALL_MEI_CLUSTERS.length)];

  let trendKeyword: string | null = null;
  let trendPostType: "traffic" | "lead" = "traffic";
  let trendSearchIntent = "informacional";
  let trendAudience = "microempreendedores";

  if (!customKeyword && clusterIndex === undefined) {
    try {
      const service = new TrendResearchService();
      const [meiTrends, dasnTrends] = await Promise.all([
        service.getCachedTrends("MEI", 60),
        service.getCachedTrends("DASN", 60),
      ]);

      const combined = [...meiTrends, ...dasnTrends];
      if (combined.length > 0) {
        const modes = getCurrentCampaignModes();
        const ranked = rankKeywords(
          combined.map((item) => ({
            keyword: item.keyword,
            category: item.category,
            source: item.source,
            audience: item.audience,
            intent: item.intent,
            trendScore: item.trendScore,
            businessScore: item.businessScore,
            urgencyScore: item.urgencyScore,
            seoScore: item.seoScore,
            riskScore: item.riskScore,
            breakoutStatus: item.breakoutStatus,
          })),
          modes,
        );

        const pauta = selectDailyPauta(
          ranked,
          getDailyPautaDistribution(modes),
        );
        const pick = await (async () => {
          for (const item of pauta) {
            const recent = await isKeywordRecent(item.keyword, 7);
            if (!recent) return item;
          }
          return pauta[0] ?? ranked[0] ?? null;
        })();

        if (pick) {
          trendKeyword = pick.keyword;
          trendPostType = pick.postType;
          trendSearchIntent = pick.searchIntent;
          trendAudience = pick.audience;
        }
      }
    } catch {
      trendKeyword = null;
    }
  }

  const keyword = customKeyword || trendKeyword || cluster.primary;
  const categoria: "MEI" | "DESENROLA" =
    (cluster as { categoria?: "MEI" | "DESENROLA" }).categoria ??
    (keyword.toLowerCase().includes("desenrola") ? "DESENROLA" : "MEI");
  const meiPhase = getMeiEditorialPhase(new Date());
  const baseIntent = cluster.postIntent ?? "Traffic Post";
  const resolvedIntent = inferMeiIntent(keyword, baseIntent);

  const systemPrompt = meiSystemPrompt(
    keyword,
    categoria,
    resolvedIntent,
    meiPhase,
  );

  // ── Pesquisa GOV.BR em paralelo com slot de espera ────────────────────────
  const research = await collectMeiResearchContext(keyword);
  const researchBlock =
    research.length > 0
      ? `PESQUISA OFICIAL MEI (use estes dados, não invente nada além deles):\n` +
        research
          .map((r) => `[${r.title}]\nURL: ${r.url}\n${r.snippet}`)
          .join("\n\n")
      : "";

  const userPrompt =
    (researchBlock ? researchBlock + "\n\n" : "") +
    `TEMA OBRIGATÓRIO: "${keyword}". Secundárias: ${
      (cluster as { secondary?: string[] }).secondary?.join(", ") || ""
    }. Retorne APENAS o JSON válido, sem markdown.`;

  let parsed: Record<string, unknown>;
  let aiModel = "groq-" + MODELS.blogVerifier;

  try {
    const result = await callWithFallbackMei(systemPrompt, userPrompt, {
      temperature: 0.35,
      response_format: { type: "json_object" },
    });
    aiModel = result.model;
    parsed = JSON.parse(
      result.text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim(),
    );
  } catch (err) {
    console.error("[MEI Blog] Erro na geração:", err);
    throw new Error(`Falha ao gerar post MEI para keyword: ${keyword}`);
  }

  const content = (parsed.content as string) || "";

  // Verificador pós-geração obrigatório
  const review = await verificarPostMei(
    `${parsed.title || keyword}\n\n${content}`,
    categoria,
  );

  // Slug sanitizado
  const rawTitle = (parsed.title as string) || keyword;
  const baseSlug = ((parsed.slug as string) || keyword)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // ── Imagem de capa via Unsplash ──────────────────────────────────────────
  const imageResult = await getMeiCoverImage(keyword, rawTitle);
  const imageAttribution = imageResult.attribution
    ? JSON.stringify(imageResult.attribution)
    : null;

  return {
    keyword,
    categoria,
    title: rawTitle,
    slug: baseSlug,
    summary: (parsed.summary as string) || "",
    content,
    tags: Array.isArray(parsed.tags)
      ? (parsed.tags as string[])
      : [categoria.toLowerCase()],
    keywords: Array.isArray(parsed.keywords)
      ? (parsed.keywords as string[])
      : [],
    faqs: Array.isArray(parsed.faqs)
      ? (parsed.faqs as { question: string; answer: string }[])
      : [],
    imageQuery:
      (parsed.imageQuery as string) || "small business entrepreneur brazil",
    imageAlt: (parsed.imageAlt as string) || rawTitle,
    coverImage: imageResult.url,
    imageAttribution,
    postType: trendKeyword ? trendPostType : classifyPostType(keyword),
    audience: trendAudience,
    searchIntent: trendSearchIntent,
    factScore: review.aprovado ? 85 : 55,
    riskScore:
      review.nivel_risco === "baixo"
        ? 20
        : review.nivel_risco === "medio"
          ? 45
          : review.nivel_risco === "alto"
            ? 70
            : 90,
    needsReview: review.aprovado !== true,
    campaignMode: getCurrentCampaignModes().join(","),
    reviewApproved: true, // publica sempre sem revisão manual
    reviewJson: JSON.stringify({ ...review, meiPhase, postIntent: resolvedIntent }),
    aiModel,
  };
}

// ─── Salvar post MEI no DB ──────────────────────────────────────────────────
export async function saveMeiBlogPost(
  post: Awaited<ReturnType<typeof generateMeiBlogPost>>,
) {
  let slug = post.slug;
  const exists = await prisma.blogPost.findFirst({
    where: { slug },
    select: { id: true },
  });
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
      coverImage: post.coverImage ?? null,
      imageAlt: post.imageAlt ?? post.title,
      imageAttribution: post.imageAttribution ?? null,
      published: post.reviewApproved,
      postType: post.postType ?? null,
      audience: post.audience ?? null,
      searchIntent: post.searchIntent ?? null,
      factScore: post.factScore ?? null,
      riskScore: post.riskScore ?? null,
      needsReview: post.needsReview ?? !post.reviewApproved,
      campaignMode: post.campaignMode ?? null,
      reviewJson: post.reviewJson ?? "",
      aiModel: post.aiModel ?? "",
      categoria: post.categoria,
    },
  });
}
