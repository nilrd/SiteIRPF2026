"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AffiliateLink {
  id: string;
  product: string;
  label: string;
  url: string;
  buttonText: string;
  description: string | null;
  active: boolean;
  priority: number;
  clickCount: number;
  clicks30d: number;
  lastClickAt: string | null;
}

const PRODUCT_LABELS: Record<string, string> = {
  "point-smart-2": "Point Smart 2",
  "point-pro-3": "Point Pro 3",
  "app-mercado-pago": "App Mercado Pago",
};

export default function AfiliadadosLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AffiliateLink>>({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadLinks() {
    setLoading(true);
    const r = await fetch("/api/admin/afiliados/links");
    const json = await r.json();
    setLinks(json.links ?? []);
    setLoading(false);
  }

  useEffect(() => { loadLinks(); }, []);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function startEdit(link: AffiliateLink) {
    setEditingId(link.id);
    setEditData({
      url: link.url,
      buttonText: link.buttonText,
      description: link.description ?? "",
      active: link.active,
      priority: link.priority,
      label: link.label,
    });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/afiliados/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData }),
      });
      if (r.ok) {
        setEditingId(null);
        await loadLinks();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F2]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#C6FF00]">
            Links Afiliados
          </h1>
          <p className="text-sm text-[#F5F5F2]/60 mt-1">
            URLs dos produtos Mercado Pago — edite e monitore cliques
          </p>
        </div>

        {loading ? (
          <p className="text-[#F5F5F2]/50 text-sm">Carregando...</p>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className={`border ${link.active ? "border-[#F5F5F2]/10" : "border-red-500/20 opacity-60"}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between px-4 py-4 gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-sm font-bold">
                        {PRODUCT_LABELS[link.product] ?? link.product}
                      </span>
                      {!link.active && (
                        <span className="text-[0.6rem] font-bold text-red-400 border border-red-400/40 px-2 py-0.5">
                          INATIVO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-[#C6FF00] bg-[#C6FF00]/10 px-2 py-1 font-mono break-all">
                        {link.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className="text-xs text-[#F5F5F2]/40 hover:text-[#F5F5F2] transition-colors shrink-0"
                      >
                        {copied === link.id ? "✅" : "📋"}
                      </button>
                    </div>
                    {link.description && (
                      <p className="text-xs text-[#F5F5F2]/50 mt-2">{link.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-4 text-xs text-[#F5F5F2]/60">
                      <span>
                        <span className="text-[#C6FF00] font-bold text-lg">{link.clicks30d}</span>{" "}
                        cliques 30d
                      </span>
                      <span>
                        <span className="text-[#F5F5F2] font-bold">{link.clickCount}</span> total
                      </span>
                    </div>
                    {link.lastClickAt && (
                      <span className="text-[0.6rem] text-[#F5F5F2]/30">
                        Último: {new Date(link.lastClickAt).toLocaleString("pt-BR")}
                      </span>
                    )}
                    <button
                      onClick={() =>
                        editingId === link.id ? setEditingId(null) : startEdit(link)
                      }
                      className="text-xs font-bold uppercase text-[#C6FF00] hover:text-[#d4ff33] transition-colors"
                    >
                      {editingId === link.id ? "Fechar" : "Editar"}
                    </button>
                  </div>
                </div>

                {/* Edit form */}
                {editingId === link.id && (
                  <div className="border-t border-[#F5F5F2]/10 px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        URL do link afiliado
                      </label>
                      <input
                        type="url"
                        value={editData.url ?? ""}
                        onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] font-mono focus:outline-none focus:border-[#C6FF00]"
                        placeholder="https://mpago.li/..."
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Texto do botão
                      </label>
                      <input
                        type="text"
                        value={editData.buttonText ?? ""}
                        onChange={(e) => setEditData({ ...editData, buttonText: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Label interno
                      </label>
                      <input
                        type="text"
                        value={editData.label ?? ""}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Descrição interna
                      </label>
                      <input
                        type="text"
                        value={editData.description ?? ""}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs text-[#F5F5F2]/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.active ?? true}
                          onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                          className="accent-[#C6FF00]"
                        />
                        Link ativo
                      </label>
                      <div>
                        <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 mr-2">
                          Prioridade
                        </label>
                        <input
                          type="number"
                          value={editData.priority ?? 0}
                          onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                          className="w-16 bg-[#111] border border-[#F5F5F2]/20 px-2 py-1 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                          min={0}
                          max={99}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={() => saveEdit(link.id)}
                        disabled={saving}
                        className="px-6 py-2 bg-[#C6FF00] text-[#0A0A0A] font-bold text-sm uppercase hover:bg-[#d4ff33] transition-colors disabled:opacity-50"
                      >
                        {saving ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors"
                      >
                        Cancelar
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors"
                      >
                        Testar link ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Warning */}
        <div className="mt-8 border border-orange-500/30 px-4 py-3 text-xs text-orange-400">
          ⚠ Todos os links de afiliado Mercado Pago devem ter{" "}
          <code>rel=&quot;sponsored noopener noreferrer&quot;</code> nos componentes.
        </div>
      </main>
    </div>
  );
}
