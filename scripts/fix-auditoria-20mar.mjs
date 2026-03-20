import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const TARGET_SLUGS = [
  "prazo-declaracao-irpf-2026-ano-base-2025",
  "erros-declaracao-irpf-2026-receita-federal",
  "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026",
];

const RRA_SLUG = "rendimentos-recebidos-acumuladamente-rra-imposto-de-renda";

function normalizeDeadlinesInContent(content) {
  let c = content;

  // Pedido explícito do usuário (variações alvo)
  c = c.replaceAll("18 de março a 29 de maio", "23 de março a 30 de maio");
  c = c.replaceAll("R$ 28.123,91", "R$ 35.584,00");
  c = c.replaceAll("terminando em outubro de 2026", "terminando em 30 de setembro de 2026");
  c = c.replaceAll("29 de maio de 2026", "30 de maio de 2026");

  // Padronização global pedida: qualquer variação 16/03, 18/03, 16 de março -> prazo correto completo
  c = c.replaceAll("16 de março a 30 de maio de 2026", "23 de março a 30 de maio de 2026");
  c = c.replaceAll("16 de março de 2026 a 30 de maio de 2026", "23 de março a 30 de maio de 2026");
  c = c.replaceAll("18 de março a 30 de maio de 2026", "23 de março a 30 de maio de 2026");
  c = c.replaceAll("18 de março de 2026 a 30 de maio de 2026", "23 de março a 30 de maio de 2026");
  c = c.replaceAll("16/03/2026 a 30/05/2026", "23/03/2026 a 30/05/2026");
  c = c.replaceAll("18/03/2026 a 30/05/2026", "23/03/2026 a 30/05/2026");

  // Casos de frase com início isolado, mantendo contexto coerente
  c = c.replaceAll("início em 16 de março de 2026", "início em 23 de março de 2026");
  c = c.replaceAll("início em 18 de março de 2026", "início em 23 de março de 2026");
  c = c.replaceAll("começa em 16 de março de 2026", "começa em 23 de março de 2026");
  c = c.replaceAll("começa em 18 de março de 2026", "começa em 23 de março de 2026");
  c = c.replaceAll("em 16 de março de 2026", "em 23 de março de 2026");
  c = c.replaceAll("em 18 de março de 2026", "em 23 de março de 2026");

  return c;
}

function ensureRraMechanicsParagraph(content) {
  const marker = "dividindo o total pelo número de meses";
  if (content.toLowerCase().includes(marker.toLowerCase())) {
    return { content, inserted: false };
  }

  const paragraph =
    `<p><strong>Mecânica correta do cálculo do RRA:</strong> no regime de tributação exclusiva na fonte para Rendimentos Recebidos Acumuladamente (RRA), o cálculo considera a quantidade de meses a que os valores se referem. Primeiro, divide-se o valor total recebido acumuladamente pelo número de meses do período. Em seguida, aplica-se a tabela progressiva mensal sobre esse valor mensal apurado. Por fim, multiplica-se o imposto encontrado pelo mesmo número de meses para chegar ao imposto total do RRA.</p>`;

  // tenta inserir após primeiro H2, mantendo fluidez do artigo
  const h2Index = content.search(/<h2[^>]*>/i);
  if (h2Index !== -1) {
    const h2Close = content.indexOf("</h2>", h2Index);
    if (h2Close !== -1) {
      const insertAt = h2Close + 5;
      return {
        content: content.slice(0, insertAt) + paragraph + content.slice(insertAt),
        inserted: true,
      };
    }
  }

  // fallback: adiciona no começo
  return { content: paragraph + content, inserted: true };
}

async function main() {
  console.log("=== FIX 1 + FIX 2: updates no campo renderizado (content) ===");

  for (const slug of TARGET_SLUGS) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, slug: true, content: true },
    });

    if (!post) {
      console.log(`❌ Não encontrado: ${slug}`);
      continue;
    }

    const newContent = normalizeDeadlinesInContent(post.content)
      // regra extra para substituir ocorrência simples de "16 de março" nos posts afetados
      .replaceAll("16 de março de 2026", "23 de março de 2026");

    const changed = newContent !== post.content;
    if (changed) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: newContent } });
      console.log(`✅ Atualizado content: ${slug}`);
    } else {
      console.log(`✓ Sem mudanças necessárias: ${slug}`);
    }
  }

  console.log("\n=== FIX 3: inserir mecânica real do RRA no content ===");
  const rra = await prisma.blogPost.findUnique({
    where: { slug: RRA_SLUG },
    select: { id: true, content: true },
  });

  if (!rra) {
    console.log(`❌ Post RRA não encontrado: ${RRA_SLUG}`);
  } else {
    const { content, inserted } = ensureRraMechanicsParagraph(rra.content);
    if (inserted) {
      await prisma.blogPost.update({ where: { id: rra.id }, data: { content } });
      console.log("✅ Parágrafo mecânico de RRA inserido no content");
    } else {
      console.log("✓ Parágrafo mecânico de RRA já estava presente");
    }
  }

  console.log("\n=== SELECT DE CONFIRMAÇÃO (campo renderizado: content) ===");
  const confirm = await prisma.blogPost.findUnique({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
    select: { content: true, updatedAt: true },
  });

  if (!confirm) {
    console.log("❌ Post prazo-declaracao não encontrado na confirmação");
  } else {
    const plain = confirm.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log("updatedAt:", confirm.updatedAt.toISOString());
    console.log("tem '23 de março a 30 de maio'?", /23 de março a 30 de maio/.test(confirm.content));
    console.log("tem 'R$ 35.584,00'?", /R\$ 35\.584,00/.test(confirm.content));
    console.log("tem 'terminando em 30 de setembro de 2026'?", /terminando em 30 de setembro de 2026/.test(confirm.content));
    console.log("trecho:", plain.slice(0, 520));
  }

  const confirmRra = await prisma.blogPost.findUnique({
    where: { slug: RRA_SLUG },
    select: { content: true, updatedAt: true },
  });

  if (confirmRra) {
    console.log("\nRRA updatedAt:", confirmRra.updatedAt.toISOString());
    console.log(
      "RRA mecânica presente?",
      /divide-se o valor total recebido acumuladamente pelo número de meses/i.test(confirmRra.content)
    );
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
