import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const slug = "irpf-2026-prazo-23-marco-29-maio-quem-deve-declarar";

const claimsToCheck = [
  "23 de março",
  "29 de maio",
  "R$ 35.584,00",
  "R$ 200.000,00",
  "R$ 177.920,00",
  "R$ 800.000,00",
  "R$ 165,74",
  "R$ 16.754,34",
  "8",
  "malha fina",
  "bloqueio de regularidade fiscal",
  "30 de setembro",
  "quatro lotes",
  "cinco lotes",
  "isenção até R$ 5 mil",
];

async function main() {
  const p = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, summary: true, content: true, faqsJson: true, updatedAt: true },
  });
  if (!p) {
    console.log("POST NÃO ENCONTRADO");
    return;
  }

  const allText = [p.title, p.summary || "", p.content || "", p.faqsJson || ""].join("\n");

  console.log("=== POST AUDITADO ===");
  console.log(p.title);
  console.log("updatedAt:", p.updatedAt.toISOString());

  console.log("\n=== CLAIMS ENCONTRADAS NO POST ===");
  for (const c of claimsToCheck) {
    const found = allText.toLowerCase().includes(c.toLowerCase());
    if (found) console.log("-", c);
  }

  // imprime trecho inicial para revisão manual
  const plain = (p.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  console.log("\n=== TRECHO INICIAL (600 chars) ===");
  console.log(plain.slice(0, 600));
}

main().catch(console.error).finally(() => prisma.$disconnect());
