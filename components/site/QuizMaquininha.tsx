"use client";

/**
 * QuizMaquininha.tsx
 * Quiz interativo de 2 perguntas para recomendar automaticamente
 * Point Pro 3, Point Smart 2 ou App Mercado Pago ao MEI.
 * Sem cadastro, sem WhatsApp, sem atendimento humano.
 */

import { useState } from "react";

type Rec = "app" | "smart" | "pro";
type Phase = "q1" | "q2" | "result";

const RESULTS: Record<Rec, { name: string; desc: string; why: string; href: string; cta: string }> = {
  app: {
    name: "App Mercado Pago",
    desc: "Receba por Pix, link de pagamento e aproximação (NFC) pelo celular — sem precisar de maquininha física. Sem investimento inicial.",
    why: "Ideal para quem está começando, tem poucos clientes por dia ou quer testar antes de comprar equipamento.",
    href: "https://mpago.li/18rGCG2",
    cta: "Começar pelo App Mercado Pago",
  },
  smart: {
    name: "Point Smart 2",
    desc: "Maquininha com tela touchscreen, relatórios integrados, NFC e aceita todas as bandeiras, débito, crédito e Pix.",
    why: "Perfeita para prestadores de serviço, salões, consultores e quem precisa de relatórios de vendas sem complicação.",
    href: "https://mpago.li/1UXbbb9",
    cta: "Ver condições da Point Smart 2",
  },
  pro: {
    name: "Point Pro 3",
    desc: "Maquininha robusta com bateria para o dia todo, Wi-Fi e 4G. Aceita todas as formas de pagamento, inclusive voucher.",
    why: "Para quem atende muito, tem ponto fixo, faz delivery, trabalha em feiras ou não pode deixar a bateria acabar no meio do expediente.",
    href: "https://mpago.li/31QNkWU",
    cta: "Ver condições da Point Pro 3",
  },
};

const BTN =
  "flex-1 border-2 border-[#0A0A0A] py-4 px-5 text-sm font-bold text-left hover:bg-[#0A0A0A] hover:text-[#C6FF00] transition-colors";

export default function QuizMaquininha() {
  const [phase, setPhase] = useState<Phase>("q1");
  const [rec, setRec] = useState<Rec | null>(null);

  function recommend(r: Rec) {
    setRec(r);
    setPhase("result");
  }

  function restart() {
    setPhase("q1");
    setRec(null);
  }

  const result = rec ? RESULTS[rec] : null;

  return (
    <section className="border-2 border-[#0A0A0A] p-8 my-10">
      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Escolha rápida</p>
      <h2 className="font-serif text-2xl mb-1">Qual solução Mercado Pago combina com seu MEI?</h2>
      <p className="text-sm opacity-60 mb-6">2 perguntas. Resultado automático. Sem cadastro, sem WhatsApp.</p>

      {phase === "q1" && (
        <div>
          <p className="font-semibold mb-4">O que você prefere para começar a receber no cartão?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => recommend("app")} className={BTN}>
              Quero começar pelo app, sem comprar equipamento
            </button>
            <button onClick={() => setPhase("q2")} className={BTN}>
              Quero uma maquininha física
            </button>
          </div>
        </div>
      )}

      {phase === "q2" && (
        <div>
          <p className="font-semibold mb-4">Como você descreveria o uso da maquininha?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => recommend("smart")} className={BTN}>
              Começo agora / uso simples / quero tela e praticidade
            </button>
            <button onClick={() => recommend("pro")} className={BTN}>
              Atendo muito / balcão / delivery / feira / não posso parar
            </button>
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <div>
          <div className="inline-block bg-[#C6FF00] text-[#0A0A0A] text-xs font-bold px-3 py-1 mb-4 uppercase tracking-widest">
            Recomendação para você
          </div>
          <h3 className="font-serif text-2xl mb-2">{result.name}</h3>
          <p className="text-sm opacity-70 mb-4">{result.desc}</p>
          <div className="bg-[#0A0A0A]/5 border-l-4 border-[#C6FF00] p-4 mb-6 text-sm leading-relaxed">
            {result.why}
          </div>
          <a
            href={result.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="inline-block bg-[#C6FF00] text-[#0A0A0A] font-bold py-3 px-8 text-sm hover:opacity-90 transition-opacity"
          >
            {result.cta}
          </a>
          <button onClick={restart} className="ml-6 text-sm opacity-50 hover:opacity-100 underline">
            Refazer
          </button>
          <p className="text-[11px] opacity-40 mt-5">
            * Link de indicação. Confira taxas, modelos e condições vigentes diretamente no Mercado Pago antes de contratar.
          </p>
        </div>
      )}
    </section>
  );
}
