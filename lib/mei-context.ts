/**
 * Contexto factual do MEI — base de conhecimento hardcoded para injeção em prompts.
 * Atualizado: maio/2026. Fonte: gov.br/mei, Receita Federal, SEBRAE, Portal Empreendedor.
 *
 * REGRA DE USO: este arquivo é a fonte da verdade para conteúdo MEI.
 * Nunca publicar valores ou prazos sem que estejam neste arquivo ou em pesquisa verificada.
 */

export const MEI_DATA_CONTEXT = `
═══════════════════════════════════════════
CONTEXTO FACTUAL MEI 2026 — FONTE OFICIAL
═══════════════════════════════════════════

DADOS GERAIS DO MEI 2026:
- Limite de faturamento anual: R$ 81.000,00 (comércio/indústria/serviços) — R$ 251.600,00 para MEI Caminhoneiro
- Número de empregados: pode ter 1 empregado com salário mínimo ou piso da categoria
- CNPJ gratuito: abertura e manutenção sem custo
- Regime: Simples Nacional — modalidade MEI
- Atividades permitidas: listadas no Anexo da Resolução CGSN 140/2018 (mais de 500 ocupações)
- Atividades VEDADAS ao MEI: profissões intelectuais regulamentadas (médico, advogado, engenheiro, contador), sócios, administradores de outras empresas, empresas públicas

DAS MENSAL (Documento de Arrecadação do Simples Nacional) — 2026:
- Comércio/Indústria: R$ 73,00 (INSS R$ 65,28 + ICMS R$ 7,72)
- Serviços: R$ 79,90 (INSS R$ 65,28 + ISS R$ 14,62 — sobre salário mínimo R$ 1.518,00)
- Comércio + Serviços (atividade mista): R$ 80,90 (INSS + ICMS + ISS)
- MEI Caminhoneiro: R$ 182,60 (INSS proporcional à parcela mínima)
- Vencimento: todo dia 20 do mês seguinte. Atraso gera juros Selic + multa de 0,33%/dia (máx 20%)
- PGDAS: não obrigatório para MEI — substituído pelo DAS simplificado

DASN-SIMEI (Declaração Anual do Simples Nacional para MEI) 2026:
- Prazo: até 31 de maio de 2026
- Declaração referente ao ano-calendário 2025
- Obrigatório para TODO MEI, mesmo com faturamento zero ou MEI inativo
- Como fazer: Portal do Empreendedor (gov.br/mei) ou app MEI
- Penalidade por atraso: multa de 2% ao mês (máx 20%), mínimo R$ 50,00
- MEI inativo em 2025: deve declarar com faturamento R$ 0,00 (sem receita)
- ATENÇÃO: a DASN-SIMEI é diferente do IRPF PF — são declarações independentes

DASN-SIMEI E IRPF PF (RELAÇÃO CRÍTICA):
- MEI com faturamento até R$ 81.000/ano e sem outros rendimentos: geralmente NÃO obrigado a declarar IRPF PF
- MEI com faturamento ACIMA de R$ 81.000/ano (excedeu o limite): perde o MEI E deve declarar IRPF PF
- MEI com rendimentos ALÉM do MEI (salário, aluguel, investimentos acima dos limites): OBRIGADO ao IRPF PF
- MEI + renda como CLT: se o total superar R$ 35.584,00 em 2025, declaração IRPF PF é obrigatória
- Importante: os rendimentos do MEI na declaração IRPF PF seguem regras específicas de tributação

ABERTURA DO MEI:
- Portal: gov.br/mei / Portal do Empreendedor
- Tempo: menos de 10 minutos, 100% gratuito
- Documentos: CPF, RG, título de eleitor (ou dados de nascimento), endereço residencial
- CNPJ gerado na hora, com certificado digital gratuito via gov.br
- Após abertura: emitir alvará de funcionamento na prefeitura (pode ser dispensado conforme município)
- Primeiro DAS: no mês seguinte à abertura
- Primeiro IRPF PF no exercício seguinte à abertura: depende dos rendimentos totais

CANCELAMENTO/BAIXA DO MEI:
- Portal: gov.br/mei → "Solicitar Baixa"
- Gratuito e online
- MEI deve estar em dia com DAS (ou quitar os débitos antes/durante o processo)
- DASN-SIMEI do último período: deve ser entregue mesmo após a baixa
- Após baixa: CNPJ fica inativo mas o CPF do titular permanece com obrigações do IRPF PF
- Débitos pendentes no CNPJ: podem ir a dívida ativa, mas não bloqueiam o CPF automaticamente
- Prazo: processo de baixa em até 60 dias
- ATENÇÃO: baixar o MEI NÃO elimina a obrigação de declarar o IRPF PF se havia rendimentos acima do limite

DÍVIDAS E PARCELAMENTO MEI:
- DAS em atraso: parcelar no Portal do Empreendedor ou pelo PGDAS-D
- Parcelamento convencional: até 60 meses
- REFIS/PERT: programas especiais de renegociação (quando abertos pelo governo)
- Novo Desenrola Empresas 2026 (Procred/FGO — em vigor):
  * Microempresas (faturamento até R$ 360 mil/ano): MEI se enquadra
  * Carência: até 24 meses (antes era 12)
  * Prazo máximo: até 96 meses (antes era 72)
  * Valor do crédito: até 50% do faturamento, teto R$ 180 mil (empres. mulheres: 60%, R$ 180 mil)
  * Tolerância de atraso para novo crédito: até 90 dias (antes era 14)
  * Acesso: bancos participantes via SEBRAE + canais oficiais
- Dívida ativa do MEI: Receita Federal / PGFN — parcelamento especial disponível
- Simples Nacional em atraso: parcelar no portal do Simples Nacional (receita.fazenda.gov.br/simples)

INSCRIÇÃO INDEVIDA / MEI IRREGULAR:
- MEI que excedeu o limite: será excluído do Simples Nacional e deve optar por outro regime (ME)
- MEI que exerceu atividade vedada: exclusão retroativa, deve regularizar
- Consequências: cobrança retroativa de impostos normais + multas
- Regularização via e-CAC da Receita Federal

CSRT/DAS PARCELAMENTO ESPECIAL:
- Programa Desenrola Empresas / Procred 360 ativo em 2026
- MEI pode renegociar dívidas com descontos em juros e multas (variável conforme instituição)

IRPF DO MEI — TRIBUTAÇÃO DOS RENDIMENTOS:
- Rendimentos do MEI na declaração PF: parte isenta (parcela isentável proporcional ao lucro) + parte tributável
- Cálculo específico: receita bruta MEI menos despesas comprovadas = lucro; parcela tributável depende da atividade
- Carnê-leão: MEI que presta serviços para PF fora do CNPJ recolhe carnê-leão mensalmente
- Livro-caixa simplificado: MEI pode usar para comprovar despesas e reduzir base tributável do IRPF

BENEFÍCIOS PREVIDENCIÁRIOS DO MEI (contexto):
- Contribuição mensal ao INSS via DAS garante: aposentadoria por idade, auxílio-doença, salário-maternidade
- Para aposentadoria por tempo de contribuição: MEI NÃO tem essa modalidade — apenas por idade
- Carência: 12 meses de contribuição para maioria dos benefícios
- ATENÇÃO: benefícios do INSS são DIFERENTES dos serviços da Consultoria NSB — mencionar apenas como contexto

FONTES OFICIAIS MEI:
- Portal do Empreendedor: gov.br/mei
- Receita Federal MEI: receita.fazenda.gov.br
- SEBRAE MEI: sebrae.com.br
- Portal e-CAC: cav.receita.fazenda.gov.br
- Legislação: Lei Complementar 123/2006 + Resolução CGSN 140/2018
- O que precisa saber antes de ser MEI: gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/o-que-voce-precisa-saber-antes-de-se-tornar-um-mei
- Atividades MEI permitidas: gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/atividades-permitidas
- Direitos e obrigações MEI: gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/direitos-e-obrigacoes
- Verificar débitos MEI: gov.br/empresas-e-negocios/pt-br/empreendedor/verificar-debitos-do-mei
- Cartão MEI / Contrata Mais Brasil: contratamaisbrasil.sistema.gov.br

═══════════════════════════════════════════
NOVO DESENROLA BRASIL 2026 — DADOS OFICIAIS
Fonte: Ministério da Fazenda — apresentação oficial maio/2026
═══════════════════════════════════════════

O QUE É O NOVO DESENROLA BRASIL:
- Mobilização nacional de 90 dias para brasileiros renegociarem dívidas e limparem o nome
- Lançado pelo Ministério da Fazenda em maio de 2026
- Fases: Desenrola Famílias, Desenrola FIES, Desenrola Empresas (Procred + Pronampe), Desenrola Rural

DESENROLA FAMÍLIAS — REGRAS OFICIAIS COMPLETAS:
- Público-alvo: brasileiros com renda até 5 salários mínimos (R$ 8.105,00)
- Dívidas elegíveis: cartão de crédito rotativo, cheque especial e crédito pessoal (CDC)
- Período das dívidas: contratadas até 31 de janeiro de 2026, com atraso entre 90 dias e 2 anos
- Desconto: entre 30% e 90% (conforme tipo e tempo de atraso — ver tabela abaixo)
- Taxa de juros máxima da nova dívida: 1,99% ao mês
- Prazo de pagamento: até 48 meses
- Prazo 1ª parcela: até 35 dias após adesão
- Limite da nova dívida (após descontos): R$ 15.000 por pessoa, por instituição financeira
- Garantia: FGO (Fundo de Garantia de Operações)
- Como participar: procurar os canais oficiais dos bancos participantes

TABELA OFICIAL DE DESCONTOS — DESENROLA FAMÍLIAS:
Crédito Rotativo (CC Rotativo + Cheque Especial):
  91–120 dias de atraso → 40% de desconto
  121–150 dias → 45%
  151–180 dias → 50%
  181–240 dias → 55%
  241–300 dias → 70%
  301–360 dias → 85%
  1 a 2 anos → 90%
Crédito Pessoal (CDC s/Garantia + CC Parcelado):
  91–120 dias de atraso → 30% de desconto
  121–150 dias → 35%
  151–180 dias → 40%
  181–240 dias → 45%
  241–300 dias → 60%
  301–360 dias → 75%
  1 a 2 anos → 80%

CONTRAPARTIDAS DO DESENROLA FAMÍLIAS:
Para as famílias: bloqueio do CPF em casas de apostas por 12 meses
Para as instituições financeiras:
  - Desnegativar (limpar o nome) de quem tem dívida de até R$ 100 e do crédito renegociado
  - Destinar 1% do valor garantido pelo FGO para educação financeira
  - Proibição de enviar recursos a casas de apostas via cartão crédito, PIX crédito e parcelado

FGTS NO DESENROLA FAMÍLIAS:
- Novidade: trabalhadores podem usar parcela do FGTS para quitar dívidas renegociadas
- Valor: 20% do saldo da conta OU R$ 1.000, o que for maior
- Condição: só pode usar o FGTS APÓS renegociar a dívida no programa
- Limite global de saques do programa: R$ 8,2 bilhões

FGO — FONTES DE RECURSOS:
- Saldo já disponível: R$ 2 bilhões
- Novos aportes autorizados: até R$ 5 bilhões
- Recursos não resgatados (SVR): entre R$ 5 a R$ 8 bilhões (devolução de tarifas indevidas, contas encerradas com saldo)

MUDANÇAS CONSIGNADO INSS (Desenrola Famílias):
- Margem total: reduz de 45% para 40%, com redução gradual de 2pp/ano até chegar a 30%
- Cartão consignado + benefícios: máximo 5% cada (era 10% total)
- Prazo máximo da operação: de 96 para 108 meses
- Carência: agora permitida até 90 dias (antes era vedada)

MUDANÇAS CONSIGNADO SERVIDOR PÚBLICO (Desenrola Famílias):
- Margem total: de 45% para 40%, redução gradual de 2pp/ano até 30%
- Cartão consignado: máximo 10% (extingue margem exclusiva problemática)
- Prazo máximo: de 96 para 120 meses
- Carência autorizada: até 120 dias

DESENROLA FIES 2026:
- Público: estudantes com dívidas FIES vencidas há mais de 90 dias
- Pagamento à vista (+90 dias atrasado): desconto de 100% nos juros e multas + 12% do principal
- Parcelamento (+90 dias): desconto de 100% nos juros e multas (em até 150 vezes)
- Dívidas +360 dias fora do CadÚnico: desconto de até 77% do valor total (principal + juros + multa)
- Dívidas +360 dias no CadÚnico: desconto de até 99% do valor total
- Impacto estimado: mais de 1 milhão de estudantes beneficiados

DESENROLA EMPRESAS — MICROEMPRESAS (Procred/FGO) 2026:
- Público: microempresas faturamento anual até R$ 360 mil — MEI que migrou para ME se enquadra
- Carência: de 12 para 24 meses
- Prazo máximo: de 72 para 96 meses
- Tolerância de atraso para novos créditos: de 14 para 90 dias
- Limite de crédito: de 30% (teto R$ 150 mil) para 50% do faturamento (novo teto R$ 180 mil)
- Empresas lideradas por mulheres: 60% do faturamento (teto R$ 180 mil)

DESENROLA EMPRESAS — MICRO E PEQUENAS (Pronampe/FGO) 2026:
- Público: empresas faturamento anual até R$ 4,8 milhões
- Carência: de 12 para 24 meses
- Prazo máximo: de 72 para 96 meses
- Tolerância para novos créditos: de 14 para 90 dias
- Limite de crédito: de R$ 250 mil para R$ 500 mil

DESENROLA RURAL 2026:
- Público: agricultores familiares de baixa renda
- Objetivo: regularização de dívidas + reinserção produtiva + acesso ao crédito rural
- Prazo reaberto até 20 de dezembro de 2026
- Já beneficiou: ~507.000 produtores; meta com reabertura: mais 800.000 = 1,3 milhão no total

RELAÇÃO DESENROLA + IRPF — ARGUMENTO DE VENDA NILSON BRITES:
- CPF limpo pelo Desenrola permite desbloquear restituição do IRPF represada por pendências
- Quem teve dívida cancelada em 2025 pode ter renda tributável não declarada (risco de malha fina)
- MEI que aderiu ao Desenrola Empresas DEVE entregar DASN-SIMEI + IRPF PF corretamente
- Próximo passo natural após regularizar dívidas: regularizar o IRPF com Nilson Brites

FONTES OFICIAIS NOVO DESENROLA BRASIL:
- gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/novo-desenrola-brasil
- gov.br/fazenda/pt-br/assuntos/noticias/2026/maio/governo-federal-anuncia-programa-para-renegociacao-de-dividas-de-familias-estudantes-e-empresas
- gov.br/sri/pt-br/governo-do-brasil-lanca-o-programa-desenrola-2.0
- bb.com.br/site/pra-voce/desenrola-brasil
`;

