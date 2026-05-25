"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AffiliatePage {
  id: string;
  slug: string;
  path: string;
  title: string;
  pageType: string;
  status: string;
  indexable: boolean;
  inSitemap: boolean;
  allowRelated: boolean;
  mainProduct: string | null;
  mainCta: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  targetKeyword: string | null;
  notes: string | null;
  metrics: {
    views: number;
    totalAffiliateClicks: number;
    smartClicks: number;
    proClicks: number;
    appClicks: number;
    quizStarts: number;
    quizCompletes: number;
    calcUses: number;
    ctr: number;
    lastClickAt: string | null;
  };
  seoAlerts: string[];
}

const PAGE_TYPE_LABELS: Record<string, string> = {
  hub: "HUB",
  artigo: "ARTIGO",
  produto: "PRODUTO",
  segmento: "SEGMENTO",
  "duvida-fiscal": "FISCAL",
  comparativo: "COMPARATIVO",
};

const PRODUCT_COLORS: Record<string, string> = {
  "point-smart-2": "text-blue-400",
  "point-pro-3": "text-purple-400",
  "app-mercado-pago": "text-green-400",
};

export default function AfiliadadosPaginasPage() {
  const [pages, setPages] = useState<AffiliatePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState("todos");
  const [filterType, setFilterType] = useState("todos");
  const [filterAlerts, setFilterAlerts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AffiliatePage>>({});
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "clicks" | "ctr">("clicks");

  async function loadPages() {
    setLoading(true);
    const r = await fetch("/api/admin/afiliados/paginas");
    const json = await r.json();
    setPages(json.pages ?? []);
    setLoading(false);
  }

  useEffect(() => { loadPages(); }, []);

  function startEdit(page: AffiliatePage) {
    setEditingId(page.id);
    setEditData({
      status: page.status,
      indexable: page.indexable,
      inSitemap: page.inSitemap,
      mainProduct: page.mainProduct ?? "",
      mainCta: page.mainCta ?? "",
      metaTitle: page.metaTitle ?? "",
      metaDesc: page.metaDesc ?? "",
      targetKeyword: page.targetKeyword ?? "",
      notes: page.notes ?? "",
    });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const r = await fetch("/api/admin/afiliados/paginas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData }),
      });
      if (r.ok) {
        setEditingId(null);
        await loadPages();
      }
    } finally {
      setSaving(false);
    }
  }

  const filtered = pages
    .filter((p) => filterProduct === "todos" || p.mainProduct === filterProduct)
    .filter((p) => filterType === "todos" || p.pageType === filterType)
    .filter((p) => !filterAlerts || p.seoAlerts.length > 0)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "clicks") return b.metrics.totalAffiliateClicks - a.metrics.totalAffiliateClicks;
      if (sortBy === "ctr") return b.metrics.ctr - a.metrics.ctr;
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F2]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#C6FF00]">
            Páginas Afiliadas
          </h1>
          <p className="text-sm text-[#F5F5F2]/60 mt-1">
            {pages.length} páginas registradas — edite SEO, status e produto-alvo
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
          >
            <option value="todos">Todos os produtos</option>
            <option value="point-smart-2">Point Smart 2</option>
            <option value="point-pro-3">Point Pro 3</option>
            <option value="app-mercado-pago">App Mercado Pago</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
          >
            <option value="todos">Todos os tipos</option>
            <option value="hub">Hub</option>
            <option value="artigo">Artigo</option>
            <option value="produto">Produto</option>
            <option value="segmento">Segmento</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "title" | "clicks" | "ctr")}
            className="bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
          >
            <option value="clicks">Ordenar: Cliques</option>
            <option value="ctr">Ordenar: CTR</option>
            <option value="title">Ordenar: Título</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-[#F5F5F2]/70 cursor-pointer">
            <input
              type="checkbox"
              checked={filterAlerts}
              onChange={(e) => setFilterAlerts(e.target.checked)}
              className="accent-[#C6FF00]"
            />
            Apenas com alertas SEO
          </label>
        </div>

        {loading ? (
          <p className="text-[#F5F5F2]/50 text-sm">Carregando...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((page) => (
              <div
                key={page.id}
                className="border border-[#F5F5F2]/10 hover:border-[#F5F5F2]/20 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-start justify-between px-4 py-3 gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[0.6rem] font-bold bg-[#F5F5F2]/10 px-2 py-0.5">
                        {PAGE_TYPE_LABELS[page.pageType] ?? page.pageType}
                      </span>
                      {page.mainProduct && (
                        <span className={`text-[0.6rem] font-bold ${PRODUCT_COLORS[page.mainProduct] ?? ""}`}>
                          {page.mainProduct}
                        </span>
                      )}
                      {page.seoAlerts.length > 0 && (
                        <span className="text-[0.6rem] font-bold text-orange-400 border border-orange-400/40 px-2 py-0.5">
                          {page.seoAlerts.length} alerta(s) SEO
                        </span>
                      )}
                      {!page.indexable && (
                        <span className="text-[0.6rem] font-bold text-red-400 border border-red-400/40 px-2 py-0.5">
                          NOINDEX
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold truncate">{page.title}</p>
                    <p className="text-xs text-[#F5F5F2]/40 font-mono">{page.path}</p>
                  </div>

                  {/* Métricas inline */}
                  <div className="flex items-center gap-4 text-xs text-[#F5F5F2]/60 shrink-0">
                    <span>
                      <span className="text-[#C6FF00] font-bold">{page.metrics.totalAffiliateClicks}</span>{" "}
                      cliques
                    </span>
                    <span>CTR {page.metrics.ctr}%</span>
                    <button
                      onClick={() =>
                        editingId === page.id ? setEditingId(null) : startEdit(page)
                      }
                      className="text-xs font-bold uppercase text-[#C6FF00] hover:text-[#d4ff33] transition-colors"
                    >
                      {editingId === page.id ? "Fechar" : "Editar"}
                    </button>
                  </div>
                </div>

                {/* SEO alerts */}
                {page.seoAlerts.length > 0 && editingId !== page.id && (
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-1">
                      {page.seoAlerts.map((a) => (
                        <span key={a} className="text-[0.6rem] bg-orange-500/10 text-orange-400 px-2 py-0.5">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {editingId === page.id && (
                  <div className="border-t border-[#F5F5F2]/10 px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={editData.metaTitle ?? ""}
                        onChange={(e) => setEditData({ ...editData, metaTitle: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                        placeholder="Meta title SEO (60 chars)"
                        maxLength={70}
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Keyword Alvo
                      </label>
                      <input
                        type="text"
                        value={editData.targetKeyword ?? ""}
                        onChange={(e) => setEditData({ ...editData, targetKeyword: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                        placeholder="keyword principal"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Meta Description
                      </label>
                      <textarea
                        value={editData.metaDesc ?? ""}
                        onChange={(e) => setEditData({ ...editData, metaDesc: e.target.value })}
                        rows={2}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00] resize-none"
                        placeholder="Meta description (155 chars)"
                        maxLength={165}
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Produto Principal
                      </label>
                      <select
                        value={editData.mainProduct ?? ""}
                        onChange={(e) => setEditData({ ...editData, mainProduct: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                      >
                        <option value="">— sem produto —</option>
                        <option value="point-smart-2">Point Smart 2</option>
                        <option value="point-pro-3">Point Pro 3</option>
                        <option value="app-mercado-pago">App Mercado Pago</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Texto CTA Principal
                      </label>
                      <input
                        type="text"
                        value={editData.mainCta ?? ""}
                        onChange={(e) => setEditData({ ...editData, mainCta: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                        placeholder="Texto do botão CTA"
                      />
                    </div>
                    <div className="flex items-center gap-6 md:col-span-2">
                      <label className="flex items-center gap-2 text-xs text-[#F5F5F2]/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.indexable ?? true}
                          onChange={(e) => setEditData({ ...editData, indexable: e.target.checked })}
                          className="accent-[#C6FF00]"
                        />
                        Indexável (noindex se desmarcado)
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#F5F5F2]/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.inSitemap ?? true}
                          onChange={(e) => setEditData({ ...editData, inSitemap: e.target.checked })}
                          className="accent-[#C6FF00]"
                        />
                        No sitemap
                      </label>
                      <select
                        value={editData.status ?? "publicado"}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-xs text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                      >
                        <option value="publicado">Publicado</option>
                        <option value="rascunho">Rascunho</option>
                        <option value="pausado">Pausado</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[0.6rem] uppercase tracking-widest text-[#F5F5F2]/40 block mb-1">
                        Notas internas
                      </label>
                      <input
                        type="text"
                        value={editData.notes ?? ""}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        className="w-full bg-[#111] border border-[#F5F5F2]/20 px-3 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#C6FF00]"
                        placeholder="Notas internas (não publicadas)"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={() => saveEdit(page.id)}
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
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-[#F5F5F2]/20 text-sm hover:border-[#F5F5F2]/40 transition-colors"
                      >
                        Ver página ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
