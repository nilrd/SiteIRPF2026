// Tabelas oficiais IRPF - Fonte: Receita Federal do Brasil
// Documentos: Tributacao 2025.MD, Tributacao 2026.md, nova tabela ir.md

// ============================================================
// TABELA IRPF 2025 (Exercicio 2026, ano-calendario 2025)
// ============================================================

export const TABELA_IRPF_2025_ANUAL = [
  { ate: 28467.2, aliquota: 0, parcela: 0 },
  { ate: 33919.8, aliquota: 0.075, parcela: 2135.04 },
  { ate: 45012.6, aliquota: 0.15, parcela: 4679.03 },
  { ate: 55976.16, aliquota: 0.225, parcela: 8054.97 },
  { ate: Infinity, aliquota: 0.275, parcela: 10853.78 },
];

export const TABELA_IRPF_2025_MENSAL_MAI_DEZ = [
  { ate: 2428.8, aliquota: 0, parcela: 0 },
  { ate: 2826.65, aliquota: 0.075, parcela: 182.16 },
  { ate: 3751.05, aliquota: 0.15, parcela: 394.16 },
  { ate: 4664.68, aliquota: 0.225, parcela: 675.49 },
  { ate: Infinity, aliquota: 0.275, parcela: 908.73 },
];

export const TABELA_IRPF_2025_MENSAL_JAN_ABR = [
  { ate: 2259.2, aliquota: 0, parcela: 0 },
  { ate: 2826.65, aliquota: 0.075, parcela: 169.44 },
  { ate: 3751.05, aliquota: 0.15, parcela: 381.44 },
  { ate: 4664.68, aliquota: 0.225, parcela: 662.77 },
  { ate: Infinity, aliquota: 0.275, parcela: 896.0 },
];

// ============================================================
// TABELA IRPF 2026 (Exercicio 2027, ano-calendario 2026)
// ============================================================

export const TABELA_IRPF_2026_ANUAL = [
  { ate: 29145.6, aliquota: 0, parcela: 0 },
  { ate: 33919.8, aliquota: 0.075, parcela: 2185.92 },
  { ate: 45012.6, aliquota: 0.15, parcela: 4729.91 },
  { ate: 55976.16, aliquota: 0.225, parcela: 8105.85 },
  { ate: Infinity, aliquota: 0.275, parcela: 10904.66 },
];

export const TABELA_IRPF_2026_MENSAL = [
  { ate: 2428.8, aliquota: 0, parcela: 0 },
  { ate: 2826.65, aliquota: 0.075, parcela: 182.16 },
  { ate: 3751.05, aliquota: 0.15, parcela: 394.16 },
  { ate: 4664.68, aliquota: 0.225, parcela: 675.49 },
  { ate: Infinity, aliquota: 0.275, parcela: 908.73 },
];

// Reducao mensal 2026 (Lei 15.270/2025)
// Ate R$5.000: reducao de ate R$312,89 (zerando o imposto)
// De R$5.000,01 a R$7.350: R$978,62 - (0,133145 x renda)
// Acima de R$7.350: sem reducao

// Reducao anual 2026
// Ate R$60.000: reducao de ate R$2.694,15 (zerando o imposto)
// De R$60.000,01 a R$88.200: R$8.429,73 - (0,095575 x renda)
// Acima de R$88.200: sem reducao

// ============================================================
// DEDUCOES
// ============================================================

export const DEDUCAO_DEPENDENTE_ANUAL = 2275.08;
export const DEDUCAO_DEPENDENTE_MENSAL = 189.59;
export const DEDUCAO_EDUCACAO_MAX_ANUAL = 3561.5;
export const DESCONTO_SIMPLIFICADO_ANUAL_2025 = 16754.34;
export const DESCONTO_SIMPLIFICADO_ANUAL_2026 = 17640.0;
export const DESCONTO_SIMPLIFICADO_MENSAL = 607.2;

// ============================================================
// OBRIGATORIEDADE 2025
// ============================================================

