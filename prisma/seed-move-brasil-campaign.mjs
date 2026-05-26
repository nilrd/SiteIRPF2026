import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WHATSAPP_CTA =
  "https://wa.me/5511940825120?text=" +
  encodeURIComponent(
    "Olá, vim pelo post sobre Move Brasil. Sou motorista e quero organizar minha documentação, IRPF/CPF/MEI e comprovação de renda para tentar financiamento.",
  );

const EXTERNAL_SOURCES = [
  "https://www.gov.br/mdic/pt-br/assuntos/sdic/move-brasil",
  "https://www.gov.br/pt-br/servicos/solicitar-adesao-ao-move-brasil-taxi-e-aplicativos",
  "https://www.bndes.gov.br/wps/portal/site/home/financiamento/produto/programa-move-motoristas/programa-bndes-move-motoristas",
  "https://noticias.r7.com/prisma/autos-carros/como-vai-funcionar-o-move-brasil-para-taxi-e-uber-veja-regras-juros-e-prazos-24052026/",
  "https://www.chevrolet.com.br/move-brasil-credito-taxistas-motoristas",
  "https://www.vrum.com.br/noticias/2026/05/7424344-move-brasil-aplicativos-e-taxistas-quais-carros-se-enquadram-no-programa.html",
];

const CAMPAIGN_TAGS = [
  "Move Brasil",
  "Motorista de Aplicativo",
  "Taxista",
  "Financiamento de Veículo",
  "IRPF",
  "CPF",
  "MEI",
  "Comprovação de Renda",
];

