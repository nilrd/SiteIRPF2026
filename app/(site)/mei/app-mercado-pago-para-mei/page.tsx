import type { Metadata } from "next";
import Link from "next/link";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "App Mercado Pago para MEI: receba por Pix, cartão e link sem maquininha",
  description:
    "Guia completo do App Mercado Pago para MEI. Descubra como receber Pix, cartão por aproximação e link de pagamento direto pelo celular, sem comprar maquininha.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/app-mercado-pago-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "App Mercado Pago para MEI: receba sem maquininha",
    description: "Pix, cartão por aproximação e link de pagamento via app — sem maquininha para o MEI.",
    url: "https://irpf.qaplay.com.br/mei/app-mercado-pago-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "App Mercado Pago para MEI" }],
  },
};

const faqs = [
  {
    question: "O app Mercado Pago é gratuito para MEI?",
    answer:
      "Sim. O download do app e a abertura de conta no Mercado Pago são gratuitos. Você paga apenas a taxa de cada transação quando recebe — sem mensalidade nem custo fixo.",
  },
  {
    question: "MEI pode usar o app Mercado Pago no CPF ou precisa do CNPJ?",
    answer:
      "Você pode usar o CPF, mas é recomendado criar a conta com o CNPJ do MEI. Isso separa as finanças pessoais das do negócio e facilita o controle do faturamento para a DASN-SIMEI.",
  },
  {
    question: "O app Mercado Pago aceita cartão de crédito sem maquininha?",
    answer:
      "Sim, via aproximação NFC (se o seu celular suportar) ou por link de pagamento. No link, o cliente paga com cartão diretamente pelo navegador, sem precisar de maquininha.",
  },
  {
    question: "Link de pagamento do Mercado Pago tem taxa?",
    answer:
      "Sim. O link de pagamento cobra uma taxa por transação. As taxas variam por bandeira e prazo de recebimento — consulte as condições atuais no site do Mercado Pago.",
  },
];

export default function AppMercadoPagoParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "App Mercado Pago para MEI", url: "https://irpf.qaplay.com.br/mei/app-mercado-pago-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="App Mercado Pago para MEI: receba por Pix, cartão e link sem maquininha"
        description="Guia completo do App Mercado Pago para MEI."
        url="https://irpf.qaplay.com.br/mei/app-mercado-pago-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="App Mercado Pago para MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Recebimentos</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              App Mercado Pago para MEI: receba sem maquininha
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Você não precisa comprar uma maquininha para começar a receber no cartão. Com o app do
              Mercado Pago, é possível receber por Pix, link de pagamento e até cartão por aproximação —
              tudo pelo celular, sem investimento inicial. Ideal para MEI que está começando ou tem
              volume baixo de vendas no cartão.
            </p>

            <h2 className="font-serif text-2xl mb-4">O que você consegue fazer pelo app</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Gerar e compartilhar link de pagamento pelo WhatsApp, Instagram ou qualquer canal</li>
              <li>Receber por Pix via QR Code ou chave — sem taxa para quem envia</li>
              <li>Cobrar por aproximação NFC (celulares compatíveis)</li>
              <li>Visualizar todo o histórico de recebimentos em um só lugar</li>
              <li>Separar conta PJ do CNPJ MEI das finanças pessoais</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Para quem o app é a melhor opção</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O app do Mercado Pago é ideal para:
            </p>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>MEI que acabou de se formalizar e quer testar sem gastar</li>
              <li>Prestadores de serviço que recebem na maioria pelo Pix e raramente no cartão</li>
              <li>Vendedores online que enviam link de pagamento para o cliente</li>
              <li>Quem quer vender pelas redes sociais ou WhatsApp sem maquininha</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Quando considerar uma maquininha</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Se você recebe muitos pagamentos no cartão por dia, ou se atende clientes que preferem passar
              o cartão fisicamente (crédito parcelado, por exemplo), uma maquininha pode ser mais prática
              e profissional.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/mei/point-smart-2-para-mei"
                className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
              >
                Ver Point Smart 2 →
              </Link>
              <Link
                href="/mei/point-pro-3-para-mei"
                className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
              >
                Ver Point Pro 3 →
              </Link>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <MaquininhaAfiliado
                product="app-mercado-pago"
                context="Para MEI que quer começar a receber sem investimento inicial"
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

            <p className="text-xs opacity-40 border-t border-[#0A0A0A]/10 pt-6 mb-8 leading-relaxed">
              Alguns links desta página são de indicação. Antes de contratar qualquer solução, confira
              diretamente no Mercado Pago as taxas, modelos e condições vigentes. Este conteúdo é informativo
              e foi pensado para ajudar MEIs a escolherem melhor como receber de seus clientes.
            </p>

            <BlogCTA variant="footer" topic="mei" />
            <MeiGuiasRelacionados currentSlug="app-mercado-pago-para-mei" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="app-mercado-pago-para-mei" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
