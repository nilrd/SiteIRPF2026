"use client";

/**
 * BlogCTA — CTA contextual para artigos do blog.
 * Variante "sidebar": sticky, ocupa aside do grid.
 * Variante "inline": banner horizontal embutido no meio do artigo.
 * Variante "footer": CTA de fechamento após o conteúdo.
 */

type BlogCTAVariant = "sidebar" | "inline" | "footer";
type BlogCTATopic = "irpf" | "mei" | "desenrola";

interface BlogCTAProps {
  variant?: BlogCTAVariant;
  topic?: BlogCTATopic;
}

const MESSAGES: Record<BlogCTATopic, { headline: string; sub: string; cta: string; waText: string }> = {
  irpf: {
    headline: "Precisa declarar seu IRPF?",
    sub: "Nilson Brites cuida da sua declaração — sem erros, sem multas, 100% online.",
    cta: "Falar com especialista",
    waText: "Olá! Li um artigo no blog e quero declarar meu IRPF 2026.",
  },
  mei: {
    headline: "Dúvidas sobre MEI?",
    sub: "Declaração DASN-SIMEI, dívidas DAS, cancelamento e muito mais — atendimento 100% online.",
    cta: "Resolver minha situação MEI",
    waText: "Olá! Li um artigo sobre MEI e preciso de ajuda.",
  },
  desenrola: {
    headline: "Já regularizou suas dívidas?",
    sub: "Depois do Desenrola, regularize também o CPF na Receita Federal. Nilson cuida disso.",
    cta: "Regularizar meu IRPF",
    waText: "Olá! Vi o artigo sobre Desenrola Brasil e quero regularizar meu IRPF.",
  },
};

function waLink(text: string) {
  return `https://wa.me/5511940825120?text=${encodeURIComponent(text)}`;
}

export default function BlogCTA({ variant = "inline", topic = "irpf" }: BlogCTAProps) {
  const msg = MESSAGES[topic];
  const href = waLink(msg.waText);

  if (variant === "sidebar") {
    return (
      <div className="bg-verde/5 border border-verde p-6">
        <p className="font-serif text-base mb-2">{msg.headline}</p>
        <p className="text-sm opacity-70 mb-5 leading-relaxed">{msg.sub}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-verde text-white py-3 uppercase text-[10px] tracking-widest font-bold hover:bg-verde/90 transition"
        >
          {msg.cta}
        </a>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-verde text-white p-8 my-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl mb-3">{msg.headline}</h3>
          <p className="opacity-80 mb-6 text-sm leading-relaxed">{msg.sub}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
          >
            {msg.cta} →
          </a>
        </div>
      </div>
    );
  }

  // footer
  return (
    <div className="border-t border-preto/10 pt-12 mt-12">
      <div className="bg-preto text-white p-10 text-center">
        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4">
          Próximo passo
        </p>
        <h3 className="font-serif text-3xl mb-4">{msg.headline}</h3>
        <p className="opacity-70 mb-8 max-w-lg mx-auto text-sm leading-relaxed">{msg.sub}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-ouro text-preto px-10 py-4 uppercase text-xs tracking-widest font-bold hover:bg-ouro-claro transition"
        >
          {msg.cta}
        </a>
      </div>
    </div>
  );
}
