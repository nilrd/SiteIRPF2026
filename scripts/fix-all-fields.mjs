/**
 * fix-all-fields.mjs
 *
 * Corrige TODOS OS CAMPOS que contêm datas/valores errados:
 *   - content  (já parcialmente corrigido — re-aplica para garantia)
 *   - summary  (exibido como parágrafo de destaque no topo do post e em metatags)
 *   - metaDesc (meta description)
 *   - metaTitle (meta title)
 *   - faqsJson (perguntas e respostas do accordion de FAQs)
 *
 * Tabela de substituições (idempotente — só altera se encontrar o padrão):
 *   18 de março → 16 de março
 *   29 de maio  → 30 de maio
 *   18/03/2026  → 16/03/2026
 *   29/05/2026  → 30/05/2026
 *   outubro de 2026 (contexto de restituição) → 30 de setembro de 2026
 *   R$ 28.123,91 → R$ 33.888,00
 *   todos devem declarar → quem recebeu acima de R$ 33.888,00 deve declarar
 *
 * Aplica para TODOS os posts publicados (scan global).
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

// Pares de substituição na ordem de especificidade (mais específico primeiro)
const REPLACEMENTS = [
  ["18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
  ["18 de março de 2026 a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
  ["18/03/2026 a 29/05/2026", "16/03/2026 a 30/05/2026"],
  ["18/03/2026", "16/03/2026"],
  ["18 de março", "16 de março"],
  ["29 de maio de 2026", "30 de maio de 2026"],
  ["29/05/2026", "30/05/2026"],
  ["29 de maio", "30 de maio"],
  ["de junho a outubro de 2026", "de junho a 30 de setembro de 2026"],
  ["o último para outubro de 2026", "o último para 30 de setembro de 2026"],
  ["último lote em outubro de 2026", "último lote em 30 de setembro de 2026"],
  ["último lote em outubro", "último lote em 30 de setembro"],
  [", terminando em outubro de 2026", ", terminando em 30 de setembro de 2026"],
  ["R$ 28.123,91", "R$ 33.888,00"],
  ["R$28.123,91", "R$ 33.888,00"],
  ["acima de R$ 28.123", "acima de R$ 33.888"],
  ["renda superior a R$ 28.123", "renda superior a R$ 33.888"],
  ["rendimentos acima de R$ 28.123", "rendimentos acima de R$ 33.888"],
  ["todos os contribuintes devem declarar", "contribuintes com rendimentos acima de R$ 33.888,00 devem declarar"],
  ["todos devem declarar o IRPF", "quem recebeu acima de R$ 33.888,00 deve declarar o IRPF"],
];

function applyReplacements(text) {
  if (!text) return { text, changed: false, applied: [] };
  let result = text;
  const applied = [];
  for (const [from, to] of REPLACEMENTS) {
    if (result.includes(from)) {
      result = result.replaceAll(from, to);
      applied.push(`  "${from}" → "${to}"`);
    }
  }
  return { text: result, changed: applied.length > 0, applied };
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      content: true,
      summary: true,
      metaDesc: true,
      metaTitle: true,
      faqsJson: true,
    },
  });

  console.log(`Verificando ${posts.length} posts publicados...\n`);

  let totalUpdated = 0;

  for (const post of posts) {
    const fields = {};
    const allApplied = [];

    const content   = applyReplacements(post.content);
    const summary   = applyReplacements(post.summary);
    const metaDesc  = applyReplacements(post.metaDesc);
    const metaTitle = applyReplacements(post.metaTitle);
    const faqsJson  = applyReplacements(post.faqsJson);

    if (content.changed)   { fields.content   = content.text;   allApplied.push(...content.applied.map(a => `  [content]   ${a}`)); }
    if (summary.changed)   { fields.summary   = summary.text;   allApplied.push(...summary.applied.map(a => `  [summary]   ${a}`)); }
    if (metaDesc.changed)  { fields.metaDesc  = metaDesc.text;  allApplied.push(...metaDesc.applied.map(a => `  [metaDesc]  ${a}`)); }
    if (metaTitle.changed) { fields.metaTitle = metaTitle.text; allApplied.push(...metaTitle.applied.map(a => `  [metaTitle] ${a}`)); }
    if (faqsJson.changed)  { fields.faqsJson  = faqsJson.text;  allApplied.push(...faqsJson.applied.map(a => `  [faqsJson]  ${a}`)); }

    if (Object.keys(fields).length > 0) {
      await prisma.blogPost.update({ where: { id: post.id }, data: fields });
      totalUpdated++;
      console.log(`✅ ATUALIZADO: ${post.slug}`);
      allApplied.forEach(a => console.log(a));
      console.log();
    } else {
      console.log(`✓ OK: ${post.slug}`);
    }
  }

  console.log(`\n==========================================`);
  console.log(`Total: ${totalUpdated} posts atualizados de ${posts.length}`);
  console.log(`==========================================\n`);

  // SELECT de verificação no post principal
  const verify = await prisma.blogPost.findFirst({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
    select: { summary: true, metaDesc: true, faqsJson: true, content: true },
  });

  if (verify) {
    const check = (label, text) => {
      const ok16 = text?.includes("16 de março") || text?.includes("16/03");
      const bad18 = text?.includes("18 de março") || text?.includes("18/03");
      const ok30m = text?.includes("30 de maio") || text?.includes("30/05");
      const bad29m = text?.includes("29 de maio") || text?.includes("29/05");
      const badOct = text?.includes("outubro de 2026") && !text?.includes("30 de setembro");
      console.log(`  ${label}:`);
      console.log(`    16 de março presente: ${ok16 ? "✅" : "—"} | 18 de março presente: ${bad18 ? "❌ PROBLEMA" : "✅ ausente"}`);
      console.log(`    30 de maio presente:  ${ok30m ? "✅" : "—"} | 29 de maio presente:  ${bad29m ? "❌ PROBLEMA" : "✅ ausente"}`);
      if (badOct) console.log(`    ❌ "outubro de 2026" ainda presente (sem "30 de setembro")`);
    };
    console.log("VERIFICAÇÃO — prazo-declaracao-irpf-2026-ano-base-2025:");
    check("summary  ", verify.summary);
    check("metaDesc ", verify.metaDesc);
    check("content  ", verify.content.slice(0, 2000));

    // FAQs
    try {
      const faqs = JSON.parse(verify.faqsJson || "[]");
      const faqText = faqs.map(f => `${f.question} ${f.answer}`).join(" ");
      check("faqsJson ", faqText);
    } catch {
      console.log("  faqsJson: erro ao parsear");
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
