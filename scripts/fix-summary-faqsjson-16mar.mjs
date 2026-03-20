/**
 * Corrige "16 de março" residual em summary e faqsJson
 * dos 2 posts que ainda têm esse dado incorreto
 */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const SLUGS = [
  "erros-declaracao-irpf-2026-receita-federal",
  "prazo-declaracao-irpf-2026-ano-base-2025",
];

function fix(text) {
  if (!text) return text;
  return text
    .replaceAll("16 de março", "23 de março")
    .replaceAll("18 de março", "23 de março")
    .replaceAll("R$ 28.123,91", "R$ 35.584,00")
    .replaceAll("R$28.123,91", "R$ 35.584,00");
}

async function main() {
  for (const slug of SLUGS) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { summary: true, faqsJson: true, metaDesc: true },
    });

    if (!post) {
      console.log(`❌ Não encontrado: ${slug}`);
      continue;
    }

    const newSummary = fix(post.summary);
    const newFaqsJson = fix(post.faqsJson);
    const newMetaDesc = fix(post.metaDesc);

    await prisma.blogPost.update({
      where: { slug },
      data: {
        summary: newSummary,
        faqsJson: newFaqsJson,
        metaDesc: newMetaDesc,
        updatedAt: new Date(),
      },
    });

    // Verificação
    const updated = await prisma.blogPost.findUnique({
      where: { slug },
      select: { summary: true, faqsJson: true, metaDesc: true },
    });

    const all = (updated?.summary || "") + (updated?.faqsJson || "") + (updated?.metaDesc || "");
    console.log(`\n✅ ${slug}`);
    console.log("  16/03 limpo:", !all.includes("16 de março") ? "✅" : "❌");
    console.log("  18/03 limpo:", !all.includes("18 de março") ? "✅" : "❌");
    console.log("  28.123 limpo:", !all.includes("28.123") ? "✅" : "❌");
    console.log("  23/03 presente:", all.includes("23 de março") ? "✅" : "—");
  }

  console.log("\n=== Auditoria final completa ===");
  const all = await prisma.blogPost.findMany({
    select: { slug: true, content: true, summary: true, faqsJson: true, metaDesc: true },
  });

  let dirty = 0;
  for (const p of all) {
    const joined = [p.content, p.summary, p.faqsJson, p.metaDesc].join(" ");
    if (joined.includes("16 de março") || joined.includes("18 de março") || joined.includes("28.123")) {
      console.log(`❌ ${p.slug}`);
      dirty++;
    }
  }
  if (dirty === 0) console.log("✅ TODOS os posts estão limpos!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
