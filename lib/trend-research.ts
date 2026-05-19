import { prisma } from "@/lib/prisma";

export type TrendCategory =
  | "IRPF"
  | "IRPF_ATRASADO"
  | "CPF"
  | "MEI"
  | "DASN"
  | "PARCELAMENTO_MEI"
  | "FINANCAS";

export type TrendSource =
  | "serpapi_trends"
  | "serpapi_related"
  | "serpapi_interest"
  | "rss_fallback"
  | "evergreen";

export type EditorialTrend = {
  keyword: string;
  source: TrendSource;
  category: TrendCategory;
  audience?: string;
  intent?: string;
  trendScore?: number;
  businessScore?: number;
  urgencyScore?: number;
  seoScore?: number;
  riskScore?: number;
  breakoutStatus?: boolean;
  geo?: string;
  relatedQueriesJson?: string;
  rawPayload?: string;
};

export type QuotaStatus = {
  canCall: boolean;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  remaining: number;
};

const API_NAME = "serpapi";
const DAILY_LIMIT = 8;
const MONTHLY_LIMIT = 250;
const CACHE_HOURS = 24;
const SERPAPI_LOCK_KEY = 1_526_270;

export const SEED_GROUPS: Record<string, string[]> = {
  IRPF_URGENCY: [
    "prazo irpf 2026",
    "declaracao irpf atrasada",
    "multa irpf 2026",
    "malha fina irpf",
    "restituicao irpf calendario",
  ],
  CPF_REG: [
    "cpf pendente de regularizacao",
    "cpf bloqueado receita federal",
    "regularizar cpf irpf",
    "pendencia cadastral cpf",
    "cpf irregular imposto de renda",
  ],
  MEI_DASN: [
    "dasn simei prazo 2026",
    "declaracao mei atrasada",
    "parcelamento mei divida",
    "regularizar mei pendente",
    "faturamento mei limite",
  ],
  FINANCAS_GERAIS: [
    "deducoes irpf saude educacao",
    "como declarar aluguel irpf",
    "investimentos imposto de renda",
    "retificacao irpf como fazer",
    "simplificado ou completo irpf",
  ],
};