const POSTS = [
  {
    title:
      "Move Brasil: como se cadastrar para tentar financiar carro zero sendo Uber, 99 ou taxista",
    slug: "move-brasil-como-se-cadastrar-financiar-carro-zero",
    keyword: "Move Brasil como se cadastrar",
    summary:
      "Passo a passo para motorista de app e taxista se cadastrar no Move Brasil sem confundir elegibilidade com aprovação de crédito.",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Motorista de aplicativo organizando cadastro e documentos para financiamento",
    prompt:
      "Foto editorial realista em alta qualidade, motorista de aplicativo brasileiro segurando celular com tela genérica de cadastro, carro zero moderno ao fundo, ambiente urbano brasileiro, luz natural, composição profissional para notícia sobre financiamento automotivo, sem logos, sem texto, horizontal 16:9.",
    related: [
      "irpf-ajuda-comprovar-renda-financiamento-veiculo",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "documentos-move-brasil-motorista-financiamento",
      "cpf-irregular-atrapalha-financiamento-move-brasil",
      "mei-motorista-aplicativo-pode-participar-move-brasil",
    ],
    faqs: [
      {
        question: "Cadastro no Move Brasil já significa financiamento aprovado?",
        answer:
          "Não. O cadastro e a elegibilidade no programa são uma etapa. A aprovação depende da análise de crédito da instituição financeira, com regras próprias.",
      },
      {
        question: "Quem é motorista de app precisa de quais documentos básicos?",
        answer:
          "Em geral, identidade, CPF regular, comprovantes de renda e movimentação, além de documentos do veículo quando exigidos. Consulte sempre o canal oficial atualizado.",
      },
      {
        question: "IRPF pode ajudar na tentativa de crédito?",
        answer:
          "Pode ajudar na organização documental e na leitura da renda, mas não garante aprovação. O banco faz análise própria.",
      },
    ],
  },
  {
    title:
      "Saia do aluguel de carro? Governo abre cadastro do Move Brasil para motoristas de aplicativo",
    slug: "saia-do-aluguel-de-carro-move-brasil-motoristas-aplicativo",
    keyword: "sair do aluguel de carro Move Brasil",
    summary:
      "Entenda o que muda para motoristas que querem sair do aluguel e quais cuidados financeiros tomar antes de pedir crédito.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Motorista avaliando carro novo em concessionaria",
    prompt:
      "Imagem editorial realista, motorista olhando para carro novo em concessionária, ao lado de chave e documentos, expressão de expectativa, ambiente moderno, estilo jornalístico, alta qualidade, sem logos, sem texto, horizontal 16:9.",
    related: [
      "vale-a-pena-financiar-carro-move-brasil-ou-alugar",
      "move-brasil-aprova-financiamento-automaticamente",
      "checklist-motorista-financiamento-move-brasil",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
    ],
    faqs: [
      {
        question: "Trocar aluguel por financiamento é sempre melhor?",
        answer:
          "Não necessariamente. Depende de fluxo de caixa, quilometragem, custos de manutenção, juros e estabilidade da renda do motorista.",
      },
      {
        question: "O programa elimina a análise de risco do banco?",
        answer:
          "Não. A instituição financeira continua responsável por avaliar risco, capacidade de pagamento e documentação.",
      },
      {
        question: "Posso tentar mesmo com renda variável?",
        answer:
          "Pode tentar, mas organização documental costuma ser decisiva para apresentar uma renda mais clara na análise.",
      },
    ],
  },
  {
    title:
      "Move Brasil aprova financiamento automaticamente? Entenda antes de procurar o banco",
    slug: "move-brasil-aprova-financiamento-automaticamente",
    keyword: "Move Brasil aprova financiamento",
    summary:
      "A resposta curta é não: cadastro não é aprovação. Veja como funciona a etapa de crédito e o que realmente pesa.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Pessoa analisando contrato e documentos financeiros",
    prompt:
      "Imagem conceitual realista de análise de crédito automotivo, pessoa revisando documentos, extrato bancário genérico e notebook, carro moderno desfocado ao fundo, clima sério e informativo, sem marcas, horizontal 16:9.",
    related: [
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
      "irpf-ajuda-comprovar-renda-financiamento-veiculo",
      "documentos-move-brasil-motorista-financiamento",
      "cpf-irregular-atrapalha-financiamento-move-brasil",
    ],
    faqs: [
      {
        question: "Por que algumas pessoas se cadastram e não conseguem crédito?",
        answer:
          "Porque elegibilidade no programa e aprovação bancária são processos diferentes. O banco analisa risco, histórico e capacidade de pagamento.",
      },
      {
        question: "Ter CPF regular resolve tudo?",
        answer:
          "Ajuda muito, mas não resolve sozinho. A análise inclui renda, comprometimento financeiro e perfil de crédito.",
      },
      {
        question: "Existe garantia de taxa reduzida para todos?",
        answer:
          "Não há garantia universal. Condições variam por instituição, perfil e regras vigentes do programa.",
      },
    ],
  },
  {
    title: "IRPF ajuda a comprovar renda para financiamento de veículo?",
    slug: "irpf-ajuda-comprovar-renda-financiamento-veiculo",
    keyword: "IRPF ajuda financiar veículo",
    summary:
      "Como a declaração de IRPF pode fortalecer organização documental para motorista tentar crédito com mais clareza.",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Documentos de imposto de renda e chave de veiculo sobre mesa",
    prompt:
      "Imagem editorial realista de declaração de imposto de renda e financiamento de veículo, pessoa organizando documentos fiscais em mesa, chave de carro e notebook, ambiente profissional, alta qualidade, sem logos, horizontal 16:9.",
    related: [
      "move-brasil-aprova-financiamento-automaticamente",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "motorista-aplicativo-irpf-atrasado-comprovar-renda",
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
    ],
    faqs: [
      {
        question: "Declarar IRPF garante aprovação de financiamento?",
        answer:
          "Não garante. Pode ajudar na comprovação de renda e organização financeira, mas o banco decide com base na análise completa.",
      },
      {
        question: "Autônomo sem holerite pode usar IRPF como apoio?",
        answer:
          "Sim, junto com extratos, recibos e movimentação, a declaração pode compor um dossiê de renda mais consistente.",
      },
      {
        question: "IRPF atrasado atrapalha?",
        answer:
          "Pode atrapalhar a percepção de organização documental. Regularizar pendências costuma ser positivo na preparação.",
      },
    ],
  },
  {
    title: "Como comprovar renda sendo Uber, 99 ou taxista para financiar carro",
    slug: "como-comprovar-renda-uber-99-taxista-financiar-carro",
    keyword: "comprovar renda Uber financiamento",
    summary:
      "Guia objetivo com documentos e rotina de organização para renda variável de motorista de app e taxista.",
    image:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1600&q=80",
    imageAlt:
      "Motorista de aplicativo conferindo ganhos e extratos no celular",
    prompt:
      "Motorista de aplicativo brasileiro dentro de carro moderno, celular com app genérico no painel, documentos organizados no banco do passageiro, cidade ao fundo, imagem realista, alta qualidade, sem logos, horizontal 16:9.",
    related: [
      "irpf-ajuda-comprovar-renda-financiamento-veiculo",
      "mei-motorista-aplicativo-pode-participar-move-brasil",
      "checklist-motorista-financiamento-move-brasil",
      "cpf-irregular-atrapalha-financiamento-move-brasil",
    ],
    faqs: [
      {
        question: "Quais comprovantes têm mais peso para motorista de app?",
        answer:
          "Extratos bancários, histórico de repasses das plataformas e documentos fiscais organizados tendem a ter mais relevância.",
      },
      {
        question: "Basta mandar print de aplicativo?",
        answer:
          "Print isolado costuma ser fraco. O ideal é consolidar evidências de renda recorrente e movimentação compatível.",
      },
      {
        question: "MEI ajuda nessa organização?",
        answer:
          "Pode ajudar, principalmente na formalização e no registro de recebimentos, mas não substitui análise do banco.",
      },
    ],
  },
  {
    title:
      "Quem tem direito ao Move Brasil? Veja regras para taxistas e motoristas de aplicativo",
    slug: "quem-tem-direito-move-brasil-taxistas-motoristas-aplicativo",
    keyword: "quem tem direito move brasil",
    summary:
      "Panorama atualizado sobre elegibilidade e documentos para taxistas e motoristas de aplicativo.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Carro em area urbana representando mobilidade de motoristas",
    prompt:
      "Foto editorial de mobilidade urbana com carro moderno, motorista e contexto de transporte por aplicativo, estilo jornalístico, alta qualidade, sem logos, horizontal 16:9.",
    related: [
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
      "mei-motorista-aplicativo-pode-participar-move-brasil",
      "documentos-move-brasil-motorista-financiamento",
    ],
    faqs: [
      { question: "Taxista e motorista de app seguem a mesma regra?", answer: "Nem sempre. Podem existir critérios e documentos específicos por perfil e por fase regulatória." },
      { question: "As regras são definitivas?", answer: "Não. Programas públicos podem ser atualizados. Sempre valide nos canais oficiais antes da solicitação." },
      { question: "Quem está negativado pode tentar?", answer: "Pode tentar, mas a análise de crédito da instituição pode restringir aprovação." },
    ],
  },
  {
    title: "Sou MEI e motorista de aplicativo: posso participar do Move Brasil?",
    slug: "mei-motorista-aplicativo-pode-participar-move-brasil",
    keyword: "mei motorista pode participar move brasil",
    summary: "Entenda como MEI pode se posicionar melhor na organização documental para tentar crédito.",
    image:
      "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Motorista MEI organizando documentos de empresa e renda",
    prompt:
      "Imagem editorial de motorista autônomo com documentos de MEI, celular e notebook, ambiente profissional, sem logos, horizontal 16:9.",
    related: [
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "irpf-ajuda-comprovar-renda-financiamento-veiculo",
      "quem-tem-direito-move-brasil-taxistas-motoristas-aplicativo",
    ],
    faqs: [
      { question: "Ter CNPJ MEI é obrigatório?", answer: "Não necessariamente em todos cenários, mas pode fortalecer organização financeira quando bem utilizado." },
      { question: "MEI substitui declaração de IRPF?", answer: "Não. São obrigações e documentos diferentes, que podem se complementar." },
      { question: "DASN-SIMEI em atraso impacta?", answer: "Pendências podem enfraquecer o dossiê documental. Regularização é recomendada." },
    ],
  },
  {
    title: "CPF irregular pode atrapalhar financiamento pelo Move Brasil?",
    slug: "cpf-irregular-atrapalha-financiamento-move-brasil",
    keyword: "cpf irregular atrapalha financiamento",
    summary: "CPF irregular pode criar barreiras na análise. Veja como regularizar antes de tentar crédito.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pessoa revisando situacao cadastral e documentos pessoais",
    prompt:
      "Imagem editorial de análise de situação cadastral e documentos pessoais para crédito, tom informativo, sem logos, horizontal 16:9.",
    related: [
      "move-brasil-aprova-financiamento-automaticamente",
      "documentos-move-brasil-motorista-financiamento",
      "checklist-motorista-financiamento-move-brasil",
    ],
    faqs: [
      { question: "CPF pendente impede qualquer tentativa?", answer: "Pode dificultar etapas de validação. O ideal é regularizar antes para reduzir risco de recusa por inconsistência cadastral." },
      { question: "Regularizar CPF garante aprovação?", answer: "Não garante. É uma etapa importante de preparação, mas o banco analisa outros fatores." },
      { question: "Onde verificar situação do CPF?", answer: "Nos canais oficiais da Receita Federal e serviços públicos autorizados." },
    ],
  },
  {
    title:
      "Move Brasil: documentos que o motorista deve organizar antes de pedir financiamento",
    slug: "documentos-move-brasil-motorista-financiamento",
    keyword: "documentos move brasil motorista",
    summary: "Checklist documental para chegar ao banco com informações claras e reduzir idas e vindas.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Checklist de documentos para analise de credito automotivo",
    prompt:
      "Imagem editorial de checklist de documentos, pasta organizada, notebook e chave de carro, ambiente profissional, sem logos, horizontal 16:9.",
    related: [
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "checklist-motorista-financiamento-move-brasil",
    ],
    faqs: [
      { question: "Vale levar documentação incompleta para adiantar?", answer: "Geralmente isso aumenta retrabalho. Um dossiê organizado tende a acelerar avaliação." },
      { question: "Extratos de quanto tempo?", answer: "Depende da instituição. Consulte o banco e mantenha histórico recente e consistente." },
      { question: "Comprovante de residência é sempre exigido?", answer: "Em muitos casos sim, com regras de validade por data de emissão." },
    ],
  },
  {
    title: "Carro alugado ou financiado: o que o motorista deve analisar antes de decidir",
    slug: "carro-alugado-ou-financiado-motorista-aplicativo",
    keyword: "carro alugado ou financiado motorista aplicativo",
    summary: "Comparativo financeiro e operacional para decisão consciente sem promessas fáceis.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Comparacao entre alugar carro e financiar para motorista de app",
    prompt:
      "Imagem editorial comparativa de mobilidade com carro em destaque e contexto de decisão financeira, sem logos, horizontal 16:9.",
    related: [
      "saia-do-aluguel-de-carro-move-brasil-motoristas-aplicativo",
      "vale-a-pena-financiar-carro-move-brasil-ou-alugar",
      "move-brasil-bndes-juros-prazo-cadastro-cuidados",
    ],
    faqs: [
      { question: "Existe resposta única para todos motoristas?", answer: "Não. A melhor opção depende de renda, custo total, risco e perfil de trabalho." },
      { question: "Financiamento sempre reduz custo mensal?", answer: "Nem sempre. Depende de entrada, prazo, juros e custos acessórios." },
      { question: "Aluguel pode fazer sentido no começo?", answer: "Pode, principalmente para quem ainda está validando rotina e previsibilidade de ganhos." },
    ],
  },
  {
    title: "Move Brasil e Chevrolet: entenda ofertas, cuidados e análise de crédito",
    slug: "move-brasil-chevrolet-ofertas-cuidados-analise-credito",
    keyword: "move brasil chevrolet",
    summary: "O que observar em ofertas comerciais sem confundir publicidade com garantia de crédito.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Carro em showroom representando oferta comercial para motoristas",
    prompt:
      "Imagem editorial realista de concessionária com carro em destaque, sem logos legíveis, foco em decisão de compra consciente, horizontal 16:9.",
    related: [
      "move-brasil-bndes-juros-prazo-cadastro-cuidados",
      "move-brasil-aprova-financiamento-automaticamente",
      "carro-alugado-ou-financiado-motorista-aplicativo",
    ],
    faqs: [
      { question: "Oferta de montadora significa crédito aprovado?", answer: "Não. Oferta comercial e aprovação bancária são etapas diferentes." },
      { question: "Posso comparar propostas antes de decidir?", answer: "Deve. Comparar CET, prazo, entrada e custo total evita decisão impulsiva." },
      { question: "Há risco de compromisso acima da renda?", answer: "Sim. Simulação conservadora é essencial para proteger fluxo de caixa." },
    ],
  },
  {
    title: "Move Brasil BNDES: juros, prazo, cadastro e cuidados antes de financiar",
    slug: "move-brasil-bndes-juros-prazo-cadastro-cuidados",
    keyword: "move brasil bndes juros prazo",
    summary: "Resumo prático sobre juros, prazo e etapas para motorista avaliar custo real do financiamento.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Analise de juros e prazo em financiamento de veiculo",
    prompt:
      "Imagem editorial de análise financeira com gráficos discretos, documentos e chave de carro, sem logos, horizontal 16:9.",
    related: [
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
      "move-brasil-aprova-financiamento-automaticamente",
      "carro-alugado-ou-financiado-motorista-aplicativo",
    ],
    faqs: [
      { question: "Juros do programa são fixos para todos?", answer: "Condições podem variar por instituição, perfil e regras atualizadas." },
      { question: "Prazo maior sempre ajuda?", answer: "Parcela pode cair, mas custo total pode subir. Avalie com cuidado." },
      { question: "É obrigatório consultar fonte oficial?", answer: "Sim. Regras e condições podem mudar ao longo do tempo." },
    ],
  },
  {
    title:
      "Motorista de aplicativo com IRPF atrasado pode ter dificuldade para comprovar renda?",
    slug: "motorista-aplicativo-irpf-atrasado-comprovar-renda",
    keyword: "motorista aplicativo irpf atrasado",
    summary: "Entenda riscos de manter IRPF atrasado e como regularizar para melhorar organização documental.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Motorista analisando pendencias fiscais e comprovacao de renda",
    prompt:
      "Imagem editorial de pendência fiscal e organização documental para crédito, pessoa revisando declarações e extratos, sem logos, horizontal 16:9.",
    related: [
      "irpf-ajuda-comprovar-renda-financiamento-veiculo",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "cpf-irregular-atrapalha-financiamento-move-brasil",
    ],
    faqs: [
      { question: "IRPF atrasado bloqueia automaticamente crédito?", answer: "Não há regra única, mas pode enfraquecer organização documental percebida na análise." },
      { question: "Regularizar depois de solicitar ajuda?", answer: "O ideal é antecipar regularização para chegar mais preparado." },
      { question: "MEI regular substitui IRPF em atraso?", answer: "Não. São obrigações diferentes e complementares." },
    ],
  },
  {
    title: "Checklist do motorista para tentar financiamento pelo Move Brasil",
    slug: "checklist-motorista-financiamento-move-brasil",
    keyword: "checklist motorista financiamento move brasil",
    summary: "Checklist direto para reduzir erros de documentação antes de entrar na etapa bancária.",
    image:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Checklist financeiro para motorista de aplicativo",
    prompt:
      "Imagem editorial de checklist e planejamento financeiro para motorista, mesa organizada com documentos e celular, sem logos, horizontal 16:9.",
    related: [
      "documentos-move-brasil-motorista-financiamento",
      "como-comprovar-renda-uber-99-taxista-financiar-carro",
      "move-brasil-como-se-cadastrar-financiar-carro-zero",
    ],
    faqs: [
      { question: "Checklist substitui análise de especialista?", answer: "Não. Ele organiza etapas, mas avaliação individual pode evitar erros importantes." },
      { question: "Posso usar o mesmo checklist para qualquer banco?", answer: "Serve como base, mas cada instituição pode pedir itens adicionais." },
      { question: "Organização realmente melhora resultado?", answer: "Pode melhorar clareza da análise, mas não garante aprovação." },
    ],
  },
  {
    title: "Vale a pena financiar carro pelo Move Brasil ou continuar alugando?",
    slug: "vale-a-pena-financiar-carro-move-brasil-ou-alugar",
    keyword: "vale a pena financiar carro move brasil",
    summary: "Decisão estratégica para motorista de app: quando financiar pode fazer sentido e quando aluguel ainda vence.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Motorista avaliando custo entre aluguel e financiamento",
    prompt:
      "Imagem editorial de decisão financeira para mobilidade, motorista comparando opções de custo de carro, sem logos, horizontal 16:9.",
    related: [
      "saia-do-aluguel-de-carro-move-brasil-motoristas-aplicativo",
      "carro-alugado-ou-financiado-motorista-aplicativo",
      "move-brasil-bndes-juros-prazo-cadastro-cuidados",
    ],
    faqs: [
      { question: "Qual opção é melhor em 2026?", answer: "Não existe resposta única. O melhor cenário depende da sua matemática real e do risco assumido." },
      { question: "Financiamento pode melhorar patrimônio?", answer: "Pode, desde que parcela e custos totais sejam sustentáveis na rotina de trabalho." },
      { question: "Aluguel ainda pode ser estratégico?", answer: "Sim, sobretudo em fase de transição, teste de demanda ou baixa previsibilidade de renda." },
    ],
  },
];

