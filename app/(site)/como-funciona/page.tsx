import type { Metadata } from "next";
import ProcessoSection from "@/components/site/ProcessoSection";
import FAQSection from "@/components/site/FAQSection";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

export const metadata: Metadata = {
  title: "Como Funciona | Consultoria IRPF NSB",
  description:
    "Veja como funciona nosso processo de declaração IRPF. Simples, rápido e 100% online.",
  keywords: ["como funciona IRPF", "processo declaração imposto de renda", "declarar IRPF online", "passo a passo IRPF"],
  alternates: { canonical: "https://irpf.qaplay.com.br/como-funciona" },
};

const etapasDetalhadas = [
  {
    num: "01",
    title: "Entre em contato",
    desc: "Envie uma mensagem pelo WhatsApp ou preencha o formulário no site. Nossa equipe responde em até 2 horas em horário comercial.",
  },
  {
    num: "02",
    title: "Envie seus documentos",
    desc: "Informes de rendimentos, comprovantes de despesas médicas e com educação, dados de dependentes e documentos de bens. Tudo pode ser enviado por foto no WhatsApp.",
  },
  {
    num: "03",
    title: "Receba o orçamento",
    desc: "Analisamos a complexidade da sua declaração e enviamos um orçamento personalizado. Sem surpresas, sem taxas escondidas.",
  },
  {
    num: "04",
    title: "Análise e preparação",
    desc: "Nosso consultor analisa todos os documentos, identifica as melhores deduções e prepara sua declaração com foco em maximizar a restituição.",
  },
  {
    num: "05",
    title: "Revisão e entrega",
    desc: "Você recebe um resumo da declaração para aprovação. Após confirmação, transmitimos a declaração e enviamos o recibo de entrega.",
  },
  {
    num: "06",
    title: "Acompanhamento",
    desc: "Monitoramos o processamento da sua declaração e avisamos sobre a liberação da restituição. Qualquer pendência, resolvemos juntos.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <main className="pt-32 pb-0">
      <JsonLdBreadcrumb
        items={[
          { name: "Como Funciona", url: "https://irpf.qaplay.com.br/como-funciona" },
        ]}
      />
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Passo a Passo
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-8">
          Como Funciona
        </h1>
        <p className="text-lg opacity-70 max-w-2xl mb-16">
          Um processo simples e transparente. Do primeiro contato à entrega da
          declaração, você fica no controle.
        </p>

        <div className="space-y-12">
          {etapasDetalhadas.map((e) => (
            <div key={e.num} className="grid md:grid-cols-12 gap-6 editorial-border pb-10">
              <span className="md:col-span-1 font-serif italic text-2xl text-ouro">
                {e.num}
              </span>
              <h3 className="md:col-span-3 font-serif text-2xl">{e.title}</h3>
              <p className="md:col-span-8 opacity-70 leading-relaxed">
                {e.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium px-10 py-5 inline-block uppercase text-xs tracking-widest font-bold"
          >
            Comecar Agora pelo WhatsApp
          </a>
        </div>
      </section>

      <ProcessoSection />
      <FAQSection />
    </main>
  );
}
