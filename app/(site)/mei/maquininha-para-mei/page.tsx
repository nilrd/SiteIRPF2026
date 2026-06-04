import type { Metadata } from "next";
import Link from "next/link";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import QuizMaquininha from "@/components/site/QuizMaquininha";
import CalculadoraVendasCartao from "@/components/site/CalculadoraVendasCartao";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para MEI: como escolher e começar a receber no cartão",
  description:
    "Guia completo para MEI que quer maquininha de cartão. O que analisar, qual modelo escolher e como não errar na hora de receber clientes no débito e crédito.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para MEI: como escolher e começar a receber no cartão",
    description: "Guia completo para MEI escolher maquininha de cartão — sem aluguel, sem surpresas.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para MEI" }],
  },
};

const faqs = [
  {
    question: "MEI pode ter maquininha de cartão?",
    answer:
      "Sim. O MEI pode contratar maquininha normalmente usando o CNPJ ou o CPF, dependendo da operadora. O ideal é usar o CNPJ para manter a separação entre finanças pessoais e do negócio. Todos os recebimentos somam para o faturamento anual que deve ser declarado na DASN-SIMEI.",
  },
  {
    question: "Maquininha para MEI precisa de aluguel mensal?",
    answer:
      "Depende da operadora e do modelo. Algumas maquininhas são vendidas (sem aluguel mensal), enquanto outras cobram mensalidade. O Mercado Pago, por exemplo, oferece modelos sem mensalidade fixa — você paga apenas uma taxa por transação.",
  },
  {
    question: "Qual é o limite de vendas no cartão para MEI?",
    answer:
      "Não existe um limite específico para vendas no cartão. O limite do MEI é de R$ 81.000 por ano (faturamento bruto total, incluindo Pix, dinheiro, cartão e qualquer outra forma de recebimento). Se ultrapassar esse valor, o MEI deve migrar para outro regime tributário.",
  },
  {
    question: "Venda no cartão entra no faturamento do MEI?",
    answer:
      "Sim. Todo recebimento — independente do meio — conta para o faturamento bruto anual do MEI. Vendas no cartão, Pix, dinheiro e boleto somam igualmente na DASN-SIMEI.",
  },
  {
    question: "Como controlar vendas no cartão sendo MEI?",
    answer:
      "O mais prático é usar uma conta PJ para todos os recebimentos e exportar o extrato mensalmente para conferir o total. Maquininhas como a Point Smart 2 e a Point Pro 3 oferecem relatórios de vendas no próprio app do Mercado Pago.",
  },
];

