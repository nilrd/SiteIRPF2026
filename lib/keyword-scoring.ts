import type {
  CampaignMode,
  DailyPautaDistribution,
} from "@/lib/campaign-priority";

export type PostType = "traffic" | "lead";

export type ScoringInput = {
  keyword: string;
  category: string;
  source: string;
  audience?: string | null;
  intent?: string | null;
  trendScore?: number | null;
  businessScore?: number | null;
  urgencyScore?: number | null;
  seoScore?: number | null;
  riskScore?: number | null;
  breakoutStatus?: boolean | null;
};

export type ScoredKeyword = ScoringInput & {
  finalScore: number;
  postType: PostType;
  searchIntent: string;
  audience: string;
};

function clampScore(
  value: number | null | undefined,
  fallback: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function inferAudience(keyword: string, category: string): string {
  const k = keyword.toLowerCase();
  if (category === "MEI" || category === "DASN" || k.includes("mei"))
    return "microempreendedores";
  if (category === "CPF" || k.includes("cpf"))
    return "contribuintes com pendencias cadastrais";
  if (k.includes("invest") || k.includes("bolsa"))
    return "investidores pessoa fisica";
  return "contribuintes pessoa fisica";
}

function inferSearchIntent(keyword: string): string {
  const k = keyword.toLowerCase();
  if (/contratar|consultoria|especialista|resolver|regularizar/.test(k))
    return "comercial";
  if (/como|passo a passo|guia|o que e|diferenca/.test(k))
    return "informacional";
  if (/prazo|multa|atrasad|bloquead|pendente|malha fina/.test(k))
    return "urgente";
  return "informacional";
}

function riskFromKeyword(keyword: string): number {
  const k = keyword.toLowerCase();
  if (/garantid|certeza|100%|sem erro|imediat/.test(k)) return 70;
  if (/bloquead|pendente|malha fina|multa/.test(k)) return 35;
  return 15;
}

export function classifyPostType(keyword: string): PostType {
  const k = keyword.toLowerCase();
  if (
    /regularizar|consultoria|especialista|atrasad|multa|malha fina|bloquead|pendente/.test(
      k,
    )
  ) {
    return "lead";
  }
  return "traffic";
}

export function scoreKeyword(
  input: ScoringInput,
  modes: CampaignMode[] = [],
): ScoredKeyword {
  const keyword = input.keyword.trim();
  const trendScore = clampScore(input.trendScore, 55);
  const businessBase = clampScore(input.businessScore, 60);
  const seoScore = clampScore(input.seoScore, 62);
  const urgencyBase = clampScore(input.urgencyScore, 55);
  const riskBase = Math.max(
    clampScore(input.riskScore, 20),
    riskFromKeyword(keyword),
  );

  let urgencyScore = urgencyBase;
  let businessScore = businessBase;
  let riskScore = riskBase;

  const lower = keyword.toLowerCase();

  if (
    modes.includes("IRPF_URGENT") &&
    /prazo|29 de maio|atrasad|multa|bloquead|pendente/.test(lower)
  ) {
    urgencyScore = Math.min(100, urgencyScore + 30);
  }

  if (
    modes.includes("DASN_URGENT") &&
    /dasn|simei|mei|parcelamento|divida/.test(lower)
  ) {
    urgencyScore = Math.min(100, urgencyScore + 28);
    businessScore = Math.min(100, businessScore + 10);
  }

  if (/garantid|desbloqueio garantido|certeza de restituicao/.test(lower)) {
    riskScore = Math.min(100, riskScore + 50);
  }

  const finalScore = Math.round(
    trendScore * 0.25 +
      businessScore * 0.35 +
      urgencyScore * 0.25 +
      seoScore * 0.15 -
      riskScore * 0.15,
  );

  return {
    ...input,
    keyword,
    trendScore,
    businessScore,
    urgencyScore,
    seoScore,
    riskScore,
    finalScore,
    postType: classifyPostType(keyword),
    searchIntent: inferSearchIntent(keyword),
    audience: inferAudience(keyword, input.category),
  };
}

export function rankKeywords(
  inputs: ScoringInput[],
  modes: CampaignMode[] = [],
): ScoredKeyword[] {
  return inputs
    .map((item) => scoreKeyword(item, modes))
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      if ((b.urgencyScore ?? 0) !== (a.urgencyScore ?? 0))
        return (b.urgencyScore ?? 0) - (a.urgencyScore ?? 0);
      return (b.trendScore ?? 0) - (a.trendScore ?? 0);
    });
}

function pickByCategory(
  pool: ScoredKeyword[],
  amount: number,
  predicate: (item: ScoredKeyword) => boolean,
  selected: ScoredKeyword[],
): void {
  for (const item of pool) {
    if (selected.length >= amount) return;
    if (!predicate(item)) continue;
    if (
      selected.some(
        (s) => s.keyword.toLowerCase() === item.keyword.toLowerCase(),
      )
    )
      continue;
    selected.push(item);
  }
}

export function selectDailyPauta(
  ranked: ScoredKeyword[],
  distribution: DailyPautaDistribution,
): ScoredKeyword[] {
  const selected: ScoredKeyword[] = [];

  pickByCategory(
    ranked,
    distribution.irpfUrgency,
    (item) => ["IRPF", "IRPF_ATRASADO"].includes(item.category),
    selected,
  );

  pickByCategory(
    ranked,
    distribution.irpfUrgency + distribution.irpfAtrasadoCpf,
    (item) => ["IRPF_ATRASADO", "CPF", "IRPF"].includes(item.category),
    selected,
  );

  pickByCategory(
    ranked,
    distribution.irpfUrgency +
      distribution.irpfAtrasadoCpf +
      distribution.meiDasn,
    (item) => ["MEI", "DASN", "PARCELAMENTO_MEI"].includes(item.category),
    selected,
  );

  pickByCategory(ranked, distribution.total, () => true, selected);

  let trafficCount = selected.filter(
    (item) => item.postType === "traffic",
  ).length;
  let leadCount = selected.length - trafficCount;

  if (trafficCount < 4) {
    for (const item of ranked) {
      if (selected.length >= distribution.total) break;
      if (item.postType !== "traffic") continue;
      if (
        selected.some(
          (s) => s.keyword.toLowerCase() === item.keyword.toLowerCase(),
        )
      )
        continue;
      selected.push(item);
      trafficCount += 1;
    }
  }

  if (leadCount < 4) {
    for (const item of ranked) {
      if (selected.length >= distribution.total) break;
      if (item.postType !== "lead") continue;
      if (
        selected.some(
          (s) => s.keyword.toLowerCase() === item.keyword.toLowerCase(),
        )
      )
        continue;
      selected.push(item);
      leadCount += 1;
    }
  }

  return selected.slice(0, distribution.total);
}
