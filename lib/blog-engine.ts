import { groqLlama, MODELS } from "./llm-providers";
import { prisma } from "./prisma";

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

const TRUSTED_SOURCE_URLS = [
  "https://www.gov.br/receitafederal/pt-br",
  "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda",
  "https://www.restituicao.receita.fazenda.gov.br/",
  "https://www.bcb.gov.br",
  "https://www.planalto.gov.br",
  "https://www.ibge.gov.br",
  "https://g1.globo.com/economia/",
  "https://veja.abril.com.br/economia/",
  "https://www.infomoney.com.br/",
] as const;

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
      .slice(0, 5)
      .map((m) => m[1]);

    const parsed = items
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

    return parsed;
  } catch {
    return [];
  }
}

async function getTrustedSourceSnippets(): Promise<ResearchItem[]> {
  const slices = await Promise.all(
    TRUSTED_SOURCE_URLS.map(async (url) => {
      try {
        const res = await fetchWithTimeout(url, 7000);
        if (!res.ok) return null;
        const html = await res.text();
        const text = stripHtml(html).slice(0, 260);
        return {
          title: `Fonte oficial: ${new URL(url).hostname}`,
          url,
          snippet: text,
        };
      } catch {
        return null;
      }
    })
  );

  return slices.filter(Boolean) as ResearchItem[];
}

async function collectResearchContext(keyword: string): Promise<ResearchItem[]> {
  const [news, trusted] = await Promise.all([
    getGoogleNewsResearch(keyword),
    getTrustedSourceSnippets(),
  ]);

  const merged = [...news, ...trusted];
  const dedup = new Map<string, ResearchItem>();
  for (const item of merged) {
    if (!dedup.has(item.url)) dedup.set(item.url, item);
  }
  return Array.from(dedup.values()).slice(0, 8);
}

