"use client";

import { motion } from "framer-motion";

const items = [
  "IRPF 2025",
  "Declaracao Completa",
  "Deducoes Aplicadas",
  "IRPF Atrasado",
  "Retificacao",
  "100% Online",
  "Todo Brasil",
  "Malha Fina",
  "Consultoria Especializada",
  "Dependentes",
];

export default function MarqueeStrip() {
  return (
    <section className="bg-verde overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-white text-xs uppercase tracking-widest">
            {i % 2 === 0 ? (
              <span className="font-semibold">{item}</span>
            ) : (
              <span className="font-light opacity-80">{item}</span>
            )}
            <span className="ml-6 text-ouro">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
