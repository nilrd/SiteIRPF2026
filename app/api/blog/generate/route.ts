import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { generateBlogPost, saveBlogPost } from "@/lib/blog-engine";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as Parameters<typeof getToken>[0]["req"], secret: process.env.NEXTAUTH_SECRET });
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
