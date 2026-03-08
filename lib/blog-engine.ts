import { groqLlama, MODELS } from "./llm-providers";
import { prisma } from "./prisma";

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
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1590283603385-17ffb3aa346b?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1579621970563-ebec7cc1e1c5?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=75",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=75",
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
function blogSystemPrompt(selicAtual: number) {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return `Voce e um redator especialista em financas pessoais, IRPF e tributacao no Brasil.
Escreva artigos longos, educativos e uteis para o blog da Consultoria IRPF NSB.
Data de publicacao: ${hoje}.

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

OTIMIZACAO SEO E AEO (Answer Engine Optimization):
- Primeiro paragrafo: responda diretamente a pergunta principal em 1-2 frases (featured snippet)
- Cada H2 deve ser uma pergunta ou afirmacao clara que antecipa o que o leitor busca
- Use a keyword principal no title, no primeiro paragrafo e no last H2
- Inclua dados numericos concretos (valores, percentuais, prazos, exemplos calculados)
- Linguagem clara para voz: frases curtas, sujeito-verbo-objeto
- FAQs devem ser perguntas reais que usuarios digitam no Google sobre o tema

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
  const cluster = clusterIndex !== undefined
    ? ALL_CLUSTERS[clusterIndex % ALL_CLUSTERS.length]
    : null;

  const keyword = customKeyword || cluster?.primary || "IRPF 2026";
  const secundarias = cluster?.secondary?.join(", ") || "";

  const completion = await groqLlama.chat.completions.create({
    model: MODELS.blogGeneration,
    messages: [
      { role: "system", content: blogSystemPrompt(selicAtual) },
      {
        role: "user",
        content: `Escreva um artigo completo sobre: "${keyword}"${
          secundarias ? `. Keywords secundarias: ${secundarias}` : ""
        }. Retorne APENAS o JSON valido, sem markdown.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);

  // Slug sanitizado: remove acentos e caracteres especiais
  const baseSlug = (parsed.slug || keyword)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return {
    title: parsed.title || keyword,
    slug: baseSlug,
    summary: parsed.summary || "",
    content: parsed.content || "",
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
