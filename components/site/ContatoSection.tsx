"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const WA_CONTATO = "https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Preciso%20de%20ajuda%20com%20minha%20declara%C3%A7%C3%A3o%20de%20IRPF%202026.";

const diferenciais = [
  { num: "10+", label: "Anos de experiência" },
  { num: "100%", label: "Online · todo o Brasil" },
  { num: "1h", label: "Resposta garantida" },
];

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
    <section id="contato" className="bg-[#0A0A0A] text-white border-t border-white/10">
      {/* ─── Hero Split ─── */}
      <div className="grid lg:grid-cols-2 min-h-[560px]">
        {/* Foto lado esquerdo */}
        <motion.div
          className="relative min-h-[340px] lg:min-h-[560px] overflow-hidden"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/nilson-hero.jpg"
            alt="Nilson Brites — Consultor IRPF"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Overlay escuro bottom-up */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />

          {/* Badge de urgência */}
          <div className="absolute top-6 left-6 bg-[#C6FF00] text-[#0A0A0A] px-4 py-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Prazo: 29 de maio de 2026
            </span>
          </div>

          {/* Stats na base da foto */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex gap-8">
            {diferenciais.map(({ num, label }) => (
              <div key={label}>
                <span className="font-serif text-2xl md:text-3xl text-[#C6FF00] block">{num}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50 mt-0.5 block">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formulário lado direito */}
        <motion.div
          className="flex flex-col justify-center px-8 py-14 md:px-14 bg-[#0F0F0F]"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#C6FF00] mb-5">Contato</span>
          <h2 className="font-serif text-3xl md:text-4xl mb-3 leading-tight">
            Fale com um<br />Especialista
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-sm">
            Resposta em até 1 hora — sem compromisso. Atendimento 100% online para todo o Brasil.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 border border-[#C6FF00]/30 px-6"
            >
              <div className="text-[#C6FF00] text-5xl mb-4">✓</div>
              <p className="font-serif text-2xl mb-3">Mensagem enviada!</p>
              <p className="text-white/60 text-sm">
                Nilson vai entrar em contato em até 1 hora pelo WhatsApp ou e-mail.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-white/35 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    required
                    className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/20 text-sm"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-white/35 mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/20 text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-white/35 mb-2">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    name="telefone"
                    className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white placeholder:text-white/20 text-sm"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-white/35 mb-2">Tipo de Serviço</label>
                  <select
                    name="servico"
                    className="bg-[#0F0F0F] border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition text-white text-sm [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                  >
                    <option value="declaracao-nova">Declaração Nova</option>
                    <option value="irpf-atrasado">IRPF Atrasado</option>
                    <option value="retificacao">Retificação</option>
                    <option value="malha-fina">Malha Fina</option>
                    <option value="mei">MEI / Empresário</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-white/35 mb-2">Sua dúvida ou situação</label>
                <textarea
                  name="mensagem"
                  className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#C6FF00] transition h-20 resize-none text-white placeholder:text-white/20 text-sm"
                  placeholder="Descreva brevemente sua situação fiscal..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#C6FF00] text-[#0A0A0A] py-4 uppercase text-[11px] tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-50 mt-2"
              >
                {status === "loading" ? "Enviando..." : "Enviar Mensagem →"}
              </button>

              {status === "error" && (
                <p className="text-red-400 text-xs text-center mt-1">
                  Erro ao enviar. Tente pelo WhatsApp abaixo.
                </p>
              )}

              {/* Divisor */}
              <div className="flex items-center gap-4 mt-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[9px] uppercase tracking-widest text-white/30">ou</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* CTA WhatsApp */}
              <a
                href={WA_CONTATO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border border-white/20 py-4 text-[11px] uppercase tracking-widest font-bold hover:border-[#C6FF00] hover:text-[#C6FF00] transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar pelo WhatsApp agora
              </a>
            </form>
          )}
        </motion.div>
      </div>

      {/* ─── Barra de confiança ─── */}
      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
            {[
              "Declaração Nova",
              "IRPF Atrasado",
              "Retificação",
              "Malha Fina",
              "MEI / Empresário",
            ].map((item) => (
              <span key={item} className="text-[10px] uppercase tracking-widest text-white/35">{item}</span>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 shrink-0">
            nilson.brites@gmail.com
          </p>
        </div>
      </div>
    </section>
  );
}
