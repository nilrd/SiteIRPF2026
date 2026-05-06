"use client";

import { useState } from "react";

type MeiNecessidade =
  | ""
  | "Declaração Anual MEI (DASN-SIMEI)"
  | "Abertura do MEI"
  | "Cancelamento / Baixa do MEI"
  | "Dívidas / Parcelamento DAS"
  | "MEI + Imposto de Renda (IRPF)";

interface MeiLeadFormProps {
  /** Identifica a página de origem do lead */
  origem?: string;
  /** Título personalizado acima do formulário */
  titulo?: string;
}

export default function MeiLeadForm({
  origem = "mei-hub",
  titulo = "Falar com Especialista em MEI",
}: MeiLeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [necessidade, setNecessidade] = useState<MeiNecessidade>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = {
      nome: (form.elements.namedItem("nome") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value.trim(),
      serviço: "MEI",
      mensagem: necessidade,
      origem,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        setNecessidade("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-verde/5 border border-verde p-8">
        <p className="font-serif text-2xl mb-2">Recebemos seu contato!</p>
        <p className="text-sm opacity-70 leading-relaxed">
          Nilson Brites vai entrar em contato pelo WhatsApp em breve. Atendimento 100% online para
          todo o Brasil.
        </p>
        <a
          href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson%2C%20preciso%20de%20ajuda%20com%20meu%20MEI!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-verde text-white px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-verde/80 transition"
        >
          📱 Falar no WhatsApp agora
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-serif text-xl mb-6">{titulo}</h3>

      {/* Nome */}
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
          Nome completo
        </label>
        <input
          type="text"
          name="nome"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm"
          placeholder="Seu nome"
        />
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
          WhatsApp
        </label>
        <input
          type="tel"
          name="whatsapp"
          required
          minLength={10}
          maxLength={15}
          autoComplete="tel"
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm"
          placeholder="(11) 9 0000-0000"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm"
          placeholder="seu@email.com"
        />
      </div>

      {/* Necessidade */}
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
          O que você precisa?
        </label>
        <select
          name="necessidade"
          required
          value={necessidade}
          onChange={(e) => setNecessidade(e.target.value as MeiNecessidade)}
          className="border border-preto/20 bg-transparent py-3 px-4 outline-none focus:border-verde transition text-sm appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="Declaração Anual MEI (DASN-SIMEI)">
            Declaração Anual MEI (DASN-SIMEI)
          </option>
          <option value="Abertura do MEI">Abertura do MEI</option>
          <option value="Cancelamento / Baixa do MEI">Cancelamento / Baixa do MEI</option>
          <option value="Dívidas / Parcelamento DAS">Dívidas / Parcelamento DAS</option>
          <option value="MEI + Imposto de Renda (IRPF)">MEI + Imposto de Renda (IRPF)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-preto text-white py-4 uppercase text-xs tracking-widest font-bold hover:bg-preto/80 transition disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Falar com Especialista"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-xs text-center">
          Erro ao enviar. Tente pelo{" "}
          <a
            href="https://wa.me/5511940825120"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          .
        </p>
      )}

      <p className="text-[10px] opacity-40 text-center">
        Seus dados são protegidos e nunca serão compartilhados.
      </p>
    </form>
  );
}
