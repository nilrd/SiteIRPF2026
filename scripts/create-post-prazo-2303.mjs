import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const slug = "irpf-2026-prazo-23-marco-29-maio-quem-deve-declarar";

const title = "IRPF 2026: prazo de 23 de março a 29 de maio — veja quem deve declarar e como evitar multa";

const summary =
  "A Receita Federal informou que o prazo do IRPF 2026 (ano-base 2025) vai de 23 de março a 29 de maio. Entenda quem é obrigado, quais documentos separar e como declarar com segurança para reduzir risco de malha fina.";

const content = `
<p>A Receita Federal informou que o prazo de entrega da declaração do <strong>IRPF 2026 (ano-base 2025)</strong> começa em <strong>23 de março</strong> e termina em <strong>29 de maio de 2026</strong>. Para quem está obrigado a declarar, atrasar a entrega pode gerar <strong>multa mínima de R$ 165,74</strong>, além de juros conforme a legislação.</p>

<div class="tldr-box" style="background:#f5f5f2;border-left:4px solid #2D4033;padding:16px 20px;margin:24px 0;">
<strong>Resumo rápido:</strong>
<ul>
<li><strong>Prazo oficial:</strong> 23/03/2026 a 29/05/2026.</li>
<li><strong>Obrigatoriedade:</strong> rendimentos tributáveis acima de <strong>R$ 35.584,00</strong> em 2025, entre outros critérios legais.</li>
<li><strong>Atraso:</strong> multa mínima de <strong>R$ 165,74</strong>, podendo chegar a 20% do imposto devido.</li>
</ul>
</div>

<h2>Quem deve declarar o IRPF 2026?</h2>
<p>De forma prática, precisam declarar em 2026 as pessoas que, em 2025, se enquadraram nos critérios da Receita Federal, como:</p>
<ul>
<li>rendimentos tributáveis acima de <strong>R$ 35.584,00</strong>;</li>
<li>rendimentos isentos, não tributáveis ou tributados exclusivamente na fonte acima de <strong>R$ 200 mil</strong>;</li>
<li>posse ou propriedade de bens e direitos acima de <strong>R$ 800 mil</strong> em 31/12/2025;</li>
<li>receita bruta de atividade rural superior a <strong>R$ 177.920,00</strong>;</li>
<li>operações em bolsa, ganho de capital e demais hipóteses previstas na norma.</li>
</ul>
<p>Se você tiver dúvida sobre o seu enquadramento, vale revisar com cuidado antes do fim do prazo. Em muitos casos, a obrigação existe mesmo quando a pessoa acredita que está dispensada.</p>

<h2>Quais erros mais atrasam a entrega?</h2>
<p>Os pontos que mais travam a declaração são falta de documentos, divergência de informes e escolha incorreta entre modelo simplificado e completo. Além disso, dados inconsistentes de dependentes e despesas médicas costumam gerar pendências e risco de malha.</p>
<p>Uma estratégia profissional é montar um checklist único com informes bancários, salários, aluguéis, notas de saúde, despesas com educação, previdência e dados patrimoniais antes de abrir o programa.</p>

<h2>Exemplo prático: por que começar antes reduz custo?</h2>
<p>Imagine um contribuinte com imposto devido de <strong>R$ 3.000,00</strong> e entrega em atraso. Considerando a regra de 1% ao mês (limitada a 20%), a penalidade pode crescer mês a mês, além da multa mínima. Mesmo quando o cálculo percentual resulta menor, prevalece a multa mínima de <strong>R$ 165,74</strong>.</p>
<p>Na prática, entregar dentro do prazo elimina essa despesa e ainda melhora a organização para revisar deduções legais com mais segurança.</p>

<div class="key-facts" style="background:#2D4033;color:#F9F7F2;padding:20px 24px;margin:32px 0;">
<strong style="display:block;margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;font-size:0.8em;">Dados Essenciais</strong>
<ul style="margin:0;padding-left:20px;">
<li>Prazo oficial IRPF 2026: 23/03/2026 a 29/05/2026.</li>
<li>Limite de obrigatoriedade (rendimentos tributáveis): R$ 35.584,00 em 2025.</li>
<li>Multa mínima por atraso: R$ 165,74.</li>
<li>Desconto simplificado: 20% limitado a R$ 16.754,34.</li>
</ul>
</div>

<h2>Como a Consultoria IRPF NSB pode ajudar você agora?</h2>
<p>Nosso trabalho é transformar a declaração em um processo rápido, seguro e com foco em conformidade fiscal. Analisamos seus documentos, validamos deduções permitidas e reduzimos risco de inconsistência que pode levar à malha fina.</p>
<p>Atendemos todo o Brasil, 100% online, com suporte individual durante o preenchimento e a transmissão.</p>

<div style="background:#C6FF00;color:#0A0A0A;padding:18px 20px;margin:28px 0;font-weight:700;">
Quer declarar com segurança e sem correria? Fale agora no WhatsApp: <a href="https://wa.me/5511940825120?text=Ol%C3%A1%2C%20quero%20ajuda%20com%20minha%20declara%C3%A7%C3%A3o%20IRPF%202026" target="_blank" rel="noopener noreferrer">+55 11 94082-5120</a>
</div>

<h2>Perguntas frequentes</h2>
<h3>1) O prazo oficial do IRPF 2026 já foi divulgado?</h3>
<p>Sim. Segundo divulgação da Receita Federal, o prazo vai de 23 de março a 29 de maio de 2026.</p>

<h3>2) Quem recebeu menos de R$ 35.584,00 está sempre dispensado?</h3>
<p>Não necessariamente. Existem outros critérios de obrigatoriedade, como bens acima de R$ 800 mil, atividade rural e operações em bolsa.</p>

<h3>3) Posso parcelar o imposto devido?</h3>
<p>Sim, conforme regras da Receita, é possível parcelar em quotas mensais, observados os limites legais por parcela.</p>

<h3>4) O modelo simplificado é sempre melhor?</h3>
<p>Não. Em alguns casos o completo reduz mais imposto. A decisão correta depende dos seus gastos dedutíveis e da composição da renda.</p>

<h3>5) Entregar cedo ajuda na restituição?</h3>
<p>Em geral, quem entrega antes e sem pendências tende a ter processamento mais rápido, respeitando os grupos prioritários.</p>

<h3>6) Vale contratar suporte mesmo para declaração simples?</h3>
<p>Sim, principalmente para evitar inconsistências e perda de deduções. Uma revisão técnica pode reduzir risco e economizar tempo.</p>

<p><em>Conteúdo de caráter educativo. Para análise do seu caso específico, consulte o especialista Nilson Brites — Consultoria IRPF NSB.</em></p>

<h2>Fontes</h2>
<ul>
<li><a href="https://g1.globo.com/economia/imposto-de-renda/noticia/2026/03/16/imposto-de-renda-2026-prazo-comeca-em-23-marco-e-se-estende-ate-29-de-maio-veja-quem-deve-declarar.ghtml" target="_blank" rel="noopener noreferrer">G1 Economia — Imposto de Renda 2026: prazo começa em 23 de março e se estende até 29 de maio; veja quem deve declarar</a></li>
<li><a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda" target="_blank" rel="noopener noreferrer">Receita Federal — Meu Imposto de Renda</a></li>
</ul>
`.trim();

