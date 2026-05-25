import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Como MEI pode receber pagamentos: Pix, cartão e maquininha",
  description:
    "Guia completo para MEI receber por Pix, cartão de crédito/débito, link de pagamento e maquininha. Saiba o que analisar para cada tipo de negócio.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Como MEI pode receber pagamentos: Pix, cartão e maquininha",
    description:
      "Guia completo para MEI receber por Pix, cartão, link de pagamento e maquininha — com orientação fiscal e financeira.",
    url: "https://irpf.qaplay.com.br/mei/receber-pagamentos",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Como MEI pode receber pagamentos — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como MEI pode receber pagamentos: Pix, cartão e maquininha",
    description: "Guia completo para MEI receber por Pix, cartão, link de pagamento e maquininha.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "MEI pode receber por cartão de crédito?",
    answer:
      "Sim. O MEI pode receber por cartão de crédito e débito usando uma maquininha vinculada ao CNPJ ou ao CPF, dependendo da operadora. Os valores recebidos entram no faturamento e devem ser informados na DASN-SIMEI.",
  },
  {
    question: "Pix conta como faturamento do MEI?",
    answer:
      "Sim. Todo valor recebido por Pix, em qualquer conta (inclusive conta pessoal usada para o MEI), deve ser somado ao faturamento para fins da DASN-SIMEI. O ideal é usar uma conta separada para o negócio.",
  },
  {
    question: "MEI pode usar conta pessoal para receber pelo negócio?",
    answer:
      "Não há vedação legal, mas é fortemente desaconselhado. Misturar contas dificulta a organização do faturamento, aumenta o risco de erros na declaração e pode gerar dúvidas na Receita Federal.",
  },
  {
    question: "Qual a diferença entre link de pagamento e maquininha?",
    answer:
      "A maquininha exige presença física do cliente. O link de pagamento permite cobrar à distância, por WhatsApp ou e-mail. Para MEI que vende online ou presta serviços remotos, o link de pagamento é mais prático.",
  },
  {
    question: "MEI precisa emitir nota fiscal para vendas no cartão?",
    answer:
      "Depende da atividade e do município. MEIs prestadores de serviço geralmente devem emitir NFS-e quando o município exige. MEIs de comércio geralmente emitem NF-e para venda de produtos. Consulte a legislação do seu município.",
  },
  {
    question: "Taxa da maquininha entra no faturamento do MEI?",
    answer:
      "Não. A taxa cobrada pela operadora da maquininha é descontada do valor bruto da venda. O faturamento do MEI para fins de DASN-SIMEI é o valor bruto recebido, antes da taxa. Guarde comprovantes para eventual fiscalização.",
  },
];

const guias = [
  { href: "/mei/melhor-maquininha-para-mei", label: "Melhor maquininha para MEI" },
  { href: "/mei/pix-ou-maquininha-para-mei", label: "Pix ou maquininha: o que faz sentido?" },
  { href: "/mei/mei-pode-ter-maquininha-no-cpf", label: "Maquininha no CPF ou CNPJ?" },
  { href: "/mei/maquininha-mercado-pago-para-mei", label: "Maquininha Mercado Pago para MEI" },
  { href: "/mei/point-mercado-pago-para-mei", label: "Point Pro 3 e Point Smart 2" },
  { href: "/mei/mei-vender-no-cartao", label: "MEI pode vender no cartão?" },
  { href: "/mei/mei-recebe-maquininha-precisa-declarar", label: "MEI precisa declarar recebimentos?" },
  { href: "/mei/organizar-faturamento-maquininha", label: "Organizar faturamento da maquininha" },
  { href: "/mei/ferramentas-para-mei", label: "Ferramentas para MEI" },
];

