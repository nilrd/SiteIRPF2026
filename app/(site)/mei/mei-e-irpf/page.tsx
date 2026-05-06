import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "MEI Precisa Declarar IRPF? Relação entre MEI e Imposto de Renda 2026",
  description:
    "Entenda quando o MEI é obrigado a declarar IRPF como pessoa física, como declarar o lucro isento e o pró-labore. Nilson Brites resolve 100% online.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/mei-e-irpf" },
};

const faqs = [
  {
    question: "Todo MEI é obrigado a declarar IRPF?",
    answer:
      "Não. O MEI só é obrigado a declarar o IRPF como pessoa física se se enquadrar em alguma regra de obrigatoriedade: rendimentos tributáveis acima de R$ 33.888 (2025), bens acima de R$ 800.000, ganho de capital, rendimentos de atividade rural, entre outros. Ter MEI ativo não obriga por si só.",
  },
  {
    question: "Como o MEI declara o lucro no IRPF?",
    answer:
      "O lucro do MEI pode ser distribuído de forma isenta até o limite calculado pela fórmula: receita bruta anual × percentual de presunção (8% comércio, 32% serviços) − DAS pago. O valor acima desse limite é tributável. Nilson Brites faz esse cálculo corretamente para evitar pagar mais do que o necessário.",
  },
  {
    question: "O que é pró-labore para MEI?",
    answer:
      "O pró-labore é a remuneração que o MEI paga a si mesmo pelo trabalho na empresa. Para o MEI, o pró-labore, quando formal, é tributável no IRPF. Muitos MEI distribuem lucro em vez de pró-labore para manter a isenção — mas o cálculo precisa ser feito com cuidado.",
  },
  {
    question: "DASN-SIMEI e IRPF são a mesma declaração?",
    answer:
      "Não. A DASN-SIMEI é a declaração anual do CNPJ do MEI (obrigatória até 31 de maio para todos os MEI). O IRPF é a declaração da pessoa física (prazo em abril). São obrigações totalmente separadas.",
  },
  {
    question: "MEI que faturou menos de R$ 81 mil precisa declarar IR?",
    answer:
      "Depende da situação como pessoa física, não do faturamento do MEI. Se seus rendimentos totais como pessoa física (incluindo salário de outro emprego, aluguéis, etc.) superaram R$ 33.888 em 2025, você deve declarar o IRPF independentemente do faturamento MEI.",
  },
  {
    question: "Como o MEI informa os rendimentos no IRPF?",
    answer:
      "O MEI informa o CNPJ e os rendimentos na aba 'Rendimentos Isentos e Não Tributáveis' (lucro isento) ou em 'Rendimentos Tributáveis' (pró-labore formal). Além disso, o CNPJ deve ser informado na declaração de bens caso exista algum bem em nome da empresa.",
  },
];

export default function MeiEIrpfPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "MEI e IRPF", url: "https://irpf.qaplay.com.br/mei/mei-e-irpf" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">MEI e IRPF</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              IRPF do MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              MEI precisa declarar IRPF? A relação entre MEI e Imposto de Renda
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Pontos-chave</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Ter MEI ativo <strong>não obriga</strong> a declarar IRPF</li>
                <li>Obrigatório se rendimentos PF &gt; <strong>R$ 33.888 (2025)</strong></li>
                <li>Lucro MEI pode ser distribuído como isento — calculado por fórmula</li>
                <li>DASN-SIMEI (MEI) e IRPF (PF) são obrigações <strong>separadas</strong></li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Uma das maiores confusões entre MEI é misturar as obrigações da empresa (DASN-SIMEI)
              com as da pessoa física (IRPF). São duas declarações completamente diferentes com
              prazos diferentes, regras diferentes e consequências diferentes.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quando o MEI é obrigado a declarar IRPF?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Você é obrigado a declarar o IRPF em 2026 (referente a 2025) se, como <em>pessoa física</em>:
            </p>
            <ul className="text-sm opacity-70 space-y-3 mb-8 pl-5 list-disc leading-relaxed">
              <li>Recebeu rendimentos tributáveis acima de <strong>R$ 33.888</strong> (salário, aluguel, pró-labore, etc.)</li>
              <li>Teve rendimentos não tributáveis acima de <strong>R$ 200.000</strong></li>
              <li>Realizou operações em Bolsa de Valores</li>
              <li>Obteve ganho de capital na venda de bens ou direitos</li>
              <li>Tem bens e direitos acima de <strong>R$ 800.000</strong> em 31/12/2025</li>
              <li>Passou a ter residência no Brasil em qualquer mês do ano</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Como declarar o lucro do MEI no IRPF</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O lucro distribuído pelo MEI pode ser <strong>isento de IR</strong> até um limite
              calculado pela legislação do Simples Nacional. A parte que ultrapassa esse limite
              é tributável. O cálculo envolve:
            </p>
            <ol className="text-sm opacity-70 space-y-3 mb-8 pl-5 list-decimal leading-relaxed">
              <li>
                <strong>Receita bruta do ano</strong> × percentual de presunção
                (8% comércio/indústria, 32% serviços)
              </li>
              <li>Subtrair o DAS pago no ano</li>
              <li>O que sobra = <strong>lucro isento</strong> para distribuição</li>
              <li>O que exceder esse limite = rendimento tributável no IRPF</li>
            </ol>
            <p className="text-sm opacity-60 mb-8">
              Esse cálculo tem nuances e pode variar. Nilson Brites faz corretamente para que você
              não pague imposto além do necessário.
            </p>

            {/* CTA inline */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">MEI: declare o IRPF sem complicação</h3>
              <p className="opacity-80 mb-6 text-sm">
                Nilson Brites declara o IRPF do MEI considerando o lucro isento corretamente e
                maximizando as deduções legais. 100% online, todo o Brasil.
              </p>
              <a
                href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Sou%20MEI%20e%20preciso%20declarar%20meu%20IRPF%202026."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Declarar meu IRPF como MEI →
              </a>
            </div>

            <h2 className="font-serif text-3xl mb-8 mt-16">Dúvidas sobre MEI e IRPF</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="editorial-border pb-4">
                  <summary className="font-serif text-lg cursor-pointer py-3 hover:italic transition-all">
                    {faq.question}
                  </summary>
                  <p className="text-sm opacity-70 leading-relaxed mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="md:col-span-4">
            <div className="sticky top-32 space-y-8">
              <MeiLeadForm origem="mei-irpf" titulo="Sou MEI e quero declarar IRPF" />
              <div className="border border-preto/10 p-6">
                <h3 className="font-serif text-lg mb-4">Serviços relacionados</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/declarar-agora" className="block hover:opacity-60 transition">→ Declarar IRPF 2026</Link>
                  <Link href="/mei/declaracao-anual" className="block hover:opacity-60 transition">→ DASN-SIMEI (MEI)</Link>
                  <Link href="/mei/dividas-parcelamento" className="block hover:opacity-60 transition">→ Dívidas DAS</Link>
                  <Link href="/mei" className="block hover:opacity-60 transition">→ Todos os serviços MEI</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
