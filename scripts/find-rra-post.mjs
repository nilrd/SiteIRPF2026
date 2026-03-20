import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: {
      OR: [
        { slug: { contains: "rra" } },
        { slug: { contains: "rendimentos" } },
        { title: { contains: "RRA" } },
        { title: { contains: "Rendimentos Recebidos Acumuladamente" } },
        { content: { contains: "RRA" } },
      ],
    },
    select: { id: true, slug: true, title: true, published: true },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  if (!posts.length) {
    console.log("Nenhum post relacionado a RRA encontrado.");
    return;
  }

  posts.forEach((p) => {
    console.log(`${p.slug} | ${p.title} | published=${p.published}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
