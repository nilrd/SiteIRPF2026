import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Como organizar o faturamento do MEI com maquininha",
  description:
    "Guia prático para MEI organizar o faturamento mensal de maquininha, Pix e dinheiro e preparar a DASN-SIMEI sem erros. Limite anual: R$ 81.000.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/organizar-faturamento-maquininha" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como organizar o faturamento do MEI com maquininha",
    description: "MEI: organize o faturamento de maquininha, Pix e dinheiro para declarar corretamente na DASN-SIMEI.",
    url: "https://irpf.qaplay.com.br/mei/organizar-faturamento-maquininha",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Organizar faturamento MEI com maquininha — NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como organizar o faturamento do MEI com maquininha",
    description: "Organize o faturamento do MEI de maquininha, Pix e dinheiro para a DASN-SIMEI.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Como somar Pix e cartão no faturamento do MEI?",
    answer:
      "Some todas as entradas do mês, independente da origem: débito, crédito, Pix, dinheiro, link de pagamento e voucher. Use o extrato da conta PJ e o relatório do app da maquininha como base. Anote em uma planilha simples ou use um app de controle.",
  },
  {
    question: "O app da maquininha gera relatório de vendas?",
    answer:
      "Sim. A maioria das operadoras — incluindo Mercado Pago, Stone, Cielo e outras — oferece relatório mensal de vendas no app ou painel web. Você consegue exportar por período e ver o total por tipo de pagamento (débito, crédito, Pix).",
  },
  {
    question: "Preciso guardar todos os comprovantes das vendas?",
    answer:
      "Guarde pelo menos os relatórios mensais da maquininha e o extrato da conta PJ por 5 anos. Em caso de fiscalização ou revisão da DASN-SIMEI, esses documentos são a prova do faturamento declarado.",
  },
  {
    question: "Qual o limite de faturamento do MEI?",
    answer:
      "R$ 81.000 por ano (aproximadamente R$ 6.750 por mês). Se ultrapassar esse limite, o MEI pode ser excluído do Simples Nacional e precisar migrar para ME (Microempresa). Monitore o acumulado anual todo mês.",
  },
  {
    question: "Quando declarar o valor recebido: quando vendi ou quando recebi?",
    answer:
      "Na DASN-SIMEI, o critério mais comum é o regime de caixa: o faturamento é reconhecido quando o dinheiro entra (recebimento). Para crédito parcelado, os valores entram no mês em que as parcelas chegam à conta. Consulte um contador para confirmar o critério adequado ao seu caso.",
  },
  {
    question: "Como controlar o faturamento se recebo por maquininha e Pix em contas diferentes?",
    answer:
      "O ideal é centralizar tudo em uma única conta PJ. Se não for possível, mantenha controle em planilha separando cada conta e some tudo ao final de cada mês. Separe claramente o que é receita do MEI do que é movimentação pessoal.",
  },
];

export default function OrganizarFaturamentoMaquininhaPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "Organizar faturamento", url: "https://irpf.qaplay.com.br/mei/organizar-faturamento-maquininha" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Como organizar o faturamento do MEI com maquininha"
        description="Guia prático para MEI organizar o faturamento mensal de maquininha, Pix e dinheiro para a DASN-SIMEI."
        url="https://irpf.qaplay.com.br/mei/organizar-faturamento-maquininha"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Organizar faturamento MEI com maquininha — NSB"
        datePublished="2026-05-24"
        dateModified="2026-05-24"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <Link href="/mei/receber-pagamentos" className="hover:opacity-100 transition">Receber Pagamentos</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Organizar faturamento</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Controle financeiro — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Como organizar o faturamento do MEI que recebe por maquininha
            </h1>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              O MEI que recebe por maquininha, Pix e dinheiro tem um desafio: <strong>somar tudo corretamente</strong> para não errar na declaração anual (DASN-SIMEI). Este guia mostra um método simples que qualquer MEI pode seguir.
            </p>

            <h2 className="font-serif text-3xl mb-4">Por que organizar o faturamento mensalmente</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Deixar para o final do ano é o principal erro. Em dezembro, você precisa lembrar de tudo o que recebeu em janeiro — e os extratos podem não estar mais disponíveis com facilidade. Organizar mês a mês leva menos de 10 minutos e evita problemas graves:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Declarar faturamento a menor → risco de malha fina</li>
              <li>Ultrapassar R$ 81.000 sem perceber → exclusão do Simples Nacional</li>
              <li>Misturar receita PJ com movimentação pessoal → erro contábil</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Passo a passo: controle mensal do faturamento</h2>
            <ol className="text-sm opacity-70 space-y-4 mb-8 list-decimal pl-5">
              <li>
                <strong>No último dia de cada mês</strong>, acesse o app da maquininha e exporte o relatório de vendas do mês
              </li>
              <li>
                <strong>Acesse a conta PJ</strong> e verifique os recebimentos por Pix e transferências do mês
              </li>
              <li>
                <strong>Some o total</strong>: vendas na maquininha (débito + crédito) + Pix + dinheiro (controle manual)
              </li>
              <li>
                <strong>Registre em uma planilha simples</strong>: mês | maquininha | Pix | dinheiro | total
              </li>
              <li>
                <strong>Acompanhe o acumulado anual</strong> — sinalize quando chegar perto de R$ 60.000 (alerta precoce)
              </li>
              <li>
                <strong>Guarde os arquivos</strong> (PDF do relatório + extrato bancário) em pasta por mês/ano
              </li>
            </ol>

            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ Limite anual do MEI: R$ 81.000</strong>
              <p className="text-sm opacity-70">
                Ao atingir R$ 81.000 em faturamento anual, o MEI pode ser excluído do Simples Nacional. Monitore o acumulado mensalmente. Se estiver crescendo rápido, consulte um contador antes de ultrapassar o limite.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Como separar os tipos de recebimento</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-4 font-bold">Forma de recebimento</th>
                    <th className="text-left py-3 pr-4 font-bold">Onde encontrar o registro</th>
                    <th className="text-left py-3 font-bold">Prazo para entrar na conta</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Cartão débito</td>
                    <td className="py-3 pr-4">Relatório da maquininha</td>
                    <td className="py-3">D+1 útil</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Cartão crédito à vista</td>
                    <td className="py-3 pr-4">Relatório da maquininha</td>
                    <td className="py-3">~D+30</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Cartão crédito parcelado</td>
                    <td className="py-3 pr-4">Relatório de agenda financeira</td>
                    <td className="py-3">Parcelas mensais</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Pix</td>
                    <td className="py-3 pr-4">Extrato da conta PJ</td>
                    <td className="py-3">Instantâneo</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Dinheiro</td>
                    <td className="py-3 pr-4">Controle manual (caderno/planilha)</td>
                    <td className="py-3">Imediato</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-3xl mb-4">Ferramenta para facilitar o controle</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              A Point Smart 2 do Mercado Pago tem agenda financeira integrada no app — você consegue ver tudo que vai receber nos próximos dias por tipo de pagamento, e exportar o histórico mensal diretamente pelo celular.
            </p>

            <MaquininhaAfiliado
              product="point-smart-2"
              context="Agenda financeira no app para controle automático dos recebimentos por tipo."
            />

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Controle financeiro + declaração</p>
              <h3 className="font-serif text-xl mb-3">Organize agora e declare com tranquilidade na DASN-SIMEI</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites orienta MEIs a organizar o faturamento de maquininha e declarar corretamente. Atendimento 100% online.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Recebo por maquininha e Pix no meu MEI e quero organizar o faturamento para a DASN-SIMEI.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde text-preto px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-verde/90 transition"
              >
                Falar no WhatsApp sobre meu MEI →
              </a>
            </div>

            <p className="text-sm opacity-60 mb-8">
              Ver também:{" "}
              <Link href="/mei/declaracao-anual" className="underline hover:opacity-100">
                Guia completo da Declaração Anual do MEI
              </Link>{" "}
              e{" "}
              <Link href="/mei/mei-recebe-maquininha-precisa-declarar" className="underline hover:opacity-100">
                MEI que recebe por maquininha precisa declarar?
              </Link>
            </p>

            <h2 className="font-serif text-3xl mb-6 mt-12">Dúvidas frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-preto/10 pb-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <MeiGuiasRelacionados currentSlug="organizar-faturamento-maquininha" max={4} includePrincipal />
            <BlogCTA variant="footer" topic="mei" />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm />
          </aside>
        </div>
      </div>
    </main>
  );
}
