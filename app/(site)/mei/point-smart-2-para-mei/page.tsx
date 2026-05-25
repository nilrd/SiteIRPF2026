import type { Metadata } from "next";
import Link from "next/link";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Point Smart 2 para MEI: vale a pena? Análise completa",
  description:
    "Análise detalhada da Point Smart 2 para MEI. Veja para qual tipo de negócio ela é indicada, como funciona e o que esperar antes de comprar.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/point-smart-2-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Point Smart 2 para MEI: vale a pena?",
    description: "Análise da Point Smart 2 para MEI — tela, NFC, relatórios e taxas.",
    url: "https://irpf.qaplay.com.br/mei/point-smart-2-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Point Smart 2 para MEI" }],
  },
};

const faqs = [
  {
    question: "Point Smart 2 tem mensalidade para MEI?",
    answer:
      "A Point Smart 2 é vendida sem mensalidade fixa obrigatória. Você paga o aparelho e paga apenas a taxa de cada transação. Confira as condições atuais diretamente no Mercado Pago, pois podem mudar.",
  },
  {
    question: "Qual a diferença entre a Point Smart 2 e a Point Pro 3?",
    answer:
      "A Point Smart 2 tem tela touchscreen e é mais voltada para uso em balcão fixo e prestação de serviços com menor volume. A Point Pro 3 tem bateria maior, 4G e é mais robusta, pensada para alto volume, entregas e eventos.",
  },
  {
    question: "Point Smart 2 funciona sem internet?",
    answer:
      "A Point Smart 2 funciona por Wi-Fi. Para ambientes sem Wi-Fi estável, a Point Pro 3 com 4G é mais indicada.",
  },
  {
    question: "MEI pode comprar Point Smart 2 no CNPJ?",
    answer:
      "Sim. O MEI pode contratar a Point Smart 2 usando o CNPJ. É recomendado usar o CNPJ para manter a separação entre finanças pessoais e do negócio.",
  },
];

export default function PointSmart2ParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Point Smart 2 para MEI", url: "https://irpf.qaplay.com.br/mei/point-smart-2-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Point Smart 2 para MEI: vale a pena? Análise completa"
        description="Análise detalhada da Point Smart 2 para MEI."
        url="https://irpf.qaplay.com.br/mei/point-smart-2-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Point Smart 2 para MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Point Smart 2 para MEI: vale a pena comprar?
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              A Point Smart 2 é a maquininha do Mercado Pago com tela touchscreen, aceita aproximação (NFC),
              débito, crédito e vale-refeição. Se você presta serviço, atende em salão ou tem
              um pequeno comércio, ela é uma candidata forte. Veja a análise completa.
            </p>

            <h2 className="font-serif text-2xl mb-4">Para quem a Point Smart 2 é indicada?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A Point Smart 2 faz sentido especialmente para:
            </p>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Prestadores de serviço: eletricistas, encanadores, pintores, técnicos</li>
              <li>Profissionais de beleza: cabeleireiras, manicures, designers de sobrancelha</li>
              <li>Consultores, personal trainers, fotógrafos</li>
              <li>Pequenos comércios que atendem em ponto fixo com Wi-Fi</li>
              <li>MEI com volume médio de transações (até ~50 vendas/dia)</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Pontos positivos da Point Smart 2</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Tela colorida para o cliente acompanhar o valor e digitar a senha</li>
              <li>Aceita NFC (aproximação): cartão, relógio e celular</li>
              <li>Aceita débito, crédito, parcelado e vale-alimentação/refeição</li>
              <li>Relatórios de vendas integrados ao app Mercado Pago</li>
              <li>Sem mensalidade fixa (somente taxa por transação)</li>
              <li>Conta PJ Mercado Pago gratuita incluída</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Pontos de atenção</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Funciona por Wi-Fi — sem conexão, não processa</li>
              <li>Bateria mais curta que a Point Pro 3 — para uso intenso ou ao ar livre, avalie a Pro 3</li>
              <li>
                Taxas podem variar por bandeira e prazo de recebimento — confira condições atuais no site
                do Mercado Pago antes de contratar
              </li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Point Smart 2 vs Point Pro 3: qual escolher?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A decisão depende do seu tipo de uso:
            </p>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#0A0A0A]/20">
                    <th className="text-left py-2 pr-4 opacity-70 font-semibold">Critério</th>
                    <th className="text-left py-2 pr-4 font-semibold">Point Smart 2</th>
                    <th className="text-left py-2 font-semibold">Point Pro 3</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Conectividade</td>
                    <td className="py-2 pr-4">Wi-Fi</td>
                    <td className="py-2">Wi-Fi + 4G</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Bateria</td>
                    <td className="py-2 pr-4">Uso moderado</td>
                    <td className="py-2">Longa duração</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Tela</td>
                    <td className="py-2 pr-4">Sim</td>
                    <td className="py-2">Sim</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Ideal para</td>
                    <td className="py-2 pr-4">Balcão fixo, prestação de serviço</td>
                    <td className="py-2">Delivery, feiras, alto volume</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link
              href="/mei/point-pro-3-para-mei"
              className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
            >
              Ver análise completa da Point Pro 3 →
            </Link>

            {/* CTA */}
            <div className="mt-10">
              <MaquininhaAfiliado
                product="point-smart-2"
                context="Para prestadores de serviço, salões e quem usa em ponto fixo"
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
            <MeiGuiasRelacionados currentSlug="point-smart-2-para-mei" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="point-smart-2-para-mei" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
