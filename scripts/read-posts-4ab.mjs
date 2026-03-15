import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

// ============================================================
// Script de diagnóstico + correção de posts 4a e 4b
// 4a: irpf-2026-5-alteracoes-que-voce-precisa-conhecer
//     — cálculo aplica alíquota única sobre todo o valor (errado)
// 4b: retificacao-irpf-como-fazer
//     — tabela usa 24% (não existe na tabela IRPF)
// ============================================================

async function main() {
  // -------- POST 4a --------
  const p4a = await prisma.blogPost.findFirst({
    where: { slug: "irpf-2026-5-alteracoes-que-voce-precisa-conhecer" },
    select: { id: true, content: true, published: true },
  });

  if (!p4a) {
    console.log("❌ POST 4a não encontrado");
  } else {
    console.log(`POST 4a published=${p4a.published}`);
    // Procurar a seção do cálculo problemático
    const idx = Math.max(
      p4a.content.indexOf("22,5%"),
      p4a.content.indexOf("22.5%"),
      p4a.content.indexOf("cálculo"),
      p4a.content.indexOf("calculo"),
    );
    const start = Math.max(0, idx - 200);
    console.log("--- Trecho do cálculo ---");
    console.log(p4a.content.slice(start, start + 800));
    console.log("---\n");
  }

  // -------- POST 4b --------
  const p4b = await prisma.blogPost.findFirst({
    where: { slug: "retificacao-irpf-como-fazer" },
    select: { id: true, content: true, published: true },
  });

  if (!p4b) {
    console.log("❌ POST 4b não encontrado");
  } else {
    console.log(`POST 4b published=${p4b.published}`);
    // Procurar a tabela com 24%
    const idx = p4b.content.indexOf("24%");
    if (idx === -1) {
      console.log("ℹ️ Nenhuma ocorrência de 24% encontrada no post 4b");
    } else {
      const start = Math.max(0, idx - 300);
      console.log("--- Trecho com 24% ---");
      console.log(p4b.content.slice(start, start + 1000));
      console.log("---\n");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