const faqs = [
  {
    question: "Qual é o prazo do IRPF 2026?",
    answer: "De 23 de março a 29 de maio de 2026, conforme divulgação da Receita Federal.",
  },
  {
    question: "Quem é obrigado a declarar em 2026?",
    answer: "Entre os principais critérios, quem teve rendimentos tributáveis acima de R$ 35.584,00 em 2025.",
  },
  {
    question: "Qual é a multa por atraso?",
    answer: "A multa mínima é de R$ 165,74, com regra de 1% ao mês sobre o imposto devido, limitada a 20%.",
  },
  {
    question: "Posso parcelar o imposto?",
    answer: "Sim, de acordo com as regras da Receita Federal para quotas e valores mínimos.",
  },
  {
    question: "Como reduzir o risco de malha fina?",
    answer: "Organize documentos, revise informes e valide deduções antes de transmitir a declaração.",
  },
  {
    question: "A consultoria atende online?",
    answer: "Sim, atendimento 100% online para todo o Brasil via WhatsApp e e-mail.",
  },
];

async function main() {
  const exists = await prisma.blogPost.findUnique({ where: { slug } });

  if (exists) {
    await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        summary,
        content,
        faqsJson: JSON.stringify(faqs),
        published: true,
        metaTitle: title,
        metaDesc: summary,
        keywords: [
          "irpf 2026",
          "prazo irpf 2026",
          "23 de março 2026",
          "29 de maio 2026",
          "quem deve declarar imposto de renda",
          "consultoria irpf",
          "malha fina",
        ],
        tags: ["IRPF 2026", "Prazo", "Obrigatoriedade", "Receita Federal"],
        readTime: 8,
      },
    });
    console.log("✅ Post atualizado:", slug);
  } else {
    await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        faqsJson: JSON.stringify(faqs),
        published: true,
        metaTitle: title,
        metaDesc: summary,
        keywords: [
          "irpf 2026",
          "prazo irpf 2026",
          "23 de março 2026",
          "29 de maio 2026",
          "quem deve declarar imposto de renda",
          "consultoria irpf",
          "malha fina",
        ],
        tags: ["IRPF 2026", "Prazo", "Obrigatoriedade", "Receita Federal"],
        readTime: 8,
      },
    });
    console.log("✅ Post criado:", slug);
  }

  const check = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, slug: true, published: true, updatedAt: true },
  });
  console.log("📌 Verificação:", check);
}

main().catch(console.error).finally(() => prisma.$disconnect());
