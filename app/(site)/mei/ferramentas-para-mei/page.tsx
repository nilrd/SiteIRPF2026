import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Ferramentas para MEI: recebimentos, controle e declaração",
  description:
    "As melhores ferramentas para MEI receber pagamentos, organizar o faturamento e declarar DASN-SIMEI e IRPF. Maquininha, app e conta digital.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/ferramentas-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ferramentas para MEI: recebimentos, controle e declaração",
    description: "Maquininha, conta digital, DASN-SIMEI, IRPF: as ferramentas que todo MEI precisa conhecer.",
    url: "https://irpf.qaplay.com.br/mei/ferramentas-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Ferramentas para MEI — NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferramentas para MEI: recebimentos, controle e declaração",
    description: "As ferramentas essenciais para MEI: maquininha, conta PJ, declaração e IRPF.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Quais são as ferramentas essenciais para um MEI?",
    answer:
      "Todo MEI precisa de: (1) uma forma de receber pagamentos (maquininha e/ou Pix), (2) uma conta PJ separada da pessoal, (3) um método de controle de faturamento (planilha ou app), (4) acesso ao portal do Simples Nacional para a DASN-SIMEI, e (5) apoio contábil para o IRPF quando necessário.",
  },
  {
    question: "Preciso de aplicativo de gestão para MEI?",
    answer:
      "Não obrigatoriamente. Uma planilha simples e o relatório da maquininha já resolvem para a maioria dos MEIs. Aplicativos de gestão são úteis quando o volume de vendas é alto e você precisa de NFS-e, controle de estoque ou gestão de clientes.",
  },
  {
    question: "MEI precisa pagar contador?",
    answer:
      "A DASN-SIMEI pode ser entregue sem contador, pelo gov.br, gratuitamente. Mas o IRPF da pessoa física pode exigir orientação especializada — especialmente se houver pró-labore, sócio, ganho de capital ou rendimentos variados. Um contador evita erros caros.",
  },
  {
    question: "Qual app de controle financeiro é bom para MEI?",
    answer:
      "Para MEIs que usam Mercado Pago, o próprio app já oferece relatório de vendas, agenda financeira e conta digital. Para controles mais avançados, planilhas do Google ou apps como Granatum e Organizze são opções acessíveis.",
  },
  {
    question: "MEI precisa emitir nota fiscal para vender?",
    answer:
      "Depende da atividade e do cliente. Vendas de produto podem exigir NF-e dependendo do estado. Serviços para empresas costumam exigir NFS-e. Para consumidor final pessoa física, muitos MEIs não são obrigados — mas é bom verificar com a prefeitura ou um contador.",
  },
];

