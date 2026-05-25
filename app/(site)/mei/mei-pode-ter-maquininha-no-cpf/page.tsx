import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "MEI pode ter maquininha no CPF ou precisa de CNPJ?",
  description:
    "Esclareça a dúvida: MEI precisa de CNPJ para ter maquininha? Saiba o que muda ao usar CPF ou CNPJ e por que a separação faz diferença na declaração.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/mei-pode-ter-maquininha-no-cpf" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MEI pode ter maquininha no CPF ou precisa de CNPJ?",
    description: "Esclareça se MEI precisa de CNPJ ou pode usar CPF na maquininha e o impacto no faturamento.",
    url: "https://irpf.qaplay.com.br/mei/mei-pode-ter-maquininha-no-cpf",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "MEI: maquininha no CPF ou CNPJ — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEI pode ter maquininha no CPF ou precisa de CNPJ?",
    description: "Entenda a diferença entre maquininha no CPF e no CNPJ para MEI.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "MEI pode usar maquininha no CPF?",
    answer:
      "Depende da operadora. Algumas aceitam CPF para qualquer pessoa. O MEI, porém, tem CNPJ — e usar o CNPJ é o mais recomendado para manter a separação entre finanças pessoais e do negócio.",
  },
  {
    question: "Qual a diferença prática entre maquininha no CPF e no CNPJ?",
    answer:
      "Na maquininha vinculada ao CPF, os valores caem na conta pessoal. No CNPJ, os valores vão para a conta da empresa (ou conta digital PJ). Isso facilita o controle do faturamento e a preparação para a DASN-SIMEI.",
  },
  {
    question: "Maquininha no CPF conta como faturamento do MEI?",
    answer:
      "Sim. Qualquer recebimento relacionado à atividade do MEI — independentemente se a maquininha está no CPF ou no CNPJ — deve ser somado ao faturamento para fins de declaração anual (DASN-SIMEI).",
  },
  {
    question: "Usar maquininha no CPF pode gerar problema com a Receita Federal?",
    answer:
      "Pode gerar dificuldades de comprovação. Se você mistura recebimentos pessoais e do negócio na mesma conta, fica mais difícil separar o que é faturamento do MEI do que é receita pessoal. Isso pode complicar eventual auditoria.",
  },
  {
    question: "Como abrir conta PJ para o MEI?",
    answer:
      "Muitos bancos digitais oferecem conta PJ gratuita para MEI com CNPJ. Você precisa do CNPJ ativo, do contrato social (para MEI é automático no gov.br), e de um documento de identidade. O processo é 100% digital na maioria das fintechs.",
  },
];

export default function MaquininhaNosCpfPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "Maquininha no CPF ou CNPJ?", url: "https://irpf.qaplay.com.br/mei/mei-pode-ter-maquininha-no-cpf" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="MEI pode ter maquininha no CPF ou precisa de CNPJ?"
        description="Esclareça a dúvida sobre CPF vs CNPJ nas maquininhas e o impacto na organização do faturamento do MEI."
        url="https://irpf.qaplay.com.br/mei/mei-pode-ter-maquininha-no-cpf"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="MEI: maquininha no CPF ou CNPJ — Consultoria NSB"
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
          <span className="opacity-70">Maquininha no CPF ou CNPJ?</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Dúvida prática — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              MEI pode ter maquininha no CPF ou precisa de CNPJ?
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resposta direta</strong>
              <p className="text-sm opacity-70">
                Tecnicamente, algumas operadoras permitem maquininha no CPF. Mas o recomendado para MEI é usar o CNPJ — porque mantém o faturamento separado da conta pessoal e facilita a declaração anual (DASN-SIMEI).
              </p>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Essa dúvida é muito comum entre MEIs iniciantes. Você formalizou o negócio, tem CNPJ, mas na hora de contratar uma maquininha, a operadora pergunta: CPF ou CNPJ? <strong>O que faz mais sentido para o seu caso?</strong>
            </p>

            <h2 className="font-serif text-3xl mb-4">O que muda na prática</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-4 font-bold">Critério</th>
                    <th className="text-left py-3 pr-4 font-bold">Maquininha no CPF</th>
                    <th className="text-left py-3 font-bold">Maquininha no CNPJ</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Onde cai o dinheiro</td>
                    <td className="py-3 pr-4">Conta pessoal (PF)</td>
                    <td className="py-3">Conta PJ ou digital do MEI</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Separação finanças</td>
                    <td className="py-3 pr-4">Mistura PF e PJ</td>
                    <td className="py-3">Separado desde o início</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">DASN-SIMEI</td>
                    <td className="py-3 pr-4">Mais difícil de organizar</td>
                    <td className="py-3">Mais fácil de separar e declarar</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Disponibilidade</td>
                    <td className="py-3 pr-4">Nem toda operadora aceita</td>
                    <td className="py-3">Aceito pela maioria</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-serif text-3xl mb-4">Por que o CNPJ é mais recomendado</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              O MEI é uma pessoa jurídica com CNPJ próprio. Manter as finanças do negócio separadas das finanças pessoais é uma boa prática — e, para quem usa maquininha, essencial para controlar o faturamento com precisão.
            </p>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Quando você recebe pela maquininha no CPF, o valor cai na conta pessoal junto com outros recebimentos — salário, Pix de amigos, transferências pessoais. Na hora de preparar a DASN-SIMEI, separar o que é faturamento do MEI do que é movimentação pessoal se torna um trabalho manual e sujeito a erros.
            </p>

            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">⚠️ Atenção: misturar contas pode gerar erro na declaração</strong>
              <p className="text-sm opacity-70">
                Declarar faturamento a menor por confundir entradas pessoais com recebimentos do MEI pode gerar inconsistências na Receita Federal. Use sempre uma conta separada para o negócio.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">Quando usar maquininha no CPF ainda acontece</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Alguns MEIs usam maquininha no CPF porque não sabiam que podiam usar o CNPJ, ou porque a operadora facilitou o cadastro pelo CPF na hora da contratação. Não é ilegal — mas é importante ajustar o quanto antes e separar as contas para evitar problemas futuros.
            </p>

            <h2 className="font-serif text-3xl mb-4">Como organizar agora</h2>
            <ol className="text-sm opacity-70 space-y-3 mb-8 list-decimal pl-5">
              <li>Abra uma conta digital gratuita no CNPJ do seu MEI (Mercado Pago, Nubank PJ, Banco Inter PJ — várias opções gratuitas)</li>
              <li>Vincule a maquininha ao CNPJ quando possível</li>
              <li>Passe a receber Pix também na chave do CNPJ</li>
              <li>Todo mês, exporte o extrato da conta PJ para controlar o faturamento</li>
              <li>Guarde os relatórios de vendas para a DASN-SIMEI</li>
            </ol>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Precisa organizar seu MEI?</p>
              <h3 className="font-serif text-xl mb-3">Organize os recebimentos antes que a declaração complique</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites orienta MEIs que recebem por maquininha a organizar o faturamento e declarar corretamente na DASN-SIMEI.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Tenho maquininha no CPF e quero organizar corretamente o faturamento do meu MEI.")}`}
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

            <MeiGuiasRelacionados currentSlug="mei-pode-ter-maquininha-no-cpf" max={4} includePrincipal />
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
