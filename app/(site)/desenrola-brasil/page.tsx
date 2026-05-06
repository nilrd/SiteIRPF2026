import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Desenrola Brasil 2026 — Renegociar Dívidas com Desconto (MEI e PF)",
  description:
    "Entenda o Novo Desenrola Brasil: fases Famílias, FIES, Empresas e Rural. Renegocie dívidas com descontos de até 90% e recupere seu nome. Saiba se você tem direito.",
  alternates: { canonical: "https://irpf.qaplay.com.br/desenrola-brasil" },
  openGraph: {
    title: "Desenrola Brasil 2026 | Consultoria NSB",
    description: "Renegocie dívidas com desconto pelo Desenrola Brasil. MEI, Famílias, FIES e Rural. Entenda como funciona.",
    url: "https://irpf.qaplay.com.br/desenrola-brasil",
  },
};

const faqs = [
  {
    question: "O que é o Novo Desenrola Brasil?",
    answer:
      "É um programa federal de renegociação de dívidas que oferece descontos sobre juros e multas para pessoas físicas e empresas com dívidas vencidas. Dividido em fases: Famílias (dívidas bancárias e de varejo), FIES (estudantes), Empresas/MEI (dívida ativa da União) e Rural.",
  },
  {
    question: "Quem pode participar do Desenrola Famílias?",
    answer:
      "Pessoas físicas com dívidas de crédito rotativo, crédito pessoal, financiamento de veículos e outros produtos bancários. As condições de desconto variam conforme o tipo e o tempo de atraso da dívida.",
  },
  {
    question: "MEI tem desconto pelo Desenrola Empresas?",
    answer:
      "Sim. O Desenrola Empresas atende MEI e empresas do Simples Nacional com dívidas inscritas na dívida ativa da União. A renegociação pode incluir descontos sobre juros e multas, parcelamento em até 48 meses e entrada de apenas 1%.",
  },
  {
    question: "Quais dívidas são incluídas no Desenrola?",
    answer:
      "Depende da fase: Famílias abrange crédito bancário e de varejo; Empresas abrange dívida ativa da União (DAS não pago inscrito após execução fiscal); FIES é específico para financiamento estudantil; Rural para produtores rurais.",
  },
  {
    question: "Como renegociar pelo Desenrola?",
    answer:
      "Pelo site da Receita Federal (para Empresas/MEI) ou pelo portal das instituições financeiras (para Famílias). Nilson Brites auxilia MEI a identificar elegibilidade e orientar o processo de renegociação.",
  },
  {
    question: "Depois do Desenrola preciso declarar IRPF?",
    answer:
      "Regularizar dívidas não cancela a obrigação de declarar IR. Se você tem rendimentos acima de R$ 33.888 como pessoa física, deve declarar — independentemente de ter participado do Desenrola.",
  },
];