// Frase de disclaimer obrigatória em conteúdo MEI
export const MEI_DISCLAIMER = `<p class="disclaimer" style="font-size:0.8em;color:#666;border-top:1px solid #eee;padding-top:16px;margin-top:32px;">Conteúdo de caráter educativo sobre MEI e Imposto de Renda. Para análise do seu caso específico, consulte o especialista <strong>Nilson Brites — Consultoria IRPF NSB</strong>. WhatsApp: +55 11 94082-5120.</p>`;

export type MeiEditorialPhase =
  | "before_deadline"
  | "deadline_14d"
  | "post_deadline";

export type ClusterIntent =
  | "Traffic Post"
  | "Lead Post"
  | "Urgency Post"
  | "Regularization Post"
  | "Service Intent Post";

export type MeiClusterPhase =
  | "before_deadline"
  | "deadline_14d"
  | "post_deadline"
  | "always";

export type MeiKeywordCluster = {
  primary: string;
  secondary: string[];
  volume: "alta" | "media" | "baixa";
  intent: "informacional" | "transacional";
  categoria: "MEI" | "DESENROLA";
  phases?: MeiClusterPhase[];
  postIntent?: ClusterIntent;
};

export const DASN_2026_DEADLINE = new Date("2026-05-31T23:59:59.999Z");

