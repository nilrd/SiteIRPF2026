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
          role: "system",
          content:
            `You are a world-class photo editor at a premium Brazilian financial magazine (Valor Econômico / Exame level). ` +
            `Your job is to write hyper-specific DALL-E 3 prompts that produce images indistinguishable from real documentary photography.\n\n` +

            `MANDATORY TECHNICAL SPECS — always include ALL of these in every prompt:\n` +
            `• Camera + lens: choose ONE realistic combo, e.g. "shot on Canon EOS R5, 85mm f/1.4L IS USM" or "Leica M11 50mm f/2 Summicron" or "Hasselblad X2D 100C 80mm f/2.8"\n` +
            `• Aperture + depth of field: always shallow, e.g. "f/1.6 aperture, razor-thin focus plane, creamy out-of-focus background"\n` +
            `• Film grain: "Kodak Portra 400 film grain" or "Fujifilm Pro 400H grain and color science"\n` +
            `• Specific light: never say "natural light" — say EXACTLY: direction + quality + time, e.g. "raking morning light 8:15am through frosted office blinds casting parallel shadow stripes" or "overcast diffused São Paulo skyline light on a rainy Tuesday afternoon"\n` +
            `• Micro-imperfections: include at least 2 of: "slight chromatic aberration at corners", "minimal lens vignetting", "barely perceptible camera shake on background", "micro-highlight bloom on specular surfaces"\n` +
            `• Setting specificity: not "desk" but "worn oak desk with visible coffee ring stain and pen scratches", not "office" but "10th floor São Paulo Faria Lima financial district office, Pinheiros rooftops visible through rain-streaked window"\n\n` +

            `SUBJECT — choose ONE authentic scene per topic:\n` +
            `• Tax documents / IRPF: worn tax return forms with handwritten annotations, official Receita Federal envelope slightly opened, mechanical pencil mid-calculation on a grid notepad, reading glasses resting on top\n` +
            `• Money / investment: physical R$ bills partially visible in a leather wallet, bank statement printout with coffee stain, old coin collection in wooden box\n` +
            `• Deadline / urgency: physical wall calendar with March/April dates circled in red pen, smartphone showing 23:47 screen time, desk lamp on in dark office\n` +
            `• Bureaucracy / forms: stack of yellowed bureaucratic folders with rubber band, stapler beside clipped documents, filing cabinet drawer half-open\n` +
            `• Person (if needed): ONLY hands or over-shoulder — no face ever — e.g. "accountant's hands in grey suit jacket sleeve, calculator keys mid-press, pinky ring visible"\n\n` +

            `ABSOLUTE PROHIBITIONS — never include any of these:\n` +
            `✗ Perfect symmetry or centered compositions\n` +
            `✗ Floating charts, holographic data, glow effects, neon\n` +
            `✗ Stock-photo smiling faces\n` +
            `✗ Words: "vibrant", "stunning", "professional", "modern", "sleek", "elegant"\n` +
            `✗ Any CGI, 3D render, illustration, or vector look\n` +
            `✗ Generic "office desk" without specific worn details\n\n` +

            `OUTPUT FORMAT: Return ONLY the raw prompt text. No quotes. No preamble. No explanation. Max 75 words.`,
        },
        {
          role: "user",
          content:
            `Write a DALL-E 3 photographic prompt for this Brazilian tax/finance blog post:\n\n` +
            `TITLE: ${post.title}\n` +
            `SUMMARY: ${post.summary ?? ""}\n\n` +
            `The image must feel like it was taken in Brazil by a documentary photojournalist for Valor Econômico newspaper. ` +
            `It must look like a real photo from a 35mm camera — not AI-generated. ` +
            `Pick ONE specific object or scene that visually represents this exact tax/finance topic. ` +
            `Include full technical camera specs, specific lighting, and at least 2 physical imperfections.`,
        },
      ],
      temperature: 0.75,
      max_tokens: 180,
    });

    const dallePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Close-up of weathered hands in a dark navy suit sleeve signing a Receita Federal tax declaration form with a Bic Cristal pen, worn oak desk with visible coffee ring stain, Kodak Portra 400 grain, shot on Leica M11 50mm f/2 Summicron at f/1.8, raking 9am Faria Lima window light casting long shadow across paper, slight chromatic aberration at corners, São Paulo overcast morning`;

    // 3. DALL-E 3 — único gerador de imagens (qualidade HD superior ao Gemini)
    console.log("[Image] Gerando com DALL-E 3 HD...");
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1792x1024",
      quality: "hd",
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
    console.log("[Image] DALL-E 3 HD gerado com sucesso.");

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

    return NextResponse.json({ imageUrl: publicUrl, prompt: dallePrompt, imageAlt, imageSource: "dall-e" });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
