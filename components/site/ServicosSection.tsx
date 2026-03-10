"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

const servicos = [
  {
    num: "01",
    title: "Declaração Completa",
    desc: "Organizamos e entregamos sua declaração com todos os rendimentos, bens e deduções legais aplicáveis — sem erros, sem pendências.",
    tag: "Mais popular",
  },
  {
    num: "02",
    title: "IRPF Atrasado",
    desc: "Regularizamos declarações de anos anteriores com cálculo preciso das multas e orientação completa para quitar sua situação com a Receita.",
    tag: "Urgente",
  },
  {
    num: "03",
    title: "Retificação",
    desc: "Corrigimos declarações já entregues com erros, omissões ou inconsistências antes que virem problema na Receita Federal.",
    tag: "Correcao",
  },
  {
    num: "04",
    title: "Malha Fina",
    desc: "Resolvemos notificações e pendências com a Receita Federal, identificando a causa e regularizando sua situação fiscal.",
    tag: "Especialidade",
  },
];

export default function ServicosSection() {
  return (
    <section id="servicos" className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex justify-between items-end mb-10">
        <h2 className="font-serif text-4xl md:text-5xl">Serviços</h2>
        <span className="text-[10px] uppercase tracking-widest opacity-40">
          Especialidades
        </span>
      </div>

      <div className="space-y-0">
        {servicos.map((s, i) => (
          <motion.a
            key={s.num}
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-6 editorial-border cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {/* Number */}
            <span className="font-serif italic text-3xl opacity-30 md:w-16 shrink-0">
              {s.num}
            </span>

            {/* Title */}
            <h3 className="font-serif text-2xl md:text-3xl md:w-72 shrink-0 group-hover:italic transition-all">
              {s.title}
            </h3>

            {/* Description */}
            <p className="text-sm opacity-60 leading-relaxed flex-1">
              {s.desc}
            </p>

            {/* Tag + Arrow */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[10px] uppercase tracking-widest bg-ouro/10 text-ouro px-3 py-1">
                {s.tag}
              </span>
              <ArrowUpRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
