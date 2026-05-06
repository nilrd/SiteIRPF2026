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
} from "./mei-context";

export const ALL_MEI_CLUSTERS = [...MEI_KEYWORD_CLUSTERS, ...DESENROLA_KEYWORD_CLUSTERS];

// WA link para CTAs
const WA_MEI_LINK =
  `https://wa.me/5511940825120?text=${encodeURIComponent("Olá Nilson! Li o artigo do blog sobre MEI e preciso de ajuda.")}`;
const WA_IRPF_LINK =
  `https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Vi o artigo sobre MEI e quero declarar meu IRPF 2026.")}`;

// ─── System prompt para blog MEI ─────────────────────────────────────────────
function meiSystemPrompt(keyword: string, categoria: "MEI" | "DESENROLA"): string {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const ctaWhatsApp =
    categoria === "MEI"
      ? `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Ficou com dúvida sobre MEI e Imposto de Renda?</p><p style="margin:0 0 16px;">Nilson Brites é especialista em declarações IRPF para MEI e empreendedores. Atende 100% online para todo o Brasil.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">💬 Falar com especialista no WhatsApp</a></div>`
      : `<div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Regularizou suas dívidas? Regularize também seu IR.</p><p style="margin:0 0 16px;">Depois do Desenrola, o próximo passo é regularizar o CPF na Receita Federal. Nilson Brites cuida disso por você.</p><a href="${WA_IRPF_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">💬 Declarar meu IRPF — falar com Nilson</a></div>`;

  const ctaFinal =
    categoria === "MEI"
      ? `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Precisa de ajuda com MEI e Imposto de Renda?</h3><p style="margin:0 0 8px;">Nilson Brites atende MEI e microempreendedores em todo o Brasil.</p><p style="margin:0 0 24px;">Declarações IRPF, DASN-SIMEI, regularização e consultorias 100% online.</p><a href="${WA_MEI_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">📱 Falar com Nilson sobre meu MEI</a><p style="margin:16px 0 0;font-size:0.85em;color:#999;">Atendimento rápido · Sem burocracia · Todo o Brasil</p></div>`
      : `<div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Próximo passo: regularize seu Imposto de Renda</h3><p style="margin:0 0 8px;">Com o nome limpo pelo Desenrola, regularize também o CPF na Receita Federal.</p><p style="margin:0 0 24px;">Nilson Brites cuida da sua declaração IRPF 100% online.</p><a href="${WA_IRPF_LINK}" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">📱 Declarar meu IRPF agora</a><p style="margin:16px 0 0;font-size:0.85em;color:#999;">Atendimento rápido · Sem burocracia · Todo o Brasil</p></div>`;

  return `${MEI_DATA_CONTEXT}

Você é o ghostwriter do Nilson Brites — Analista Financeiro com mais de 10 anos de experiência, especializado em declarações IRPF para MEI e microempreendedores, atendendo brasileiros 100% online.
IDIOMA OBRIGATÓRIO: português do Brasil (pt-BR), 100% do conteúdo.
Hoje: ${hoje}.

TEMA DO ARTIGO: "${keyword}"
CATEGORIA: ${categoria}

REGRAS ABSOLUTAS — RESPONSABILIDADE FACTUAL:
1. NUNCA invente valores de DAS, limites de faturamento, percentuais de desconto ou prazos não presentes no CONTEXTO FACTUAL MEI acima.
2. Valores oficiais MEI 2026 que PODE usar: limite R$ 81.000/ano, DAS comércio R$ 73,00, DAS serviços R$ 79,90, prazo DASN-SIMEI 31/maio/2026, parcelamento DAS até 60 meses.
3. Desenrola Empresas (se categoria = DESENROLA): descontos 30–90% conforme atraso, prazo 48 meses, limite R$ 15.000/IF (Famílias); Procred MEI: carência 24 meses, prazo 96 meses, crédito até 50% faturamento máx. R$ 180k.
4. NUNCA escreva fórmulas de cálculo de benefícios INSS, regras de aposentadoria ou direito trabalhista — fuja do escopo.
5. IRPF do MEI: apenas mencionar a relação MEI-IRPF PF e direcionar para a consultoria. Nunca ensine a declarar sozinho.
6. Link interno obrigatório: ao falar de IRPF do MEI, sempre linkar para /mei/mei-e-irpf com texto âncora.

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

async function verificarPostMei(content: string, categoria: "MEI" | "DESENROLA"): Promise<MeiReview> {
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
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim());
    return {
      aprovado: parsed.aprovado === true,
      nivel_risco: parsed.nivel_risco || "medio",
      itens_de_risco: Array.isArray(parsed.itens_de_risco) ? parsed.itens_de_risco : [],
      resumo: parsed.resumo || "Verificação sem resultado claro",
    };
  } catch {
    return { aprovado: true, nivel_risco: "baixo", itens_de_risco: [], resumo: "Verificador indisponível" };
  }
}

// ─── Gerador principal ────────────────────────────────────────────────────────
export async function generateMeiBlogPost(clusterIndex?: number, customKeyword?: string) {
  const cluster =
    clusterIndex !== undefined
      ? ALL_MEI_CLUSTERS[clusterIndex % ALL_MEI_CLUSTERS.length]
      : ALL_MEI_CLUSTERS[Math.floor(Math.random() * ALL_MEI_CLUSTERS.length)];

  const keyword = customKeyword || cluster.primary;
  const categoria: "MEI" | "DESENROLA" =
    (cluster as { categoria?: "MEI" | "DESENROLA" }).categoria ??
    (keyword.toLowerCase().includes("desenrola") ? "DESENROLA" : "MEI");

  const systemPrompt = meiSystemPrompt(keyword, categoria);
  const userPrompt = `TEMA OBRIGATÓRIO: "${keyword}". Secundárias: ${
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
    parsed = JSON.parse(result.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim());
  } catch (err) {
    console.error("[MEI Blog] Erro na geração:", err);
    throw new Error(`Falha ao gerar post MEI para keyword: ${keyword}`);
  }

  const content = (parsed.content as string) || "";

  // Verificador pós-geração obrigatório
  const review = await verificarPostMei(`${parsed.title || keyword}\n\n${content}`, categoria);

  // Slug sanitizado
  const baseSlug = ((parsed.slug as string) || keyword)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return {
    keyword,
    categoria,
    title: (parsed.title as string) || keyword,
    slug: baseSlug,
    summary: (parsed.summary as string) || "",
    content,
    tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : [categoria.toLowerCase()],
    keywords: Array.isArray(parsed.keywords) ? (parsed.keywords as string[]) : [],
    faqs: Array.isArray(parsed.faqs) ? (parsed.faqs as { question: string; answer: string }[]) : [],
    imageQuery: (parsed.imageQuery as string) || "small business entrepreneur brazil",
    imageAlt: (parsed.imageAlt as string) || (parsed.title as string) || keyword,
    reviewApproved: review.aprovado,
    reviewJson: JSON.stringify(review),
    aiModel,
  };
}

// ─── Salvar post MEI no DB ──────────────────────────────────────────────────
export async function saveMeiBlogPost(post: Awaited<ReturnType<typeof generateMeiBlogPost>>) {
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
      coverImage: null, // sem imagem automática — admin pode adicionar via painel
      imageAlt: post.imageAlt ?? post.title,
      published: post.reviewApproved,
      reviewJson: post.reviewJson ?? "",
      aiModel: post.aiModel ?? "",
      categoria: post.categoria,
    },
  });
}
