import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Maquininha Mercado Pago para MEI: vale a pena?",
  description:
    "Análise honesta das maquininhas do Mercado Pago para MEI: taxas, conectividade, prazo de repasse, controle de faturamento e quando faz sentido contratar.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/maquininha-mercado-pago-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Maquininha Mercado Pago para MEI: vale a pena?",
    description: "Análise honesta das soluções de maquininha do Mercado Pago para microempreendedores.",
    url: "https://irpf.qaplay.com.br/mei/maquininha-mercado-pago-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Maquininha Mercado Pago para MEI — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maquininha Mercado Pago para MEI: vale a pena?",
    description: "Análise honesta das maquininhas Mercado Pago para MEI.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Mercado Pago aceita MEI?",
    answer:
      "Sim. O Mercado Pago aceita tanto pessoa física (CPF) quanto MEI (CNPJ). Para organizar melhor o faturamento, é recomendado cadastrar pelo CNPJ do MEI.",
  },
  {
    question: "A conta Mercado Pago conta como conta PJ para MEI?",
    answer:
      "A conta Mercado Pago pode ser aberta com CNPJ, separando os recebimentos da conta pessoal. Isso facilita o controle do faturamento e a preparação para a DASN-SIMEI.",
  },
  {
    question: "Qual a taxa da maquininha Mercado Pago para MEI?",
    answer:
      "As taxas variam por modalidade (débito, crédito à vista, parcelado) e por plano. Consulte as condições vigentes diretamente no site do Mercado Pago antes de contratar, pois taxas podem mudar.",
  },
  {
    question: "Mercado Pago tem taxa mensal para MEI?",
    answer:
      "Alguns modelos de Point não têm mensalidade — você paga apenas a taxa por transação. Outros planos podem ter cobrança fixa em troca de taxas menores. Verifique o modelo desejado antes de contratar.",
  },
  {
    question: "Quanto tempo leva para o dinheiro cair na conta pelo Mercado Pago?",
    answer:
      "No débito, geralmente em até 1 dia útil. No crédito à vista, entre 14 e 30 dias. Existe opção de antecipação de recebíveis com custo adicional. Consulte prazos atuais no Mercado Pago.",
  },
];

export default function MaquininhaMercadoPagoPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "Maquininha Mercado Pago para MEI", url: "https://irpf.qaplay.com.br/mei/maquininha-mercado-pago-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Maquininha Mercado Pago para MEI: vale a pena?"
        description="Análise honesta das maquininhas do Mercado Pago para MEI: taxas, prazos, conectividade e quando contratar."
        url="https://irpf.qaplay.com.br/mei/maquininha-mercado-pago-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Maquininha Mercado Pago para MEI — Consultoria NSB"
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
          <span className="opacity-70">Maquininha Mercado Pago</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Avaliação — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Maquininha Mercado Pago para MEI: vale a pena?
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">O que você vai encontrar</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>O que o Mercado Pago oferece para MEI</li>
                <li>Modelos disponíveis: Point e App</li>
                <li>Pontos positivos e negativos honestos</li>
                <li>Quando vale contratar — e quando não vale</li>
                <li>Como isso afeta seu faturamento e declaração</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              O Mercado Pago é uma das opções mais acessíveis para MEI que quer aceitar cartão. Mas &quot;vale a pena&quot; depende de fatores que vão além da marca: tipo de negócio, volume de vendas, necessidade de relatórios e organização do faturamento.
            </p>

            <h2 className="font-serif text-3xl mb-4">O que o Mercado Pago oferece para MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O Mercado Pago disponibiliza para MEI:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li><strong>Maquininhas Point</strong> (Pro 3 e Smart 2): para venda presencial</li>
              <li><strong>Link de pagamento</strong>: para cobrar pelo celular ou WhatsApp</li>
              <li><strong>Conta Mercado Pago</strong>: pode ser aberta com CNPJ do MEI</li>
              <li><strong>QR Code/Pix</strong>: recebimento pelo app sem maquininha</li>
              <li><strong>Relatório de vendas</strong>: no app e no painel web</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">O que funciona bem</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Fácil de contratar: sem burocracia, sem análise longa de crédito</li>
              <li>Aceita MEI desde o início, com ou sem histórico de faturamento</li>
              <li>App com relatório de vendas, útil para organizar o faturamento</li>
              <li>Pix integrado para quem não tem maquininha</li>
              <li>Link de pagamento para venda remota sem maquininha</li>
              <li>Conectividade 4G nas maquininhas Point (sem depender de Wi-Fi)</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">O que exige atenção</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Taxas: verifique sempre as condições vigentes antes de assinar. Podem mudar.</li>
              <li>Prazo de repasse no crédito: geralmente 14 a 30 dias (antecipação tem custo)</li>
              <li>Suporte: canal online predominante — quem prefere atendimento telefônico pode ter dificuldade</li>
              <li>Comparar com outras opções do mercado antes de decidir</li>
            </ul>

            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ Lembrete fiscal importante</strong>
              <p className="text-sm opacity-70">
                Tudo que você receber pela maquininha — débito, crédito ou Pix — entra no faturamento bruto do MEI. Guarde os comprovantes e relatórios mensais para declarar corretamente na DASN-SIMEI.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Quando a maquininha Mercado Pago faz sentido</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Você está começando e quer uma solução acessível sem burocracia</li>
              <li>Vende presencialmente e precisa de conectividade 4G</li>
              <li>Quer link de pagamento para cobrar pelo WhatsApp</li>
              <li>Quer conta digital com CNPJ para separar do pessoal</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Quando talvez não faça sentido</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Você já tem outra maquininha com taxas melhores para seu perfil de vendas</li>
              <li>Todo o seu recebimento é via Pix e dinheiro (maquininha seria subutilizada)</li>
              <li>Você precisa de integração com sistema de gestão específico que o MP não suporta</li>
            </ul>

            <MaquininhaAfiliado product="point-pro-3" context="Para MEI com venda presencial, balcão ou delivery — conectividade 4G e bateria longa." />
            <MaquininhaAfiliado product="point-smart-2" context="Para MEI que precisa de tela touchscreen, relatórios e solução mais completa." />

            <div className="bg-preto text-white p-6 mb-8 mt-10">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Antes de contratar qualquer maquininha</p>
              <h3 className="font-serif text-xl mb-3">Organize como vai controlar o faturamento do seu MEI</h3>
              <p className="text-sm text-white/70 mb-5 leading-relaxed">
                Maquininha sem controle do faturamento pode gerar erro na DASN-SIMEI. Nilson Brites orienta como organizar seus recebimentos e declarar corretamente.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Quero organizar o faturamento do meu MEI antes de contratar maquininha.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde text-preto px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-verde/90 transition"
              >
                Falar sobre meu MEI →
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

            <MeiGuiasRelacionados currentSlug="maquininha-mercado-pago-para-mei" max={4} includePrincipal />
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
