import type { Metadata } from "next";
import Link from "next/link";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Point Pro 3 para MEI: análise completa para quem vende muito",
  description:
    "Análise da Point Pro 3 para MEI. Saiba quando ela vale a pena, para qual perfil de negócio é indicada e o que analisar antes de contratar.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/point-pro-3-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Point Pro 3 para MEI: análise completa",
    description: "Point Pro 3 para MEI — bateria, 4G e robustez para quem vende muito.",
    url: "https://irpf.qaplay.com.br/mei/point-pro-3-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Point Pro 3 para MEI" }],
  },
};

const faqs = [
  {
    question: "A Point Pro 3 funciona sem Wi-Fi?",
    answer:
      "Sim. A Point Pro 3 tem chip 4G próprio, então funciona sem depender de Wi-Fi. Isso a torna ideal para quem trabalha em locais sem rede confiável — feiras, eventos, entregas a domicílio.",
  },
  {
    question: "Point Pro 3 aceita parcelamento?",
    answer:
      "Sim. A Point Pro 3 aceita parcelamento no crédito. As condições e tarifas para cada prazo variam — confira as taxas atualizadas diretamente no Mercado Pago.",
  },
  {
    question: "Qual a diferença entre Point Pro 3 e Point Smart 2?",
    answer:
      "A Point Pro 3 tem 4G (funciona sem Wi-Fi), bateria de maior capacidade e é mais robusta para uso intenso. A Point Smart 2 funciona apenas por Wi-Fi, mas tem uma tela touchscreen maior e é indicada para ambientes fixos.",
  },
  {
    question: "A Point Pro 3 tem mensalidade?",
    answer:
      "Não há mensalidade fixa na estrutura atual do Mercado Pago — você paga somente a taxa por transação. Verifique as condições vigentes diretamente no Mercado Pago antes de contratar.",
  },
];

export default function PointPro3ParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Point Pro 3 para MEI", url: "https://irpf.qaplay.com.br/mei/point-pro-3-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Point Pro 3 para MEI: análise completa para quem vende muito"
        description="Análise da Point Pro 3 para MEI — quando vale a pena, para qual perfil é indicada."
        url="https://irpf.qaplay.com.br/mei/point-pro-3-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Point Pro 3 para MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Point Pro 3 para MEI: análise para quem vende muito
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              A Point Pro 3 é a maquininha mais robusta da linha do Mercado Pago — bateria de longa duração,
              4G integrado e aceita todas as formas de pagamento. Se você faz delivery, trabalha em feira
              ou tem um volume alto de vendas, ela provavelmente é a melhor escolha.
            </p>

            <h2 className="font-serif text-2xl mb-4">Para quem a Point Pro 3 é indicada?</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Entregadores, motoboys e MEI que fazem delivery</li>
              <li>Feirantes e vendedores em eventos externos</li>
              <li>Barbearias e estabelecimentos com alto volume de atendimentos</li>
              <li>Comerciantes com ponto fixo que atendem muitos clientes por dia</li>
              <li>Qualquer MEI que precise de uma maquininha independente de Wi-Fi</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Diferenciais da Point Pro 3</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>4G integrado — funciona em qualquer lugar com cobertura de celular</li>
              <li>Bateria de longa duração para uso o dia inteiro</li>
              <li>Aceita todas as bandeiras: Visa, Mastercard, Elo, Amex, Hipercard</li>
              <li>Aceita NFC, tarja, chip, vale-alimentação e vale-refeição</li>
              <li>Parcelamento no crédito disponível</li>
              <li>Relatórios de vendas no app Mercado Pago</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Quando a Point Smart 2 pode ser melhor?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Se você atende em local fixo com Wi-Fi confiável e prioriza uma tela touchscreen maior para
              o cliente digitar a senha, a Point Smart 2 pode ser mais prática.
              Para volume baixo ou moderado em ambiente fixo, a Smart 2 entrega bem.
            </p>
            <Link
              href="/mei/point-smart-2-para-mei"
              className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
            >
              Ver análise completa da Point Smart 2 →
            </Link>

            {/* CTA */}
            <div className="mt-10">
              <MaquininhaAfiliado
                product="point-pro-3"
                context="Para MEI que trabalha em movimento, faz delivery ou atende muito"
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
            <MeiGuiasRelacionados currentSlug="point-pro-3-para-mei" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="point-pro-3-para-mei" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
