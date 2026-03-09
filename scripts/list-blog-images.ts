/**
 * Script: list-blog-images.ts
 * Lista todos os posts com suas coverImages atuais
 * Executar: npx tsx scripts/list-blog-images.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, title: true, coverImage: true },
    orderBy: { createdAt: "asc" },
  });
  for (const p of posts) {
    console.log(`slug: ${p.slug}`);
    console.log(`  title: ${p.title}`);
    console.log(`  coverImage: ${p.coverImage}`);
    console.log("");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
