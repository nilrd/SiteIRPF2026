import { prisma } from "@/lib/prisma";
import { validateAmazonAffiliateImageCompliance } from "@/lib/affiliate-image-compliance";
import {
  AMAZON_AFFILIATE_POSTS,
  type AmazonAffiliatePostDef,
} from "@/lib/amazon-affiliate-content-map";

const AMAZON_IMAGE_URL_SCAN_REGEX =
  /https:\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com)\/images\/I\/[^"'\s)<>]+/gi;

const VALID_AMAZON_IMAGE_URL_REGEX =
  /https:\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com)\/images\/I\/[^"'\s|?<>]+\.(?:jpe?g|png|webp)(?:\?[^"'\s<>]*)?/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripAmazonTitle(rawTitle: string): string {
  return rawTitle.replace(/\s*\|\s*Amazon\.com\.br\s*$/i, "").trim();
}

function sanitizeAmazonImageUrl(rawUrl: string): string {
  const cleaned = rawUrl
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  const match = cleaned.match(VALID_AMAZON_IMAGE_URL_REGEX);
  return match?.[0]?.trim() ?? "";
}

function extractMetaContent(html: string, key: string): string | undefined {
  const reProperty = new RegExp(
    `<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const reName = new RegExp(
    `<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );

  return reProperty.exec(html)?.[1] ?? reName.exec(html)?.[1] ?? undefined;
}

async function fetchAmazonSnapshot(url: string): Promise<{
  title?: string;
  image?: string;
  description?: string;
  details?: {
    pages?: number;
    publisher?: string;
    publicationDate?: string;
  };
  rating?: {
    score?: number;
    count?: number;
  };
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });

    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch?.[1] ? stripAmazonTitle(titleMatch[1]) : undefined;

    const ogImage = extractMetaContent(html, "og:image");
    const twitterImage = extractMetaContent(html, "twitter:image");
    const scannedCandidates = Array.from(
      new Set((html.match(AMAZON_IMAGE_URL_SCAN_REGEX) ?? []).map((img) => img.trim())),
    );
    const imageCandidates = [ogImage, twitterImage, ...scannedCandidates].filter(
      (candidate): candidate is string => Boolean(candidate),
    );
    const pickedImageCandidate =
      imageCandidates.find((img) => !img.toLowerCase().includes("thumb")) ?? imageCandidates[0];
    const sanitizedImage = pickedImageCandidate
      ? sanitizeAmazonImageUrl(pickedImageCandidate)
      : "";
    const image = sanitizedImage || undefined;

    // Extrair descrição
    const descMatch = html.match(
      /<div id="bookDescription_feature_div" class="a-section a-spacing-small a-padding-small">([\s\S]*?)<\/div>/i,
    );
    const description = descMatch?.[1]
      ? descMatch[1]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : undefined;

    // Extrair detalhes
    const details: { pages?: number; publisher?: string; publicationDate?: string } = {};
    const pagesMatch = html.match(/<span>Número de páginas<\/span>[\s\S]*?<span>(\d+) páginas<\/span>/i);
    if (pagesMatch?.[1]) details.pages = parseInt(pagesMatch[1], 10);

    const publisherMatch = html.match(
      /<span>Editora<\/span>[\s\S]*?<span>(.*?)<\/span>/i,
    );
    if (publisherMatch?.[1]) details.publisher = publisherMatch[1].split(";")[0].trim();

    const pubDateMatch = html.match(
      /<span>Data da publicação<\/span>[\s\S]*?<span>(.*?)<\/span>/i,
    );
    if (pubDateMatch?.[1]) details.publicationDate = pubDateMatch[1].trim();

    // Extrair avaliação
    const rating: { score?: number; count?: number } = {};
    const scoreMatch = html.match(/data-hook="rating-out-of-text".*?>([\d,.]+) de 5</i);
    if (scoreMatch?.[1]) rating.score = parseFloat(scoreMatch[1].replace(",", "."));

    const countMatch = html.match(/data-hook="total-review-count".*?>([\d.,]+)/i);
    if (countMatch?.[1]) rating.count = parseInt(countMatch[1].replace(/\D/g, ""), 10);

    return { title, image, description, details: Object.keys(details).length > 0 ? details : undefined, rating: Object.keys(rating).length > 0 ? rating : undefined };
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveAmazonProductContext(post: AmazonAffiliatePostDef): Promise<{
  resolvedTitle: string;
  coverImage: string;
  description?: string;
  details?: {
    pages?: number;
    publisher?: string;
    publicationDate?: string;
  };
  rating?: {
    score?: number;
    count?: number;
  };
}> {
  const shortSnapshot = await fetchAmazonSnapshot(post.amazonShortUrl);
  const finalSnapshot = await fetchAmazonSnapshot(post.amazonFinalUrl);

  const resolvedTitle =
    finalSnapshot.title || shortSnapshot.title || `${post.productTitle} — ${post.author}`;

  const coverImage =
    finalSnapshot.image || shortSnapshot.image || post.productImageUrl || "";

  const description = finalSnapshot.description || shortSnapshot.description;
  const details = finalSnapshot.details || shortSnapshot.details;
  const rating = finalSnapshot.rating || shortSnapshot.rating;

  return { resolvedTitle, coverImage, description, details, rating };
}

