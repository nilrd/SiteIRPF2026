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
`;

// Frase de disclaimer obrigatória em conteúdo MEI
export const MEI_DISCLAIMER = `<p class="disclaimer" style="font-size:0.8em;color:#666;border-top:1px solid #eee;padding-top:16px;margin-top:32px;">Conteúdo de caráter educativo sobre MEI e Imposto de Renda. Para análise do seu caso específico, consulte o especialista <strong>Nilson Brites — Consultoria IRPF NSB</strong>. WhatsApp: +55 11 94082-5120.</p>`;

// Clusters de keywords MEI para o blog engine
export const MEI_KEYWORD_CLUSTERS = [
  // Cluster 1 — DASN / Declaração Anual
  {
    primary: "declaração anual MEI 2026 DASN prazo maio",
    secondary: ["dasn-simei como fazer", "mei obrigado declarar imposto", "prazo declaracao mei 2026"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
  },
  // Cluster 2 — MEI e IRPF PF
  {
    primary: "MEI precisa declarar imposto de renda pessoa física",
    secondary: ["mei soma com salario irpf", "mei faturamento acima limite ir", "mei e irpf pf"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
  },
  // Cluster 3 — Abertura MEI
  {
    primary: "como abrir MEI 2026 passo a passo gratuito",
    secondary: ["abertura mei portal empreendedor", "documentos para abrir mei", "cnpj gratuito microempreendedor"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
  },
  // Cluster 4 — Cancelamento/Baixa
  {
    primary: "como cancelar MEI baixa 2026",
    secondary: ["baixar cnpj mei", "mei inativo o que fazer", "encerrar mei portal empreendedor"],
    volume: "media",
    intent: "informacional",
    categoria: "MEI" as const,
  },
  // Cluster 5 — Dívidas DAS
  {
    primary: "MEI com DAS atrasado como parcelar 2026",
    secondary: ["mei divida das parcelamento", "pgdas mei em atraso", "regularizar mei inadimplente"],
    volume: "media",
    intent: "transacional",
    categoria: "MEI" as const,
  },
  // Cluster 6 — Desenrola MEI
  {
    primary: "Desenrola Brasil 2026 MEI microempreendedor como participar",
    secondary: ["desenrola empresas mei procred", "renegociar divida mei 2026", "procred fgo microempresa"],
    volume: "alta",
    intent: "transacional",
    categoria: "MEI" as const,
  },
  // Cluster 7 — Limite faturamento
  {
    primary: "limite faturamento MEI 2026 o que acontece se ultrapassar",
    secondary: ["mei ultrapassou limite virando me", "faturamento acima 81000 mei consequencias", "exclusao simples nacional mei"],
    volume: "media",
    intent: "informacional",
    categoria: "MEI" as const,
  },
  // Cluster 8 — DAS valor / quanto paga
  {
    primary: "MEI quanto paga de imposto mensal 2026 DAS",
    secondary: ["das mei valor mensal 2026", "mei impostos mensais comercio servico", "icms iss mei"],
    volume: "alta",
    intent: "informacional",
    categoria: "MEI" as const,
  },
];

// Clusters Desenrola Brasil para blog
export const DESENROLA_KEYWORD_CLUSTERS = [
  {
    primary: "Novo Desenrola Brasil 2026 como funciona participar",
    secondary: ["desenrola brasil familias", "renegociar divida 2026", "limpar nome 2026"],
    volume: "alta",
    intent: "informacional",
    categoria: "DESENROLA" as const,
  },
  {
    primary: "Desenrola Famílias 2026 quem pode participar descontos",
    secondary: ["desenrola familias renda 5 salarios", "desconto divida cartao 90 por cento", "fgo credito renegociacao"],
    volume: "alta",
    intent: "informacional",
    categoria: "DESENROLA" as const,
  },
  {
    primary: "Desenrola FIES 2026 quitar divida estudante desconto",
    secondary: ["fies quitacao desconto 99 por cento cadunico", "renegociar fies 2026", "fies atrasado como resolver"],
    volume: "media",
    intent: "transacional",
    categoria: "DESENROLA" as const,
  },
  {
    primary: "Desenrola Empresas 2026 MEI Pronampe Procred",
    secondary: ["pronampe novo 2026 limite 500 mil", "procred mei microempresa divida", "desenrola empresa como funciona"],
    volume: "media",
    intent: "transacional",
    categoria: "DESENROLA" as const,
  },
  {
    primary: "limpar nome 2026 CPF regularizado imposto de renda",
    secondary: ["cpf negativado irpf", "desenrola limpar nome declarar ir", "regularizar cpf receita federal apos desenrola"],
    volume: "alta",
    intent: "transacional",
    categoria: "DESENROLA" as const,
  },
];
