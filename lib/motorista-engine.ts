/**
 * Engine de geração de posts sobre motoristas de aplicativo.
 * Usa callWithFallback (mesma cadeia Gemini → Groq → Mistral → OpenAI do blog-engine).
 * Posts são ocultos da listagem principal mas indexáveis pelo Google.
 *
 * Referral link: https://drivers.uber.com/i/tfbztm6
 */

import { prisma } from "@/lib/prisma";
import { callWithFallback } from "@/lib/llm-providers";
import {
  MOTORISTA_POSTS,
  REFERRAL_LINK,
  UBER_BONUS_TABLE,
  type MotoristPostDef,
} from "@/lib/motorista-content-map";

// ── CTA Blocks (hardcoded — link de indicação) ────────────────────────────────

function buildCtaTop(post: MotoristPostDef): string {
  return `<div class="cta-motorista-top" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 10px;font-size:0.85em;text-transform:uppercase;letter-spacing:0.05em;color:#C6FF00;font-weight:700;">Oferta exclusiva</p><p style="margin:0 0 12px;font-weight:700;font-size:1.1em;">${post.bonusHighlight}</p><p style="margin:0 0 16px;font-size:0.95em;">Use o link abaixo para garantir o bônus. Válido para novos motoristas que completarem as viagens no prazo.</p><a href="${REFERRAL_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 28px;font-weight:700;text-decoration:none;font-size:1em;">Cadastrar com bônus →</a></div>`;
}

function buildCtaMid(): string {
  return `<div class="cta-motorista-mid" style="background:#1A1A1A;color:#F5F5F2;padding:20px 24px;margin:40px 0;border-radius:0;border-top:3px solid #C6FF00;border-bottom:3px solid #C6FF00;"><p style="margin:0 0 10px;font-weight:700;">Ainda não se cadastrou na Uber?</p><p style="margin:0 0 16px;font-size:0.95em;">Use o link de indicação e comece já com um bônus garantido nas suas primeiras corridas — sem custo adicional.</p><a href="${REFERRAL_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 28px;font-weight:700;text-decoration:none;">Usar link com bônus</a></div>`;
}

function buildCtaFinal(bonusHighlight: string): string {
  return `<div class="cta-motorista-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.3em;">Pronto para começar?</h3><p style="margin:0 0 8px;font-size:0.95em;">${bonusHighlight}</p><p style="margin:0 0 24px;font-size:0.9em;color:#aaa;">Oferta válida para novos cadastros via link de indicação. Bônus creditado após cumprir a meta de viagens.</p><a href="${REFERRAL_LINK}" target="_blank" rel="noopener noreferrer sponsored" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 40px;font-weight:700;text-decoration:none;font-size:1.05em;">Cadastrar na Uber com bônus</a></div>`;
}

// ── Cover Images (curadas — carro, moto, delivery, estrada) ──────────────────

const MOTORISTA_COVER_IMAGES = [
  // Carro em estrada
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&h=630&q=80",
  // Volante / interior carro
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=630&q=80",
  // Motorista abrindo app no celular
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1200&h=630&q=80",
  // Entrega delivery / mochila térmica
  "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=1200&h=630&q=80",
  // Moto na cidade
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=630&q=80",
  // Bicicleta entregador urbano
  "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&h=630&q=80",
  // Rua noturna / luzes cidade
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=630&q=80",
  // Celular com app de transporte
  "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&h=630&q=80",
  // Dinheiro / notas — renda
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=630&q=80",
  // Trabalhador autônomo com laptop
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
];

function getCoverByCluster(post: MotoristPostDef): string {
  const map: Record<string, number> = {
    "CLUSTER_A": 0,
    "CLUSTER_B": 8,
    "CLUSTER_C": 3,
    "CLUSTER_D": 9,
  };
  const base = map[post.cluster] ?? 0;
  const offset = MOTORISTA_POSTS.indexOf(post) % 3;
  return MOTORISTA_COVER_IMAGES[(base + offset) % MOTORISTA_COVER_IMAGES.length];
}

