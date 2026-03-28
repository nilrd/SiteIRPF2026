"use client";

import { useState } from "react";
import Link from "next/link";

const TABELA_MENSAL = [
  { faixa: "Até R$ 2.428,80", aliquota: "Isento", deducao: "—", min: 0, max: 2428.8, rate: 0, ded: 0 },
  { faixa: "R$ 2.428,81 a R$ 2.826,65", aliquota: "7,5%", deducao: "R$ 182,16", min: 2428.81, max: 2826.65, rate: 0.075, ded: 182.16 },
  { faixa: "R$ 2.826,66 a R$ 3.751,05", aliquota: "15%", deducao: "R$ 394,16", min: 2826.66, max: 3751.05, rate: 0.15, ded: 394.16 },
  { faixa: "R$ 3.751,06 a R$ 4.664,68", aliquota: "22,5%", deducao: "R$ 675,49", min: 3751.06, max: 4664.68, rate: 0.225, ded: 675.49 },
  { faixa: "Acima de R$ 4.664,68", aliquota: "27,5%", deducao: "R$ 908,73", min: 4664.69, max: Infinity, rate: 0.275, ded: 908.73 },
];

const TABELA_ANUAL = [
  { faixa: "Até R$ 33.888,00", aliquota: "Isento", deducao: "—" },
  { faixa: "R$ 33.888,01 a R$ 45.012,60", aliquota: "7,5%", deducao: "R$ 2.541,60" },
  { faixa: "R$ 45.012,61 a R$ 55.976,16", aliquota: "15%", deducao: "R$ 5.921,55" },
  { faixa: "R$ 55.976,17 a R$ 82.104,00", aliquota: "22,5%", deducao: "R$ 10.116,60" },
  { faixa: "Acima de R$ 82.104,00", aliquota: "27,5%", deducao: "R$ 14.220,60" },
];

const DEDUCOES = [
  { item: "Por dependente", valor: "R$ 2.275,08/ano" },
  { item: "Educação (limite por pessoa)", valor: "R$ 3.561,50/ano" },
  { item: "Desconto simplificado (20% do rendimento)", valor: "Até R$ 16.754,34/ano" },
  { item: "Previdência Oficial (INSS/RPPS)", valor: "Sem limite" },
  { item: "Previdência Privada (PGBL)", valor: "Até 12% da renda bruta" },
  { item: "Despesas médicas", valor: "Sem limite (com comprovante)" },
];

const FAQS = [
  {
    q: "Quem é obrigado a declarar o IRPF 2026?",
    a: "Quem recebeu rendimentos tributáveis acima de R$ 35.584,00 em 2025, teve receita bruta de atividade rural acima de R$ 177.920,00, possuía bens acima de R$ 800.000,00 em 31/12/2025, ou se enquadra em outros critérios da Receita Federal, como ganho de capital na venda de bens.",
  },
  {
    q: "Qual a diferença entre a tabela mensal e a anual do IRPF 2026?",
    a: "A tabela mensal é usada para retenção na fonte (IRRF) pelo empregador todo mês. A tabela anual é usada para calcular o imposto devido na declaração anual. O resultado é o imposto total do ano sobre o qual incide a alíquota progressiva.",
  },
  {
    q: "O que é a dedução por dependente no IRPF 2026?",
    a: "Cada dependente (filho, cônjuge, pais, etc.) permite deduzir R$ 2.275,08 da base de cálculo anual. Quanto mais dependentes, menor a base de cálculo e menor o imposto a pagar.",
  },
  {
    q: "Qual é o prazo de entrega do IRPF 2026?",
    a: "O prazo de entrega da declaração IRPF 2026 (ano-base 2025) é de 23 de março a 29 de maio de 2026. A multa mínima por atraso é de R$ 165,74, ou 1% ao mês sobre o imposto devido, limitada a 20%.",
  },
  {
    q: "Como funciona o desconto simplificado em 2026?",
    a: "O desconto simplificado permite abater 20% dos rendimentos tributáveis da base de cálculo, sem necessidade de comprovantes, com limite de R$ 16.754,34. É vantajoso para quem tem poucas deduções.",
  },
  {
    q: "Quando sai a restituição do IRPF 2026?",
    a: "A restituição é paga em 5 lotes. O 1º lote sai em junho/2026, com prioridade para idosos, professores e portadores de doenças graves. O 5º e último lote sai em 30 de setembro de 2026.",
  },
];