function titleToMetaTitle(title) {
  if (title.length <= 60) return title;
  return `${title.slice(0, 57)}...`;
}

function summaryToMetaDesc(summary) {
  if (summary.length <= 155) return summary;
  return `${summary.slice(0, 152)}...`;
}

function buildExternalSourcesHtml() {
  return `
<ul>
${EXTERNAL_SOURCES.map((u) => `  <li><a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a></li>`).join("\n")}
</ul>`;
}

function buildRelatedHtml(slugs) {
  return `
<ul>
${slugs.map((slug) => `  <li><a href="/blog/${slug}">/blog/${slug}</a></li>`).join("\n")}
</ul>`;
}

function buildFaqHtml(faqs) {
  return faqs
    .map(
      (f) => `
<h3>${f.question}</h3>
<p>${f.answer}</p>`,
    )
    .join("\n");
}

function buildContent(post) {
  return `
<p><strong>Resumo rápido:</strong> este conteúdo foi escrito para motoristas de aplicativo e taxistas que querem entender o Move Brasil com clareza. <strong>Cadastro e elegibilidade não significam aprovação automática de crédito.</strong> A instituição financeira ainda fará análise completa.</p>

<div style="border:1px solid #e5e7eb; padding:14px; background:#fafafa; margin:20px 0;">
  <strong>Atenção:</strong> cadastro no programa não garante aprovação do financiamento. As regras podem ser atualizadas e as condições variam conforme a análise de crédito de cada instituição.
</div>

<h2>O que muda para motoristas na prática</h2>
<p>Nos últimos meses, o interesse por troca de aluguel por carro próprio cresceu muito entre motoristas. O ponto central não é apenas encontrar uma linha de financiamento, e sim chegar no momento da análise com documentação coerente, renda minimamente rastreável e pendências críticas tratadas. Esse preparo reduz retrabalho e evita perder tempo em propostas frágeis.</p>
<p>Para quem trabalha com renda variável, pequenos ajustes de organização têm impacto real: separar contas pessoais e profissionais, concentrar recebimentos, registrar despesas essenciais e manter documentação fiscal em dia. Isso não cria promessa de aprovação, mas melhora a qualidade da informação apresentada ao banco.</p>

<h2>Cadastro, elegibilidade e aprovação: três etapas diferentes</h2>
<p>Uma confusão comum é tratar o cadastro no programa como sinônimo de crédito aprovado. Na prática, o fluxo costuma ter etapas diferentes: (1) entrada/cadastro; (2) validação de elegibilidade conforme regras vigentes; (3) análise da instituição financeira. É justamente na terceira etapa que histórico, renda, consistência documental e nível de endividamento pesam mais.</p>
<p>Por isso, o motorista precisa pensar de forma estratégica: antes de “ir ao banco”, vale montar um dossiê documental com antecedência. Essa abordagem aumenta previsibilidade, reduz surpresas e ajuda a comparar propostas com mais segurança.</p>

<h2>Como preparar comprovacao de renda sem promessa facil</h2>
<p>Motoristas de aplicativo e taxistas frequentemente não têm holerite tradicional. Ainda assim, existe como estruturar a comprovação com base em extratos, histórico de repasses, declaração de IRPF e rotina de movimentação mais organizada. O objetivo não é "maquiar" renda; é apresentar evidências de forma clara, contínua e auditável.</p>
<p>Se houver pendências de CPF, IRPF ou obrigações do MEI, o ideal é tratar isso antes de entrar na etapa decisiva. Esse cuidado não garante aprovação, mas reduz fragilidades que podem contaminar a leitura de risco da instituição.</p>

<h2>Checklist objetivo para chegar mais preparado</h2>
<ul>
  <li>Verificar situação cadastral do CPF e regularizar pendências relevantes.</li>
  <li>Atualizar organização fiscal (IRPF e obrigações do MEI, quando aplicável).</li>
  <li>Consolidar extratos e histórico de recebimentos recentes.</li>
  <li>Separar despesas críticas para simular parcela com margem de segurança.</li>
  <li>Comparar proposta por CET e custo total, não apenas parcela inicial.</li>
</ul>

<div style="border:1px solid #d1fae5; padding:16px; background:#ecfdf5; margin:22px 0;">
  <h3 style="margin-top:0;">Tente chegar mais preparado na análise do banco</h3>
  <p>Vai se cadastrar no Move Brasil ou tentar financiar um carro? A NSB Consultoria ajuda você a organizar IRPF, CPF, MEI e documentos de renda para apresentar uma situação mais clara na análise de crédito.</p>
  <p>
    <a href="/servicos">Organizar minha documentação</a> | 
    <a href="${WHATSAPP_CTA}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a> | 
    <a href="/servicos">Ver serviços de IRPF e MEI</a>
  </p>
</div>

<h2>Leia também sobre Move Brasil</h2>
${buildRelatedHtml(post.related)}

<h2>Fontes e leitura complementar</h2>
${buildExternalSourcesHtml()}

<h2>Perguntas frequentes</h2>
${buildFaqHtml(post.faqs)}

<h2>Prompt editorial sugerido para imagem destacada</h2>
<p>${post.prompt}</p>
`;
}

