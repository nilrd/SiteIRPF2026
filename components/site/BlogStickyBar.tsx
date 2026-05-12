"use client";

import { useEffect, useRef, useState } from "react";

const WA_URL =
  "https://wa.me/5511940825120?text=Olá%2C%20li%20o%20artigo%20e%20tenho%20uma%20dúvida%20sobre%20minha%20declaração%20de%20IR";

export default function BlogStickyBar() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("sticky_bar_closed")) {
      setClosed(true);
      return;
    }

    function onScroll() {
      const scrolled = window.scrollY / document.body.scrollHeight;
      const nearFooter =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 200;
      setVisible(scrolled > 0.4 && !nearFooter);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (showForm) inputRef.current?.focus();
  }, [showForm]);

  function handleClose() {
    setClosed(true);
    sessionStorage.setItem("sticky_bar_closed", "1");
  }

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
          mensagem: "Pergunta via barra do blog",
          origem: "blog-sticky-bar",
        }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (closed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        {sent ? (
          <p className="text-[#C6FF00] text-sm font-bold flex-1">
            ✓ Recebemos sua pergunta — Nilson responderá em breve!
          </p>
        ) : showForm ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-wrap gap-2 items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
              className="flex-1 min-w-[120px] bg-transparent border border-white/20 px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C6FF00] transition"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="flex-1 min-w-[160px] bg-transparent border border-white/20 px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C6FF00] transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C6FF00] text-[#0A0A0A] px-5 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "..." : "Enviar →"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-white/40 hover:text-white text-xs transition"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <>
            <p className="flex-1 text-white text-sm">
              <span className="text-[#C6FF00] font-bold">Dúvida sobre sua declaração?</span>{" "}
              Fale com Nilson Brites — mais de 10 anos de experiência.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C6FF00] text-[#0A0A0A] px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition whitespace-nowrap"
            >
              WhatsApp →
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="border border-white/20 text-white px-4 py-2 text-xs uppercase tracking-widest hover:border-[#C6FF00] hover:text-[#C6FF00] transition whitespace-nowrap"
            >
              Enviar pergunta
            </button>
          </>
        )}

        <button
          onClick={handleClose}
          aria-label="Fechar barra"
          className="text-white/30 hover:text-white transition text-lg leading-none ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
