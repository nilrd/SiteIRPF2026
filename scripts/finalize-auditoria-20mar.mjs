import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const prazoSlug = "prazo-declaracao-irpf-2026-ano-base-2025";
const slugs = [
  prazoSlug,
  "erros-declaracao-irpf-2026-receita-federal",
  "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026",
  "rendimentos-recebidos-acumuladamente-rra-imposto-de-renda",
];

async function main() {
  const prazo = await prisma.blogPost.findUnique({
    where: { slug: prazoSlug },
    select: { id: true, content: true },
  });

  if (!prazo) {
    console.log("❌ Post de prazo não encontrado");
    return;
  }

  let c = prazo.content;

  // Garantir valor de obrigatoriedade no corpo renderizado
  if (!/R\$ 35\.584,00/.test(c)) {
    const marker = "Para aqueles que estão obrigados a declarar";
    const insert = "<p>Em 2026, entre os principais critérios de obrigatoriedade, está o recebimento de rendimentos tributáveis acima de <strong>R$ 35.584,00</strong> no ano-base 2025.</p>";

    if (c.includes(marker)) {
      c = c.replace(marker, `${insert}${marker}`);
    } else {
      c += insert;
    }

    await prisma.blogPost.update({ where: { id: prazo.id }, data: { content: c } });
    console.log("✅ Inserido R$ 35.584,00 no content do post de prazo");
  } else {
    console.log("✓ R$ 35.584,00 já presente no content do post de prazo");
  }

  console.log("\n=== VERIFICAÇÃO FINAL DOS POSTS AFETADOS (campo content) ===");
  for (const slug of slugs) {
    const p = await prisma.blogPost.findUnique({
      where: { slug },
      select: { content: true, updatedAt: true },
    });
    if (!p) {
      console.log(`❌ ${slug}: não encontrado`);
      continue;
    }

    const checks = {
      has2330: /23 de março a 30 de maio de 2026|23\/03\/2026 a 30\/05\/2026/i.test(p.content),
      hasOld16: /16 de março|16\/03\/2026/i.test(p.content),
      hasOld18: /18 de março|18\/03\/2026/i.test(p.content),
      has35584: /R\$ 35\.584,00/.test(p.content),
      hasOutSep: /terminando em 30 de setembro de 2026/i.test(p.content),
      hasRraMechanics: /divide-se o valor total recebido acumuladamente pelo número de meses/i.test(p.content),
    };

    console.log(`\n${slug}`);
    console.log(" updatedAt:", p.updatedAt.toISOString());
    console.log(" prazo 23/30 presente:", checks.has2330);
    console.log(" ainda contém 16/03:", checks.hasOld16);
    console.log(" ainda contém 18/03:", checks.hasOld18);
    if (slug === prazoSlug) {
      console.log(" contém R$ 35.584,00:", checks.has35584);
      console.log(" contém 'terminando em 30 de setembro de 2026':", checks.hasOutSep);
      const plain = p.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const idx = plain.indexOf("R$ 35.584,00");
      const start = Math.max(0, idx - 120);
      const end = Math.min(plain.length, idx + 220);
      console.log(" trecho de prova:", plain.slice(start, end));
    }
    if (slug.includes("rra")) {
      console.log(" mecânica RRA presente:", checks.hasRraMechanics);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
