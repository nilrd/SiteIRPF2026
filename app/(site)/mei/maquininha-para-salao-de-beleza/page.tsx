import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para salão de beleza MEI: qual a melhor opção?",
  description:
    "Guia para manicures, cabeleireiras e esteticistas MEI escolherem a maquininha certa. Saiba qual modelo combina com salão de beleza e ateliê.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-salao-de-beleza" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para salão de beleza MEI",
    description: "Qual maquininha é indicada para cabeleireiras, manicures e esteticistas MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-salao-de-beleza",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para salão de beleza" }],
  },
};

const faqs = [
  {
    question: "Cabeleireira MEI pode ter maquininha de cartão?",
    answer:
      "Sim. O MEI pode contratar maquininha no CNPJ normalmente. Cabeleireira, manicure, esteticista e outros profissionais de beleza formalizados como MEI podem aceitar débito, crédito e Pix pela maquininha.",
  },
  {
    question: "Qual maquininha é mais prática para salão de beleza?",
    answer:
      "A Point Smart 2 costuma ser uma boa escolha para salões: tela para o cliente, aceita NFC, crédito e débito, e tem relatórios de vendas integrados. Para salões com alto volume de atendimentos, a Point Pro 3 pode ser mais robusta.",
  },
  {
    question: "Recebimento por maquininha no salão conta para o faturamento MEI?",
    answer:
      "Sim. Todo valor recebido — pelo cartão, Pix ou dinheiro — soma para o faturamento bruto anual do MEI (limite de R$ 81.000). Manter controle das vendas pelo extrato da maquininha facilita a declaração na DASN-SIMEI.",
  },
];

export default function MaquininhaParaSalaoDeBeleza() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para salão de beleza", url: "https://irpf.qaplay.com.br/mei/maquininha-para-salao-de-beleza" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para salão de beleza MEI: qual a melhor opção?"
        description="Guia para profissionais de beleza MEI escolherem a maquininha certa."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-salao-de-beleza"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para salão de beleza MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para salão de beleza MEI
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Cabeleireira, manicure, designer de sobrancelha, micropigmentadora, esteticista — a maioria
              dos profissionais de beleza formalizados como MEI atende em ponto fixo, com Wi-Fi disponível.
              Isso facilita a escolha da maquininha certa.
            </p>

            <h2 className="font-serif text-2xl mb-4">O que o salão de beleza MEI precisa de uma maquininha</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Tela visível para o cliente — especialmente para quem atende em espaços amplos</li>
              <li>Aceitar débito e crédito parcelado — clientes costumam pagar serviços maiores parcelado</li>
              <li>NFC para pagamento por aproximação — agiliza no atendimento</li>
              <li>Relatório de vendas para controle do faturamento mensal</li>
              <li>Sem mensalidade para reduzir custo fixo</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Maquininha recomendada para salão</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para a maioria dos salões de beleza MEI, a <strong>Point Smart 2</strong> cobre todos esses pontos:
              tela touchscreen, NFC, aceita todas as bandeiras, sem mensalidade e com relatórios integrados.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Como o salão tem Wi-Fi fixo, a conectividade da Smart 2 não é um problema.
              Para quem atende em domicílio (como designer que vai até o cliente), a Point Pro 3 com 4G
              pode ser mais prática.
            </p>

            {/* CTA */}
            <MaquininhaAfiliado
              product="point-smart-2"
              context="Para cabeleireiras, manicures e profissionais de beleza que atendem em local fixo"
            />

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
            <MeiGuiasRelacionados currentSlug="maquininha-para-salao-de-beleza" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-salao-de-beleza" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
