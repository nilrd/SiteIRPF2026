import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, coverImage: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: { slug: true, coverImage: true, imageAttribution: true },
  });

  for (const p of posts) {
    console.log("slug:", p.slug);
    console.log("coverImage:", p.coverImage);
    console.log("imageAttribution:", p.imageAttribution);
    console.log("---");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
