import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "MEI que recebe por maquininha precisa declarar?",
  description:
    "MEI que recebe por maquininha precisa declarar na DASN-SIMEI e pode ter obrigação de IRPF também. Entenda quando e como declarar cada um.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/mei-recebe-maquininha-precisa-declarar" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MEI que recebe por maquininha precisa declarar?",
    description: "MEI que recebe por maquininha deve declarar na DASN-SIMEI. Veja quando o IRPF também é obrigatório.",
    url: "https://irpf.qaplay.com.br/mei/mei-recebe-maquininha-precisa-declarar",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "MEI que recebe por maquininha precisa declarar — NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEI que recebe por maquininha precisa declarar?",
    description: "DASN-SIMEI e IRPF: quando o MEI que recebe por maquininha precisa declarar.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "MEI que recebe por maquininha precisa declarar DASN-SIMEI?",
    answer:
      "Sim. Todo MEI ativo deve entregar a DASN-SIMEI até 31 de maio de cada ano, independentemente de ter faturado ou não. Se recebeu por maquininha, esses valores integram o faturamento informado na declaração.",
  },
  {
    question: "Recebi por maquininha mas não emiti nota fiscal, preciso declarar?",
    answer:
      "Sim. O faturamento declarado na DASN-SIMEI é o valor total recebido pela atividade do MEI — não apenas o que teve nota fiscal emitida. A ausência de nota não exclui o valor do faturamento.",
  },
  {
    question: "A maquininha gera informe de rendimentos para declaração de IRPF?",
    answer:
      "A operadora da maquininha não emite informe de rendimentos no formato IRPF. O informe de rendimentos da conta digital (onde o dinheiro cai) é que deve ser usado na declaração de IRPF da pessoa física, quando obrigatória.",
  },
  {
    question: "O banco informa à Receita Federal quanto eu recebi pela maquininha?",
    answer:
      "Sim. Instituições financeiras e operadoras de cartão são obrigadas a informar à Receita Federal todas as movimentações acima de determinados limites. Ou seja, a Receita pode cruzar os dados do banco com o que você declarou.",
  },
  {
    question: "MEI precisa declarar IRPF (pessoa física)?",
    answer:
      "Depende da renda total como pessoa física. O MEI deve declarar IRPF se a renda anual (salário, pró-labore, aluguéis, investimentos etc.) ultrapassou R$ 33.888 em 2025. O lucro do MEI dentro do limite de isenção não entra, mas outros rendimentos contam.",
  },
  {
    question: "O que acontece se o MEI não declarar DASN-SIMEI?",
    answer:
      "O MEI fica em situação irregular e pode ser excluído do Simples Nacional. Além disso, incide multa mínima de R$ 50 por atraso, podendo ser maior dependendo do faturamento. O CNPJ também pode ser cancelado.",
  },
];

