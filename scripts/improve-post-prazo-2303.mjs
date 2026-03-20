import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const slug = "irpf-2026-prazo-23-marco-29-maio-quem-deve-declarar";

const title = "IRPF 2026: novo prazo (23/03 a 29/05), quem declara e como reduzir risco de malha";

const summary =
  "A Receita Federal anunciou prazo de 23/03 a 29/05 para o IRPF 2026 (ano-base 2025). Veja quem está obrigado, quais documentos separar e um plano prático para declarar com segurança e evitar multa.";

const coverImage =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=630&q=85";

const imageAttribution = JSON.stringify({
  photographerName: "Austin Distel",
  photographerUrl: "https://unsplash.com/@austindistel?utm_source=irpf_nsb&utm_medium=referral",
  photoUrl: "https://unsplash.com/photos/DfjJMVhwH_8?utm_source=irpf_nsb&utm_medium=referral",
});

const content = `
<p><strong>O prazo do IRPF 2026 mudou:</strong> a entrega da declaração (ano-base 2025) começa em <strong>23 de março de 2026</strong> e termina em <strong>29 de maio de 2026</strong>. Quem está obrigado e perde o prazo pode pagar <strong>multa mínima de R$ 165,74</strong>, além de encargos legais.</p>

<div class="tldr-box" style="background:#f5f5f2;border-left:4px solid #2D4033;padding:16px 20px;margin:24px 0;">
<strong>Resumo rápido:</strong>
<ul>
<li><strong>Janela de entrega:</strong> 23/03/2026 a 29/05/2026.</li>
<li><strong>Obrigatoriedade:</strong> rendimentos tributáveis acima de <strong>R$ 35.584,00</strong> em 2025, entre outros critérios.</li>
<li><strong>Risco de atraso:</strong> multa mínima de <strong>R$ 165,74</strong> e possível bloqueio de regularidade fiscal até a entrega.</li>
</ul>
</div>

<h2>Quem realmente precisa declarar o IRPF 2026?</h2>
<p>Nem todo mundo precisa declarar, mas os critérios de obrigatoriedade vão além da renda mensal. Em geral, deve declarar quem, em 2025, se encaixou em ao menos uma situação legal, como:</p>
<ul>
<li>rendimentos tributáveis acima de <strong>R$ 35.584,00</strong>;</li>
<li>rendimentos isentos, não tributáveis ou tributados exclusivamente na fonte acima de <strong>R$ 200.000,00</strong>;</li>
<li>bens e direitos acima de <strong>R$ 800.000,00</strong> em 31/12/2025;</li>
<li>receita bruta de atividade rural superior a <strong>R$ 177.920,00</strong>;</li>
<li>operações em bolsa, ganho de capital e hipóteses específicas previstas na Receita Federal.</li>
</ul>

<h2>O que muda na prática com o prazo 23/03 a 29/05?</h2>
<p>A principal mudança é operacional: o contribuinte tem pouco mais de dois meses para reunir documentos, revisar deduções e transmitir sem erros. Quanto mais perto do fim do prazo, maior o risco de declaração incompleta, inconsistências e retificação posterior.</p>

<div class="key-facts" style="background:#2D4033;color:#F9F7F2;padding:20px 24px;margin:32px 0;">
<strong style="display:block;margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;font-size:0.8em;">Dados Essenciais</strong>
<ul style="margin:0;padding-left:20px;">
<li>Prazo oficial de entrega: 23/03/2026 a 29/05/2026.</li>
<li>Multa por atraso: mínimo de R$ 165,74, com limite legal de 20% do imposto devido.</li>
<li>Desconto simplificado: 20% dos rendimentos tributáveis, limitado a R$ 16.754,34.</li>
<li>Planejamento antecipado reduz chance de malha e de retificação.</li>
</ul>
</div>

<h2>Checklist objetivo: o que separar antes de abrir o programa</h2>
<ol>
<li><strong>Informes de rendimentos:</strong> salários, bancos, corretoras, aposentadoria, aluguéis e pró-labore.</li>
<li><strong>Comprovantes dedutíveis:</strong> saúde, educação, previdência e pensão (quando aplicável).</li>
<li><strong>Patrimônio e dívidas:</strong> saldos e documentos de bens em 31/12/2025.</li>
<li><strong>Renda variável e cripto:</strong> notas, extratos e memória de cálculo.</li>
<li><strong>Dados dos dependentes:</strong> CPF, data de nascimento e comprovação de vínculo.</li>
</ol>

<h2>Exemplo prático de custo de atraso</h2>
<p>Suponha um contribuinte com imposto devido de <strong>R$ 4.500,00</strong> que entrega fora do prazo. A legislação prevê multa de 1% ao mês sobre o imposto devido, limitada a 20%, observado o piso de R$ 165,74. Mesmo em atraso curto, o custo adicional pode ser evitado com organização prévia e revisão técnica antes do envio.</p>

<h2>Como vender melhor sua tranquilidade fiscal em 2026</h2>
<p>Se você quer declarar com segurança, o objetivo não é apenas "enviar no prazo", mas enviar <strong>com consistência</strong>. Isso envolve conferência de cruzamentos, estratégia de deduções e decisão correta entre modelo simplificado e completo.</p>
<p>Na Consultoria IRPF NSB, fazemos esse processo ponta a ponta: diagnóstico, checklist personalizado, preenchimento assistido e revisão final antes da transmissão.</p>

<div style="background:#C6FF00;color:#0A0A0A;padding:18px 20px;margin:28px 0;font-weight:700;">
Atendimento 100% online para todo o Brasil. Fale no WhatsApp: <a href="https://wa.me/5511940825120?text=Ol%C3%A1%2C%20quero%20ajuda%20para%20declarar%20meu%20IRPF%202026%20com%20seguran%C3%A7a" target="_blank" rel="noopener noreferrer">+55 11 94082-5120</a>
</div>

<h2>Perguntas frequentes</h2>
<h3>1) Qual é o prazo oficial da declaração do IRPF 2026?</h3>
<p>Conforme divulgação da Receita Federal em 16/03/2026, o prazo vai de 23/03/2026 até 29/05/2026.</p>

<h3>2) Quem recebeu menos de R$ 35.584,00 está automaticamente dispensado?</h3>
<p>Não. Existem outros critérios legais de obrigatoriedade, como patrimônio, atividade rural, ganho de capital e operações em bolsa.</p>

<h3>3) Vale usar desconto simplificado em qualquer caso?</h3>
<p>Depende do perfil. O simplificado aplica dedução padrão (20%, limitado a R$ 16.754,34), mas o completo pode ser mais vantajoso em algumas situações.</p>

<h3>4) Posso parcelar imposto a pagar?</h3>
<p>Sim, observando as regras de parcelamento e valores mínimos por quota previstas pela Receita Federal.</p>

<h3>5) Entregar cedo aumenta a chance de restituição mais rápida?</h3>
<p>Em regra, quem entrega antes e sem inconsistências tende a ser processado mais cedo, respeitando as prioridades legais.</p>

<h3>6) Por que contratar consultoria para declarar IRPF?</h3>
<p>Para reduzir risco de erro, evitar perda de deduções e ganhar segurança no preenchimento, principalmente em casos com múltiplas fontes de renda ou patrimônio relevante.</p>

<p><em>Conteúdo de caráter educativo. Para análise do seu caso específico, consulte o especialista Nilson Brites — Consultoria IRPF NSB.</em></p>

<h2>Fontes</h2>
<ul>
<li><a href="https://g1.globo.com/economia/imposto-de-renda/noticia/2026/03/16/imposto-de-renda-2026-prazo-comeca-em-23-marco-e-se-estende-ate-29-de-maio-veja-quem-deve-declarar.ghtml" target="_blank" rel="noopener noreferrer">G1 Economia — Imposto de Renda 2026: prazo começa em 23 de março e vai até 29 de maio</a></li>
<li><a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda" target="_blank" rel="noopener noreferrer">Receita Federal — Meu Imposto de Renda</a></li>
</ul>
`.trim();

