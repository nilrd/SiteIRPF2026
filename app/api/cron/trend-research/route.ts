import { NextResponse } from "next/server";
import {
  failAutomationRun,
  finishAutomationRun,
  startAutomationRun,
} from "@/lib/automation-runs";
import { notifySystemAlert } from "@/lib/notify";
import {
  TrendResearchService,
  SEED_GROUPS,
  type EditorialTrend,
  type TrendCategory,
} from "@/lib/trend-research";
import {
  boostCampaignKeywords,
  getCurrentCampaignModes,
  getDailyPautaDistribution,
} from "@/lib/campaign-priority";
import { rankKeywords } from "@/lib/keyword-scoring";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function uniqueByKeyword(trends: EditorialTrend[]): EditorialTrend[] {
  const seen = new Set<string>();
  const unique: EditorialTrend[] = [];

  for (const trend of trends) {
    const normalized = trend.keyword.toLowerCase().trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(trend);
  }

  return unique;
}

function pickSeedGroup(now: Date): string[] {
  const groups = Object.values(SEED_GROUPS);
  const idx = now.getUTCDay() % groups.length;
  return groups[idx] ?? groups[0] ?? [];
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
  if (k.includes("irpf") || k.includes("imposto") || k.includes("receita"))
    return "IRPF";
  return "FINANCAS";
}

export async function GET(request: Request) {
  const service = new TrendResearchService();
  let runId: string | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const run = await startAutomationRun({
      automationKey: "trend-research",
      metadata: {
        dailyLimit: 8,
        monthlyLimit: 250,
      },
    });
    runId = run.id;

    const now = new Date();
    const modes = getCurrentCampaignModes(now);
    const distribution = getDailyPautaDistribution(modes);
    const seedGroup = pickSeedGroup(now);

    const cached = await service.getCachedTrends(undefined, 120);
    const hasFreshCache = cached.length >= distribution.total;

    let rawTrends: EditorialTrend[] = [];
    const errors: string[] = [];

    if (!hasFreshCache) {
      if (!service.hasSerpApiKey()) {
        errors.push("SERPAPI_KEY ausente; usando fallback evergreen.");
      } else {
        try {
          const daily = await service.fetchDailyTrends();
          const related = await service.fetchRelatedQueries(seedGroup);
          const interest = await service.fetchInterestOverTime(seedGroup);

          rawTrends = uniqueByKeyword([...daily, ...related, ...interest]);
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        }
      }

      if (rawTrends.length === 0) {
        rawTrends = service.getEvergreenFallback(40);
      }

      const boosted = boostCampaignKeywords(rawTrends, modes);
      const ranked = rankKeywords(
        boosted.map((item) => ({
          keyword: item.keyword,
          category: item.category,
          source: item.source,
          audience: item.audience,
          intent: item.intent,
          trendScore: item.trendScore,
          businessScore: item.businessScore,
          urgencyScore: item.urgencyScore,
          seoScore: item.seoScore,
          riskScore: item.riskScore,
          breakoutStatus: item.breakoutStatus,
        })),
        modes,
      );

      const saved = await service.saveTrendKeywords(
        ranked.map((item) => ({
          keyword: item.keyword,
          source: item.source as EditorialTrend["source"],
          category: inferCategory(item.keyword),
          audience: item.audience,
          intent: item.searchIntent,
          trendScore: item.trendScore ?? 60,
          businessScore: item.businessScore ?? 60,
          urgencyScore: item.urgencyScore ?? 60,
          seoScore: item.seoScore ?? 60,
          riskScore: item.riskScore ?? 20,
          breakoutStatus: item.breakoutStatus ?? false,
          geo: "BR",
        })),
      );

      await finishAutomationRun(runId, {
        generatedCount: ranked.length,
        publishedCount: 0,
        retainedCount: ranked.length,
        errorCount: errors.length,
        metadata: {
          fromCache: false,
          modes,
          distribution,
          seedGroup,
          saved,
          errors,
        },
      });

      if (errors.length > 0) {
        await notifySystemAlert(
          [
            "[ALERTA TREND-RESEARCH]",
            "Cache atualizada com fallback parcial.",
            `Erros: ${errors.length}`,
            ...errors.slice(0, 5),
          ].join("\n"),
        );
      }

      return NextResponse.json({
        ok: true,
        runId,
        fromCache: false,
        modes,
        distribution,
        collected: rawTrends.length,
        errors,
      });
    }

    await finishAutomationRun(runId, {
      generatedCount: cached.length,
      publishedCount: 0,
      retainedCount: cached.length,
      errorCount: 0,
      metadata: {
        fromCache: true,
        modes,
        distribution,
        cacheCount: cached.length,
      },
    });

    return NextResponse.json({
      ok: true,
      runId,
      fromCache: true,
      modes,
      distribution,
      cached: cached.length,
    });
  } catch (error) {
    if (runId) {
      await failAutomationRun(runId, error, {
        automationKey: "trend-research",
      }).catch(() => undefined);
    }

    await notifySystemAlert(
      [
        "[ALERTA TREND-RESEARCH]",
        "Falha fatal no cron de trends.",
        error instanceof Error ? error.message : String(error),
      ].join("\n"),
    ).catch(() => undefined);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
