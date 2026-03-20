import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const post = await prisma.blogPost.findUnique({
  where: { slug: "retificacao-irpf-como-fazer" },
  select: { id: true, slug: true, title: true, imageAlt: true, coverImage: true },
});

process.stdout.write(JSON.stringify(post, null, 2) + "\n");
await prisma.$disconnect();
