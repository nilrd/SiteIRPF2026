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

    // 2. GPT-4o analisa o artigo e descreve apenas a CENA visual (limpa, positiva, sem instruções negativas).
    //    O sufixo fotorrealístico é anexado pelo código — não pelo modelo — para garantir consistência.
    const contentSnippet = (post.content ?? "").replace(/<[^>]+>/g, "").slice(0, 500);

    const PHOTO_STYLE_SUFFIX =
      "Photorealistic editorial photography. Shot on 35mm lens, natural soft window light, shallow depth of field f/1.8. Professional newspaper quality, cinematic warm color grading. Landscape 3:2 ratio. Crystal clear, high resolution.";

    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a photo director for a top Brazilian financial magazine (like Exame or Veja Negócios). Given an article, you describe a single, specific editorial photo scene that immediately communicates the article topic.

OUTPUT RULES — CRITICAL:
- Output ONLY the scene description in English
- Describe what IS in the scene — never use "no", "without", "avoid", "don't"
- Maximum 60 words
- Structure: [WHO] + [DOING WHAT] + [WHERE] + [LIGHTING/MOOD]
- People must look Brazilian/Latin American (olive/warm brown skin, dark hair)
- People shown from behind or at an angle — hands and posture visible, face turned away
- Be SPECIFIC to this exact article topic — generic scenes are unacceptable

TOPIC → SCENE EXAMPLES:
- Income tax deadline → Person at kitchen table, seen from behind, sorting papers urgently under warm ceiling light, clock on wall, São Paulo apartment
- Tax refund/restituição → Woman from behind smiling at laptop screen, bright morning light through window, home office, relaxed posture
- MEI registration → Young man from behind at café table opening laptop, notepad with CNPJ forms visible, padaria setting, morning light
- Debt/Desenrola → Middle-aged couple across a table with a bank advisor, signing papers, warm interior light, relief in their posture
- Malha fina/audit → Person at desk looking intently at printed papers under desk lamp, late afternoon`,
        },
        {
          role: "user",
          content: `TITLE: ${post.title}\nSUMMARY: ${post.summary ?? ""}\nTAGS: ${(post.tags ?? []).slice(0, 4).join(", ")}\nKEYWORDS: ${(post.keywords ?? []).slice(0, 6).join(", ")}\nEXCERPT: ${contentSnippet.slice(0, 300)}\n\nDescribe the perfect editorial photo scene for this article.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const sceneDescription =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      "Person seen from behind sitting at a bright home office desk in a Brazilian apartment, reviewing documents on laptop, warm natural window light, relaxed professional atmosphere";

    const imagePrompt = `${sceneDescription}\n\n${PHOTO_STYLE_SUFFIX}`;

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
      console.log("[Image] Cena gerada pelo GPT-4o:", sceneDescription);
      console.log("[Image] Gerando com gpt-image-1 High Quality...");
      const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1536x1024",
        quality: "high",
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

    return NextResponse.json({ imageUrl: publicUrl, prompt: imagePrompt, scene: sceneDescription, imageAlt, imageSource });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
