"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

const platforms = [
  { id: "facebook", name: "Facebook Ads" },
  { id: "google", name: "Google Ads" },
  { id: "tiktok", name: "TikTok Ads" },
  { id: "linkedin", name: "LinkedIn Ads" },
];

export default function CampanhasPage() {
  const [platform, setPlatform] = useState("facebook");
  const [objetivo, setObjetivo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    if (!objetivo.trim()) return;
    setGenerating(true);
    setResult("");

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Crie uma campanha completa para ${platforms.find((p) => p.id === platform)?.name} com o objetivo: "${objetivo}".

Inclua:
1. Titulo da campanha
2. Publico-alvo sugerido
3. 3 variacoes de copy (curta, media, longa)
4. Sugestoes de segmentacao
5. CTA recomendado
6. Orcamento sugerido

Foco: servico de declaracao IRPF 100% online. WhatsApp: +55 11 94082-5120. Site: irpf.qaplay.com.br`,
            },
          ],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

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
                  content += parsed.content;
                  setResult(content);
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      setResult("Erro ao gerar campanha.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="font-serif text-3xl mb-8">Gerador de Campanhas IA</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
                Plataforma
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition ${
                      platform === p.id
                        ? "bg-white text-black border-white"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
                Objetivo da Campanha
              </label>
              <textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Ex: Captar leads para declaracao IRPF atrasado, publico 25-45 anos"
                className="w-full bg-transparent border border-white/20 p-4 h-32 resize-none outline-none focus:border-white transition text-white placeholder:text-white/30"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-white text-black py-4 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
            >
              {generating ? "Gerando campanha..." : "Gerar Campanha com IA"}
            </button>
          </div>

          <div className="border border-white/10 p-6 overflow-auto max-h-[600px]">
            {result ? (
              <pre className="text-sm whitespace-pre-wrap leading-relaxed opacity-80">
                {result}
              </pre>
            ) : (
              <p className="text-center opacity-30 mt-20">
                A campanha gerada aparecera aqui
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
