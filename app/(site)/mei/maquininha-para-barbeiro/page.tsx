import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para barbeiro MEI: qual a melhor escolha para barbearia?",
  description:
    "Guia para barbeiro MEI escolher a maquininha de cartão certa. Saiba qual modelo é indicado para barbearias com alto volume de atendimentos.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-barbeiro" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para barbeiro MEI",
    description: "Qual maquininha é indicada para barbearias e barbeiros autônomos MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-barbeiro",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para barbeiro MEI" }],
  },
};

const faqs = [
  {
    question: "Barbeiro MEI pode ter maquininha de cartão?",
    answer:
      "Sim. O MEI pode contratar maquininha no CNPJ normalmente. Barbeiros formalizados como MEI podem aceitar cartão de débito, crédito e Pix no atendimento.",
  },
  {
    question: "Qual maquininha aguenta alto volume de uso em barbearia?",
    answer:
      "Para barbearias com muitos atendimentos por dia, a Point Pro 3 é a mais indicada por ser mais robusta, ter bateria de longa duração e suportar uso intenso. Para barbearias de menor movimento, a Point Smart 2 também atende bem.",
  },
  {
    question: "Recebimento por maquininha em barbearia entra no faturamento do MEI?",
    answer:
      "Sim. Todo valor recebido — pelo cartão, Pix ou dinheiro — soma para o faturamento bruto anual do MEI (limite de R$ 81.000). O extrato da maquininha ajuda a controlar esse valor para a declaração na DASN-SIMEI.",
  },
];

export default function MaquininhaParaBarbeiro() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para barbeiro", url: "https://irpf.qaplay.com.br/mei/maquininha-para-barbeiro" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para barbeiro MEI: qual a melhor escolha para barbearia?"
        description="Qual maquininha é indicada para barbeiros e barbearias MEI."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-barbeiro"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para barbeiro MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para barbeiro MEI
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Barbearia tem ritmo intenso — muitos atendimentos por dia, cliente na cadeira e ninguém
              quer esperar. A maquininha certa precisa ser rápida, confiável e não pode travar no meio
              do atendimento. Veja o que considerar para a sua barbearia MEI.
            </p>

            <h2 className="font-serif text-2xl mb-4">O que a barbearia MEI precisa de uma maquininha</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>Durabilidade para uso intenso ao longo do dia</li>
              <li>Bateria que aguenta o dia todo sem precisar recarregar</li>
              <li>Processamento rápido — sem deixar o cliente esperando</li>
              <li>Aceitar débito, crédito e aproximação (NFC)</li>
              <li>Wi-Fi estável ou 4G como backup</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Maquininha recomendada para barbearia</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para barbearias com alto volume de atendimentos, a <strong>Point Pro 3</strong> é a mais indicada:
              ela é robusta, tem bateria de longa duração, 4G e aceita todas as formas de pagamento.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Para barbearias menores ou com movimento mais tranquilo em ambiente com Wi-Fi fixo,
              a Point Smart 2 também é uma boa opção — com tela e NFC.
            </p>

            {/* CTA */}
            <MaquininhaAfiliado
              product="point-pro-3"
              context="Para barbearias com alto volume de atendimentos diários"
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
            <MeiGuiasRelacionados currentSlug="maquininha-para-barbeiro" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-barbeiro" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
