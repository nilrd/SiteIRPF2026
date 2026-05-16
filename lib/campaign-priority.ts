import type { EditorialTrend } from "@/lib/trend-research";

export type CampaignMode = "IRPF_URGENT" | "DASN_URGENT" | "EVERGREEN";

export type OpportunityClass =
  | "urgente"
  | "sazonal"
  | "evergreen"
  | "lead_direto"
  | "educativo";

export type DailyPautaDistribution = {
  irpfUrgency: number;
  irpfAtrasadoCpf: number;
  meiDasn: number;
  trending: number;
  total: number;
};

const IRPF_WINDOW_START = new Date("2026-05-01T00:00:00.000Z");
const IRPF_DEADLINE = new Date("2026-05-29T23:59:59.999Z");
const DASN_WINDOW_START = new Date("2026-05-15T00:00:00.000Z");
const DASN_DEADLINE = new Date("2026-05-31T23:59:59.999Z");

function inRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function getCurrentCampaignModes(
  now: Date = new Date(),
): CampaignMode[] {
  const modes: CampaignMode[] = [];

  if (inRange(now, IRPF_WINDOW_START, IRPF_DEADLINE)) {
    modes.push("IRPF_URGENT");
  }

  if (inRange(now, DASN_WINDOW_START, DASN_DEADLINE)) {
    modes.push("DASN_URGENT");
  }

  if (modes.length === 0) {
    modes.push("EVERGREEN");
  }

  return modes;
}

export function getDailyPautaDistribution(
  modes: CampaignMode[],
): DailyPautaDistribution {
  const hasIrpf = modes.includes("IRPF_URGENT");
  const hasDasn = modes.includes("DASN_URGENT");

  if (hasIrpf && hasDasn) {
    return {
      irpfUrgency: 3,
      irpfAtrasadoCpf: 2,
      meiDasn: 3,
      trending: 0,
      total: 8,
    };
  }

  if (hasIrpf) {
    return {
      irpfUrgency: 3,
      irpfAtrasadoCpf: 2,
      meiDasn: 2,
      trending: 1,
      total: 8,
    };
  }

  if (hasDasn) {
    return {
      irpfUrgency: 2,
      irpfAtrasadoCpf: 1,
      meiDasn: 3,
      trending: 2,
      total: 8,
    };
  }

  return {
    irpfUrgency: 2,
    irpfAtrasadoCpf: 2,
    meiDasn: 2,
    trending: 2,
    total: 8,
  };
}

export function classifyOpportunity(keyword: string): OpportunityClass {
  const k = keyword.toLowerCase();

  if (/prazo|vence|ultimo dia|multa|atrasad|bloquead|pendente/.test(k)) {
    return "urgente";
  }

  if (/contratar|consultoria|especialista|regularizar|resolver agora/.test(k)) {
    return "lead_direto";
  }

  if (/2026|irpf|dasn|simei|restituicao/.test(k)) {
    return "sazonal";
  }

  if (/como|guia|passo a passo|o que e|diferenca/.test(k)) {
    return "educativo";
  }

  return "evergreen";
}

export function boostCampaignKeywords(
  trends: EditorialTrend[],
  modes: CampaignMode[],
): EditorialTrend[] {
  const hasIrpf = modes.includes("IRPF_URGENT");
  const hasDasn = modes.includes("DASN_URGENT");

  return trends.map((trend) => {
    const keyword = trend.keyword.toLowerCase();
    const boosted = { ...trend };

    const urgencyBase =
      typeof boosted.urgencyScore === "number" ? boosted.urgencyScore : 55;
    const businessBase =
      typeof boosted.businessScore === "number" ? boosted.businessScore : 60;

    if (
      hasIrpf &&
      /irpf|imposto|declaracao|receita|malha fina|restituicao|cpf/.test(keyword)
    ) {
      boosted.urgencyScore = Math.min(100, urgencyBase + 18);
      boosted.businessScore = Math.min(100, businessBase + 8);
    }

    if (
      hasIrpf &&
      /prazo|29 de maio|multa|atrasad|retific|bloquead|pendente/.test(keyword)
    ) {
      boosted.urgencyScore = Math.min(
        100,
        (boosted.urgencyScore ?? urgencyBase) + 12,
      );
    }

    if (
      hasDasn &&
      /dasn|simei|mei|faturamento|parcelamento|divida mei/.test(keyword)
    ) {
      boosted.urgencyScore = Math.min(
        100,
        (boosted.urgencyScore ?? urgencyBase) + 20,
      );
      boosted.businessScore = Math.min(
        100,
        (boosted.businessScore ?? businessBase) + 8,
      );
    }

    return boosted;
  });
}
