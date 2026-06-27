"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  published: boolean;
  hiddenFromBlogList: boolean;
  views: number;
  readTime: number;
  tags: string[];
  createdAt: string;
  reviewJson: string;
  coverImage: string | null;
  aiModel: string | null;
  categoria: string;
  duplicateInfo?: {
    duplicateOfTitle: string;
    similarity: number;
  } | null;
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

const CATEGORIA_TABS = ["TODOS", "IRPF", "MEI", "DESENROLA", "GERAL"] as const;
type CategoriaTab = (typeof CATEGORIA_TABS)[number];

const AUTOMATION_LABELS: Record<string, string> = {
  "blog-auto": "Blog IRPF",
  "blog-mei": "Blog MEI",
};

const CATEGORIA_COLORS: Record<string, string> = {
  IRPF: "bg-blue-500/20 text-blue-300",
  MEI: "bg-orange-500/20 text-orange-300",
  DESENROLA: "bg-purple-500/20 text-purple-300",
  GERAL: "bg-white/10 text-white/40",
};

const GENERATE_POST_TIMEOUT_MS = 95_000;

type GeneratePostResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  code?: string;
  provider?: string;
  pending?: boolean;
  themeUsed?: string;
  post?: {
    title: string;
    slug: string;
  };
};

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function parseGenerateResponse(
  response: Response,
): Promise<GeneratePostResponse | null> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json().catch(() => null)) as GeneratePostResponse | null;
  }

  const text = await response.text().catch(() => "");
  return text ? { error: text } : null;
}

function getGenerateErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const normalized = error.message.toLowerCase();

    if (error.name === "AbortError") {
      return "Não foi possível gerar o post agora. A requisição demorou demais. Tente novamente em alguns instantes.";
    }

    if (
      normalized.includes("failed to fetch") ||
      normalized.includes("network")
    ) {
      return "Não foi possível gerar o post agora. Houve uma falha de conexão com o servidor.";
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  return "Não foi possível gerar o post agora. Verifique sua chave de API ou tente novamente em alguns instantes.";
}

function BlogAdminContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
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
  const [keyword, setKeyword] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{
    title: string;
    slug: string;
  } | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaTab>("TODOS");
  const [generatingImage, setGeneratingImage] = useState<{
    postId: string;
    model: string;
  } | null>(null);
  const actionMsgTimeoutRef = useRef<number | null>(null);
  const showActionMessage = useCallback((message: string, timeoutMs = 8000) => {
    if (actionMsgTimeoutRef.current) {
      window.clearTimeout(actionMsgTimeoutRef.current);
    }

    setActionMsg(message);
    actionMsgTimeoutRef.current = window.setTimeout(() => {
      setActionMsg(null);
      actionMsgTimeoutRef.current = null;
    }, timeoutMs);
  }, []);

  // Ler keyword/titulo da URL (link vindo do analisador)
  useEffect(() => {
    const kw = searchParams.get("keyword") || searchParams.get("titulo") || "";
    if (kw) setKeyword(kw);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (actionMsgTimeoutRef.current) {
        window.clearTimeout(actionMsgTimeoutRef.current);
      }
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
      if (data.automationStats) setAutomationStats(data.automationStats);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleGenerate() {
    if (generating) return;

    const trimmedKeyword = keyword.trim();
    const controller = new AbortController();
    const timeoutId: number = window.setTimeout(
      () => controller.abort(),
      GENERATE_POST_TIMEOUT_MS,
    );

    setGenerating(true);
    setGenResult(null);
    setActionMsg(null);

    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: trimmedKeyword,
          theme: trimmedKeyword || null,
        }),
        signal: controller.signal,
      });
      const data = await parseGenerateResponse(res);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Não foi possível gerar o post agora. Verifique sua chave de API ou tente novamente em alguns instantes.",
        );
      }

      if (!data?.success || !data.post) {
        throw new Error(
          "A API retornou uma resposta inválida ao gerar o post.",
        );
      }

      if (data.success) {
        setGenResult(data.post);
        setKeyword("");
        const themeLabel =
          (data.themeUsed ?? trimmedKeyword) || "sugerido automaticamente";
        if (data.pending) {
          showActionMessage(
            `Post gerado com o tema "${themeLabel}", mas RETIDO para revisão — acesse o rascunho abaixo para verificar e publicar.`,
            8000,
          );
        } else {
          showActionMessage(
            `Post gerado com o tema "${themeLabel}" e publicado automaticamente no site.`,
            6000,
          );
        }
        await fetchPosts();
      }
    } catch (err) {
      console.error("Erro ao gerar post:", err);
      showActionMessage(`❌ ${getGenerateErrorMessage(err)}`, 8000);
    } finally {
      window.clearTimeout(timeoutId);
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
        prev.map((p) => (p.id === id ? { ...p, published: !current } : p)),
      );
      setActionMsg(current ? "Post despublicado." : "Post publicado!");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Erro ao atualizar post.");
    }
  }

  async function toggleListingVisibility(id: string, currentHidden: boolean) {
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenFromBlogList: !currentHidden }),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, hiddenFromBlogList: !currentHidden } : p,
        ),
      );
      setActionMsg(
        currentHidden
          ? "Post voltou para a listagem pública do blog."
          : "Post ocultado da listagem pública do blog.",
      );
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Erro ao atualizar visibilidade da listagem.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Deletar "${title}"? Essa acao nao pode ser desfeita.`))
      return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("Post deletado.");
      setTimeout(() => setActionMsg(null), 3000);
    } catch {
      setActionMsg("Erro ao deletar post.");
    }
  }

  async function handleGenerateImage(postId: string, model: string) {
    setGeneratingImage({ postId, model });
    try {
      const res = await fetch("/api/admin/blog/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, model }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, coverImage: data.imageUrl } : p,
          ),
        );
        const scene = data.scene
          ? ` | Cena: "${data.scene.slice(0, 80)}..."`
          : "";
        setActionMsg(`✅ Imagem gerada (${model})!${scene}`);
      } else {
        setActionMsg(
          `❌ Erro (${model}): ${data.error || "falha ao gerar imagem"}`,
        );
      }
      setTimeout(() => setActionMsg(null), 6000);
    } catch {
      setActionMsg("❌ Erro de conexão ao gerar imagem.");
      setTimeout(() => setActionMsg(null), 5000);
    } finally {
      setGeneratingImage(null);
    }
  }

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;
  const filteredPosts =
    categoriaFilter === "TODOS"
      ? posts
      : posts.filter((p) => (p.categoria || "IRPF") === categoriaFilter);
  const lastRunLabel = automationStats.lastRunKey
    ? AUTOMATION_LABELS[automationStats.lastRunKey] ||
      automationStats.lastRunKey
    : "Sem execucao";

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

        {/* Categoria filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIA_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoriaFilter(tab)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition border ${
                categoriaFilter === tab
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/50 border-white/10 hover:border-white/30"
              }`}
            >
              {tab}
              {tab !== "TODOS" && (
                <span className="ml-2 opacity-60">
                  ({posts.filter((p) => (p.categoria || "IRPF") === tab).length}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Generate section */}
        <div className="border border-white/10 p-6 mb-10">
          <h2 className="font-serif text-xl mb-4">Gerar Post com IA</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Tema opcional (vazio = IA escolhe tema sobre IRPF, MEI ou tributação)"
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
              <p className="text-sm">
                Post criado: <strong>{genResult.title}</strong>
              </p>
              <p className="text-xs opacity-60 mt-1">
                O resultado ja aparece na lista abaixo, publicado ou retido para
                revisao conforme a checagem automatica.
              </p>
            </div>
          )}
        </div>

        <section className="border border-white/10 p-6 mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-xl">Resumo do Auto Post</h2>
              <p className="text-sm text-white/45 mt-1">
                Auto Post hoje: {automationStats.postsToday} gerados ·{" "}
                {automationStats.publishedToday} publicados ·{" "}
                {automationStats.failures24h +
                  automationStats.partials24h +
                  automationStats.stale24h} alertas (24h)
              </p>
              <p className="text-xs text-white/35 mt-2">
                Ultima execucao: {lastRunLabel} •{" "}
                {formatDateTime(automationStats.lastRunAt)}
              </p>
            </div>
            <Link
              href="/painel-nb-2025/blog/monitoramento"
              className="inline-flex items-center justify-center border border-white/20 px-4 py-2 text-xs uppercase tracking-widest hover:border-white/50 hover:bg-white/5 transition"
            >
              Ver monitoramento completo
            </Link>
          </div>
        </section>

        {/* Posts list */}
        <h2 className="font-serif text-xl mb-4">Posts ({posts.length})</h2>
        {loading ? (
          <p className="opacity-40 text-sm">Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Titulo
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Categoria
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Modelo IA
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Status
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Views
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Leitura
                  </th>
                  <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                    Data
                  </th>
                  <th className="py-3 text-[10px] uppercase tracking-widest opacity-50">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 max-w-xs">
                      <span className="block font-medium">{post.title}</span>
                      <span className="block text-[10px] opacity-40 mt-0.5 font-mono">
                        {post.slug}
                      </span>
                      {post.duplicateInfo && (
                        <div className="mt-1">
                          <span className="inline-block bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 border border-red-500/30 rounded font-medium">
                            ⚠️ Duplicado ({Math.round(post.duplicateInfo.similarity * 100)}% de "{post.duplicateInfo.duplicateOfTitle}")
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                          CATEGORIA_COLORS[post.categoria || "IRPF"] ||
                          CATEGORIA_COLORS.GERAL
                        }`}
                      >
                        {post.categoria || "IRPF"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {(() => {
                        const m = post.aiModel || "";
                        const isGemini = m.includes("gemini");
                        const isMistral = m.includes("mistral");
                        const isGithub =
                          m.includes("Llama") ||
                          m.includes("Meta-") ||
                          m.includes("Phi");
                        const isGroq =
                          m.includes("llama") ||
                          m.includes("kimi") ||
                          m.includes("qwen") ||
                          m.includes("maverick");
                        const isOpenAI = m.includes("gpt");
                        const color = isGemini
                          ? "bg-blue-500/20 text-blue-300"
                          : isMistral
                            ? "bg-orange-500/20 text-orange-300"
                            : isGithub
                              ? "bg-purple-500/20 text-purple-300"
                              : isGroq
                                ? "bg-green-500/20 text-green-300"
                                : isOpenAI
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-white/10 text-white/40";
                        const label = m
                          ? m
                              .replace("gemini-", "G:")
                              .replace("-latest", "")
                              .replace("mistral-", "M:")
                              .replace("Meta-Llama-", "GH:Llama-")
                              .replace("-Instruct", "")
                              .replace("moonshotai/", "")
                              .replace("meta-llama/", "")
                          : "—";
                        return (
                          <span
                            title={m || "desconhecido"}
                            className={`text-[10px] font-mono px-2 py-1 ${color} whitespace-nowrap`}
                          >
                            {label.length > 22
                              ? label.slice(0, 22) + "…"
                              : label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3 pr-4">
                      {(() => {
                        const isPending =
                          !post.published &&
                          post.reviewJson &&
                          post.reviewJson.length > 2;
                        const visibilityLabel = post.hiddenFromBlogList
                          ? "Oculto da lista"
                          : "Listagem ativa";
                        return (
                          <div className="flex flex-col gap-1">
                            <span
                              className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                                post.published
                                  ? "bg-green-500/20 text-green-300"
                                  : isPending
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-white/10 text-white/60"
                              }`}
                            >
                              {post.published
                                ? "Publicado"
                                : isPending
                                  ? "Aguard. Revisão"
                                  : "Rascunho"}
                            </span>
                            <span
                              className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                                post.hiddenFromBlogList
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-white/10 text-white/50"
                              }`}
                            >
                              {visibilityLabel}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3 pr-4 opacity-60">{post.views}</td>
                    <td className="py-3 pr-4 opacity-60">
                      {post.readTime} min
                    </td>
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
                        <button
                          onClick={() =>
                            toggleListingVisibility(post.id, post.hiddenFromBlogList)
                          }
                          className="text-xs text-purple-300 hover:text-purple-100 transition"
                        >
                          {post.hiddenFromBlogList ? "Listar" : "Ocultar lista"}
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
                        {/* Geração de imagem — gpt-image-1 e Flux */}
                        {(["gpt-image-1", "flux"] as const).map((imgModel) => {
                          const labels: Record<string, string> = {
                            "gpt-image-1": "GPT-img1",
                            flux: "Flux",
                          };
                          const colors: Record<string, string> = {
                            "gpt-image-1":
                              "text-purple-300 hover:text-purple-100",
                            flux: "text-orange-300 hover:text-orange-100",
                          };
                          const isActive =
                            generatingImage?.postId === post.id &&
                            generatingImage.model === imgModel;
                          const isDisabled =
                            generatingImage?.postId === post.id;
                          return (
                            <button
                              key={imgModel}
                              onClick={() =>
                                handleGenerateImage(post.id, imgModel)
                              }
                              disabled={isDisabled}
                              title={`Gerar imagem com ${imgModel}`}
                              className={`text-xs transition disabled:opacity-40 shrink-0 ${colors[imgModel]}`}
                            >
                              {isActive ? (
                                <span className="inline-flex items-center gap-0.5">
                                  <span className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                                </span>
                              ) : (
                                labels[imgModel]
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center opacity-40">
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center opacity-40 text-sm">
          Carregando...
        </div>
      }
    >
      <BlogAdminContent />
    </Suspense>
  );
}