export default function FerramentasParaMei() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Ferramentas para MEI", url: "https://irpf.qaplay.com.br/mei/ferramentas-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Ferramentas para MEI: recebimentos, controle financeiro e declaração"
        description="As melhores ferramentas para MEI receber pagamentos, organizar o faturamento e declarar DASN-SIMEI e IRPF."
        url="https://irpf.qaplay.com.br/mei/ferramentas-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Ferramentas para MEI — NSB"
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
          <span className="opacity-70">Ferramentas para MEI</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Hub de ferramentas — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Ferramentas para MEI: recebimentos, controle financeiro e declaração
            </h1>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Ser MEI não exige tecnologia sofisticada — mas exige <strong>as ferramentas certas</strong> para receber pagamentos, controlar o faturamento e cumprir as obrigações fiscais sem dor de cabeça. Este guia centraliza tudo.
            </p>

            {/* RECEBIMENTOS */}
            <h2 className="font-serif text-3xl mb-4">1. Maquininha de cartão</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para MEIs que vendem presencialmente ou precisam de parcelamento no crédito, uma maquininha é essencial. As opções mais populares para MEI são:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-6 list-disc pl-5">
              <li>
                <Link href="/mei/melhor-maquininha-para-mei" className="underline hover:opacity-100">
                  Comparativo: qual a melhor maquininha para MEI
                </Link>
              </li>
              <li>
                <Link href="/mei/point-mercado-pago-para-mei" className="underline hover:opacity-100">
                  Point Pro 3 vs Point Smart 2 — qual escolher
                </Link>
              </li>
              <li>
                <Link href="/mei/maquininha-mercado-pago-para-mei" className="underline hover:opacity-100">
                  Mercado Pago para MEI: avaliação honesta
                </Link>
              </li>
            </ul>

            <MaquininhaAfiliado
              product="point-pro-3"
              context="Maquininha robusta para MEI com alto volume de vendas presenciais."
            />

            <MaquininhaAfiliado
              product="point-smart-2"
              context="Maquininha compacta com app integrado para controle de recebimentos."
              hideDisclosure={true}
            />

            {/* CONTA DIGITAL */}
            <h2 className="font-serif text-3xl mb-4 mt-10">2. Conta digital PJ</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              MEI deve ter uma conta separada para o negócio — evita misturar finanças pessoais com faturamento, facilita o controle e é essencial para a DASN-SIMEI. Muitas opções são gratuitas:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-6 list-disc pl-5">
              <li>Mercado Pago (conta PJ gratuita + chave Pix CNPJ)</li>
              <li>Nubank PJ (conta corrente PJ sem mensalidade)</li>
              <li>Banco Inter PJ (conta, cartão e Pix gratuitos)</li>
              <li>C6 Bank PJ, Santander MEI, Caixa MEI (também disponíveis)</li>
            </ul>

            <MaquininhaAfiliado
              product="app-mercado-pago"
              context="Conta digital PJ gratuita para MEI com Pix, cartão e relatório de vendas."
              hideDisclosure={true}
            />

            <p className="text-[10px] opacity-40 mt-3 mb-8">
              * Links acima são de parceiro (Mercado Pago). Condições vigentes na data de acesso.
              Consulte sempre o site oficial para taxas e disponibilidade atualizadas.
            </p>

            {/* FATURAMENTO */}
            <h2 className="font-serif text-3xl mb-4">3. Controle de faturamento</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Organizar o faturamento mensalmente é a base para uma declaração anual tranquila. Veja como fazer:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-6 list-disc pl-5">
              <li>
                <Link href="/mei/organizar-faturamento-maquininha" className="underline hover:opacity-100">
                  Como organizar o faturamento do MEI com maquininha
                </Link>
              </li>
              <li>
                <Link href="/mei/mei-vender-no-cartao" className="underline hover:opacity-100">
                  Como controlar recebimentos no cartão (e o que conta no faturamento)
                </Link>
              </li>
              <li>
                <Link href="/mei/pix-ou-maquininha-para-mei" className="underline hover:opacity-100">
                  Pix ou maquininha: qual faz mais sentido para o seu MEI?
                </Link>
              </li>
            </ul>

            {/* DECLARAÇÃO */}
            <h2 className="font-serif text-3xl mb-4">4. Declaração anual (DASN-SIMEI)</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Todo MEI ativo deve declarar o faturamento anual até 31 de maio. É gratuito e feito pelo gov.br. Veja como funciona:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>
                <Link href="/mei/declaracao-anual" className="underline hover:opacity-100">
                  Guia completo: Declaração Anual do MEI (DASN-SIMEI)
                </Link>
              </li>
              <li>
                <Link href="/mei/mei-recebe-maquininha-precisa-declarar" className="underline hover:opacity-100">
                  MEI que recebe por maquininha: como declarar
                </Link>
              </li>
            </ul>

            {/* IRPF */}
            <h2 className="font-serif text-3xl mb-4">5. IRPF do MEI (quando obrigatório)</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Além da DASN-SIMEI, o MEI pode ter obrigação de declarar IRPF como pessoa física — dependendo da renda total anual. Saiba quando:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>
                <Link href="/mei/mei-e-irpf" className="underline hover:opacity-100">
                  MEI e IRPF: quando o microempreendedor precisa declarar IR
                </Link>
              </li>
              <li>
                <Link href="/mei/dividas-parcelamento" className="underline hover:opacity-100">
                  MEI com dívidas: como parcelar o DAS atrasado
                </Link>
              </li>
            </ul>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Consultoria MEI completa</p>
              <h3 className="font-serif text-xl mb-3">Da maquininha à declaração: tudo em um lugar</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites orienta MEIs em todo o Brasil na escolha das ferramentas certas, controle de faturamento e declarações obrigatórias. 100% online.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Sou MEI e preciso de orientação sobre ferramentas de recebimento, controle financeiro e declaração.")}`}
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

            <MeiGuiasRelacionados currentSlug="ferramentas-para-mei" max={4} includePrincipal />
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
