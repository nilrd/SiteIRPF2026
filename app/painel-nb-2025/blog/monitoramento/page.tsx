"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AutomationRun = {
  id: string;
  automationKey: string;
  trigger: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  generatedCount: number;
  publishedCount: number;
  retainedCount: number;
  errorCount: number;
  metadataJson: string;
};

type AutomationStats = {
  postsToday: number;
  publishedToday: number;
  runs24h: number;
  failures24h: number;
  partials24h: number;
  success24h: number;
  stale24h: number;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  lastRunKey: string | null;
  trackedPosts: number;
  aiPostsToday: number;
  aiPosts24h: number;
  estimatedFromPosts: boolean;
  historicalAiPosts: number;
  stalledLinkedPosts: number;
  unexplainedUntrackedPosts: number;
};

const AUTOMATION_LABELS: Record<string, string> = {
  "blog-auto": "Blog IRPF",
  "blog-mei": "Blog MEI",
};

const RUN_STATUS_STYLES: Record<string, string> = {
  success: "bg-green-500/15 text-green-300 border border-green-500/20",
  partial: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  failed: "bg-red-500/15 text-red-300 border border-red-500/20",
  started: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
  stale: "bg-orange-500/20 text-orange-200 border border-orange-500/30",
};

const RUN_STATUS_LABELS: Record<string, string> = {
  success: "SUCCESS",
  partial: "PARTIAL",
  failed: "FAILED",
  started: "STARTED",
  stale: "TIMEOUT/STALE",
};

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BlogMonitoramentoPage() {
  const [automationRuns, setAutomationRuns] = useState<AutomationRun[]>([]);
  const [automationStats, setAutomationStats] = useState<AutomationStats>({
    postsToday: 0,
    publishedToday: 0,
    runs24h: 0,
    failures24h: 0,
    partials24h: 0,
    success24h: 0,
    stale24h: 0,
    lastRunAt: null,
    lastRunStatus: null,
    lastRunKey: null,
    trackedPosts: 0,
    aiPostsToday: 0,
    aiPosts24h: 0,
    estimatedFromPosts: false,
    historicalAiPosts: 0,
    stalledLinkedPosts: 0,
    unexplainedUntrackedPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMonitor = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.automationRuns) setAutomationRuns(data.automationRuns);
      if (data.automationStats) setAutomationStats(data.automationStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitor();
  }, [fetchMonitor]);

  const lastRunLabel = automationStats.lastRunKey
    ? AUTOMATION_LABELS[automationStats.lastRunKey] ||
      automationStats.lastRunKey
    : "Sem execucao";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl">Monitoramento do Auto Post</h1>
            <p className="text-sm text-white/45 mt-1">
              Painel operacional completo dos crons de blog. &quot;Hoje&quot; considera o
              timezone America/Sao_Paulo.
            </p>
          </div>
          <Link
            href="/painel-nb-2025/blog"
            className="inline-flex items-center justify-center border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:border-white/50 hover:bg-white/5 transition"
          >
            Voltar ao Blog
          </Link>
        </div>

        <section className="border border-white/10 p-6 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-xl">Resumo Operacional</h2>
              <p className="text-sm text-white/45 mt-1">
                Acompanhe geracao, publicacao e alertas sem misturar com o
                historico antigo.
              </p>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/40">
              Ultima execucao: {lastRunLabel} • {formatDateTime(automationStats.lastRunAt)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Posts hoje</p>
              <p className="text-3xl font-serif">{automationStats.postsToday}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Publicados hoje</p>
              <p className="text-3xl font-serif">{automationStats.publishedToday}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Execucoes 24h</p>
              <p className="text-3xl font-serif">{automationStats.runs24h}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Alertas 24h</p>
              <p className="text-3xl font-serif">
                {automationStats.failures24h +
                  automationStats.partials24h +
                  automationStats.stale24h}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Execucoes concluidas</p>
              <p className="text-2xl font-serif">{automationStats.success24h}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Execucoes parciais</p>
              <p className="text-2xl font-serif">{automationStats.partials24h}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Execucoes com erro</p>
              <p className="text-2xl font-serif">{automationStats.failures24h}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Execucoes travadas</p>
              <p className="text-2xl font-serif">{automationStats.stale24h}</p>
            </div>
          </div>

          {automationStats.estimatedFromPosts ? (
            <div className="border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100/85">
              <p>
                Ainda nao existem execucoes registradas em automation_runs.
                Enquanto isso, o monitor usa os posts por IA como referencia de
                atividade.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Posts rastreados</p>
                <p className="text-2xl font-serif">{automationStats.trackedPosts}</p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Posts antigos sem rastreio</p>
                <p className="text-2xl font-serif">{automationStats.historicalAiPosts}</p>
                <p className="text-xs text-white/35 mt-2">
                  Posts criados antes do monitor atual.
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Posts de runs travados</p>
                <p className="text-2xl font-serif">{automationStats.stalledLinkedPosts}</p>
                <p className="text-xs text-white/35 mt-2">
                  Posts que provavelmente vieram de execucoes sem finalizacao.
                </p>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Sem vinculo finalizado</p>
                <p className="text-2xl font-serif">{automationStats.unexplainedUntrackedPosts}</p>
                <p className="text-xs text-white/35 mt-2">
                  Posts com IA sem relacao finalizada com um run registrado.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {loading ? (
              <div className="border border-dashed border-white/10 p-5 text-sm text-white/35">
                Carregando execucoes...
              </div>
            ) : automationRuns.length === 0 ? (
              <div className="border border-dashed border-white/10 p-5 text-sm text-white/35">
                Nenhuma execucao automatica registrada ainda.
              </div>
            ) : (
              automationRuns.map((run) => (
                <div
                  key={run.id}
                  className="border border-white/10 bg-[#0E0E0E] px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {AUTOMATION_LABELS[run.automationKey] || run.automationKey}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-widest px-2 py-1 ${RUN_STATUS_STYLES[run.status] || "bg-white/10 text-white/50 border border-white/10"}`}
                      >
                        {RUN_STATUS_LABELS[run.status] || run.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/45">
                      Inicio: {formatDateTime(run.startedAt)} • Fim: {formatDateTime(run.finishedAt)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] uppercase tracking-widest text-white/55 md:min-w-[480px]">
                    <span>Gerados {run.generatedCount}</span>
                    <span>Publicados {run.publishedCount}</span>
                    <span>Retidos {run.retainedCount}</span>
                    <span>Erros {run.errorCount}</span>
                  </div>

                  <div className="text-xs text-white/35 md:text-right">
                    {run.durationMs ? `${Math.round(run.durationMs / 1000)}s` : "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
