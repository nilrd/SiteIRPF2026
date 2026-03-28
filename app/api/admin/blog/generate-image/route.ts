import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

// GPT-4o: gera prompt visual — DALL-E 3 Standard: gera a imagem
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
      select: { id: true, title: true, summary: true, slug: true, content: true, tags: true, keywords: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // 2. GPT-4o lê o post completo, decide a cena visual e gera o prompt técnico para o DALL-E 3
    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a minimalist editorial art director for a premium Brazilian finance magazine.
Your only job: write a DALL-E 3 prompt that produces a clean, photorealistic still-life photo.

ABSOLUTE RULES — NEVER BREAK:
- No documents, forms, tax papers, envelopes, or screens showing content
- No banknotes, currency, or anything with printed numbers
- No cameras, lenses, or photo equipment as objects in the scene
- No people, faces, hands, or silhouettes
- No more than 3 objects total
- No logos, brand names, or readable text anywhere

ALLOWED OBJECTS (pick 1-3 that fit the topic):
gold or silver coin, vintage mechanical calculator, silver ballpoint pen, black ceramic coffee cup, folded reading glasses, closed beige linen folder, metal ruler, closed laptop (screen off, no logos), small succulent plant in terracotta pot

MANDATORY STYLE (always include all of these):
editorial photography, shallow depth of field, warm side lighting from left, dark walnut wood surface, muted earth tones, minimalist composition, 35mm film aesthetic, photorealistic, no text anywhere, high-end finance magazine

OUTPUT: only the English prompt, max 60 words, no explanations, no quotes.`,
        },
        {
          role: "user",
          content: `Write a DALL-E 3 image prompt for this blog post. Choose 1-2 objects from the allowed list that best represent the topic. Apply all mandatory style words.\n\nPOST TITLE: ${post.title}\nTOPIC: ${(post.tags ?? []).slice(0, 3).join(", ") || "IRPF, imposto de renda"}\n\nRemember: max 3 objects, no text, no people, no documents, no banknotes.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 80,
    });

    const imagePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Single gold coin on dark walnut surface, silver pen beside it, editorial photography, shallow depth of field, warm side lighting from left, muted earth tones, minimalist composition, 35mm film aesthetic, photorealistic, no text anywhere, high-end finance magazine`;

    // 3. DALL-E 3 Standard — gerador de imagens
    console.log("[Image] Gerando com DALL-E 3 Standard...");
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1792x1024",
      quality: "standard",
      style: "natural",
      n: 1,
      response_format: "url",
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "DALL-E não retornou imagem" }, { status: 500 });
    }

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: "Falha ao baixar imagem do DALL-E" }, { status: 500 });
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    console.log("[Image] DALL-E 3 Standard gerado com sucesso.");

    // 4. Upload para Supabase Storage
    const fileName = `${post.slug}.png`;

    await ensureBucket();

    // Deletar arquivo anterior explicitamente para forçar invalidação do CDN Supabase.
    await supabaseAdmin.storage.from(BUCKET).remove([fileName]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Cache-busting na URL: força Next.js Image optimizer a tratar como recurso novo
    // (Next.js cacheia imagens otimizadas por minimumCacheTTL — a URL com ?v= diferente
    // bypassa esse cache e busca a imagem recém-enviada ao storage)
    const baseUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
    const publicUrl = `${baseUrl}?v=${Date.now()}`;

    // PONTO 3b: gerar imageAlt via Groq
    const imageAlt = await generateImageAlt(post.title);

    // 5. Atualizar campo coverImage no banco
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        coverImage: publicUrl,
        imageAlt,
        imageAttribution: null, // DALL-E images não requerem atribuição Unsplash
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: imagePrompt, imageAlt, imageSource: "dall-e" });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
