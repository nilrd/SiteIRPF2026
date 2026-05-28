export interface AmazonAffiliatePostDef {
  slug: string;
  keyword: string;
  titleHint: string;
  metaDescHint: string;
  productTitle: string;
  author: string;
  format: "livro-fisico" | "ebook";
  amazonShortUrl: string;
  amazonFinalUrl: string;
  asin: string;
  productImageUrl: string;
  audience: string;
  tags: string[];
  keywords: string[];
  fitToSite: string;
}

export const AMAZON_AFFILIATE_POSTS: AmazonAffiliatePostDef[] = [
  {
    slug: "empreendedores-inteligentes-enriquecem-mais-resenha-pratica-irpf",
    keyword: "empreendedores inteligentes enriquecem mais vale a pena",
    titleHint:
      "Empreendedores Inteligentes Enriquecem Mais vale a pena? Resenha prática para autônomos e MEI",
    metaDescHint:
      "Análise honesta do livro Empreendedores Inteligentes Enriquecem Mais, com aplicação real para autônomos, MEI e organização financeira do IRPF.",
    productTitle: "Empreendedores inteligentes enriquecem mais",
    author: "Gustavo Cerbasi",
    format: "livro-fisico",
    amazonShortUrl: "https://amzn.to/43vGOAi",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/8543104122",
    asin: "8543104122",
    productImageUrl: "https://m.media-amazon.com/images/I/61MfCOqUKLL._SL1006_.jpg",
    audience: "autonomos-mei-profissionais-liberais",
    tags: [
      "livro de finanças",
      "educação financeira",
      "empreendedor",
      "mei",
      "irpf",
    ],
    keywords: [
      "empreendedores inteligentes enriquecem mais",
      "gustavo cerbasi livro empreendedor",
      "educacao financeira para mei",
      "como organizar dinheiro autonomo",
      "planejamento financeiro irpf",
    ],
    fitToSite:
      "Conecta educação financeira com organização de documentos, fluxo de caixa e disciplina para declarar IRPF com menos erro.",
  },
  {
    slug: "livro-dinheiro-gustavo-cerbasi-resumo-aplicado-irpf",
    keyword: "livro dinheiro gustavo cerbasi resumo",
    titleHint:
      "Livro Dinheiro, de Gustavo Cerbasi: resumo aplicado para organizar renda e IRPF",
    metaDescHint:
      "Resumo aplicado do livro Dinheiro (Gustavo Cerbasi) com foco em orçamento, reserva e rotina financeira que facilita sua declaração de IRPF.",
    productTitle: "Dinheiro: os segredos de quem tem",
    author: "Gustavo Cerbasi",
    format: "ebook",
    amazonShortUrl: "https://amzn.to/4wRhL8f",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/B01ACFIY2I",
    asin: "B01ACFIY2I",
    productImageUrl: "https://m.media-amazon.com/images/I/71rVyBGZ16L._SL1500_.jpg",
    audience: "familias-profissionais-clt-autonomos",
    tags: [
      "livro de finanças pessoais",
      "cerbasi",
      "orçamento familiar",
      "irpf 2026",
      "renda e patrimônio",
    ],
    keywords: [
      "livro dinheiro gustavo cerbasi",
      "resumo livro dinheiro",
      "controle financeiro pessoal",
      "como montar reserva de emergencia",
      "organização para declarar imposto de renda",
    ],
    fitToSite:
      "Ajuda o leitor a controlar entradas e saídas ao longo do ano, reduzindo inconsistências que levam à malha fina.",
  },
];

export function getAmazonAffiliatePostBySlug(
  slug: string,
): AmazonAffiliatePostDef | undefined {
  return AMAZON_AFFILIATE_POSTS.find((post) => post.slug === slug);
}

export function getAmazonAffiliatePostByIndex(
  index: number,
): AmazonAffiliatePostDef | undefined {
  if (!Number.isInteger(index) || index < 0 || index >= AMAZON_AFFILIATE_POSTS.length) {
    return undefined;
  }
  return AMAZON_AFFILIATE_POSTS[index];
}