const WA_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Vi a tabela IRPF 2026 no site e quero ajuda com minha declaração.")}`;

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularImposto(renda: number, dependentes: number) {
  const deducaoDep = dependentes * 2275.08;
  const base = Math.max(0, renda - deducaoDep);
  const faixa = TABELA_MENSAL.find((f) => base >= f.min && base <= f.max);
  if (!faixa || faixa.rate === 0) return { bruto: 0, aliquotaEfetiva: 0, base };
  const bruto = Math.max(0, base * faixa.rate - faixa.ded);
  return { bruto, aliquotaEfetiva: base > 0 ? (bruto / base) * 100 : 0, base };
}

export default function TabelaIRPFClient() {
  const [renda, setRenda] = useState("");
  const [dependentes, setDependentes] = useState(0);

  const rendaNum = parseFloat(renda.replace(/\./g, "").replace(",", ".")) || 0;
  const resultado = rendaNum > 0 ? calcularImposto(rendaNum, dependentes) : null;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
        <Link href="/" className="hover:opacity-100 transition">Início</Link>
        <span className="mx-2">/</span>
        <span>Tabela IRPF 2026</span>
      </nav>

      {/* Hero */}
      <div className="mb-16">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Receita Federal · Lei 15.270/2025
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
          Tabela IRPF 2026
        </h1>
        <p className="text-lg opacity-70 max-w-2xl mb-4">
          Faixas de alíquotas e deduções oficiais para o exercício 2026 (ano-base 2025).
          Prazo de entrega: <strong>23/03 a 29/05/2026</strong>.
        </p>
        <p className="text-sm opacity-50">
          Fonte: Receita Federal / Lei 15.270/2025 e IN RFB 2.255/2025 — última verificação março/2026
        </p>
      </div>

      {/* Tabela mensal */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-2">Tabela Progressiva Mensal (IRRF)</h2>
        <p className="text-sm opacity-60 mb-6">Usada para retenção na fonte todo mês pelo empregador.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-preto text-branco">
                <th className="text-left px-4 py-3 font-bold uppercase tracking-widest text-xs">Faixa de Renda Mensal</th>
                <th className="text-center px-4 py-3 font-bold uppercase tracking-widest text-xs">Alíquota</th>
                <th className="text-right px-4 py-3 font-bold uppercase tracking-widest text-xs">Dedução</th>
              </tr>
            </thead>
            <tbody>
              {TABELA_MENSAL.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${
                    row.aliquota === "Isento"
                      ? "bg-ouro/10 font-semibold"
                      : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{row.faixa}</td>
                  <td className={`text-center px-4 py-3 font-mono font-bold ${row.aliquota === "Isento" ? "text-green-700" : ""}`}>
                    {row.aliquota}
                  </td>
                  <td className="text-right px-4 py-3 font-mono">{row.deducao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs opacity-40 mt-3">
          * Inclui isenção efetiva de R$ 5.000/mês via dedução complementar — consulte a Receita Federal para detalhes.
        </p>
      </section>

      {/* Tabela anual */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-2">Tabela Progressiva Anual (Declaração)</h2>
        <p className="text-sm opacity-60 mb-6">Usada no ajuste anual da declaração entregue em 2026.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-preto text-branco">
                <th className="text-left px-4 py-3 font-bold uppercase tracking-widest text-xs">Faixa de Renda Anual</th>
                <th className="text-center px-4 py-3 font-bold uppercase tracking-widest text-xs">Alíquota</th>
                <th className="text-right px-4 py-3 font-bold uppercase tracking-widest text-xs">Dedução</th>
              </tr>
            </thead>
            <tbody>
              {TABELA_ANUAL.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${
                    row.aliquota === "Isento"
                      ? "bg-ouro/10 font-semibold"
                      : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{row.faixa}</td>
                  <td className={`text-center px-4 py-3 font-mono font-bold ${row.aliquota === "Isento" ? "text-green-700" : ""}`}>
                    {row.aliquota}
                  </td>
                  <td className="text-right px-4 py-3 font-mono">{row.deducao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deduções */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-2">Principais Deduções Permitidas (2026)</h2>
        <p className="text-sm opacity-60 mb-6">Reduzem a base de cálculo do IRPF.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-preto text-branco">
                <th className="text-left px-4 py-3 font-bold uppercase tracking-widest text-xs">Item de Dedução</th>
                <th className="text-right px-4 py-3 font-bold uppercase tracking-widest text-xs">Valor / Limite</th>
              </tr>
            </thead>
            <tbody>
              {DEDUCOES.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-4 py-3">{row.item}</td>
                  <td className="text-right px-4 py-3 font-mono">{row.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Calculadora inline */}
      <section className="mb-16">
        <div className="border border-gray-200 p-8 md:p-12">
          <h2 className="font-serif text-3xl mb-2">Simulador Rápido de IRPF Mensal</h2>
          <p className="text-sm opacity-60 mb-8">
            Estimativa simplificada com base na tabela progressiva. Para cálculo completo,{" "}
            <Link href="/ferramentas/calculadora-ir" className="underline hover:opacity-60 transition">
              use nossa calculadora completa
            </Link>
            .
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 opacity-60">
                Renda bruta mensal (R$)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={renda}
                onChange={(e) => setRenda(e.target.value.replace(/[^0-9.,]/g, ""))}
                placeholder="Ex: 5.000,00"
                className="w-full border border-gray-300 px-4 py-3 text-lg font-mono focus:outline-none focus:border-preto"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 opacity-60">
                Número de dependentes
              </label>
              <select
                value={dependentes}
                onChange={(e) => setDependentes(Number(e.target.value))}
                className="w-full border border-gray-300 px-4 py-3 text-lg bg-white focus:outline-none focus:border-preto"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} dependente{n !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {resultado ? (
            <div className="bg-preto text-branco p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Base de Cálculo</p>
                  <p className="font-mono text-2xl text-ouro">{fmt(resultado.base)}</p>
                  <p className="text-xs opacity-40 mt-1">após dedução dep.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-1">IRPF Estim. Mensal</p>
                  <p className="font-mono text-2xl text-ouro">{fmt(resultado.bruto)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Alíquota Efetiva</p>
                  <p className="font-mono text-2xl text-ouro">{resultado.aliquotaEfetiva.toFixed(2)}%</p>
                </div>
              </div>
              <p className="text-xs opacity-40">
                * Simulação simplificada. Não considera INSS, previdência privada, saúde, educação e outras deduções.
                Para resultado preciso, consulte um especialista.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 p-8 text-center opacity-50">
              <p className="text-sm">Digite sua renda acima para ver a simulação</p>
            </div>
          )}
        </div>
      </section>

      {/* Prazos e multas */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-6">Prazos e Multas IRPF 2026</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Início das declarações", value: "23/03/2026" },
            { label: "Prazo final", value: "29/05/2026" },
            { label: "Multa mínima por atraso", value: "R$ 165,74" },
            { label: "Multa máxima", value: "20% do imposto" },
            { label: "1º lote de restituição", value: "junho/2026" },
            { label: "5º lote (último)", value: "30/09/2026" },
          ].map((item) => (
            <div key={item.label} className="border border-gray-200 p-6">
              <p className="text-xs uppercase tracking-widest opacity-50 mb-2">{item.label}</p>
              <p className="font-serif text-2xl">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs opacity-40 mt-4">Fonte: Receita Federal / DOU 16/03/2026</p>
      </section>

      {/* CTA */}
      <section className="mb-16">
        <div className="bg-preto text-branco p-10 md:p-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-ouro">
            Precisa de ajuda com sua declaração?
          </h2>
          <p className="text-lg opacity-70 mb-2">
            Nilson Brites – Analista Financeiro com 10+ anos de experiência.
          </p>
          <p className="opacity-60 mb-8">
            Declarações novas, atrasadas e retificações. Atendimento 100% online para todo o Brasil.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-ouro text-preto px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-ouro/90 transition"
          >
            Falar com Nilson no WhatsApp
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-8">Dúvidas Frequentes sobre a Tabela IRPF 2026</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="border-b border-gray-100 pb-4">
              <summary className="font-serif text-lg cursor-pointer py-3 hover:italic transition-all">
                {faq.q}
              </summary>
              <p className="text-sm opacity-70 leading-relaxed mt-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Links internos */}
      <section>
        <h2 className="font-serif text-2xl mb-6 opacity-60">Ferramentas Relacionadas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/ferramentas/calculadora-ir"
            className="border border-gray-200 p-6 hover:border-preto transition group"
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Ferramenta</p>
            <h3 className="font-serif text-lg group-hover:italic transition-all">Calculadora de IR Completa</h3>
            <p className="text-sm opacity-50 mt-1">Com todas as deduções</p>
          </Link>
          <Link
            href="/ferramentas/simulador-multa"
            className="border border-gray-200 p-6 hover:border-preto transition group"
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Ferramenta</p>
            <h3 className="font-serif text-lg group-hover:italic transition-all">Simulador de Multa por Atraso</h3>
            <p className="text-sm opacity-50 mt-1">Calcule sua multa</p>
          </Link>
          <Link
            href="/declarar-agora"
            className="border border-gray-200 p-6 hover:border-preto transition group"
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Consultoria</p>
            <h3 className="font-serif text-lg group-hover:italic transition-all">Declarar meu IRPF 2026</h3>
            <p className="text-sm opacity-50 mt-1">100% online · Todo o Brasil</p>
          </Link>
        </div>
      </section>
    </>
  );
}
