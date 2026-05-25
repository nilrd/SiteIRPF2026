"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface MetricasData {
  summary: {
    totalPages: number;
    publishedPages: number;
    indexablePages: number;
    sitemapPages: number;
    pagesOutOfSitemap: number;
    pagesWithCta: number;
    pagesWithoutCta: number;
    pagesWithAlerts: number;
  };
  metrics30d: {
    pageViews: number;
    ctaClicks: number;
    smartClicks: number;
    proClicks: number;
    appClicks: number;
    totalAffiliateClicks: number;
    quizStarts: number;
    quizCompletes: number;
    calcUses: number;
    avgCtr: number;
  };
  metrics7d: {
    pageViews: number;
    smartClicks: number;
    proClicks: number;
    appClicks: number;
  };
  topPages: { path: string; clicks: number }[];
  recentEvents: { type: string; page: string; element: string | null; device: string | null; createdAt: string }[];
}

export default function AfiliadadosDashboardPage() {
  const [data, setData] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initing, setIniting] = useState(false);
  const [initMsg, setInitMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/afiliados/metricas")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleInit() {
    if (!confirm("Popular as tabelas com os dados do registry (links, páginas, CTAs)?")) return;
    setIniting(true);
    try {
      const r = await fetch("/api/admin/afiliados/init", { method: "POST" });
      const json = await r.json();
      setInitMsg(`✅ ${json.pages} páginas, ${json.links} links, ${json.ctasCreated} CTAs criados.`);
    } catch {
      setInitMsg("❌ Erro ao inicializar.");
    } finally {
      setIniting(false);
    }
  }

  const m30 = data?.metrics30d;
  const m7 = data?.metrics7d;
  const s = data?.summary;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F2]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-[#C6FF00]">
                Afiliados — Mercado Pago
              </h1>
              <p className="text-sm text-[#F5F5F2]/60 mt-1">
                Controle total da estratégia de monetização via maquininhas MEI
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleInit}
                disabled={initing}
                className="px-4 py-2 text-xs font-bold uppercase bg-[#F5F5F2]/10 hover:bg-[#F5F5F2]/20 border border-[#F5F5F2]/20 transition-colors disabled:opacity-50"
              >
                {initing ? "Inicializando..." : "Seed Inicial"}
              </button>
              <Link
                href="/painel-nb-2025/afiliados/paginas"
                className="px-4 py-2 text-xs font-bold uppercase bg-[#C6FF00] text-[#0A0A0A] hover:bg-[#d4ff33] transition-colors"
              >
                Ver Páginas
              </Link>
            </div>
          </div>
          {initMsg && (
            <p className="mt-3 text-sm text-[#C6FF00] border border-[#C6FF00]/30 px-3 py-2">
              {initMsg}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-[#F5F5F2]/50 text-sm">Carregando métricas...</p>
        ) : (
          <>
            {/* Métricas 30d */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F2]/50 mb-4">
                Últimos 30 dias
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Cliques afiliados" value={m30?.totalAffiliateClicks ?? 0} accent />
                <StatCard label="CTR médio" value={`${m30?.avgCtr ?? 0}%`} />
                <StatCard label="Point Smart 2" value={m30?.smartClicks ?? 0} />
                <StatCard label="Point Pro 3" value={m30?.proClicks ?? 0} />
                <StatCard label="App Mercado Pago" value={m30?.appClicks ?? 0} />
                <StatCard label="Quiz iniciados" value={m30?.quizStarts ?? 0} />
                <StatCard label="Quiz concluídos" value={m30?.quizCompletes ?? 0} />
                <StatCard label="Uso calculadora" value={m30?.calcUses ?? 0} />
              </div>
            </section>

            {/* Métricas 7d */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F2]/50 mb-4">
                Últimos 7 dias
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Smart 2 clicks" value={m7?.smartClicks ?? 0} />
                <StatCard label="Pro 3 clicks" value={m7?.proClicks ?? 0} />
                <StatCard label="App MP clicks" value={m7?.appClicks ?? 0} />
                <StatCard
                  label="Total afiliados 7d"
                  value={(m7?.smartClicks ?? 0) + (m7?.proClicks ?? 0) + (m7?.appClicks ?? 0)}
                  accent
                />
              </div>
            </section>

            {/* Resumo de páginas */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F2]/50 mb-4">
                Resumo do inventário de páginas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total páginas" value={s?.totalPages ?? 0} />
                <StatCard label="Publicadas" value={s?.publishedPages ?? 0} />
                <StatCard label="Com meta SEO" value={(s?.totalPages ?? 0) - (s?.pagesWithAlerts ?? 0)} />
                <StatCard
                  label="Alertas SEO"
                  value={s?.pagesWithAlerts ?? 0}
                  warn={(s?.pagesWithAlerts ?? 0) > 0}
                />
                <StatCard label="Com CTA" value={s?.pagesWithCta ?? 0} />
                <StatCard
                  label="Sem CTA"
                  value={s?.pagesWithoutCta ?? 0}
                  warn={(s?.pagesWithoutCta ?? 0) > 0}
                />
                <StatCard label="No sitemap" value={s?.sitemapPages ?? 0} />
                <StatCard
                  label="Fora do sitemap"
                  value={s?.pagesOutOfSitemap ?? 0}
                  warn={(s?.pagesOutOfSitemap ?? 0) > 0}
                />
              </div>
            </section>

            {/* Top pages */}
            {data?.topPages && data.topPages.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F2]/50 mb-4">
                  Top páginas por cliques afiliados (30d)
                </h2>
                <div className="border border-[#F5F5F2]/10">
                  {data.topPages.map((p, i) => (
                    <div
                      key={p.path}
                      className="flex items-center justify-between px-4 py-3 border-b border-[#F5F5F2]/10 last:border-0"
                    >
                      <span className="text-sm font-mono text-[#F5F5F2]/70">
                        <span className="text-[#F5F5F2]/30 mr-3">{i + 1}.</span>
                        {p.path}
                      </span>
                      <span className="text-sm font-bold text-[#C6FF00]">{p.clicks}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent events */}
            {data?.recentEvents && data.recentEvents.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F2]/50 mb-4">
                  Eventos recentes
                </h2>
                <div className="border border-[#F5F5F2]/10 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#F5F5F2]/10 text-[#F5F5F2]/40 text-left">
                        <th className="px-4 py-2 font-normal">Tipo</th>
                        <th className="px-4 py-2 font-normal">Página</th>
                        <th className="px-4 py-2 font-normal">Dispositivo</th>
                        <th className="px-4 py-2 font-normal">Quando</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentEvents.map((ev, i) => (
                        <tr
                          key={i}
                          className="border-b border-[#F5F5F2]/10 last:border-0 hover:bg-[#F5F5F2]/5"
                        >
                          <td className="px-4 py-2 font-mono text-[#C6FF00]">{ev.type}</td>
                          <td className="px-4 py-2 text-[#F5F5F2]/70">{ev.page}</td>
                          <td className="px-4 py-2 text-[#F5F5F2]/50">{ev.device ?? "—"}</td>
                          <td className="px-4 py-2 text-[#F5F5F2]/50">
                            {new Date(ev.createdAt).toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Quick links */}
            <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: "/painel-nb-2025/afiliados/paginas", label: "Páginas" },
                { href: "/painel-nb-2025/afiliados/links", label: "Links afiliados" },
                { href: "/painel-nb-2025/afiliados/ctas", label: "CTAs" },
                { href: "/painel-nb-2025/afiliados/search-console", label: "Search Console" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 border border-[#F5F5F2]/10 hover:border-[#C6FF00]/50 hover:text-[#C6FF00] transition-colors text-sm font-bold"
                >
                  {item.label}
                  <span className="text-[#F5F5F2]/30">→</span>
                </Link>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
  warn = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`border px-4 py-3 ${
        accent
          ? "border-[#C6FF00]/40 bg-[#C6FF00]/5"
          : warn
          ? "border-orange-500/40 bg-orange-500/5"
          : "border-[#F5F5F2]/10"
      }`}
    >
      <p className="text-xs text-[#F5F5F2]/50 mb-1">{label}</p>
      <p
        className={`text-2xl font-black ${
          accent ? "text-[#C6FF00]" : warn ? "text-orange-400" : "text-[#F5F5F2]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
