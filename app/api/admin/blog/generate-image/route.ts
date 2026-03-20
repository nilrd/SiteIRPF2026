import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { groqLlama, MODELS } from "@/lib/llm-providers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

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
      select: { id: true, title: true, summary: true, slug: true },
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
            `You are a creative director for a premium Brazilian financial consulting firm. Create a DALL-E 3 prompt for a blog post cover photo.\n\n` +
            `STYLE RULES — mandatory:\n` +
            `- Editorial photography style, like The Economist or Valor Econômico magazine covers\n` +
            `- Shot on film camera aesthetic: slight grain, natural colors, real depth of field\n` +
            `- NEVER generate a person looking directly at camera\n` +
            `- NEVER generate a person as the main subject centered in frame\n` +
            `- Prefer: close-up of hands working, documents on desk, coffee cup next to papers, computer screen with spreadsheet, pen signing document, calendar with circled date, empty office at dawn, stack of folders, calculator and receipts\n` +
            `- If a person appears: only partial — hands typing, person seen from behind at a desk, silhouette near window\n` +
            `- No AI aesthetics: no perfect symmetry, no glowing elements, no floating objects, no surreal compositions\n` +
            `- Lighting: natural window light, warm office tones\n` +
            `- Setting: Brazilian urban office, São Paulo style architecture visible through windows when relevant\n\n` +
            `POST TITLE (PT-BR): ${post.title}\n` +
            `POST SUMMARY (PT-BR): ${post.summary ?? ""}\n\n` +
            `Based on the title and summary, generate ONE specific, cinematic image prompt in English.\n` +
            `Focus on OBJECTS and ATMOSPHERE that represent the topic.\n` +
            `Max 55 words. Return ONLY the prompt text.`,

        },
      ],
      temperature: 0.6,
      max_tokens: 120,
    });

    const dallePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      "A Brazilian financial consultant reviewing income tax documents at a modern São Paulo office desk, natural window light, shallow depth of field, photorealistic Sony A7R IV photography";

    // 3. Chamar DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1792x1024",
      quality: "hd",
      style: "natural",
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
    // PONTO 1: usar slug do post como nome do arquivo (substituindo gerações anteriores via upsert)
    const fileName = `${post.slug}.png`;

    await ensureBucket();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;

    // PONTO 3b: gerar imageAlt via Groq
    const imageAlt = await generateImageAlt(post.title);

    // 5. Atualizar campo coverImage no banco
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        coverImage: publicUrl,
        imageAlt,
        imageAttribution: null, // DALL-E images don't require Unsplash attribution
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: dallePrompt, imageAlt });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
