import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "MEI pode vender no cartão? Como controlar os recebimentos",
  description:
    "MEI pode aceitar cartão de crédito e débito. Saiba como controlar corretamente os recebimentos por cartão sem errar na declaração anual DASN-SIMEI.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/mei-vender-no-cartao" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MEI pode vender no cartão? Como controlar os recebimentos",
    description: "MEI pode vender no cartão. Saiba como controlar os recebimentos e não errar na DASN-SIMEI.",
    url: "https://irpf.qaplay.com.br/mei/mei-vender-no-cartao",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "MEI pode vender no cartão — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEI pode vender no cartão? Como controlar os recebimentos",
    description: "Como MEI deve controlar recebimentos por cartão para não errar na declaração.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "MEI pode vender no cartão de crédito?",
    answer:
      "Sim. O MEI pode aceitar pagamentos por cartão de crédito e débito usando maquininha ou link de pagamento. Os valores recebidos fazem parte do faturamento bruto e devem ser declarados na DASN-SIMEI.",
  },
  {
    question: "A taxa da maquininha desconta do faturamento do MEI?",
    answer:
      "Não para fins de declaração. O faturamento bruto informado na DASN-SIMEI é o valor da venda antes da taxa. A taxa da operadora é um custo operacional do negócio, não uma dedução do faturamento declarado.",
  },
  {
    question: "MEI precisa emitir nota fiscal para vendas no cartão?",
    answer:
      "Depende da atividade. Prestadores de serviço devem verificar a obrigatoriedade da NFS-e no município. Vendedores de produtos devem verificar a NF-e conforme a legislação estadual. Consulte o contador ou a prefeitura.",
  },
  {
    question: "Vender no crédito parcelado afeta o limite do MEI?",
    answer:
      "Sim. O valor das parcelas entra no faturamento no mês em que a venda foi realizada (ou quando recebida — depende do regime de apuração). Mesmo que o cliente pague em 12x, o valor total da venda deve ser considerado no faturamento do período da venda.",
  },
  {
    question: "Como separar vendas no cartão das demais no controle do faturamento?",
    answer:
      "Use uma planilha ou o relatório do app da operadora da maquininha. Anote mensalmente: débito, crédito à vista, crédito parcelado, Pix e dinheiro. Some tudo ao final do ano para a DASN-SIMEI.",
  },
];

export default function MeiVenderNoCartaoPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "MEI pode vender no cartão?", url: "https://irpf.qaplay.com.br/mei/mei-vender-no-cartao" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="MEI pode vender no cartão? Como controlar os recebimentos"
        description="MEI pode aceitar cartão. Saiba como controlar os recebimentos por cartão e declarar corretamente na DASN-SIMEI."
        url="https://irpf.qaplay.com.br/mei/mei-vender-no-cartao"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="MEI pode vender no cartão — Consultoria NSB"
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
          <span className="opacity-70">MEI pode vender no cartão?</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Faturamento e recebimentos — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              MEI pode vender no cartão? Veja como controlar os recebimentos
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resposta direta</strong>
              <p className="text-sm opacity-70">
                Sim, MEI pode vender no cartão. A dúvida real é: <strong>como controlar esses recebimentos para não errar na declaração anual?</strong> Este guia explica o que fazer.
              </p>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Aceitar cartão é quase obrigatório para competir hoje. Mas para o MEI, o cartão traz uma responsabilidade extra: <strong>todos os recebimentos precisam entrar no controle do faturamento</strong> — e errar nessa soma pode gerar problemas na DASN-SIMEI ou até exclusão do Simples Nacional.
            </p>

            <h2 className="font-serif text-3xl mb-4">MEI pode aceitar qualquer cartão?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Sim. MEI pode aceitar:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Cartão de débito (Visa, Mastercard, Elo e outros)</li>
              <li>Cartão de crédito à vista e parcelado</li>
              <li>Voucher (alimentação, refeição, benefícios)</li>
              <li>Pagamento por aproximação (NFC)</li>
              <li>Link de pagamento (cobrar pelo WhatsApp sem maquininha)</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Como o cartão entra no faturamento do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O faturamento do MEI é calculado pelo valor bruto das vendas e prestações de serviço no ano. Isso inclui:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-4 list-disc pl-5">
              <li>Todos os valores recebidos por débito</li>
              <li>Todos os valores recebidos por crédito à vista ou parcelado</li>
              <li>Pix, dinheiro, voucher e qualquer outra forma</li>
            </ul>
            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ Atenção: taxa da maquininha ≠ dedução do faturamento</strong>
              <p className="text-sm opacity-70">
                A taxa cobrada pela operadora (2%, 3%...) é um custo operacional do negócio — não é descontada do faturamento declarado na DASN-SIMEI. Declare sempre o valor bruto da venda.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Como controlar os recebimentos por cartão</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O controle mensal evita surpresas no final do ano. Uma forma simples:
            </p>
            <ol className="text-sm opacity-70 space-y-3 mb-8 list-decimal pl-5">
              <li><strong>Use o relatório da maquininha</strong> — app ou painel web gera extrato mensal de vendas</li>
              <li><strong>Some débito + crédito + Pix + dinheiro</strong> todo mês</li>
              <li><strong>Guarde os comprovantes</strong> de cada mês para eventual verificação</li>
              <li><strong>Monitore o acumulado anual</strong> — fique atento ao limite de R$ 81.000/ano</li>
              <li><strong>Em dezembro, feche o total do ano</strong> para preparar a DASN-SIMEI (prazo: 31/mai)</li>
            </ol>

            <h2 className="font-serif text-3xl mb-4">O risco de crédito parcelado para o limite do MEI</h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Se você vende muito no crédito parcelado, pode chegar perto do limite de R$ 81.000 sem perceber — porque o dinheiro demora a cair na conta, mas a venda já aconteceu. Monitore o valor das vendas, não apenas o que entrou na conta.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quando vender no cartão faz sentido para o MEI</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Seus clientes preferem ou exigem cartão</li>
              <li>Seu ticket médio é alto (cartão facilita a decisão de compra)</li>
              <li>Você quer reduzir inadimplência e risco de troco</li>
              <li>Você quer controle automático via relatório da maquininha</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Quando o cartão talvez não valha a taxa</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Suas vendas são de valor muito baixo (a taxa come a margem)</li>
              <li>Todos os seus clientes pagam em Pix ou dinheiro de forma natural</li>
              <li>Você está próximo do limite de faturamento e quer controlar volume</li>
            </ul>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Organização financeira</p>
              <h3 className="font-serif text-xl mb-3">Você é MEI e quer vender no cartão sem bagunçar o faturamento?</h3>
              <p className="text-sm text-white/70 mb-5">
                Antes de escolher uma maquininha, organize como vai controlar Pix, cartão, dinheiro e notas fiscais. Nilson Brites orienta seu MEI do início ao fim.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Quero vender no cartão como MEI e organizar corretamente o faturamento.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-verde text-preto px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-verde/90 transition"
              >
                Falar no WhatsApp sobre meu MEI →
              </a>
            </div>

            <p className="text-sm opacity-60 mb-8">
              Ver também:{" "}
              <Link href="/mei/organizar-faturamento-maquininha" className="underline hover:opacity-100">
                Como organizar o faturamento do MEI que recebe por maquininha
              </Link>{" "}
              e{" "}
              <Link href="/mei/declaracao-anual" className="underline hover:opacity-100">
                Declaração Anual do MEI (DASN-SIMEI)
              </Link>.
            </p>

            <h2 className="font-serif text-3xl mb-6 mt-12">Dúvidas frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-preto/10 pb-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <MeiGuiasRelacionados currentSlug="mei-vender-no-cartao" max={4} includePrincipal />
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
