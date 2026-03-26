"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  published: boolean;
  views: number;
  readTime: number;
  tags: string[];
  createdAt: string;
  reviewJson: string;
};

function BlogAdminContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loading, setLoading]       = useState(true);
  const [keyword, setKeyword]       = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult]   = useState<{ title: string; slug: string } | null>(null);
  const [actionMsg, setActionMsg]   = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null); // postId em geração

  // Ler keyword/titulo da URL (link vindo do analisador)
  useEffect(() => {
    const kw = searchParams.get("keyword") || searchParams.get("titulo") || "";
    if (kw) setKeyword(kw);
  }, [searchParams]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleGenerate() {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setGenResult(data.post);
        setKeyword("");
        if (data.pending) {
          setActionMsg("Post gerado mas RETIDO para revisão — acesse o rascunho abaixo para verificar e publicar.");
        } else {
          setActionMsg("Post gerado e publicado automaticamente no site.");
        }
        setTimeout(() => setActionMsg(null), 6000);
        await fetchPosts();
      }
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  }

  async function togglePublish(id: string, current: boolean) {
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
      );
      setActionMsg(current ? "Post despublicado." : "Post publicado!");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Erro ao atualizar post.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Deletar "${title}"? Essa acao nao pode ser desfeita.`)) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("Post deletado.");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Erro ao deletar post.");
    }
  }

  async function handleGenerateImage(postId: string) {
    setGeneratingImage(postId);
    try {
      const res = await fetch("/api/admin/blog/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setActionMsg(`✅ Imagem IA gerada e salva no post!`);
      } else {
        setActionMsg(`❌ Erro: ${data.error || "falha ao gerar imagem"}`);
      }
      setTimeout(() => setActionMsg(null), 5000);
    } catch {
      setActionMsg("❌ Erro de conexão ao gerar imagem.");
      setTimeout(() => setActionMsg(null), 5000);
    } finally {
      setGeneratingImage(null);
    }
  }

  const published = posts.filter((p) => p.published).length;
  const drafts    = posts.filter((p) => !p.published).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Blog Manager</h1>
          <div className="flex gap-4 text-xs uppercase tracking-widest opacity-50">
            <span>{published} publicados</span>
            <span>{drafts} rascunhos</span>
          </div>
        </div>

        {actionMsg && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-sm text-green-300">
            {actionMsg}
          </div>
        )}

        {/* Generate section */}
        <div className="border border-white/10 p-6 mb-10">
          <h2 className="font-serif text-xl mb-4">Gerar Post com IA (Groq)</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Tema opcional (vazio = IA escolhe assunto atual da internet)"
              className="flex-1 bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition text-white placeholder:text-white/30"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-white text-black px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50 shrink-0"
            >
              {generating ? "Gerando..." : "Gerar"}
            </button>
          </div>
          {genResult && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20">
              <p className="text-sm">Post criado: <strong>{genResult.title}</strong></p>
              <p className="text-xs opacity-60 mt-1">
                Ja foi publicado automaticamente no site e aparece na lista abaixo.
              </p>
            </div>
          )}
        </div>

        {/* Posts list */}
        <h2 className="font-serif text-xl mb-4">Posts ({posts.length})</h2>
        {loading ? (
          <p className="opacity-40 text-sm">Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Titulo</th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Status</th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Views</th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Leitura</th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Data</th>
                  <th className="py-3 text-[10px] uppercase tracking-widest opacity-50">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 pr-4 max-w-xs">
                      <span className="block font-medium">{post.title}</span>
                      <span className="block text-[10px] opacity-40 mt-0.5">{post.slug}</span>
                    </td>
                    <td className="py-3 pr-4">
                      {(() => {
                        const isPending = !post.published && post.reviewJson && post.reviewJson.length > 2;
                        return (
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                            post.published
                              ? "bg-green-500/20 text-green-300"
                              : isPending
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-white/10 text-white/60"
                          }`}>
                            {post.published ? "Publicado" : isPending ? "Aguard. Revisão" : "Rascunho"}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3 pr-4 opacity-60">{post.views}</td>
                    <td className="py-3 pr-4 opacity-60">{post.readTime} min</td>
                    <td className="py-3 pr-4 opacity-40">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/painel-nb-2025/blog/${post.id}`}
                          className="text-xs text-yellow-300 hover:text-yellow-100 transition"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className="text-xs text-blue-300 hover:text-blue-100 transition"
                        >
                          {post.published ? "Despublicar" : "Publicar"}
                        </button>
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs opacity-40 hover:opacity-100 transition"
                          >
                            Ver
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-xs text-red-400 hover:text-red-200 transition"
                        >
                          Deletar
                        </button>
                        <button
                          onClick={() => handleGenerateImage(post.id)}
                          disabled={generatingImage === post.id}
                          title="Gerar imagem com DALL-E 3"
                          className="text-xs text-purple-300 hover:text-purple-100 transition disabled:opacity-40 shrink-0"
                        >
                          {generatingImage === post.id ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 border border-purple-300 border-t-transparent rounded-full animate-spin inline-block" />
                              Gerando…
                            </span>
                          ) : (
                            "Img IA"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center opacity-40">
                      Nenhum post ainda — gere o primeiro acima
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BlogAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center opacity-40 text-sm">
        Carregando...
      </div>
    }>
      <BlogAdminContent />
    </Suspense>
  );
}
