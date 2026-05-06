import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Declaração Anual do MEI (DASN-SIMEI) 2026 — Prazo 31 de Maio",
  description:
    "Entregue sua DASN-SIMEI antes do prazo de 31/05/2026. Evite multas de R$ 50. Nilson Brites cuida da declaração do seu MEI 100% online.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/declaracao-anual" },
};

const faqs = [
  {
    question: "O que é a DASN-SIMEI?",
    answer:
      "A DASN-SIMEI (Declaração Anual do Simples Nacional para o MEI) é a declaração obrigatória que o MEI deve entregar todo ano à Receita Federal informando o faturamento bruto do ano anterior. É diferente da declaração de Imposto de Renda da pessoa física.",
  },
  {
    question: "Qual o prazo da DASN-SIMEI 2026?",
    answer:
      "O prazo final para entrega da declaração referente ao ano-calendário 2025 é 31 de maio de 2026. Declarações entregues após o prazo geram multa mínima de R$ 50.",
  },
  {
    question: "MEI que não faturou nada precisa declarar?",
    answer:
      "Sim. Mesmo o MEI que não teve faturamento no ano anterior deve entregar a DASN-SIMEI informando faturamento zero. A omissão gera multa e impede o parcelamento de débitos.",
  },
  {
    question: "O que acontece se eu não entregar no prazo?",
    answer:
      "A multa por atraso é de 2% ao mês sobre o valor do tributo declarado, com mínimo de R$ 50. O CNPJ fica irregular e o MEI perde algumas proteções do Simples Nacional.",
  },
  {
    question: "DASN-SIMEI e IRPF são a mesma coisa?",
    answer:
      "Não. São obrigações separadas. A DASN-SIMEI é do MEI (pessoa jurídica). O IRPF é da pessoa física. Se você, como pessoa física, recebeu mais de R$ 33.888 em 2025, também deve declarar o IR da pessoa física.",
  },
  {
    question: "Como corrigir uma DASN-SIMEI com erro?",
    answer:
      "É possível fazer uma declaração retificadora pelo Portal do Empreendedor ou pelo gov.br, desde que seja antes do lançamento do auto de infração. Nilson Brites pode verificar e corrigir para você.",
  },
];

export default function DeclaracaoAnualPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Declaração Anual (DASN-SIMEI)", url: "https://irpf.qaplay.com.br/mei/declaracao-anual" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Declaração Anual</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Conteúdo principal */}
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              DASN-SIMEI 2026
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Declaração Anual do MEI: prazo 31 de maio de 2026
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resumo rápido</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Prazo: <strong>31 de maio de 2026</strong></li>
                <li>Multa por atraso: mínimo <strong>R$ 50</strong></li>
                <li>Obrigatória mesmo com faturamento zero</li>
                <li>Separada do IRPF da pessoa física</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              A DASN-SIMEI é a declaração anual que todo Microempreendedor Individual deve entregar à
              Receita Federal até o dia 31 de maio, informando o faturamento bruto do ano anterior.
              Não confunda com o Imposto de Renda — são obrigações completamente distintas.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quem deve entregar a DASN-SIMEI?</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Todos os MEI ativos no ano-calendário anterior, sem exceção. Mesmo quem não faturou
              nada deve declarar faturamento zero. O CNPJ ativo gera a obrigatoriedade.
            </p>

            <h2 className="font-serif text-3xl mb-4">O que acontece com quem atrasa?</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-6 font-bold">Situação</th>
                    <th className="text-left py-3 font-bold">Consequência</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Entrega no prazo</td>
                    <td className="py-3">Sem multa, CNPJ regular</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Até 30 dias de atraso</td>
                    <td className="py-3">Multa mínima R$ 50</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Mais de 30 dias</td>
                    <td className="py-3">2% ao mês sobre o tributo + mínimo R$ 50</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Não entregou</td>
                    <td className="py-3">CNPJ irregular + bloqueio de benefícios</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-3xl mb-4">DASN-SIMEI e o IRPF do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Muita gente confunde as duas. A DASN-SIMEI é uma obrigação do <em>CNPJ</em> do MEI.
              Já o IRPF é obrigação da <em>pessoa física</em>. Você pode precisar entregar os dois
              — e o Nilson Brites cuida de ambos.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Entenda melhor em:{" "}
              <Link href="/mei/mei-e-irpf" className="underline underline-offset-4 hover:opacity-100 transition">
                como o MEI se relaciona com o IRPF
              </Link>
              .
            </p>

            {/* CTA inline */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">Prazo se aproximando?</h3>
              <p className="opacity-80 mb-6 text-sm">
                Nilson entrega sua DASN-SIMEI com rapidez e segurança. Atendimento 100% online.
              </p>
              <a
                href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Preciso%20entregar%20minha%20DASN-SIMEI%202026."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Resolver minha declaração MEI →
              </a>
            </div>

            {/* FAQ */}
            <h2 className="font-serif text-3xl mb-8 mt-16">Dúvidas sobre a DASN-SIMEI</h2>
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

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-32 space-y-8">
              <MeiLeadForm origem="mei-declaracao-anual" titulo="Quero entregar minha DASN-SIMEI" />

              <div className="border border-preto/10 p-6">
                <h3 className="font-serif text-lg mb-4">Outros serviços MEI</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/mei/abertura-mei" className="block hover:opacity-60 transition">
                    → Abertura do MEI
                  </Link>
                  <Link href="/mei/dividas-parcelamento" className="block hover:opacity-60 transition">
                    → Dívidas e Parcelamento DAS
                  </Link>
                  <Link href="/mei/mei-e-irpf" className="block hover:opacity-60 transition">
                    → MEI + IRPF
                  </Link>
                  <Link href="/mei" className="block hover:opacity-60 transition">
                    → Todos os serviços MEI
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