export default function MeiRecebeMaquininhaDeclarar() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "MEI precisa declarar?", url: "https://irpf.qaplay.com.br/mei/mei-recebe-maquininha-precisa-declarar" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="MEI que recebe por maquininha precisa declarar?"
        description="MEI que recebe por maquininha deve declarar na DASN-SIMEI e pode ter obrigação de IRPF. Saiba quando e como."
        url="https://irpf.qaplay.com.br/mei/mei-recebe-maquininha-precisa-declarar"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="MEI que recebe por maquininha precisa declarar — NSB"
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
          <span className="opacity-70">MEI precisa declarar?</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Declaração — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              MEI que recebe por maquininha precisa declarar?
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resposta direta</strong>
              <p className="text-sm opacity-70">
                Sim — em dois níveis. O MEI deve declarar o faturamento (incluindo recebimentos por maquininha) na{" "}
                <strong>DASN-SIMEI</strong> todo ano até 31 de maio. Se a renda pessoal total ultrapassar R$ 33.888/ano,
                também há obrigação de declarar o <strong>IRPF</strong>.
              </p>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Receber por maquininha não cria nenhuma obrigação diferente — mas <strong>não apaga a obrigação que já existe</strong>. Todo MEI ativo precisa declarar a DASN-SIMEI, e tudo que entrou pelo cartão, Pix ou dinheiro faz parte do faturamento informado.
            </p>

            <h2 className="font-serif text-3xl mb-4">DASN-SIMEI: a declaração obrigatória do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A Declaração Anual do Simples Nacional para o Microempreendedor Individual (DASN-SIMEI) deve ser entregue todo ano, informando o faturamento total do exercício anterior.
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Prazo: <strong>31 de maio</strong> de cada ano</li>
              <li>Onde declarar: <strong>gov.br/empresas-e-negocios/mei</strong></li>
              <li>O que informar: faturamento bruto anual — cartão, Pix, dinheiro, tudo</li>
              <li>Quem deve declarar: <strong>todo MEI ativo</strong>, mesmo sem faturamento</li>
            </ul>

            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ A Receita cruza os dados da maquininha</strong>
              <p className="text-sm opacity-70">
                Operadoras de cartão e bancos informam à Receita Federal as movimentações dos seus clientes. Se você recebeu muito pela maquininha e declarou pouco na DASN-SIMEI, pode cair na malha fina ou ser excluído do Simples Nacional.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Quando o MEI também precisa declarar IRPF</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O MEI tem duas &ldquo;vidas fiscais&rdquo;: como pessoa jurídica (CNPJ) e como pessoa física (CPF). A DASN-SIMEI é obrigação da PJ. O IRPF é obrigação da PF. São declarações separadas.
            </p>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O MEI pessoa física precisa declarar IRPF se:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>A renda anual total (de todas as fontes) superou <strong>R$ 33.888 em 2025</strong></li>
              <li>Tinha bens acima de R$ 800.000 em 31/dez/2025</li>
              <li>Recebeu rendimentos isentos, não tributáveis ou tributados exclusivamente na fonte acima de R$ 200.000</li>
              <li>Teve ganho de capital ou operações em bolsa</li>
            </ul>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Leia mais sobre quando o MEI precisa declarar IRPF em:{" "}
              <Link href="/mei/mei-e-irpf" className="underline hover:opacity-100">
                MEI e IRPF: quando o microempreendedor precisa declarar Imposto de Renda
              </Link>.
            </p>

            <h2 className="font-serif text-3xl mb-4">O que usar como base para declarar a DASN-SIMEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Para declarar com precisão:
            </p>
            <ol className="text-sm opacity-70 space-y-3 mb-8 list-decimal pl-5">
              <li>Some todos os recebimentos mensais do ano: cartão de débito, crédito, Pix, dinheiro, link de pagamento</li>
              <li>Use os relatórios do app da maquininha e o extrato da conta PJ</li>
              <li>Guarde todos os comprovantes por pelo menos 5 anos</li>
              <li>Declare o valor bruto (antes das taxas das operadoras)</li>
            </ol>

            <p className="text-sm opacity-60 mb-8">
              Ver também:{" "}
              <Link href="/mei/declaracao-anual" className="underline hover:opacity-100">
                Guia completo da Declaração Anual do MEI (DASN-SIMEI)
              </Link>{" "}
              e{" "}
              <Link href="/mei/organizar-faturamento-maquininha" className="underline hover:opacity-100">
                Como organizar o faturamento do MEI que recebe por maquininha
              </Link>.
            </p>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Declaração MEI + IRPF</p>
              <h3 className="font-serif text-xl mb-3">Tem dúvida sobre DASN-SIMEI ou IRPF do MEI?</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites orienta MEIs na declaração anual e na regularização do IRPF pessoa física. Atendimento 100% online.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Recebo por maquininha como MEI e tenho dúvidas sobre DASN-SIMEI e IRPF.")}`}
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

            <MeiGuiasRelacionados currentSlug="mei-recebe-maquininha-precisa-declarar" max={4} includePrincipal />
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
