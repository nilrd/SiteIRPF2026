"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Envie seus documentos",
    desc: "Pelo WhatsApp ou formulario. Precisamos dos informes de rendimentos, comprovantes de deducoes e dados pessoais.",
  },
  {
    num: "02",
    title: "Analisamos tudo",
    desc: "Nosso consultor verifica todos os rendimentos, identifica as deducoes legais aplicaveis ao seu perfil e garante conformidade total com a Receita Federal.",
  },
  {
    num: "03",
    title: "Declaracao entregue",
    desc: "Voce recebe o comprovante de entrega e acompanhamento ate a liberacao da restituicao pela Receita Federal.",
  },
];

export default function ProcessoSection() {
  return (
    <section className="bg-preto text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-4 block">
            Como Funciona
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-10">
            Processo Simplificado
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Big translucent number */}
              <span className="font-serif text-[120px] leading-none font-bold text-white/[0.03] absolute -top-4 -left-2 select-none pointer-events-none">
                {step.num}
              </span>

              <div className="relative z-10">
                <span className="font-serif italic text-ouro text-lg mb-4 block">
                  {step.num}
                </span>
                <h3 className="font-serif text-2xl mb-4">{step.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