export const LIMITES_OBRIGATORIEDADE_2025 = {
  rendimentosTributaveis: 33888.0,
  rendimentosIsentos: 200000.0,
  receitaBrutaRural: 169440.0,
  bensEDireitos: 800000.0,
  operacoesBolsa: 40000.0,
};

// ============================================================
// MULTAS
// ============================================================

export const MULTA_MINIMA = 165.74;
export const MULTA_MAXIMA = 6275.0;
export const MULTA_PERCENTUAL_MES = 0.01; // 1% ao mes sobre IR devido

// ============================================================
// CALCULADORA IR (Exercicio 2026, ano-base 2025)
// ============================================================

interface CalculoParams {
  rendaBrutaAnual: number;
  numeroDependentes: number;
  inssPago: number;
  gastosSaude: number;
  gastosEducacao: number;
  irRetidoFonte: number;
}

interface CalculoResultado {
  baseCalculo: number;
  impostoTabela: number;
  deducoesTotal: number;
  irDevido: number;
  diferenca: number;
  tipo: "pagar" | "restituir" | "zerado";
  aliquotaEfetiva: number;
}

export function calcularIR(params: CalculoParams): CalculoResultado {
  const {
    rendaBrutaAnual,
    numeroDependentes,
    inssPago,
    gastosSaude,
    gastosEducacao,
    irRetidoFonte,
  } = params;

  // Calcular deducoes legais
  const deducaoDependentes = numeroDependentes * DEDUCAO_DEPENDENTE_ANUAL;
  const deducaoEducacao = Math.min(
    gastosEducacao,
    DEDUCAO_EDUCACAO_MAX_ANUAL * (1 + numeroDependentes)
  );
  const deducoesLegais =
    inssPago + gastosSaude + deducaoEducacao + deducaoDependentes;

  // Desconto simplificado (20% da renda, max R$16.754,34)
  const descontoSimplificado = Math.min(
    rendaBrutaAnual * 0.2,
    DESCONTO_SIMPLIFICADO_ANUAL_2025
  );

  // Usar a melhor opcao
  const deducoesTotal = Math.max(deducoesLegais, descontoSimplificado);

  // Base de calculo
  const baseCalculo = Math.max(0, rendaBrutaAnual - deducoesTotal);

  // Aplicar tabela progressiva 2025
  let impostoTabela = 0;
  for (const faixa of TABELA_IRPF_2025_ANUAL) {
    if (baseCalculo <= faixa.ate) {
      impostoTabela = baseCalculo * faixa.aliquota - faixa.parcela;
      break;
    }
  }
  impostoTabela = Math.max(0, impostoTabela);

  // Diferenca = IR devido - IR retido na fonte
  const diferenca = impostoTabela - irRetidoFonte;

  let tipo: "pagar" | "restituir" | "zerado";
  if (diferenca > 0.5) {
    tipo = "pagar";
  } else if (diferenca < -0.5) {
    tipo = "restituir";
  } else {
    tipo = "zerado";
  }

  const aliquotaEfetiva =
    rendaBrutaAnual > 0 ? (impostoTabela / rendaBrutaAnual) * 100 : 0;

  return {
    baseCalculo,
    impostoTabela,
    deducoesTotal,
    irDevido: impostoTabela,
    diferenca,
    tipo,
    aliquotaEfetiva,
  };
}

// ============================================================
// SIMULADOR DE MULTA
// ============================================================

export function calcularMultaAtraso(params: {
  irDevido: number;
  mesesAtraso: number;
}): {
  multaBase: number;
  multaFinal: number;
} {
  const { irDevido, mesesAtraso } = params;

  if (irDevido <= 0) {
    return { multaBase: MULTA_MINIMA, multaFinal: MULTA_MINIMA };
  }

  const multaCalculada = irDevido * MULTA_PERCENTUAL_MES * mesesAtraso;
  const multaLimitada = Math.min(multaCalculada, irDevido * 0.2);
  const multaFinal = Math.max(MULTA_MINIMA, multaLimitada);

  return {
    multaBase: multaCalculada,
    multaFinal: Math.min(multaFinal, MULTA_MAXIMA),
  };
}
