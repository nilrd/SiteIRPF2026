import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { groqLlama, MODELS } from "@/lib/llm-providers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Tenta gerar imagem com Gemini 2.0 Flash Experimental (gratuito).
 * Retorna Buffer da imagem ou null se não disponível / falhar.
 */
async function generateImageWithGemini(imagePrompt: string): Promise<Buffer | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    console.log("[Image] Tentando Gemini 2.0 Flash (gratuito)...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
      // @ts-expect-error — responseModalities não está no tipo oficial ainda mas é suportado pela API
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    });

    for (const part of result.response.candidates?.[0]?.content?.parts ?? []) {
      const inline = (part as { inlineData?: { mimeType?: string; data?: string } }).inlineData;
      if (inline?.mimeType?.startsWith("image/") && inline.data) {
        console.log("[Image] Sucesso: Gemini 2.0 Flash");
        return Buffer.from(inline.data, "base64");
      }
    }
    console.warn("[Image] Gemini retornou resposta sem imagem.");
    return null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[Image] Gemini falhou:", msg);
    return null;
  }
}

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
            `- Setting: Brazilian urban office, São Paulo style architecture visible through windows when relevant\n` +
            `- GOOGLE DISCOVER REQUIREMENTS: image must feel like premium editorial photography from a top financial magazine. High visual impact at thumbnail size. Strong contrast between subject and background. One clear focal point, not cluttered. Warm color palette: amber, cream, dark wood tones. No watermarks, no text overlays, no borders. The image must make someone stop scrolling on mobile. Think: how does this look as 400x300px on a phone screen? The key visual element must be clear at that size.\n\n` +
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

    // 3. Tentar Gemini 2.0 Flash (gratuito) — fallback para DALL-E 3 (pago)
    let buffer: Buffer | null = await generateImageWithGemini(dallePrompt);
    let imageSource: "gemini" | "dall-e" = "gemini";

    if (!buffer) {
      // Fallback: DALL-E 3
      console.log("[Image] Usando DALL-E 3 como fallback...");
      imageSource = "dall-e";
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

      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json({ error: "Falha ao baixar imagem do DALL-E" }, { status: 500 });
      }
      buffer = Buffer.from(await imgRes.arrayBuffer());
    }

    console.log(`[Image] Fonte usada: ${imageSource}`);

    // 4. Upload para Supabase Storage
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

    return NextResponse.json({ imageUrl: publicUrl, prompt: dallePrompt, imageAlt, imageSource });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
