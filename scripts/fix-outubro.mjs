import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const p = await prisma.blogPost.findFirst({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
    select: { id: true, faqsJson: true, summary: true },
  });
  if (!p) { console.log("não encontrado"); return; }

  // Print full faqsJson para ver os trechos com "outubro"
  const faqs = JSON.parse(p.faqsJson || "[]");
  faqs.forEach((f, i) => {
    if (f.question.includes("outubro") || f.answer.includes("outubro")) {
      console.log(`FAQ [${i}] Q: ${f.question}`);
      console.log(`FAQ [${i}] A: ${f.answer}`);
      console.log();
    }
  });

  // Aplicar substituições no faqsJson (troca todas variantes de "outubro de 2026" → "30 de setembro de 2026")
  let newFaqs = p.faqsJson
    .replaceAll("de junho a outubro de 2026", "de junho a 30 de setembro de 2026")
    .replaceAll("até outubro de 2026", "até 30 de setembro de 2026")
    .replaceAll("em outubro de 2026", "em 30 de setembro de 2026")
    .replaceAll(" outubro de 2026", " 30 de setembro de 2026")
    .replaceAll("outubro de 2026", "30 de setembro de 2026");

  // Verificar e salvar
  if (newFaqs !== p.faqsJson) {
    await prisma.blogPost.update({ where: { id: p.id }, data: { faqsJson: newFaqs } });
    console.log("✅ faqsJson corrigido (outubro → 30 de setembro)");
  } else {
    console.log("ℹ️ nenhuma variante de 'outubro de 2026' encontrada no faqsJson");
  }

  // Também verificar summary
  console.log("\nsummary atual:", p.summary);
}

main().catch(console.error).finally(() => prisma.$disconnect());
