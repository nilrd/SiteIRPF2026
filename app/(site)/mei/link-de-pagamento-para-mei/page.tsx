import type { Metadata } from "next";
import Link from "next/link";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import BlogCTA from "@/components/site/BlogCTA";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Link de pagamento para MEI: como criar e receber pelo celular",
  description:
    "Guia completo sobre link de pagamento para MEI. Como criar, enviar pelo WhatsApp e receber no cartão sem maquininha — passo a passo com Mercado Pago.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/link-de-pagamento-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Link de pagamento para MEI: como criar e receber",
    description: "Crie link de pagamento, envie pelo WhatsApp e receba no cartão sem maquininha.",
    url: "https://irpf.qaplay.com.br/mei/link-de-pagamento-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Link de pagamento para MEI" }],
  },
};

const faqs = [
  {
    question: "Link de pagamento é seguro para MEI receber?",
    answer:
      "Sim. Plataformas como o Mercado Pago processam o pagamento com criptografia e certificação de segurança. O cliente paga diretamente no ambiente da plataforma — você recebe sem expor dados bancários.",
  },
  {
    question: "MEI paga taxa para usar link de pagamento?",
    answer:
      "Sim. O link de pagamento cobra uma taxa sobre o valor da transação. A taxa varia conforme a bandeira e o prazo de recebimento. Consulte as condições atuais no Mercado Pago antes de usar.",
  },
  {
    question: "Precisa de CNPJ para criar link de pagamento no Mercado Pago?",
    answer:
      "Não obrigatoriamente — é possível usar o CPF. Mas para o MEI, o ideal é criar a conta PJ com o CNPJ para separar os recebimentos do negócio e facilitar o controle do faturamento.",
  },
  {
    question: "Venda por link de pagamento entra no faturamento do MEI?",
    answer:
      "Sim. Todo recebimento conta para o faturamento anual do MEI — inclusive vendas por link de pagamento, Pix, maquininha ou dinheiro. O limite é de R$ 81.000/ano.",
  },
];

export default function LinkDePagamentoParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
          { name: "Link de pagamento para MEI", url: "https://irpf.qaplay.com.br/mei/link-de-pagamento-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Link de pagamento para MEI: como criar e receber pelo celular"
        description="Guia completo sobre link de pagamento para MEI com Mercado Pago."
        url="https://irpf.qaplay.com.br/mei/link-de-pagamento-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Link de pagamento para MEI"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">MEI / Recebimentos</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Link de pagamento para MEI: receba no cartão sem maquininha
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              O link de pagamento permite que o MEI receba por cartão de crédito, débito e Pix sem
              precisar de maquininha. Você cria o link pelo app, envia pelo WhatsApp ou Instagram, e o
              cliente paga diretamente no celular ou computador. É a forma mais simples de começar a
              receber no cartão.
            </p>

            <h2 className="font-serif text-2xl mb-4">O que é link de pagamento</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Link de pagamento é uma URL gerada pela plataforma de pagamento (como o Mercado Pago) que
              direciona o cliente a uma página segura para concluir a compra. Você configura o valor,
              a descrição do produto/serviço e, se quiser, o número de parcelas disponíveis.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Depois de criado, você compartilha o link por qualquer canal: WhatsApp, Instagram, email,
              SMS ou qualquer site. O cliente acessa, escolhe a forma de pagamento e conclui — você
              recebe a notificação e o dinheiro cai na sua conta.
            </p>

            <h2 className="font-serif text-2xl mb-4">Como criar link de pagamento no Mercado Pago</h2>
            <ol className="text-sm opacity-70 space-y-3 list-decimal pl-5 mb-8">
              <li>Acesse o app do Mercado Pago ou o painel no site</li>
              <li>Vá em &ldquo;Cobrar&rdquo; ou &ldquo;Criar cobrança&rdquo;</li>
              <li>Defina o valor e a descrição do produto ou serviço</li>
              <li>Configure se o link é para uso único (uma venda específica) ou recorrente</li>
              <li>Copie o link e compartilhe pelo canal que preferir</li>
            </ol>

            <h2 className="font-serif text-2xl mb-4">Para quem o link de pagamento é ideal</h2>
            <ul className="text-sm opacity-70 space-y-2 list-disc pl-5 mb-8">
              <li>MEI que vende pela internet, WhatsApp ou redes sociais</li>
              <li>Prestadores que emitem orçamento e precisam receber antes de executar o serviço</li>
              <li>MEI que quer cobrar parcelado sem maquininha</li>
              <li>Quem quer testar vendas no cartão sem investimento em equipamento</li>
            </ul>

            <h2 className="font-serif text-2xl mb-4">Link de pagamento vs maquininha</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O link é mais prático para vendas remotas. A maquininha é melhor quando o cliente está
              presencialmente — especialmente para quem aceita muito pagamento por cartão físico em ambiente fixo.
            </p>
            <Link
              href="/mei/pix-ou-maquininha-para-mei"
              className="text-sm font-semibold underline hover:text-[#C6FF00] transition-colors"
            >
              Comparar Pix, link e maquininha para MEI →
            </Link>

            {/* CTA */}
            <div className="mt-10">
              <MaquininhaAfiliado
                product="app-mercado-pago"
                context="Para criar link de pagamento e receber por Pix, cartão e aproximação"
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
            <MeiGuiasRelacionados currentSlug="link-de-pagamento-para-mei" max={4} includePrincipal />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm origem="link-de-pagamento-para-mei" titulo="Dúvidas sobre MEI e declaração?" />
          </aside>
        </div>
      </div>
    </main>
  );
}
