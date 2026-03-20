import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true, content: true, summary: true, faqsJson: true },
  });

  console.log(`\n=== Auditoria completa — ${posts.length} posts ===\n`);

  for (const p of posts) {
    const fields = { content: p.content, summary: p.summary, faqsJson: p.faqsJson };
    const hits = [];

    for (const [field, val] of Object.entries(fields)) {
      if (!val) continue;
      if (val.includes("18 de março")) hits.push(`${field}:18/03`);
      if (val.includes("16 de março")) hits.push(`${field}:16/03`);
      if (val.includes("28.123")) hits.push(`${field}:R$28.123`);
    }

    if (hits.length > 0) {
      console.log(`❌ ${p.slug}`);
      hits.forEach(h => console.log(`   → ${h}`));

      // Mostra trecho exato
      for (const [field, val] of Object.entries(fields)) {
        if (!val) continue;
        const idx28 = val.indexOf("28.123");
        const idx18 = val.indexOf("18 de março");
        if (idx28 !== -1) {
          console.log(`   [${field}] trecho R$28: ...${val.substring(Math.max(0, idx28-30), idx28+60)}...`);
        }
        if (idx18 !== -1) {
          console.log(`   [${field}] trecho 18/03: ...${val.substring(Math.max(0, idx18-30), idx18+60)}...`);
        }
      }
      console.log();
    }
  }

  const clean = posts.filter(p => {
    const all = (p.content||'') + (p.summary||'') + (p.faqsJson||'');
    return !all.includes("18 de março") && !all.includes("16 de março") && !all.includes("28.123");
  });
  console.log(`✅ Posts limpos: ${clean.length}/${posts.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
