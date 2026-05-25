import type { Metadata } from "next";
import Link from "next/link";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import BlogCTA from "@/components/site/BlogCTA";
import MaquininhaAfiliado from "@/components/site/MaquininhaAfiliado";
import MeiGuiasRelacionados from "@/components/site/MeiGuiasRelacionados";
import { JsonLdBreadcrumb, JsonLdFAQ, JsonLdArticle } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Melhor maquininha para MEI: o que analisar antes de escolher",
  description:
    "Saiba o que avaliar antes de contratar uma maquininha para o seu MEI: taxa, conectividade, antecipação, tipo de negócio e integração com o faturamento.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei/melhor-maquininha-para-mei" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Melhor maquininha para MEI: o que analisar antes de escolher",
    description:
      "Guia para MEI escolher maquininha com base no tipo de negócio, taxa, conectividade e impacto no faturamento.",
    url: "https://irpf.qaplay.com.br/mei/melhor-maquininha-para-mei",
    images: [{ url: "https://irpf.qaplay.com.br/og-image.svg", width: 1200, height: 630, alt: "Melhor maquininha para MEI — Consultoria NSB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Melhor maquininha para MEI: o que analisar",
    description: "O que o MEI deve analisar antes de escolher uma maquininha de cartão.",
    images: ["https://irpf.qaplay.com.br/og-image.svg"],
  },
};

const faqs = [
  {
    question: "Qual maquininha tem a menor taxa para MEI?",
    answer:
      "As taxas variam por operadora, volume de vendas, modalidade (débito, crédito à vista, crédito parcelado) e plano contratado. Não é possível apontar uma taxa única como a menor do mercado sem considerar o perfil do seu negócio. Consulte as condições vigentes diretamente nas operadoras antes de contratar.",
  },
  {
    question: "MEI precisa de CNPJ para ter maquininha?",
    answer:
      "Depende da operadora. Algumas permitem maquininha no CPF, outras exigem CNPJ. O Mercado Pago, por exemplo, permite associar a maquininha ao CPF do MEI, mas recomendamos usar o CNPJ para manter a organização financeira separada.",
  },
  {
    question: "Maquininha sem aluguel vale a pena para MEI?",
    answer:
      "Maquininha sem mensalidade geralmente tem taxa maior por transação. Para MEI com baixo volume de vendas no cartão, pode ser vantajosa. Para quem vende bastante, um plano com mensalidade e taxas menores pode sair mais barato no total. Faça a conta com base no seu volume médio.",
  },
  {
    question: "Vale a pena pagar pela antecipação de recebíveis?",
    answer:
      "Antecipação de crédito parcelado tem custo adicional (percentual sobre o valor). Vale a pena avaliar se o caixa do MEI realmente precisa do valor antecipado ou se a taxa de antecipação compromete a margem. Use com critério, não por hábito.",
  },
  {
    question: "Qual maquininha funciona melhor em área rural ou sem Wi-Fi?",
    answer:
      "Maquininhas com conectividade 3G/4G própria funcionam independente de Wi-Fi. Verifique a cobertura da operadora de dados da maquininha na sua região antes de contratar.",
  },
];

