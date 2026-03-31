"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

type PostForm = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  imageAlt: string;
  tags: string;
  keywords: string;
  metaTitle: string;
  metaDesc: string;
  readTime: number;
  published: boolean;
};

const EMPTY: PostForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  imageAlt: "",
  tags: "",
  keywords: "",
  metaTitle: "",
  metaDesc: "",
  readTime: 5,
  published: false,
};

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<PostForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixIssue, setFixIssue] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "settings">("content");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar post");
        const { post } = await res.json();
        setForm({
          title: post.title ?? "",
          slug: post.slug ?? "",
          summary: post.summary ?? "",
          content: post.content ?? "",
          coverImage: post.coverImage ?? "",
          imageAlt: post.imageAlt ?? "",
          tags: (post.tags ?? []).join(", "),
          keywords: (post.keywords ?? []).join(", "),
          metaTitle: post.metaTitle ?? "",
          metaDesc: post.metaDesc ?? "",
          readTime: post.readTime ?? 5,
          published: post.published ?? false,
        });
      } catch {
        setMsg({ text: "Erro ao carregar post.", ok: false });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function set(field: keyof PostForm, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload(source: PostForm, forcePublished?: boolean) {
    return {
      title: source.title.trim(),
      slug: source.slug.trim(),
      summary: source.summary.trim() || null,
      content: source.content,
      coverImage: source.coverImage.trim() || null,
      imageAlt: source.imageAlt.trim(),
      tags: source.tags.split(",").map((t) => t.trim()).filter(Boolean),
      keywords: source.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      metaTitle: source.metaTitle.trim() || null,
      metaDesc: source.metaDesc.trim() || null,
      readTime: Number(source.readTime),
      published: typeof forcePublished === "boolean" ? forcePublished : source.published,
    };
  }

  async function patchPost(payload: ReturnType<typeof buildPayload>) {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao salvar");
  }

  type CorrectedDraft = {
    title?: string;
    summary?: string;
    content?: string;
    tags?: string[];
    keywords?: string[];
    metaTitle?: string;
    metaDesc?: string;
    readTime?: number;
    imageAlt?: string;
  };

  function mergeCorrectedDraft(corrected: CorrectedDraft): PostForm {
    return {
      ...form,
      title: corrected.title ?? form.title,
      summary: corrected.summary ?? form.summary,
      content: corrected.content ?? form.content,
      tags: Array.isArray(corrected.tags) ? corrected.tags.join(", ") : form.tags,
      keywords: Array.isArray(corrected.keywords) ? corrected.keywords.join(", ") : form.keywords,
      metaTitle: corrected.metaTitle ?? form.metaTitle,
      metaDesc: corrected.metaDesc ?? form.metaDesc,
      readTime: Number.isFinite(Number(corrected.readTime)) ? Number(corrected.readTime) : form.readTime,
      imageAlt: corrected.imageAlt ?? form.imageAlt,
    };
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      await patchPost(buildPayload(form));
      setMsg({ text: "Post salvo com sucesso!", ok: true });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ text: "Erro ao salvar post.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleFixWithAI() {
    if (!fixIssue.trim()) {
      setMsg({ text: "Descreva primeiro o que está errado no post.", ok: false });
      return;
    }

    setFixing(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/blog/${id}/fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: fixIssue.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data?.corrected) {
        throw new Error(data?.error || "Falha ao corrigir");
      }

      setForm(mergeCorrectedDraft(data.corrected));

      setMsg({ text: `Rascunho corrigido com IA (${data.model || "modelo"}). Revise e clique em Salvar.`, ok: true });
      setTimeout(() => setMsg(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao corrigir com IA.";
      setMsg({ text: message, ok: false });
    } finally {
      setFixing(false);
    }
  }

  async function handleFixAndSave(shouldPublish: boolean) {
    if (!fixIssue.trim()) {
      setMsg({ text: "Descreva primeiro o que está errado no post.", ok: false });
      return;
    }

    setFixing(true);
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/blog/${id}/fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: fixIssue.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.corrected) {
        throw new Error(data?.error || "Falha ao corrigir");
      }

      const nextForm = mergeCorrectedDraft(data.corrected);
      setForm({ ...nextForm, published: shouldPublish ? true : nextForm.published });

      await patchPost(buildPayload(nextForm, shouldPublish ? true : undefined));

      if (shouldPublish) {
        setMsg({ text: `Post corrigido, salvo e publicado com IA (${data.model || "modelo"}).`, ok: true });
      } else {
        setMsg({ text: `Post corrigido e salvo com IA (${data.model || "modelo"}).`, ok: true });
      }
      setTimeout(() => setMsg(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao corrigir e salvar.";
      setMsg({ text: message, ok: false });
    } finally {
      setFixing(false);
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-white transition text-white placeholder:text-white/30 text-sm";
  const labelClass = "block text-[10px] uppercase tracking-widest opacity-50 mb-1";
  const tabClass = (active: boolean) =>
    `px-4 py-2 text-xs uppercase tracking-widest transition border-b-2 ${
      active ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"
    }`;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/painel-nb-2025/blog"
              className="text-xs opacity-40 hover:opacity-100 transition"
            >
              ← Blog
            </Link>
            <h1 className="font-serif text-2xl">Editar Post</h1>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <span className="opacity-50">Rascunho</span>
              <button
                onClick={() => set("published", !form.published)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  form.published ? "bg-green-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    form.published ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className={form.published ? "text-green-400" : "opacity-50"}>
                {form.published ? "Publicado" : "Despublicado"}
              </span>
            </label>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-white text-black px-6 py-2 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`mb-6 p-3 border text-sm ${
              msg.ok
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            {msg.text}
          </div>
        )}

        {loading ? (
          <p className="opacity-40 text-sm">Carregando post...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left column — main content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex gap-0 border-b border-white/10 mb-6">
                <button className={tabClass(activeTab === "content")} onClick={() => setActiveTab("content")}>Conteúdo</button>
                <button className={tabClass(activeTab === "seo")} onClick={() => setActiveTab("seo")}>SEO</button>
                <button className={tabClass(activeTab === "settings")} onClick={() => setActiveTab("settings")}>Configurações</button>
              </div>

              {activeTab === "content" && (
                <div className="space-y-6">
                  <div className="border border-white/10 bg-white/[0.02] p-4">
                    <label className={labelClass}>Corrigir post com IA</label>
                    <textarea
                      value={fixIssue}
                      onChange={(e) => setFixIssue(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border border-white/15 p-3 outline-none focus:border-white/40 transition text-white text-sm resize-y"
                      placeholder="Ex: O artigo está em inglês e sem foco em deduções de saúde e educação no IRPF 2026. Corrigir para pt-BR e reforçar regras oficiais."
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] opacity-40">
                        A IA aplica as correções no formulário atual. Nada é publicado automaticamente.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleFixWithAI}
                          disabled={fixing || loading || saving}
                          className="bg-yellow-300 text-black px-3 py-2 uppercase text-[10px] tracking-widest font-bold hover:bg-yellow-200 transition disabled:opacity-50"
                        >
                          {fixing ? "Corrigindo..." : "Corrigir com IA"}
                        </button>
                        <button
                          onClick={() => handleFixAndSave(false)}
                          disabled={fixing || loading || saving}
                          className="bg-white text-black px-3 py-2 uppercase text-[10px] tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
                        >
                          Corrigir e Salvar
                        </button>
                        <button
                          onClick={() => handleFixAndSave(true)}
                          disabled={fixing || loading || saving}
                          className="bg-green-400 text-black px-3 py-2 uppercase text-[10px] tracking-widest font-bold hover:bg-green-300 transition disabled:opacity-50"
                        >
                          Corrigir e Publicar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Título</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      className={inputClass}
                      placeholder="Título do artigo"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Resumo / Subtítulo</label>
                    <textarea
                      value={form.summary}
                      onChange={(e) => set("summary", e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Breve descrição exibida na listagem do blog"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Conteúdo (HTML)</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => set("content", e.target.value)}
                      rows={28}
                      className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-white/40 transition text-white text-sm font-mono resize-y"
                      placeholder="<p>Conteúdo do artigo em HTML...</p>"
                      spellCheck={false}
                    />
                    <p className="text-[10px] opacity-30 mt-1">
                      {form.content.length.toLocaleString()} caracteres
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Meta Título (para Google)</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => set("metaTitle", e.target.value)}
                      className={inputClass}
                      placeholder={form.title || "Título para o Google (max 60 chars)"}
                      maxLength={70}
                    />
                    <p className="text-[10px] opacity-30 mt-1">{form.metaTitle.length}/70 caracteres</p>
                  </div>
                  <div>
                    <label className={labelClass}>Meta Descrição</label>
                    <textarea
                      value={form.metaDesc}
                      onChange={(e) => set("metaDesc", e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Descrição para snippet do Google (max 160 chars)"
                      maxLength={170}
                    />
                    <p className="text-[10px] opacity-30 mt-1">{form.metaDesc.length}/170 caracteres</p>
                  </div>
                  <div>
                    <label className={labelClass}>Keywords (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={form.keywords}
                      onChange={(e) => set("keywords", e.target.value)}
                      className={inputClass}
                      placeholder="IRPF 2026, declaração imposto de renda, restituição IR"
                    />
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Slug (URL)</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className={inputClass}
                      placeholder="url-do-artigo"
                    />
                    <p className="text-[10px] opacity-30 mt-1">
                      irpf.qaplay.com.br/blog/{form.slug || "slug"}
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => set("tags", e.target.value)}
                      className={inputClass}
                      placeholder="IRPF 2026, Deduções, Malha Fina"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tempo de leitura (minutos)</label>
                    <input
                      type="number"
                      value={form.readTime}
                      onChange={(e) => set("readTime", parseInt(e.target.value) || 5)}
                      className={`${inputClass} w-24`}
                      min={1}
                      max={60}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right column — image + preview */}
            <div className="space-y-6">
              <div>
                <label className={labelClass}>URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => set("coverImage", e.target.value)}
                  className={inputClass}
                  placeholder="https://images.unsplash.com/..."
                />
                {form.coverImage && (
                  <div className="mt-3 aspect-video bg-white/5 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.coverImage}
                      alt="Preview da capa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Alt da Imagem (SEO)</label>
                <input
                  type="text"
                  value={form.imageAlt}
                  onChange={(e) => set("imageAlt", e.target.value)}
                  className={inputClass}
                  placeholder="Profissional calculando imposto de renda 2026"
                  maxLength={120}
                />
                <p className="text-[10px] opacity-30 mt-1">
                  Auto-gerado pelo Groq ao trocar a imagem · {form.imageAlt.length}/120 chars
                </p>
              </div>

              {/* Card preview */}
              <div className="border border-white/10 p-4">
                <p className="text-[10px] uppercase tracking-widest opacity-30 mb-3">Preview do card</p>
                <div className="space-y-1">
                  {form.tags && (
                    <p className="text-[10px] uppercase tracking-widest text-yellow-400/70">
                      {form.tags.split(",")[0]?.trim()}
                    </p>
                  )}
                  <p className="font-serif text-sm leading-tight">{form.title || "Título do artigo"}</p>
                  {form.summary && (
                    <p className="text-xs opacity-40 leading-relaxed line-clamp-2">{form.summary}</p>
                  )}
                  <p className="text-[10px] opacity-30">{form.readTime} min de leitura</p>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                {form.slug && (
                  <a
                    href={`/blog/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs opacity-40 hover:opacity-100 transition"
                  >
                    Ver post no site →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
