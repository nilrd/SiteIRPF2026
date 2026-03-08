"use client";

import { useState, useRef, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatIAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao processar mensagem." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-2xl">Chat IA Admin (GPT-4o)</h1>
          <p className="text-xs opacity-40 mt-1">
            Assistente privado com contexto do negocio
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-center opacity-30 mt-20">
              Inicie uma conversa com o assistente IA
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-2xl ${
                msg.role === "user" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-white/10"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={msgEnd} />
        </div>

        <div className="p-6 border-t border-white/10 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Pergunte algo..."
            className="flex-1 bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition text-white placeholder:text-white/30"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-white text-black px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}
