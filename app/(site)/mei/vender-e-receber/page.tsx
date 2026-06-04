import type { Metadata } from "next";
import Link from "next/link";
import QuizMaquininha from "@/components/site/QuizMaquininha";
import CalculadoraVendasCartao from "@/components/site/CalculadoraVendasCartao";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import { JsonLdBreadcrumb, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Guia do MEI para vender e receber melhor: Pix, cartão, app e maquininha",
  description:
    "Tudo que o MEI precisa saber para receber por Pix, cartão, maquininha e link de pagamento. Guia completo com recomendação por tipo de negócio.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Guia do MEI para vender e receber melhor",
    description: "Pix, cartão, app e maquininha para MEI — escolha a solução certa para o seu tipo de negócio.",
    url: "https://irpf.qaplay.com.br/mei/vender-e-receber",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Guia MEI para vender e receber" }],
  },
};

const GUIAS_FUNDAMENTAIS = [
  { href: "/mei/receber-pagamentos", title: "Como MEI pode receber pagamentos", desc: "Pix, cartão, link e maquininha: o que cada opção oferece." },
  { href: "/mei/pix-ou-maquininha-para-mei", title: "Pix ou maquininha para MEI?", desc: "Comparativo de custo, aceitação e praticidade." },
  { href: "/mei/link-de-pagamento-para-mei", title: "Link de pagamento para MEI", desc: "Como usar link de pagamento para vender sem maquininha." },
  { href: "/mei/organizar-faturamento-maquininha", title: "Organizar faturamento da maquininha", desc: "Controle mensal para a DASN-SIMEI." },
];

const GUIAS_PRODUTO = [
  { href: "/mei/maquininha-para-mei", title: "Maquininha para MEI", desc: "Guia geral para quem está escolhendo pela primeira vez." },
  { href: "/mei/melhor-maquininha-para-mei", title: "Melhor maquininha para MEI", desc: "O que analisar antes de decidir." },
  { href: "/mei/maquininha-mercado-pago-para-mei", title: "Maquininha Mercado Pago para MEI", desc: "Vale a pena para o seu negócio?" },
  { href: "/mei/point-smart-2-para-mei", title: "Point Smart 2 para MEI", desc: "Tela, relatórios e NFC para uso diário." },
  { href: "/mei/point-pro-3-para-mei", title: "Point Pro 3 para MEI", desc: "Bateria, 4G e robustez para alto volume." },
  { href: "/mei/app-mercado-pago-para-mei", title: "App Mercado Pago para MEI", desc: "Receba sem maquininha, só com o celular." },
];

const GUIAS_SEGMENTO = [
  { href: "/mei/maquininha-para-salao-de-beleza", title: "Maquininha para salão de beleza", desc: "Manicure, cabeleireira e esteticista." },
  { href: "/mei/maquininha-para-barbeiro", title: "Maquininha para barbeiro", desc: "Barbearias e barbeiros autônomos." },
  { href: "/mei/maquininha-para-delivery", title: "Maquininha para delivery", desc: "Entregadores e motoboys MEI." },
  { href: "/mei/maquininha-para-autonomo", title: "Maquininha para autônomo", desc: "Qualquer autônomo formalizado como MEI." },
  { href: "/mei/maquininha-para-prestador-de-servico", title: "Maquininha para prestador de serviço", desc: "Eletricistas, encanadores, técnicos e mais." },
  { href: "/mei/maquininha-para-vendedor-ambulante", title: "Maquininha para vendedor ambulante", desc: "Feiras, eventos e comércio na rua." },
];

const GUIAS_DECLARACAO = [
  { href: "/mei/mei-recebe-maquininha-precisa-declarar", title: "MEI que recebe por maquininha precisa declarar?", desc: "DASN-SIMEI e IRPF: entenda a diferença." },
  { href: "/mei/mei-pode-ter-maquininha-no-cpf", title: "MEI pode ter maquininha no CPF?", desc: "CPF ou CNPJ: qual usar nas maquininhas." },
  { href: "/mei/mei-vender-no-cartao", title: "MEI pode vender no cartão?", desc: "Controle de faturamento para quem recebe no crédito." },
  { href: "/mei/declaracao-anual", title: "Declaração Anual do MEI (DASN-SIMEI)", desc: "Como entregar e evitar multa de R$ 50." },
];

function GuiaCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block border border-[#0A0A0A]/15 p-5 hover:border-[#C6FF00] hover:bg-[#0A0A0A]/3 transition-colors"
    >
      <p className="font-semibold text-sm mb-1 leading-snug">{title}</p>
      <p className="text-xs opacity-60">{desc}</p>
    </Link>
  );
}

export default function VenderEReceberHub() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Vender e Receber", url: "https://irpf.qaplay.com.br/mei/vender-e-receber" },
        ]}
      />
      <JsonLdArticle
        title="Guia do MEI para vender e receber melhor: Pix, cartão, app e maquininha"
        description="Tudo que o MEI precisa saber para receber por Pix, cartão, maquininha e link de pagamento."
        url="https://irpf.qaplay.com.br/mei/vender-e-receber"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Guia MEI para vender e receber"
        datePublished="2026-05-25"
        dateModified="2026-05-25"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest opacity-50 mb-3">
            MEI / Vender e Receber
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Guia do MEI para vender e receber melhor
          </h1>
          <p className="text-lg opacity-70 leading-relaxed">
            Pix, cartão, maquininha, app e link de pagamento — cada opção tem um perfil de uso.
            Este guia reúne tudo para você escolher a solução certa, sem atendimento, sem cadastro obrigatório.
          </p>
        </div>

        {/* Quiz */}
        <div className="max-w-3xl mb-16">
          <QuizMaquininha />
        </div>

        {/* Calculadora */}
        <div className="max-w-3xl mb-16">
          <CalculadoraVendasCartao />
        </div>

        {/* Guias fundamentais */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-6">Fundamentos de recebimento para MEI</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIAS_FUNDAMENTAIS.map((g) => (
              <GuiaCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-2">Maquininhas e soluções Mercado Pago</h2>
          <p className="text-sm opacity-60 mb-6">
            Análises detalhadas para você escolher sem pressão e sem depender de vendedor.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIAS_PRODUTO.map((g) => (
              <GuiaCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        {/* Por segmento */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-2">Por tipo de negócio</h2>
          <p className="text-sm opacity-60 mb-6">
            Recomendação específica para cada perfil de MEI.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIAS_SEGMENTO.map((g) => (
              <GuiaCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        {/* Declaração e controle */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-6">Declaração, faturamento e organização</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUIAS_DECLARACAO.map((g) => (
              <GuiaCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        {/* Leitura e organização */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl mb-2">Leituras para organizar o financeiro</h2>
          <p className="text-sm opacity-60 mb-6">
            Se o problema principal é bagunça financeira, aqui estão leituras que ajudam a dar
            estrutura antes de vender mais.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <GuiaCard
              href="/mei/leitura-financeira-para-mei"
              title="Leituras para MEI"
              desc="Hub com análises de livros para organizar dinheiro e vendas."
            />
            <GuiaCard
              href="/blog/livro-financas-para-mei-organizar-caixa-e-irpf"
              title="Livro de finanças para MEI"
              desc="Foco em caixa organizado e disciplina para o IRPF."
            />
            <GuiaCard
              href="/blog/dinheiro-cerbasi-para-autonomos-e-mei-resumo-aplicado"
              title="Dinheiro para autônomos e MEI"
              desc="Leitura voltada para renda variável e previsibilidade."
            />
          </div>
        </section>

        {/* CTA produto em destaque */}
        <div className="max-w-3xl mb-16">
          <MaquininhaAfiliado
            product="point-smart-2"
            context="Para MEI que quer começar de forma prática e com relatórios integrados"
          />
        </div>

        {/* Aviso */}
        <div className="max-w-3xl border-t border-[#0A0A0A]/10 pt-8">
          <p className="text-xs opacity-50 leading-relaxed">
            Alguns links desta página são de indicação. Antes de contratar qualquer solução, confira
            diretamente no Mercado Pago as taxas, prazos e condições vigentes. Este conteúdo é informativo
            e foi pensado para ajudar MEIs a escolherem melhor como receber de seus clientes.
          </p>
        </div>
      </div>
    </main>
  );
}
