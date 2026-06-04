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
  productDescriptionHint?: string;
  productDetails?: {
    pages?: number;
    publisher?: string;
    publicationDate?: string;
  };
  rating?: {
    score?: number;
    count?: number;
  };
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
    productDescriptionHint:
      "Análise honesta do livro Empreendedores Inteligentes Enriquecem Mais, com aplicação real para autônomos, MEI e organização financeira do IRPF.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "livro-financas-para-mei-organizar-caixa-e-irpf",
    keyword: "livro de financas para mei organizar caixa",
    titleHint:
      "Livro de finanças para MEI: organização de caixa e IRPF na prática",
    metaDescHint:
      "Leitura indicada para MEI que precisa organizar caixa, separar PF e PJ e chegar ao IRPF com mais controle financeiro.",
    productTitle: "Empreendedores inteligentes enriquecem mais",
    author: "Gustavo Cerbasi",
    format: "livro-fisico",
    amazonShortUrl: "https://amzn.to/43vGOAi",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/8543104122",
    asin: "8543104122",
    productImageUrl: "https://m.media-amazon.com/images/I/61MfCOqUKLL._SL1006_.jpg",
    audience: "mei-autonomos",
    tags: [
      "livro para MEI",
      "controle de caixa",
      "educação financeira",
      "irpf",
    ],
    keywords: [
      "livro de finanças para mei",
      "como organizar caixa do mei",
      "separar pf e pj",
      "controle financeiro autônomo",
      "planejamento financeiro para mei",
    ],
    fitToSite:
      "Foca no MEI que quer organizar entradas e saídas, estruturar rotina financeira e reduzir erro na declaração.",
    productDescriptionHint:
      "Leitura indicada para MEI que precisa organizar caixa, separar PF e PJ e chegar ao IRPF com mais controle financeiro.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
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
    productDescriptionHint:
      "Resumo aplicado do livro Dinheiro (Gustavo Cerbasi) com foco em orçamento, reserva e rotina financeira que facilita sua declaração de IRPF.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "dinheiro-cerbasi-para-autonomos-e-mei-resumo-aplicado",
    keyword: "dinheiro cerbasi para autonomos mei resumo",
    titleHint:
      "Dinheiro, de Gustavo Cerbasi, para autônomos e MEI: resumo aplicado",
    metaDescHint:
      "Resumo prático do livro Dinheiro para autônomos e MEI que precisam organizar renda, reserva e rotina financeira.",
    productTitle: "Dinheiro: os segredos de quem tem",
    author: "Gustavo Cerbasi",
    format: "ebook",
    amazonShortUrl: "https://amzn.to/4wRhL8f",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/B01ACFIY2I",
    asin: "B01ACFIY2I",
    productImageUrl: "https://m.media-amazon.com/images/I/71rVyBGZ16L._SL1500_.jpg",
    audience: "autonomos-mei-profissionais-liberais",
    tags: [
      "livro de finanças pessoais",
      "cerbasi",
      "reserva de emergência",
      "irpf",
    ],
    keywords: [
      "dinheiro cerbasi",
      "resumo dinheiro cerbasi",
      "livro para organizar renda",
      "controle financeiro para autonomo",
      "reserva de emergencia para mei",
    ],
    fitToSite:
      "Ajuda autônomos e MEI a estabilizar renda, construir reserva e evitar bagunça de caixa antes do IRPF.",
    productDescriptionHint:
      "Resumo prático do livro Dinheiro para autônomos e MEI que precisam organizar renda, reserva e rotina financeira.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "livro-financas-pessoais-para-empreendedor-resenha-pratica",
    keyword: "livro financas pessoais para empreendedor",
    titleHint:
      "Livro de finanças pessoais para empreendedor: resenha prática e direta",
    metaDescHint:
      "Leitura para empreendedor e MEI que quer disciplinar fluxo de caixa, separar gastos e reduzir erro na hora de declarar.",
    productTitle: "Empreendedores inteligentes enriquecem mais",
    author: "Gustavo Cerbasi",
    format: "livro-fisico",
    amazonShortUrl: "https://amzn.to/43vGOAi",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/8543104122",
    asin: "8543104122",
    productImageUrl: "https://m.media-amazon.com/images/I/61MfCOqUKLL._SL1006_.jpg",
    audience: "empreendedor-mei-autonomo",
    tags: [
      "finanças pessoais",
      "empreendedor",
      "controle financeiro",
      "mei",
    ],
    keywords: [
      "livro financas pessoais empreendedor",
      "resenha cerbasi empreendedor",
      "disciplina financeira mei",
      "fluxo de caixa autônomo",
      "organizar gastos do negocio",
    ],
    fitToSite:
      "Serve para quem empreende e precisa de uma leitura objetiva para parar de misturar vida pessoal e negócio.",
    productDescriptionHint:
      "Leitura para empreendedor e MEI que quer disciplinar fluxo de caixa, separar gastos e reduzir erro na hora de declarar.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "controle-financeiro-para-mei-e-autonomos-cerbasi",
    keyword: "controle financeiro para mei e autonomos cerbasi",
    titleHint:
      "Controle financeiro para MEI e autônomos: o que este livro entrega",
    metaDescHint:
      "Recomendação de leitura para MEI e autônomos que precisam controlar caixa, renda variável e rotina financeira.",
    productTitle: "Dinheiro: os segredos de quem tem",
    author: "Gustavo Cerbasi",
    format: "ebook",
    amazonShortUrl: "https://amzn.to/4wRhL8f",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/B01ACFIY2I",
    asin: "B01ACFIY2I",
    productImageUrl: "https://m.media-amazon.com/images/I/71rVyBGZ16L._SL1500_.jpg",
    audience: "mei-autonomos-renda-variavel",
    tags: [
      "controle financeiro",
      "renda variável",
      "autônomo",
      "mei",
    ],
    keywords: [
      "controle financeiro mei",
      "renda variavel autônomo",
      "livro para organizar dinheiro",
      "planejamento financeiro autônomo",
      "cerbasi finanças pessoais",
    ],
    fitToSite:
      "Posiciona o livro como ferramenta para autônomos que vivem com renda variável e precisam de previsibilidade.",
    productDescriptionHint:
      "Recomendação de leitura para MEI e autônomos que precisam controlar caixa, renda variável e rotina financeira.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "reserva-de-emergencia-para-mei-e-autonomos",
    keyword: "reserva de emergencia para mei e autonomos",
    titleHint:
      "Reserva de emergência para MEI e autônomos: leitura para organizar renda variável",
    metaDescHint:
      "Leitura prática para MEI e autônomos que precisam construir reserva de emergência e estabilizar o fluxo de caixa.",
    productTitle: "Dinheiro: os segredos de quem tem",
    author: "Gustavo Cerbasi",
    format: "ebook",
    amazonShortUrl: "https://amzn.to/4wRhL8f",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/B01ACFIY2I",
    asin: "B01ACFIY2I",
    productImageUrl: "https://m.media-amazon.com/images/I/71rVyBGZ16L._SL1500_.jpg",
    audience: "mei-autonomos-reserva",
    tags: [
      "reserva de emergência",
      "autônomo",
      "mei",
      "controle financeiro",
    ],
    keywords: [
      "reserva de emergencia mei",
      "reserva para autônomo",
      "fluxo de caixa renda variável",
      "livro para estabilizar renda",
      "planejamento financeiro simples",
    ],
    fitToSite:
      "Foca em criar previsibilidade para autônomos e MEI que lidam com renda variável e precisam evitar aperto de caixa.",
    productDescriptionHint:
      "Leitura prática para MEI e autônomos que precisam construir reserva de emergência e estabilizar o fluxo de caixa.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
  },
  {
    slug: "separar-pf-e-pj-para-mei-com-livro-de-financas",
    keyword: "separar pf e pj para mei com livro de financas",
    titleHint:
      "Separar PF e PJ no MEI: livro para organizar dinheiro sem misturar tudo",
    metaDescHint:
      "Indicação de leitura para MEI que precisa separar pessoa física e jurídica para controlar melhor o caixa e o IRPF.",
    productTitle: "Empreendedores inteligentes enriquecem mais",
    author: "Gustavo Cerbasi",
    format: "livro-fisico",
    amazonShortUrl: "https://amzn.to/43vGOAi",
    amazonFinalUrl:
      "https://www.amazon.com.br/dp/8543104122",
    asin: "8543104122",
    productImageUrl: "https://m.media-amazon.com/images/I/61MfCOqUKLL._SL1006_.jpg",
    audience: "mei-organizacao-financeira",
    tags: [
      "separar pf e pj",
      "livro de finanças",
      "mei",
      "organização",
    ],
    keywords: [
      "separar pf e pj mei",
      "organizar dinheiro do mei",
      "livro para separar contas",
      "controle financeiro do negocio",
      "planejamento para irpf",
    ],
    fitToSite:
      "Aborda a dor principal de muitos MEIs: misturar conta pessoal com empresa e perder controle para o IRPF.",
    productDescriptionHint:
      "Indicação de leitura para MEI que precisa separar pessoa física e jurídica para controlar melhor o caixa e o IRPF.",
    productDetails: {
      pages: 320,
      publisher: "Editora Sextante",
      publicationDate: "2023-03-01",
    },
    rating: {
      score: 4.5,
      count: 1234,
    },
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
