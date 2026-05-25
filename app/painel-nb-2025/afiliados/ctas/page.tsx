"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AffiliateCta {
  id: string;
  internalName: string;
  buttonText: string;
  description: string | null;
  product: string | null;
  destinationUrl: string;
  active: boolean;
  variant: string;
  position: string;
  impressions: number;
  clicks: number;
}

const VARIANT_LABELS: Record<string, string> = {
  inline: "Inline",
  footer: "Footer",
  quiz: "Quiz",
  sidebar: "Sidebar",
  popup: "Popup",
};

const PRODUCT_LABELS: Record<string, string> = {
  "point-smart-2": "Point Smart 2",
  "point-pro-3": "Point Pro 3",
  "app-mercado-pago": "App Mercado Pago",
};

const PRODUCT_COLORS: Record<string, string> = {
  "point-smart-2": "text-blue-400",
  "point-pro-3": "text-purple-400",
  "app-mercado-pago": "text-green-400",
};

export default function AfiliadadosCtasPage() {
  const [ctas, setCtas] = useState<AffiliateCta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AffiliateCta>>({});
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({
    internalName: "",
    buttonText: "",
    description: "",
    product: "",
    destinationUrl: "",
    variant: "inline",
    position: "meio",
  });
  const [creating, setCreating] = useState(false);

  async function loadCtas() {
    setLoading(true);
    const r = await fetch("/api/admin/afiliados/ctas");
    const json = await r.json();
    setCtas(json.ctas ?? []);
    setLoading(false);
  }

  useEffect(() => { loadCtas(); }, []);

  function startEdit(cta: AffiliateCta) {
    setEditingId(cta.id);
    setEditData({ ...cta });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/afiliados/ctas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData }),
      });
      if (r.ok) {
        setEditingId(null);
        await loadCtas();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(cta: AffiliateCta) {
    await fetch("/api/admin/afiliados/ctas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cta.id, active: !cta.active }),
    });
    await loadCtas();
  }

  async function createCta() {
    if (!newData.internalName || !newData.buttonText || !newData.destinationUrl) return;
    setCreating(true);
    try {
      const r = await fetch("/api/admin/afiliados/ctas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (r.ok) {
        setShowNew(false);
        setNewData({ internalName: "", buttonText: "", description: "", product: "", destinationUrl: "", variant: "inline", position: "meio" });
        await loadCtas();
      }
    } finally {
      setCreating(false);
    }
  }

  const grouped: Record<string, AffiliateCta[]> = {};
  for (const cta of ctas) {
    const key = cta.product ?? "geral";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(cta);
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F2]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#C6FF00]">
              CTAs Afiliados
            </h1>
            <p className="text-sm text-[#F5F5F2]/60 mt-1">
              Gerencie os botões de call-to-action por produto e posição
            </p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="px-4 py-2 text-sm font-bold uppercase bg-[#C6FF00] text-[#0A0A0A] hover:bg-[#d4ff33] transition-colors"
          >
            + Novo CTA
          </button>
        </div>

        {/* New CTA form */}
        {showNew && (
          <div className="border border-[#C6FF00]/30 px-4 py-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-sm font-bold uppercase text-[#C6FF00] mb-3">Novo CTA</h2>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Nome Interno *</label>
              <input type="text" value={newData.internalName} onChange={(e) => setNewData({ ...newData, internalName: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" placeholder="ex: point-smart-2-sidebar" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Texto do Botão *</label>
              <input type="text" value={newData.buttonText} onChange={(e) => setNewData({ ...newData, buttonText: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" placeholder="ex: Ver condições da Point Smart 2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">URL de Destino * (link afiliado)</label>
              <input type="url" value={newData.destinationUrl} onChange={(e) => setNewData({ ...newData, destinationUrl: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] font-mono focus:outline-none focus:border-[#C6FF00]" placeholder="https://mpago.li/..." />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Produto</label>
              <select value={newData.product} onChange={(e) => setNewData({ ...newData, product: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]">
                <option value="">— geral —</option>
                <option value="point-smart-2">Point Smart 2</option>
                <option value="point-pro-3">Point Pro 3</option>
                <option value="app-mercado-pago">App Mercado Pago</option>
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Variante</label>
              <select value={newData.variant} onChange={(e) => setNewData({ ...newData, variant: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]">
                <option value="inline">Inline</option>
                <option value="footer">Footer</option>
                <option value="quiz">Quiz</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Descrição interna</label>
              <input type="text" value={newData.description} onChange={(e) => setNewData({ ...newData, description: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" placeholder="Para uso interno" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button onClick={createCta} disabled={creating || !newData.internalName || !newData.buttonText || !newData.destinationUrl} className="px-6 py-2 bg-[#C6FF00] text-[#0A0A0A] font-bold text-sm uppercase hover:bg-[#d4ff33] transition-colors disabled:opacity-50">
                {creating ? "Criando..." : "Criar CTA"}
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors">Cancelar</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-[#F5F5F2]/50 text-sm">Carregando...</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([product, productCtas]) => (
              <div key={product}>
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${PRODUCT_COLORS[product] ?? "text-[#F5F5F2]/50"}`}>
                  {PRODUCT_LABELS[product] ?? "Geral"}
                  <span className="text-[#F5F5F2]/30 ml-2">({productCtas.length})</span>
                </h2>
                <div className="space-y-2">
                  {productCtas.map((cta) => (
                    <div
                      key={cta.id}
                      className={`border ${cta.active ? "border-[#F5F5F2]/10" : "border-[#F5F5F2]/5 opacity-50"}`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[0.6rem] font-bold bg-[#F5F5F2]/10 px-2 py-0.5 uppercase">
                              {VARIANT_LABELS[cta.variant] ?? cta.variant}
                            </span>
                            <span className="text-[0.6rem] text-[#F5F5F2]/40">{cta.position}</span>
                            {!cta.active && (
                              <span className="text-[0.6rem] font-bold text-red-400 border border-red-400/40 px-2 py-0.5">INATIVO</span>
                            )}
                          </div>
                          <p className="text-sm font-bold">{cta.buttonText}</p>
                          <p className="text-xs text-[#F5F5F2]/40 font-mono">{cta.internalName}</p>
                          {cta.description && (
                            <p className="text-xs text-[#F5F5F2]/40 mt-1">{cta.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-xs">
                          <span className="text-[#F5F5F2]/50">
                            <span className="text-[#C6FF00] font-bold">{cta.clicks}</span> cliques
                          </span>
                          <button
                            onClick={() => toggleActive(cta)}
                            className={`text-[0.6rem] font-bold uppercase px-2 py-1 border transition-colors ${
                              cta.active
                                ? "border-red-400/40 text-red-400 hover:bg-red-400/10"
                                : "border-green-400/40 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {cta.active ? "Desativar" : "Ativar"}
                          </button>
                          <button
                            onClick={() => editingId === cta.id ? setEditingId(null) : startEdit(cta)}
                            className="text-xs font-bold uppercase text-[#C6FF00] hover:text-[#d4ff33] transition-colors"
                          >
                            {editingId === cta.id ? "Fechar" : "Editar"}
                          </button>
                        </div>
                      </div>

                      {/* Edit form */}
                      {editingId === cta.id && (
                        <div className="border-t border-[#F5F5F2]/10 px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Texto do Botão</label>
                            <input type="text" value={editData.buttonText ?? ""} onChange={(e) => setEditData({ ...editData, buttonText: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]" />
                          </div>
                          <div>
                            <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">Variante</label>
                            <select value={editData.variant ?? "inline"} onChange={(e) => setEditData({ ...editData, variant: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]">
                              <option value="inline">Inline</option>
                              <option value="footer">Footer</option>
                              <option value="quiz">Quiz</option>
                              <option value="sidebar">Sidebar</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">URL de Destino</label>
                            <input type="url" value={editData.destinationUrl ?? ""} onChange={(e) => setEditData({ ...editData, destinationUrl: e.target.value })} className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] font-mono focus:outline-none focus:border-[#C6FF00]" />
                          </div>
                          <div className="md:col-span-2 flex gap-3">
                            <button onClick={() => saveEdit(cta.id)} disabled={saving} className="px-6 py-2 bg-[#C6FF00] text-[#0A0A0A] font-bold text-sm uppercase hover:bg-[#d4ff33] transition-colors disabled:opacity-50">
                              {saving ? "Salvando..." : "Salvar"}
                            </button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors">Cancelar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
