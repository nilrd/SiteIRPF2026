"use client";

/**
 * CalculadoraVendasCartao.tsx
 * Calculadora simples: quanto o MEI recebe no cartão por mês →
 * projeção anual e percentual do limite MEI (R$ 81.000).
 * Ferramenta educativa — não substitui contabilidade profissional.
 */

import { useState, useEffect, useRef } from "react";

const MEI_LIMIT = 81_000;

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CalculadoraVendasCartao() {
  const [monthly, setMonthly] = useState<string>("");
  const trackedRef = useRef(false);

  const num = Math.max(0, parseFloat(monthly) || 0);

  // Track once per session when user has typed a meaningful value
  useEffect(() => {
    if (num > 0 && !trackedRef.current) {
      trackedRef.current = true;
      const page = typeof window !== "undefined" ? window.location.pathname : "/";
      if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "cartao_calculator_use", { page_path: page });
      }
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ type: "cartao_calculator_use", page }]),
      }).catch(() => {});
    }
  }, [num]);

  const annual = num * 12;
  const pct = annual > 0 ? (annual / MEI_LIMIT) * 100 : 0;
  const overLimit = annual >= MEI_LIMIT;
  const nearLimit = !overLimit && annual >= MEI_LIMIT * 0.75;

  return (
    <section className="border-2 border-[#0A0A0A] p-8 my-10">
      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Ferramenta</p>
      <h2 className="font-serif text-2xl mb-1">Calculadora de vendas no cartão</h2>
      <p className="text-sm opacity-60 mb-6">
        Estime quanto suas vendas no cartão representam no ano e como isso ocupa o limite anual do MEI.
      </p>

      <label htmlFor="calc-monthly" className="block text-sm font-semibold mb-2">
        Valor médio que você recebe no cartão por mês:
      </label>
      <div className="flex items-center gap-3 mb-6">
        <span className="font-bold opacity-40 text-sm">R$</span>
        <input
          id="calc-monthly"
          type="number"
          min="0"
          step="100"
          placeholder="ex: 4000"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          className="border-2 border-[#0A0A0A] bg-[#F5F5F2] px-4 py-3 text-sm w-44 focus:outline-none focus:border-[#C6FF00]"
        />
      </div>

      {num > 0 && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A] text-[#F5F5F2] p-5">
              <p className="text-xs opacity-50 mb-1 uppercase tracking-widest">Por mês</p>
              <p className="font-serif text-xl">{formatBRL(num)}</p>
            </div>
            <div className="bg-[#0A0A0A] text-[#F5F5F2] p-5">
              <p className="text-xs opacity-50 mb-1 uppercase tracking-widest">Projeção anual</p>
              <p className="font-serif text-xl">{formatBRL(annual)}</p>
            </div>
            <div
              className={`p-5 text-[#F5F5F2] ${
                overLimit ? "bg-red-800" : nearLimit ? "bg-yellow-700" : "bg-[#0A0A0A]"
              }`}
            >
              <p className="text-xs opacity-50 mb-1 uppercase tracking-widest">% do limite MEI</p>
              <p className="font-serif text-xl">{Math.min(pct, 999).toFixed(0)}%</p>
            </div>
          </div>

          {overLimit && (
            <p className="text-sm border border-red-300 bg-red-50 text-red-800 p-4">
              <strong>Atenção:</strong> sua projeção supera o limite anual do MEI (R$ 81.000).
              Considere consultar um contador para avaliar seu enquadramento fiscal.
            </p>
          )}
          {nearLimit && (
            <p className="text-sm border border-yellow-300 bg-yellow-50 text-yellow-800 p-4">
              <strong>Atenção:</strong> sua projeção está acima de 75% do limite anual. Acompanhe de perto
              o faturamento total — que inclui Pix, dinheiro e todos os recebimentos, não só cartão.
            </p>
          )}

          <p className="text-[11px] opacity-40">
            * Simulação para referência. O faturamento MEI inclui todos os recebimentos (Pix, dinheiro, cartão,
            link de pagamento). Limite vigente: R$ 81.000/ano — sujeito a alteração pela legislação.
          </p>
        </div>
      )}
    </section>
  );
}
