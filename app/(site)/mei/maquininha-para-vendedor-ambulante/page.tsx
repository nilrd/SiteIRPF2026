import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para vendedor ambulante MEI: opções para feiras e rua",
  description:
    "Guia para feirantes e vendedores ambulantes formalizados como MEI. Saiba qual maquininha funciona ao ar livre, sem Wi-Fi e com bateria para o dia inteiro.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-vendedor-ambulante" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para vendedor ambulante MEI",
    description: "Qual maquininha funciona em feiras e ao ar livre para o vendedor ambulante MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-vendedor-ambulante",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para vendedor ambulante MEI" }],
  },
};

const faqs = [
  {
    question: "Vendedor ambulante pode se formalizar como MEI?",
    answer:
      "Sim. Vendedores ambulantes podem se formalizar como MEI em categorias como comércio varejista de alimentos, roupas ou outros produtos. A formalização permite ter CNPJ e contratar maquininha.",
  },
  {
    question: "Feirante MEI precisa de maquininha com 4G?",
    answer:
      "Para a maioria das feiras e eventos externos, sim — o Wi-Fi não é disponível. A Point Pro 3 com 4G integrado é a mais indicada para quem vende em locais sem internet fixa.",
  },
  {
    question: "Venda em feira entra no faturamento MEI?",
    answer:
      "Sim. Todo valor recebido — em dinheiro, Pix, cartão ou maquininha — soma para o faturamento bruto anual do MEI (limite de R$ 81.000). Esse valor precisa ser declarado na DASN-SIMEI.",
  },
];

export default function MaquininhaParaVendedorAmbulante() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para vendedor ambulante", url: "https://irpf.qaplay.com.br/mei/maquininha-para-vendedor-ambulante" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para vendedor ambulante MEI: opções para feiras e rua"
        description="Qual maquininha funciona em feiras e ao ar livre para o vendedor ambulante MEI."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-vendedor-ambulante"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para vendedor ambulante MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para vendedor ambulante e feirante MEI
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Feiras, eventos, mercados a céu aberto — quem vende ao ar livre enfrenta dois desafios:
              sem Wi-Fi e precisando de bateria para o dia todo. A escolha errada deixa você na mão
              na hora da venda. Veja o que funciona de verdade para vendedores ambulantes e feirantes MEI.
            </p>

            <h2 className="font-serif text-2xl mb-4">Por que 4G é indispensável para vendas externas</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Feiras e eventos raramente têm Wi-Fi disponível. Maquininhas que dependem de Wi-Fi
              simplesmente não processam o pagamento fora de ambientes com rede. O 4G integrado
              garante que a maquininha funcione em qualquer lugar com cobertura de celular.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Além disso, a bateria precisa aguentar um dia inteiro de feira — geralmente 6 a 8 horas
              ou mais. Maquininhas com bateria fraca travam no meio do expediente.
            </p>

            <h2 className="font-serif text-2xl mb-4">Maquininha recomendada para vendedor ambulante</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para feirantes e vendedores na rua, a <strong>Point Pro 3</strong> é a opção mais indicada:
              4G integrado, bateria de longa duração, robustez para uso externo e aceita todas as
              formas de pagamento.
            </p>

            {/* CTA */}
            <MaquininhaAfiliado
              product="point-pro-3"
              context="Para feirantes e vendedores ambulantes que trabalham ao ar livre"
            />

            <h2 className="font-serif text-2xl mt-10 mb-4">
              E se eu vender em feiras eventuais com pouco volume?
            </h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Se você participa de feiras poucas vezes ao mês e com volume baixo de cartão, o app
              do Mercado Pago com link de pagamento ou NFC pode ser suficiente — sem precisar comprar
              uma maquininha dedicada.
            </p>

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
            <MeiGuiasRelacionados currentSlug="maquininha-para-vendedor-ambulante" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-vendedor-ambulante" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
