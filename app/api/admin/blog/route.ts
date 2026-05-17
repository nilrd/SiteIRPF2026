import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SAO_PAULO_TIMEZONE = "America/Sao_Paulo";
const SAO_PAULO_OFFSET_HOURS = 3;
const STALE_GRACE_MS = 120_000;
const MAX_TRACKED_METADATA_RUNS = 500;
const RUN_MAX_DURATION_MS: Record<string, number> = {
  "blog-auto": 300_000,
  "blog-mei": 180_000,
};

type RunLike = {
  automationKey: string;
  status: string;
  startedAt: Date;
  finishedAt: Date | null;
};

function getTrackedPostIds(metadataJson: string) {
  try {
    const parsed = JSON.parse(metadataJson || "{}") as {
      results?: Array<{ id?: unknown }>;
    };
    const results = Array.isArray(parsed?.results) ? parsed.results : [];
    return results
      .map((item) => (typeof item?.id === "string" ? item.id : null))
      .filter((value): value is string => Boolean(value));
  } catch {
    return [];
  }
}

function getSaoPauloDayStartUtc(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return new Date(
    Date.UTC(year, month - 1, day, SAO_PAULO_OFFSET_HOURS, 0, 0, 0),
  );
}

function getExpectedMaxDurationMs(automationKey: string) {
  return RUN_MAX_DURATION_MS[automationKey] ?? 300_000;
}

function isRunStale(run: RunLike, now: Date) {
  if (run.status !== "started" || run.finishedAt) return false;
  const staleAfter = getExpectedMaxDurationMs(run.automationKey) + STALE_GRACE_MS;
  return now.getTime() - run.startedAt.getTime() > staleAfter;
}

function getPresentationStatus(run: RunLike, now: Date) {
  return isRunStale(run, now) ? "stale" : run.status;
}

// GET /api/admin/blog — lista todos os posts
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const dayStart = getSaoPauloDayStartUtc(now);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      posts,
      automationRuns,
      recent24hRuns,
      trackedRunMetadata,
      firstTrackedRun,
      postsToday,
      publishedToday,
    ] = await prisma.$transaction([
      prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          published: true,
          views: true,
          readTime: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          reviewJson: true,
          coverImage: true,
          aiModel: true,
          categoria: true,
        },
      }),
      prisma.automationRun.findMany({
        where: {
          automationKey: {
            in: ["blog-auto", "blog-mei"],
          },
        },
        orderBy: { startedAt: "desc" },
        take: 12,
        select: {
          id: true,
          automationKey: true,
          trigger: true,
          status: true,
          startedAt: true,
          finishedAt: true,
          durationMs: true,
          generatedCount: true,
          publishedCount: true,
          retainedCount: true,
          errorCount: true,
          metadataJson: true,
        },
      }),
      prisma.automationRun.findMany({
        where: {
          automationKey: {
            in: ["blog-auto", "blog-mei"],
          },
          startedAt: { gte: last24h },
        },
        select: {
          automationKey: true,
          status: true,
          startedAt: true,
          finishedAt: true,
        },
      }),
      prisma.automationRun.findMany({
        where: {
          automationKey: {
            in: ["blog-auto", "blog-mei"],
          },
          status: {
            in: ["success", "partial"],
          },
          generatedCount: {
            gt: 0,
          },
        },
        orderBy: { startedAt: "desc" },
        take: MAX_TRACKED_METADATA_RUNS,
        select: {
          metadataJson: true,
        },
      }),
      prisma.automationRun.findFirst({
        where: {
          automationKey: {
            in: ["blog-auto", "blog-mei"],
          },
        },
        orderBy: { startedAt: "asc" },
        select: {
          startedAt: true,
        },
      }),
      prisma.blogPost.count({
        where: {
          createdAt: { gte: dayStart },
        },
      }),
      prisma.blogPost.count({
        where: {
          createdAt: { gte: dayStart },
          published: true,
        },
      }),
    ]);

    const runsForDisplay = automationRuns.map((run) => ({
      ...run,
      status: getPresentationStatus(run, now),
    }));
    const runs24hWithPresentation = recent24hRuns.map((run) =>
      getPresentationStatus(run, now),
    );
    const lastRun = runsForDisplay[0] ?? null;
    const trackedPostIds = new Set(
      trackedRunMetadata.flatMap((run) => getTrackedPostIds(run.metadataJson)),
    );
    const aiPostsWithoutTrackedRun = posts.filter(
      (post) => Boolean(post.aiModel?.trim()) && !trackedPostIds.has(post.id),
    );
    const aiPostsToday = posts.filter(
      (post) => Boolean(post.aiModel?.trim()) && post.createdAt >= dayStart,
    ).length;
    const aiPosts24h = posts.filter(
      (post) => Boolean(post.aiModel?.trim()) && post.createdAt >= last24h,
    ).length;
    const historicalAiPosts = aiPostsWithoutTrackedRun.filter((post) => {
      if (!firstTrackedRun?.startedAt) return true;
      return post.createdAt < firstTrackedRun.startedAt;
    });
    const currentUntrackedAiPosts = aiPostsWithoutTrackedRun.filter((post) => {
      if (!firstTrackedRun?.startedAt) return false;
      return post.createdAt >= firstTrackedRun.startedAt;
    });

    const staleRuns = recent24hRuns.filter((run) => isRunStale(run, now));
    const staleWindows = staleRuns.map((run) => {
      const startedAtMs = run.startedAt.getTime();
      const endMs =
        startedAtMs +
        getExpectedMaxDurationMs(run.automationKey) +
        STALE_GRACE_MS;

      return { startedAtMs, endMs };
    });
    const stalledLinkedPosts = currentUntrackedAiPosts.filter((post) => {
      const createdAtMs = post.createdAt.getTime();
      return staleWindows.some(
        (window) =>
          createdAtMs >= window.startedAtMs && createdAtMs <= window.endMs,
      );
    });
    const unexplainedUntrackedPosts = Math.max(
      0,
      currentUntrackedAiPosts.length - stalledLinkedPosts.length,
    );

    return NextResponse.json({
      posts,
      automationRuns: runsForDisplay,
      automationStats: {
        postsToday,
        publishedToday,
        runs24h: recent24hRuns.length,
        failures24h: runs24hWithPresentation.filter(
          (status) => status === "failed",
        ).length,
        partials24h: runs24hWithPresentation.filter(
          (status) => status === "partial",
        ).length,
        success24h: runs24hWithPresentation.filter(
          (status) => status === "success",
        ).length,
        stale24h: runs24hWithPresentation.filter((status) => status === "stale")
          .length,
        lastRunAt: lastRun?.startedAt ?? null,
        lastRunStatus: lastRun?.status ?? null,
        lastRunKey: lastRun?.automationKey ?? null,
        trackedPosts: trackedPostIds.size,
        aiPostsToday,
        aiPosts24h,
        estimatedFromPosts: automationRuns.length === 0,
        historicalAiPosts: historicalAiPosts.length,
        stalledLinkedPosts: stalledLinkedPosts.length,
        unexplainedUntrackedPosts,
      },
    });
  } catch (err) {
    console.error("[admin/blog GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