export const EVERGREEN_FALLBACK: EditorialTrend[] = [
  {
    keyword: "prazo declaracao irpf 2026",
    source: "evergreen",
    category: "IRPF",
    intent: "informacional",
    trendScore: 60,
    businessScore: 78,
    urgencyScore: 82,
    seoScore: 70,
    riskScore: 20,
  },
  {
    keyword: "quem e obrigado a declarar irpf 2026",
    source: "evergreen",
    category: "IRPF",
    intent: "informacional",
    trendScore: 58,
    businessScore: 74,
    urgencyScore: 70,
    seoScore: 76,
    riskScore: 16,
  },
  {
    keyword: "tabela irpf 2026 atualizada",
    source: "evergreen",
    category: "IRPF",
    intent: "informacional",
    trendScore: 62,
    businessScore: 72,
    urgencyScore: 68,
    seoScore: 79,
    riskScore: 16,
  },
  {
    keyword: "deducoes irpf saude e educacao",
    source: "evergreen",
    category: "IRPF",
    intent: "informacional",
    trendScore: 56,
    businessScore: 70,
    urgencyScore: 55,
    seoScore: 74,
    riskScore: 14,
  },
  {
    keyword: "restituicao irpf 2026 consulta",
    source: "evergreen",
    category: "IRPF",
    intent: "transacional",
    trendScore: 57,
    businessScore: 76,
    urgencyScore: 60,
    seoScore: 71,
    riskScore: 18,
  },
  {
    keyword: "declaracao irpf atrasada multa",
    source: "evergreen",
    category: "IRPF_ATRASADO",
    intent: "transacional",
    trendScore: 63,
    businessScore: 85,
    urgencyScore: 88,
    seoScore: 73,
    riskScore: 24,
  },
  {
    keyword: "regularizar irpf atrasado passo a passo",
    source: "evergreen",
    category: "IRPF_ATRASADO",
    intent: "transacional",
    trendScore: 54,
    businessScore: 82,
    urgencyScore: 81,
    seoScore: 71,
    riskScore: 24,
  },
  {
    keyword: "retificar declaracao irpf",
    source: "evergreen",
    category: "IRPF_ATRASADO",
    intent: "informacional",
    trendScore: 52,
    businessScore: 73,
    urgencyScore: 62,
    seoScore: 69,
    riskScore: 16,
  },
  {
    keyword: "malha fina irpf como resolver",
    source: "evergreen",
    category: "IRPF_ATRASADO",
    intent: "transacional",
    trendScore: 60,
    businessScore: 84,
    urgencyScore: 79,
    seoScore: 74,
    riskScore: 26,
  },
  {
    keyword: "erro comum declaracao irpf",
    source: "evergreen",
    category: "IRPF_ATRASADO",
    intent: "informacional",
    trendScore: 50,
    businessScore: 66,
    urgencyScore: 58,
    seoScore: 67,
    riskScore: 14,
  },
  {
    keyword: "cpf pendente de regularizacao receita",
    source: "evergreen",
    category: "CPF",
    intent: "transacional",
    trendScore: 59,
    businessScore: 86,
    urgencyScore: 80,
    seoScore: 72,
    riskScore: 30,
  },
  {
    keyword: "cpf bloqueado como regularizar",
    source: "evergreen",
    category: "CPF",
    intent: "transacional",
    trendScore: 61,
    businessScore: 88,
    urgencyScore: 84,
    seoScore: 73,
    riskScore: 32,
  },
  {
    keyword: "cpf irregular por imposto de renda",
    source: "evergreen",
    category: "CPF",
    intent: "informacional",
    trendScore: 52,
    businessScore: 78,
    urgencyScore: 76,
    seoScore: 68,
    riskScore: 28,
  },
  {
    keyword: "pendencia cadastral cpf receita federal",
    source: "evergreen",
    category: "CPF",
    intent: "informacional",
    trendScore: 50,
    businessScore: 72,
    urgencyScore: 70,
    seoScore: 66,
    riskScore: 24,
  },
  {
    keyword: "como consultar situacao cpf",
    source: "evergreen",
    category: "CPF",
    intent: "informacional",
    trendScore: 49,
    businessScore: 64,
    urgencyScore: 55,
    seoScore: 65,
    riskScore: 12,
  },
  {
    keyword: "dasn simei 2026 prazo",
    source: "evergreen",
    category: "DASN",
    intent: "informacional",
    trendScore: 63,
    businessScore: 82,
    urgencyScore: 88,
    seoScore: 72,
    riskScore: 20,
  },
  {
    keyword: "declaracao mei atrasada o que fazer",
    source: "evergreen",
    category: "MEI",
    intent: "transacional",
    trendScore: 60,
    businessScore: 86,
    urgencyScore: 85,
    seoScore: 74,
    riskScore: 22,
  },
  {
    keyword: "parcelamento divida mei",
    source: "evergreen",
    category: "PARCELAMENTO_MEI",
    intent: "transacional",
    trendScore: 56,
    businessScore: 84,
    urgencyScore: 78,
    seoScore: 71,
    riskScore: 24,
  },
  {
    keyword: "faturamento mei limite anual",
    source: "evergreen",
    category: "MEI",
    intent: "informacional",
    trendScore: 54,
    businessScore: 72,
    urgencyScore: 60,
    seoScore: 70,
    riskScore: 12,
  },
  {
    keyword: "diferenca mei e irpf",
    source: "evergreen",
    category: "MEI",
    intent: "informacional",
    trendScore: 50,
    businessScore: 68,
    urgencyScore: 56,
    seoScore: 67,
    riskScore: 10,
  },
  {
    keyword: "como declarar aluguel no irpf",
    source: "evergreen",
    category: "FINANCAS",
    intent: "informacional",
    trendScore: 52,
    businessScore: 70,
    urgencyScore: 48,
    seoScore: 73,
    riskScore: 12,
  },
  {
    keyword: "investimentos e imposto de renda",
    source: "evergreen",
    category: "FINANCAS",
    intent: "informacional",
    trendScore: 51,
    businessScore: 69,
    urgencyScore: 45,
    seoScore: 72,
    riskScore: 10,
  },
  {
    keyword: "simplificado ou completo irpf",
    source: "evergreen",
    category: "FINANCAS",
    intent: "transacional",
    trendScore: 49,
    businessScore: 73,
    urgencyScore: 50,
    seoScore: 71,
    riskScore: 10,
  },
  {
    keyword: "dependentes no imposto de renda",
    source: "evergreen",
    category: "FINANCAS",
    intent: "informacional",
    trendScore: 48,
    businessScore: 68,
    urgencyScore: 43,
    seoScore: 70,
    riskScore: 10,
  },
  {
    keyword: "previdencia privada e irpf",
    source: "evergreen",
    category: "FINANCAS",
    intent: "informacional",
    trendScore: 46,
    businessScore: 66,
    urgencyScore: 42,
    seoScore: 68,
    riskScore: 9,
  },
];