export default function MaquininhaParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para MEI", url: "https://irpf.qaplay.com.br/mei/maquininha-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para MEI: como escolher e começar a receber no cartão"
        description="Guia completo para MEI que quer maquininha de cartão."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para MEI: como escolher sem complicação
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Você acabou de se formalizar como MEI ou simplesmente quer começar a receber no cartão.
              A dúvida é sempre a mesma: qual maquininha faz mais sentido para meu tipo de negócio?
              Este guia responde de forma direta — sem jargão, sem empurrar produto que não serve.
            </p>

            <h2 className="font-serif text-3xl mb-4">Por que MEI precisa de maquininha?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Parte crescente dos clientes prefere pagar no cartão — especialmente no crédito. Sem maquininha,
              o MEI perde vendas para concorrentes que aceitam débito, crédito e parcelamento.
              Além disso, receber pelo cartão facilita o controle do faturamento, pois tudo fica registrado.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              A boa notícia: hoje existem maquininhas sem aluguel mensal fixo, que cobram apenas uma taxa
              por transação. Isso significa que você só paga quando vende — sem custo fixo parado.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quais são as opções para MEI?</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              De forma simplificada, o MEI tem três caminhos para começar a receber no cartão:
            </p>

            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-[#C6FF00] pl-5">
                <p className="font-semibold mb-1">1. App Mercado Pago (sem maquininha)</p>
                <p className="text-sm opacity-70">
                  Receba por Pix, link de pagamento e aproximação NFC pelo celular. Zero investimento inicial.
                  Ideal para quem está testando ou tem volume baixo.
                </p>
              </div>
              <div className="border-l-4 border-[#C6FF00] pl-5">
                <p className="font-semibold mb-1">2. Point Smart 2 (maquininha com tela)</p>
                <p className="text-sm opacity-70">
                  Tela touchscreen, relatórios de vendas, NFC e aceita todas as bandeiras. Ótima para
                  prestadores de serviço, salões e quem precisa de praticidade.
                </p>
              </div>
              <div className="border-l-4 border-[#C6FF00] pl-5">
                <p className="font-semibold mb-1">3. Point Pro 3 (maquininha robusta)</p>
                <p className="text-sm opacity-70">
                  Bateria de longa duração, Wi-Fi e 4G, aceita voucher e todas as formas de pagamento.
                  Indicada para quem atende muito, faz delivery ou trabalha em eventos e feiras.
                </p>
              </div>
            </div>

            {/* Quiz */}
            <QuizMaquininha />

            <h2 className="font-serif text-3xl mb-4">O que analisar antes de comprar</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Antes de decidir, vale responder estas perguntas:
            </p>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Quantas vendas no cartão você faz por dia, em média?</li>
              <li>Você atende em local fixo ou em movimento (delivery, feiras, domicílio)?</li>
              <li>Seu cliente costuma pagar parcelado no crédito?</li>
              <li>Você precisa de tela para exibir valor e bandeiras?</li>
              <li>A bateria precisa durar o dia todo sem recarregar?</li>
              <li>Você precisa de relatório de vendas integrado?</li>
            </ul>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Quanto mais você vende e mais depende da maquininha, mais faz sentido investir em um modelo
              robusto. Para quem está começando ou vende pouco, o app ou um modelo mais simples resolve bem.
            </p>

            <h2 className="font-serif text-3xl mb-4">Vendas no cartão e o faturamento do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Um ponto importante: todo valor recebido no cartão soma para o faturamento anual do MEI
              (limite de R$ 81.000). Não existe distinção entre Pix, dinheiro ou cartão — tudo conta.
            </p>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Isso significa que controlar o que entra pela maquininha ajuda diretamente a evitar surpresas
              na hora de entregar a DASN-SIMEI. Maquininhas com relatório integrado facilitam esse controle.
            </p>
            <Link
              href="/mei/organizar-faturamento-maquininha"
              className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
            >
              Como organizar o faturamento da maquininha para a DASN-SIMEI →
            </Link>

            <div className="mt-8 border border-[#0A0A0A]/10 p-5">
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Leituras úteis</p>
              <p className="text-sm opacity-70 mb-3">
                Se você quer organizar melhor o caixa antes de comprar mais ferramenta, veja o hub de leituras para MEI.
              </p>
              <Link href="/mei/leitura-financeira-para-mei" className="text-sm font-semibold underline hover:opacity-70 transition">
                → Leituras para MEI
              </Link>
            </div>

            {/* Calculadora */}
            <div className="mt-10">
              <CalculadoraVendasCartao />
            </div>

            {/* CTA produto */}
            <div className="mt-10">
              <MaquininhaAfiliado
                product="point-smart-2"
                context="Para MEI que quer começar com praticidade, tela e relatórios"
              />
            </div>

            {/* FAQ */}
            <h2 className="font-serif text-3xl mt-12 mb-6">Perguntas frequentes</h2>
            <div className="space-y-6 mb-12">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-[#0A0A0A]/10 pb-5">
                  <p className="font-semibold mb-2">{faq.question}</p>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Aviso */}
            <p className="text-xs opacity-40 border-t border-[#0A0A0A]/10 pt-6 mb-8 leading-relaxed">
              Alguns links desta página são de indicação. Antes de contratar qualquer solução, confira
              diretamente no Mercado Pago as taxas, modelos e condições vigentes. Este conteúdo é informativo
              e foi pensado para ajudar MEIs a escolherem melhor como receber de seus clientes.
            </p>

            <BlogCTA variant="footer" topic="mei" />
            <MeiGuiasRelacionados currentSlug="maquininha-para-mei" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-mei" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
