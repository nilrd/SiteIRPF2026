"use client";

import { motion } from "framer-motion";

export default function RestituicaoCard() {
  return (
    <section className="bg-ouro py-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-widest text-preto/50 mb-2 block">
              Portal Oficial — Receita Federal
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-preto mb-3">
              Consulte sua Restituição
            </h2>
            <p className="text-preto/70 text-sm leading-relaxed max-w-xl">
              Verifique em qual lote você receberá a restituição do IRPF
              diretamente no portal oficial da Receita Federal. Consulta
              gratuita, disponível 24 horas.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href="https://www.restituicao.receita.fazenda.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-preto text-white px-8 py-4 uppercase text-xs tracking-widest font-bold hover:bg-preto/80 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Consultar no Site da Receita
            </a>
            <p className="text-[10px] text-preto/40 mt-2 text-right">
              Você será redirecionado para restituicao.receita.fazenda.gov.br
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
