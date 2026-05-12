import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MeiLeadForm from "@/components/site/MeiLeadForm";
import { JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Serviços para MEI — Declaração, Abertura, Dívidas e Parcelamento",
  description:
    "Especialista em MEI: Declaração DASN-SIMEI, abertura, cancelamento, parcelamento de DAS e MEI + IRPF. Atendimento 100% online para todo o Brasil.",
  alternates: { canonical: "https://irpf.qaplay.com.br/mei" },
  openGraph: {
    title: "Serviços para MEI | Consultoria NSB",
    description:
      "Nilson Brites resolve tudo do seu MEI: DASN-SIMEI, dívidas, abertura, cancelamento e IRPF. 100% online.",
    url: "https://irpf.qaplay.com.br/mei",
  },
};

const servicos = [
  {
    num: "01",
    title: "Declaração Anual (DASN-SIMEI)",
    desc: "Entrega a declaração anual obrigatória do MEI com todos os faturamentos informados corretamente. Prazo: 31 de maio — quem atrasa paga multa mínima de R$ 50.",
    href: "/mei/declaracao-anual",
    tag: "Prazo 31/mai",
  },
  {
    num: "02",
    title: "Abertura do MEI",
    desc: "Formalize seu negócio como Microempreendedor Individual. Orientação completa para enquadramento, CNAE correto e evitar erros comuns.",
    href: "/mei/abertura-mei",
    tag: "Rápido",
  },
  {
    num: "03",
    title: "Cancelamento / Baixa do MEI",
    desc: "Encerrou a atividade? Regularize antes da dívida crescer. Orientação completa sobre baixa no Portal do Empreendedor e quitação pendente.",
    href: "/mei/cancelamento-mei",
    tag: "Evite multas",
  },
  {
    num: "04",
    title: "Dívidas e Parcelamento de DAS",
    desc: "DAS atrasado acumula multa e juros. Negociamos o parcelamento em até 60 meses e verificamos elegibilidade ao Desenrola Empresas.",
    href: "/mei/dividas-parcelamento",
    tag: "Desenrola",
  },
  {
    num: "05",
    title: "MEI + Imposto de Renda (IRPF)",
    desc: "Todo MEI que recebe acima de R$ 33.888 deve declarar IRPF. Entenda quando você é obrigado e como declarar lucro e pró-labore corretamente.",
    href: "/mei/mei-e-irpf",
    tag: "Obrigação PF",
  },
];

const faqs = [
  {
    question: "MEI precisa declarar Imposto de Renda?",
    answer:
      "Depende da sua situação como pessoa física. Se você recebeu rendimentos acima de R$ 33.888 em 2025 (incluindo pró-labore e outros rendimentos), deve declarar o IRPF normalmente. O MEI em si entrega a DASN-SIMEI, que é separada da declaração do IR da pessoa física.",
  },
  {
    question: "Quando é o prazo da declaração anual do MEI (DASN-SIMEI)?",
    answer:
      "O prazo final é 31 de maio de cada ano. Em 2026, a declaração referente ao ano-calendário 2025 deve ser entregue até 31/05/2026. Quem não entrega paga multa mínima de R$ 50.",
  },
  {
    question: "Quanto custa o DAS do MEI em 2026?",
    answer:
      "O DAS varia conforme a atividade: Comércio e Indústria: R$ 73,00/mês; Serviços: R$ 79,90/mês; Comércio + Serviços: R$ 80,90/mês. Todos os valores incluem INSS, ISS e/ou ICMS.",
  },
  {
    question: "Posso parcelar os DAS atrasados?",
    answer:
      "Sim. É possível parcelar os DAS em atraso em até 60 meses via Receita Federal. Além disso, o Desenrola Empresas e o Procred MEI oferecem renegociação com descontos sobre multas e juros para dívidas elegíveis.",
  },
  {
    question: "Como funciona o cancelamento do MEI?",
    answer:
      "A baixa do MEI é feita pelo Portal do Empreendedor (gov.br). Antes, é necessário quitar todos os DAS em aberto e entregar a DASN-SIMEI do ano corrente (com declaração proporcional ao período de atividade). Importante: cancelar sem quitar as dívidas não elimina a cobrança.",
  },
];

export default function MeiHubPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[{ name: "MEI", url: "https://irpf.qaplay.com.br/mei" }]}
      />
      <JsonLdFAQ faqs={faqs} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pb-16 border-b border-preto/10">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
          Serviços MEI
        </p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6 max-w-3xl">
          Tudo que seu MEI precisa em um só lugar
        </h1>
        <p className="text-lg opacity-60 max-w-2xl leading-relaxed">
          Nilson Brites é Analista Financeiro com mais de 10 anos de experiência. Atende MEI em todo
          o Brasil: declaração anual, abertura, cancelamento, parcelamento de dívidas e IRPF da
          pessoa física.
        </p>
      </section>

      {/* Serviços */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-serif text-4xl">Serviços para MEI</h2>
          <span className="text-[10px] uppercase tracking-widest opacity-40">
            Atendimento online
          </span>
        </div>

        <div className="space-y-0">
          {servicos.map((s) => (
            <Link
              key={s.num}
              href={s.href}
              className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6 editorial-border cursor-pointer block"
            >
              <span className="font-serif italic text-3xl opacity-30 md:w-16 shrink-0">
                {s.num}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl md:w-72 shrink-0 group-hover:italic transition-all">
                {s.title}
              </h3>
              <p className="text-sm opacity-60 leading-relaxed flex-1">{s.desc}</p>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[10px] uppercase tracking-widest bg-verde/10 text-verde px-3 py-1">
                  {s.tag}
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Formulário + Info */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-16 border-t border-preto/10">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
            Contato
          </p>
          <h2 className="font-serif text-4xl mb-6">Falar com Nilson sobre meu MEI</h2>
          <p className="text-sm opacity-60 leading-relaxed mb-8">
            Atendimento 100% online. Resposta rápida pelo WhatsApp. Nilson resolve sua situação com
            MEI de forma prática e segura.
          </p>
          <div className="space-y-4 text-sm opacity-50">
            <p>✓ Mais de 10 anos de experiência</p>
            <p>✓ 100% online — todo o Brasil</p>
            <p>✓ Resposta rápida pelo WhatsApp</p>
            <p>✓ Sem burocracia</p>
          </div>
        </div>
        <MeiLeadForm origem="mei-hub" />
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-preto/10">
        <h2 className="font-serif text-4xl mb-10">Perguntas Frequentes sobre MEI</h2>
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

      {/* Links internos relacionados */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-preto/10">
        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4">
          Também pode interessar
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/declarar-agora"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Declarar IRPF 2026 →
          </Link>
          <Link
            href="/desenrola-brasil"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Desenrola Brasil — renegociar dívidas →
          </Link>
          <Link
            href="/blog"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition"
          >
            Blog IRPF & MEI →
          </Link>
        </div>
      </section>
    </main>
  );
}
