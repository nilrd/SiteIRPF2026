import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: {
      slug: true,
      title: true,
      content: true,
      summary: true,
      faqsJson: true,
      metaDesc: true,
      metaTitle: true,
      reviewJson: true,
    },
  });

  console.log(`Total posts: ${posts.length}\n`);
  console.log("=== Busca por '18 de março' em QUALQUER campo ===");

  let found18 = false;
  let found28 = false;

  for (const p of posts) {
    for (const [field, val] of Object.entries(p)) {
      if (field === 'slug' || field === 'title' || !val) continue;
      const str = String(val);
      if (str.includes("18 de março")) {
        found18 = true;
        const idx = str.indexOf("18 de março");
        console.log(`❌ ${p.slug} → campo "${field}"`);
        console.log(`   ...${str.substring(Math.max(0,idx-50), idx+70)}...`);
      }
      if (str.includes("28.123")) {
        found28 = true;
        const idx = str.indexOf("28.123");
        console.log(`❌ ${p.slug} → campo "${field}" (R$28.123)`);
        console.log(`   ...${str.substring(Math.max(0,idx-50), idx+50)}...`);
      }
      if (str.includes("16 de março")) {
        const idx = str.indexOf("16 de março");
        console.log(`⚠️  ${p.slug} → campo "${field}" (16/03)`);
        console.log(`   ...${str.substring(Math.max(0,idx-50), idx+70)}...`);
      }
    }
  }

  if (!found18) console.log("✅ NENHUM post contém '18 de março' em nenhum campo.");
  if (!found28) console.log("✅ NENHUM post contém 'R$ 28.123' em nenhum campo.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
