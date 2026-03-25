"use client";

import { useState } from "react";

export default function EbookForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/ebook", {
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

  if (status === "success") {
    return (
      <div className="bg-verde/10 border border-verde/20 p-6">
        <p className="font-serif text-xl mb-2">E-book enviado!</p>
        <p className="text-sm opacity-70">
          Verifique sua caixa de entrada (e o spam). Qualquer dúvida, fale conosco pelo WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
          Nome
        </label>
        <input
          type="text"
          name="nome"
          required
          minLength={2}
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm"
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
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm"
          placeholder="seu@email.com"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-preto text-white py-4 uppercase text-xs tracking-widest font-bold hover:bg-preto/80 transition disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Receber E-book Grátis"}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-sm text-center">
          Erro ao enviar. Tente novamente.
        </p>
      )}
    </form>
  );
}
