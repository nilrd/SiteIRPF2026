"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────
interface Criativo {
  id: string;
  tipo: string;
  headline: string;
  headline2: string;
  headline3: string;
  descricao1: string;
  descricao2: string;
  textoLongo: string;
  cta: string;
  urlDestino: string;
  emojis: string;
}

interface Campanha {
  campanha: {
    nome: string;
    objetivo: string;
    plataforma: string;
    publicoAlvo: {
      descricao: string;
      faixaEtaria: string;
      interesses: string[];
      comportamentos: string[];
      localizacao: string;
      renda: string;
    };
    orcamentoSugerido: {
      diario: string;
      mensal: string;
      cpcEstimado: string;
      cplEstimado: string;
    };
  };
  criativos: Criativo[];
  extensoes: {
    sitelinks: { texto: string; descricao: string; url: string }[];
    callouts: string[];
    snippets: { header: string; valores: string[] };
  };
  segmentacaoAvancada: {
    palavrasChaveExatas: string[];
    palavrasChaveFrase: string[];
    palavrasNegativas: string[];
    publicosCustomizados: string[];
    retargeting: string;
  };
  promptImagemDalle: string;
}

interface AdImage {
  formato: string;
  label: string;
  url: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Dados de seleção
// ──────────────────────────────────────────────────────────────────────────────
const OBJETIVOS = [
  { id: "declaracao_simples", label: "Declaração Anual IRPF", desc: "Clientes que precisam declarar IR este ano" },
  { id: "cpf_bloqueado", label: "CPF Bloqueado / Irregular", desc: "Urgente — CPF irregular por falta de declaração" },
  { id: "declaracao_atrasada", label: "Declaração Atrasada", desc: "Anos anteriores não declarados, multa crescendo" },
  { id: "retificacao", label: "Retificação de Declaração", desc: "Erro na declaração entregue, malha fina" },
  { id: "malha_fina", label: "Malha Fina", desc: "Clientes retidos pela Receita Federal" },
];

const PLATAFORMAS = [
  { id: "Google Ads", icon: "G", color: "bg-blue-500" },
  { id: "Facebook Ads", icon: "f", color: "bg-blue-700" },
  { id: "Instagram Ads", icon: "IG", color: "bg-pink-600" },
  { id: "LinkedIn Ads", icon: "in", color: "bg-blue-600" },
];

const FORMATOS_IMAGEM = [
  { id: "square", label: "Quadrada 1:1", sub: "Feed Facebook/Instagram", icon: "□" },
  { id: "landscape", label: "Horizontal 1.91:1", sub: "Google Display / LinkedIn", icon: "▬" },
  { id: "portrait", label: "Vertical 9:16", sub: "Stories / Reels", icon: "▮" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────────────────────────────────────
export default function CampanhasPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [objetivo, setObjetivo] = useState("");
  const [plataforma, setPlataforma] = useState("");

  // Step 2
  const [generating, setGenerating] = useState(false);
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [error, setError] = useState("");
  const [selectedCriativo, setSelectedCriativo] = useState(0);

  // Step 3
  const [adImages, setAdImages] = useState<AdImage[]>([]);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);

  // Copy feedback
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleGenerate() {
    if (!objetivo || !plataforma) return;
    setGenerating(true);
    setError("");
    setCampanha(null);
    try {
      const res = await fetch("/api/admin/campanhas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objetivo, plataforma }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar campanha");
      setCampanha(data.campanha);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateImage(formato: string) {
    if (!campanha?.promptImagemDalle) return;
    setGeneratingImage(formato);
    const slug = `${objetivo}-${plataforma.replace(/\s/g, "-").toLowerCase()}`;
    try {
      const res = await fetch("/api/admin/generate-ad-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: campanha.promptImagemDalle, formato, campaignSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdImages((prev) => [...prev.filter((img) => img.formato !== formato), { formato, label: data.label, url: data.imageUrl }]);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingImage(null);
    }
  }

  function exportarJSON() {
    if (!campanha) return;
    const blob = new Blob([JSON.stringify(campanha, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campanha-${objetivo}-${plataforma.replace(/\s/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportarCSV() {
    if (!campanha) return;
    const c = campanha.criativos[selectedCriativo];
    const rows = [
      ["Campo", "Valor"],
      ["Campanha", campanha.campanha.nome],
      ["Plataforma", campanha.campanha.plataforma],
      ["Objetivo", campanha.campanha.objetivo],
      ["Headline 1", c.headline],
      ["Headline 2", c.headline2],
      ["Headline 3", c.headline3],
      ["Descrição 1", c.descricao1],
      ["Descrição 2", c.descricao2],
      ["Texto Longo", `${c.emojis} ${c.textoLongo}`],
      ["CTA", c.cta],
      ["URL Destino", c.urlDestino],
      ["Público-alvo", campanha.campanha.publicoAlvo.descricao],
      ["Faixa etária", campanha.campanha.publicoAlvo.faixaEtaria],
      ["Interesses", (campanha.campanha.publicoAlvo.interesses || []).join("; ")],
      ["Orçamento diário", campanha.campanha.orcamentoSugerido.diario],
      ["Orçamento mensal", campanha.campanha.orcamentoSugerido.mensal],
      ["CPC estimado", campanha.campanha.orcamentoSugerido.cpcEstimado],
      ["CPL estimado", campanha.campanha.orcamentoSugerido.cplEstimado],
      ["Keywords Exatas", (campanha.segmentacaoAvancada.palavrasChaveExatas || []).join("; ")],
      ["Keywords Frase", (campanha.segmentacaoAvancada.palavrasChaveFrase || []).join("; ")],
      ["Keywords Negativas", (campanha.segmentacaoAvancada.palavrasNegativas || []).join("; ")],
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campanha-${objetivo}-${plataforma.replace(/\s/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {/* Header + indicadores de passo */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl mb-1">Gerador de Campanhas IA</h1>
              <p className="text-white/40 text-sm">GPT-4o cria copy profissional + DALL-E 3 gera imagens nos formatos certos</p>
            </div>
            <div className="flex gap-2 text-[10px] uppercase tracking-widest">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`px-3 py-1.5 border transition ${
                    step === s ? "bg-white text-black border-white" :
                    step > s ? "border-[#C6FF00]/50 text-[#C6FF00]/50" :
                    "border-white/20 text-white/30"
                  }`}
                >
                  {s === 1 ? "1. Objetivo" : s === 2 ? "2. Copy IA" : "3. Imagens"}
                </div>
              ))}
            </div>
          </div>

          {/* ──── STEP 1: Objetivo + Plataforma ──── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Objetivo da campanha</div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {OBJETIVOS.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setObjetivo(o.id)}
                      className={`p-4 border text-left transition ${
                        objetivo === o.id ? "border-[#C6FF00] bg-[#C6FF00]/5" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{o.label}</div>
                      <div className="text-[11px] text-white/40">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Plataforma de anúncio</div>
                <div className="flex flex-wrap gap-3">
                  {PLATAFORMAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlataforma(p.id)}
                      className={`flex items-center gap-3 px-5 py-3 border transition ${
                        plataforma === p.id ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <span className={`w-6 h-6 ${p.color} text-white text-[10px] font-bold flex items-center justify-center rounded-sm`}>
                        {p.icon}
                      </span>
                      <span className="text-sm">{p.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 text-sm">{error}</div>}

              <button
                onClick={handleGenerate}
                disabled={!objetivo || !plataforma || generating}
                className="bg-[#C6FF00] text-black px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-30"
              >
                {generating ? "Gerando com GPT-4o..." : "Gerar Campanha →"}
              </button>
            </div>
          )}

          {/* ──── STEP 2: Copy + Segmentação ──── */}
          {step === 2 && campanha && (
            <div className="space-y-8">
              {/* Métricas */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 border border-white/10 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Campanha</div>
                  <div className="text-lg font-bold mb-1">{campanha.campanha.nome}</div>
                  <div className="text-xs text-white/40">{campanha.campanha.plataforma} — {campanha.campanha.objetivo}</div>
                </div>
                <div className="border border-white/10 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Orçamento Diário</div>
                  <div className="text-2xl font-bold text-[#C6FF00]">{campanha.campanha.orcamentoSugerido.diario}</div>
                  <div className="text-xs text-white/30 mt-1">CPC: {campanha.campanha.orcamentoSugerido.cpcEstimado}</div>
                </div>
                <div className="border border-white/10 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">CPL Estimado</div>
                  <div className="text-2xl font-bold">{campanha.campanha.orcamentoSugerido.cplEstimado}</div>
                  <div className="text-xs text-white/30 mt-1">Mensal: {campanha.campanha.orcamentoSugerido.mensal}</div>
                </div>
              </div>

              {/* Seletor de variações */}
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Variações de Copy — selecione a melhor para testar</div>
                <div className="flex gap-2 mb-5">
                  {campanha.criativos.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCriativo(i)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border transition ${
                        selectedCriativo === i ? "bg-white text-black border-white" : "border-white/20 text-white/50 hover:border-white/40"
                      }`}
                    >
                      Variação {c.id}
                    </button>
                  ))}
                </div>

                {(() => {
                  const c = campanha.criativos[selectedCriativo];
                  if (!c) return null;
                  return (
                    <div className="border border-white/10 p-6 space-y-5">
                      {/* Headlines */}
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Headlines</div>
                        <div className="space-y-2">
                          {[c.headline, c.headline2, c.headline3].map((h, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 px-4 py-2">
                              <span className="text-sm">{h}</span>
                              <span className="text-[10px] text-white/30">{h?.length}c</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => copy([c.headline, c.headline2, c.headline3].join("\n"), "heads")} className="mt-2 text-[10px] text-[#C6FF00] uppercase tracking-widest hover:text-white transition">
                          {copied === "heads" ? "✓ Copiado" : "Copiar todos"}
                        </button>
                      </div>

                      {/* Descrições */}
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Descrições</div>
                        <div className="space-y-2">
                          {[c.descricao1, c.descricao2].map((d, i) => (
                            <div key={i} className="flex items-start justify-between bg-white/5 px-4 py-2 gap-4">
                              <span className="text-sm leading-relaxed">{d}</span>
                              <span className="text-[10px] text-white/30 shrink-0">{d?.length}c</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Texto longo */}
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Copy longa — Facebook / LinkedIn body</div>
                        <div className="bg-white/5 px-4 py-3">
                          <p className="text-sm leading-relaxed whitespace-pre-line">{c.emojis} {c.textoLongo}</p>
                        </div>
                        <button onClick={() => copy(`${c.emojis} ${c.textoLongo}`, "long")} className="mt-2 text-[10px] text-[#C6FF00] uppercase tracking-widest hover:text-white transition">
                          {copied === "long" ? "✓ Copiado" : "Copiar copy longa"}
                        </button>
                      </div>

                      {/* CTA + URL */}
                      <div className="flex gap-4">
                        <div className="flex-1 border border-[#C6FF00]/30 bg-[#C6FF00]/5 px-4 py-3">
                          <div className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-1">CTA</div>
                          <div className="text-sm font-bold">{c.cta}</div>
                        </div>
                        <div className="flex-1 border border-white/10 px-4 py-3">
                          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">URL Destino</div>
                          <div className="text-xs text-white/60 break-all">{c.urlDestino}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Público-alvo */}
              <div className="border border-white/10 p-5">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Segmentação de Público</div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Descrição</div>
                    <p className="text-white/70">{campanha.campanha.publicoAlvo.descricao}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Faixa Etária / Renda</div>
                    <p className="text-white/70">{campanha.campanha.publicoAlvo.faixaEtaria} — {campanha.campanha.publicoAlvo.renda}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Interesses</div>
                    <div className="flex flex-wrap gap-1">
                      {(campanha.campanha.publicoAlvo.interesses || []).map((int, i) => (
                        <span key={i} className="bg-white/10 text-white/60 text-[11px] px-2 py-0.5">{int}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Comportamentos</div>
                    <div className="flex flex-wrap gap-1">
                      {(campanha.campanha.publicoAlvo.comportamentos || []).map((b, i) => (
                        <span key={i} className="bg-white/10 text-white/60 text-[11px] px-2 py-0.5">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords Google Ads */}
              {(campanha.segmentacaoAvancada.palavrasChaveExatas?.length > 0) && (
                <div className="border border-white/10 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Keywords — Google Ads</div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase mb-2">[Exata]</div>
                      {campanha.segmentacaoAvancada.palavrasChaveExatas.map((kw, i) => (
                        <div key={i} className="text-xs text-white/60 font-mono">[{kw}]</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase mb-2">&quot;Frase&quot;</div>
                      {campanha.segmentacaoAvancada.palavrasChaveFrase.map((kw, i) => (
                        <div key={i} className="text-xs text-white/60 font-mono">&quot;{kw}&quot;</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] text-red-400/60 uppercase mb-2">-Negativas</div>
                      {campanha.segmentacaoAvancada.palavrasNegativas.map((kw, i) => (
                        <div key={i} className="text-xs text-red-400/40 font-mono">-{kw}</div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => copy(
                      `[Exatas]\n${(campanha.segmentacaoAvancada.palavrasChaveExatas || []).map(k => `[${k}]`).join("\n")}\n\n[Frase]\n${(campanha.segmentacaoAvancada.palavrasChaveFrase || []).map(k => `"${k}"`).join("\n")}\n\n[Negativas]\n${(campanha.segmentacaoAvancada.palavrasNegativas || []).map(k => `-${k}`).join("\n")}`,
                      "kws"
                    )}
                    className="mt-4 text-[10px] text-[#C6FF00] uppercase tracking-widest hover:text-white transition"
                  >
                    {copied === "kws" ? "✓ Copiado" : "Copiar todas as keywords"}
                  </button>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setStep(3)} className="bg-[#C6FF00] text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition">
                  Gerar Imagens →
                </button>
                <button onClick={exportarJSON} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:border-white transition">
                  Exportar JSON
                </button>
                <button onClick={exportarCSV} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:border-white transition">
                  Exportar CSV
                </button>
                <button onClick={() => { setStep(1); setCampanha(null); setAdImages([]); setObjetivo(""); setPlataforma(""); }} className="text-xs text-white/30 uppercase tracking-widest hover:text-white/60 transition px-4">
                  Nova Campanha
                </button>
              </div>
            </div>
          )}

          {/* ──── STEP 3: Imagens por formato ──── */}
          {step === 3 && campanha && (
            <div className="space-y-8">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Prompt DALL-E gerado pela IA</div>
                <div className="border border-white/10 bg-white/2 p-4 text-xs text-white/50 font-mono leading-relaxed">
                  {campanha.promptImagemDalle}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Gere nos formatos que precisar — cada um otimizado para a plataforma</div>
                <div className="grid md:grid-cols-3 gap-5">
                  {FORMATOS_IMAGEM.map((f) => {
                    const adImg = adImages.find((img) => img.formato === f.id);
                    const isLoading = generatingImage === f.id;
                    return (
                      <div key={f.id} className="border border-white/10">
                        <div className="p-4 border-b border-white/10">
                          <div className="text-2xl mb-2 text-white/30">{f.icon}</div>
                          <div className="text-sm font-medium">{f.label}</div>
                          <div className="text-[11px] text-white/30">{f.sub}</div>
                        </div>
                        <div className="p-4">
                          {adImg ? (
                            <div className="space-y-3">
                              <img
                                src={adImg.url}
                                alt={f.label}
                                className="w-full object-cover border border-white/10"
                                style={{ aspectRatio: f.id === "square" ? "1/1" : f.id === "landscape" ? "1.91/1" : "9/16" }}
                              />
                              <div className="flex gap-2">
                                <a href={adImg.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[10px] uppercase tracking-widest border border-white/20 py-2 hover:border-white transition">
                                  Abrir
                                </a>
                                <button onClick={() => handleGenerateImage(f.id)} disabled={!!generatingImage} className="flex-1 text-[10px] uppercase tracking-widest border border-white/20 py-2 hover:border-white transition disabled:opacity-30">
                                  Regerar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleGenerateImage(f.id)}
                              disabled={!!generatingImage}
                              className="w-full py-8 border border-dashed border-white/20 text-[10px] uppercase tracking-widest text-white/30 hover:border-white/50 hover:text-white/60 transition disabled:opacity-30"
                            >
                              {isLoading ? "Gerando (~15s)..." : "Gerar Imagem"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setStep(2)} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:border-white transition">
                  ← Voltar ao Copy
                </button>
                <button onClick={exportarJSON} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:border-white transition">
                  Exportar JSON
                </button>
                <button onClick={exportarCSV} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest hover:border-white transition">
                  Exportar CSV
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
