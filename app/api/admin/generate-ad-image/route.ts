import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const BUCKET = "ad-images";

const FORMAT_MAP: Record<string, { size: "1024x1024" | "1792x1024" | "1024x1792"; label: string }> = {
  "square":     { size: "1024x1024",  label: "1:1 — Feed Facebook/Instagram" },
  "landscape":  { size: "1792x1024",  label: "1.91:1 — Google Display / LinkedIn / Stories capa" },
  "portrait":   { size: "1024x1792",  label: "9:16 — Stories / Reels" },
};

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024,
        allowedMimeTypes: ["image/png"],
      });
    }
  } catch { /* bucket já existe */ }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { prompt, formato, campaignSlug } = (await req.json()) as {
      prompt: string;
      formato: string;
      campaignSlug: string;
    };

    if (!prompt || !formato || !campaignSlug) {
      return NextResponse.json({ error: "prompt, formato e campaignSlug são obrigatórios" }, { status: 400 });
    }

    const formatConfig = FORMAT_MAP[formato];
    if (!formatConfig) {
      return NextResponse.json({ error: `formato inválido. Use: ${Object.keys(FORMAT_MAP).join(", ")}` }, { status: 400 });
    }

    // Gera imagem com DALL-E 3 HD
    console.log(`[ad-image] Gerando ${formatConfig.label}...`);
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: formatConfig.size,
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
      return NextResponse.json({ error: "Falha ao baixar imagem" }, { status: 500 });
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    // Upload para Supabase Storage
    await ensureBucket();
    const fileName = `${campaignSlug}-${formato}.png`;

    // Remove versão anterior para invalidar CDN
    await supabaseAdmin.storage.from(BUCKET).remove([fileName]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const baseUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
    const publicUrl = `${baseUrl}?v=${Date.now()}`;

    console.log(`[ad-image] ✓ ${formatConfig.label} → ${publicUrl}`);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      formato,
      label: formatConfig.label,
      size: formatConfig.size,
    });
  } catch (err) {
    console.error("[generate-ad-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
