import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Point Mercado Pago para MEI: como funciona e para quem faz sentido",
  description:
    "Entenda como a Point Pro 3 e a Point Smart 2 funcionam para MEI, as diferenças entre os modelos e como escolher com base no seu tipo de negócio.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/point-mercado-pago-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Point Mercado Pago para MEI: como funciona",
    description: "Diferenças entre Point Pro 3 e Point Smart 2 e quando cada modelo faz sentido para MEI.",
    url: "https://irpf.qaplay.com.br/mei/point-mercado-pago-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Point Mercado Pago para MEI — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Point Mercado Pago para MEI: como funciona",
    description: "Diferenças entre Point Pro 3 e Point Smart 2 para MEI.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Qual a diferença entre Point Pro 3 e Point Smart 2?",
    answer:
      "A Point Pro 3 é uma maquininha compacta, sem tela própria de exibição de relatórios, focada em praticidade para venda presencial. A Point Smart 2 tem tela touchscreen, permite ver relatórios direto na maquininha, aceita NFC e tem funcionalidades mais avançadas, sendo indicada para MEI que quer controle mais profissional.",
  },
  {
    question: "A Point funciona sem Wi-Fi?",
    answer:
      "Sim. As maquininhas Point têm conectividade 4G própria, não dependem de Wi-Fi. Isso as torna adequadas para uso fora de estabelecimentos fixos, como delivery e serviços itinerantes.",
  },
  {
    question: "Preciso ter conta no Mercado Pago para usar a Point?",
    answer:
      "Sim. As maquininhas Point estão vinculadas à conta Mercado Pago. Os valores das vendas caem na conta digital do Mercado Pago e podem ser transferidos para outra conta a qualquer momento.",
  },
  {
    question: "A Point aceita voucher (alimentação e refeição)?",
    answer:
      "As maquininhas Point aceitam as principais bandeiras de voucher. Verifique quais operadoras de benefício estão habilitadas na sua conta Mercado Pago antes de usar para venda.",
  },
  {
    question: "Posso usar a Point com o CPF do MEI ou preciso de CNPJ?",
    answer:
      "O Mercado Pago permite cadastro com CPF ou CNPJ. Para MEI, recomendamos usar o CNPJ para separar o faturamento da conta pessoal e facilitar a DASN-SIMEI.",
  },
];

export default function PointMercadoPagoPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Receber Pagamentos", url: "https://irpf.qaplay.com.br/mei/receber-pagamentos" },
          { name: "Point Mercado Pago para MEI", url: "https://irpf.qaplay.com.br/mei/point-mercado-pago-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Point Mercado Pago para MEI: como funciona e para quem faz sentido"
        description="Diferenças entre Point Pro 3 e Point Smart 2 e quando cada modelo faz sentido para MEI."
        url="https://irpf.qaplay.com.br/mei/point-mercado-pago-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Point Mercado Pago para MEI — Consultoria NSB"
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
          <span className="opacity-70">Point Mercado Pago para MEI</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Guia de recebimentos — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Point Mercado Pago para MEI: como funciona e para quem faz sentido
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resumo rápido</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li><strong>Point Pro 3:</strong> compacta, 4G, ideal para presencial e delivery</li>
                <li><strong>Point Smart 2:</strong> tela touchscreen, mais completa e profissional</li>
                <li>Ambas funcionam sem Wi-Fi e aceitam débito, crédito e Pix</li>
                <li>Recebimentos entram na conta Mercado Pago (CNPJ do MEI)</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Muitos MEIs chegam até as maquininhas Point e ficam em dúvida: <strong>Pro 3 ou Smart 2?</strong> Qual delas combina com meu negócio? Este guia explica cada modelo com honestidade e sem exageros para você decidir com segurança.
            </p>

            <h2 className="font-serif text-3xl mb-4">Point Pro 3: praticidade para quem vende presencialmente</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A Point Pro 3 é uma maquininha compacta e portátil. Funciona com chip 4G sem depender de Wi-Fi, tem bateria que dura o dia todo e aceita débito, crédito e voucher. Ideal para:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>MEI com balcão ou ponto de atendimento fixo</li>
              <li>Entregadores e food trucks</li>
              <li>Feirantes e ambulantes</li>
              <li>Prestadores de serviço que atendem em domicílio</li>
            </ul>

            <MaquininhaAfiliado product="point-pro-3" context="Ideal para quem trabalha na rua, em eventos, delivery ou no balcão." />

            <h2 className="font-serif text-3xl mb-4">Point Smart 2: controle mais completo para uso profissional</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A Point Smart 2 tem tela touchscreen, o que permite visualizar informações de vendas na própria maquininha, fazer recargas de celular e usar funcionalidades avançadas. Indicada para:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>MEI que valoriza relatório de vendas direto na máquina</li>
              <li>Salões de beleza, consultórios, estúdios</li>
              <li>Prestadores de serviço com atendimento mais formal</li>
              <li>MEI que recebe por NFC (pagamento por aproximação)</li>
            </ul>

            <MaquininhaAfiliado product="point-smart-2" context="Para MEI que quer tela, relatórios integrados e experiência de uso mais profissional." />

            <h2 className="font-serif text-3xl mb-4">Comparativo direto</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-preto">
                    <th className="text-left py-3 pr-4 font-bold">Critério</th>
                    <th className="text-left py-3 pr-4 font-bold">Point Pro 3</th>
                    <th className="text-left py-3 font-bold">Point Smart 2</th>
                  </tr>
                </thead>
                <tbody className="opacity-70">
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Tela própria</td>
                    <td className="py-3 pr-4">Não</td>
                    <td className="py-3">Sim (touchscreen)</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Conectividade</td>
                    <td className="py-3 pr-4">4G + Wi-Fi</td>
                    <td className="py-3">4G + Wi-Fi</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">NFC</td>
                    <td className="py-3 pr-4">Sim</td>
                    <td className="py-3">Sim</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Voucher</td>
                    <td className="py-3 pr-4">Sim</td>
                    <td className="py-3">Sim</td>
                  </tr>
                  <tr className="border-b border-preto/10">
                    <td className="py-3 pr-4">Ideal para</td>
                    <td className="py-3 pr-4">Presencial, delivery, feirantes</td>
                    <td className="py-3">Atendimento profissional, relatórios</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs opacity-50 mb-8">* Verifique especificações e condições vigentes diretamente no Mercado Pago.</p>

            <h2 className="font-serif text-3xl mb-4">Como a Point afeta o faturamento do MEI</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              Todo valor recebido pela maquininha entra no faturamento do MEI. Para a DASN-SIMEI, use sempre o valor bruto (antes da taxa da operadora). O app do Mercado Pago e o painel web disponibilizam relatório de vendas — guarde esses registros.
            </p>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Se você receber por cartão, Pix e dinheiro, some tudo ao final de cada mês. Ultrapassar R$ 81.000 no ano pode excluir o MEI do Simples Nacional — então o controle mensal é fundamental.
            </p>

            <div className="bg-preto text-white p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-verde mb-3">Controle do faturamento</p>
              <h3 className="font-serif text-xl mb-3">Não deixe o faturamento da maquininha te surpreender na declaração</h3>
              <p className="text-sm text-white/70 mb-5">
                Nilson Brites orienta MEIs que recebem por maquininha sobre como declarar corretamente e evitar erros na DASN-SIMEI.
              </p>
              <a
                href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Recebo por maquininha e quero organizar o faturamento do meu MEI corretamente.")}`}
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

            <MeiGuiasRelacionados currentSlug="point-mercado-pago-para-mei" max={4} includePrincipal />
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
