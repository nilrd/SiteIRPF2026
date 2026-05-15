import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getTrackedPostIds(metadataJson: string) {
  try {
    const parsed = JSON.parse(metadataJson || "{}") as { results?: Array<{ id?: unknown }> };
    const results = Array.isArray(parsed?.results) ? parsed.results : [];
    return results
      .map((item) => (typeof item?.id === "string" ? item.id : null))
      .filter((value): value is string => Boolean(value));
  } catch {
    return [];
  }
}

// GET /api/admin/blog — lista todos os posts
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [posts, automationRuns, trackedRunMetadata, firstTrackedRun, postsToday, publishedToday] = await prisma.$transaction([
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
        },
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

    const recent24hRuns = automationRuns.filter((run) => run.startedAt >= last24h);
    const lastRun = automationRuns[0] ?? null;
  const trackedPostIds = new Set(trackedRunMetadata.flatMap((run) => getTrackedPostIds(run.metadataJson)));
    const aiPostsWithoutTrackedRun = posts.filter(
      (post) => Boolean(post.aiModel?.trim()) && !trackedPostIds.has(post.id)
    );
    const aiPostsToday = posts.filter((post) => Boolean(post.aiModel?.trim()) && post.createdAt >= dayStart).length;
    const aiPosts24h = posts.filter((post) => Boolean(post.aiModel?.trim()) && post.createdAt >= last24h).length;
    const historicalAiPosts = aiPostsWithoutTrackedRun.filter((post) => {
      if (!firstTrackedRun?.startedAt) return true;
      return post.createdAt < firstTrackedRun.startedAt;
    });
    const currentUntrackedAiPosts = aiPostsWithoutTrackedRun.filter((post) => {
      if (!firstTrackedRun?.startedAt) return false;
      return post.createdAt >= firstTrackedRun.startedAt;
    });

    return NextResponse.json({
      posts,
      automationRuns,
      automationStats: {
        postsToday,
        publishedToday,
        runs24h: recent24hRuns.length,
        failures24h: recent24hRuns.filter((run) => run.status === "failed").length,
        partials24h: recent24hRuns.filter((run) => run.status === "partial").length,
        lastRunAt: lastRun?.startedAt ?? null,
        lastRunStatus: lastRun?.status ?? null,
        lastRunKey: lastRun?.automationKey ?? null,
        trackedPosts: trackedPostIds.size,
        aiPostsToday,
        aiPosts24h,
        estimatedFromPosts: automationRuns.length === 0,
        historicalAiPosts: historicalAiPosts.length,
        untrackedAiPosts: currentUntrackedAiPosts.length,
      },
    });
  } catch (err) {
    console.error("[admin/blog GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
