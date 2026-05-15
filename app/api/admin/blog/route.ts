import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    const [posts, automationRuns, postsToday, publishedToday] = await prisma.$transaction([
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
      },
    });
  } catch (err) {
    console.error("[admin/blog GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
