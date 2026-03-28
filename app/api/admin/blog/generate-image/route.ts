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
          content: `You are a senior photo editor at a top Brazilian financial journalism outlet. You select the perfect editorial stock photo concept for each article to maximize click-through on Google Discover.

Your job: read the article title, summary and keywords, identify the emotional core and main concept, then write a DALL-E 3 prompt for a compelling, contextual editorial photo.

THINKING PROCESS (internal, do not output):
1. What is the REAL topic? (stress about taxes? relief of refund? confusion about rules? savings opportunity? deadline urgency?)
2. What HUMAN SITUATION represents this? (person stressed at desk? happy couple receiving money? professional reviewing documents? family planning budget?)
3. What OBJECTS reinforce this? (only if no people work better)

STYLE RULES:
- Prefer PEOPLE in real situations over objects alone
- People from behind, side angle, or hands only — never full faces
- Bright, clean, professional environments (not dark/dramatic)
- Natural window light, warm tones
- Editorial stock photo style (Getty Images, Shutterstock premium)
- Real Brazilian context when possible (home office, apartment, cafe)
- 35mm film aesthetic, shallow depth of field, photorealistic

HARD LIMITS:
- NO camera brand names (Canon, Nikon, etc)
- NO banknotes or paper money
- NO text or writing visible
- NO more than 4 elements in scene
- NO generic 'just a calculator on desk' concepts

CONCEPT EXAMPLES BY TOPIC:
- Restituição/refund → person smiling looking at phone/laptop, bright home, relieved expression (from behind or side)
- Prazo/deadline → person at desk at night, clock visible, urgent atmosphere, hands typing
- Declaração/filing → hands organizing papers neatly on clean desk, coffee nearby, organized professional feeling
- Malha fina/audit → person looking concerned at official letter, kitchen table, natural light
- Deduções/savings → couple at table with notebook planning together, calculator, warm home environment
- MEI/freelancer → person working laptop in cafe or home office, casual professional setting
- Investimentos → charts on screen (blurred), person analyzing, professional office setting
- Criptomoedas → tech environment, multiple screens blurred, modern minimalist desk

OUTPUT: only the DALL-E 3 prompt in English. Maximum 80 words. No explanations. No preamble.`,
        },
        {
          role: "user",
          content: `Article details:\nTITLE: ${post.title}\nSUMMARY: ${post.summary ?? ""}\nKEYWORDS: ${(post.keywords ?? []).slice(0, 5).join(", ")}\nTAGS: ${(post.tags ?? []).slice(0, 3).join(", ")}\n\nThink about the emotional core of this article and write the perfect editorial photo prompt. Remember: contextual and human beats generic objects. The image must make someone stop scrolling.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 120,
    });

    const imagePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Person from behind sitting at bright home office desk, looking at laptop screen, warm natural window light, shallow depth of field, 35mm film aesthetic, photorealistic, editorial stock photo style, no text visible, Brazilian apartment setting`;

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
