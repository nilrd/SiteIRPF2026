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
    <section id="contato" className="bg-[#0A0A0A] text-white py-20 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Contato</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Fale com um Especialista
          </h2>
          <p className="text-white/60 text-lg max-w-xl">
            Prazo IRPF 2026 se encerra em <strong className="text-white">29 de maio</strong>. Resposta em até 1 hora — sem compromisso.
          </p>
        </motion.div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-[#C6FF00] text-4xl mb-4">✓</div>
            <p className="font-serif text-2xl mb-4">
              Mensagem enviada!
            </p>
            <p className="text-white/60">
              Nilson vai entrar em contato em até 1 hora pelo WhatsApp ou e-mail.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                required
                className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/25"
                placeholder="Seu nome"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/25"
                placeholder="seu@email.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="telefone"
                className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/25"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Tipo de Serviço
              </label>
              <select
                name="servico"
                className="bg-[#0A0A0A] border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white [&>option]:text-black [&>option]:bg-white"
              >
                <option value="declaracao-nova">Declaração Nova</option>
                <option value="irpf-atrasado">IRPF Atrasado</option>
                <option value="retificacao">Retificação</option>
                <option value="malha-fina">Malha Fina</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Sua dúvida ou situação
              </label>
              <textarea
                name="mensagem"
                className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition h-24 resize-none text-white placeholder:text-white/25"
                placeholder="Descreva brevemente sua situação fiscal..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="md:col-span-2 bg-[#C6FF00] text-[#0A0A0A] py-5 uppercase text-xs tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Quero Declarar Agora — Prazo: 29/05/2026"}
            </button>
            {status === "error" && (
              <p className="md:col-span-2 text-red-400 text-sm text-center">
                Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