function buildAmazonEditorialContent(
  post: AmazonAffiliatePostDef,
  context: {
    resolvedTitle: string;
    coverImage: string;
    description?: string;
    details?: {
      pages?: number;
      publisher?: string;
      publicationDate?: string;
    };
    rating?: {
      score?: number;
      count?: number;
    };
  },
): string {
  const { resolvedTitle, coverImage, description, details, rating } = context;
  const safeCoverImage = sanitizeAmazonImageUrl(coverImage);
  const imageBlock = safeCoverImage
    ? `<figure>
  <img src="${safeCoverImage}" alt="Capa original do produto ${escapeHtml(post.productTitle)} na Amazon" loading="lazy" />
  <figcaption>Imagem original do produto na Amazon.</figcaption>
</figure>`
    : "";

  const labelFormato = post.format === "ebook" ? "eBook Kindle" : "Livro físico";

  const ratingBlock = rating?.score && rating.count
    ? `<p><strong>Avaliação:</strong> ${"★".repeat(Math.round(rating.score))}${"☆".repeat(5 - Math.round(rating.score))} ${rating.score.toFixed(1)} de 5 estrelas (baseado em ${rating.count.toLocaleString("pt-BR")} avaliações).</p>`
    : "";

  const detailsBlock = details
    ? `<h3>Detalhes do Produto</h3>
      <ul>
        ${details.publisher ? `<li><strong>Editora:</strong> ${escapeHtml(details.publisher)}</li>` : ""}
        ${details.pages ? `<li><strong>Número de páginas:</strong> ${details.pages}</li>` : ""}
        ${details.publicationDate ? `<li><strong>Data de publicação:</strong> ${details.publicationDate}</li>` : ""}
      </ul>`
    : "";
  
  const descriptionBlock = description
    ? `<h2>Descrição Oficial do Produto</h2>
      <p>${escapeHtml(description)}</p>`
    : "";

  return `<section>
<p><strong>Resenha aplicada para a vida real.</strong> Este conteúdo foi construído para ajudar você a decidir com clareza se o livro faz sentido para o seu momento financeiro.</p>

<h2>${escapeHtml(resolvedTitle)}</h2>
<p>Análise prática para quem quer melhorar decisões financeiras e chegar na época do IRPF com muito mais organização.</p>

${imageBlock}

<div style="border:3px solid #0A0A0A;padding:18px;margin:18px 0 26px;background:#C6FF00;color:#0A0A0A;box-shadow:8px 8px 0 #0A0A0A;">
  <p style="font-size:11px;letter-spacing:0.12em;font-weight:800;text-transform:uppercase;margin:0 0 10px;">Oferta em destaque na Amazon</p>
  <p style="margin:0 0 8px;"><strong>Produto analisado:</strong> ${escapeHtml(post.productTitle)} · ${escapeHtml(post.author)}</p>
  <p style="margin:0 0 8px;"><strong>Formato:</strong> ${labelFormato}. Conteúdo alinhado com a página real do produto na Amazon.</p>
  ${ratingBlock}
  <ul style="margin:10px 0 14px;padding-left:18px;line-height:1.6;">
    <li>Abra a página oficial e confirme edição, preço e condições atualizadas.</li>
    <li>Decida com base no seu momento financeiro atual, sem impulso.</li>
  </ul>
  <p style="margin:0;">
    <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer" style="display:inline-block;background:#0A0A0A;color:#C6FF00;padding:14px 18px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;border:2px solid #0A0A0A;">
      Conferir preço agora na Amazon →
    </a>
  </p>
  <p style="font-size:12px;opacity:.85;margin:10px 0 0;">O valor pode mudar a qualquer momento. Verifique no link oficial.</p>
</div>

${descriptionBlock}
${detailsBlock}

<h2>O que este livro entrega de valor prático</h2>
<p>Sem promessas mágicas, o conteúdo trabalha mentalidade financeira aplicada ao cotidiano. O foco está em transformar decisões pequenas e repetidas em construção de patrimônio.</p>
<ul>
  <li>Decisões de consumo com foco no ciclo completo do dinheiro, e não só no preço do momento.</li>
  <li>Estratégias para reduzir vazamentos de caixa que parecem inofensivos, mas corroem metas.</li>
  <li>Organização para objetivos concretos: reserva, investimento e previsibilidade.</li>
</ul>

<h2>Como isso se encaixa no seu IRPF e na sua rotina financeira</h2>
<p>No site do Nilson, o foco não é só entregar declaração. É construir rotina financeira para reduzir erro e retrabalho. A leitura ajuda a organizar entradas, saídas, comprovantes e metas.</p>
<blockquote>${escapeHtml(post.fitToSite)}</blockquote>

<table>
    <thead>
      <tr>
        <th>Perfil</th>
        <th>Ganho com a leitura</th>
        <th>Impacto no IRPF</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Autônomo / MEI</td>
        <td>Separar caixa pessoal e profissional com disciplina</td>
        <td>Menos inconsistência ao consolidar rendimentos e despesas</td>
      </tr>
      <tr>
        <td>CLT com renda extra</td>
        <td>Controle de múltiplas fontes de renda</td>
        <td>Declaração mais limpa e fácil de conferir</td>
      </tr>
      <tr>
        <td>Família ajustando orçamento</td>
        <td>Planejamento de metas sem depender de improviso</td>
        <td>Documentação mais organizada para deduções e patrimônio</td>
      </tr>
    </tbody>
</table>

<h2>Para quem vale a pena comprar</h2>
<p>Se você quer decisões financeiras melhores no mundo real, este título entrega mais que teoria. Funciona especialmente para quem vive de renda variável, presta serviço e precisa de clareza financeira.</p>
<p>Se a prioridade agora é sair da desorganização e reduzir riscos na declaração, é uma leitura bem direcionada.</p>

<div style="border:3px solid #0A0A0A;padding:18px;margin:24px 0;background:#0A0A0A;color:#F5F5F2;">
  <p style="font-size:11px;letter-spacing:0.12em;font-weight:800;text-transform:uppercase;color:#C6FF00;margin:0 0 10px;">Decisão rápida</p>
  <p style="margin:0 0 12px;"><strong>Se o conteúdo fez sentido para sua fase:</strong> abra o produto oficial na Amazon e valide preço, edição e entrega antes de fechar.</p>
  <p style="margin:0 0 10px;">
    <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:14px 18px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;border:2px solid #C6FF00;">
      Quero ver a oferta oficial →
    </a>
  </p>
  <p style="font-size:12px;opacity:.8;margin:0;">Link de afiliado. Você não paga nada a mais por isso.</p>
</div>

<h2>Perguntas rápidas (FAQ)</h2>
<h3>É conteúdo para iniciante?</h3>
<p>Sim. A abordagem é acessível e prática, sem depender de jargão técnico para aplicação real.</p>
<h3>Ajuda quem quer organizar o IRPF?</h3>
<p>Ajuda bastante na base: rotina de registro, disciplina e previsibilidade financeira, que são pilares para declarar com menos risco.</p>
<h3>Tem link oficial do produto?</h3>
<p>Sim. O link oficial usado nesta análise é: <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer">${post.amazonShortUrl}</a>.</p>
</section>`;
}