function ensureSourcesSection(content: string, sources: ResearchItem[]): string {
  if (/fontes/i.test(content)) return content;
  const links = sources
    .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`)
    .join("");
  if (!links) return content;
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

/* ---- Imagens de capa rotativas (picsum.photos — seeds determinísticos) ---- */
const COVER_IMAGES = [
  "https://picsum.photos/seed/irpf-tax1/1200/675",
  "https://picsum.photos/seed/irpf-finance2/1200/675",
  "https://picsum.photos/seed/irpf-business3/1200/675",
  "https://picsum.photos/seed/irpf-data4/1200/675",
  "https://picsum.photos/seed/irpf-finance5/1200/675",
  "https://picsum.photos/seed/irpf-stock6/1200/675",
  "https://picsum.photos/seed/irpf-docs7/1200/675",
  "https://picsum.photos/seed/irpf-rendas8/1200/675",
  "https://picsum.photos/seed/irpf-money9/1200/675",
  "https://picsum.photos/seed/irpf-person10/1200/675",
  "https://picsum.photos/seed/irpf-work11/1200/675",
  "https://picsum.photos/seed/irpf-audit12/1200/675",
];
function getRandomCoverImage(): string {
  return COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)];
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

/* ---- System prompt para blog ---- */
function blogSystemPrompt(
  selicAtual: number,
  research: ResearchItem[],
  existingPosts: ExistingPostSnapshot[]
) {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const researchBlock = research.length
    ? research
        .map((r, idx) => `${idx + 1}. ${r.title}\nURL: ${r.url}\nResumo: ${r.snippet}`)
        .join("\n\n")
    : "Sem dados recentes de internet disponiveis. Use apenas fontes oficiais atemporais e explicite incertezas de data.";

  const existingBlock = existingPosts.length
    ? existingPosts
        .slice(0, 40)
        .map((p, i) => `${i + 1}. ${p.title} | slug: ${p.slug}`)
        .join("\n")
    : "Sem historico de posts publicado disponivel.";

  return `Voce e um redator especialista em financas pessoais, IRPF e tributacao no Brasil.
Escreva artigos longos, educativos e uteis para o blog da Consultoria IRPF NSB.
Data de publicacao: ${hoje}.

DADOS PESQUISADOS NA INTERNET (priorize estes links e cite URL exata ao usar):
${researchBlock}

POSTS JA PUBLICADOS (NAO REPETIR TITULO NEM ANGULO):
${existingBlock}

REGRAS INEGOCIAVEIS:
1. NUNCA invente dados, noticias, leis ou percentuais. Use APENAS informacoes verificaveis de fontes oficiais.
2. Para cada dado numerico ou legal citado, informe a fonte: Receita Federal (gov.br/receitafederal), BCB (bcb.gov.br), Previdencia (gov.br/previdencia), Planalto (planalto.gov.br), IBGE (ibge.gov.br).
3. Se nao tiver certeza de uma data exata de evento recente, use "conforme legislacao vigente" — nunca invente datas.
4. Artigo com no minimo 1.800 palavras em HTML semantico.
5. Inclua pelo menos 1 exemplo numerico calculado passo a passo.
6. Taxa Selic atual: ${selicAtual}% a.a. (Fonte: Banco Central do Brasil, ${hoje}).
7. Tabela IRPF 2026 oficial (Fonte: Receita Federal / Lei 15.270/2025):
   - Ate R$ 2.428,80/mes: isento
   - R$ 2.428,81 a R$ 2.826,65: 7,5% (deducao R$ 182,16)
   - R$ 2.826,66 a R$ 3.751,05: 15% (deducao R$ 394,16)
   - R$ 3.751,06 a R$ 4.664,68: 22,5% (deducao R$ 675,49)
   - Acima de R$ 4.664,68: 27,5% (deducao R$ 908,73)
8. Inclua exatamente 6 FAQs reais no final.
9. Inclua CTA para WhatsApp (+55 11 94082-5120) no meio e no final do artigo.
10. Inclua secao "Fontes" ao final com URLs reais de orgaos oficiais citados no texto.
11. Adicione nota de rodape: "Conteudo de carater educativo. Para analise do seu caso especifico, consulte o especialista Nilson Brites — Consultoria IRPF NSB."
12. Zero emojis. Tom: profissional, autoritativo, acessivel ao publico geral.
13. Nao repetir temas com o mesmo enquadramento: se o assunto for parecido com posts existentes, mude a lente (ex.: checklist, erros comuns, comparativo, estudo de caso, mitos e verdades).
14. Titulo deve ser forte e atrair clique com curiosidade legitima (sem sensacionalismo ridiculo, sem promessa enganosa, sem clickbait abusivo).

OTIMIZACAO SEO E AEO (Answer Engine Optimization):
- Primeiro paragrafo: responda diretamente a pergunta principal em 1-2 frases (featured snippet)
- Cada H2 deve ser uma pergunta ou afirmacao clara que antecipa o que o leitor busca
- Use a keyword principal no title, no primeiro paragrafo e no last H2
- Inclua dados numericos concretos (valores, percentuais, prazos, exemplos calculados)
- Linguagem clara para voz: frases curtas, sujeito-verbo-objeto
- FAQs devem ser perguntas reais que usuarios digitam no Google sobre o tema
- Gere um "gancho" de curiosidade no titulo e na introducao, mantendo rigor tecnico e legal

FORMATO DE SAIDA (JSON):
{
  "title": "titulo SEO com keyword principal, max 65 caracteres",
  "slug": "slug-do-artigo-com-keywords",
  "summary": "resposta direta a pergunta do titulo em 150-160 caracteres, incluindo dado numerico",
  "content": "conteudo HTML completo com h2, h3, p, ul, li, table, strong — minimo 1800 palavras",
  "tags": ["tag1", "tag2", "tag3"],
  "keywords": ["keyword-principal", "keyword-secundaria-1", "keyword-secundaria-2"],
  "faqs": [{"question": "pergunta real de usuario", "answer": "resposta direta e completa em 50-100 palavras"}]
}`;
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

  const trendKeyword = await getTrendTopicFromInternet();
  const keyword = customKeyword || trendKeyword || cluster?.primary || "IRPF 2026";
  const secundarias = cluster?.secondary?.join(", ") || "";
  const research = await collectResearchContext(keyword);

  async function runGeneration(extraInstruction?: string) {
    const completion = await groqLlama.chat.completions.create({
      model: MODELS.blogGeneration,
      messages: [
        { role: "system", content: blogSystemPrompt(selicAtual, research, existingPosts) },
        {
          role: "user",
          content: `Escreva um artigo completo sobre: "${keyword}"${
            secundarias ? `. Keywords secundarias: ${secundarias}` : ""
          }. ${extraInstruction || ""} Retorne APENAS o JSON valido, sem markdown.`,
        },
      ],
      temperature: 0.35,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(raw);
  }

  let parsed = await runGeneration();

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

  const content = ensureSourcesSection(parsed.content || "", research);

  return {
    title: parsed.title || keyword,
    slug: baseSlug,
    summary: parsed.summary || "",
    content,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
    coverImage: getRandomCoverImage(),
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
      published: true,
    },
  });
}