function startOfUtcDay(date = new Date()): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function startOfUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function endOfUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function normalizeScore(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asRecordArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item) => typeof item === "object" && item !== null,
  ) as Array<Record<string, unknown>>;
}

function inferCategory(keyword: string): TrendCategory {
  const k = keyword.toLowerCase();
  if (k.includes("dasn") || k.includes("simei")) return "DASN";
  if (k.includes("mei")) return "MEI";
  if (k.includes("cpf")) return "CPF";
  if (
    k.includes("atrasad") ||
    k.includes("retific") ||
    k.includes("malha fina")
  )
    return "IRPF_ATRASADO";
  if (k.includes("imposto") || k.includes("irpf") || k.includes("receita"))
    return "IRPF";
  return "FINANCAS";
}

export class TrendResearchService {
  hasSerpApiKey(): boolean {
    return Boolean(process.env.SERPAPI_KEY);
  }

  async checkQuota(apiName: string = API_NAME): Promise<QuotaStatus> {
    const today = startOfUtcDay();
    const monthStart = startOfUtcMonth();
    const monthEnd = endOfUtcMonth();

    const [todayRow, monthAgg] = await Promise.all([
      prisma.apiQuota.findUnique({
        where: {
          apiName_date: {
            apiName,
            date: today,
          },
        },
        select: {
          callsUsed: true,
          callsLimit: true,
          monthCallsLimit: true,
        },
      }),
      prisma.apiQuota.aggregate({
        where: {
          apiName,
          date: {
            gte: monthStart,
            lt: monthEnd,
          },
        },
        _sum: {
          callsUsed: true,
        },
      }),
    ]);

    const dailyUsed = todayRow?.callsUsed ?? 0;
    const dailyLimit = todayRow?.callsLimit ?? DAILY_LIMIT;
    const monthlyUsed = monthAgg._sum.callsUsed ?? 0;
    const monthlyLimit = todayRow?.monthCallsLimit ?? MONTHLY_LIMIT;
    const remaining = Math.min(
      dailyLimit - dailyUsed,
      monthlyLimit - monthlyUsed,
    );

    return {
      canCall: dailyUsed < dailyLimit && monthlyUsed < monthlyLimit,
      dailyUsed,
      dailyLimit,
      monthlyUsed,
      monthlyLimit,
      remaining: Math.max(0, remaining),
    };
  }