// Clusters de keywords MEI para o blog engine
export const MEI_KEYWORD_CLUSTERS: MeiKeywordCluster[] = [
  // Cluster 1 — DASN / Declaração Anual
  {
    primary: "declaração anual MEI 2026 DASN prazo maio",
    secondary: ["dasn-simei como fazer", "mei obrigado declarar imposto", "prazo declaracao mei 2026"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["before_deadline", "deadline_14d"],
    postIntent: "Urgency Post",
  },
  // Cluster 2 — MEI e IRPF PF
  {
    primary: "MEI precisa declarar imposto de renda pessoa física",
    secondary: ["mei soma com salario irpf", "mei faturamento acima limite ir", "mei e irpf pf"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["always"],
    postIntent: "Lead Post",
  },
  // Cluster 3 — Abertura MEI
  {
    primary: "como abrir MEI 2026 passo a passo gratuito",
    secondary: ["abertura mei portal empreendedor", "documentos para abrir mei", "cnpj gratuito microempreendedor"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["always"],
    postIntent: "Traffic Post",
  },
  // Cluster 4 — Cancelamento/Baixa
  {
    primary: "como cancelar MEI baixa 2026",
    secondary: ["baixar cnpj mei", "mei inativo o que fazer", "encerrar mei portal empreendedor"],
    volume: "media",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["always"],
    postIntent: "Service Intent Post",
  },
  // Cluster 5 — Dívidas DAS
  {
    primary: "MEI com DAS atrasado como parcelar 2026",
    secondary: ["mei divida das parcelamento", "pgdas mei em atraso", "regularizar mei inadimplente"],
    volume: "media",
    intent: "transacional",
    categoria: "MEI" as const,
    phases: ["post_deadline"],
    postIntent: "Regularization Post",
  },
  // Cluster 6 — Desenrola MEI
  {
    primary: "Desenrola Brasil 2026 MEI microempreendedor como participar",
    secondary: ["desenrola empresas mei procred", "renegociar divida mei 2026", "procred fgo microempresa"],
    volume: "alta",
    intent: "transacional",
    categoria: "MEI" as const,
    phases: ["always"],
    postIntent: "Service Intent Post",
  },
  // Cluster 7 — Limite faturamento
  {
    primary: "limite faturamento MEI 2026 o que acontece se ultrapassar",
    secondary: ["mei ultrapassou limite virando me", "faturamento acima 81000 mei consequencias", "exclusao simples nacional mei"],
    volume: "media",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["always"],
    postIntent: "Lead Post",
  },
  // Cluster 8 — DAS valor / quanto paga
  {
    primary: "MEI quanto paga de imposto mensal 2026 DAS",
    secondary: ["das mei valor mensal 2026", "mei impostos mensais comercio servico", "icms iss mei"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
    phases: ["before_deadline", "deadline_14d"],
    postIntent: "Traffic Post",
  },
  {
    primary: "DASN-SIMEI atrasada 2026 multa e como regularizar",
    secondary: ["dasm multa atraso mei", "declaracao mei atrasada regularizar", "parcelamento mei apos prazo"],
    volume: "alta",
    intent: "transacional",
    categoria: "MEI" as const,
    phases: ["post_deadline"],
    postIntent: "Regularization Post",
  },
];

// Clusters Desenrola Brasil para blog
export const DESENROLA_KEYWORD_CLUSTERS: MeiKeywordCluster[] = [
  // ── Programa completo ────────────────────────────────────────────────────
  {
    primary: "Novo Desenrola Brasil 2026 como funciona fases participar",
    secondary: ["desenrola brasil 90 dias renegociacao", "novo desenrola ministerio fazenda 2026", "limpar nome 2026 programa governo"],
    volume: "alta",
    intent: "informacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Traffic Post",
  },
  // ── Famílias — visão geral ───────────────────────────────────────────────
  {
    primary: "Desenrola Famílias 2026 quem pode participar renda 5 salários",
    secondary: ["desenrola familias requisitos renda limite", "quem tem direito desenrola brasil 2026", "renda ate 5 salarios minimos desenrola"],
    volume: "alta",
    intent: "informacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Lead Post",
  },
  // ── Famílias — tabela de descontos ───────────────────────────────────────
  {
    primary: "tabela descontos Desenrola Famílias 2026 cartão cheque especial CDC",
    secondary: ["desconto 90 por cento cartao rotativo desenrola", "quanto desconto desenrola familias tempo atraso", "tabela porcentagem desconto desenrola 2026"],
    volume: "alta",
    intent: "informacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Traffic Post",
  },
  // ── Famílias — FGTS ──────────────────────────────────────────────────────
  {
    primary: "usar FGTS para pagar dívida Desenrola 2026 como funciona",
    secondary: ["fgts desenrola 20 por cento saldo ou 1000 reais", "sacar fgts quitar divida banco 2026", "fgts desenrola familias regras"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Lead Post",
  },
  // ── Famílias — contrapartidas / limpar nome ──────────────────────────────
  {
    primary: "Desenrola limpar nome CPF 2026 dívida até R$ 100 desnegativado",
    secondary: ["desnegativar cpf desenrola 2026", "nome limpo desenrola familias automatico", "cpf negativado como limpar 2026"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Regularization Post",
  },
  // ── FIES ─────────────────────────────────────────────────────────────────
  {
    primary: "Desenrola FIES 2026 desconto 99 por cento dívida estudante",
    secondary: ["fies quitacao desconto cadunico 99 por cento", "renegociar fies 2026 parcelamento 150 vezes", "fies atrasado 360 dias como resolver"],
    volume: "media",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Lead Post",
  },
  // ── Empresas — MEI Procred ───────────────────────────────────────────────
  {
    primary: "Desenrola Empresas MEI Procred 2026 renegociar dívida microempresa",
    secondary: ["procred fgo mei credito 50 por cento faturamento 180 mil", "renegociar divida cnpj mei desenrola 2026", "microempresa divida banco como renegociar 2026"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Service Intent Post",
  },
  // ── Pronampe micro e pequenas ────────────────────────────────────────────
  {
    primary: "Pronampe 2026 microempresa crédito até R$ 500 mil novo limite",
    secondary: ["pronampe novo limite 500 mil credito barato", "pronampe prazo 96 meses carencia 24 meses", "micro empresa credito pronampe 2026"],
    volume: "media",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Service Intent Post",
  },
  // ── Consignado INSS aposentados ──────────────────────────────────────────
  {
    primary: "consignado INSS 2026 nova margem 40 por cento mudanças aposentado",
    secondary: ["consignado inss prazo 108 meses regra nova", "margem consignavel inss reducao 30 por cento", "aposentado consignado limite novo 2026"],
    volume: "media",
    intent: "informacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Traffic Post",
  },
  // ── Desenrola Rural ──────────────────────────────────────────────────────
  {
    primary: "Desenrola Rural 2026 agricultor familiar regularizar dívida prazo dezembro",
    secondary: ["desenrola rural prazo 20 dezembro 2026", "agricultor familiar renegociar divida credito rural", "1 milhao agricultores desenrola rural beneficiados"],
    volume: "media",
    intent: "informacional",
    categoria: "DESENROLA" as const,
    phases: ["before_deadline", "post_deadline"],
    postIntent: "Lead Post",
  },
  // ── Limpar nome + IR (funil para serviço) ────────────────────────────────
  {
    primary: "limpei o nome pelo Desenrola próximo passo IRPF 2026",
    secondary: ["cpf limpo receita federal declarar irpf", "desenrola regularizar imposto renda nilson brites", "restituicao bloqueada cpf negativado como liberar"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Service Intent Post",
  },
  // ── MEI + Desenrola Empresas ─────────────────────────────────────────────
  {
    primary: "MEI com dívida no banco Desenrola Empresas 2026 como aderir",
    secondary: ["mei divida banco como renegociar 2026", "procred mei carencia 24 meses novo prazo", "mei empresa desenrola faturamento 50 por cento credito"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
    phases: ["always"],
    postIntent: "Regularization Post",
  },
];

export function getMeiEditorialPhase(now: Date = new Date()): MeiEditorialPhase {
  if (now > DASN_2026_DEADLINE) return "post_deadline";
  const daysLeft = Math.ceil(
    (DASN_2026_DEADLINE.getTime() - now.getTime()) / 86_400_000,
  );
  if (daysLeft <= 14) return "deadline_14d";
  return "before_deadline";
}

export function isMeiClusterAllowedByPhase(
  phases: MeiClusterPhase[] | undefined,
  phase: MeiEditorialPhase,
): boolean {
  const allowed = phases && phases.length > 0 ? phases : ["always"];
  return allowed.includes("always") || allowed.includes(phase);
}
