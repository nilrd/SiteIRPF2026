"use client";

import { useState } from "react";
import Link from "next/link";

const WA_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent(
  "Olá! Fiz o checklist do site e preciso saber se devo declarar o IRPF 2026."
)}`;

const CRITERIOS = [
  {
    id: "rendimentos",
    label: "Recebi rendimentos tributáveis acima de R$ 35.584,00 em 2025",
    detalhe:
      "Inclui salário, pró-labore, aluguel, pensão alimentícia tributável, aposentadoria acima do limite de isenção, etc. Equivale a ~R$ 2.965/mês.",
    obriga: true,
  },
  {
    id: "exclusivo",
    label: "Recebi rendimentos APENAS sujeitos a tributação exclusiva/definitiva acima de R$ 200.000,00",
    detalhe:
      "13º salário, JCP (juros sobre capital próprio), prêmios de loteria, ganhos em Day Trade, etc.",
    obriga: true,
  },
  {
    id: "atividade_rural",
    label: "Tive receita bruta de atividade rural acima de R$ 177.920,00 em 2025",
    detalhe:
      "Inclui produtor rural, pescador artesanal, etc. Mesmo que a atividade gere prejuízo, a receita bruta pode obrigar à declaração.",
    obriga: true,
  },
  {
    id: "bens",
    label: "Possuía bens ou direitos acima de R$ 800.000,00 em 31/12/2025",
    detalhe:
      "Soma de todos os bens: imóveis, veículos, investimentos, saldo em conta, participações societárias, etc.",
    obriga: true,
  },
  {
    id: "ganho_capital",
    label: "Obtive ganho de capital na alienação de bens ou direitos em 2025",
    detalhe:
      "Venda de imóvel, carro, ações, participação em empresa etc. com lucro. Inclui operações com criptoativos.",
    obriga: true,
  },
  {
    id: "bolsa",
    label: "Realizei operações em Bolsa de Valores acima de R$ 40.000,00 em 2025",
    detalhe:
      "Total de vendas de ações (mercado à vista), fundos de investimento em bolsa, BDRs, ETFs, Day Trade etc.",
    obriga: true,
  },
  {
    id: "residente",
    label: "Passei à condição de residente no Brasil em 2025 e aqui permaneci até 31/12",
    detalhe:
      "Quem retornou ao Brasil vindo do exterior e ficou aqui por mais de 183 dias em qualquer período de 12 meses.",
    obriga: true,
  },
  {
    id: "isento_opcional",
    label: "Quero compensar prejuízo em bolsa ou atualizar bens pelo valor de mercado (opcional)",
    detalhe:
      "Mesmo sem obrigatoriedade, pode ser vantajoso declarar para compensar perdas em renda variável em anos futuros ou atualizar o custo de aquisição de bens.",
    obriga: false,
  },
];

const FAQS = [
  {
    q: "Qual o limite de rendimentos para declarar IRPF 2026?",
    a: "Quem recebeu rendimentos tributáveis acima de R$ 35.584,00 em 2025 é obrigado a declarar o IRPF 2026. Esse limite equivale a R$ 2.965,34 por mês.",
  },
  {
    q: "Quem recebeu somente salário precisa declarar o IR 2026?",
    a: "Sim, se o total de salários recebidos em 2025 (incluindo décimo terceiro e férias) ultrapassar R$ 35.584,00, a declaração é obrigatória, mesmo que o empregador já tenha retido na fonte.",
  },
  {
    q: "Preciso declarar se vendi meu apartamento em 2025?",
    a: "Sim. Qualquer alienação de bens sujeita ao ganho de capital, ou com valor acima de R$ 40.000,00, obriga à declaração, independente de ter havido lucro.",
  },
  {
    q: "Qual a multa por não declarar o IRPF 2026?",
    a: "A multa mínima é de R$ 165,74. Se houver imposto a pagar, a multa é de 1% ao mês sobre o valor do imposto devido, limitada a 20% do total. Prazo: 23/03 a 29/05/2026.",
  },
  {
    q: "Aposentado precisa declarar o IRPF 2026?",
    a: "Aposentados com rendimentos totais acima de R$ 35.584,00 em 2025 devem declarar. Portadores de doenças graves têm isenção sobre aposentadoria, mas outros rendimentos podem obrigar à declaração.",
  },
  {
    q: "Quem pode declarar em conjunto com o cônjuge?",
    a: "Cônjuges e companheiros podem declarar em conjunto, unindo todos os rendimentos e bens. Um é o declarante principal; o outro é incluído como dependente.",
  },
];

export default function QuemDeveClient() {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  function toggle(id: string) {
    setMarcados((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const obrigadosMarcados = CRITERIOS.filter((c) => c.obriga && marcados[c.id]);
  const deveDeclarar = obrigadosMarcados.length > 0;
  const optionalMarcado = marcados["isento_opcional"];
  const algumMarcado = Object.values(marcados).some(Boolean);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
        <Link href="/" className="hover:opacity-100 transition">Início</Link>
        <span className="mx-2">/</span>
        <span>Quem Deve Declarar IRPF 2026</span>
      </nav>

      {/* Hero */}
      <div className="mb-16">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Receita Federal · Ano-base 2025
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
          Quem Deve Declarar<br />o IRPF 2026?
        </h1>
        <p className="text-lg opacity-70 max-w-2xl mb-4">
          Marque os critérios que se aplicam a você. A resposta aparece instantaneamente — sem cadastro, sem espera.
        </p>
        <p className="text-sm opacity-50">
          Critérios: Receita Federal / Instrução Normativa RFB 2.255/2025 · Prazo: <strong>23/03 a 29/05/2026</strong>
        </p>
      </div>

      {/* Checklist interativo */}
      <section className="mb-12">
        <h2 className="font-serif text-3xl mb-2">8 Critérios Oficiais</h2>
        <p className="text-sm opacity-60 mb-8">
          Se <strong>qualquer um</strong> dos critérios obrigatórios (1–7) aplicar-se a você, a declaração é <strong>obrigatória</strong>.
        </p>

        <div className="space-y-3">
          {CRITERIOS.map((c, i) => {
            const isChecked = !!marcados[c.id];
            const isOptional = !c.obriga;
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`w-full text-left border-2 p-5 transition-all group ${
                  isChecked
                    ? isOptional
                      ? "border-ouro bg-ouro/10"
                      : "border-preto bg-preto text-branco"
                    : "border-gray-200 bg-white hover:border-preto"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox visual */}
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? isOptional
                          ? "border-ouro bg-ouro text-preto"
                          : "border-branco bg-branco text-preto"
                        : "border-gray-400 group-hover:border-preto"
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && (
                      <svg viewBox="0 0 12 10" className="w-3 h-3" fill="currentColor">
                        <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm md:text-base">
                        <span className={`font-mono text-xs mr-2 opacity-50 ${isChecked && !isOptional ? "text-branco" : ""}`}>
                          {isOptional ? "+" : `0${i + 1}`}
                        </span>
                        {c.label}
                      </span>
                      {isOptional && (
                        <span className="flex-shrink-0 text-[9px] uppercase tracking-widest border border-ouro text-ouro px-2 py-0.5">
                          Opcional
                        </span>
                      )}
                      {!isOptional && (
                        <span className={`flex-shrink-0 text-[9px] uppercase tracking-widest border px-2 py-0.5 ${isChecked ? "border-branco/40 text-branco/60" : "border-red-300 text-red-500"}`}>
                          Obrigatório
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isChecked && !isOptional ? "opacity-70" : "opacity-50"}`}>
                      {c.detalhe}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Resultado */}
      {algumMarcado && (
        <section className="mb-16">
          <div
            className={`border-2 p-8 ${
              deveDeclarar ? "border-preto bg-preto text-branco" : "border-ouro bg-ouro/10"
            }`}
          >
            {deveDeclarar ? (
              <>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-3">Resultado</p>
                <h3 className="font-serif text-3xl md:text-4xl mb-4">
                  Você <span className="underline decoration-2">deve declarar</span> o IRPF 2026
                </h3>
                <p className="opacity-80 mb-2">
                  {obrigadosMarcados.length === 1
                    ? "Você marcou 1 critério obrigatório."
                    : `Você marcou ${obrigadosMarcados.length} critérios obrigatórios.`}{" "}
                  Prazo: <strong>29 de maio de 2026</strong>. Multa mínima por atraso: <strong>R$ 165,74</strong>.
                </p>
                <p className="text-sm opacity-60">
                  Declare com tempo para evitar multa e garantir prioridade na restituição.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-3">Resultado</p>
                <h3 className="font-serif text-3xl md:text-4xl mb-4 text-preto">
                  {optionalMarcado
                    ? "Declaração opcional — pode ser vantajoso"
                    : "Você pode estar isento da declaração"}
                </h3>
                <p className="opacity-80 text-preto">
                  {optionalMarcado
                    ? "Apesar de não obrigatório, declarar pode permitir compensar prejuízos em bolsa ou atualizar o custo de aquisição de bens no futuro."
                    : "Aparentemente nenhum critério de obrigatoriedade aplica-se a você. Consulte um especialista para confirmar — situações específicas podem mudar essa análise."}
                </p>
              </>
            )}

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-6 px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all ${
                deveDeclarar
                  ? "bg-ouro text-preto hover:bg-ouro/90"
                  : "bg-preto text-branco hover:bg-gray-800"
              }`}
            >
              Falar com especialista agora →
            </a>
          </div>
        </section>
      )}

      {/* Linha do tempo / prazos */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-8">Prazos IRPF 2026</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { data: "23 Mar 2026", evento: "Início do prazo de entrega", sub: "Programa da Receita Federal disponível" },
            { data: "29 Mai 2026", evento: "Último dia para entregar", sub: "Após isso, multa mínima de R$ 165,74" },
            { data: "30 Set 2026", evento: "5º lote de restituição", sub: "Quem entrega antes recebe antes" },
          ].map((p) => (
            <div key={p.data} className="border-2 border-preto p-6">
              <p className="font-mono text-sm text-ouro mb-2">{p.data}</p>
              <p className="font-bold mb-1">{p.evento}</p>
              <p className="text-xs opacity-60">{p.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl mb-8">Perguntas Frequentes</h2>
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-5 flex items-start justify-between gap-4 hover:opacity-70 transition-opacity"
                onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                aria-expanded={faqAberto === i}
              >
                <span className="font-semibold">{faq.q}</span>
                <span className="text-2xl leading-none flex-shrink-0 mt-0.5 font-light">
                  {faqAberto === i ? "−" : "+"}
                </span>
              </button>
              {faqAberto === i && (
                <p className="pb-5 text-sm leading-relaxed opacity-70 max-w-3xl">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA principal */}
      <section className="mb-16">
        <div className="bg-preto text-branco p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-3">Declare com segurança</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-3">
              Nilson Brites cuida<br />da sua declaração
            </h2>
            <p className="opacity-60 max-w-md">
              10+ anos de experiência · 100% online · Todo o Brasil · Imposto de Renda simples ou complexo
            </p>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-ouro text-preto px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-ouro/90 transition-all"
          >
            Declarar meu IRPF →
          </a>
        </div>
      </section>

      {/* Links internos */}
      <section>
        <p className="text-xs uppercase tracking-widest opacity-40 mb-6">Veja também</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/tabela-irpf-2026"
            className="group border-2 border-gray-200 hover:border-preto p-6 transition-all"
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Referência</p>
            <h3 className="font-serif text-lg group-hover:italic transition-all">
              Tabela IRPF 2026 completa
            </h3>
            <p className="text-sm opacity-50 mt-1">Faixas, alíquotas e deduções</p>
          </Link>
          <Link
            href="/blog"
            className="group border-2 border-gray-200 hover:border-preto p-6 transition-all"
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Artigos</p>
            <h3 className="font-serif text-lg group-hover:italic transition-all">
              Blog IRPF — dicas e novidades
            </h3>
            <p className="text-sm opacity-50 mt-1">Tudo sobre o Imposto de Renda 2026</p>
          </Link>
        </div>
      </section>
    </>
  );
}
