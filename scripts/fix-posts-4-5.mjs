import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const p4 = await prisma.blogPost.findFirst({
    where: { slug: "erros-declaracao-irpf-2026-receita-federal" },
    select: { content: true },
  });
  const p5 = await prisma.blogPost.findFirst({
    where: { slug: "isencao-imposto-de-renda-2026" },
    select: { content: true },
  });

  console.log("=== POST 4 — início do content ===");
  console.log(p4?.content.slice(0, 400));
  console.log("\n=== POST 5 — trecho do cálculo ===");
  const idx = p5?.content.indexOf("Suponha que um contribuinte") ?? -1;
  console.log(p5?.content.slice(idx, idx + 600));
}

main().catch(console.error).finally(() => prisma.$disconnect());
