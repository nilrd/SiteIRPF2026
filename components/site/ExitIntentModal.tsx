"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  REFERRAL_LINK,
  UBER_BONUS_TABLE,
  getAllMotoristaPostSlugs,
} from "@/lib/motorista-content-map";
import { formatBrWhatsApp, isValidBrWhatsApp, normalizeBrPhone } from "@/lib/phone-validation";

const DEADLINE = new Date("2026-05-29T23:59:59");
/** Cooldown de 48 horas entre exibições */
const COOLDOWN_MS = 48 * 60 * 60 * 1000;
const MOTORISTA_PATHS = new Set(
  getAllMotoristaPostSlugs().map((slug) => `/blog/${slug}`),
);

type ModalMode = "default" | "motorista";

function getDaysLeft() {
  const diff = DEADLINE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function canShow(storageKey: string): boolean {
  try {
    const last = localStorage.getItem(storageKey);
    if (!last) return true;
    return Date.now() - parseInt(last, 10) > COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markShown(storageKey: string) {
  try {
    localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    /* sem acesso ao localStorage */
  }
}

function getStorageKey(mode: ModalMode) {
  return mode === "motorista" ? "exit_shown_at_motorista" : "exit_shown_at";
}

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const pathname = usePathname();
  const triggeredRef = useRef(false);
  const daysLeft = getDaysLeft();
  const modalMode: ModalMode = pathname && MOTORISTA_PATHS.has(pathname)
    ? "motorista"
    : "default";
  const isMotoristaPage = modalMode === "motorista";

  useEffect(() => {
    // Reinicia a cada mudança de página
    triggeredRef.current = false;
    setVisible(false);
    setSent(false);

    const storageKey = getStorageKey(modalMode);

    if (!canShow(storageKey)) return;

    function trigger() {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      markShown(storageKey);
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
      document.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }, 8000);

    return () => {
      clearTimeout(readyTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [modalMode, pathname]); // re-executa a cada navegação

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !telefone.trim()) return;

    const validation = isValidBrWhatsApp(telefone);
    if (!validation.valid) {
      setTelefoneError(validation.reason || "WhatsApp inválido.");
      return;
    }

    setTelefoneError("");
    const telefoneNormalizado = validation.normalized;
    setLoading(true);
    try {
      await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone: telefoneNormalizado,
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
            <p className="text-white font-bold text-lg mb-2">
              Mensagem recebida!
            </p>
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
        ) : isMotoristaPage ? (
          <>
            <span className="block text-xs uppercase tracking-[0.3em] text-[#C6FF00] mb-4">
              Antes de sair
            </span>
            <h2
              id="exit-modal-title"
              className="font-serif text-3xl text-white mb-3"
            >
              Entre na Uber com bônus de indicação
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Se você pretende começar como motorista ou entregador, faça o
              cadastro pelo link de indicação para ativar sua elegibilidade ao
              bônus de boas-vindas.
            </p>

            <div className="border border-[#C6FF00]/30 bg-white/5 p-4 mb-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#C6FF00] mb-2">
                Oferta para novos cadastros
              </p>
              <p className="text-white font-semibold leading-snug">
                Ate R$ {UBER_BONUS_TABLE.geral.valor} pelas primeiras {UBER_BONUS_TABLE.geral.viagens} viagens em {UBER_BONUS_TABLE.geral.dias} dias.
              </p>
              <p className="text-white/55 text-xs mt-2 leading-relaxed">
                O valor final pode variar conforme a campanha ativa da sua
                categoria e da sua regiao, mas o cadastro precisa ser iniciado
                pelo link de indicacao.
              </p>
            </div>

            <a
              href={REFERRAL_LINK}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block w-full bg-[#C6FF00] text-[#0A0A0A] py-4 px-5 text-center uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#d4ff33] transition"
            >
              Quero me cadastrar com bonus →
            </a>

            <p className="mt-4 text-center text-xs text-white/35 leading-relaxed">
              Abra o link, conclua o cadastro por ele e so depois feche esta
              pagina para nao perder a indicacao.
            </p>
          </>
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
              Deixe suas informações e receba orientação gratuita. Sem
              compromisso.
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
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => {
                    const onlyDigits = normalizeBrPhone(e.target.value).slice(0, 11);
                    setTelefone(formatBrWhatsApp(onlyDigits));
                    setTelefoneError("");
                  }}
                  required
                  minLength={15}
                  maxLength={16}
                  pattern="\(\d{2}\)\s9\d{4}-\d{4}"
                  autoComplete="tel"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF00] transition"
                  placeholder="(11) 99999-9999"
                />
                {telefoneError && (
                  <p className="mt-1 text-[11px] text-red-400">{telefoneError}</p>
                )}
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
