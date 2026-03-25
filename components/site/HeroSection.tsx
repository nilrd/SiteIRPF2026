"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

const dataItems = [
  { label: "Experiência", value: "10+ anos" },
  { label: "Atendimento", value: "Todo Brasil" },
  { label: "Formato", value: "100% Online" },
  { label: "IRPF 2026", value: "16/03 Abertura" },
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[92dvh] md:min-h-[90vh] flex flex-col justify-end overflow-hidden">
      {/* Imagem de fundo */}
      <Image
        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80"
        alt="Documentos e calculadora para declaração de Imposto de Renda Pessoa Física"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Vinheta escura — esmaecimento gradual do preto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Conteudo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-14 w-full">
        {/* Meta bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="block text-sm uppercase tracking-[0.3em] mb-6 text-white/60">
            Consultoria Especializada em IRPF
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid md:grid-cols-12 gap-8 items-end mb-12">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-normal text-white">
              Declaramos seu{" "}
              <span className="italic text-[#C9A84C]">Imposto de Renda</span>{" "}
              com precisão e responsabilidade.
            </h1>
          </motion.div>

          <motion.div
            className="md:col-span-5 pb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-base leading-relaxed text-white/75 mb-6 border-l-2 border-[#C9A84C] pl-6">
              Declarações novas, atrasadas e retificações para todo o Brasil,
              100% online. Garantimos que nenhuma dedução legal seja perdida.
            </p>
            <a
              href={WA_LINK}
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
          className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {dataItems.map((item) => (
            <div key={item.label}>
              <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">
                {item.label}
              </span>
              <span className="font-serif text-lg text-white">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
