/**
 * Mapa de conteúdo para posts de blog sobre motoristas de aplicativo.
 * 18 posts otimizados para SEO, ocultos da listagem principal do blog,
 * mas indexáveis pelo Google. Cada post tem CTAs com link de indicação Uber.
 *
 * Link de indicação: https://drivers.uber.com/i/tfbztm6
 * Bônus atual: R$ 350 pelas 70 primeiras viagens em 30 dias.
 */

export const REFERRAL_LINK = "https://drivers.uber.com/i/tfbztm6";
export const REFERRAL_LINK_ENCODED =
  "https%3A%2F%2Fdrivers.uber.com%2Fi%2Ftfbztm6";

/** Bônus por categoria (dados verificados das screenshots de 2025) */
export const UBER_BONUS_TABLE = {
  uberX: { valor: 500, viagens: 150, dias: 30 },
  taxi: { valor: 700, viagens: 70, dias: 30 },
  moto: { valor: 1100, viagens: 200, dias: 30 },
  entregaCarro: { valor: 300, entregas: 60, dias: 30 },
  entregaBicicleta: { valor: 300, entregas: 60, dias: 30 },
  entregaMoto: { valor: 150, entregas: 100, dias: 30 },
  geral: { valor: 350, viagens: 70, dias: 30 },
} as const;

export type MotoristaClusters =
  | "CLUSTER_A" // Como funciona — entrada no app
  | "CLUSTER_B" // Ganhos e rentabilidade
  | "CLUSTER_C" // Entregadores (iFood, Uber Eats, moto, bicicleta)
  | "CLUSTER_D"; // IRPF + motoristas de app (sinergia com nicho principal)

export type MotoristaPerfil =
  | "motorista-uberx"
  | "motorista-taxi"
  | "motorista-moto"
  | "entregador"
  | "autonomo-geral";

export interface MotoristPostDef {
  /** slug único do post (URL) */
  slug: string;
  /** keyword principal para SEO */
  keyword: string;
  /** título sugerido para o post */
  titleHint: string;
  /** meta description sugerida (~155 chars) */
  metaDescHint: string;
  /** cluster editorial */
  cluster: MotoristaClusters;
  /** perfil de audiência principal */
  perfil: MotoristaPerfil;
  /** tags do post */
  tags: string[];
  /** keywords secundárias SEO */
  keywords: string[];
  /** texto de "gancho" para o bônus principal a destacar no post */
  bonusHighlight: string;
  /** ângulo editorial único (para dar ao LLM foco diferente por post) */
  angle: string;
  /** 5 perguntas frequentes orientadoras (o LLM gera as respostas) */
  faqQuestions: string[];
}

