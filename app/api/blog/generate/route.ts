import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { generateBlogPost, saveBlogPost } from "@/lib/blog-engine";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro: até 60s para geração via Groq (mesmo que o cron route)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";

    const post = await generateBlogPost(undefined, keyword || undefined);
    const saved = await saveBlogPost(post);

    revalidatePath("/blog");
    revalidatePath(`/blog/${saved.slug}`);

    return NextResponse.json({
      success: true,
      pending: !saved.published,
      reviewLevel: saved.published ? "baixo" : "alto",
      post: {
        id: saved.id,
        title: saved.title,
        slug: saved.slug,
        published: saved.published,
      },
    });
  } catch (error) {
    console.error("Blog generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
