"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DEADLINE = new Date("2026-05-29T23:59:59");
/** Cooldown de 48 horas entre exibições */
const COOLDOWN_MS = 48 * 60 * 60 * 1000;

function getDaysLeft() {
  const diff = DEADLINE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function canShow(): boolean {
  try {
    const last = localStorage.getItem("exit_shown_at");
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markShown() {
  try {
    localStorage.setItem("exit_shown_at", String(Date.now()));
  } catch { /* sem acesso ao localStorage */ }
}

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const pathname = usePathname();
  const triggeredRef = useRef(false);
  const daysLeft = getDaysLeft();

  useEffect(() => {
    // Reinicia a cada mudança de página
    triggeredRef.current = false;

    if (!canShow()) return;

    function trigger() {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      markShown();
      setVisible(true);
    }

    // Desktop: cursor sai pelo topo do viewport
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 50) trigger();
    }

    // Mobile: scroll rápido para cima (dedo desce = clientY aumenta)
    let lastY = 0;
    function handleTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY;
      if (y - lastY > 60) trigger(); // dedo desceu = scroll para cima
      lastY = y;
    }

    // Aguarda 8s para que o usuário leia antes de monitorar
    const readyTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
    }, 8000);

    return () => {
      clearTimeout(readyTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pathname]); // re-executa a cada navegação

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          servico: "Declaracao IRPF",
          mensagem: "Contato via modal de saída",
          origem: "exit-intent",
        }),
      });
      setSent(true);
    } catch {
      setSent(true); // fecha mesmo em erro de rede
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8">
        {/* Fechar */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-white/40 hover:text-white transition text-xl leading-none"
        >
          ✕
        </button>

        {sent ? (
          <div className="text-center py-4">
            <span className="block text-[#C6FF00] text-4xl mb-4">✓</span>
            <p className="text-white font-bold text-lg mb-2">Mensagem recebida!</p>
            <p className="text-white/60 text-sm">
              Nilson Brites entrará em contato em breve.
            </p>
            <button
              onClick={() => setVisible(false)}
              className="mt-6 text-xs uppercase tracking-widest text-white/40 hover:text-white transition"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <span className="block text-xs uppercase tracking-[0.3em] text-[#C6FF00] mb-4">
              Antes de sair
            </span>
            <h2
              id="exit-modal-title"
              className="font-serif text-3xl text-white mb-2"
            >
              {daysLeft > 0
                ? `Faltam ${daysLeft} dias para o prazo`
                : "Prazo encerrado — regularize agora"}
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Deixe suas informações e receba orientação gratuita. Sem compromisso.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF00] transition"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF00] transition"
                  placeholder="seu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C6FF00] text-[#0A0A0A] py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#d4ff33] transition disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Quero orientação gratuita →"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-white/30">
              Ou fale agora pelo{" "}
              <a
                href="https://wa.me/5511940825120?text=Olá%2C%20vim%20pelo%20site%20e%20preciso%20de%20ajuda%20com%20minha%20declaração%20de%20IR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C6FF00] hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
