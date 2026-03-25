import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

export const metadata: Metadata = {
  title: "Serviços | Consultoria IRPF NSB",
  description:
    "Declaração IRPF completa, atrasados, retificação e malha fina. Atendimento 100% online para todo o Brasil.",
  keywords: ["declaração IRPF", "imposto de renda atrasado", "retificação IRPF", "malha fina", "serviços IRPF online"],
  alternates: { canonical: "https://irpf.qaplay.com.br/servicos" },
};

const servicos = [
  {
    num: "01",
    title: "Declaração Completa",
    desc: "Análise minuciosa de todos os rendimentos, deduções e patrimônio. Maximizamos sua restituição dentro da legalidade, garantindo conformidade total com a Receita Federal.",
    items: [
      "Rendimentos de trabalho e investimentos",
      "Deduções com saúde, educação e dependentes",
      "Bens e direitos atualizados",
      "Restituição maximizada",
    ],
  },
  {
    num: "02",
    title: "IRPF Atrasado",
    desc: "Regularização de declarações em atraso de qualquer ano. Calculamos multas e juros, preparamos a declaração e orientamos sobre o pagamento para normalizar seu CPF.",
    items: [
      "Declarações de anos anteriores",
      "Cálculo preciso de multas e juros",
      "Regularização do CPF",
      "Orientação sobre parcelamento",
    ],
  },
  {
    num: "03",
    title: "Retificação",
    desc: "Correção de declarações já entregues com erros, inconsistências ou informações faltantes. Prevenção contra malha fina e pendências futuras.",
    items: [
      "Correção de valores incorretos",
      "Inclusão de rendimentos omitidos",
      "Ajuste de deduções",
      "Prazo de até 5 anos",
    ],
  },
  {
    num: "04",
    title: "Malha Fina",
    desc: "Consultoria especializada para quem caiu na malha fina. Identificamos o motivo da retenção, preparamos a documentação e acompanhamos até a resolução.",
    items: [
      "Identificação do motivo da retenção",
      "Preparação de documentos comprobatórios",
      "Retificação quando necessário",
      "Acompanhamento até resolução",
    ],
  },
];

export default function ServicosPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Servicos", url: "https://irpf.qaplay.com.br/servicos" },
        ]}
      />
      <section className="max-w-7xl mx-auto px-6">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Nossas Especialidades
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-16">Serviços</h1>

        <div className="space-y-20">
          {servicos.map((s) => (
            <div key={s.num} className="grid md:grid-cols-12 gap-8 editorial-border pb-16">
              <div className="md:col-span-1">
                <span className="font-serif italic text-3xl opacity-30">
                  {s.num}
                </span>
              </div>
              <div className="md:col-span-5">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">
                  {s.title}
                </h2>
                <p className="opacity-70 leading-relaxed">{s.desc}</p>
              </div>
              <div className="md:col-span-4">
                <ul className="space-y-3">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="w-1 h-1 rounded-full bg-ouro mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2 flex items-start justify-end">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium px-6 py-3 inline-flex items-center gap-2 uppercase text-xs tracking-widest font-bold"
                >
                  Contratar <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
