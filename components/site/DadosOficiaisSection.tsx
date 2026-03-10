"use client";

import { motion } from "framer-motion";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`;

const tabelaIRPF = [
  { faixa: "Até R$ 2.428,80", aliquota: "Isento", deducao: "—" },
  { faixa: "R$ 2.428,81 a R$ 2.826,65", aliquota: "7,5%", deducao: "R$ 182,16" },
  { faixa: "R$ 2.826,66 a R$ 3.751,05", aliquota: "15%", deducao: "R$ 394,16" },
  { faixa: "R$ 3.751,06 a R$ 4.664,68", aliquota: "22,5%", deducao: "R$ 675,49" },
  { faixa: "Acima de R$ 4.664,68", aliquota: "27,5%", deducao: "R$ 908,73" },
];

const multas = [
  { label: "Multa mínima", value: "R$ 165,74" },
  { label: "Multa máxima", value: "20% do IR devido" },
  { label: "Cálculo mensal", value: "1% sobre IR devido" },
];

export default function DadosOficiaisSection() {
  return (
    <section className="bg-verde text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-4 block">
            Dados Oficiais — IRPF 2026 (renda de 2025)
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Tabela Progressiva do IR
          </h2>
          <p className="text-sm text-white/50 mb-12">
            Declarações do IRPF 2026 (renda de 2025) abrem em 16/03/2026. Prazo e limite de obrigatoriedade serão confirmados pela Receita Federal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Tabela IRPF */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-[10px] uppercase tracking-widest font-normal opacity-50">
                      Base de Cálculo Mensal
                    </th>
                    <th className="text-left py-3 text-[10px] uppercase tracking-widest font-normal opacity-50">
                      Alíquota
                    </th>
                    <th className="text-left py-3 text-[10px] uppercase tracking-widest font-normal opacity-50">
                      Dedução
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tabelaIRPF.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="py-4">{row.faixa}</td>
                      <td className="py-4 font-serif text-lg">{row.aliquota}</td>
                      <td className="py-4">{row.deducao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] uppercase tracking-widest opacity-30 mt-4">
              Receita Federal — IRPF 2026 (renda de 2025)
            </p>
            <p className="text-[10px] opacity-30 mt-2 leading-relaxed">
              Para rendas recebidas em 2026 (a declarar em 2027), nova isenção até R$ 5.000/mês pela Lei 15.270/2025.
            </p>
          </motion.div>

          {/* Card multas + CTA */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div>
              <h3 className="font-serif text-2xl mb-6">
                Multas por Atraso
              </h3>
              <div className="space-y-4">
                {multas.map((m) => (
                  <div
                    key={m.label}
                    className="flex justify-between items-baseline border-b border-white/10 pb-3"
                  >
                    <span className="text-sm opacity-70">{m.label}</span>
                    <span className="font-serif text-lg">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6">
              <p className="text-sm opacity-70 mb-4">
                Não deixe as multas acumularem. Regularize seu IRPF com
                segurança e agilidade.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-ouro text-preto py-4 uppercase text-xs tracking-widest font-bold hover:bg-ouro/90 transition"
              >
                Regularizar Agora
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
