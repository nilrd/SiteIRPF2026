"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const WA_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Quero declarar meu IRPF e ter todas as minhas deduções verificadas.")}`;

/* Tabela IRPF 2025 Anual — Exercício 2026 (declara renda de 2025 — temporada atual) */
const FAIXAS_2025 = [
  { limite: 28467.20, aliquota: 0,     deducao: 0        },
  { limite: 33919.80, aliquota: 0.075, deducao: 2135.04  },
  { limite: 45012.60, aliquota: 0.15,  deducao: 4679.03  },
  { limite: 55976.16, aliquota: 0.225, deducao: 8054.97  },
  { limite: Infinity, aliquota: 0.275, deducao: 10853.78 },
];

const DEDUCAO_DEPENDENTE_ANUAL = 2275.08;
const DEDUCAO_EDUCACAO_MAX     = 3561.50; // por pessoa
const DESCONTO_SIMPLIFICADO    = 16754.34; // dedução fixa sem comprovantes — 2025

function calcular(renda: number, simpl: boolean, dependentes: number, saude: number, educacao: number, inss: number) {
  let dedDep = 0, dedEduc = 0, dedSaude = 0, dedInss = 0, descSimpl = 0;

  if (simpl) {
    descSimpl = DESCONTO_SIMPLIFICADO;
  } else {
    dedDep   = dependentes * DEDUCAO_DEPENDENTE_ANUAL;
    dedEduc  = Math.min(educacao, DEDUCAO_EDUCACAO_MAX * Math.max(1, dependentes));
    dedSaude = saude;
    dedInss  = inss;
  }

  const total   = simpl ? descSimpl : dedDep + dedSaude + dedEduc + dedInss;
  const base    = Math.max(renda - total, 0);
  const faixa   = FAIXAS_2025.find((f) => base <= f.limite) ?? FAIXAS_2025[4];
  const imposto = Math.max(base * faixa.aliquota - faixa.deducao, 0);
  const aliq    = renda > 0 ? (imposto / renda) * 100 : 0;
  return { dedDep, dedEduc, dedSaude, dedInss, descSimpl, total, base, imposto, aliq };
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function useMask(initial = "") {
  const [val, setVal] = useState(initial);
  function onChange(raw: string) {
    const num = raw.replace(/\D/g, "");
    if (!num) { setVal(""); return; }
    setVal((parseInt(num, 10) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
  }
  function toNumber() {
    return parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
  }
  return { val, onChange, toNumber };
}

export default function CalculadoraSection() {
  const renda   = useMask();
  const saude   = useMask();
  const educ    = useMask();
  const inss    = useMask();
  const [deps,      setDeps]      = useState(0);
  const [simpl,     setSimpl]     = useState(false);
  const [resultado, setResultado] = useState<ReturnType<typeof calcular> | null>(null);

  function handleCalc() {
    setResultado(calcular(renda.toNumber(), simpl, deps, saude.toNumber(), educ.toNumber(), inss.toNumber()));
  }

  return (
    <section id="calculadora" className="bg-white py-14 editorial-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[10px] uppercase tracking-widest text-ouro block mb-3">
              IRPF 2026 — Renda de 2025
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mb-3">
              Calculadora de IR
            </h2>
            <p className="opacity-60 text-sm mb-4">
              Estimativa usando a tabela oficial 2025 (exercício 2026). Preencha o que souber — mais campos = cálculo mais preciso.
            </p>
            <p className="text-xs opacity-40 mb-8 leading-relaxed border-l-2 border-ouro/40 pl-3">
              Para rendas recebidas em 2026 (a declarar em 2027), haverá isenção até R$5.000/mês pela Lei 15.270/2025.
            </p>

            <div className="space-y-6">
              {/* Renda */}
              <div>
                <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                  Rendimentos tributaveis anuais (R$)
                </label>
                <input
                  type="text" inputMode="numeric"
                  value={renda.val} onChange={(e) => renda.onChange(e.target.value)}
                  className="calc-input font-serif text-xl" placeholder="0,00"
                />
              </div>

              {/* Toggle tipo de deducao */}
              <div>
                <span className="text-xs uppercase tracking-widest opacity-60 block mb-3">
                  Tipo de deducao
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSimpl(false)}
                    className={`flex-1 py-3 border text-xs uppercase tracking-widest transition ${
                      !simpl ? "bg-preto text-white border-preto" : "border-gray-300 hover:border-preto"
                    }`}
                  >
                    Declaracao completa
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimpl(true)}
                    className={`flex-1 py-3 border text-xs uppercase tracking-widest transition ${
                      simpl ? "bg-preto text-white border-preto" : "border-gray-300 hover:border-preto"
                    }`}
                  >
                    Desconto simplificado
                  </button>
                </div>
                {simpl && (
                  <span className="text-xs opacity-40 mt-1 block">
                    Desconto fixo de {fmt(DESCONTO_SIMPLIFICADO)}/ano — sem necessidade de comprovantes
                  </span>
                )}
              </div>

              {!simpl && (
                <>
                  {/* Dependentes */}
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                      Numero de dependentes (filhos, pais a cargo)
                    </label>
                    <div className="flex gap-3">
                      {[0,1,2,3,4,5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setDeps(n)}
                          className={`w-10 h-10 border text-sm font-serif transition ${
                            deps === n
                              ? "bg-preto text-white border-preto"
                              : "border-gray-300 hover:border-preto"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {deps > 0 && (
                      <span className="text-xs opacity-40 mt-1 block">
                        Deducao: {fmt(deps * DEDUCAO_DEPENDENTE_ANUAL)}/ano
                      </span>
                    )}
                  </div>

                  {/* Saude */}
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                      Despesas medicas e saude (R$) — sem limite de deducao
                    </label>
                    <input
                      type="text" inputMode="numeric"
                      value={saude.val} onChange={(e) => saude.onChange(e.target.value)}
                      className="calc-input font-serif text-xl" placeholder="0,00"
                    />
                  </div>

                  {/* INSS */}
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                      INSS / Previdencia oficial pago (R$)
                    </label>
                    <input
                      type="text" inputMode="numeric"
                      value={inss.val} onChange={(e) => inss.onChange(e.target.value)}
                      className="calc-input font-serif text-xl" placeholder="0,00"
                    />
                  </div>

                  {/* Educacao */}
                  <div>
                    <label className="text-xs uppercase tracking-widest opacity-60 block mb-2">
                      Educacao — propria e dependentes (R$) — limite {fmt(DEDUCAO_EDUCACAO_MAX)}/pessoa
                    </label>
                    <input
                      type="text" inputMode="numeric"
                      value={educ.val} onChange={(e) => educ.onChange(e.target.value)}
                      className="calc-input font-serif text-xl" placeholder="0,00"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleCalc}
                className="w-full bg-preto text-white py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-preto/80 transition"
              >
                Calcular Estimativa
              </button>
            </div>
          </motion.div>

          {/* Result side */}
          <motion.div
            className="p-8 md:p-10 flex flex-col justify-center border border-gray-100 bg-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {resultado ? (
              <>
                <span className="text-[10px] uppercase tracking-widest opacity-40 mb-6 block">
                  Resultado estimado — IRPF 2026 (renda de 2025)
                </span>

                {/* Deducoes breakdown */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between opacity-60">
                    <span>Renda bruta</span>
                    <span>{fmt(renda.toNumber())}</span>
                  </div>
                  {resultado.descSimpl > 0 && (
                    <div className="flex justify-between opacity-60">
                      <span>— Desconto simplificado</span>
                      <span>- {fmt(resultado.descSimpl)}</span>
                    </div>
                  )}
                  {resultado.dedDep > 0 && (
                    <div className="flex justify-between opacity-60">
                      <span>— Dependentes ({deps}x)</span>
                      <span>- {fmt(resultado.dedDep)}</span>
                    </div>
                  )}
                  {resultado.dedSaude > 0 && (
                    <div className="flex justify-between opacity-60">
                      <span>— Saude</span>
                      <span>- {fmt(resultado.dedSaude)}</span>
                    </div>
                  )}
                  {resultado.dedInss > 0 && (
                    <div className="flex justify-between opacity-60">
                      <span>— INSS</span>
                      <span>- {fmt(resultado.dedInss)}</span>
                    </div>
                  )}
                  {resultado.dedEduc > 0 && (
                    <div className="flex justify-between opacity-60">
                      <span>— Educacao</span>
                      <span>- {fmt(resultado.dedEduc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Base de calculo</span>
                    <span>{fmt(resultado.base)}</span>
                  </div>
                </div>

                {/* IR */}
                <div className={`text-center py-6 mb-6 ${resultado.imposto === 0 ? "bg-green-50" : "bg-ouro/5"}`}>
                  <span className="font-serif italic text-sm text-gray-400 block mb-1">
                    {resultado.imposto === 0 ? "Isento de IR" : "IR estimado devido"}
                  </span>
                  <span className={`font-serif text-4xl ${resultado.imposto === 0 ? "text-green-600" : "text-preto"}`}>
                    {fmt(resultado.imposto)}
                  </span>
                  <span className="block text-xs opacity-40 mt-2">
                    Aliquota efetiva: {resultado.aliq.toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs opacity-50 leading-relaxed mb-6">
                  Estimativa simplificada. Um consultor pode identificar deducoes adicionais — PGBL, pensao alimenticia, livro-caixa, doacoes — conforme sua situacao especifica.
                </p>

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-verde text-white py-4 uppercase text-xs tracking-widest font-bold hover:bg-verde/90 transition"
                >
                  Quero uma analise completa
                </a>
              </>
            ) : (
              <div className="text-center">
                <span className="font-serif italic text-3xl text-gray-200 block mb-4">
                  IR
                </span>
                <p className="text-sm opacity-40">
                  Preencha os campos ao lado para ver sua estimativa
                </p>
                <div className="space-y-1 text-xs opacity-30 mt-4 text-left border border-gray-100 p-3">
                  <p className="font-semibold uppercase tracking-widest opacity-70 mb-2">Tabela 2025 (anual)</p>
                  <p>Ate {fmt(28467.20)} — Isento</p>
                  <p>{fmt(28467.21)} a {fmt(33919.80)} — 7,5%</p>
                  <p>{fmt(33919.81)} a {fmt(45012.60)} — 15%</p>
                  <p>{fmt(45012.61)} a {fmt(55976.16)} — 22,5%</p>
                  <p>Acima de {fmt(55976.16)} — 27,5%</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
