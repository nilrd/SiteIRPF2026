"use client";

import { motion } from "framer-motion";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

const dataItems = [
  { label: "Experiencia", value: "10+ anos" },
  { label: "Atendimento", value: "Todo Brasil" },
  { label: "Formato", value: "100% Online" },
  { label: "IRPF 2026", value: "16/03 Abertura" },
];

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-10">
      {/* Meta bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Consultoria Especializada em IRPF
        </span>
      </motion.div>

      {/* Main grid */}
      <div className="grid md:grid-cols-12 gap-8 items-end mb-10">
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-normal">
            Declaramos seu{" "}
            <span className="italic">Imposto de Renda</span>{" "}
            com precisao e responsabilidade.
          </h1>
        </motion.div>

        <motion.div
          className="md:col-span-5 pb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className="text-base leading-relaxed opacity-80 mb-6 border-l-2 border-preto pl-6">
            Declaracoes novas, atrasadas e retificacoes para todo o Brasil,
            100% online. Garantimos que nenhuma deducao legal seja perdida.
          </p>
          <a
            href="https://wa.me/5511940825120?text=Ol%C3%A1%21+Quero+declarar+meu+IRPF."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium px-8 py-4 inline-block uppercase text-xs tracking-widest font-bold"
          >
            Declarar Agora
          </a>
        </motion.div>
      </div>

      {/* Data bar */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 editorial-border pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {dataItems.map((item) => (
          <div key={item.label}>
            <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-1">
              {item.label}
            </span>
            <span className="font-serif text-lg">{item.value}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