// ── System Prompt ─────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `Você é um redator especializado em conteúdo para motoristas e entregadores de aplicativo no Brasil.
IDIOMA OBRIGATÓRIO: português do Brasil (pt-BR) em 100% do conteúdo.

CONTEXTO: ${hoje}. O conteúdo deve ser preciso, prático e motivacional.
O leitor é uma pessoa que está considerando se tornar motorista/entregador de app ou quer aumentar seus ganhos.

TOM E ESTILO:
- Direto, honesto, empático — como um amigo que já está no ramo explicando para quem vai entrar
- Parágrafos curtos (máximo 4 linhas)
- Use frases de impacto no início de cada seção
- Dados reais, sem exageros ou promessas impossíveis
- Zero emojis no texto corrido

DADOS DA UBER (verificados — 2025):
- Bônus UberX: R$ ${UBER_BONUS_TABLE.uberX.valor} para ${UBER_BONUS_TABLE.uberX.viagens} viagens em ${UBER_BONUS_TABLE.uberX.dias} dias
- Bônus Táxi: R$ ${UBER_BONUS_TABLE.taxi.valor} para ${UBER_BONUS_TABLE.taxi.viagens} viagens em ${UBER_BONUS_TABLE.taxi.dias} dias
- Bônus Moto (corrida): R$ ${UBER_BONUS_TABLE.moto.valor} para ${UBER_BONUS_TABLE.moto.viagens} viagens em ${UBER_BONUS_TABLE.moto.dias} dias
- Bônus Entrega Carro: R$ ${UBER_BONUS_TABLE.entregaCarro.valor} para ${UBER_BONUS_TABLE.entregaCarro.entregas} entregas em ${UBER_BONUS_TABLE.entregaCarro.dias} dias
- Bônus Entrega Bicicleta: R$ ${UBER_BONUS_TABLE.entregaBicicleta.valor} para ${UBER_BONUS_TABLE.entregaBicicleta.entregas} entregas em ${UBER_BONUS_TABLE.entregaBicicleta.dias} dias
- Bônus Entrega Moto: R$ ${UBER_BONUS_TABLE.entregaMoto.valor} para ${UBER_BONUS_TABLE.entregaMoto.entregas} entregas em ${UBER_BONUS_TABLE.entregaMoto.dias} dias
- Bônus Geral (link indicação): R$ ${UBER_BONUS_TABLE.geral.valor} pelas ${UBER_BONUS_TABLE.geral.viagens} primeiras viagens em ${UBER_BONUS_TABLE.geral.dias} dias
- Comissão Uber: 25% sobre o valor da corrida (motorista fica com 75%)
- Saque mínimo: R$ 1,00 — disponível 24h

REGRAS DO CONTEÚDO:
1. NUNCA invente valores exatos de ganhos por hora sem citar que é uma estimativa
2. Sempre mencione custos reais (combustível, manutenção, INSS)
3. Cite o bônus específico do post como oportunidade concreta — não como garantia absoluta
4. Inclua pelo menos uma tabela HTML com dados comparativos (horas, ganhos, custos)
5. Mencione o link de indicação como forma de garantir o bônus de cadastro
6. Para posts CLUSTER_D (IRPF): incluir informações corretas sobre carnê-leão e livro-caixa

ESTRUTURA OBRIGATÓRIA DO POST:
1. Lead forte (1-2 parágrafos) — situação real do leitor, SEM começar com "Uber é..."
2. [BLOCO CTA TOPO — inserido pelo sistema — não gere aqui]
3. Corpo principal com H2 e H3, mínimo 4 seções, incluindo 1 tabela HTML
4. [BLOCO CTA MEIO — inserido pelo sistema — não gere aqui]
5. Seção de conclusão com próximo passo claro
6. [BLOCO CTA FINAL — inserido pelo sistema — não gere aqui]
7. Seção de FAQs (responder exatamente as perguntas do campo faqQuestions)

IMPORTANTE: NÃO inclua nenhum CTA ou link de afiliado diretamente no conteúdo.
Os blocos CTA são inseridos pelo sistema após a geração. Foque em gerar conteúdo informativo de alta qualidade.

