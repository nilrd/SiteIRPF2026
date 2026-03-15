import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  // POST 4a — exibir bloco do h2 "Exemplo de Cálculo"
  const p4a = await prisma.blogPost.findFirst({
    where: { slug: "irpf-2026-5-alteracoes-que-voce-precisa-conhecer" },
    select: { id: true, content: true },
  });
  if (p4a) {
    const idx = p4a.content.indexOf("<h2>Exemplo de C");
    const end = p4a.content.indexOf("<h2>", idx + 10);
    console.log("=== POST 4a — bloco exemplo cálculo ===");
    console.log(JSON.stringify(p4a.content.slice(idx, end)));
    console.log("\n");
  }

  // POST 4b — exibir bloco da tabela com 24%
  const p4b = await prisma.blogPost.findFirst({
    where: { slug: "retificacao-irpf-como-fazer" },
    select: { id: true, content: true },
  });
  if (p4b) {
    const idx = p4b.content.indexOf("24%");
    const start = p4b.content.lastIndexOf("<table>", idx);
    const end = p4b.content.indexOf("</table>", idx) + 8;
    console.log("=== POST 4b — bloco tabela 24% ===");
    console.log(JSON.stringify(p4b.content.slice(start, end)));

    // também exibir o parágrafo anterior (contexto)
    const pStart = p4b.content.lastIndexOf("<p>", start);
    console.log("\n=== POST 4b — parágrafo contexto + tabela ===");
    console.log(JSON.stringify(p4b.content.slice(pStart, end)));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
