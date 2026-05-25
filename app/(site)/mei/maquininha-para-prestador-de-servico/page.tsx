import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import QuizMaquininha from "@/components/site/QuizMaquininha";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para prestador de serviço MEI: guia completo",
  description:
    "Guia para prestador de serviço formalizado como MEI escolher a maquininha certa. Saiba qual opção se adapta ao seu tipo de atendimento.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-prestador-de-servico" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para prestador de serviço MEI",
    description: "Qual maquininha é indicada para prestadores de serviço formalizados como MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-prestador-de-servico",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para prestador de serviço MEI" }],
  },
};

const faqs = [
  {
    question: "Prestador de serviço MEI pode ter maquininha?",
    answer:
      "Sim. Qualquer MEI pode contratar maquininha — incluindo eletricistas, pintores, encanadores, fotógrafos, técnicos e qualquer outro prestador de serviço formalizado.",
  },
  {
    question: "Qual maquininha é boa para quem atende fora de casa?",
    answer:
      "Para quem atende em locais sem Wi-Fi confiável, a Point Pro 3 com 4G integrado é a mais indicada. Para quem atende em ambientes com Wi-Fi (consultório, estúdio, escritório), a Point Smart 2 atende bem.",
  },
  {
    question: "Prestador de serviço MEI que recebe por cartão precisa declarar?",
    answer:
      "Precisa entregar a DASN-SIMEI informando o faturamento bruto anual. Todo valor recebido — por cartão, Pix ou dinheiro — soma para esse faturamento. A declaração de IRPF pessoa física é separada e depende dos rendimentos pessoais do titular.",
  },
];

export default function MaquininhaParaPrestadorDeServico() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          {
            name: "Maquininha para prestador de serviço",
            url: "https://irpf.qaplay.com.br/mei/maquininha-para-prestador-de-servico",
          },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para prestador de serviço MEI: guia completo"
        description="Qual maquininha é indicada para prestadores de serviço MEI."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-prestador-de-servico"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para prestador de serviço MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para prestador de serviço MEI
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Pintor, eletricista, encanador, técnico de TI, fotógrafo, consultor, personal trainer —
              cada prestador de serviço tem um perfil diferente de atendimento. A maquininha certa
              depende de onde você atende e qual o volume de vendas no cartão.
            </p>

            <h2 className="font-serif text-2xl mb-4">Use o quiz para descobrir a opção certa para você</h2>
            <div className="mb-10">
              <QuizMaquininha />
            </div>

            <h2 className="font-serif text-2xl mb-4">Comparativo por tipo de prestação</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#0A0A0A]/20">
                    <th className="text-left py-2 pr-4 opacity-70 font-semibold">Perfil</th>
                    <th className="text-left py-2 font-semibold">Recomendação</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Atende em local fixo com Wi-Fi</td>
                    <td className="py-2">Point Smart 2</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Vai até a casa/empresa do cliente (sem Wi-Fi)</td>
                    <td className="py-2">Point Pro 3 (4G)</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Recebe raramente no cartão</td>
                    <td className="py-2">App Mercado Pago (link/NFC)</td>
                  </tr>
                  <tr className="border-b border-[#0A0A0A]/10">
                    <td className="py-2 pr-4">Vende pela internet / WhatsApp</td>
                    <td className="py-2">App Mercado Pago (link de pagamento)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA produtos */}
            <div className="space-y-6">
              <MaquininhaAfiliado
                product="point-smart-2"
                context="Para quem atende em local fixo com Wi-Fi disponível"
              />
              <MaquininhaAfiliado
                product="point-pro-3"
                context="Para quem atende em locais sem Wi-Fi ou precisa de muita bateria"
                hideDisclosure
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
            <MeiGuiasRelacionados currentSlug="maquininha-para-prestador-de-servico" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-prestador-de-servico" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
