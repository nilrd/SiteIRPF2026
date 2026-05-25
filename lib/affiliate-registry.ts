/**
 * affiliate-registry.ts
 * Registry central de todas as páginas da estratégia Mercado Pago / Maquininhas.
 * Usado para seed do banco, sitemap, interlinking e auditorias SEO.
 */

export type ProductType = "point-pro-3" | "point-smart-2" | "app-mercado-pago" | null;

export type PageType =
  | "hub"
  | "artigo"
  | "produto"
  | "segmento"
  | "duvida-fiscal"
  | "comparativo";

export interface AffiliatePageSeed {
  slug: string;
  path: string;
  title: string;
  pageType: PageType;
  mainProduct: ProductType;
  mainCta: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  targetKeyword: string | null;
}

export const AFFILIATE_PAGES_REGISTRY: AffiliatePageSeed[] = [
  {
    slug: "vender-e-receber",
    path: "/mei/vender-e-receber",
    title: "Guia do MEI para Vender e Receber Melhor",
    pageType: "hub",
    mainProduct: "point-smart-2",
    mainCta: "Conhecer a Point Smart 2",
    metaTitle: "Como MEI pode vender e receber por cartão, Pix e app — Guia 2026",
    metaDesc:
      "Guia completo para MEI escolher maquininha, app de pagamento ou link. Compare taxas e comece a receber no cartão hoje.",
    targetKeyword: "como maquininha para mei funciona",
  },
  {
    slug: "maquininha-para-mei",
    path: "/mei/maquininha-para-mei",
    title: "Maquininha para MEI: Como Escolher e Começar a Receber no Cartão",
    pageType: "artigo",
    mainProduct: "point-smart-2",
    mainCta: "Conhecer a Point Smart 2",
    metaTitle: "Maquininha para MEI: qual a melhor em 2026? Guia completo",
    metaDesc:
      "Descubra qual maquininha é ideal para o seu MEI. Compare taxas, conectividade e benefícios da Point Smart 2, Point Pro 3 e App Mercado Pago.",
    targetKeyword: "maquininha para mei",
  },
  {
    slug: "point-smart-2-para-mei",
    path: "/mei/point-smart-2-para-mei",
    title: "Point Smart 2 para MEI: Vale a Pena? Análise Completa",
    pageType: "produto",
    mainProduct: "point-smart-2",
    mainCta: "Ver condições da Point Smart 2",
    metaTitle: "Point Smart 2 para MEI: vale a pena em 2026? Análise honesta",
    metaDesc:
      "Análise completa da Point Smart 2 para MEI. Taxa, tela touchscreen, conectividade e para quem recomendamos.",
    targetKeyword: "point smart 2 para mei",
  },
  {
    slug: "point-pro-3-para-mei",
    path: "/mei/point-pro-3-para-mei",
    title: "Point Pro 3 para MEI: Para Quem Vende Muito — Análise Completa",
    pageType: "produto",
    mainProduct: "point-pro-3",
    mainCta: "Conhecer a Point Pro 3",
    metaTitle: "Point Pro 3 para MEI: análise completa 2026 — vale a pena?",
    metaDesc:
      "Análise completa da Point Pro 3 para MEI com alto volume de vendas. Taxa, bateria, 4G e para quem é indicada.",
    targetKeyword: "point pro 3 para mei",
  },
  {
    slug: "app-mercado-pago-para-mei",
    path: "/mei/app-mercado-pago-para-mei",
    title: "App Mercado Pago para MEI: Receba Sem Maquininha",
    pageType: "produto",
    mainProduct: "app-mercado-pago",
    mainCta: "Conhecer o App Mercado Pago",
    metaTitle: "App Mercado Pago para MEI: como receber por Pix e cartão sem maquininha",
    metaDesc:
      "Guia completo do App Mercado Pago para MEI. Abra conta, receba por Pix, link de pagamento e cartão sem precisar de maquininha.",
    targetKeyword: "app mercado pago para mei",
  },
  {
    slug: "link-de-pagamento-para-mei",
    path: "/mei/link-de-pagamento-para-mei",
    title: "Link de Pagamento para MEI: Como Criar e Cobrar pelo Celular",
    pageType: "artigo",
    mainProduct: "app-mercado-pago",
    mainCta: "Criar link de pagamento grátis",
    metaTitle: "Link de pagamento para MEI: como criar e receber 2026",
    metaDesc:
      "Aprenda a criar link de pagamento no Mercado Pago para cobrar clientes do seu MEI por WhatsApp, e-mail ou redes sociais.",
    targetKeyword: "link de pagamento para mei",
  },
  {
    slug: "maquininha-para-autonomo",
    path: "/mei/maquininha-para-autonomo",
    title: "Maquininha para Autônomo MEI: Qual Escolher?",
    pageType: "segmento",
    mainProduct: "point-smart-2",
    mainCta: "Ver a Point Smart 2",
    metaTitle: "Maquininha para autônomo MEI em 2026: qual a melhor opção?",
    metaDesc:
      "Guia para eletricistas, técnicos, professores e prestadores de serviço MEI escolherem a maquininha certa.",
    targetKeyword: "maquininha para autonomo mei",
  },
  {
    slug: "maquininha-para-salao-de-beleza",
    path: "/mei/maquininha-para-salao-de-beleza",
    title: "Maquininha para Salão de Beleza MEI",
    pageType: "segmento",
    mainProduct: "point-smart-2",
    mainCta: "Ver a Point Smart 2",
    metaTitle: "Maquininha para salão de beleza MEI em 2026: qual a melhor?",
    metaDesc:
      "Qual maquininha é ideal para cabeleireiras, manicures e esteticistas MEI? Comparativo e recomendação completa.",
    targetKeyword: "maquininha para salao de beleza mei",
  },
  {
    slug: "maquininha-para-barbeiro",
    path: "/mei/maquininha-para-barbeiro",
    title: "Maquininha para Barbeiro MEI: Qual Faz Mais Sentido?",
    pageType: "segmento",
    mainProduct: "point-pro-3",
    mainCta: "Conhecer a Point Pro 3",
    metaTitle: "Maquininha para barbeiro MEI em 2026: qual a melhor?",
    metaDesc:
      "Guia completo para barbeiros e donos de barbearia MEI escolherem a maquininha com melhor taxa e bateria.",
    targetKeyword: "maquininha para barbeiro mei",
  },
  {
    slug: "maquininha-para-delivery",
    path: "/mei/maquininha-para-delivery",
    title: "Maquininha para Delivery MEI: Bateria e 4G para Entregadores",
    pageType: "segmento",
    mainProduct: "point-pro-3",
    mainCta: "Conhecer a Point Pro 3",
    metaTitle: "Maquininha para delivery MEI 2026: qual aguenta o dia todo?",
    metaDesc:
      "Maquininha com 4G e bateria duradoura para motoboys e entregadores MEI. Comparativo e recomendação.",
    targetKeyword: "maquininha para delivery mei",
  },
  {
    slug: "maquininha-para-prestador-de-servico",
    path: "/mei/maquininha-para-prestador-de-servico",
    title: "Maquininha para Prestador de Serviço MEI",
    pageType: "segmento",
    mainProduct: "point-smart-2",
    mainCta: "Ver a Point Smart 2",
    metaTitle: "Maquininha para prestador de serviço MEI em 2026",
    metaDesc:
      "Guia para MEI que presta serviços escolher entre Point Smart 2, Point Pro 3 ou App Mercado Pago.",
    targetKeyword: "maquininha para prestador de servico mei",
  },
  {
    slug: "maquininha-para-vendedor-ambulante",
    path: "/mei/maquininha-para-vendedor-ambulante",
    title: "Maquininha para Vendedor Ambulante MEI: Feirantes e Rua",
    pageType: "segmento",
    mainProduct: "point-pro-3",
    mainCta: "Conhecer a Point Pro 3",
    metaTitle: "Maquininha para vendedor ambulante MEI 2026: qual aguentar na rua?",
    metaDesc:
      "Opções de maquininha para feirantes, camelôs e vendedores ambulantes MEI que precisam vender sem Wi-Fi.",
    targetKeyword: "maquininha para vendedor ambulante mei",
  },
];

export const AFFILIATE_LINKS_SEED = [
  {
    product: "point-smart-2",
    label: "Point Smart 2",
    url: "https://mpago.li/1UXbbb9",
    buttonText: "Ver condições da Point Smart 2",
    description: "Maquininha com tela touchscreen, relatórios e NFC. Ideal para MEI que valoriza controle e profissionalismo.",
    active: true,
    priority: 1,
  },
  {
    product: "point-pro-3",
    label: "Point Pro 3",
    url: "https://mpago.li/31QNkWU",
    buttonText: "Conhecer a Point Pro 3",
    description: "Maquininha robusta com Wi-Fi, 4G e bateria para o dia todo. Ideal para alto volume de vendas.",
    active: true,
    priority: 2,
  },
  {
    product: "app-mercado-pago",
    label: "App Mercado Pago",
    url: "https://mpago.li/18rGCG2",
    buttonText: "Conhecer o App Mercado Pago",
    description: "Conta digital para receber por Pix, cartão e link de pagamento sem maquininha. Ideal para MEI iniciante.",
    active: true,
    priority: 3,
  },
];
