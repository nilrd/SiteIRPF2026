import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para autônomo MEI: como começar a receber no cartão",
  description:
    "Guia para autônomo formalizado como MEI que quer aceitar cartão. Saiba qual maquininha é indicada para eletricistas, técnicos, professores e outros autônomos.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-autonomo" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para autônomo MEI",
    description: "Qual maquininha é indicada para autônomos formalizados como MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-autonomo",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para autônomo MEI" }],
  },
};

const faqs = [
  {
    question: "Autônomo MEI precisa de conta PJ para ter maquininha?",
    answer:
      "Não é obrigatório, mas é recomendado. Usar uma conta PJ com o CNPJ MEI separa os recebimentos do negócio das finanças pessoais e facilita o controle do faturamento para a DASN-SIMEI.",
  },
  {
    question: "Autônomo que recebe por maquininha precisa declarar IRPF?",
    answer:
      "Depende da renda total do titular. Como MEI, você entrega a DASN-SIMEI todo ano para declarar o faturamento da empresa. A declaração de IRPF pessoa física é separada e depende dos seus rendimentos pessoais.",
  },
  {
    question: "Qual maquininha é melhor para quem trabalha em casa ou no domicílio do cliente?",
    answer:
      "A Point Smart 2 é boa para uso em ambientes com Wi-Fi. Se você atende em locais sem Wi-Fi confiável, considere a Point Pro 3 que tem 4G integrado. Para quem recebe raramente no cartão, o app do Mercado Pago com link de pagamento pode ser suficiente.",
  },
];

export default function MaquininhaParaAutonomo() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para autônomo", url: "https://irpf.qaplay.com.br/mei/maquininha-para-autonomo" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para autônomo MEI: como começar a receber no cartão"
        description="Qual maquininha é indicada para autônomos formalizados como MEI."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-autonomo"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para autônomo MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para autônomo MEI
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Eletricista, encanador, técnico de informática, professor particular, designer freelancer —
              todo autônomo formalizado como MEI pode (e deve) aceitar cartão. Veja qual opção faz mais
              sentido para o seu perfil.
            </p>

            <h2 className="font-serif text-2xl mb-4">Por que o autônomo MEI precisa de maquininha?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Cada vez mais clientes pagam no débito ou crédito — especialmente em serviços de valor mais
              alto, onde o parcelamento faz diferença. Sem aceitar cartão, você perde vendas para
              concorrentes que oferecem essa opção.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Além disso, receber pelo cartão gera um extrato automático, o que facilita muito o controle
              do faturamento para a DASN-SIMEI — a declaração anual do MEI.
            </p>

            <h2 className="font-serif text-2xl mb-4">Qual maquininha para autônomo?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para a maioria dos autônomos MEI, a <strong>Point Smart 2</strong> é a melhor escolha:
            </p>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-6">
              <li>Tela touchscreen para o cliente ver o valor e digitar a senha</li>
              <li>Aceita débito, crédito, NFC e vale-refeição</li>
              <li>Sem mensalidade — você paga somente a taxa por transação</li>
              <li>Relatório de vendas integrado ao app</li>
              <li>Funciona por Wi-Fi — ideal para quem trabalha em casa ou em locais fixos</li>
            </ul>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Se você atende em locais sem Wi-Fi ou precisa de bateria para um dia inteiro de trabalho externo,
              a Point Pro 3 (com 4G) pode ser mais adequada.
            </p>

            {/* CTA */}
            <MaquininhaAfiliado
              product="point-smart-2"
              context="Para autônomos que atendem em residências ou espaços com Wi-Fi"
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
            <MeiGuiasRelacionados currentSlug="maquininha-para-autonomo" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-autonomo" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