export default function ReceberPagamentosPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Como MEI pode receber pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Como MEI pode receber pagamentos: Pix, cartão, link e maquininha"
        description="Guia completo para MEI receber por Pix, cartão de crédito/débito, link de pagamento e maquininha, com orientação sobre faturamento e declaração."
        url="https://irpf.qaplay.com.br/mei/receber-pagamentos"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Como MEI pode receber pagamentos — Consultoria NSB"
        datePublished="2026-05-24"
        dateModified="2026-05-24"
        articleSection="MEI"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
          <Link href="/" className="hover:opacity-100 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/mei" className="hover:opacity-100 transition">MEI</Link>
          <span className="mx-2">/</span>
          <span className="opacity-70">Como MEI pode receber pagamentos</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Conteúdo principal */}
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Guia de recebimentos — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Como MEI pode receber pagamentos: Pix, cartão, link e maquininha
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">O que você vai encontrar</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Formas de receber disponíveis para MEI</li>
                <li>Diferença entre Pix, cartão, link e maquininha</li>
                <li>Como cada forma afeta o faturamento e a declaração</li>
                <li>Quando usar cada solução conforme o tipo de negócio</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Um dos temas que mais gera dúvida entre MEIs é exatamente este: <strong>como receber pagamentos de forma organizada, sem bagunçar o faturamento e sem cair em problema fiscal</strong>. A boa notícia é que existem opções acessíveis — e cada uma serve melhor para um tipo de negócio.
            </p>

            <h2 className="font-serif text-3xl mb-4">As formas de receber disponíveis para MEI</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              O MEI pode receber de clientes por diversas formas. Cada uma tem características, custos e implicações diferentes para o faturamento e a declaração anual.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-4 font-bold">Forma de receber</th>
                    <th className="text-left py-3 pr-4 font-bold">Taxa</th>
                    <th className="text-left py-3 font-bold">Melhor para</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Pix</td>
                    <td className="py-3 pr-4">Zero (pessoa física) / pequena (PJ)</td>
                    <td className="py-3">Serviços, cobranças rápidas, clientes que têm Pix</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Dinheiro</td>
                    <td className="py-3 pr-4">Sem taxa</td>
                    <td className="py-3">Comércios locais, feirantes, serviços informais</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Cartão (débito/crédito)</td>
                    <td className="py-3 pr-4">~1% débito / 2,5–4% crédito</td>
                    <td className="py-3">Balcão, delivery, atendimento presencial</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Link de pagamento</td>
                    <td className="py-3 pr-4">Similar ao cartão</td>
                    <td className="py-3">Vendas online, WhatsApp, Instagram, serviços remotos</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4 font-medium">Boleto</td>
                    <td className="py-3 pr-4">Fixo por boleto</td>
                    <td className="py-3">Contratos, serviços recorrentes, clientes PJ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs opacity-50 mb-8">* Taxas aproximadas. Consulte condições vigentes diretamente nas operadoras.</p>

            <h2 className="font-serif text-3xl mb-4">Pix para MEI: prático, mas exige organização</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              O Pix é a forma mais popular de recebimento entre MEIs — e com razão: é imediato, sem taxa e aceito em qualquer banco. O ponto de atenção é o <strong>controle do faturamento</strong>. Todo Pix recebido, seja na conta PF ou PJ, <strong>conta como faturamento do MEI</strong> e precisa ser somado para a DASN-SIMEI.
            </p>
            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-6">
              <strong className="text-sm block mb-1">⚠️ Atenção fiscal</strong>
              <p className="text-sm opacity-70">
                Usar conta pessoal para receber pagamentos do MEI mistura finanças e aumenta o risco de erros na declaração. O ideal é abrir uma conta digital PJ — muitas são gratuitas para MEI.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Cartão: necessário para competir e crescer</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Clientes preferem pagar no cartão — especialmente em compras maiores ou quando usam crédito. Para o MEI, aceitar cartão via maquininha ou link de pagamento pode aumentar o ticket médio e reduzir desistências de compra.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              A taxa da maquininha (cobrada pela operadora) não entra no faturamento do MEI — ela é descontada do valor bruto e representa um custo operacional. O valor para DASN-SIMEI é sempre o valor bruto da venda.
            </p>

            <h2 className="font-serif text-3xl mb-4">Link de pagamento: ideal para quem vende online</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Se você atende pelo WhatsApp, Instagram ou faz entregas, o link de pagamento é uma solução prática: gere o link, envie ao cliente e ele paga no cartão ou Pix sem precisar estar presente.
            </p>

            <h2 className="font-serif text-3xl mb-4">Qual forma de receber faz sentido para o seu MEI?</h2>

            <div className="space-y-4 mb-8">
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm block mb-1">MEI com ponto fixo (balcão, loja, salão)</strong>
                <p className="text-sm opacity-70">Maquininha presencial + Pix. A maquininha garante o cartão, o Pix cobre quem prefere.</p>
              </div>
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm block mb-1">MEI prestador de serviços (eletricista, técnico, freelancer)</strong>
                <p className="text-sm opacity-70">Link de pagamento + Pix. Cobra à distância e recebe antes ou depois do serviço.</p>
              </div>
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm block mb-1">MEI delivery e food service</strong>
                <p className="text-sm opacity-70">Maquininha portátil + Pix. Cobra na entrega sem precisar de troco.</p>
              </div>
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm block mb-1">MEI digital (venda de produtos/serviços online)</strong>
                <p className="text-sm opacity-70">Link de pagamento + Pix. Maquininha é opcional neste caso.</p>
              </div>
            </div>

            {/* CTA Maquininha - ponto correto dentro do conteúdo */}
            <MaquininhaAfiliado product="app-mercado-pago" context="Conta digital para MEI separar recebimentos de Pix, cartão e link de pagamento em um único lugar." />

            <h2 className="font-serif text-3xl mb-4">Tudo isso entra no faturamento do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Independentemente de como você recebe — Pix, cartão, dinheiro ou link — <strong>o faturamento bruto total deve ser declarado na DASN-SIMEI até 31 de maio de cada ano</strong>. O limite do MEI é de R$ 81.000 por ano (R$ 6.750/mês na média).
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Se você receber por maquininha e não souber como separar os valores, corre o risco de declarar errado ou ultrapassar o limite sem perceber. A organização mensal é fundamental — e o próximo guia ajuda nisso.
            </p>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Precisa organizar seu MEI?</p>
              <h3 className="font-serif text-2xl mb-3">Nilson Brites cuida da declaração do seu MEI do início ao fim</h3>
              <p className="text-sm text-white/70 mb-5 leading-relaxed">
                DASN-SIMEI, controle de faturamento, orientação sobre limite e maquininha — tudo 100% online.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Preciso organizar os recebimentos do meu MEI. Podem me ajudar?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde text-preto px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-verde/90 transition"
              >
                Falar no WhatsApp sobre meu MEI →
              </a>
            </div>

            <h2 className="font-serif text-3xl mb-4">Explore os guias desta área</h2>
            <p className="text-sm opacity-70 mb-6">
              Esta é a página central sobre recebimentos do MEI. Navegue pelos guias específicos:
            </p>
            <ul className="space-y-2 mb-8">
              {guias.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className="text-sm text-[#0A0A0A] underline underline-offset-2 hover:opacity-70 transition">
                    → {g.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* FAQ */}
            <h2 className="font-serif text-3xl mb-6 mt-12">Dúvidas frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-preto/10 pb-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <BlogCTA variant="footer" topic="mei" />
            <MeiGuiasRelacionados currentSlug="receber-pagamentos" max={4} includePrincipal />
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 space-y-8">
            <BlogCTA variant="sidebar" topic="mei" />
            <MeiLeadForm />
          </aside>
        </div>
      </div>
    </main>
  );
}
