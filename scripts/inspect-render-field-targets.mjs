import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const slugs = [
  "prazo-declaracao-irpf-2026-ano-base-2025",
  "erros-declaracao-irpf-2026-receita-federal",
  "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026",
  "rendimentos-recebidos-acumuladamente-rra",
];

async function main() {
  for (const slug of slugs) {
    const p = await prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true, slug: true, title: true, content: true, summary: true, updatedAt: true },
    });

    if (!p) {
      console.log(`\n❌ NÃO ENCONTRADO: ${slug}`);
      continue;
    }

    const plain = p.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`\n=== ${slug} ===`);
    console.log("id:", p.id);
    console.log("updatedAt:", p.updatedAt.toISOString());
    console.log("has 18/29:", /18 de março a 29 de maio|18\/03|29\/05|29 de maio/i.test(p.content));
    console.log("has 16/30:", /16 de março a 30 de maio|16\/03/i.test(p.content));
    console.log("has 23/30:", /23 de março a 30 de maio|23\/03|30\/05/i.test(p.content));
    console.log("has 28.123:", /28\.123,91/.test(p.content));
    console.log("has 35.584:", /35\.584,00/.test(p.content));
    console.log("has outubro/2026:", /outubro de 2026/i.test(p.content));
    console.log("has 30 setembro/2026:", /30 de setembro de 2026/i.test(p.content));
    console.log("snippet:", plain.slice(0, 420));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
