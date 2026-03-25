import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import EbookForm from "@/components/site/EbookForm";

export const metadata: Metadata = {
  title: "E-book Gratuito IRPF | Consultoria IRPF NSB",
  description:
    "Baixe nosso e-book gratuito com tudo que você precisa saber sobre a declaração de IRPF. Guia completo e atualizado.",
  keywords: ["e-book IRPF", "guia imposto de renda", "declaração IRPF grátis", "e-book gratuito IRPF"],
  alternates: { canonical: "https://irpf.qaplay.com.br/ebook" },
};

export default function EbookPage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "E-book Gratuito", url: "https://irpf.qaplay.com.br/ebook" },
        ]}
      />
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
              Material Gratuito
            </span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6">
              Guia Completo do IRPF
            </h1>
            <p className="text-lg opacity-70 mb-8 leading-relaxed">
              Tudo que você precisa saber sobre a declaração de Imposto de Renda
              Pessoa Física em um único guia. Tabelas atualizadas, prazos,
              deduções e dicas para maximizar sua restituição.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                "Quem é obrigado a declarar",
                "Tabela progressiva atualizada",
                "Principais deduções permitidas",
                "Prazos e multas por atraso",
                "Como evitar a malha fina",
                "Dicas de organização documental",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="w-1 h-1 rounded-full bg-ouro mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <EbookForm />
          </div>

          {/* Placeholder visual */}
          <div className="bg-verde/5 border border-verde/10 p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
            <span className="font-serif text-8xl text-verde/20 mb-4">IR</span>
            <span className="font-serif text-2xl mb-2">Guia IRPF</span>
            <span className="text-[10px] uppercase tracking-widest opacity-40">
              Consultoria IRPF NSB
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
