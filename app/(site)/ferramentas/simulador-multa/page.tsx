"use client";

import { useState } from "react";
import type { Metadata } from "next";

const MULTA_MINIMA = 165.74;
const MULTA_MAXIMA = 6275.0;

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularMulta(impostoDevido: number, mesesAtraso: number) {
  if (impostoDevido <= 0 && mesesAtraso > 0) {
    return { multa: MULTA_MINIMA, meses: mesesAtraso };
  }
  const multaBruta = impostoDevido * 0.01 * mesesAtraso;
  const multa20pct = impostoDevido * 0.2;
  const multaLimitada = Math.min(multaBruta, multa20pct);
  const multa = Math.max(Math.min(multaLimitada, MULTA_MAXIMA), MULTA_MINIMA);
  return { multa, meses: mesesAtraso };
}

export default function SimuladorMultaPage() {
  const [imposto, setImposto] = useState("");
  const [meses, setMeses] = useState("");
  const [resultado, setResultado] = useState<{ multa: number; meses: number } | null>(null);

  function handleCalc() {
    const imp = parseFloat(imposto.replace(/\D/g, "")) / 100 || 0;
    const m = parseInt(meses, 10) || 1;
    setResultado(calcularMulta(imp, m));
  }

  function handleInput(value: string, setter: (v: string) => void) {
    const num = value.replace(/\D/g, "");
    if (!num) { setter(""); return; }
    const cents = parseInt(num, 10);
    setter((cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
  }

  return (
    <main className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Ferramenta Gratuita
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-4">
          Simulador de Multa
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Calcule a multa por atraso na entrega da declaracao IRPF com base nas
          regras da Receita Federal.
        </p>
      </section>

      <section className="bg-white py-24 editorial-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Simular Multa por Atraso
              </h2>
              <p className="opacity-70 mb-12">
                A multa por atraso e de 1% ao mes sobre o imposto devido, com
                minimo de R$ 165,74 e maximo de R$ 6.275,00 (limitada a 20% do
                imposto).
              </p>

              <div className="space-y-8">
                <div>
                  <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                    Imposto de Renda Devido (R$)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={imposto}
                    onChange={(e) => handleInput(e.target.value, setImposto)}
                    className="calc-input font-serif text-2xl"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                    Meses de Atraso
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={meses}
                    onChange={(e) => setMeses(e.target.value)}
                    className="calc-input font-serif text-2xl"
                    placeholder="1"
                  />
                </div>
                <button
                  onClick={handleCalc}
                  className="w-full bg-preto text-white py-5 uppercase text-xs tracking-[0.2em] font-bold hover:bg-preto/80 transition"
                >
                  Calcular Multa
                </button>
              </div>
            </div>

            <div className={`p-12 flex flex-col justify-center items-center text-center border border-gray-100 ${resultado ? "bg-red-50" : "bg-base"}`}>
              {resultado ? (
                <>
                  <span className="font-serif italic text-xl mb-2 text-gray-400">
                    Multa Estimada ({resultado.meses} {resultado.meses === 1 ? "mes" : "meses"})
                  </span>
                  <span className="font-serif text-5xl font-light mb-4 text-red-600">
                    {formatCurrency(resultado.multa)}
                  </span>
                  <p className="text-sm opacity-60">
                    Regularize sua situacao o quanto antes para evitar o acumulo
                    de multas e juros.
                  </p>
                </>
              ) : (
                <>
                  <span className="font-serif italic text-xl mb-4 text-gray-400">
                    Multa Estimada
                  </span>
                  <span className="font-serif text-5xl font-light mb-2">
                    R$ 0,00
                  </span>
                  <span className="text-xs uppercase tracking-widest opacity-50">
                    Aguardando dados...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