export interface AmazonAffiliatePostResult {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  keywords: string[];
  faqsJson: string;
  coverImage: string;
  imageAlt: string;
  metaTitle: string;
  metaDesc: string;
  aiModel: string;
  source: {
    amazonShortUrl: string;
    amazonFinalUrl: string;
    asin: string;
    resolvedTitle: string;
    description?: string;
    details?: {
      pages?: number;
      publisher?: string;
      publicationDate?: string;
    };
    rating?: {
      score?: number;
      count?: number;
    };
  };
}

export async function generateAmazonAffiliatePost(
  post: AmazonAffiliatePostDef,
): Promise<AmazonAffiliatePostResult> {
  const context = await resolveAmazonProductContext(post);

  const content = buildAmazonEditorialContent(post, context);

  const faqs = [
    {
      question: `${post.productTitle} vale a pena para quem quer organizar a vida financeira?`,
      answer:
        "Vale para quem quer método prático, disciplina e visão de longo prazo para decisões de renda, consumo e construção de patrimônio.",
    },
    {
      question: "Este conteúdo tem conexão com organização para IRPF?",
      answer:
        "Sim. A organização financeira diária reduz erro documental e melhora a consistência das informações na hora de declarar.",
    },
    {
      question: "Onde vejo o produto original analisado?",
      answer: `No link oficial da Amazon usado nesta análise: ${post.amazonShortUrl}`,
    },
  ];

  return {
    slug: post.slug,
    title: post.titleHint,
    summary: post.metaDescHint,
    content,
    tags: post.tags,
    keywords: post.keywords,
    faqsJson: JSON.stringify(faqs),
    coverImage: context.coverImage,
    imageAlt: `Imagem original do produto ${post.productTitle} na Amazon`,
    metaTitle: post.titleHint.slice(0, 60),
    metaDesc: post.metaDescHint,
    aiModel: "amazon-editorial-template-v2", // Version bump
    source: {
      amazonShortUrl: post.amazonShortUrl,
      amazonFinalUrl: post.amazonFinalUrl,
      asin: post.asin,
      resolvedTitle: context.resolvedTitle,
      description: context.description,
      details: context.details,
      rating: context.rating,
    },
  };
}

