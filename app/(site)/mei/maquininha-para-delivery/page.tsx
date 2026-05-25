import type { Metadata } from "next";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha para delivery MEI: a melhor opção com bateria e 4G",
  description:
    "Guia para motoboy e entregador MEI que quer receber no cartão durante as entregas. Saiba qual maquininha tem bateria, 4G e funciona bem na rua.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-para-delivery" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha para delivery MEI",
    description: "Qual maquininha tem bateria e 4G para motoboys e entregadores MEI.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-para-delivery",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha para delivery MEI" }],
  },
};

const faqs = [
  {
    question: "Entregador autônomo MEI pode ter maquininha de cartão?",
    answer:
      "Sim. Qualquer MEI pode contratar maquininha. Entregadores e motoboys formalizados como MEI podem aceitar cartão nas entregas normalmente.",
  },
  {
    question: "A maquininha para delivery precisa ter 4G?",
    answer:
      "Para uso na rua, o 4G é muito importante. Maquininhas que dependem só de Wi-Fi não funcionam durante as entregas. A Point Pro 3 tem chip 4G integrado e funciona em qualquer lugar com cobertura de celular.",
  },
  {
    question: "Recebimento por cartão em delivery entra no faturamento do MEI?",
    answer:
      "Sim. Todo valor recebido — por cartão, Pix ou dinheiro — soma para o faturamento bruto anual do MEI (limite de R$ 81.000). Esse valor precisa ser informado na DASN-SIMEI.",
  },
];

export default function MaquininhaParaDelivery() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Maquininha para delivery", url: "https://irpf.qaplay.com.br/mei/maquininha-para-delivery" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha para delivery MEI: a melhor opção com bateria e 4G"
        description="Qual maquininha tem bateria e 4G para entregadores e motoboys MEI."
        url="https://irpf.qaplay.com.br/mei/maquininha-para-delivery"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha para delivery MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Maquininha</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Maquininha para delivery MEI: bateria e 4G são essenciais
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Motoboy e entregador MEI precisam de uma maquininha que funcione longe do Wi-Fi, aguentem
              o dia inteiro de uso e processem pagamentos rápido na porta do cliente. A escolha errada
              significa maquininha travada, bateria morta e cliente indo embora sem pagar.
            </p>

            <h2 className="font-serif text-2xl mb-4">O que o delivery MEI precisa de uma maquininha</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>4G integrado — funciona sem depender de Wi-Fi na rua</li>
              <li>Bateria de longa duração para o dia inteiro de entregas</li>
              <li>Resistência — vai ficar no bolso ou na mochila durante o dia</li>
              <li>Processamento rápido — o cliente não quer esperar na porta</li>
              <li>Aceitar débito e crédito de todas as bandeiras</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Maquininha recomendada para delivery</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para entregadores e motoboys MEI, a <strong>Point Pro 3</strong> é a escolha mais indicada:
              tem 4G próprio (não precisa de Wi-Fi), bateria de longa duração, é robusta para uso externo
              e aceita todas as formas de pagamento.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Evite maquininhas que dependem exclusivamente de Wi-Fi — elas não funcionam na rua e
              criam situações constrangedoras na hora de cobrar o cliente.
            </p>

            {/* CTA */}
            <MaquininhaAfiliado
              product="point-pro-3"
              context="Para motoboys e entregadores MEI que precisam de 4G e bateria"
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
            <MeiGuiasRelacionados currentSlug="maquininha-para-delivery" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="maquininha-para-delivery" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
