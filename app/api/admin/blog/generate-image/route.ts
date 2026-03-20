import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { groqLlama, MODELS } from "@/lib/llm-providers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      });
    }
  } catch {
    // bucket ja existe
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { postId } = (await req.json()) as { postId: string };
    if (!postId) {
      return NextResponse.json({ error: "postId obrigatório" }, { status: 400 });
    }

    // 1. Buscar título e resumo no banco
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, title: true, summary: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // 2. Groq gera o prompt para o DALL-E 3
    const promptCompletion = await groqLlama.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "user",
          content:
            `Create a DALL-E image generation prompt for this blog post about Brazilian income tax (IRPF). ` +
            `Style: photorealistic, clean, professional. ` +
            `No text, no logos, no numbers. ` +
            `Brazilian context when relevant. Max 40 words.\n` +
            `Post title: ${post.title}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 80,
    });

    const dallePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      "A professional Brazilian financial consultant reviewing tax documents at a modern desk, clean office, warm lighting, photorealistic";

    // 3. Chamar DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1792x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "DALL-E não retornou imagem" }, { status: 500 });
    }

    // 4. Fazer download e upload para Supabase Storage
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: "Falha ao baixar imagem do DALL-E" }, { status: 500 });
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const fileName = `dalle-${postId}-${Date.now()}.png`;

    await ensureBucket();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;

    // 5. Atualizar campo coverImage no banco
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        coverImage: publicUrl,
        imageAttribution: JSON.stringify({
          photographerName: "DALL-E 3 (OpenAI)",
          photographerUrl: "https://openai.com",
          photoUrl: publicUrl,
        }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: dallePrompt });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
