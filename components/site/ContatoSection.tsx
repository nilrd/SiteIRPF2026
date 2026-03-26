"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContatoSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefone: (form.elements.namedItem("telefone") as HTMLInputElement).value,
      servico: (form.elements.namedItem("servico") as HTMLSelectElement).value,
      mensagem: (form.elements.namedItem("mensagem") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contato" className="bg-verde text-white py-14">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-8">
            Declare Antes de 29 de Maio
          </h2>
          <p className="opacity-80 mb-12 text-lg">
            Prazo IRPF 2026 se encerra em <strong>29 de maio</strong>. Preencha abaixo
            — retornamos em até 1 hora com orçamento gratuito e sem compromisso.
          </p>
        </motion.div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="font-serif text-2xl mb-4">
              Mensagem enviada com sucesso
            </p>
            <p className="opacity-70">
              Entraremos em contato em até 24 horas.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                required
                className="bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition text-white placeholder:text-white/30"
                placeholder="Seu nome"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition text-white placeholder:text-white/30"
                placeholder="seu@email.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="telefone"
                className="bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition text-white placeholder:text-white/30"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Tipo de Servico
              </label>
              <select
                name="servico"
                className="bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition text-white [&>option]:text-preto"
              >
                <option value="declaracao-nova">Declaração Nova</option>
                <option value="irpf-atrasado">IRPF Atrasado</option>
                <option value="retificacao">Retificação</option>
                <option value="malha-fina">Malha Fina</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
                Breve Resumo
              </label>
              <textarea
                name="mensagem"
                className="bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition h-24 resize-none text-white placeholder:text-white/30"
                placeholder="Descreva brevemente sua situacao fiscal..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="md:col-span-2 bg-white text-verde py-5 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Quero Declarar Agora — Prazo: 29/05/2026"}
            </button>
            {status === "error" && (
              <p className="md:col-span-2 text-red-300 text-sm text-center">
                Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