export default function MelhorMaquininhaPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "MEI", url: "https://irpf.qaplay.com.br/mei" },
          { name: "Melhor maquininha para MEI", url: "https://irpf.qaplay.com.br/mei/melhor-maquininha-para-mei" },
        ]}
      />
      <JsonLdFAQ faqs={faqs} />
      <JsonLdArticle
        title="Melhor maquininha para MEI: o que analisar antes de escolher"
        description="Guia para MEI escolher maquininha com base em taxa, conectividade, tipo de negócio e organização do faturamento."
        url="https://irpf.qaplay.com.br/mei/melhor-maquininha-para-mei"
        image="https://irpf.qaplay.com.br/og-image.svg"
        imageAlt="Melhor maquininha para MEI — Consultoria NSB"
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
          <span className="opacity-70">Melhor maquininha para MEI</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <span className="text-[10px] uppercase tracking-widest text-verde block mb-4">
              Guia de recebimentos — MEI
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Melhor maquininha para MEI: o que analisar antes de escolher
            </h1>

            <div className="bg-base border-l-4 border-verde p-5 mb-8">
              <strong className="block text-sm font-bold mb-2">Resumo rápido</strong>
              <ul className="text-sm opacity-70 space-y-1 list-disc pl-5">
                <li>Não existe a &ldquo;melhor&rdquo; maquininha universal — depende do seu negócio</li>
                <li>Taxa, conectividade, prazo de repasse e suporte variam por operadora</li>
                <li>Avalie: volume mensal, tipo de venda, necessidade de tela e relatórios</li>
                <li>Tudo que entrar pela maquininha entra no faturamento do MEI</li>
              </ul>
            </div>

            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              A pergunta &quot;qual a melhor maquininha para MEI?&quot; aparece muito — e a resposta honesta é: <strong>depende do seu negócio</strong>. Antes de contratar qualquer solução, há critérios objetivos que você deve avaliar. Este guia apresenta cada um deles.
            </p>

            <h2 className="font-serif text-3xl mb-4">1. Tipo de negócio: presencial, delivery ou online?</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              O primeiro critério é onde e como você vende:
            </p>
            <div className="space-y-3 mb-8">
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm">Venda presencial (loja, balcão, salão)</strong>
                <p className="text-sm opacity-60 mt-1">Maquininha fixa ou portátil, conectada por Wi-Fi ou 4G. Priorize estabilidade e bateria longa.</p>
              </div>
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm">Delivery e prestação de serviço na rua</strong>
                <p className="text-sm opacity-60 mt-1">Maquininha com 4G é essencial. Verifique a cobertura da operadora de dados na sua região.</p>
              </div>
              <div className="border border-[#0A0A0A]/15 p-4">
                <strong className="text-sm">Venda online (WhatsApp, Instagram)</strong>
                <p className="text-sm opacity-60 mt-1">Link de pagamento pode ser suficiente. Maquininha física pode ser dispensável.</p>
              </div>
            </div>

            <h2 className="font-serif text-3xl mb-4">2. Taxa: como calcular o custo real</h2>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              A taxa em si não é o único número que importa. O custo real envolve:
            </p>
            <ul className="text-sm opacity-70 space-y-2 mb-4 list-disc pl-5">
              <li><strong>Taxa no débito</strong> — geralmente a menor (0,99% a 1,5%)</li>
              <li><strong>Taxa no crédito à vista</strong> — intermediária (2% a 3%)</li>
              <li><strong>Taxa no crédito parcelado</strong> — a mais alta, podendo superar 4%</li>
              <li><strong>Antecipação de recebíveis</strong> — custo extra se quiser receber antes do prazo</li>
              <li><strong>Mensalidade ou taxa de adesão</strong> — verifique se há cobrança fixa</li>
            </ul>
            <div className="bg-amarelo/10 border-l-4 border-amarelo p-4 mb-8">
              <strong className="text-sm block mb-1">Dica prática</strong>
              <p className="text-sm opacity-70">
                Calcule sua taxa efetiva com base no mix de pagamentos do seu negócio. Se 80% das suas vendas são no débito, a taxa do crédito parcelado pesa menos. Simule com o seu volume real.
              </p>
            </div>

            <h2 className="font-serif text-3xl mb-4">3. Prazo de repasse: quando o dinheiro cai na conta</h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Débito: repasse geralmente em D+1 a D+2. Crédito à vista: entre D+14 e D+30. Crédito parcelado: em parcelas mensais. Antecipação reduz o prazo, mas tem custo. Para MEI com caixa curto, verifique qual operadora repassa mais rápido no crédito à vista.
            </p>

            <h2 className="font-serif text-3xl mb-4">4. Conectividade: Wi-Fi ou 4G?</h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Maquininhas com chip 4G próprio funcionam em qualquer lugar com sinal. Se você trabalha em área coberta por Wi-Fi confiável, uma solução Wi-Fi pode ser mais barata. Para quem trabalha na rua, em eventos ou faz delivery, o 4G é essencial.
            </p>

            <h2 className="font-serif text-3xl mb-4">5. Relatórios e integração com o faturamento</h2>
            <p className="text-sm opacity-70 mb-8 leading-relaxed">
              Para o MEI, o controle do faturamento é obrigação — não opção. Verifique se a maquininha ou app associado permite exportar relatório mensal de vendas. Isso facilita muito a preparação para a DASN-SIMEI e reduz o risco de declarar errado.
            </p>

            <h2 className="font-serif text-3xl mb-4">Quando a maquininha faz sentido</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Você atende clientes presencialmente com frequência</li>
              <li>Seus clientes preferem pagar no cartão</li>
              <li>Seu ticket médio é alto e o cartão facilita a decisão de compra</li>
              <li>Você quer relatório automático de vendas para controle fiscal</li>
            </ul>

            <h2 className="font-serif text-3xl mb-4">Quando a maquininha talvez não faça sentido</h2>
            <ul className="text-sm opacity-70 space-y-2 mb-8 list-disc pl-5">
              <li>Todas as suas vendas são via WhatsApp ou online (link de pagamento basta)</li>
              <li>Seus clientes pagam sempre em dinheiro ou Pix</li>
              <li>Seu volume mensal no cartão é muito baixo (a taxa não compensa)</li>
            </ul>

            <MaquininhaAfiliado product="point-pro-3" context="Indicada para MEI com atendimento presencial, balcão ou delivery." />
            <MaquininhaAfiliado product="point-smart-2" context="Para MEI que valoriza tela touchscreen, relatórios integrados e uso mais profissional." />

            <h2 className="font-serif text-3xl mb-6 mt-12">Dúvidas frequentes</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-preto/10 pb-6">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <MeiGuiasRelacionados currentSlug="melhor-maquininha-para-mei" max={4} includePrincipal />
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
