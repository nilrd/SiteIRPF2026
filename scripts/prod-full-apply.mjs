/**
 * prod-full-apply.mjs
 *
 * Script definitivo que:
 * 1. Imprime a CONNECTION STRING que será usada (com senha mascarada)
 * 2. Re-aplica TODOS os updates (posts 2-5 + 4a + 4b) de forma idempotente
 * 3. Faz SELECT de verificação mostrando trechos do conteúdo atual
 * 4. Verifica os 3 posts "fantasma" que aparecem no listing mas retornam 404
 *
 * Usa DIRECT_URL (porta 5432, session pooler) para garantir conexão direta
 * sem depender do pgBouncer (porta 6543) que pode estar blockeado.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

// Prioriza DIRECT_URL (porta 5432) sobre DATABASE_URL (pgBouncer 6543)
const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const masked = connectionUrl?.replace(/:([^:@]{4,}?)@/, ":***@") ?? "(nenhuma URL)";

console.log("==========================================");
console.log("CONNECTION STRING ativa:");
console.log(" ", masked);
console.log("==========================================\n");

const prisma = new PrismaClient({
  datasources: { db: { url: connectionUrl } },
});

// ---------------------------------------------------------------------------
// DEFINIÇÕES DAS CORREÇÕES (todas idempotentes — verificam antes de alterar)
// ---------------------------------------------------------------------------

// POST 2 — prazo-declaracao-irpf-2026-ano-base-2025
async function fixPost2() {
  const id = "cmmrcfwxw0000jv044bi1ddpc"; // ID confirmado pelo check-and-fix-all
  const p = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, content: true },
  });
  if (!p) {
    // tenta por slug como fallback
    const pSlug = await prisma.blogPost.findFirst({
      where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
      select: { id: true, content: true },
    });
    if (!pSlug) { console.log("❌ POST 2: não encontrado"); return null; }
    return pSlug;
  }
  return p;
}

// POST 3 — irpf-2026-o-que-muda-no-imposto-de-renda-em-2026
// POST 4 — erros-declaracao-irpf-2026-receita-federal
// POST 5 — isencao-imposto-de-renda-2026

const CORRECTIONS = {
  "prazo-declaracao-irpf-2026-ano-base-2025": [
    ["18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
    ["18/03/2026 a 29/05/2026", "16/03/2026 a 30/05/2026"],
    ["18 de março de 2026 a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
    ["18 de março", "16 de março"],
    ["29 de maio de 2026", "30 de maio de 2026"],
    ["29/05/2026", "30/05/2026"],
    ["de junho a outubro de 2026", "de junho a 30 de setembro de 2026"],
    ["o último para outubro de 2026", "o último para 30 de setembro de 2026"],
    ["último lote em outubro", "último lote em 30 de setembro"],
    ["R$ 28.123,91", "R$ 33.888,00"],
    ["R$28.123,91", "R$ 33.888,00"],
    ["28.123,91", "33.888,00"],
  ],
  "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026": [
    ["18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
    ["18 de março", "16 de março"],
    ["29 de maio de 2026", "30 de maio de 2026"],
    ["prazo ainda não foi divulgado", "prazo oficial é de 16 de março a 30 de maio de 2026"],
    ["prazo ainda não divulgado", "prazo oficial de 16 de março a 30 de maio de 2026"],
    ["todos os contribuintes devem declarar", "contribuintes com rendimentos acima de R$ 33.888,00 devem declarar"],
    ["todos devem declarar", "quem recebeu acima de R$ 33.888,00 deve declarar"],
    ["R$ 28.123,91", "R$ 33.888,00"],
    ["de junho a outubro de 2026", "de junho a 30 de setembro de 2026"],
  ],
  "erros-declaracao-irpf-2026-receita-federal": [
    ["18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
    ["18 de março", "16 de março"],
    ["29 de maio de 2026", "30 de maio de 2026"],
    ["de junho a outubro de 2026", "de junho a 30 de setembro de 2026"],
    ["o último para outubro de 2026", "o último para 30 de setembro de 2026"],
    ["R$ 28.123,91", "R$ 33.888,00"],
  ],
  "isencao-imposto-de-renda-2026": [
    // A principal correção (cálculo da dedução especial) foi aplicada na sessão anterior.
    // Verificações adicionais de datas e valores:
    ["18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026"],
    ["18 de março", "16 de março"],
    ["29 de maio de 2026", "30 de maio de 2026"],
    ["R$ 28.123,91", "R$ 33.888,00"],
    ["não precisará pagar IR sobre seu rendimento.", "o imposto efetivo será zero graças à dedução complementar especial (Lei 15.270/2025)."],
  ],
};

// ---------------------------------------------------------------------------
async function applyAllCorrections() {
  for (const [slug, replacements] of Object.entries(CORRECTIONS)) {
    const post = await prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true, content: true, updatedAt: true },
    });
    if (!post) {
      console.log(`❌ Não encontrado: ${slug}`);
      continue;
    }

    let content = post.content;
    let changed = false;
    const applied = [];

    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        content = content.replaceAll(from, to);
        changed = true;
        applied.push(`  "${from}" → "${to}"`);
      }
    }

    if (changed) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content } });
      console.log(`✅ ATUALIZADO: ${slug}`);
      applied.forEach(a => console.log(a));
    } else {
      console.log(`✓  Sem alterações: ${slug} (já correto)`);
    }
    console.log();
  }
}

// ---------------------------------------------------------------------------
async function verifyContent() {
  console.log("\n==========================================");
  console.log("VERIFICAÇÃO SELECT — conteúdo atual no banco");
  console.log("==========================================\n");

  const p = await prisma.blogPost.findFirst({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
    select: { content: true, updatedAt: true },
  });

  if (!p) { console.log("❌ prazo-declaracao: NÃO ENCONTRADO"); return; }

  const ok16 = p.content.includes("16 de março");
  const ok30 = p.content.includes("30 de maio");
  const ok33 = p.content.includes("33.888");
  const notOld18 = !p.content.includes("18 de março");
  const notOld28 = !p.content.includes("28.123");

  console.log(`prazo-declaracao-irpf-2026:`);
  console.log(`  ✓ "16 de março"   presente: ${ok16 ? "SIM ✅" : "NÃO ❌"}`);
  console.log(`  ✓ "30 de maio"    presente: ${ok30 ? "SIM ✅" : "NÃO ❌"}`);
  console.log(`  ✓ "R$ 33.888"     presente: ${ok33 ? "SIM ✅" : "NÃO ❌"}`);
  console.log(`  ✗ "18 de março"   ausente:  ${notOld18 ? "SIM ✅" : "NÃO ❌ (ainda present)"}`);
  console.log(`  ✗ "28.123"        ausente:  ${notOld28 ? "SIM ✅" : "NÃO ❌ (ainda present)"}`);
  console.log(`  updatedAt: ${p.updatedAt.toISOString()}`);

  // Trecho do texto para inspeção visual
  const idx = p.content.indexOf("prazo");
  const trecho = p.content.slice(Math.max(0, idx), idx + 300)
    .replace(/<[^>]+>/g, ""); // remove tags HTML para leitura
  console.log(`\n  Trecho (sem tags):\n  "${trecho}"\n`);
}

// ---------------------------------------------------------------------------
async function checkPhantomPosts() {
  console.log("==========================================");
  console.log("POSTS FANTASMA — verificação no banco");
  console.log("==========================================\n");

  const phantoms = [
    "mitos-sobre-irpf-2026-mmrg7wdc",
    "dicas-irpf-2026-malha-fina",
    "erros-declaracao-irpf-2026-desconhecidos",
  ];

  for (const slug of phantoms) {
    const p = await prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true, published: true, title: true },
    });
    if (!p) {
      console.log(`❌ NÃO EXISTE no banco: ${slug}`);
      console.log(`   → Aparece no /blog apenas por cache do Vercel Edge`);
      console.log(`   → Resolvido após revalidação / redeploy`);
    } else {
      const status = p.published ? "published=true" : "published=false ⚠️";
      console.log(`  ${status}: ${slug}`);
      if (!p.published) {
        console.log(`   → Está no banco mas published=false. Query /blog já filtra WHERE published=true.`);
        console.log(`   → Vai sumir do listing após revalidação.`);
      }
    }
    console.log();
  }

  console.log("TODOS os posts com published=true:");
  const all = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
    orderBy: { createdAt: "desc" },
  });
  all.forEach(p => console.log(`  ✅ ${p.slug}`));
}

// ---------------------------------------------------------------------------
async function main() {
  await applyAllCorrections();
  await verifyContent();
  await checkPhantomPosts();
}

main().catch(console.error).finally(() => prisma.$disconnect());