const faqs = [
  {
    question: "Quando começa e termina o prazo do IRPF 2026?",
    answer: "De 23 de março a 29 de maio de 2026, conforme comunicado da Receita Federal.",
  },
  {
    question: "Qual é o principal limite de renda para obrigatoriedade?",
    answer: "Rendimentos tributáveis acima de R$ 35.584,00 no ano-base 2025.",
  },
  {
    question: "Quanto é a multa mínima por atraso?",
    answer: "R$ 165,74, além das regras de cálculo percentual previstas na legislação.",
  },
  {
    question: "Posso usar o desconto simplificado?",
    answer: "Sim, em geral há dedução de 20% dos rendimentos tributáveis, limitada a R$ 16.754,34.",
  },
  {
    question: "Como reduzir risco de malha fina?",
    answer: "Organize documentos, revise cruzamentos e valide deduções com base em comprovantes.",
  },
  {
    question: "A consultoria atende fora de São Paulo?",
    answer: "Sim, o atendimento é 100% online para todo o Brasil.",
  },
];

async function main() {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) {
    console.log("❌ Post não encontrado:", slug);
    return;
  }

  await prisma.blogPost.update({
    where: { slug },
    data: {
      title,
      summary,
      content,
      faqsJson: JSON.stringify(faqs),
      coverImage,
      imageAttribution,
      published: true,
      metaTitle: title,
      metaDesc: summary,
      readTime: 9,
      tags: ["IRPF 2026", "Prazo", "Obrigatoriedade", "Malha Fina"],
      keywords: [
        "irpf 2026",
        "prazo imposto de renda 2026",
        "23 de março 2026",
        "29 de maio 2026",
        "quem deve declarar",
        "multa atraso irpf",
        "consultoria irpf online",
      ],
    },
  });

  console.log("✅ Post melhorado com imagem e novo estilo:", slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