export default function DesenrolaBrasilPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[{ name: "Desenrola Brasil", url: "https://irpf.qaplay.com.br/desenrola-brasil" }]}
      />
      <JsonLdFAQ faqs={faqs} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pb-16 border-b border-preto/10">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
          Programa Federal
        </p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6 max-w-3xl">
          Novo Desenrola Brasil: renegociar dívidas com desconto em 2026
        </h1>
        <p className="text-lg opacity-60 max-w-2xl leading-relaxed">
          O governo federal relançou o Desenrola Brasil com fases específicas para famílias,
          estudantes, MEI e empresas. Se você tem dívidas vencidas, pode existir uma saída com
          desconto significativo.
        </p>
      </section>

      {/* Fases do programa */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="font-serif text-4xl mb-10">As 4 fases do Novo Desenrola Brasil</h2>

        <div className="grid md:grid-cols-2 gap-0">
          {[
            {
              num: "01",
              title: "Desenrola Famílias",
              desc: "Para pessoas físicas com dívidas de crédito rotativo, crédito pessoal, financiamento de veículos e produtos bancários. Descontos variam conforme instituição e prazo do atraso.",
              tag: "Pessoa Física",
              href: null,
            },
            {
              num: "02",
              title: "Desenrola FIES",
              desc: "Para estudantes com financiamento estudantil (FIES) com parcelas em atraso. Condições especiais de renegociação junto ao FNDE e agentes operadores.",
              tag: "Estudantes",
              href: null,
            },
            {
              num: "03",
              title: "Desenrola Empresas / MEI",
              desc: "Para MEI e empresas do Simples Nacional com dívidas inscritas na dívida ativa da União. Descontos sobre multas e juros, prazo de até 48 meses, entrada de 1%.",
              tag: "MEI & Empresas",
              href: "/mei/dividas-parcelamento",
            },
            {
              num: "04",
              title: "Desenrola Rural",
              desc: "Para produtores rurais com dívidas no sistema financeiro rural. Condições específicas conforme regulamentação do Banco Central e Ministério da Agricultura.",
              tag: "Produtores Rurais",
              href: null,
            },
          ].map((fase) => (
            <div
              key={fase.num}
              className="editorial-border py-8 pr-8 group"
            >
              <span className="font-serif italic text-3xl opacity-20 block mb-3">{fase.num}</span>
              <h3 className="font-serif text-2xl mb-3">{fase.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed mb-4">{fase.desc}</p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest bg-verde/10 text-verde px-3 py-1">
                  {fase.tag}
                </span>
                {fase.href && (
                  <Link
                    href={fase.href}
                    className="text-xs underline underline-offset-4 opacity-60 hover:opacity-100 transition"
                  >
                    Saiba mais →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabela de descontos (Famílias) */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-preto/10">
        <h2 className="font-serif text-4xl mb-6">Descontos por tipo de dívida</h2>
        <p className="text-sm opacity-60 mb-8 max-w-2xl leading-relaxed">
          Os descontos variam conforme o tipo de dívida e o tempo de atraso. Os percentuais indicados
          são referência — as condições exatas dependem da instituição e do período da dívida.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-preto">
                <th className="text-left py-3 pr-6 font-bold">Tipo de dívida</th>
                <th className="text-left py-3 pr-6 font-bold">Desconto máx. (juros/multas)</th>
                <th className="text-left py-3 font-bold">Prazo máx.</th>
              </tr>
            </thead>
            <tbody className="opacity-70">
              <tr className="border-b border-preto/10">
                <td className="py-3 pr-6">Crédito rotativo (cartão)</td>
                <td className="py-3 pr-6">Até 90%</td>
                <td className="py-3">Varia por banco</td>
              </tr>
              <tr className="border-b border-preto/10">
                <td className="py-3 pr-6">Crédito pessoal</td>
                <td className="py-3 pr-6">Até 80%</td>
                <td className="py-3">Varia por banco</td>
              </tr>
              <tr className="border-b border-preto/10">
                <td className="py-3 pr-6">Financiamento de veículo</td>
                <td className="py-3 pr-6">Até 50%</td>
                <td className="py-3">Varia por banco</td>
              </tr>
              <tr className="border-b border-preto/10">
                <td className="py-3 pr-6">Dívida ativa da União (MEI)</td>
                <td className="py-3 pr-6">Até 100% juros/multas</td>
                <td className="py-3">48 meses</td>
              </tr>
              <tr className="border-b border-preto/10">
                <td className="py-3 pr-6">FIES</td>
                <td className="py-3 pr-6">Conforme regulamento FNDE</td>
                <td className="py-3">Especial FIES</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs opacity-40">
          * Dados estimados com base no programa anterior. Condições definitivas conforme regulamentação vigente. Consulte um especialista.
        </p>
      </section>

      {/* CTA MEI */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-preto/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-verde text-white p-10">
            <p className="text-[10px] uppercase tracking-widest opacity-60 mb-4">Para MEI</p>
            <h3 className="font-serif text-3xl mb-4">DAS atrasado? Nilson resolve.</h3>
            <p className="opacity-80 mb-8 text-sm leading-relaxed">
              Verifique elegibilidade ao Desenrola Empresas, parcelamento de DAS e Procred MEI.
              Atendimento 100% online para todo o Brasil.
            </p>
            <Link
              href="/mei/dividas-parcelamento"
              className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
            >
              Resolver dívidas do MEI →
            </Link>
          </div>

          <div className="border border-preto p-10">
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">Após regularizar</p>
            <h3 className="font-serif text-3xl mb-4">Não esqueça o IRPF.</h3>
            <p className="opacity-60 mb-8 text-sm leading-relaxed">
              Depois de limpar o nome, o próximo passo é regularizar o CPF na Receita Federal.
              Nilson Brites cuida da sua declaração de IRPF 100% online.
            </p>
            <Link
              href="/declarar-agora"
              className="inline-block bg-preto text-white px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-preto/80 transition"
            >
              Declarar meu IRPF →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-preto/10">
        <h2 className="font-serif text-4xl mb-10">Perguntas sobre o Desenrola Brasil</h2>
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
      </section>
    </main>
  );
}
