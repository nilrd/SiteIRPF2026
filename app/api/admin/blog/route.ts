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

    const posts = await prisma.blogPost.findMany({
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
      },
    });

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[admin/blog GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