  private async consumeQuotaCall(
    apiName: string = API_NAME,
  ): Promise<QuotaStatus> {
    const today = startOfUtcDay();
    const monthStart = startOfUtcMonth();
    const monthEnd = endOfUtcMonth();

    return prisma.$transaction(async (tx) => {
      // Serializa consumo de quota por API para evitar corrida em (api_name,date).
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${SERPAPI_LOCK_KEY})`;

      const monthAgg = await tx.apiQuota.aggregate({
        where: {
          apiName,
          date: { gte: monthStart, lt: monthEnd },
        },
        _sum: { callsUsed: true },
      });

      const monthlyUsed = monthAgg._sum.callsUsed ?? 0;

      let row = await tx.apiQuota.findUnique({
        where: {
          apiName_date: {
            apiName,
            date: today,
          },
        },
      });

      if (!row) {
        try {
          row = await tx.apiQuota.create({
            data: {
              apiName,
              date: today,
              callsUsed: 0,
              callsLimit: DAILY_LIMIT,
              monthCallsUsed: monthlyUsed,
              monthCallsLimit: MONTHLY_LIMIT,
            },
          });
        } catch {
          // Outro processo pode ter criado no mesmo instante; reconsulta e segue.
          row = await tx.apiQuota.findUnique({
            where: {
              apiName_date: {
                apiName,
                date: today,
              },
            },
          });
        }
      }

      if (!row) {
        throw new Error("Falha ao inicializar registro de quota diario.");
      }

      if (
        row.callsUsed >= row.callsLimit ||
        monthlyUsed >= row.monthCallsLimit
      ) {
        const remaining = Math.max(
          0,
          Math.min(
            row.callsLimit - row.callsUsed,
            row.monthCallsLimit - monthlyUsed,
          ),
        );
        return {
          canCall: false,
          dailyUsed: row.callsUsed,
          dailyLimit: row.callsLimit,
          monthlyUsed,
          monthlyLimit: row.monthCallsLimit,
          remaining,
        };
      }

      const updated = await tx.apiQuota.update({
        where: {
          apiName_date: {
            apiName,
            date: today,
          },
        },
        data: {
          callsUsed: { increment: 1 },
          monthCallsUsed: { set: monthlyUsed + 1 },
        },
        select: {
          callsUsed: true,
          callsLimit: true,
          monthCallsLimit: true,
        },
      });

      return {
        canCall: true,
        dailyUsed: updated.callsUsed,
        dailyLimit: updated.callsLimit,
        monthlyUsed: monthlyUsed + 1,
        monthlyLimit: updated.monthCallsLimit,
        remaining: Math.max(
          0,
          Math.min(
            updated.callsLimit - updated.callsUsed,
            updated.monthCallsLimit - (monthlyUsed + 1),
          ),
        ),
      };
    });
  }

  private async requestSerpApi(
    params: Record<string, string>,
  ): Promise<unknown> {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      throw new Error("SERPAPI_KEY nao configurada");
    }

    const query = new URLSearchParams({
      ...params,
      api_key: apiKey,
      hl: params.hl ?? "pt-BR",
      geo: params.geo ?? "BR",
    });

    const url = `https://serpapi.com/search.json?${query.toString()}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `SerpApi HTTP ${response.status}: ${body.substring(0, 300)}`,
      );
    }

