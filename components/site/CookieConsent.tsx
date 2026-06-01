"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "irpf_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage not available (SSR safety)
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem(COOKIE_KEY, "declined");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de uso de cookies"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] text-white border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
          Usamos cookies para melhorar sua experiência e exibir anúncios
          personalizados (Google AdSense). Ao continuar navegando, você concorda
          com nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="text-[#C6FF00] underline hover:text-white transition"
          >
            Política de Privacidade
          </Link>{" "}
          e{" "}
          <Link
            href="/termos-de-uso"
            className="text-[#C6FF00] underline hover:text-white transition"
          >
            Termos de Uso
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-[#C6FF00] text-black px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-white transition"
          >
            Aceitar
          </button>
          <button
            onClick={decline}
            className="border border-white/30 text-white/70 px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition"
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
