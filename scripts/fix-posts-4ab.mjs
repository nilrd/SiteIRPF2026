import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

// ============================================================
// CORREÇÃO POST 4a: irpf-2026-5-alteracoes-que-voce-precisa-conhecer
//   ERRO: cálculo aplica 22,5% sobre valor excedente ANUAL
//         comparado com limite de faixa MENSAL (R$3.751,05).
//         Resultado R$9.943,85 está ~9x acima do valor correto.
//   FIX:  Substituir pela explicação e cálculo PROGRESSIVO correto
//         usando faixas ANUAIS (mensais × 12).
//         Para renda tributável de R$38.000/ano:
//           Faixa isenta (até R$27.110,40):     R$0,00
//           Faixa 7,5%  (R$27.110,40–33.919,80): R$510,71
//           Faixa 15%   (R$33.919,80–38.000,00): R$612,03
//           TOTAL:                               R$1.122,74
//
// CORREÇÃO POST 4b: retificacao-irpf-como-fazer
//   ERRO: tabela usa alíquota 24% (não existe na tabela IRPF)
//         E aplica alíquota única sobre todo o valor (não progressivo)
//   FIX:  Remover tabela + parágrafo errado; substituir por
//         explicação correta sem inventar alíquiota inválida
// ============================================================

const ERRO_4A =
  "<h2>Exemplo de Cálculo do IRPF 2026</h2>" +
  "<p>Vamos considerar um exemplo para entender melhor como funciona o cálculo do IRPF 2026. " +
  "Suponha que um contribuinte tenha uma renda mensal de R$ 4.000,00. " +
  "<ul><li>Renda mensal: R$ 4.000,00</li>" +
  "<li>Renda anual: R$ 48.000,00</li>" +
  "<li>Despesas dedutíveis: R$ 10.000,00 (despesas médicas, educação, etc.)</li>" +
  "<li>Renda tributável: R$ 38.000,00 (R$ 48.000,00 - R$ 10.000,00)</li></ul>" +
  "Com base na tabela progressiva, o contribuinte estaria na faixa de 15% a 22,5%. " +
  "O cálculo do IRPF seria: " +
  "<ul><li>15% sobre R$ 3.751,05 (limite da faixa anterior): R$ 562,66</li>" +
  "<li>22,5% sobre o valor excedente (R$ 38.000,00 - R$ 3.751,05): R$ 9.381,19</li>" +
  "<li>IRPF total: R$ 9.943,85 (R$ 562,66 + R$ 9.381,19)</li></ul></p>";

const FIX_4A =
  "<h2>Como Funciona o Cálculo Progressivo do IRPF 2026</h2>" +
  "<p>O IRPF 2026 usa a tabela <strong>progressiva</strong> — cada faixa de renda é " +
  "tributada <strong>apenas pela alíquota daquela faixa</strong>, nunca pelo total da " +
  "renda. Para calcular corretamente, converta as faixas mensais para anuais " +
  "(multiplique por 12) e aplique cada alíquota apenas ao trecho da renda que cai " +
  "naquela faixa.</p>" +
  "<p>Exemplo com renda tributável anual de <strong>R$ 38.000,00</strong> " +
  "(R$ 48.000,00 de renda bruta − R$ 10.000,00 em deduções):</p>" +
  "<ul>" +
  "<li><strong>Faixa isenta</strong> (até R$ 27.110,40/ano): R$ 0,00</li>" +
  "<li><strong>Faixa 7,5%</strong> (R$ 27.110,40 a R$ 33.919,80): " +
  "R$ 6.809,40 × 7,5% = <strong>R$ 510,71</strong></li>" +
  "<li><strong>Faixa 15%</strong> (R$ 33.919,80 a R$ 38.000,00): " +
  "R$ 4.080,20 × 15% = <strong>R$ 612,03</strong></li>" +
  "<li><strong>IRPF anual total: R$ 1.122,74</strong> " +
  "(alíquota efetiva de apenas 2,95%)</li>" +
  "</ul>" +
  "<p><em>Atenção: a alíquota indicada na tabela é a da <strong>faixa mais alta</strong> " +
  "que o rendimento atinge — não o percentual aplicado sobre toda a renda.</em></p>";

const ERRO_4B_BLOCO =
  "<p>Vamos considerar um exemplo de cálculo de imposto de renda para ilustrar a importância da retificação da declaração de IRPF. " +
  "Suponha que um contribuinte tenha uma renda bruta de R$ 50.000,00 e tenha declarado uma dedução de R$ 10.000,00. " +
  "No entanto, o contribuinte esqueceu de declarar uma renda adicional de R$ 5.000,00.</p>" +
  "<table><tr><th>Renda Bruta</th><th>Dedução</th><th>Imposto de Renda</th></tr>" +
  "<tr><td>R$ 50.000,00</td><td>R$ 10.000,00</td><td>R$ 12.000,00 (24% de R$ 50.000,00)</td></tr>" +
  "<tr><td>R$ 55.000,00 (R$ 50.000,00 + R$ 5.000,00)</td><td>R$ 10.000,00</td>" +
  "<td>R$ 13.750,00 (24% de R$ 55.000,00 - R$ 10.000,00)</td></tr></table>";

