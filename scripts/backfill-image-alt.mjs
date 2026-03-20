/**
 * PONTO 5 — Backfill: gera imageAlt para posts com campo vazio ou null.
 * Usa Groq llama-3.1-8b-instant (rápido e gratuito).
 *
 * Executar: node scripts/backfill-image-alt.mjs
 */

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

async function generateAlt(title) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content:
            `Escreva um texto alt para a imagem de capa deste post de blog sobre IRPF. ` +
            `Máximo 12 palavras, em português, descritivo e com a palavra-chave principal do post. ` +
            `Retorne APENAS o texto, sem aspas, sem pontuação final.\n` +
            `Título: ${title}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const alt = (completion.choices?.[0]?.message?.content ?? "").trim();
    const cleaned = alt.replace(/^["']|["']$/g, "").replace(/[.!?]$/, "").trim();
    return cleaned || title;
  } catch (err) {
    console.error(`  ⚠ Groq falhou para "${title}": ${err.message}`);
    return title;
  }
}

async function main() {
  console.log("🔍 Buscando posts com imageAlt vazio ou null...\n");

  const posts = await prisma.blogPost.findMany({
    where: {
      imageAlt: "",
    },
    select: { id: true, title: true, slug: true, imageAlt: true },
    orderBy: { createdAt: "asc" },
  });

  if (posts.length === 0) {
    console.log("✅ Todos os posts já têm imageAlt preenchido. Nada a fazer.");
    return;
  }

  console.log(`📝 ${posts.length} posts para processar:\n`);

  let updated = 0;
  let failed = 0;

  for (const post of posts) {
    process.stdout.write(`  → [${post.slug}] "${post.title.slice(0, 50)}"... `);

    const imageAlt = await generateAlt(post.title);

    try {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { imageAlt },
      });
      console.log(`✓ "${imageAlt}"`);
      updated++;
    } catch (err) {
      console.log(`✗ Erro no banco: ${err.message}`);
      failed++;
    }

    // Pequeno delay para não sobrecarregar a API
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n📊 Resultado: ${updated} atualizados, ${failed} falhas.`);
}

main()
  .catch((err) => {
    console.error("Erro fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
