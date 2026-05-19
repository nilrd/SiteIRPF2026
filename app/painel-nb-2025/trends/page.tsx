"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Trend = {
  id: string;
  keyword: string;
  source: string;
  category: string;
  intent: string | null;
  postType: string | null;
  trendScore: number;
  businessScore: number;
  urgencyScore: number;
  seoScore: number;
  riskScore: number;
  breakoutStatus: boolean;
  geo: string | null;
  cachedUntil: string;
  createdAt: string;
  active: boolean;
  inScope: boolean;
};

type Quota = {
  canCall: boolean;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  remaining: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  IRPF: "bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/30",
  IRPF_ATRASADO: "bg-orange-500/10 text-orange-300 border border-orange-500/30",
  MEI: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
  CPF: "bg-purple-500/10 text-purple-300 border border-purple-500/30",
  DASN: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30",
  PARCELAMENTO_MEI: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
  FINANCAS: "bg-white/5 text-white/40 border border-white/10",
};

const SOURCE_LABELS: Record<string, string> = {
  serpapi_trends: "SerpAPI Trending",
  serpapi_related: "SerpAPI Related",
  serpapi_interest: "SerpAPI Interest",
  rss_fallback: "RSS Fallback",
  evergreen: "Evergreen",
};

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color =
    pct >= 70
      ? "bg-[#C6FF00]"
      : pct >= 50
        ? "bg-yellow-400"
        : "bg-white/20";
  return (
    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function TrendsAdminPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "outofscope">("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("TODOS");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/trends");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrends(data.trends ?? []);
      setQuota(data.quota ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = trends.filter((t) => {
    if (filter === "active" && !t.active) return false;
    if (filter === "expired" && t.active) return false;
    if (filter === "outofscope" && t.inScope) return false;
    if (categoryFilter !== "TODOS" && t.category !== categoryFilter) return false;
    return true;
  });

  const categories = ["TODOS", ...Array.from(new Set(trends.map((t) => t.category))).sort()];
  const outOfScopeCount = trends.filter((t) => !t.inScope).length;
  const activeCount = trends.filter((t) => t.active).length;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">
            TRENDS — MONITORAMENTO SERPAPI
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Keywords coletadas para geração de posts. Apenas termos IRPF/MEI/Tributação são aceitos.
          </p>
        </div>

        {/* Quota SerpAPI */}
        {quota && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Chamadas Hoje</div>
              <div className="text-2xl font-black">
                {quota.dailyUsed}
                <span className="text-white/30 text-base font-normal">/{quota.dailyLimit}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Chamadas Mês</div>
              <div className="text-2xl font-black">
                {quota.monthlyUsed}
                <span className="text-white/30 text-base font-normal">/{quota.monthlyLimit}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Restantes</div>
              <div className={`text-2xl font-black ${quota.remaining < 5 ? "text-red-400" : "text-[#C6FF00]"}`}>
                {quota.remaining}
              </div>
            </div>
            <div className={`border p-4 ${quota.canCall ? "bg-[#C6FF00]/5 border-[#C6FF00]/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Status</div>
              <div className={`text-lg font-black ${quota.canCall ? "text-[#C6FF00]" : "text-red-400"}`}>
                {quota.canCall ? "DISPONÍVEL" : "ESGOTADO"}
              </div>
            </div>
          </div>
        )}

        {/* Resumo do cache */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Total no banco</div>
            <div className="text-xl font-black">{trends.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Cache ativo</div>
            <div className="text-xl font-black text-[#C6FF00]">{activeCount}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Fora do escopo</div>
            <div className={`text-xl font-black ${outOfScopeCount > 0 ? "text-red-400" : "text-white/30"}`}>
              {outOfScopeCount}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Exibindo</div>
            <div className="text-xl font-black">{filtered.length}</div>
          </div>
        </div>

        {/* Aviso se houver out-of-scope */}
        {outOfScopeCount > 0 && (
          <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 mb-6 text-sm text-red-300">
            ⚠️ {outOfScopeCount} keyword(s) fora do escopo IRPF/MEI detectadas no banco. O filtro
            já está ativo — novos fetches descartam automaticamente. Estes registros são históricos.
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["all", "active", "expired", "outofscope"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs border font-mono uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-[#C6FF00] text-black border-[#C6FF00]"
                  : "border-white/20 text-white/50 hover:border-white/40"
              }`}
            >
              {f === "all" ? "Todos" : f === "active" ? "Cache ativo" : f === "expired" ? "Expirados" : "Fora do escopo"}
            </button>
          ))}
          <div className="w-px bg-white/10 mx-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs border font-mono uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/50 hover:border-white/40"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="ml-auto px-3 py-1 text-xs border border-white/20 text-white/50 hover:border-white/40 font-mono uppercase"
          >
            ↻ Atualizar
          </button>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="text-white/30 text-sm py-12 text-center">Carregando...</div>
        ) : error ? (
          <div className="text-red-400 text-sm py-4 border border-red-500/30 px-4">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-white/30 text-sm py-12 text-center">Nenhuma keyword encontrada para este filtro.</div>
        ) : (
          <div className="border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/30 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-normal">Keyword</th>
                  <th className="text-left px-4 py-3 font-normal">Categoria</th>
                  <th className="text-left px-4 py-3 font-normal">Fonte</th>
                  <th className="text-left px-4 py-3 font-normal">Tipo</th>
                  <th className="px-4 py-3 font-normal">Trend</th>
                  <th className="px-4 py-3 font-normal">Business</th>
                  <th className="px-4 py-3 font-normal">Urgência</th>
                  <th className="px-4 py-3 font-normal">SEO</th>
                  <th className="text-left px-4 py-3 font-normal">Expira</th>
                  <th className="text-left px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                      !t.inScope ? "bg-red-500/5" : !t.active ? "opacity-40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.breakoutStatus && (
                          <span className="text-[#C6FF00] text-xs font-mono">↑</span>
                        )}
                        <span className={!t.inScope ? "text-red-300" : "text-white"}>
                          {t.keyword}
                        </span>
                        {!t.inScope && (
                          <span className="text-xs text-red-400 border border-red-400/30 px-1 font-mono">
                            FORA DO ESCOPO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 font-mono ${
                          CATEGORY_COLORS[t.category] ?? "bg-white/5 text-white/40"
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">
                      {SOURCE_LABELS[t.source] ?? t.source}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-mono px-1.5 py-0.5 ${
                          t.postType === "lead"
                            ? "bg-[#C6FF00]/10 text-[#C6FF00]"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {t.postType ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-white/60">{t.trendScore}</span>
                        <ScoreBar value={t.trendScore} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-white/60">{t.businessScore}</span>
                        <ScoreBar value={t.businessScore} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-white/60">{t.urgencyScore}</span>
                        <ScoreBar value={t.urgencyScore} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-white/60">{t.seoScore}</span>
                        <ScoreBar value={t.seoScore} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs font-mono whitespace-nowrap">
                      {new Date(t.cachedUntil).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-mono px-1.5 py-0.5 ${
                          t.active
                            ? "bg-[#C6FF00]/10 text-[#C6FF00]"
                            : "bg-white/5 text-white/30"
                        }`}
                      >
                        {t.active ? "ATIVO" : "EXPIRADO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legenda */}
        <div className="mt-6 border border-white/10 p-4 text-xs text-white/40 space-y-1">
          <p><strong className="text-white/60">↑</strong> = Breakout (crescimento rápido)</p>
          <p><strong className="text-white/60">FORA DO ESCOPO</strong> = Keyword histórica que não passaria pelo filtro atual (futebol, entretenimento, etc). Não é mais inserida.</p>
          <p><strong className="text-white/60">Fonte SerpAPI Trending</strong> = Busca &quot;trending now&quot; Brasil — agora filtrado por termos IRPF/MEI/Tributação antes de salvar.</p>
          <p><strong className="text-white/60">lead / traffic</strong> = Tipo de post recomendado (businessScore ≥ 72 = lead).</p>
        </div>
      </main>
    </div>
  );
}
