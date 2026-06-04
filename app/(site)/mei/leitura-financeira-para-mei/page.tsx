import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdArticle, JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Leituras para MEI: livros para organizar dinheiro e vendas",
  description:
    "Hub de leituras para MEI com análises práticas de livros de finanças e organização. Veja quais fazem mais sentido para quem quer vender melhor e declarar sem bagunça.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/leitura-financeira-para-mei" },
  openGraph: {
    title: "Leituras para MEI: livros para organizar dinheiro e vendas",
    description:
      "Seleção de leituras para MEI que ajudam a organizar caixa, vender melhor e chegar no IRPF com menos erro.",
    url: "https://irpf.qaplay.com.br/mei/leitura-financeira-para-mei",
  },
  robots: { index: true, follow: true },
};

const livros = [
  {
    title: "Empreendedores Inteligentes Enriquecem Mais",
    desc: "Boa escolha para MEI e autônomos que precisam de rotina financeira, disciplina de caixa e decisões menos impulsivas.",
    href: "/blog/empreendedores-inteligentes-enriquecem-mais-resenha-pratica-irpf",
    tag: "Mais prático",
  },
  {
    title: "Livro de finanças para MEI e caixa organizado",
    desc: "Versão mais focada no MEI que quer separar pessoa física e negócio, com disciplina para o IRPF.",
    href: "/blog/livro-financas-para-mei-organizar-caixa-e-irpf",
    tag: "MEI primeiro",
  },
  {
    title: "Dinheiro: os segredos de quem tem",
    desc: "Melhor para quem quer organizar renda, reserva e previsibilidade antes da declaração e da vida fiscal apertar.",
    href: "/blog/livro-dinheiro-gustavo-cerbasi-resumo-aplicado-irpf",
    tag: "Mais didático",
  },
  {
    title: "Dinheiro para autônomos e renda variável",
    desc: "Boa escolha para quem recebe de forma irregular e precisa criar previsibilidade financeira no mês a mês.",
    href: "/blog/dinheiro-cerbasi-para-autonomos-e-mei-resumo-aplicado",
    tag: "Renda variável",
  },
  {
    title: "Finanças pessoais para empreendedor",
    desc: "Indicado para quem empreende e precisa parar de misturar conta da empresa com conta pessoal.",
    href: "/blog/livro-financas-pessoais-para-empreendedor-resenha-pratica",
    tag: "Empreendedor",
  },
  {
    title: "Controle financeiro para MEI e autônomos",
    desc: "Foco em caixa, reserva e rotina financeira para quem precisa de menos improviso e mais previsibilidade.",
    href: "/blog/controle-financeiro-para-mei-e-autonomos-cerbasi",
    tag: "Controle",
  },
];

const faqs = [
  {
    question: "Essas leituras servem para qualquer MEI?",
    answer:
      "Servem principalmente para MEI que quer organizar fluxo de caixa, separar pessoa física de pessoa jurídica e reduzir erro na hora de declarar. Quem já tem controle avançado pode usar os livros como revisão de rotina.",
  },
  {
    question: "Por que uma página de leitura ajuda no SEO?",
    answer:
      "Porque cria um hub temático com intenção clara de pesquisa. Em vez de depender só de posts isolados, o Google encontra uma página central que conecta finanças, organização e decisão de compra com mais contexto.",
  },
  {
    question: "Esses livros aumentam conversão de afiliado?",
    answer:
      "Aumentam quando o usuário chega com intenção de aprender e encontra recomendação contextual, não catálogo solto. O hub ajuda a pré-qualificar o leitor antes do clique no post afiliado.",
  },
];

export default function LeituraFinanceiraParaMeiPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Leituras para MEI", url: "https://irpf.qaplay.com.br/mei/leitura-financeira-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Leituras para MEI: livros para organizar dinheiro e vendas"
        description="Hub de leituras para MEI com análises práticas de livros de finanças e organização."
        url="https://irpf.qaplay.com.br/mei/leitura-financeira-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Livros de finanças para MEI e organização financeira"
        datePublished="2026-06-04"
        dateModified="2026-06-04"
        articleSection="MEI"
      />

      <section className="max-w-7xl mx-auto px-6 pb-16 border-b border-preto/10">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
          Hub de leitura
        </p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6 max-w-3xl">
          Leituras para MEI que querem vender melhor e organizar o dinheiro
        </h1>
        <p className="text-lg opacity-60 max-w-3xl leading-relaxed">
          Esta página reúne análises práticas de livros que ajudam o MEI a sair do improviso.
          O objetivo não é só comprar um livro: é escolher uma leitura que melhore disciplina,
          previsibilidade e organização para chegar no IRPF com menos bagunça.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-4xl">Análises recomendadas</h2>
          <span className="text-[10px] uppercase tracking-widest opacity-40">
            Foco em organização financeira
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {livros.map((livro) => (
            <Link
              key={livro.href}
              href={livro.href}
              className="group border border-preto/10 p-6 hover:border-preto/25 transition-colors block"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] uppercase tracking-widest bg-verde/10 text-verde px-3 py-1">
                  {livro.tag}
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <h3 className="font-serif text-2xl mb-3 group-hover:italic transition-all">
                {livro.title}
              </h3>
              <p className="text-sm opacity-60 leading-relaxed mb-4">{livro.desc}</p>
              <span className="text-sm underline underline-offset-4">
                Abrir análise completa
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-16 border-t border-preto/10">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
            O que este hub resolve
          </p>
          <h2 className="font-serif text-4xl mb-6">Leitura com intenção, não catálogo solto</h2>
          <p className="text-sm opacity-60 leading-relaxed mb-8">
            O problema de muitos links de afiliado é aparecerem fora de contexto. Aqui o leitor
            encontra livros ligados a um problema real: desorganização financeira, falta de caixa,
            dificuldade de separar PF e PJ e bagunça antes da declaração.
          </p>
          <div className="space-y-4 text-sm opacity-50">
            <p>✓ Curadoria voltada para MEI e autônomos</p>
            <p>✓ Links contextuais para análises completas</p>
            <p>✓ Melhor chance de clique e decisão de compra</p>
            <p>✓ Página indexável para SEO temático</p>
          </div>
        </div>

        <MeiLeadForm origem="hub-leitura-financeira-mei" />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-preto/10">
        <h2 className="font-serif text-4xl mb-10">Perguntas frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="editorial-border pb-4">
              <summary className="font-serif text-lg cursor-pointer py-3 hover:italic transition-all">
                {faq.question}
              </summary>
              <p className="text-sm opacity-70 leading-relaxed mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-preto/10">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
          Próximo passo
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/mei"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Voltar para MEI →
          </Link>
          <Link
            href="/blog"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Ver blog de finanças e IRPF →
          </Link>
          <Link
            href="/mei/vender-e-receber"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Vender e receber como MEI →
          </Link>
          <Link
            href="/mei/ferramentas-para-mei"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Ferramentas para MEI →
          </Link>
        </div>
      </section>
    </main>
  );
}