export async function saveAmazonAffiliatePost(
  result: AmazonAffiliatePostResult,
  options?: { overwriteExisting?: boolean },
): Promise<{ id: string; slug: string; title: string; needsReview: boolean }> {
  const overwriteExisting = options?.overwriteExisting === true;
  const existing = await prisma.blogPost.findFirst({
    where: { slug: result.slug },
    select: { id: true, slug: true, title: true, needsReview: true },
  });

  if (existing && !overwriteExisting) {
    return {
      id: existing.id,
      slug: existing.slug,
      title: existing.title,
      needsReview: existing.needsReview,
    };
  }

  const affiliateCompliance = await validateAmazonAffiliateImageCompliance({
    content: result.content,
    coverImage: result.coverImage,
  });

  const data = {
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
      published: !affiliateCompliance.needsReview,
      hiddenFromBlogList: true,
      categoria: "GERAL",
      postType: "traffic",
      audience: "afiliados-amazon-financas",
      searchIntent: "comercial-investigativa",
      needsReview: affiliateCompliance.needsReview,
      aiModel: result.aiModel,
      reviewJson: JSON.stringify({
        source: "amazon-affiliate-engine",
        affiliateCompliance,
        product: result.source,
        generatedAt: new Date().toISOString(),
      }),
      campaignMode: "amazon-afiliados",
    };

  const saved = existing
    ? await prisma.blogPost.update({
        where: { id: existing.id },
        data,
        select: { id: true, slug: true, title: true, needsReview: true },
      })
    : await prisma.blogPost.create({
        data,
        select: { id: true, slug: true, title: true, needsReview: true },
      });

  return saved;
}

export async function getMissingAmazonAffiliateSlugs(): Promise<string[]> {
  const allSlugs = AMAZON_AFFILIATE_POSTS.map((post) => post.slug);
  const existing = await prisma.blogPost.findMany({
    where: { slug: { in: allSlugs } },
    select: { slug: true },
  });

  const existingSet = new Set(existing.map((item) => item.slug));
  return allSlugs.filter((slug) => !existingSet.has(slug));
}
