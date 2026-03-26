"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

/* ── Types ─────────────────────────────────────────────────── */
interface Problema {
  area: string;
  titulo?: string;
  descricao: string;
  prioridade: "alta" | "media" | "baixa";
  impactoEstimado?: string;
  promptCorrecao: string;
}

interface OportunidadeAd {
  plataforma: string;
  publico: string;
  hookPrincipal: string;
  dor: string;
  urgencia?: string;
  copyCurta: string;
  copyMedia: string;
  storytelling?: string;
  manchetes?: string[];
  descricoes?: string[];
  configuracaoSegmentacao?: {
    idadeMin?: number;
    idadeMax?: number;
    genero?: string;
    localizacao?: string;
    interesses?: string[];
    comportamentos?: string[];
    publicoNegativo?: string[];
  };
  keywordsGoogle?: string[];
  orcamentoSugerido?: string;
  orcamentoFaseTeste?: string;
  orcamentoFaseEscala?: string;
  formatoRecomendado?: string;
}

interface PostSugerido {
  titulo: string;
  keyword: string;
  volumeEstimado?: string;
  intencao: string;
  urgencia: "alta" | "media" | "baixa";
  angulo?: string;
  cta?: string;
  esbocoH2?: string[];
  metaDescricao?: string;
  introSugerida?: string;
}

interface Funil {
  tofu: string;
  mofu: string;
  bofu: string;
  gaps: string[];
}

interface Analysis {
  resumoGeral: string;
  pontuacaoGeral?: number;
  contextoSazonal?: string;
  funil?: Funil;
  problemas: Problema[];
  oportunidadesAds: OportunidadeAd[];
  postsParaCriar: PostSugerido[];
  acoesPrioritarias: string[];
  promptsIA?: {
    melhorarCTAs?: string;
    criarLandingPage?: string;
    emailMarketing?: string;
  };
}

interface HistoricoItem {
  id: string;
  resumo: string;
  totalPosts: number;
  totalLeads: number;
  createdAt: string;
}

/* ── Helpers ────────────────────────────────────────────────── */
const prioridadeCor: Record<string, string> = {
  alta: "border-red-500/50 bg-red-500/5",
  media: "border-yellow-500/50 bg-yellow-500/5",
  baixa: "border-white/10",
};