SAÍDA: JSON estrito com os seguintes campos:
{
  "title": "título otimizado SEO (máx 65 chars)",
  "slug": "slug-em-kebab-case-sem-acentos",
  "summary": "meta description/resumo (140-160 chars)",
  "content": "conteúdo HTML completo (mínimo 2000 palavras) SEM os blocos CTA — apenas o conteúdo informativo",
  "tags": ["array", "de", "tags"],
  "keywords": ["array", "de", "keywords-seo"],
  "faqs": [
    {"question": "pergunta exata do faqQuestions", "answer": "resposta completa em HTML (1-3 parágrafos)"}
  ],
  "imageAlt": "descrição da imagem de capa para SEO",
  "metaTitle": "título para <title> tag (máx 60 chars)"
}`;
}

// ── User Prompt por post ──────────────────────────────────────────────────────

function buildUserPrompt(post: MotoristPostDef): string {
  return `Escreva um artigo completo sobre: "${post.keyword}"

ÂNGULO EDITORIAL OBRIGATÓRIO: ${post.angle}

TÍTULO SUGERIDO: ${post.titleHint}
(Adapte se necessário para ficar mais forte — mas mantenha a keyword principal)

META DESCRIPTION SUGERIDA: ${post.metaDescHint}
(Pode ajustar — deve ter 140-160 chars)

DESTAQUE DO BÔNUS NESTE POST: ${post.bonusHighlight}

PERFIL DO LEITOR: ${post.perfil}

PERGUNTAS FREQUENTES (responder TODAS na seção FAQs do JSON):
${post.faqQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

TAGS SUGERIDAS: ${post.tags.join(", ")}
KEYWORDS SUGERIDAS: ${post.keywords.join(", ")}

Lembre-se: o conteúdo deve ser PRÁTICO e HONESTO. 
Use pelo menos uma tabela HTML comparativa.
Mínimo 2000 palavras de conteúdo informativo.
NÃO inclua links ou blocos CTA no content — eles são inseridos pelo sistema.`;
}

// ── Injeta CTAs no conteúdo gerado ───────────────────────────────────────────

function injectCtas(
  content: string,
  post: MotoristPostDef,
): string {
  const ctaTop = buildCtaTop(post);
  const ctaMid = buildCtaMid();
  const ctaFinal = buildCtaFinal(post.bonusHighlight);

  // Localiza o primeiro </p> ou </h2> para inserir CTA do topo
  const topInsertIdx = (() => {
    const firstH2 = content.indexOf("</h2>");
    const firstP = content.indexOf("</p>");
    const idx =
      firstH2 !== -1 && firstP !== -1
        ? Math.min(firstH2, firstP)
        : firstH2 !== -1
          ? firstH2
          : firstP;
    return idx !== -1 ? idx + (content[idx + 1] === "<" ? 5 : 4) : 0;
  })();

  const withTop =
    topInsertIdx > 0
      ? content.slice(0, topInsertIdx) +
        "\n" +
        ctaTop +
        "\n" +
        content.slice(topInsertIdx)
      : ctaTop + "\n" + content;

  // Insere CTA do meio aproximadamente na metade do conteúdo
  const midPoint = Math.floor(withTop.length * 0.55);
  const midH2 = withTop.indexOf("</h2>", midPoint);
  const midInsertIdx = midH2 !== -1 ? midH2 + 5 : midPoint;

  const withMid =
    withTop.slice(0, midInsertIdx) +
    "\n" +
    ctaMid +
    "\n" +
    withTop.slice(midInsertIdx);

  // CTA final vai antes do último <h2> ou no final
  const lastH2 = withMid.lastIndexOf("<h2");
  const finalInsertIdx = lastH2 > 0 ? lastH2 : withMid.length;

  const withFinal =
    withMid.slice(0, finalInsertIdx) +
    "\n" +
    ctaFinal +
    "\n" +
    withMid.slice(finalInsertIdx);

  return withFinal;
}

// ── Geração principal ─────────────────────────────────────────────────────────

export interface MotoristPostResult {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  keywords: string[];
  faqsJson: string;
  coverImage: string;
  imageAlt: string;
  metaTitle: string | null;
  metaDesc: string | null;
  aiModel: string;
}

export async function generateMotoristPost(
  post: MotoristPostDef,
): Promise<MotoristPostResult> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(post);

  const { text, model } = await callWithFallback(
    systemPrompt,
    userPrompt,
    8000,
    {
      temperature: 0.4,
      response_format: { type: "json_object" },
    },
  );

  // Parse JSON retornado pelo modelo
  let parsed: Record<string, unknown>;
  try {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Falha ao parsear JSON do modelo para post "${post.slug}": ${text.slice(0, 200)}`,
    );
  }

  // Slug: usa o do mapa de conteúdo (garantido único e SEO-friendly)
  const slug = post.slug;

  // Conteúdo com CTAs injetados
  const rawContent =
    typeof parsed.content === "string" ? parsed.content : "";
  const contentWithCtas = injectCtas(rawContent, post);

  // Normaliza FAQs
  type FaqRaw = { question?: unknown; answer?: unknown };
  const faqs = Array.isArray(parsed.faqs)
    ? (parsed.faqs as FaqRaw[]).map((f) => ({
        question: typeof f.question === "string" ? f.question : "",
        answer: typeof f.answer === "string" ? f.answer : "",
      }))
    : post.faqQuestions.map((q) => ({ question: q, answer: "" }));

  return {
    slug,
    title:
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim()
        : post.titleHint,
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : post.metaDescHint,
    content: contentWithCtas,
    tags: Array.isArray(parsed.tags)
      ? (parsed.tags as string[])
      : post.tags,
    keywords: Array.isArray(parsed.keywords)
      ? (parsed.keywords as string[])
      : post.keywords,
    faqsJson: JSON.stringify(faqs),
    coverImage: getCoverByCluster(post),
    imageAlt:
      typeof parsed.imageAlt === "string" && parsed.imageAlt.trim()
        ? parsed.imageAlt.trim()
        : post.titleHint,
    metaTitle:
      typeof parsed.metaTitle === "string" && parsed.metaTitle.trim()
        ? parsed.metaTitle.trim()
        : null,
    metaDesc:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : null,
    aiModel: model,
  };
}

