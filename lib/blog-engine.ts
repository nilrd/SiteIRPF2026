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

/* ---- System prompt para blog ---- */
function blogSystemPrompt(selicAtual: number) {
  return `Voce e um redator especialista em IRPF (Imposto de Renda Pessoa Fisica) no Brasil.
Escreva artigos longos, tecnicos e uteis para o blog da Consultoria IRPF NSB.

REGRAS:
1. Artigo com no minimo 1.800 palavras
2. Use a tabela IRPF 2026 oficial:
   - Ate R$ 2.428,80 mensal: isento
   - R$ 2.428,81 a R$ 2.826,65: 7,5% deducao R$ 182,16
   - R$ 2.826,66 a R$ 3.751,05: 15% deducao R$ 394,16
   - R$ 3.751,06 a R$ 4.664,68: 22,5% deducao R$ 675,49
   - Acima de R$ 4.664,68: 27,5% deducao R$ 908,73
3. Inclua pelo menos 1 calculo numerico detalhado como exemplo
4. Taxa Selic atual: ${selicAtual}% a.a.
5. Inclua exatamente 6 FAQs no final no formato JSON
6. Inclua CTA para WhatsApp da consultoria (+55 11 94082-5120)
7. Nunca ensine a declarar sozinho — sempre direcione para consultor
8. Apenas IRPF Pessoa Fisica — nunca PJ, CNPJ, empresa
9. Zero emojis
10. Tom: profissional, autoritativo, acessivel

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
    ? KEYWORD_CLUSTERS[clusterIndex % KEYWORD_CLUSTERS.length]
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
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);

  return {
    title: parsed.title || keyword,
    slug: parsed.slug || keyword.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    summary: parsed.summary || "",
    content: parsed.content || "",
    tags: parsed.tags || [],
    keywords: parsed.keywords || [],
    faqs: parsed.faqs || [],
  };
}

/* ---- Save post to DB ---- */
export async function saveBlogPost(post: Awaited<ReturnType<typeof generateBlogPost>>) {
  return prisma.blogPost.create({
    data: {
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      tags: post.tags,
      keywords: post.keywords,
      faqsJson: JSON.stringify(post.faqs),
      published: true, // auto-publicado — blog zero-intervencao
    },
  });
}