const urgenciaCor: Record<string, string> = {
  alta: "text-red-400",
  media: "text-yellow-400",
  baixa: "text-white/40",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-[#C6FF00] border-[#C6FF00]/40"
      : score >= 40
      ? "text-yellow-400 border-yellow-400/40"
      : "text-red-400 border-red-400/40";
  const label = score >= 70 ? "Bom" : score >= 40 ? "Regular" : "Crítico";
  return (
    <div className={`border p-4 text-center ${color}`}>
      <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
        Health Score
      </div>
      <div className={`text-5xl font-bold ${color.split(" ")[0]}`}>{score}</div>
      <div className={`text-[10px] uppercase tracking-widest mt-1 ${color.split(" ")[0]}`}>
        {label}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function AnalisadorPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [meta, setMeta] = useState<{ totalPosts: number; totalLeads: number } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingHistoricoId, setLoadingHistoricoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analise" | "historico">("analise");

  useEffect(() => {
    fetchHistorico();
  }, []);

  async function fetchHistorico() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/site-analyzer/history");
      const data = await res.json();
      setHistorico(data.analises ?? []);
    } catch {
      // silent
    } finally {
      setLoadingHistory(false);
    }
  }

  async function openHistoricoCompleto(id: string) {
    setLoadingHistoricoId(id);
    try {
      const res = await fetch(`/api/admin/site-analyzer/history/${id}`);
      const data = await res.json();
      if (data.analise?.dados) {
        setAnalysis(data.analise.dados as Analysis);
        setMeta({
          totalPosts: data.analise.totalPosts,
          totalLeads: data.analise.totalLeads,
        });
        setActiveTab("analise");
      }
    } catch {
      // silent
    } finally {
      setLoadingHistoricoId(null);
    }
  }

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    setAnalysis(null);
    setActiveTab("analise");
    try {
      const res = await fetch("/api/admin/site-analyzer", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na análise");
      setAnalysis(data.analysis);
      setMeta(data.meta);
      fetchHistorico();
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

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl mb-1">Analisador Estratégico IA</h1>
              <p className="text-white/40 text-sm">
                GPT-4o analisa todos os dados do site e entrega diagnóstico completo: problemas, funil, oportunidades, prompts prontos.
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-[#C6FF00] text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#d4ff33] transition disabled:opacity-50 shrink-0"
            >
              {loading ? "Analisando (~30s)..." : "Analisar Agora"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            {(["analise", "historico"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs uppercase tracking-widest transition border-b-2 ${
                  activeTab === tab
                    ? "border-[#C6FF00] text-[#C6FF00]"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "analise"
                  ? "Análise Atual"
                  : `Histórico${historico.length > 0 ? ` (${historico.length})` : ""}`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="border border-white/10 p-12 text-center">
              <div className="text-white/40 text-sm mb-2">GPT-4o analisando seu site...</div>
              <div className="text-white/20 text-xs">
                Lendo posts, leads, funil e identificando oportunidades. ~30 segundos.
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ── Tab: Análise Atual ── */}
          {activeTab === "analise" && analysis && (
            <div className="space-y-8">

              {/* Resumo + Score + Métricas */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 border border-white/10 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
                    Resumo Executivo
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">{analysis.resumoGeral}</p>
                </div>
                <div className="space-y-3">
                  {analysis.pontuacaoGeral !== undefined && (
                    <ScoreBadge score={analysis.pontuacaoGeral} />
                  )}
                  <div className="border border-white/10 p-4 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Posts</div>
                    <div className="text-3xl font-bold">{meta?.totalPosts ?? 0}</div>
                  </div>
                  <div className="border border-white/10 p-4 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Leads</div>
                    <div className="text-3xl font-bold">{meta?.totalLeads ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Contexto Sazonal */}
              {analysis.contextoSazonal && (
                <div className="border border-blue-400/30 bg-blue-500/5 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-blue-400 mb-2">
                    📅 Contexto Sazonal — Temporada IRPF 2026
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {analysis.contextoSazonal}
                  </p>
                </div>
              )}

              {/* Funil */}
              {analysis.funil && (
                <div className="border border-white/10 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-5">
                    Análise do Funil de Conversão
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {[
                      { label: "TOFU — Topo do Funil", text: analysis.funil.tofu, color: "text-white/30" },
                      { label: "MOFU — Meio do Funil", text: analysis.funil.mofu, color: "text-white/30" },
                      { label: "BOFU — Fundo / Conversão", text: analysis.funil.bofu, color: "text-[#C6FF00]/40" },
                    ].map((item) => (
                      <div key={item.label} className="border border-white/10 p-4">
                        <div className={`text-[10px] uppercase tracking-widest mb-2 ${item.color}`}>
                          {item.label}
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  {analysis.funil.gaps?.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-red-400/60 mb-2">
                        Gaps Identificados
                      </div>
                      {analysis.funil.gaps.map((gap, i) => (
                        <div key={i} className="flex gap-2 text-xs text-white/60">
                          <span className="text-red-400 shrink-0">—</span>
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Ações Prioritárias */}
              {analysis.acoesPrioritarias?.length > 0 && (
                <div className="border border-[#C6FF00]/30 bg-[#C6FF00]/5 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-4">
                    ⚡ Ações Prioritárias Esta Semana
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
                          <span
                            className={`text-[10px] uppercase tracking-widest ${urgenciaCor[p.prioridade]}`}
                          >
                            {p.prioridade} prioridade
                          </span>
                        </div>
                        {p.titulo && (
                          <h4 className="text-sm font-bold text-white mb-1">{p.titulo}</h4>
                        )}
                        <p className="text-sm text-white/80 mb-2">{p.descricao}</p>
                        {p.impactoEstimado && (
                          <p className="text-xs text-yellow-400/70 mb-4">
                            💡 {p.impactoEstimado}
                          </p>
                        )}
                        <div className="bg-black/40 p-3">
                          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                            Prompt para corrigir — cole no GitHub Copilot:
                          </div>
                          <p className="text-xs text-white/60 font-mono leading-relaxed">
                            {p.promptCorrecao}
                          </p>
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
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-widest bg-white text-black px-2 py-0.5">
                            {ad.plataforma}
                          </span>
                          {ad.formatoRecomendado && (
                            <span className="text-[10px] text-white/30">
                              {ad.formatoRecomendado}
                            </span>
                          )}
                        </div>

                        {/* Público + Dor */}
                        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                          Público-alvo
                        </div>
                        <p className="text-xs text-white/60 mb-2">{ad.publico}</p>
                        <p className="text-xs text-white/50 mb-1">{ad.dor}</p>
                        {ad.urgencia && (
                          <p className="text-xs text-yellow-400/70 mb-3">⚡ {ad.urgencia}</p>
                        )}

                        {/* Hook */}
                        <div className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-1">
                          Hook Principal
                        </div>
                        <p className="text-sm text-white font-bold mb-3">{ad.hookPrincipal}</p>

                        {/* Manchetes (3 headlines) */}
                        {ad.manchetes && ad.manchetes.length > 0 && (
                          <div className="mb-3">
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                              Headlines prontas (A/B/C)
                            </div>
                            <div className="space-y-1">
                              {ad.manchetes.map((h, hi) => (
                                <div key={hi} className="flex items-center gap-2">
                                  <span className="text-[9px] text-white/30 shrink-0">{["A", "B", "C"][hi]}</span>
                                  <p className="text-xs text-white/80 font-medium">{h}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Descrições */}
                        {ad.descricoes && ad.descricoes.length > 0 && (
                          <div className="mb-3">
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                              Descrições (prontas para colar)
                            </div>
                            <div className="space-y-1">
                              {ad.descricoes.map((d, di) => (
                                <p key={di} className="text-xs text-white/60">
                                  {di + 1}. {d}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Copies */}
                        <div className="space-y-2 mb-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                              Copy Curta (stories)
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{ad.copyCurta}</p>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                              Copy Média (feed)
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{ad.copyMedia}</p>
                          </div>
                          {ad.storytelling && (
                            <div>
                              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                                Storytelling completo (Facebook)
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">
                                {ad.storytelling}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Segmentação */}
                        {ad.configuracaoSegmentacao && (
                          <div className="border border-white/10 p-3 mb-3">
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                              Configuração de Segmentação
                            </div>
                            {(ad.configuracaoSegmentacao.idadeMin || ad.configuracaoSegmentacao.idadeMax) && (
                              <p className="text-[10px] text-white/50 mb-1">
                                Idade: {ad.configuracaoSegmentacao.idadeMin}–{ad.configuracaoSegmentacao.idadeMax} anos |{" "}
                                {ad.configuracaoSegmentacao.genero}
                              </p>
                            )}
                            {ad.configuracaoSegmentacao.localizacao && (
                              <p className="text-[10px] text-white/50 mb-2">📍 {ad.configuracaoSegmentacao.localizacao}</p>
                            )}
                            {ad.configuracaoSegmentacao.interesses && ad.configuracaoSegmentacao.interesses.length > 0 && (
                              <div className="mb-2">
                                <span className="text-[9px] uppercase tracking-widest text-white/25">Interesses: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ad.configuracaoSegmentacao.interesses.map((int, ii) => (
                                    <span key={ii} className="text-[9px] border border-white/15 px-1.5 py-0.5 text-white/40">
                                      {int}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {ad.configuracaoSegmentacao.comportamentos && ad.configuracaoSegmentacao.comportamentos.length > 0 && (
                              <div className="mb-2">
                                <span className="text-[9px] uppercase tracking-widest text-white/25">Comportamentos: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ad.configuracaoSegmentacao.comportamentos.map((c, ci) => (
                                    <span key={ci} className="text-[9px] border border-blue-500/20 px-1.5 py-0.5 text-blue-300/50">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {ad.configuracaoSegmentacao.publicoNegativo && ad.configuracaoSegmentacao.publicoNegativo.length > 0 && (
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-white/25">Excluir: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ad.configuracaoSegmentacao.publicoNegativo.map((n, ni) => (
                                    <span key={ni} className="text-[9px] border border-red-500/20 px-1.5 py-0.5 text-red-300/50">
                                      {n}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Keywords */}
                        {ad.keywordsGoogle && ad.keywordsGoogle.length > 0 && (
                          <div className="mb-3">
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                              Keywords Google
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {ad.keywordsGoogle.map((kw, ki) => (
                                <span key={ki} className="text-[10px] border border-white/20 px-2 py-0.5 text-white/50">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Orçamento */}
                        <div className="space-y-1 mb-4">
                          {ad.orcamentoFaseTeste && (
                            <p className="text-[10px] text-[#C6FF00]/60">
                              🧪 Fase Teste: {ad.orcamentoFaseTeste}
                            </p>
                          )}
                          {ad.orcamentoFaseEscala && (
                            <p className="text-[10px] text-[#C6FF00]/80">
                              🚀 Fase Escala: {ad.orcamentoFaseEscala}
                            </p>
                          )}
                          {!ad.orcamentoFaseTeste && ad.orcamentoSugerido && (
                            <p className="text-[10px] text-[#C6FF00]/70">
                              💰 {ad.orcamentoSugerido}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            copyPrompt(
                              [
                                `Plataforma: ${ad.plataforma}`,
                                `Público: ${ad.publico}`,
                                `Dor: ${ad.dor}`,
                                `Urgência: ${ad.urgencia ?? ""}`,
                                `Hook: ${ad.hookPrincipal}`,
                                ad.manchetes?.length ? `\nHeadlines:\n${ad.manchetes.map((h, i) => `${["A","B","C"][i]}. ${h}`).join("\n")}` : "",
                                ad.descricoes?.length ? `\nDescrições:\n${ad.descricoes.map((d, i) => `${i+1}. ${d}`).join("\n")}` : "",
                                `\nCopy Curta:\n${ad.copyCurta}`,
                                `\nCopy Média:\n${ad.copyMedia}`,
                                ad.storytelling ? `\nStorytelling:\n${ad.storytelling}` : "",
                              ].filter(Boolean).join("\n"),
                              `ad-${i}`
                            )
                          }
                          className="text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition"
                        >
                          {copied === `ad-${i}` ? "✓ Copiado!" : "Copiar Tudo →"}
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
                  <div className="space-y-3">
                    {analysis.postsParaCriar.map((post, i) => (
                      <div key={i} className="border border-white/10 p-4">
                        <div className="flex items-start gap-4">
                          <span className={`text-[10px] uppercase tracking-widest shrink-0 mt-0.5 ${urgenciaCor[post.urgencia]}`}>
                            {post.urgencia}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-white mb-1 font-medium">{post.titulo}</p>
                            <p className="text-xs text-white/40">{post.intencao}</p>
                            {post.angulo && (
                              <p className="text-xs text-white/50 mt-1">Ângulo: {post.angulo}</p>
                            )}
                            {post.cta && (
                              <p className="text-xs text-[#C6FF00]/60 mt-1">CTA: {post.cta}</p>
                            )}
                            {/* Esboço H2s */}
                            {post.esbocoH2 && post.esbocoH2.length > 0 && (
                              <div className="mt-2 space-y-0.5">
                                {post.esbocoH2.map((h2, hi) => (
                                  <p key={hi} className="text-[10px] text-white/30">
                                    H2 {hi + 1}: {h2}
                                  </p>
                                ))}
                              </div>
                            )}
                            {/* Meta description */}
                            {post.metaDescricao && (
                              <p className="text-[10px] text-white/25 mt-1 italic">
                                Meta: {post.metaDescricao}
                              </p>
                            )}
                            {/* Intro sugerida collapsed */}
                            {post.introSugerida && (
                              <details className="mt-2">
                                <summary className="text-[10px] text-white/30 cursor-pointer hover:text-white/60 transition">
                                  Ver intro sugerida
                                </summary>
                                <p className="text-[10px] text-white/50 leading-relaxed mt-1 pl-2 border-l border-white/10">
                                  {post.introSugerida}
                                </p>
                              </details>
                            )}
                          </div>
                          <div className="text-right shrink-0 space-y-2">
                            <span className="text-[10px] border border-white/20 px-2 py-0.5 text-white/40 block">
                              {post.keyword}
                            </span>
                            {post.volumeEstimado && (
                              <span className="text-[10px] text-white/30 block">
                                {post.volumeEstimado}
                              </span>
                            )}
                            <a
                              href={`/painel-nb-2025/blog?keyword=${encodeURIComponent(post.keyword)}&titulo=${encodeURIComponent(post.titulo)}`}
                              className="block text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition mt-1"
                            >
                              Gerar no Blog →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompts IA prontos */}
              {analysis.promptsIA &&
                (analysis.promptsIA.melhorarCTAs ||
                  analysis.promptsIA.criarLandingPage ||
                  analysis.promptsIA.emailMarketing) && (
                  <div className="border border-white/10 p-6">
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-5">
                      Prompts Prontos para GitHub Copilot
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Melhorar CTAs do Site",
                          key: "melhorarCTAs",
                          value: analysis.promptsIA.melhorarCTAs,
                        },
                        {
                          label: "Criar Landing Page de Alta Conversão",
                          key: "criarLandingPage",
                          value: analysis.promptsIA.criarLandingPage,
                        },
                        {
                          label: "Sequência de Email Marketing",
                          key: "emailMarketing",
                          value: analysis.promptsIA.emailMarketing,
                        },
                      ]
                        .filter((item) => item.value)
                        .map((item) => (
                          <div key={item.key} className="bg-black/30 p-4">
                            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                              {item.label}
                            </div>
                            <p className="text-xs text-white/60 font-mono leading-relaxed">
                              {item.value}
                            </p>
                            <button
                              onClick={() => copyPrompt(item.value!, `prompt-${item.key}`)}
                              className="mt-2 text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition"
                            >
                              {copied === `prompt-${item.key}` ? "✓ Copiado" : "Copiar Prompt"}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Estado inicial sem análise */}
          {activeTab === "analise" && !analysis && !loading && (
            <div className="border border-white/10 p-16 text-center">
              <p className="text-white/30 text-sm mb-1">Nenhuma análise gerada ainda nesta sessão.</p>
              <p className="text-white/20 text-xs">
                Clique em &quot;Analisar Agora&quot; para o GPT-4o diagnosticar seu site completo.
              </p>
            </div>
          )}

          {/* ── Tab: Histórico ── */}
          {activeTab === "historico" && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
                Análises Anteriores (salvas no banco de dados)
              </div>
              {loadingHistory ? (
                <div className="text-white/30 text-sm">Carregando histórico...</div>
              ) : historico.length === 0 ? (
                <div className="border border-white/10 p-12 text-center text-white/30 text-sm">
                  Nenhuma análise salva ainda.
                  <br />
                  <span className="text-xs text-white/20">
                    Toda análise gerada é salva automaticamente aqui.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {historico.map((item) => (
                    <div key={item.id} className="border border-white/10 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-[10px] text-white/30 mb-2">
                            {new Date(item.createdAt).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                            {item.resumo}
                          </p>
                        </div>
                        <div className="shrink-0 text-right space-y-2">
                          <div className="text-[10px] text-white/30">{item.totalPosts} posts</div>
                          <div className="text-[10px] text-white/30">{item.totalLeads} leads</div>
                          <button
                            onClick={() => openHistoricoCompleto(item.id)}
                            disabled={loadingHistoricoId === item.id}
                            className="block text-[10px] uppercase tracking-widest text-[#C6FF00] hover:text-white transition disabled:opacity-40 mt-2"
                          >
                            {loadingHistoricoId === item.id ? "Carregando..." : "Ver análise completa →"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

