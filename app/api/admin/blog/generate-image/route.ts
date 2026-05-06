import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

export const runtime = "nodejs";
export const maxDuration = 300;

const BUCKET = "blog-images";

// GPT-4o: gera prompt visual — gpt-image-1 High Quality: gera a imagem
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

    const body = (await req.json()) as { postId: string; model?: string };
    const { postId } = body;
    const model = body.model ?? "dall-e-3";
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

    // 2. GPT-4o lê o post completo, decide a cena visual e gera o prompt técnico para o gpt-image-1
    const contentSnippet = (post.content ?? "").replace(/<[^>]+>/g, "").slice(0, 400);
    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior photo editor at a top Brazilian financial journalism outlet. You select the perfect editorial stock photo concept for each article to maximize click-through on Google Discover.

Your job: read the full article details, identify the emotional core and specific context, then write a prompt for gpt-image-1 (OpenAI's best image model) — a compelling, hyper-realistic editorial photo tailored to this exact article.

THINKING PROCESS (internal, do not output):
1. What is the SPECIFIC topic? (MEI entrepreneur registering business? Desenrola Brasil debt negotiation? Income tax refund? Deadline stress? Budget savings?)
2. What HUMAN SITUATION best represents this specific topic? (small business owner at laptop? family negotiating debt? professional filing taxes at home?)
3. What environment feels authentic to Brazilian working class / middle class?

STYLE RULES:
- PEOPLE in real, specific situations — not generic stock photo clichés
- People from behind, side angle, or hands only — never full faces
- People must look Brazilian/Latin American: warm olive/brown skin tones, dark hair
- Authentic Brazilian settings: small apartment, home office in favela-adjacent building, corner bakery (padaria), street in São Paulo or interior city
- For MEI topics: small business owner, artisan, deliveryman context
- For Desenrola/debt topics: regular person with relief, documents, negotiation atmosphere
- For IRPF/tax topics: organized desk, digital documents, professional calm environment
- Natural window light, warm golden hour tones
- gpt-image-1 photorealistic style — cinematic, 35mm, shallow depth of field
- Premium editorial quality (Folha de S.Paulo, Veja, Exame visual style)

HARD LIMITS:
- NO camera brand names
- NO banknotes or paper money visible
- NO text, words, or numbers visible in scene
- NO more than 4 elements
- NO Middle Eastern appearance or clothing
- NO generic 'calculator on white desk' — be SPECIFIC to the article topic

OUTPUT: only the image prompt in English. Maximum 100 words. No explanations. No preamble.`,
        },
        {
          role: "user",
          content: `Article details:\nTITLE: ${post.title}\nSUMMARY: ${post.summary ?? ""}\nKEYWORDS: ${(post.keywords ?? []).slice(0, 6).join(", ")}\nTAGS: ${(post.tags ?? []).slice(0, 4).join(", ")}\nCONTENT EXCERPT: ${contentSnippet}\n\nWrite a hyper-specific editorial photo prompt for THIS exact article. The image must make someone immediately understand the topic without reading the title.`,
        },
      ],
      temperature: 0.75,
      max_tokens: 150,
    });

    const imagePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Person from behind sitting at bright home office desk, looking at laptop screen, warm natural window light, shallow depth of field, 35mm film aesthetic, photorealistic, editorial stock photo style, no text visible, Brazilian apartment setting`;

    // 3. Gerar imagem pelo modelo escolhido
    let buffer: Buffer;
    let imageSource: string;
    let contentType = "image/png";

    if (model === "flux") {
      // ── Flux Pro 1.1 via fal.ai REST API ─────────────────────────────────
      const falKey = process.env.FAL_KEY;
      if (!falKey) {
        return NextResponse.json({ error: "FAL_KEY não configurado no ambiente — adicione em Vercel > Settings > Environment Variables" }, { status: 400 });
      }
      console.log("[Image] Gerando com Flux Pro 1.1 (fal.ai)...");
      const fluxRes = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          image_size: "landscape_16_9",
          num_images: 1,
          output_format: "jpeg",
          safety_tolerance: "2",
        }),
      });
      if (!fluxRes.ok) {
        const errText = await fluxRes.text();
        console.error("[Image] Flux error:", errText);
        return NextResponse.json({ error: `Flux error: ${fluxRes.status} — ${errText}` }, { status: 500 });
      }
      const fluxData = await fluxRes.json() as { images?: { url: string; content_type?: string }[] };
      const fluxImageUrl = fluxData.images?.[0]?.url;
      if (!fluxImageUrl) {
        return NextResponse.json({ error: "Flux não retornou imagem" }, { status: 500 });
      }
      contentType = fluxData.images?.[0]?.content_type ?? "image/jpeg";
      const fluxImgRes = await fetch(fluxImageUrl);
      if (!fluxImgRes.ok) {
        return NextResponse.json({ error: "Falha ao baixar imagem do Flux" }, { status: 500 });
      }
      buffer = Buffer.from(await fluxImgRes.arrayBuffer());
      imageSource = "flux";
      console.log("[Image] Flux Pro 1.1 gerado com sucesso.");

    } else {
      // ── gpt-image-1 High Quality (padrão) ────────────────────────────────
      console.log("[Image] Gerando com gpt-image-1 High Quality...");
      const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1536x1024",
        quality: "medium",
        n: 1,
      });

      const b64 = imageResponse.data?.[0]?.b64_json;
      if (!b64) {
        return NextResponse.json({ error: "gpt-image-1 não retornou imagem" }, { status: 500 });
      }
      buffer = Buffer.from(b64, "base64");
      contentType = "image/png";
      imageSource = "gpt-image-1";
      console.log("[Image] gpt-image-1 High Quality gerado com sucesso.");
    }

    // 4. Upload para Supabase Storage
    const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
    const fileName = `${post.slug}.${ext}`;

    await ensureBucket();

    // Deletar arquivo anterior explicitamente para forçar invalidação do CDN Supabase.
    await supabaseAdmin.storage.from(BUCKET).remove([fileName]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const baseUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
    const publicUrl = `${baseUrl}?v=${Date.now()}`;

    const imageAlt = await generateImageAlt(post.title);

    // 5. Atualizar campo coverImage no banco
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        coverImage: publicUrl,
        imageAlt,
        imageAttribution: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: imagePrompt, imageAlt, imageSource });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
