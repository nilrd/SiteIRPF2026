import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Verificar se posts 4 e 5 já foram corrigidos
  const p4 = await prisma.blogPost.findFirst({
    where: { slug: "erros-declaracao-irpf-2026-receita-federal" },
    select: { id: true, content: true },
  });
  const p5 = await prisma.blogPost.findFirst({
    where: { slug: "isencao-imposto-de-renda-2026" },
    select: { id: true, content: true },
  });
  const p4has18 = p4?.content.includes("18 de março a 29 de maio");
  const p5hasErro = p5?.content.includes("não precisará pagar IR sobre seu rendimento.");
  console.log("Post 4 ainda tem '18 de março a 29 de maio'?", p4has18);
  console.log("Post 5 ainda tem exemplo errado?", p5hasErro);

  if (p4 && p4has18) {
    const c4 = p4.content
      .replaceAll("18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026")
      .replaceAll("o último para outubro de 2026", "o último para 30 de setembro de 2026")
      .replaceAll("de junho a outubro de 2026", "de junho a 30 de setembro de 2026");
    await prisma.blogPost.update({ where: { id: p4.id }, data: { content: c4 } });
    console.log("✅ POST 4 — EDITADO");
  } else {
    console.log("✅ POST 4 — já estava correto ou não encontrado");
  }

  if (p5 && p5hasErro) {
    const exemploErrado = "Suponha que um contribuinte tenha um rendimento mensal de R$ 4.000. De acordo com a tabela do IRPF 2026, esse contribuinte estaria na faixa de 22,5% de alíquota, com dedução de R$ 675,49. No entanto, com a nova faixa de isenção, esse contribuinte poderá se beneficiar da dedução especial e não precisará pagar IR sobre seu rendimento.";
    const exemploCorreto = "Suponha que um contribuinte tenha um rendimento mensal de <strong>R$ 4.000</strong>. Pela tabela progressiva do IRPF 2026, esse valor está na faixa de <strong>22,5%</strong>. Cálculo do IR base: (R$ 4.000 × 22,5%) − R$ 675,49 = <strong>R$ 224,51</strong>. Com a aplicação da <strong>dedução complementar especial da Lei 15.270/2025</strong> (R$ 1.571,19), o imposto líquido resulta em <strong>zero</strong>. Isso é a chamada \"isenção efetiva\" — não uma isenção automática, mas imposto zero viabilizado pela dedução legal. <em>Importante:</em> este efeito se aplica no modelo de tributação com o desconto simplificado; no modelo completo, o cálculo leva em conta todas as deduções individuais do contribuinte.";
    const c5 = p5.content.replaceAll(exemploErrado, exemploCorreto);
    await prisma.blogPost.update({ where: { id: p5.id }, data: { content: c5 } });
    console.log("✅ POST 5 — EDITADO");
  } else {
    console.log("✅ POST 5 — já estava correto ou não encontrado");
  }

  console.log("🏁 Concluído.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

async function main() {

  // =========================================================
  // POST 1 — EXCLUIR: aposentadoria-inss-regras-pontuacao-2026
  // Motivo: fórmula inventada + tabela de pontuação falsa + fora do escopo IRPF
  // =========================================================
  const del = await prisma.blogPost.deleteMany({
    where: { slug: "aposentadoria-inss-regras-pontuacao-2026" },
  });
  console.log(`✅ POST 1 — EXCLUÍDO: ${del.count} registro(s) deletado(s).`);


  // =========================================================
  // POST 2 — EDITAR: prazo-declaracao-irpf-2026-ano-base-2025
  // Correções: 18/03→16/03, 29/05→30/05, outubro→30/09, R$28.123,91→R$33.888,00
  // =========================================================
  const post2 = await prisma.blogPost.findFirst({
    where: { slug: "prazo-declaracao-irpf-2026-ano-base-2025" },
    select: { id: true, content: true },
  });
  if (post2) {
    const c2 = post2.content
      // Prazo: 18 de março a 29 de maio → 16 de março a 30 de maio (todas ocorrências)
      .replaceAll("18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026")
      // Restituições: outubro → 30 de setembro
      .replaceAll("terminando em outubro de 2026", "terminando em 30 de setembro de 2026")
      .replaceAll("de junho a outubro de 2026", "de junho a 30 de setembro de 2026")
      // Obrigatoriedade: valor inventado → valor oficial
      .replaceAll(
        "rendimentos superiores a R$ 28.123,91 no ano-base 2025",
        "rendimentos tributáveis acima de <strong>R$ 33.888,00</strong> no ano-base 2025 (Fonte: Receita Federal / IN RFB 2.255/2025)"
      );
    await prisma.blogPost.update({ where: { id: post2.id }, data: { content: c2 } });
    console.log("✅ POST 2 — EDITADO: prazo-declaracao-irpf-2026-ano-base-2025");
  } else {
    console.log("⚠️  POST 2 — NÃO ENCONTRADO: prazo-declaracao-irpf-2026-ano-base-2025");
  }


  // =========================================================
  // POST 3 — EDITAR: irpf-2026-o-que-muda-no-imposto-de-renda-em-2026
  // Correções: prazo "não divulgado" + obrigatoriedade "todos"
  // =========================================================
  const post3 = await prisma.blogPost.findFirst({
    where: { slug: "irpf-2026-o-que-muda-no-imposto-de-renda-em-2026" },
    select: { id: true, content: true },
  });
  if (post3) {
    const c3 = post3.content
      // Prazo não divulgado → prazo oficial
      .replaceAll(
        "O prazo para a declaração do IRPF 2026 ainda não foi divulgado.",
        "Prazo oficial: <strong>16 de março a 30 de maio de 2026</strong> (IN RFB 2.255/2025)."
      )
      // Obrigatoriedade absoluta → limite correto
      .replaceAll(
        "Todas as pessoas físicas que receberam rendimentos em 2025 devem declarar o IRPF 2026. Isso inclui empregados, autônomos, aposentados e pensionistas.",
        "São obrigados a declarar o IRPF 2026 os contribuintes que, em 2025, receberam <strong>rendimentos tributáveis acima de R$ 33.888,00</strong>, rendimentos isentos acima de R$ 200.000,00, ou possuíam bens acima de R$ 800.000,00 em 31/12/2025, entre outros critérios. Empregados, autônomos, aposentados e investidores podem ou não ser obrigados, dependendo de seus rendimentos. Verifique sua situação em <a href=\"https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda\" target=\"_blank\" rel=\"noopener noreferrer\">gov.br/receitafederal</a>."
      );
    await prisma.blogPost.update({ where: { id: post3.id }, data: { content: c3 } });
    console.log("✅ POST 3 — EDITADO: irpf-2026-o-que-muda-no-imposto-de-renda-em-2026");
  } else {
    console.log("⚠️  POST 3 — NÃO ENCONTRADO: irpf-2026-o-que-muda-no-imposto-de-renda-em-2026");
  }


  // =========================================================
  // POST 4 — EDITAR: erros-declaracao-irpf-2026-receita-federal
  // Correções: 18/03→16/03, 29/05→30/05, outubro→30/09 (todas ocorrências)
  // =========================================================
  const post4 = await prisma.blogPost.findFirst({
    where: { slug: "erros-declaracao-irpf-2026-receita-federal" },
    select: { id: true, content: true, metaTitle: true, metaDesc: true },
  });
  if (post4) {
    const c4 = post4.content
      .replaceAll("18 de março a 29 de maio de 2026", "16 de março a 30 de maio de 2026")
      .replaceAll("o último para outubro de 2026", "o último para 30 de setembro de 2026")
      .replaceAll("de junho a outubro de 2026", "de junho a 30 de setembro de 2026");

    // Corrigir também o metaTitle se tiver "18 de março"
    const newMeta = (post4.metaTitle || "").replaceAll("18 de março", "16 de março");

    await prisma.blogPost.update({
      where: { id: post4.id },
      data: { content: c4, metaTitle: newMeta || undefined },
    });
    console.log("✅ POST 4 — EDITADO: erros-declaracao-irpf-2026-receita-federal");
  } else {
    console.log("⚠️  POST 4 — NÃO ENCONTRADO: erros-declaracao-irpf-2026-receita-federal");
  }


  // =========================================================
  // POST 5 — EDITAR: isencao-imposto-de-renda-2026
  // Correção: exemplo de cálculo enganoso → mecânica correta da dedução especial
  // =========================================================
  const post5 = await prisma.blogPost.findFirst({
    where: { slug: "isencao-imposto-de-renda-2026" },
    select: { id: true, content: true },
  });
  if (post5) {
    const exemploErrado =
      "Suponha que um contribuinte tenha um rendimento mensal de R$ 4.000. De acordo com a tabela do IRPF 2026, esse contribuinte estaria na faixa de 22,5% de alíquota, com dedução de R$ 675,49. No entanto, com a nova faixa de isenção, esse contribuinte poderá se beneficiar da dedução especial e não precisará pagar IR sobre seu rendimento.";

    const exemploCorreto =
      `Suponha que um contribuinte tenha um rendimento mensal de <strong>R$ 4.000</strong>. Pela tabela progressiva do IRPF 2026, esse valor está na faixa de <strong>22,5%</strong>. Cálculo do IR base: (R$ 4.000 × 22,5%) − R$ 675,49 = <strong>R$ 224,51</strong>. Com a aplicação da <strong>dedução complementar especial da Lei 15.270/2025</strong> (R$ 1.571,19), o imposto líquido resulta em <strong>zero</strong>. Isso é a chamada "isenção efetiva" — não uma isenção automática, mas imposto zero viabilizado pela dedução legal. <em>Importante:</em> este efeito se aplica no modelo de tributação com o desconto simplificado; no modelo completo, o cálculo leva em conta todas as deduções individuais do contribuinte.`;

    const c5 = post5.content.replaceAll(exemploErrado, exemploCorreto);
    await prisma.blogPost.update({ where: { id: post5.id }, data: { content: c5 } });
    console.log("✅ POST 5 — EDITADO: isencao-imposto-de-renda-2026");
  } else {
    console.log("⚠️  POST 5 — NÃO ENCONTRADO: isencao-imposto-de-renda-2026");
  }


  console.log("\n🏁 Script concluído.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

