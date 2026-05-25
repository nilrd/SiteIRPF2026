import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pix ou maquininha para MEI: o que faz mais sentido?",
  description:
    "Pix ou maquininha para MEI? Compare custo, aceitação e controle de faturamento para escolher a melhor forma de receber no seu negócio.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/pix-ou-maquininha-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pix ou maquininha para MEI: o que faz mais sentido?",
    description: "Compare Pix e maquininha para MEI: custo, aceitação e impacto no faturamento e declaração.",
    url: "https://irpf.qaplay.com.br/mei/pix-ou-maquininha-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Pix ou maquininha para MEI — NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pix ou maquininha para MEI: o que faz mais sentido?",
    description: "Compare Pix e maquininha para MEI e descubra qual faz mais sentido para o seu negócio.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Pix é mais barato que maquininha para MEI?",
    answer:
      "Sim para recebimentos instantâneos. Pix não cobra taxa sobre a transação — você recebe o valor integral. A maquininha cobra uma taxa por transação (geralmente 1% a 3,5% dependendo da bandeira, prazo e operadora). Para MEI com margens apertadas, o Pix pode ser muito mais vantajoso.",
  },
  {
    question: "Posso usar Pix e maquininha ao mesmo tempo no meu MEI?",
    answer:
      "Sim. A maioria dos MEIs usa os dois. Pix para quem quer pagar rapidamente pelo celular; maquininha para quem prefere cartão de crédito ou débito. Ter as duas opções aumenta as chances de conversão.",
  },
  {
    question: "Cliente pode pagar no crédito pelo Pix?",
    answer:
      "Não. O Pix é sempre à vista — o valor é debitado instantaneamente da conta do pagador. Para vendas parceladas no crédito, é necessário uma maquininha ou link de pagamento com suporte a parcelamento.",
  },
  {
    question: "Pix e maquininha contam igual no faturamento do MEI?",
    answer:
      "Sim. Todo recebimento — Pix, cartão de débito, crédito, dinheiro ou boleto — soma para o faturamento bruto anual do MEI que deve ser declarado na DASN-SIMEI. Não importa a forma de pagamento.",
  },
  {
    question: "Qual a melhor forma de receber Pix como MEI?",
    answer:
      "O ideal é receber Pix em uma chave vinculada ao CNPJ do MEI (conta PJ ou digital empresarial). Isso mantém a separação das finanças pessoais e facilita o controle do faturamento. Muitos bancos digitais oferecem conta PJ gratuita para MEI.",
  },
];

export default function PixOuMaquininhaParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "Pix ou maquininha?", url: "https://irpf.qaplay.com.br/mei/pix-ou-maquininha-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Pix ou maquininha para MEI: o que faz mais sentido?"
        description="Compare Pix e maquininha para MEI em custo, aceitação, controle de faturamento e declaração."
        url="https://irpf.qaplay.com.br/mei/pix-ou-maquininha-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Pix ou maquininha para MEI — NSB"
        datePublished="2026-05-24"
        dateModified="2026-05-24"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <Link href="/mei/receber-pagamentos" className="hover:opacity-100 transition">Receber Pagamentos</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Pix ou maquininha?</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Formas de receber — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Pix ou maquininha para MEI: o que faz mais sentido?
            </h1>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Essa é uma das dúvidas mais comuns de MEIs que estão começando ou que querem otimizar os custos. A resposta honesta é: <strong>depende do seu negócio</strong>. Mas existe uma estrutura clara para decidir.
            </p>

            <h2 className="font-serif text-3xl mb-4">Comparativo rápido: Pix vs Maquininha</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-4 font-bold">Critério</th>
                    <th className="text-left py-3 pr-4 font-bold">Pix</th>
                    <th className="text-left py-3 font-bold">Maquininha</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Custo por transação</td>
                    <td className="py-3 pr-4 text-verde font-bold">Gratuito</td>
                    <td className="py-3">1% a 3,5%+ (varia)</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Parcelamento</td>
                    <td className="py-3 pr-4">Não</td>
                    <td className="py-3">Sim (crédito)</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Aceitação pelo cliente</td>
                    <td className="py-3 pr-4">Alta (smartphones)</td>
                    <td className="py-3">Alta (cartões físicos)</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Prazo para receber</td>
                    <td className="py-3 pr-4">Instantâneo</td>
                    <td className="py-3">Débito: D+1 / Crédito: 30+ dias</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Relatório de vendas</td>
                    <td className="py-3 pr-4">Via extrato bancário</td>
                    <td className="py-3">Relatório no app da operadora</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Uso ideal</td>
                    <td className="py-3 pr-4">Tickets menores, pagamentos rápidos</td>
                    <td className="py-3">Tickets maiores, parcelamento</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Hardware necessário</td>
                    <td className="py-3 pr-4">Apenas celular</td>
                    <td className="py-3">Maquininha (aluguel ou compra)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-3xl mb-4">Quando Pix é suficiente</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Seus clientes pagam sempre via celular, sem resistência</li>
              <li>Seu ticket médio é baixo (até R$ 100–150)</li>
              <li>Você não tem margem para pagar taxas de maquininha</li>
              <li>Você vende online ou por WhatsApp (não presencialmente)</li>
              <li>Seu público é jovem e habituado a apps de pagamento</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Quando a maquininha vale a pena</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Parte dos seus clientes paga apenas no cartão</li>
              <li>Seu ticket médio é alto e parcelamento facilita a decisão</li>
              <li>Você tem ponto físico (restaurante, salão, loja, feira)</li>
              <li>Você precisa de relatórios organizados por tipo de pagamento</li>
              <li>Quer aumentar o ticket médio com opção de parcelamento</li>
            </ul>

            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ Ambos contam como faturamento do MEI</strong>
              <p className="text-sm opacity-70">
                Seja qual for a forma de recebimento — Pix, débito, crédito ou dinheiro — tudo entra no faturamento bruto que você declara na DASN-SIMEI. Fique atento ao limite de R$ 81.000/ano.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">A opção híbrida: Pix + conta Mercado Pago</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Uma alternativa prática é usar o <strong>app do Mercado Pago</strong> para centralizar Pix e pagamentos por cartão em um só lugar — com conta digital gratuita para MEI. Você recebe Pix sem taxa e tem acesso a cobranças por link de pagamento quando precisar.
            </p>

            <MaquininhaAfiliado
              product="app-mercado-pago"
              context="Centralize Pix e cobranças por link em um único app — gratuito para MEI."
            />

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Decisão certa para o seu negócio</p>
              <h3 className="font-serif text-xl mb-3">Pix, maquininha ou os dois? Vamos analisar juntos</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites analisa o perfil do seu MEI e indica a forma de recebimento mais eficiente para o seu caso — sem custo desnecessário.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Quero saber se vale mais a pena usar Pix ou maquininha no meu MEI.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde text-preto px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-verde/90 transition"
              >
                Falar no WhatsApp sobre meu MEI →
              </a>
            </div>

            <h2 className="font-serif text-3xl mb-6 mt-12">Dúvidas frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-preto/10 pb-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <MeiGuiasRelacionados currentSlug="pix-ou-maquininha-para-mei" max={4} includePrincipal />
            <BlogCTA variant="footer" topic="mei" />
          </div>

          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm />
          </aside>
        </div>
      </div>
    </main>
  );
}
