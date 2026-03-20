/**
 * Teste local do pipeline DALL-E 3 para o post retificacao-irpf-como-fazer
 * Executa os mesmos passos da rota generate-image/route.ts
 */
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback para .env

const prisma = new PrismaClient();

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = "blog-images";

async function main() {
  console.log("📋 Buscando post retificacao-irpf-como-fazer...\n");

  const post = await prisma.blogPost.findUnique({
    where: { slug: "retificacao-irpf-como-fazer" },
    select: { id: true, title: true, summary: true, slug: true },
  });

  if (!post) throw new Error("Post não encontrado");

  console.log(`✓ Post: "${post.title}"`);
  console.log(`  Resumo: ${(post.summary ?? "").slice(0, 80)}...\n`);

  // 1. Groq gera o prompt para DALL-E 3
  console.log("🤖 Gerando prompt via Groq (llama-3.1-8b-instant)...\n");
  const promptCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content:
          `You are an expert art director for a professional Brazilian financial consulting firm. ` +
          `Create a DALL-E 3 image generation prompt for a blog post cover image.\n\n` +
          `STRICT RULES — follow all of them:\n` +
          `- Photorealistic photography style only, shot with Sony A7R IV\n` +
          `- Natural lighting, no digital effects, no holograms, no glows\n` +
          `- No text, no logos, no numbers, no charts overlaid on image\n` +
          `- No obvious AI aesthetics (no geometric patterns, no tech grids)\n` +
          `- Brazilian context: São Paulo office environments, Brazilian people, Brazilian documents when relevant\n` +
          `- People must look natural and candid, not posed like stock photos\n` +
          `- No dollar signs or foreign currency — Brazil uses Real (R$)\n` +
          `- Image must visually represent the specific post topic, not generic 'finance' or 'money'\n` +
          `- Aspect ratio: cinematic 16:9, shallow depth of field\n\n` +
          `POST TITLE: ${post.title}\n` +
          `POST SUMMARY: ${post.summary ?? ""}\n\n` +
          `Generate a single, specific, detailed image prompt in English. Max 60 words. Return ONLY the prompt, nothing else.`,
      },
    ],
    temperature: 0.6,
    max_tokens: 120,
  });

  const dallePrompt =
    (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
    "A Brazilian financial consultant reviewing income tax documents at a modern São Paulo office desk, natural window light, shallow depth of field, photorealistic Sony A7R IV photography";

  console.log("═══════════════════════════════════════════════════");
  console.log("PROMPT GERADO PELO GROQ:");
  console.log(dallePrompt);
  console.log("═══════════════════════════════════════════════════\n");

  // 2. DALL-E 3 — parâmetros novos: hd + natural
  console.log("🎨 Gerando imagem com DALL-E 3 (quality: hd, style: natural)...\n");
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: dallePrompt,
    size: "1792x1024",
    quality: "hd",
    style: "natural",
    n: 1,
  });

  const tempUrl = imageResponse.data?.[0]?.url;
  if (!tempUrl) throw new Error("DALL-E não retornou URL");

  // 3. Download e upload para Supabase
  console.log("⬆ Baixando imagem do DALL-E e enviando para Supabase...");
  const imgRes = await fetch(tempUrl);
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const fileName = `${post.slug}.png`;  // PONTO 1: nome = slug

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: "image/png", upsert: true });

  if (uploadError) throw new Error(`Upload falhou: ${uploadError.message}`);

  const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;

  // 4. Gerar imageAlt
  const altCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content:
          `Escreva um texto alt para a imagem de capa deste post de blog sobre IRPF. ` +
          `Máximo 12 palavras, em português, descritivo e com a palavra-chave principal do post. ` +
          `Retorne APENAS o texto, sem aspas, sem pontuação final.\n` +
          `Título: ${post.title}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 50,
  });

  const imageAlt = (altCompletion.choices?.[0]?.message?.content ?? "").trim().replace(/[.!?]$/, "") || post.title;

  // 5. Atualizar banco
  await prisma.blogPost.update({
    where: { id: post.id },
    data: {
      coverImage: publicUrl,
      imageAlt,
      imageAttribution: JSON.stringify({
        photographerName: "DALL-E 3 (OpenAI)",
        photographerUrl: "https://openai.com",
        photoUrl: publicUrl,
      }),
    },
  });

  console.log("\n═══════════════════════════════════════════════════");
  console.log("✅ RESULTADO FINAL:");
  console.log(`   Arquivo no Supabase: ${fileName}`);
  console.log(`   URL pública:         ${publicUrl}`);
  console.log(`   imageAlt gerado:     "${imageAlt}"`);
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .catch((err) => { console.error("Erro:", err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
