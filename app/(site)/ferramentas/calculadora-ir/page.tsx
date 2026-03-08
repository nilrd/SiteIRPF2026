import type { Metadata } from "next";
import CalculadoraSection from "@/components/site/CalculadoraSection";

export const metadata: Metadata = {
  title: "Calculadora de Imposto de Renda 2026 | Consultoria IRPF NSB",
  description:
    "Calcule seu imposto de renda com a tabela oficial da Receita Federal 2026. Simulador gratuito e preciso.",
};

export default function CalculadoraPage() {
  return (
    <main className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Ferramenta Gratuita
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-4">
          Calculadora IR
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Simule seu imposto de renda com base na tabela progressiva oficial da
          Receita Federal para o exercicio 2026.
        </p>
      </section>
      <CalculadoraSection />
    </main>
  );
}