const FIX_4B_BLOCO =
  "<p>Exemplo: um contribuinte declarou renda bruta de <strong>R$ 50.000,00</strong> com " +
  "deduções de <strong>R$ 10.000,00</strong> (base de cálculo: R$ 40.000,00). " +
  "Ao descobrir que omitiu uma renda adicional de R$ 5.000,00, a declaração precisará " +
  "ser retificada: a renda bruta passa para R$ 55.000,00 e a base de cálculo para " +
  "<strong>R$ 45.000,00</strong>. O imposto adicional é calculado de forma " +
  "<strong>progressiva</strong> pelo programa da Receita Federal, aplicando as alíquotas " +
  "válidas (<strong>7,5%, 15%, 22,5% ou 27,5%</strong>) sobre cada faixa — nunca uma " +
  "alíquota única sobre toda a renda.</p>";

async function main() {
  // ----- POST 4a -----
  const p4a = await prisma.blogPost.findFirst({
    where: { slug: "irpf-2026-5-alteracoes-que-voce-precisa-conhecer" },
    select: { id: true, content: true },
  });

  if (!p4a) {
    console.log("❌ POST 4a não encontrado");
  } else if (!p4a.content.includes(ERRO_4A)) {
    console.log("ℹ️ POST 4a — bloco de erro não encontrado (talvez já corrigido ou texto diferente)");
    // fallback: procurar R$9.943,85
    if (p4a.content.includes("9.943,85")) {
      console.log("   → encontrado pelo valor R$9.943,85 — aplicando fallback");
      const idx = p4a.content.indexOf("<h2>Exemplo de C");
      const end = p4a.content.indexOf("<h2>", idx + 10);
      const novoContent = p4a.content.slice(0, idx) + FIX_4A + p4a.content.slice(end);
      await prisma.blogPost.update({ where: { id: p4a.id }, data: { content: novoContent } });
      console.log("   ✅ POST 4a — CORRIGIDO via fallback");
    }
  } else {
    const novoContent = p4a.content.replace(ERRO_4A, FIX_4A);
    await prisma.blogPost.update({ where: { id: p4a.id }, data: { content: novoContent } });
    console.log("✅ POST 4a — cálculo progressivo corrigido");
  }

  // ----- POST 4b -----
  const p4b = await prisma.blogPost.findFirst({
    where: { slug: "retificacao-irpf-como-fazer" },
    select: { id: true, content: true },
  });

  if (!p4b) {
    console.log("❌ POST 4b não encontrado");
  } else if (!p4b.content.includes(ERRO_4B_BLOCO)) {
    console.log("ℹ️ POST 4b — bloco de erro não encontrado (talvez já corrigido ou texto diferente)");
    if (p4b.content.includes("24%")) {
      console.log("   → 24% ainda presente. Aplicando substituição por faixas");
      const newC = p4b.content
        .replaceAll("24%", "alíquota progressiva (7,5%, 15%, 22,5% ou 27,5%)")
        .replaceAll("(24% de R$ 50.000,00)", "(calculado de forma progressiva)")
        .replaceAll("(24% de R$ 55.000,00 - R$ 10.000,00)", "(calculado de forma progressiva)");
      await prisma.blogPost.update({ where: { id: p4b.id }, data: { content: newC } });
      console.log("   ✅ POST 4b — 24% substituído");
    }
  } else {
    const novoContent = p4b.content.replace(ERRO_4B_BLOCO, FIX_4B_BLOCO);
    await prisma.blogPost.update({ where: { id: p4b.id }, data: { content: novoContent } });
    console.log("✅ POST 4b — tabela 24% removida e substituída por explicação correta");
  }

  // ----- VERIFICAÇÃO FINAL -----
  console.log("\n=== VERIFICAÇÃO FINAL ===");
  const v4a = await prisma.blogPost.findFirst({
    where: { slug: "irpf-2026-5-alteracoes-que-voce-precisa-conhecer" },
    select: { content: true },
  });
  const v4b = await prisma.blogPost.findFirst({
    where: { slug: "retificacao-irpf-como-fazer" },
    select: { content: true },
  });

  console.log(`POST 4a — ainda tem R$9.943,85? ${v4a?.content.includes("9.943,85") ? "❌ SIM (problema)" : "✅ NÃO"}`);
  console.log(`POST 4a — tem cálculo progressivo correto? ${v4a?.content.includes("R$ 1.122,74") ? "✅ SIM" : "❌ NÃO"}`);
  console.log(`POST 4b — ainda tem 24%? ${v4b?.content.includes("24%") ? "❌ SIM (problema)" : "✅ NÃO"}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
