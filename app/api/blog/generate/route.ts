import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBlogPost, saveBlogPost } from "@/lib/blog-engine";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
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
      post: {
        id: saved.id,
        title: saved.title,
        slug: saved.slug,
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