export const MOTORISTA_POSTS: MotoristPostDef[] = [
  // ── CLUSTER A: Como funciona ─────────────────────────────────────────────
  {
    slug: "como-se-cadastrar-uber-motorista-passo-a-passo",
    keyword: "como se cadastrar motorista uber",
    titleHint: "Como se cadastrar como motorista Uber: passo a passo completo",
    metaDescHint:
      "Veja o passo a passo para se cadastrar como motorista Uber em 2025 e ganhe até R$ 350 de bônus pelas 70 primeiras corridas. Documentos, requisitos e dicas.",
    cluster: "CLUSTER_A",
    perfil: "motorista-uberx",
    tags: [
      "uber motorista",
      "cadastro uber",
      "como virar motorista uber",
      "renda extra",
    ],
    keywords: [
      "como se cadastrar motorista uber",
      "cadastro uber motorista 2025",
      "documentos motorista uber",
      "requisitos uber motorista",
      "uber driver brasil",
    ],
    bonusHighlight:
      "R$ 350 de bônus pelas 70 primeiras viagens em 30 dias via link de indicação",
    angle:
      "Guia prático focado em quem nunca dirigiu para app — do zero ao primeiro aceite. Destaque: bônus de boas-vindas com link de indicação.",
    faqQuestions: [
      "Quais documentos são necessários para se cadastrar na Uber?",
      "Quanto tempo demora a aprovação do cadastro Uber?",
      "Qualquer carro serve para dirigir pela Uber?",
      "Preciso ter CNH profissional para virar motorista Uber?",
      "Como recebo o bônus de boas-vindas da Uber?",
    ],
  },
  {
    slug: "quanto-ganha-motorista-uber-por-mes",
    keyword: "quanto ganha motorista uber por mes",
    titleHint: "Quanto ganha um motorista Uber por mês? Veja os números reais",
    metaDescHint:
      "Descubra quanto um motorista Uber ganha de verdade por mês em 2025, com cálculos de despesas, lucro líquido e como multiplicar seus ganhos com bônus.",
    cluster: "CLUSTER_B",
    perfil: "motorista-uberx",
    tags: [
      "ganhos uber",
      "renda motorista app",
      "quanto ganha uber",
      "renda extra carro",
    ],
    keywords: [
      "quanto ganha motorista uber",
      "salario motorista uber 2025",
      "media ganhos uber brasil",
      "renda motorista aplicativo",
      "lucro uber motorista",
    ],
    bonusHighlight:
      "Bônus de R$ 500 para UberX (150 viagens em 30 dias) via indicação",
    angle:
      "Análise honesta de ganhos brutos vs líquidos com tabela de despesas (gasolina, manutenção, INSS). Simulação de R$ 3.000 a R$ 6.000 por mês dependendo da carga horária.",
    faqQuestions: [
      "Motorista Uber paga impostos sobre os ganhos?",
      "Qual é a média de ganho por hora de um motorista Uber?",
      "Vale mais a pena fazer Uber de dia ou de noite?",
      "Uber desconta alguma porcentagem das corridas do motorista?",
      "Como aumentar os ganhos como motorista Uber com bonificações?",
    ],
  },
  {
    slug: "requisitos-carro-uber-motorista-2025",
    keyword: "requisitos carro para uber motorista",
    titleHint:
      "Requisitos do carro para ser motorista Uber em 2025: ano, modelo e documentação",
    metaDescHint:
      "Seu carro se qualifica para o Uber? Veja os requisitos de ano, modelo e documentação exigidos em 2025 e saiba como começar a ganhar.",
    cluster: "CLUSTER_A",
    perfil: "motorista-uberx",
    tags: [
      "requisitos uber",
      "carro uber 2025",
      "qual carro serve para uber",
      "uber motorista",
    ],
    keywords: [
      "requisitos carro uber",
      "ano minimo carro uber",
      "modelos aceitos uber 2025",
      "carro apto para uber",
      "veículo uber brasil",
    ],
    bonusHighlight:
      "R$ 350 de bônus nas 70 primeiras viagens ao usar link de indicação",
    angle:
      "Foco prático: tabela de anos mínimos por cidade (SP, RJ, etc.), modelos populares aprovados (HB20, Onix, Mobi), e checklist de documentação veicular.",
    faqQuestions: [
      "Qual é o ano mínimo do carro para dirigir pela Uber?",
      "Carro com placa de final ímpar pode fazer Uber em São Paulo?",
      "Carros com GNV são aceitos pela Uber?",
      "Carro alugado pode ser usado para Uber?",
      "Como consultar se meu carro está aprovado na plataforma Uber?",
    ],
  },
  {
    slug: "uber-ou-99-qual-paga-mais-motorista",
    keyword: "uber ou 99 qual paga mais motorista",
    titleHint: "Uber ou 99: qual app paga mais para o motorista em 2025?",
    metaDescHint:
      "Comparativo detalhado entre Uber e 99 para motoristas em 2025 — repasse, bônus, suporte e estratégia para maximizar seus ganhos.",
    cluster: "CLUSTER_B",
    perfil: "motorista-uberx",
    tags: [
      "uber vs 99",
      "comparativo apps motorista",
      "qual app paga mais",
      "renda extra motorista",
    ],
    keywords: [
      "uber ou 99 para motorista",
      "qual app paga mais motorista 2025",
      "comparativo uber 99",
      "porcentagem uber 99 motorista",
      "melhor app motorista brasil",
    ],
    bonusHighlight:
      "Bônus exclusivo de R$ 350 disponível pelo link de indicação Uber",
    angle:
      "Comparativo objetivo com tabela: porcentagem de repasse, disponibilidade de viagens, suporte, bônus de cadastro. Estratégia: rodar os dois para maximizar rentabilidade.",
    faqQuestions: [
      "Posso rodar Uber e 99 ao mesmo tempo?",
      "Qual app tem maior demanda na minha cidade?",
      "A 99 paga mais que a Uber por quilômetro?",
      "O cancelamento afeta de forma diferente em cada app?",
      "Existe bônus de cadastro na 99 como na Uber?",
    ],
  },
  // ── CLUSTER B: Ganhos e rentabilidade ───────────────────────────────────
  {
    slug: "como-ganhar-mais-uber-dicas-motorista",
    keyword: "dicas para ganhar mais na uber como motorista",
    titleHint: "7 estratégias para ganhar mais como motorista Uber em 2025",
    metaDescHint:
      "Descubra 7 estratégias testadas por motoristas experientes para aumentar seus ganhos no Uber — horários, bonificações, locais e uso do bônus de indicação.",
    cluster: "CLUSTER_B",
    perfil: "motorista-uberx",
    tags: [
      "ganhar mais uber",
      "estratégias motorista app",
      "dicas uber motorista",
      "maximizar ganhos uber",
    ],
    keywords: [
      "como ganhar mais na uber",
      "estrategias motorista uber 2025",
      "horarios melhores uber",
      "bonus uber motorista",
      "aumentar ganhos app",
    ],
    bonusHighlight:
      "Como usar o link de indicação para já começar com R$ 350 garantidos",
    angle:
      "Post listicle (7 estratégias) com dados reais: horários de pico por cidade, score de avaliação, modalidades premium, e o impacto do bônus de novo cadastro nos primeiros 30 dias.",
    faqQuestions: [
      "Qual horário tem mais corridas no Uber?",
      "Como melhorar minha avaliação no Uber?",
      "Vale a pena fazer UberX Black para ganhar mais?",
      "Como funcionam os bônus semanais do Uber?",
      "O bônus de indicação compensa os primeiros meses?",
    ],
  },
  {
    slug: "motorista-uber-quanto-horas-trabalhar",
    keyword: "quantas horas trabalhar motorista uber para ter renda boa",
    titleHint:
      "Motorista Uber: quantas horas por dia para ter uma renda decente?",
    metaDescHint:
      "Descubra quantas horas trabalhar no Uber para atingir R$ 3.000, R$ 4.000 ou R$ 5.000 por mês. Simulação real com custo de combustível incluído.",
    cluster: "CLUSTER_B",
    perfil: "motorista-uberx",
    tags: [
      "carga horária uber",
      "horas trabalho uber",
      "renda uber por hora",
      "simulação ganhos uber",
    ],
    keywords: [
      "quantas horas trabalhar uber",
      "ganho por hora uber motorista",
      "simulacao renda uber",
      "motorista uber tempo integral",
      "uber como renda principal",
    ],
    bonusHighlight:
      "Bônus R$ 350 representa ~35 horas de trabalho gratuitas nos primeiros 30 dias",
    angle:
      "Simulação tabular: 4h, 6h, 8h e 10h por dia com ganho bruto, combustível estimado, desgaste e lucro líquido por cidade (SP, RJ, BH, Curitiba).",
    faqQuestions: [
      "É possível viver só de Uber fazendo 6 horas por dia?",
      "Qual o custo médio de combustível por km no Uber?",
      "Motoristas Uber têm direito a férias ou FGTS?",
      "Como calcular o custo real de rodar para o Uber?",
      "Uber como renda principal é viável em 2025?",
    ],
  },
  {
    slug: "uber-moto-como-funciona-requisitos-ganhos",
    keyword: "uber moto como funciona para motorista",
    titleHint:
      "Uber Moto para motoristas: requisitos, ganhos e como se cadastrar",
    metaDescHint:
      "Entenda como funciona o Uber Moto para quem quer ganhar dinheiro com a moto. Requisitos, documentação, bônus de R$ 1.100 e dicas para decolar rápido.",
    cluster: "CLUSTER_A",
    perfil: "motorista-moto",
    tags: [
      "uber moto",
      "mototaxi app",
      "motorista moto uber",
      "renda extra moto",
    ],
    keywords: [
      "uber moto motorista",
      "como funciona uber moto",
      "cadastro uber moto 2025",
      "ganhos uber moto",
      "requisitos moto uber",
    ],
    bonusHighlight:
      "Bônus de R$ 1.100 para novos motoristas de moto (200 viagens em 30 dias)",
    angle:
      "Foco no maior bônus da plataforma (R$ 1.100). Passo a passo do cadastro, comparação com entrega de moto (UberFlash) e calculadora de retorno em 30 dias.",
    faqQuestions: [
      "Qual o ano mínimo da moto para o Uber Moto?",
      "Preciso de EPI específico para o Uber Moto?",
      "O bônus de R$ 1.100 é garantido ou por meta?",
      "Uber Moto funciona em todas as cidades?",
      "Quanto ganha um motorista de moto no Uber por mês?",
    ],
  },
  {
    slug: "motorista-taxi-uber-como-funciona-bonus",
    keyword: "motorista taxi uber como funciona",
    titleHint: "Motorista de táxi no Uber: como funciona e bônus de R$ 700",
    metaDescHint:
      "Taxistas podem usar o Uber e ganhar até R$ 700 de bônus nas primeiras corridas. Veja como funciona, os requisitos e como se cadastrar.",
    cluster: "CLUSTER_A",
    perfil: "motorista-taxi",
    tags: [
      "taxi uber",
      "taxista uber",
      "uber taxi brasil",
      "bonus taxista uber",
    ],
    keywords: [
      "motorista taxi uber",
      "uber taxi como funciona",
      "taxista pode usar uber",
      "cadastro taxista uber",
      "bonus taxi uber 2025",
    ],
    bonusHighlight: "R$ 700 de bônus para taxistas (70 viagens em 30 dias)",
    angle:
      "Esclarece mitos de que táxi e Uber são concorrentes — explica a modalidade UberTaxi, vantagens (tarifa maior, clientes diferentes) e o bônus exclusivo para categoria.",
    faqQuestions: [
      "Taxista pode dirigir pelo Uber ao mesmo tempo?",
      "A corrida pelo Uber Táxi é mais cara que UberX?",
      "Minha alvará de táxi é aceita pela Uber?",
      "Como funciona o pagamento para taxistas no Uber?",
      "O bônus de R$ 700 é por viagem ou total?",
    ],
  },
  // ── CLUSTER C: Entregadores ─────────────────────────────────────────────
  {
    slug: "uber-eats-entregador-carro-como-funcionar",
    keyword: "uber eats entregador de carro como funciona",
    titleHint:
      "Uber Eats entregador de carro: como funciona e bônus de R$ 300",
    metaDescHint:
      "Saiba como se tornar entregador do Uber Eats com carro em 2025, os requisitos, ganhos médios e o bônus de R$ 300 para as primeiras 60 entregas.",
    cluster: "CLUSTER_C",
    perfil: "entregador",
    tags: [
      "uber eats entregador",
      "entregador carro uber",
      "entrega por aplicativo",
      "renda extra entrega",
    ],
    keywords: [
      "uber eats entregador carro",
      "como ser entregador uber eats",
      "cadastro entregador uber",
      "ganhos entregador uber eats 2025",
      "entrega app carro",
    ],
    bonusHighlight: "R$ 300 de bônus para entregadores de carro (60 entregas)",
    angle:
      "Guia direto para quem tem carro mas não quer fazer passageiros. Foco em delivery de alimentos, comparação com iFood para entregadores e análise de ganhos.",
    faqQuestions: [
      "Qual carro é aceito para entrega no Uber Eats?",
      "Posso fazer Uber Eats e UberX com o mesmo carro?",
      "Quanto ganha um entregador de carro no Uber Eats por mês?",
      "Preciso de bolsa térmica para fazer entrega de carro no Uber?",
      "Como funciona a escala de entregadores no Uber Eats?",
    ],
  },
  {
    slug: "entregador-bicicleta-uber-eats-como-comecar",
    keyword: "entregador de bicicleta uber eats como começar",
    titleHint:
      "Entregador de bicicleta no Uber Eats: como começar e ganhar R$ 300",
    metaDescHint:
      "Aprenda como se cadastrar como entregador de bicicleta no Uber Eats em 2025, o que precisa e como garantir o bônus de R$ 300 pelas primeiras 60 entregas.",
    cluster: "CLUSTER_C",
    perfil: "entregador",
    tags: [
      "entregador bicicleta",
      "uber eats bike",
      "delivery bicicleta app",
      "renda extra sem carro",
    ],
    keywords: [
      "entregador bicicleta uber eats",
      "como ser entregador bike uber",
      "cadastro bike uber eats",
      "ganhos entregador bicicleta 2025",
      "delivery app bicicleta brasil",
    ],
    bonusHighlight:
      "R$ 300 de bônus para entregadores de bicicleta (60 entregas)",
    angle:
      "Focado em quem não tem carro nem moto mas quer renda extra. Zero de combustível, regiões centrais/comerciais são as mais lucrativas. Cálculo de ganho por rota.",
    faqQuestions: [
      "Qualquer bicicleta serve para fazer entrega no Uber Eats?",
      "Preciso de licença especial para ser entregador de bike?",
      "Quanto ganha um entregador de bicicleta por hora?",
      "Como funciona a prioridade de pedidos para bicicletas?",
      "Vale a pena investir em bicicleta elétrica para o Uber Eats?",
    ],
  },
  {
    slug: "entregador-moto-uber-eats-requisitos-ganhos",
    keyword: "entregador moto uber eats requisitos",
    titleHint:
      "Entregador de moto no Uber Eats: requisitos, ganhos e como se cadastrar",
    metaDescHint:
      "Veja os requisitos para ser entregador de moto no Uber Eats em 2025, quanto se ganha e como aproveitar o bônus de R$ 150 para as primeiras 100 entregas.",
    cluster: "CLUSTER_C",
    perfil: "entregador",
    tags: [
      "entregador moto uber",
      "uber eats moto",
      "delivery moto app",
      "renda extra moto",
    ],
    keywords: [
      "entregador moto uber eats",
      "cadastro entregador moto uber",
      "requisitos moto uber eats",
      "ganhos moto entregador 2025",
      "delivery moto app brasil",
    ],
    bonusHighlight:
      "R$ 150 de bônus para entregadores de moto (100 entregas em 30 dias)",
    angle:
      "Comparação direta moto vs bicicleta vs carro para entrega. Análise de custo-benefício considerando combustível e a vantagem de velocidade/flexibilidade.",
    faqQuestions: [
      "Qual o ano mínimo da moto para entrega no Uber Eats?",
      "Moto pode fazer entrega do Uber Eats e corrida Uber Moto ao mesmo tempo?",
      "Quanto ganha um entregador de moto no Uber Eats por dia?",
      "EPI é obrigatório para entregadores de moto no Uber?",
      "Como aumentar a nota como entregador de moto no Uber Eats?",
    ],
  },
  {
    slug: "ifood-ou-uber-eats-qual-melhor-entregador",
    keyword: "ifood ou uber eats qual melhor para entregador",
    titleHint:
      "iFood ou Uber Eats: qual é melhor para entregadores em 2025?",
    metaDescHint:
      "Comparativo honesto entre iFood e Uber Eats para entregadores — repasse, disponibilidade, suporte e como usar os dois para maximizar seus ganhos.",
    cluster: "CLUSTER_C",
    perfil: "entregador",
    tags: [
      "ifood vs uber eats entregador",
      "melhor app entrega 2025",
      "comparativo delivery apps",
      "renda entregador app",
    ],
    keywords: [
      "ifood ou uber eats para entregador",
      "melhor app entregador 2025",
      "comparativo ifood uber eats",
      "ganhos ifood vs uber eats",
      "entregador multiplos apps",
    ],
    bonusHighlight:
      "Bônus de cadastro exclusivo do Uber disponível pelo link de indicação",
    angle:
      "Análise imparcial: disponibilidade de pedidos, valor por entrega, taxas de cancelamento e estratégia de usar os dois apps simultaneamente.",
    faqQuestions: [
      "Posso usar iFood e Uber Eats ao mesmo tempo?",
      "Qual app tem mais pedidos na minha cidade?",
      "O repasse do iFood é maior que o do Uber Eats?",
      "Como funciona o bloqueio de entregadores em cada app?",
      "Existe bônus de indicação no iFood como no Uber?",
    ],
  },
  // ── CLUSTER D: IRPF + Motoristas (sinergia com nicho principal) ──────────
  {
    slug: "imposto-de-renda-motorista-uber-como-declarar",
    keyword: "imposto de renda motorista uber como declarar",
    titleHint:
      "Motorista Uber e imposto de renda: como declarar seus ganhos no IRPF",
    metaDescHint:
      "Entenda como declarar os ganhos do Uber no imposto de renda 2025/2026, o que é tributável, deduções permitidas e como evitar a malha fina.",
    cluster: "CLUSTER_D",
    perfil: "autonomo-geral",
    tags: [
      "irpf motorista uber",
      "imposto de renda uber",
      "declarar ganhos uber",
      "autonomo irpf",
    ],
    keywords: [
      "imposto de renda motorista uber",
      "como declarar uber irpf",
      "carne leao uber motorista",
      "ganhos uber tributavel",
      "autonomo uber irpf 2026",
    ],
    bonusHighlight:
      "Antes de começar: garanta R$ 350 de bônus com o link de indicação",
    angle:
      "Foco total no IRPF: motorista é autônomo, carne-leão mensal obrigatório, deduções de combustível/manutenção no livro-caixa, como evitar multa da Receita.",
    faqQuestions: [
      "Motorista Uber precisa pagar imposto de renda?",
      "Como preencher o carnê-leão para ganhos do Uber?",
      "Posso deduzir combustível e manutenção do carro no IRPF?",
      "Qual o limite de ganhos para o motorista Uber ser obrigado a declarar?",
      "Motorista Uber cai na malha fina com facilidade?",
    ],
  },
  {
    slug: "mei-motorista-uber-vale-a-pena",
    keyword: "MEI motorista uber vale a pena",
    titleHint: "Motorista Uber deve abrir MEI? Veja o que muda no IRPF e nos ganhos",
    metaDescHint:
      "Descubra se vale a pena abrir MEI como motorista Uber em 2025 — impacto no IRPF, benefícios do INSS, limites de faturamento e como fazer a transição.",
    cluster: "CLUSTER_D",
    perfil: "autonomo-geral",
    tags: [
      "MEI motorista uber",
      "uber MEI ou autonomo",
      "abrir empresa uber",
      "irpf mei motorista",
    ],
    keywords: [
      "MEI motorista uber",
      "uber MEI vale a pena",
      "abrir MEI como motorista app",
      "MEI uber irpf 2026",
      "motorista autonomo mei diferenca",
    ],
    bonusHighlight:
      "Maximize seus ganhos: cadastre-se no Uber com o link de indicação",
    angle:
      "Análise financeira: MEI paga menos imposto que autônomo comum? Qual proteção social cada modelo oferece? Quando compensa migrar para MEI como motorista.",
    faqQuestions: [
      "Motorista Uber pode ser MEI?",
      "Qual é o limite de faturamento do MEI em 2025?",
      "MEI como motorista tem direito a aposentadoria?",
      "Como declarar o IRPF sendo MEI motorista?",
      "Motorista Uber que é MEI paga menos imposto?",
    ],
  },
  {
    slug: "renda-extra-uber-vale-a-pena-2025",
    keyword: "renda extra uber vale a pena 2025",
    titleHint:
      "Renda extra com Uber em 2025: vale a pena ou não? A verdade sem filtro",
    metaDescHint:
      "Análise honesta de se vale a pena fazer Uber como renda extra em 2025 — cálculo de custos, ganhos reais, bônus de indicação e quando faz sentido investir.",
    cluster: "CLUSTER_B",
    perfil: "motorista-uberx",
    tags: [
      "renda extra uber",
      "vale a pena uber 2025",
      "uber como renda complementar",
      "ganhos extras carro",
    ],
    keywords: [
      "renda extra uber 2025",
      "vale a pena uber renda extra",
      "fazer uber nos fins de semana",
      "uber meio periodo",
      "ganho extra motorista app",
    ],
    bonusHighlight:
      "R$ 350 de bônus nas primeiras 70 viagens garante retorno imediato",
    angle:
      "Perspectiva de quem trabalha 15-20h/semana como renda extra. Cálculo real de quanto dá para ganhar nos fins de semana + feriados vs custos fixos.",
    faqQuestions: [
      "Fazer Uber nos fins de semana é rentável?",
      "Quanto tempo leva para o carro se pagar fazendo Uber?",
      "É possível ganhar R$ 1.000 extras por mês com Uber?",
      "Fazer Uber prejudica minha garantia do carro?",
      "Existe risco de batida ou sinistro ao fazer Uber?",
    ],
  },
  {
    slug: "uber-para-aposentados-motorista-pode",
    keyword: "aposentado pode ser motorista uber",
    titleHint: "Aposentado pode fazer Uber? O que a Receita Federal diz sobre seus ganhos",
    metaDescHint:
      "Entenda se aposentados podem ser motoristas Uber em 2025, o impacto nos benefícios INSS, como declarar no IRPF e como garantir o bônus de boas-vindas.",
    cluster: "CLUSTER_D",
    perfil: "autonomo-geral",
    tags: [
      "aposentado uber motorista",
      "aposentado renda extra app",
      "uber aposentado irpf",
      "inss uber aposentado",
    ],
    keywords: [
      "aposentado pode fazer uber",
      "aposentado motorista app 2025",
      "uber aposentado inss",
      "ganhos aposentado uber irpf",
      "renda extra aposentado uber",
    ],
    bonusHighlight:
      "Aposentados têm bônus de boas-vindas de R$ 350 nas primeiras 70 viagens",
    angle:
      "Esclarece dúvidas específicas de aposentados: impacto no benefício INSS, limite de renda, como declarar no IRPF, isenção para doenças graves e como o Uber se encaixa na rotina.",
    faqQuestions: [
      "Aposentado pode trabalhar como motorista Uber sem perder o benefício?",
      "Os ganhos do Uber afetam a aposentadoria do INSS?",
      "Aposentado com doença grave paga IR sobre ganhos do Uber?",
      "Como aposentado motorista Uber declara no IRPF?",
      "Qual o limite de renda que o aposentado pode ganhar no Uber sem pagar imposto?",
    ],
  },
  {
    slug: "uber-motorista-40-anos-primeira-vez",
    keyword: "começar uber motorista depois dos 40 anos",
    titleHint:
      "Começar como motorista Uber depois dos 40 anos: guia para quem está recomeçando",
    metaDescHint:
      "Você tem mais de 40 anos e quer começar no Uber? Veja o que muda na prática, os requisitos, bônus de cadastro e como transformar isso em renda consistente.",
    cluster: "CLUSTER_A",
    perfil: "motorista-uberx",
    tags: [
      "uber 40 anos",
      "motorista uber primeira vez",
      "uber recomeço profissional",
      "renda extra 40 anos",
    ],
    keywords: [
      "começar uber depois dos 40",
      "uber motorista primeira vez 2025",
      "recolocacao profissional uber",
      "uber para quem perdeu emprego",
      "motorista app sem experiencia",
    ],
    bonusHighlight:
      "R$ 350 de bônus garantido via link de indicação para novos cadastros",
    angle:
      "Tom motivacional e prático para quem está recomeçando. Desmistifica inseguranças comuns (tecnologia, segurança, concorrência) e apresenta o bônus de boas-vindas como impulso inicial.",
    faqQuestions: [
      "É tarde para começar no Uber com mais de 40 anos?",
      "Tenho dificuldade com tecnologia — consigo usar o app do motorista Uber?",
      "O Uber discrimina motoristas mais velhos?",
      "Posso usar Uber para sair de uma demissão ou desemprego?",
      "Como o bônus de indicação ajuda quem está começando do zero?",
    ],
  },
  {
    slug: "link-indicacao-uber-motorista-o-que-e",
    keyword: "link de indicação uber motorista o que é",
    titleHint:
      "Link de indicação Uber para motorista: o que é, como usar e quanto vale",
    metaDescHint:
      "Entenda como funciona o link de indicação da Uber para motoristas em 2025, quanto de bônus você pode ganhar e como usar o link para garantir R$ 350 extras.",
    cluster: "CLUSTER_A",
    perfil: "motorista-uberx",
    tags: [
      "link indicação uber",
      "bonus indicacao uber motorista",
      "como usar link uber",
      "indicação uber 2025",
    ],
    keywords: [
      "link indicacao uber motorista",
      "bonus link indicacao uber 2025",
      "como usar link indicacao uber",
      "indica um amigo uber motorista",
      "ganhar bonus uber indicacao",
    ],
    bonusHighlight:
      "R$ 350 garantidos ao usar o link de indicação e completar 70 viagens",
    angle:
      "Explica o mecanismo completo do programa de indicação: como o bônus é calculado, prazo para completar as viagens, como rastrear o progresso e o link disponível para novo cadastro.",
    faqQuestions: [
      "O que é um link de indicação Uber para motoristas?",
      "O bônus de indicação é creditado automaticamente?",
      "Qual o prazo para completar as viagens e receber o bônus?",
      "O link de indicação funciona em qualquer cidade do Brasil?",
      "Posso usar mais de um link de indicação no cadastro Uber?",
    ],
  },
];

/** Retorna os slugs de todos os posts já definidos no mapa */
export function getAllMotoristaPostSlugs(): string[] {
  return MOTORISTA_POSTS.map((p) => p.slug);
}

/** Busca definição de post por slug */
export function getMotoristPostBySlug(
  slug: string,
): MotoristPostDef | undefined {
  return MOTORISTA_POSTS.find((p) => p.slug === slug);
}

/** Busca definição de post por índice */
export function getMotoristPostByIndex(
  index: number,
): MotoristPostDef | undefined {
  return MOTORISTA_POSTS[index];
}
