import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const slug = "irpf-2026-prazo-23-marco-29-maio-quem-deve-declarar";

async function main() {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { id: true, content: true, summary: true, faqsJson: true },
  });

  if (!post) {
    console.log("❌ Post não encontrado");
    return;
  }

  let content = post.content;
  let summary = post.summary || "";
  let faqsJson = post.faqsJson || "[]";

  // Remove afirmação que não está textual/explicitamente na matéria-base
  content = content.replaceAll(
    "multa mínima de <strong>R$ 165,74</strong> e possível bloqueio de regularidade fiscal até a entrega.",
    "multa mínima de <strong>R$ 165,74</strong> e valor máximo de 20% do imposto devido, conforme a regra divulgada."
  );

  content = content.replaceAll(
    "multa mínima de <strong>R$ 165,74</strong>, além de encargos legais.",
    "multa mínima de <strong>R$ 165,74</strong>, com teto de 20% do imposto devido."
  );

  summary = summary.replaceAll(
    "e evitar multa.",
    "e cumprir o prazo com segurança."
  );

  // FAQs ficam estritamente factuais
  try {
    const faqs = JSON.parse(faqsJson);
    const sanitized = Array.isArray(faqs)
      ? faqs.map((f) => ({ question: String(f.question || ""), answer: String(f.answer || "") }))
      : [];
    faqsJson = JSON.stringify(sanitized);
  } catch {
    faqsJson = "[]";
  }

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { content, summary, faqsJson },
  });

  console.log("✅ Post higienizado para aderência factual à matéria-base");
}

main().catch(console.error).finally(() => prisma.$disconnect());
