import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

export const metadata: Metadata = {
  title: "Servicos | Consultoria IRPF NSB",
  description:
    "Declaracao IRPF completa, atrasados, retificacao e malha fina. Atendimento 100% online para todo o Brasil.",
};

const servicos = [
  {
    num: "01",
    title: "Declaracao Completa",
    desc: "Analise minuciosa de todos os rendimentos, deducoes e patrimonio. Maximizamos sua restituicao dentro da legalidade, garantindo conformidade total com a Receita Federal.",
    items: [
      "Rendimentos de trabalho e investimentos",
      "Deducoes com saude, educacao e dependentes",
      "Bens e direitos atualizados",
      "Restituicao maximizada",
    ],
  },
  {
    num: "02",
    title: "IRPF Atrasado",
    desc: "Regularizacao de declaracoes em atraso de qualquer ano. Calculamos multas e juros, preparamos a declaracao e orientamos sobre o pagamento para normalizar seu CPF.",
    items: [
      "Declaracoes de anos anteriores",
      "Calculo preciso de multas e juros",
      "Regularizacao do CPF",
      "Orientacao sobre parcelamento",
    ],
  },
  {
    num: "03",
    title: "Retificacao",
    desc: "Correcao de declaracoes ja entregues com erros, inconsistencias ou informacoes faltantes. Prevencao contra malha fina e pendencias futuras.",
    items: [
      "Correcao de valores incorretos",
      "Inclusao de rendimentos omitidos",
      "Ajuste de deducoes",
      "Prazo de ate 5 anos",
    ],
  },
  {
    num: "04",
    title: "Malha Fina",
    desc: "Consultoria especializada para quem caiu na malha fina. Identificamos o motivo da retencao, preparamos a documentacao e acompanhamos ate a resolucao.",
    items: [
      "Identificacao do motivo da retencao",
      "Preparacao de documentos comprobatorios",
      "Retificacao quando necessario",
      "Acompanhamento ate resolucao",
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
        <h1 className="font-serif text-5xl md:text-7xl mb-16">Servicos</h1>

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