    return response.json();
  }

  /**
   * Padrão de escopo IRPF/MEI/Tributação.
   * Qualquer keyword de "trending now" que NÃO bater neste padrão é descartada
   * antes de entrar no banco, evitando que futebol, política ou entretenimento
   * sejam selecionados como tema de blog.
   */
  static isInIRPFScope(keyword: string): boolean {
    const IRPF_SCOPE =
      /imposto|irpf|ir\s|receita federal|mei\b|dasn|simei|parcelamento mei|malha fina|cpf|declaracao|restituicao|tribut|deducao|deduc|isencao|isenco|selic|ipca|renda|salario|contribuicao|previdencia|fgts|reforma tributaria|imposto de renda/i;
    return IRPF_SCOPE.test(keyword);
  }

  async fetchDailyTrends(): Promise<EditorialTrend[]> {
    if (!this.hasSerpApiKey()) return [];

    const quota = await this.consumeQuotaCall(API_NAME);
    if (!quota.canCall) return [];

    const payload = asRecord(
      await this.requestSerpApi({
        engine: "google_trends_trending_now",
        geo: "BR",
        hl: "pt-BR",
      }),
    );

    const rows = asRecordArray(
      payload.trending_searches ??
        payload.daily_searches ??
        payload.searches ??
        payload.trending_now ??
        [],
    );

    return rows.reduce<EditorialTrend[]>((acc, item) => {
      const keyword = String(
        item.query ?? item.title ?? item.search_term ?? "",
      ).trim();
      if (!keyword) return acc;

      // ── FILTRO DE ESCOPO ─────────────────────────────────────────────────────
      // "Trending now" retorna qualquer assunto do Brasil (futebol, celebridades,
      // política, etc.). Só mantemos keywords relacionadas a IRPF/MEI/tributação.
      if (!TrendResearchService.isInIRPFScope(keyword)) return acc;

      const trendBreakdown = asRecord(item.trend_breakdown);

      acc.push({
        keyword,
        source: "serpapi_trends",
        category: inferCategory(keyword),
        intent: "informacional",
        trendScore: normalizeScore(
          Number(trendBreakdown.score ?? item.search_volume ?? 65),
          65,
        ),
        businessScore: 60,
        urgencyScore: 55,
        seoScore: 60,
        riskScore: 18,
        breakoutStatus: Boolean(item.is_breakout),
        geo: "BR",
        rawPayload: JSON.stringify(item),
      });

      return acc;
    }, []);
  }

  async fetchRelatedQueries(seedKeywords: string[]): Promise<EditorialTrend[]> {
    if (!this.hasSerpApiKey() || seedKeywords.length === 0) return [];

    const results: EditorialTrend[] = [];
    const seeds = seedKeywords.slice(0, 4);

    for (const seed of seeds) {
      const quota = await this.consumeQuotaCall(API_NAME);
      if (!quota.canCall) break;

      try {
        const payload = asRecord(
          await this.requestSerpApi({
            engine: "google_trends",
            data_type: "RELATED_QUERIES",
            q: seed,
            date: "today 7-d",
            geo: "BR",
            hl: "pt-BR",
          }),
        );

        const relatedQueries = asRecord(payload.related_queries);
        const related = asRecordArray(
          relatedQueries.top ??
            payload.queries ??
            payload.related_queries ??
            [],
        );
        for (const item of related.slice(0, 10)) {
          const keyword = String(item.query ?? item.title ?? "").trim();
          if (!keyword) continue;
          results.push({
            keyword,
            source: "serpapi_related",
            category: inferCategory(keyword),
            intent: "informacional",
            trendScore: normalizeScore(Number(item.value ?? 62), 62),
            businessScore: 64,
            urgencyScore: 58,
            seoScore: 63,
            riskScore: 18,
            breakoutStatus: /breakout/i.test(String(item.value ?? "")),
            geo: "BR",
            rawPayload: JSON.stringify(item),
          });
        }
      } catch {
        // Falha isolada por seed nao deve derrubar o job inteiro.
      }
    }

    return results;
  }

  async fetchInterestOverTime(
    seedKeywords: string[],
  ): Promise<EditorialTrend[]> {
    if (!this.hasSerpApiKey() || seedKeywords.length === 0) return [];

    const results: EditorialTrend[] = [];
    const seeds = seedKeywords.slice(0, 2);

    for (const seed of seeds) {
      const quota = await this.consumeQuotaCall(API_NAME);
      if (!quota.canCall) break;

      try {
        const payload = asRecord(
          await this.requestSerpApi({
            engine: "google_trends",
            data_type: "TIMESERIES",
            q: seed,
            date: "today 1-m",
            geo: "BR",
            hl: "pt-BR",
          }),
        );

        const interestOverTime = asRecord(payload.interest_over_time);
        const timeline = asRecordArray(
          interestOverTime.timeline_data ?? payload.timeline_data ?? [],
        );
        const lastPoint = timeline.at(-1);
        const values = Array.isArray(lastPoint?.values)
          ? (lastPoint?.values as Array<Record<string, unknown>>)
          : [];
        const firstValue = values[0] ?? {};
        const value = Number(
          firstValue.extracted_value ?? lastPoint?.value ?? 55,
        );

        results.push({
          keyword: seed,
          source: "serpapi_interest",
          category: inferCategory(seed),
          intent: "informacional",
          trendScore: normalizeScore(value, 55),
          businessScore: 62,
          urgencyScore: 54,
          seoScore: 60,
          riskScore: 16,
          geo: "BR",
          relatedQueriesJson: JSON.stringify(timeline.slice(-7)),
          rawPayload: JSON.stringify(payload.interest_over_time ?? payload),
        });
      } catch {
        // Falha isolada nao interrompe a coleta.
      }
    }

    return results;
  }

  async saveTrendKeywords(keywords: EditorialTrend[]): Promise<number> {
    if (keywords.length === 0) return 0;

    const cachedUntil = new Date(Date.now() + CACHE_HOURS * 60 * 60 * 1000);
    let saved = 0;

    for (const item of keywords) {
      const keyword = item.keyword.trim();
      if (!keyword) continue;

      const existing = await prisma.trendKeyword.findFirst({
        where: {
          keyword: { equals: keyword, mode: "insensitive" },
          source: item.source,
          category: item.category,
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      const data = {
        keyword,
        source: item.source,
        category: item.category,
        audience: item.audience,
        intent: item.intent,
        postType:
          item.businessScore && item.businessScore >= 72 ? "lead" : "traffic",
        trendScore: normalizeScore(item.trendScore, 60),
        businessScore: normalizeScore(item.businessScore, 60),
        urgencyScore: normalizeScore(item.urgencyScore, 60),
        seoScore: normalizeScore(item.seoScore, 60),
        riskScore: normalizeScore(item.riskScore, 20),
        breakoutStatus: Boolean(item.breakoutStatus),
        geo: item.geo ?? "BR",
        relatedQueriesJson: item.relatedQueriesJson,
        cachedUntil,
        rawPayload: item.rawPayload,
      };

      if (existing) {
        await prisma.trendKeyword.update({ where: { id: existing.id }, data });
      } else {
        await prisma.trendKeyword.create({ data });
      }

      saved += 1;
    }

    return saved;
  }

  async getCachedTrends(category?: TrendCategory, take: number = 120) {
    return prisma.trendKeyword.findMany({
      where: {
        ...(category ? { category } : {}),
        cachedUntil: { gt: new Date() },
      },
      orderBy: [
        { urgencyScore: "desc" },
        { trendScore: "desc" },
        { businessScore: "desc" },
      ],
      take,
    });
  }

  /** Busca todas as trends (ativas e expiradas) para o painel de monitoramento. */
  async getAllTrendsForAdmin(limit: number = 200) {
    return prisma.trendKeyword.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        keyword: true,
        source: true,
        category: true,
        intent: true,
        postType: true,
        trendScore: true,
        businessScore: true,
        urgencyScore: true,
        seoScore: true,
        riskScore: true,
        breakoutStatus: true,
        geo: true,
        cachedUntil: true,
        createdAt: true,
      },
    });
  }

  /** Retorna status de quota SerpAPI público (sem incrementar contador). */
  async getQuotaStatus(): Promise<QuotaStatus> {
    return this.checkQuota(API_NAME);
  }

  getEvergreenFallback(limit: number = 40): EditorialTrend[] {
    return EVERGREEN_FALLBACK.slice(0, limit);
  }
}
