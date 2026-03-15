import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const slugsToCheck = [
    "aposentadoria-inss-regras-pontuacao-2026",
    "prazo-declaracao-irpf-2026-ano-base-2025",
    "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026",
    "erros-declaracao-irpf-2026-receita-federal",
    "isencao-imposto-de-renda-2026",
    "mitos-sobre-irpf-2026-mmrg7wdc",
    "dicas-irpf-2026-malha-fina",
    "erros-declaracao-irpf-2026-desconhecidos",
    "irpf-2026-5-alteracoes-que-voce-precisa-conhecer",
    "retificacao-irpf-como-fazer",
  ];

  console.log("=== ESTADO ATUAL DOS POSTS ===\n");
  for (const slug of slugsToCheck) {
    const p = await prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true, slug: true, published: true, updatedAt: true, content: true },
    });
    if (!p) {
      console.log(`❌ NÃO EXISTE: ${slug}`);
    } else {
      const icon = p.published ? "✅ PUBLISHED" : "⚠️  UNPUBLISHED";
      console.log(`${icon} | ${slug}`);
      console.log(`   ID: ${p.id} | Updated: ${p.updatedAt.toISOString().slice(0, 10)}`);
      if (slug === "prazo-declaracao-irpf-2026-ano-base-2025") {
        const ok16 = p.content.includes("16 de março");
        const ok30 = p.content.includes("30 de maio");
        const ok33 = p.content.includes("33.888");
        console.log(`   Edições datas/valores: 16/03=${ok16}, 30/05=${ok30}, 33888=${ok33}`);
      }
    }
  }

  console.log("\n=== TODOS OS POSTS PUBLISHED NO BANCO ===\n");
  const allPub = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, title: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
  allPub.forEach(p => console.log(`  ✅ ${p.slug}`));

  console.log("\n=== POSTS UNPUBLISHED NO BANCO ===\n");
  const allUnpub = await prisma.blogPost.findMany({
    where: { published: false },
    select: { slug: true, title: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
  allUnpub.forEach(p => console.log(`  ⚠️  ${p.slug}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