// ── Salvar no DB ──────────────────────────────────────────────────────────────

export async function saveMotoristPost(
  result: MotoristPostResult,
): Promise<{ id: string; slug: string; title: string }> {
  // Verifica se o slug já existe
  const existing = await prisma.blogPost.findFirst({
    where: { slug: result.slug },
    select: { id: true, slug: true },
  });

  if (existing) {
    // Já existe — retorna sem duplicar
    return {
      id: existing.id,
      slug: existing.slug,
      title: result.title,
    };
  }

  const saved = await prisma.blogPost.create({
    data: {
      title: result.title,
      slug: result.slug,
      summary: result.summary,
      content: result.content,
      tags: result.tags,
      keywords: result.keywords,
      faqsJson: result.faqsJson,
      coverImage: result.coverImage,
      imageAlt: result.imageAlt,
      metaTitle: result.metaTitle,
      metaDesc: result.metaDesc,
      published: true,
      hiddenFromBlogList: true,
      categoria: "RENDA_EXTRA",
      postType: "traffic",
      audience: "motoristas-entregadores-app",
      searchIntent: "informacional",
      needsReview: false,
      aiModel: result.aiModel,
      reviewJson: JSON.stringify({
        source: "motorista-engine",
        referralLink: REFERRAL_LINK,
        generatedAt: new Date().toISOString(),
      }),
      campaignMode: "motorista-indicacao",
    },
    select: { id: true, slug: true, title: true },
  });

  return saved;
}

// ── Verificar quais slugs ainda não foram gerados ────────────────────────────

export async function getMissingMotoristaSlugs(): Promise<string[]> {
  const allSlugs = MOTORISTA_POSTS.map((p) => p.slug);

  const existing = await prisma.blogPost.findMany({
    where: { slug: { in: allSlugs } },
    select: { slug: true },
  });

  const existingSet = new Set(existing.map((r) => r.slug));
  return allSlugs.filter((s) => !existingSet.has(s));
}
