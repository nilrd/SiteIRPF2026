"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Problema {
  area: string;
  descricao: string;
  prioridade: "alta" | "media" | "baixa";
  promptCorrecao: string;
}

interface OportunidadeAd {
  plataforma: string;
  publico: string;
  hookPrincipal: string;
  dor: string;
  copyCurta: string;
  copyMedia: string;
  keywordsGoogle?: string[];
}

interface PostSugerido {
  titulo: string;
  keyword: string;
  intencao: string;
  urgencia: "alta" | "media" | "baixa";
}

interface Analysis {
  resumoGeral: string;
  problemas: Problema[];
  oportunidadesAds: OportunidadeAd[];
  postsParaCriar: PostSugerido[];
  acoesPrioritarias: string[];
}

const prioridadeCor: Record<string, string> = {
  alta: "border-red-500/50 bg-red-500/5",
  media: "border-yellow-500/50 bg-yellow-500/5",
  baixa: "border-white/10 bg-white/2",
};

const urgenciaCor: Record<string, string> = {
  alta: "text-red-400",
  media: "text-yellow-400",
  baixa: "text-white/40",
};

export default function AnalisadorPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [meta, setMeta] = useState<{ totalPosts: number; totalLeads: number } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch("/api/admin/site-analyzer", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na análise");
      setAnalysis(data.analysis);
      setMeta(data.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  function copyPrompt(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl mb-1">Analisador do Site IA</h1>
              <p className="text-white/40 text-sm">
                GPT-4o lê todos os seus dados e entrega: problemas para corrigir, oportunidades de ads e posts para criar.
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#C6FF00] text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-50 shrink-0"
            >
              {loading ? "Analisando..." : "Analisar Agora"}
            </button>
          </div>

          {loading && (
            <div className="border border-white/10 p-12 text-center">
              <div className="text-white/40 text-sm mb-2">GPT-4o analisando seu site...</div>
              <div className="text-white/20 text-xs">Lendo posts, leads e identificando oportunidades. ~20 segundos.</div>
            </div>
          )}

          {error && (
            <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 text-sm">{error}</div>
          )}

          {analysis && (
            <div className="space-y-8">
              {/* Resumo + Métricas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 border border-white/10 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Resumo Geral</div>
                  <p className="text-sm leading-relaxed text-white/80">{analysis.resumoGeral}</p>
                </div>
                <div className="space-y-4">
                  <div className="border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Posts Publicados</div>
                    <div className="text-3xl font-bold">{meta?.totalPosts ?? 0}</div>
                  </div>
                  <div className="border border-white/10 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Leads Captados</div>
                    <div className="text-3xl font-bold">{meta?.totalLeads ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Ações Prioritárias */}
              {analysis.acoesPrioritarias?.length > 0 && (
                <div className="border border-[#C6FF00]/30 bg-[#C6FF00]/5 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-4">
                    ⚡ 5 Ações Para Fazer Essa Semana
                  </div>
                  <ol className="space-y-2">
                    {analysis.acoesPrioritarias.map((acao, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="text-[#C6FF00] font-bold shrink-0">{i + 1}.</span>
                        <span className="text-white/80">{acao}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Problemas */}
              {analysis.problemas?.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                    Problemas Identificados ({analysis.problemas.length})
                  </div>
                  <div className="space-y-3">
                    {analysis.problemas.map((p, i) => (
                      <div key={i} className={`border p-5 ${prioridadeCor[p.prioridade]}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/20 px-2 py-0.5">
                            {p.area}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest ${urgenciaCor[p.prioridade]}`}>
                            Prioridade {p.prioridade}
                          </span>
                        </div>
                        <p className="text-sm text-white/80 mb-4">{p.descricao}</p>
                        <div className="bg-black/40 p-3 rounded-sm">
                          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                            Prompt para corrigir — cole no Copilot:
                          </div>
                          <p className="text-xs text-white/60 font-mono leading-relaxed">{p.promptCorrecao}</p>
                        </div>
                        <button
                          onClick={() => copyPrompt(p.promptCorrecao, `prob-${i}`)}
                          className="mt-3 text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition"
                        >
                          {copied === `prob-${i}` ? "✓ Copiado!" : "Copiar Prompt"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Oportunidades de Ads */}
              {analysis.oportunidadesAds?.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                    Oportunidades de Anúncios ({analysis.oportunidadesAds.length})
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.oportunidadesAds.map((ad, i) => (
                      <div key={i} className="border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-widest bg-white text-black px-2 py-0.5">
                            {ad.plataforma}
                          </span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Público-alvo</div>
                        <p className="text-xs text-white/60 mb-3">{ad.publico}</p>

                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Dor que resolve</div>
                        <p className="text-xs text-white/60 mb-3">{ad.dor}</p>

                        <div className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-1">Hook Principal</div>
                        <p className="text-sm text-white font-bold mb-3">{ad.hookPrincipal}</p>

                        <div className="space-y-2">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Copy Curta</div>
                            <p className="text-xs text-white/70 leading-relaxed">{ad.copyCurta}</p>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Copy Média</div>
                            <p className="text-xs text-white/70 leading-relaxed">{ad.copyMedia}</p>
                          </div>
                          {ad.keywordsGoogle && ad.keywordsGoogle.length > 0 && (
                            <div>
                              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Keywords</div>
                              <div className="flex flex-wrap gap-1">
                                {ad.keywordsGoogle.map((kw, ki) => (
                                  <span key={ki} className="text-[10px] border border-white/20 px-2 py-0.5 text-white/50">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => copyPrompt(`${ad.plataforma}\nPúblico: ${ad.publico}\nHook: ${ad.hookPrincipal}\nCopy curta: ${ad.copyCurta}\nCopy média: ${ad.copyMedia}`, `ad-${i}`)}
                          className="mt-4 text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition"
                        >
                          {copied === `ad-${i}` ? "✓ Copiado!" : "Copiar Dados do Ad"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts para criar */}
              {analysis.postsParaCriar?.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                    Posts para Criar ({analysis.postsParaCriar.length} sugestões)
                  </div>
                  <div className="space-y-2">
                    {analysis.postsParaCriar.map((post, i) => (
                      <div key={i} className="border border-white/10 p-4 flex items-start gap-4">
                        <span className={`text-[10px] uppercase tracking-widest shrink-0 mt-0.5 ${urgenciaCor[post.urgencia]}`}>
                          {post.urgencia}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-white mb-1">{post.titulo}</p>
                          <p className="text-xs text-white/40">{post.intencao}</p>
                        </div>
                        <span className="text-[10px] border border-white/20 px-2 py-0.5 text-white/40 shrink-0">
                          {post.keyword}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
