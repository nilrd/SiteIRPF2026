import { prisma } from "@/lib/prisma";
import { validateAmazonAffiliateImageCompliance } from "@/lib/affiliate-image-compliance";
import {
  AMAZON_AFFILIATE_POSTS,
  type AmazonAffiliatePostDef,
} from "@/lib/amazon-affiliate-content-map";

const AMAZON_IMAGE_URL_REGEX =
  /https:\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com)\/images\/I\/[^"'\s)<>]+/gi;

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

async function fetchAmazonSnapshot(url: string): Promise<{ title?: string; image?: string }> {
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

    const imageCandidates = Array.from(
      new Set((html.match(AMAZON_IMAGE_URL_REGEX) ?? []).map((img) => img.trim())),
    );
    const image =
      imageCandidates.find((img) => !img.toLowerCase().includes("thumb")) ?? imageCandidates[0];

    return { title, image };
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveAmazonProductContext(post: AmazonAffiliatePostDef): Promise<{
  resolvedTitle: string;
  coverImage: string;
}> {
  const shortSnapshot = await fetchAmazonSnapshot(post.amazonShortUrl);
  const finalSnapshot = await fetchAmazonSnapshot(post.amazonFinalUrl);

  const resolvedTitle =
    finalSnapshot.title || shortSnapshot.title || `${post.productTitle} — ${post.author}`;

  const coverImage = finalSnapshot.image || shortSnapshot.image || "";

  return { resolvedTitle, coverImage };
}

function buildAmazonEditorialContent(
  post: AmazonAffiliatePostDef,
  resolvedTitle: string,
  coverImage: string,
): string {
  const imageBlock = coverImage
    ? `<figure style="margin:22px 0 24px;">
  <img src="${coverImage}" alt="Capa original do produto ${escapeHtml(post.productTitle)} na Amazon" style="width:100%;max-width:840px;height:auto;display:block;border:2px solid #C6FF00;" />
  <figcaption style="font-size:0.82rem;color:#9ca3af;margin-top:8px;">Imagem original do produto na Amazon (conforme página oficial).</figcaption>
</figure>`
    : "";

  const labelFormato = post.format === "ebook" ? "eBook Kindle" : "Livro físico";

  return `<article class="amazon-editorial" style="color:#F5F5F2;background:#0A0A0A;line-height:1.72;">
<section style="border-top:4px solid #C6FF00;border-bottom:1px solid #2e2e2e;padding:24px 0 18px;">
  <p style="margin:0 0 10px;font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;color:#C6FF00;font-weight:700;">Resenha aplicada para a vida real</p>
  <h2 style="margin:0 0 12px;font-size:2rem;line-height:1.15;color:#F5F5F2;">${escapeHtml(resolvedTitle)}</h2>
  <p style="margin:0;color:#d1d5db;max-width:900px;">Análise prática focada em quem quer melhorar decisões financeiras, pagar menos juros e chegar na época do IRPF com organização de verdade.</p>
</section>

${imageBlock}

<div style="background:#141414;border-left:4px solid #C6FF00;padding:18px 20px;margin:14px 0 30px;">
  <p style="margin:0 0 8px;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;color:#C6FF00;font-weight:700;">Produto analisado</p>
  <p style="margin:0 0 8px;font-size:1.05rem;font-weight:700;">${escapeHtml(post.productTitle)} · ${escapeHtml(post.author)}</p>
  <p style="margin:0 0 14px;color:#d1d5db;">Formato principal: ${labelFormato}. Este conteúdo foi alinhado com a página real do produto e com aplicação para o contexto financeiro do nosso site.</p>
  <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer" style="display:inline-block;background:#C6FF00;color:#0A0A0A;text-decoration:none;font-weight:800;padding:12px 18px;">Ver produto na Amazon</a>
</div>

<h2 style="font-size:1.45rem;margin:0 0 12px;color:#F5F5F2;">O que este livro entrega de valor prático</h2>
<p style="margin:0 0 14px;">Sem promessas mágicas, o conteúdo trabalha mentalidade financeira aplicada ao cotidiano. A força da obra está em transformar decisões pequenas, repetidas ao longo do mês, em patrimônio acumulado ao longo dos anos.</p>
<ul style="margin:0 0 20px 18px;padding:0;">
  <li>Decisões de consumo com foco no ciclo completo do dinheiro, e não só no preço do momento.</li>
  <li>Estratégias para reduzir vazamentos de caixa que parecem inofensivos, mas corroem metas.</li>
  <li>Organização para objetivos concretos: reserva, investimento e previsibilidade.</li>
</ul>

<h2 style="font-size:1.45rem;margin:0 0 12px;color:#F5F5F2;">Como isso se encaixa no seu IRPF e na sua rotina financeira</h2>
<p style="margin:0 0 12px;">No site do Nilson, o foco não é só entregar declaração. É construir uma rotina que evita dor de cabeça anual. A leitura ajuda a organizar entradas, saídas, comprovantes e metas, facilitando o fechamento fiscal do ano.</p>
<p style="margin:0 0 20px;">${escapeHtml(post.fitToSite)}</p>

<div style="overflow-x:auto;border:1px solid #303030;margin:0 0 26px;">
  <table style="width:100%;border-collapse:collapse;min-width:680px;">
    <thead>
      <tr style="background:#161616;">
        <th style="text-align:left;padding:12px;border-bottom:1px solid #2f2f2f;color:#C6FF00;">Perfil</th>
        <th style="text-align:left;padding:12px;border-bottom:1px solid #2f2f2f;color:#C6FF00;">Ganho com a leitura</th>
        <th style="text-align:left;padding:12px;border-bottom:1px solid #2f2f2f;color:#C6FF00;">Impacto no IRPF</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #272727;">Autônomo / MEI</td>
        <td style="padding:12px;border-bottom:1px solid #272727;">Separar caixa pessoal e profissional com disciplina</td>
        <td style="padding:12px;border-bottom:1px solid #272727;">Menos inconsistência ao consolidar rendimentos e despesas</td>
      </tr>
      <tr>
        <td style="padding:12px;border-bottom:1px solid #272727;">CLT com renda extra</td>
        <td style="padding:12px;border-bottom:1px solid #272727;">Controle de múltiplas fontes de renda</td>
        <td style="padding:12px;border-bottom:1px solid #272727;">Declaração mais limpa e fácil de conferir</td>
      </tr>
      <tr>
        <td style="padding:12px;">Família ajustando orçamento</td>
        <td style="padding:12px;">Planejamento de metas sem depender de improviso</td>
        <td style="padding:12px;">Documentação mais organizada para deduções e patrimônio</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 style="font-size:1.45rem;margin:0 0 12px;color:#F5F5F2;">Para quem vale a pena comprar</h2>
<p style="margin:0 0 10px;">Se você quer decisões financeiras melhores no mundo real, este título entrega mais que teoria. Ele funciona especialmente para quem vive de renda variável, presta serviço e precisa de clareza sobre dinheiro no dia a dia.</p>
<p style="margin:0 0 20px;">Se a prioridade agora é sair da desorganização financeira e reduzir riscos na sua declaração, é uma leitura muito bem direcionada.</p>

<div style="background:#141414;border:1px solid #343434;padding:18px 20px;margin:0 0 28px;">
  <p style="margin:0 0 10px;font-weight:700;color:#F5F5F2;">Decisão recomendada</p>
  <p style="margin:0 0 14px;color:#d1d5db;">Abra o produto oficial na Amazon, confira edição/preço atual e avalie se faz sentido para sua fase financeira.</p>
  <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer" style="display:inline-block;background:#C6FF00;color:#0A0A0A;text-decoration:none;font-weight:800;padding:12px 18px;">Conferir na Amazon com segurança</a>
</div>

<h2 style="font-size:1.45rem;margin:0 0 10px;color:#F5F5F2;">Perguntas rápidas (FAQ)</h2>
<h3 style="font-size:1.05rem;margin:0 0 6px;color:#C6FF00;">É conteúdo para iniciante?</h3>
<p style="margin:0 0 10px;">Sim. A abordagem é acessível e prática, sem depender de jargão técnico para aplicar no cotidiano.</p>
<h3 style="font-size:1.05rem;margin:0 0 6px;color:#C6FF00;">Ajuda quem quer organizar o IRPF?</h3>
<p style="margin:0 0 10px;">Ajuda bastante na base: rotina de registro, disciplina e previsibilidade financeira, que são pilares para declarar com menos risco.</p>
<h3 style="font-size:1.05rem;margin:0 0 6px;color:#C6FF00;">Tem link oficial do produto?</h3>
<p style="margin:0;">Sim. Neste artigo usamos o link oficial abreviado da Amazon para o produto analisado: <a href="${post.amazonShortUrl}" target="_blank" rel="sponsored noopener noreferrer" style="color:#C6FF00;">${post.amazonShortUrl}</a>.</p>
</article>`;
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
  };
}

export async function generateAmazonAffiliatePost(
  post: AmazonAffiliatePostDef,
): Promise<AmazonAffiliatePostResult> {
  const { resolvedTitle, coverImage } = await resolveAmazonProductContext(post);

  const content = buildAmazonEditorialContent(post, resolvedTitle, coverImage);

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
    coverImage,
    imageAlt: `Imagem original do produto ${post.productTitle} na Amazon`,
    metaTitle: post.titleHint.slice(0, 60),
    metaDesc: post.metaDescHint,
    aiModel: "amazon-editorial-template-v1",
    source: {
      amazonShortUrl: post.amazonShortUrl,
      amazonFinalUrl: post.amazonFinalUrl,
      asin: post.asin,
      resolvedTitle,
    },
  };
}

export async function saveAmazonAffiliatePost(
  result: AmazonAffiliatePostResult,
): Promise<{ id: string; slug: string; title: string; needsReview: boolean }> {
  const existing = await prisma.blogPost.findFirst({
    where: { slug: result.slug },
    select: { id: true, slug: true, title: true, needsReview: true },
  });

  if (existing) {
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
    },
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
