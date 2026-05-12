import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Cancelamento e Baixa do MEI 2026 — Como Encerrar sem Dívidas",
  description:
    "Saiba como fazer a baixa do MEI corretamente, quitar os DAS em aberto e evitar multas após o encerramento. Nilson Brites orienta todo o processo 100% online.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/cancelamento-mei" },
};

const faqs = [
  {
    question: "Como fazer a baixa do MEI?",
    answer:
      "A baixa do MEI é feita pelo Portal do Empreendedor (gov.br/empresas-e-negocios). Antes, é necessário quitar todos os DAS em aberto e entregar a DASN-SIMEI com declaração proporcional ao período de atividade no ano do encerramento.",
  },
  {
    question: "Posso cancelar o MEI com dívidas?",
    answer:
      "Tecnicamente sim, mas a dívida continua existindo vinculada ao CPF do titular. Cancelar o CNPJ sem quitar não elimina a cobrança — o valor pode ir para a dívida ativa e gerar protesto e bloqueio de crédito.",
  },
  {
    question: "Preciso entregar a DASN-SIMEI do ano de encerramento?",
    answer:
      "Sim. No ano do encerramento, você deve entregar a DASN-SIMEI com declaração proporcional ao faturamento do período em que o MEI esteve ativo, até o mês de encerramento.",
  },
  {
    question: "O que acontece com o CNPJ após a baixa?",
    answer:
      "O CNPJ é cancelado e o número não pode mais ser reativado. Para voltar a empreender, será necessário abrir um novo CNPJ MEI.",
  },
  {
    question: "Quanto tempo leva o cancelamento?",
    answer:
      "O processo de baixa no Portal do Empreendedor é imediato, mas o cancelamento junto à Receita Federal e à Junta Comercial pode levar alguns dias úteis para ser processado em todos os sistemas.",
  },
];

export default function CancelamentoMeiPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Cancelamento do MEI", url: "https://irpf.qaplay.com.br/mei/cancelamento-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Cancelamento do MEI</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Baixa MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Cancelamento e baixa do MEI sem dívidas escondidas
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Atenção antes de cancelar</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Quitar todos os DAS em aberto <strong>antes</strong> da baixa</li>
                <li>Entregar DASN-SIMEI proporcional ao ano do encerramento</li>
                <li>Cancelar sem quitar = dívida permanece no CPF</li>
                <li>CNPJ cancelado não pode ser reativado</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Encerrar o MEI parece simples, mas um passo em falso cobra caro. Dívida de DAS não
              desaparece com o cancelamento — ela migra para o CPF do titular e pode virar dívida
              ativa, protesto e bloqueio de crédito. O caminho seguro é regularizar antes de fechar.
            </p>

            <h2 className="font-serif text-3xl mb-4">Passo a passo para cancelar o MEI</h2>
            <ol className="text-sm opacity-70 space-y-4 mb-8 list-decimal pl-5 leading-relaxed">
              <li>
                <strong>Levante todos os DAS em aberto</strong> — acesse o Portal do Empreendedor ou
                use o app PGMEI para verificar o valor total devido.
              </li>
              <li>
                <strong>Quite ou parcele as dívidas</strong> — é possível parcelar em até 60 meses.
                Verifique também elegibilidade ao Desenrola Empresas.
              </li>
              <li>
                <strong>Entregue a DASN-SIMEI do ano corrente</strong> — proporcional ao período de
                atividade no ano do encerramento.
              </li>
              <li>
                <strong>Solicite a baixa</strong> — pelo Portal do Empreendedor (gov.br) na opção
                &quot;Encerrar MEI&quot;. O processo é online e imediato.
              </li>
              <li>
                <strong>Guarde o comprovante</strong> — o número de protocolo comprova o encerramento.
              </li>
            </ol>

            <h2 className="font-serif text-3xl mb-4">MEI com dívidas: o que fazer?</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Se você tem DAS atrasados, não entre em pânico. Existem opções de parcelamento em até
              60 meses pela Receita Federal e programas de renegociação com desconto como o{" "}
              <Link href="/mei/dividas-parcelamento" className="underline underline-offset-4 hover:opacity-100 transition">
                Desenrola Empresas MEI
              </Link>
              .
            </p>

            {/* CTA inline */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">Cancelar MEI sem surpresas</h3>
              <p className="opacity-80 mb-6 text-sm">
                Nilson verifica sua situação completa antes do cancelamento. Sem dívidas escondidas,
                sem problemas futuros.
              </p>
              <a
                href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Preciso%20cancelar%20meu%20MEI%20com%20seguran%C3%A7a."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Cancelar meu MEI com segurança →
              </a>
            </div>

            <h2 className="font-serif text-3xl mb-8 mt-16">Dúvidas sobre cancelamento do MEI</h2>
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
              <MeiLeadForm origem="mei-cancelamento" titulo="Quero cancelar meu MEI" />
              <div className="border border-preto/10 p-6">
                <h3 className="font-serif text-lg mb-4">Outros serviços MEI</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/mei/declaracao-anual" className="block hover:opacity-60 transition">→ Declaração Anual (DASN-SIMEI)</Link>
                  <Link href="/mei/dividas-parcelamento" className="block hover:opacity-60 transition">→ Dívidas — Desenrola Empresas</Link>
                  <Link href="/mei/mei-e-irpf" className="block hover:opacity-60 transition">→ MEI + IRPF</Link>
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
