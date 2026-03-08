"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SplitSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Photo side */}
        <motion.div
          className="relative aspect-[4/5] md:aspect-auto"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full h-full min-h-[400px] bg-gray-200 overflow-hidden">
            <Image
              src="/nilson-profile.jpg"
              alt="Consultor IRPF NSB"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Badge */}
            <div className="absolute bottom-6 left-6 bg-preto text-white px-5 py-3">
              <span className="font-serif text-3xl font-bold">10+</span>
              <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">
                Anos de experiencia
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content side */}
        <motion.div
          className="bg-preto text-white p-10 md:p-16 flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-ouro mb-6 block">
            Sobre a Consultoria
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Consultoria que entende a complexidade do seu patrimonio
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            A Consultoria IRPF NSB nasceu da conviccao de que a declaracao de
            Imposto de Renda nao precisa ser uma dor de cabeca. Com mais de 10
            anos de experiencia em analise financeira e tributacao de pessoa
            fisica, oferecemos um servico 100% online para todo o Brasil.
          </p>
          <p className="text-white/70 leading-relaxed mb-8">
            Nossa abordagem combina precisao tecnica com atendimento
            personalizado. Em cada declaracao, verificamos todas as deducoes
            a que o cliente tem direito conforme a legislacao vigente —
            sem deixar nada passar.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-auto">
            <div>
              <span className="font-serif text-2xl text-ouro">100%</span>
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mt-1">
                Online
              </span>
            </div>
            <div>
              <span className="font-serif text-2xl text-ouro">Brasil</span>
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mt-1">
                Inteiro
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
