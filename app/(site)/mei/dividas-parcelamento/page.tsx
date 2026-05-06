import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Dívidas de DAS do MEI — Parcelamento e Desenrola Empresas 2026",
  description:
    "DAS atrasado acumula multa e juros. Saiba como parcelar em até 60 meses e use o Desenrola Empresas para negociar com descontos. Nilson Brites resolve 100% online.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/dividas-parcelamento" },
};

const faqs = [
  {
    question: "Posso parcelar o DAS do MEI em atraso?",
    answer:
      "Sim. É possível parcelar os DAS atrasados em até 60 meses via Receita Federal (PGFN/Simples) com juros Selic. O parcelamento regulariza o CNPJ e evita a inscrição em dívida ativa.",
  },
  {
    question: "O que é o Desenrola Empresas?",
    answer:
      "O Desenrola Empresas é o programa federal de renegociação de dívidas para MEI e empresas do Simples Nacional. Oferece descontos sobre multas e juros para dívidas inscritas na dívida ativa da União, com prazo de até 48 meses e entrada de 1%.",
  },
  {
    question: "Quem tem direito ao Desenrola Empresas?",
    answer:
      "MEI e microempresas com dívidas inscritas na dívida ativa da União até a data de adesão ao programa. O limite de renegociação varia conforme o tamanho da dívida e a modalidade escolhida.",
  },
  {
    question: "O que é o Procred MEI?",
    answer:
      "O Procred MEI é uma linha de crédito para MEI com carência de até 24 meses e prazo de até 96 meses para pagamento. O crédito pode ser de até 50% do faturamento máximo do MEI (R$ 40.500). Ideal para quitar dívidas ou capitalizar o negócio.",
  },
  {
    question: "DAS atrasado bloqueia o CNPJ?",
    answer:
      "DAS em atraso por muitos meses pode levar à exclusão do Simples Nacional e, dependendo do valor, à inscrição em dívida ativa da União, o que dificulta acesso a crédito, contratos públicos e certidões negativas.",
  },
  {
    question: "Como faço para saber o valor total de DAS que devo?",
    answer:
      "Acesse o Portal do Empreendedor (gov.br) com seu CNPJ, ou use o app PGMEI da Receita Federal. O sistema mostra todos os DAS em aberto com valores atualizados incluindo multa e juros.",
  },
];

export default function DividasParcelamentoPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Dívidas e Parcelamento", url: "https://irpf.qaplay.com.br/mei/dividas-parcelamento" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Dívidas e Parcelamento</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Regularização MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              DAS do MEI atrasado: como parcelar e usar o Desenrola Empresas
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resumo rápido</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Parcelamento DAS: até <strong>60 meses</strong> via Receita Federal</li>
                <li>Desenrola Empresas: descontos sobre multa e juros + prazo 48 meses</li>
                <li>Procred MEI: crédito com carência de 24 meses e prazo de 96 meses</li>
                <li>DAS não quitado = CNPJ irregular + dívida ativa</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              DAS acumulado não desaparece com o tempo — cresce com multa (0,33%/dia, até 20%) e
              juros Selic. Mas existem saídas legais: parcelamento ordinário, Desenrola Empresas e
              Procred MEI. Nilson Brites verifica sua situação e indica o melhor caminho.
            </p>

            <h2 className="font-serif text-3xl mb-4">Parcelamento ordinário do DAS</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              O parcelamento padrão pela Receita Federal permite dividir a dívida em até 60 parcelas
              com juros Selic. O pedido é feito pelo Portal do Empreendedor ou pelo app
              PGMEI. O CNPJ volta a ficar regular após a formalização do parcelamento.
            </p>

            <h2 className="font-serif text-3xl mb-4">Desenrola Empresas — dívida ativa com desconto</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para quem já tem dívida inscrita na dívida ativa da União, o Desenrola Empresas
              oferece condições diferenciadas:
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-6 font-bold">Modalidade</th>
                    <th className="text-left py-3 pr-6 font-bold">Desconto</th>
                    <th className="text-left py-3 font-bold">Prazo máx.</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Pagamento à vista</td>
                    <td className="py-3 pr-6">Até 100% dos juros/multas</td>
                    <td className="py-3">—</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Parcelamento</td>
                    <td className="py-3 pr-6">Descontos proporcionais</td>
                    <td className="py-3">48 meses</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Entrada</td>
                    <td className="py-3 pr-6">1% do total negociado</td>
                    <td className="py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs opacity-50 mb-8">
              * Condições sujeitas a regulamentação vigente. Verifique elegibilidade com especialista.
            </p>

            <h2 className="font-serif text-3xl mb-4">Procred MEI — linha de crédito especial</h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              O Procred MEI oferece acesso a crédito de até 50% do faturamento máximo do MEI
              (R$ 81.000 × 50% = até R$ 40.500) com carência de até 24 meses e prazo de pagamento
              de até 96 meses. Ideal para quitar dívidas e reorganizar as finanças do negócio.
            </p>

            {/* CTA inline */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">Quer regularizar as dívidas do MEI?</h3>
              <p className="opacity-80 mb-6 text-sm">
                Nilson verifica sua situação, identifica a melhor opção e orienta todo o processo.
                100% online, para todo o Brasil.
              </p>
              <a
                href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Tenho%20DAS%20atrasado%20e%20quero%20regularizar%20meu%20MEI."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Regularizar minha dívida MEI →
              </a>
            </div>

            <p className="text-sm opacity-60 mb-8 leading-relaxed">
              Depois de resolver as dívidas, lembre-se que o próximo passo pode ser regularizar
              também o{" "}
              <Link href="/mei/mei-e-irpf" className="underline underline-offset-4 hover:opacity-100 transition">
                IRPF da pessoa física como MEI
              </Link>
              .
            </p>

            <h2 className="font-serif text-3xl mb-8 mt-16">Dúvidas sobre dívidas do MEI</h2>
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
              <MeiLeadForm origem="mei-dividas" titulo="Resolver dívidas do MEI" />
              <div className="border border-preto/10 p-6">
                <h3 className="font-serif text-lg mb-4">Outros serviços MEI</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/mei/declaracao-anual" className="block hover:opacity-60 transition">→ Declaração Anual (DASN-SIMEI)</Link>
                  <Link href="/mei/cancelamento-mei" className="block hover:opacity-60 transition">→ Cancelamento do MEI</Link>
                  <Link href="/mei/mei-e-irpf" className="block hover:opacity-60 transition">→ MEI + IRPF</Link>
                  <Link href="/desenrola-brasil" className="block hover:opacity-60 transition">→ Desenrola Brasil — visão geral</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
