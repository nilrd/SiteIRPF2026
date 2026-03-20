import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const post = await prisma.blogPost.findUnique({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
  });

  if (!post) { console.log("NOT FOUND"); return; }

  console.log("=== TODOS OS CAMPOS ===\n");
  for (const [key, val] of Object.entries(post)) {
    const str = String(val || "");
    const preview = str.length > 200 ? str.substring(0, 200) + "..." : str;
    
    // Flags de conteúdo problemático
    const has18 = str.includes("18 de março");
    const has16 = str.includes("16 de março");
    const has28 = str.includes("28.123");
    const has23 = str.includes("23 de março");
    const has35 = str.includes("35.584");
    
    const flags = [];
    if (has18) flags.push("❌ 18/03");
    if (has16) flags.push("❌ 16/03");
    if (has28) flags.push("❌ R$28.123");
    if (has23) flags.push("✅ 23/03");
    if (has35) flags.push("✅ R$35.584");
    
    const flagStr = flags.length > 0 ? ` [${flags.join(", ")}]` : "";
    console.log(`📌 ${key}${flagStr}`);
    console.log(`   ${preview}\n`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