async function main() {
  const now = new Date();
  let processed = 0;

  for (const post of POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        summary: post.summary,
        content: buildContent(post),
        faqsJson: JSON.stringify(post.faqs),
        tags: [...CAMPAIGN_TAGS, post.keyword],
        keywords: [post.keyword, ...CAMPAIGN_TAGS],
        categoria: "GERAL",
        coverImage: post.image,
        imageAlt: post.imageAlt,
        published: true,
        hiddenFromBlogList: false,
        needsReview: false,
        metaTitle: titleToMetaTitle(post.title),
        metaDesc: summaryToMetaDesc(post.summary),
        updatedAt: now,
        aiModel: "manual-curated-move-brasil-2026",
      },
      create: {
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: buildContent(post),
        faqsJson: JSON.stringify(post.faqs),
        tags: [...CAMPAIGN_TAGS, post.keyword],
        keywords: [post.keyword, ...CAMPAIGN_TAGS],
        categoria: "GERAL",
        coverImage: post.image,
        imageAlt: post.imageAlt,
        published: true,
        hiddenFromBlogList: false,
        needsReview: false,
        metaTitle: titleToMetaTitle(post.title),
        metaDesc: summaryToMetaDesc(post.summary),
        readTime: 8,
        aiModel: "manual-curated-move-brasil-2026",
      },
    });

    processed += 1;
  }

  console.log(`MOVE_BRASIL_CAMPAIGN_OK:${processed}`);
}

main()
  .catch((err) => {
    console.error("MOVE_BRASIL_CAMPAIGN_ERROR", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
