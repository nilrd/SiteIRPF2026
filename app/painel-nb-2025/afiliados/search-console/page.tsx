"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface ScEntry {
  id: string;
  pagePath: string;
  targetKeyword: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  lastUpdated: string;
  notes: string | null;
}

export default function AfiliadadosSearchConsolePage() {
  const [entries, setEntries] = useState<ScEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pagePath: "",
    targetKeyword: "",
    impressions: "",
    clicks: "",
    ctr: "",
    avgPosition: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function loadEntries() {
    setLoading(true);
    const r = await fetch("/api/admin/afiliados/search-console");
    const json = await r.json();
    setEntries(json.entries ?? []);
    setLoading(false);
  }

  useEffect(() => { loadEntries(); }, []);

  async function handleSave() {
    if (!formData.pagePath) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/afiliados/search-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagePath: formData.pagePath,
          targetKeyword: formData.targetKeyword || null,
          impressions: parseInt(formData.impressions) || 0,
          clicks: parseInt(formData.clicks) || 0,
          ctr: parseFloat(formData.ctr) || 0,
          avgPosition: parseFloat(formData.avgPosition) || 0,
          notes: formData.notes || undefined,
        }),
      });
      if (r.ok) {
        setMsg("✅ Salvo com sucesso");
        setShowForm(false);
        setFormData({ pagePath: "", targetKeyword: "", impressions: "", clicks: "", ctr: "", avgPosition: "", notes: "" });
        await loadEntries();
        setTimeout(() => setMsg(""), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  // Sort by clicks desc
  const sorted = [...entries].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F2]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#C6FF00]">
              Search Console
            </h1>
            <p className="text-sm text-[#F5F5F2]/60 mt-1">
              Dados manuais do Google Search Console para páginas afiliadas
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-bold uppercase bg-[#C6FF00] text-[#0A0A0A] hover:bg-[#d4ff33] transition-colors"
          >
            + Inserir dados
          </button>
        </div>

        {msg && (
          <p className="mb-4 text-sm text-[#C6FF00] border border-[#C6FF00]/30 px-3 py-2">{msg}</p>
        )}

        {/* Form */}
        {showForm && (
          <div className="border border-[#C6FF00]/30 px-4 py-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-4">
              <h2 className="text-sm font-bold uppercase text-[#C6FF00] mb-3">Inserir / Atualizar Dados GSC</h2>
              <p className="text-xs text-[#F5F5F2]/50 mb-3">
                Se a combinação pagePath + targetKeyword já existir, os dados serão atualizados.
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Caminho da Página *</label>
              <input
                type="text"
                value={formData.pagePath}
                onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] font-mono focus:outline-none focus:border-[#C6FF00]"
                placeholder="/mei/maquininha-para-mei"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Keyword principal</label>
              <input
                type="text"
                value={formData.targetKeyword}
                onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
                className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                placeholder="maquininha para mei"
              />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Impressões</label>
              <input type="number" value={formData.impressions} onChange={(e) => setFormData({ ...formData, impressions: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" min={0} />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Cliques</label>
              <input type="number" value={formData.clicks} onChange={(e) => setFormData({ ...formData, clicks: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" min={0} />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">CTR (%)</label>
              <input type="number" step="0.01" value={formData.ctr} onChange={(e) => setFormData({ ...formData, ctr: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" min={0} max={100} />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Posição Média</label>
              <input type="number" step="0.1" value={formData.avgPosition} onChange={(e) => setFormData({ ...formData, avgPosition: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" min={0} />
            </div>
            <div className="col-span-2 md:col-span-4">
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Notas</label>
              <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" placeholder="Observações (opcional)" />
            </div>
            <div className="col-span-2 md:col-span-4 flex gap-3">
              <button onClick={handleSave} disabled={saving || !formData.pagePath} className="px-6 py-2 bg-[#C6FF00] text-[#0A0A0A] font-bold text-sm uppercase hover:bg-[#d4ff33] transition-colors disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors">Cancelar</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-[#F5F5F2]/50 text-sm">Carregando...</p>
        ) : sorted.length === 0 ? (
          <div className="border border-[#F5F5F2]/10 px-6 py-8 text-center">
            <p className="text-[#F5F5F2]/50 text-sm mb-2">Nenhum dado inserido ainda.</p>
            <p className="text-xs text-[#F5F5F2]/30">
              Acesse o Google Search Console, exporte dados das páginas MEI e insira acima.
            </p>
          </div>
        ) : (
          <div className="border border-[#F5F5F2]/10 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F5F2]/10 text-[#F5F5F2]/40 text-left">
                  <th className="px-4 py-3 font-normal text-xs">Página</th>
                  <th className="px-4 py-3 font-normal text-xs">Keyword</th>
                  <th className="px-4 py-3 font-normal text-xs text-right">Impressões</th>
                  <th className="px-4 py-3 font-normal text-xs text-right">Cliques</th>
                  <th className="px-4 py-3 font-normal text-xs text-right">CTR</th>
                  <th className="px-4 py-3 font-normal text-xs text-right">Posição</th>
                  <th className="px-4 py-3 font-normal text-xs">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#F5F5F2]/5 last:border-0 hover:bg-[#F5F5F2]/5"
                  >
                    <td className="px-4 py-3 font-mono text-[#C6FF00] text-xs">{entry.pagePath}</td>
                    <td className="px-4 py-3 text-xs text-[#F5F5F2]/70">{entry.targetKeyword ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{entry.impressions.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right font-bold">{entry.clicks.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right text-[#C6FF00]">{entry.ctr.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right text-[#F5F5F2]/70">{entry.avgPosition.toFixed(1)}</td>
                    <td className="px-4 py-3 text-xs text-[#F5F5F2]/40">
                      {new Date(entry.lastUpdated).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 border border-[#F5F5F2]/10 px-4 py-3 text-xs text-[#F5F5F2]/50">
          <strong className="text-[#F5F5F2]/70">Como usar:</strong> No{" "}
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#C6FF00] hover:underline">Google Search Console</a>,
          acesse Desempenho → filtre pelas páginas <code>/mei/*</code> → exporte e insira os dados aqui semanalmente.
        </div>
      </main>
    </div>
  );
}
