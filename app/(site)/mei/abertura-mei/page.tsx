import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Abertura do MEI 2026 — Como Abrir o CNPJ MEI Corretamente",
  description:
    "Abra seu MEI com CNAE correto, enquadramento adequado e sem erros. Nilson Brites orienta a abertura do MEI para autônomos e empreendedores em todo o Brasil.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/abertura-mei" },
};

const faqs = [
  {
    question: "Qualquer pessoa pode abrir um MEI?",
    answer:
      "Sim, pessoa física maior de 18 anos (ou emancipada) com CPF regular pode abrir um MEI. Exceções: servidores públicos com dedicação exclusiva, sócios de outras empresas e determinadas profissões regulamentadas.",
  },
  {
    question: "Qual o limite de faturamento do MEI?",
    answer:
      "O limite é de R$ 81.000 por ano (R$ 6.750/mês). Se ultrapassar, é necessário migrar para ME (Microempresa) e há impacto no tributo do período.",
  },
  {
    question: "O que é CNAE e por que é importante?",
    answer:
      "CNAE é o código que classifica a atividade econômica. Escolher o CNAE errado pode resultar em cobrança de tributos incorretos, problemas na emissão de nota fiscal ou até exclusão do MEI. Nilson verifica o CNAE adequado antes da abertura.",
  },
  {
    question: "Quanto custa abrir um MEI?",
    answer:
      "O registro no Portal do Empreendedor é gratuito. Após aberto, você paga mensalmente o DAS: R$ 73 (comércio/indústria), R$ 79,90 (serviços) ou R$ 80,90 (ambos) — todos com INSS incluído.",
  },
  {
    question: "MEI pode ter funcionário?",
    answer:
      "Sim. O MEI pode contratar até 1 funcionário com salário mínimo ou piso da categoria. O empregador MEI paga 3% de INSS patronal sobre o salário do funcionário.",
  },
];

export default function AberturaMeiPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Abertura do MEI", url: "https://irpf.qaplay.com.br/mei/abertura-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Abertura do MEI</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Formalização
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Abertura do MEI: como formalizar seu negócio sem erros
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resumo rápido</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Limite de faturamento: <strong>R$ 81.000/ano</strong></li>
                <li>DAS mensal: R$ 73 a R$ 80,90 (já inclui INSS)</li>
                <li>CNAE errado = problemas futuros</li>
                <li>Registro gratuito no Portal do Empreendedor</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Abrir um MEI é simples — mas escolher a atividade (CNAE) errada e não entender as
              obrigações mensais pode gerar problemas sérios. Nilson Brites orienta autônomos e
              pequenos empreendedores em toda a etapa de abertura.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quem pode ser MEI?</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Qualquer pessoa física maior de 18 anos com CPF regular pode solicitar a abertura.
              O MEI é indicado para quem trabalha por conta própria e quer emitir nota fiscal,
              ter CNPJ, acesso ao crédito e cobertura do INSS.
            </p>

            <h2 className="font-serif text-3xl mb-4">Atividades permitidas no MEI</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Existem mais de 500 atividades permitidas. Algumas profissões regulamentadas (medicina,
              direito, engenharia) não podem operar como MEI. Escolher o CNAE correto é fundamental
              para evitar problemas tributários e na emissão de notas fiscais.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quanto o MEI paga por mês?</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-6 font-bold">Atividade</th>
                    <th className="text-left py-3 font-bold">DAS mensal 2026</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Comércio / Indústria</td>
                    <td className="py-3">R$ 73,00</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Serviços</td>
                    <td className="py-3">R$ 79,90</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-6">Comércio + Serviços</td>
                    <td className="py-3">R$ 80,90</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA inline */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">Abrir MEI com orientação especializada</h3>
              <p className="opacity-80 mb-6 text-sm">
                Nilson verifica o CNAE correto para sua atividade e orienta todo o processo. 100% online.
              </p>
              <a
                href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20abrir%20meu%20MEI%20com%20orienta%C3%A7%C3%A3o%20especializada."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Abrir meu MEI agora →
              </a>
            </div>

            <h2 className="font-serif text-3xl mb-8 mt-16">Dúvidas sobre abertura do MEI</h2>
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
              <MeiLeadForm origem="mei-abertura" titulo="Quero abrir meu MEI" />
              <div className="border border-preto/10 p-6">
                <h3 className="font-serif text-lg mb-4">Outros serviços MEI</h3>
                <div className="space-y-3 text-sm">
                  <Link href="/mei/declaracao-anual" className="block hover:opacity-60 transition">→ Declaração Anual (DASN-SIMEI)</Link>
                  <Link href="/mei/dividas-parcelamento" className="block hover:opacity-60 transition">→ Dívidas e Parcelamento DAS</Link>
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
