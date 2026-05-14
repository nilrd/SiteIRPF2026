"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BlogPostImage from "@/components/site/BlogPostImage";

type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  tags: string[];
  categoria: string;
  createdAt: string;
};

type Props = {
  posts: BlogListItem[];
};

const WA_LINK =
  "https://wa.me/5511940825120?text=Ol%C3%A1!%20Vim%20pela%20p%C3%A1gina%20do%20blog%20e%20quero%20orienta%C3%A7%C3%A3o%20sobre%20IRPF%2C%20CPF%20ou%20MEI.";

const FILTERS = [
  "Todos",
  "IRPF 2026",
  "IRPF Atrasado",
  "CPF Irregular",
  "MEI",
  "Malha Fina",
  "Restituição",
  "Documentos",
] as const;

const PAGE_SIZE = 12;

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function postText(post: BlogListItem): string {
  return normalize(
    [post.title, post.summary || "", ...(post.tags || []), post.categoria || ""].join(" ")
  );
}

function matchesFilter(post: BlogListItem, filter: (typeof FILTERS)[number]): boolean {
  if (filter === "Todos") return true;

  const text = postText(post);

  switch (filter) {
    case "IRPF 2026":
      return text.includes("irpf 2026") || (text.includes("irpf") && text.includes("2026"));
    case "IRPF Atrasado":
      return text.includes("irpf atras") || (text.includes("irpf") && text.includes("atras"));
    case "CPF Irregular":
      return text.includes("cpf irregular") || (text.includes("cpf") && text.includes("irregular"));
    case "MEI":
      return text.includes(" mei") || text.startsWith("mei") || text.includes("microempreendedor");
    case "Malha Fina":
      return text.includes("malha fina");
    case "Restituição":
      return text.includes("restituicao") || text.includes("restituicao");
    case "Documentos":
      return text.includes("document") || text.includes("comprovante");
    default:
      return true;
  }
}

function getFeatured(posts: BlogListItem[]): BlogListItem[] {
  const rules: { key: string; terms: string[] }[] = [
    { key: "IRPF atrasado", terms: ["irpf atras", "atrasado"] },
    { key: "CPF irregular", terms: ["cpf irregular", "cpf"] },
    { key: "Fim prazo IRPF", terms: ["prazo", "irpf 2026"] },
    { key: "Documentos", terms: ["document", "comprovante"] },
  ];

  const featured: BlogListItem[] = [];
  const used = new Set<string>();

  for (const rule of rules) {
    const hit = posts.find((post) => {
      if (used.has(post.id)) return false;
      const text = postText(post);
      return rule.terms.some((term) => text.includes(normalize(term)));
    });

    if (hit) {
      used.add(hit.id);
      featured.push(hit);
    }
  }

  if (featured.length === 0) return posts.slice(0, 3);
  return featured.slice(0, 4);
}

export default function BlogListingClient({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const featured = useMemo(() => getFeatured(posts), [posts]);

  const filteredPosts = useMemo(() => {
    const q = normalize(query.trim());
    return posts.filter((post) => {
      const filterOk = matchesFilter(post, activeFilter);
      if (!filterOk) return false;
      if (!q) return true;
      return postText(post).includes(q);
    });
  }, [posts, activeFilter, query]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleFilter = (next: (typeof FILTERS)[number]) => {
    setActiveFilter(next);
    setVisibleCount(PAGE_SIZE);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      <div className="mb-8 border border-[#0A0A0A]/15 bg-[#F5F5F2] p-6 md:p-7">
        <h2 className="font-serif text-2xl text-[#0A0A0A] mb-2">
          Precisa de ajuda com IRPF, CPF ou MEI?
        </h2>
        <p className="text-sm text-[#1F1F1C] leading-relaxed mb-5">
          Fale com nossa equipe e receba orientação para entender sua situação.
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#0A0A0A] text-[#C6FF00] px-6 py-3 uppercase text-[11px] tracking-[0.14em] font-bold hover:bg-[#171717] transition"
        >
          Falar no WhatsApp
        </a>
      </div>

      <div className="mb-8 space-y-4">
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Buscar por IR atrasado, CPF irregular, MEI, restituição..."
          className="w-full border border-[#0A0A0A]/20 bg-white px-4 py-3 text-sm text-[#0A0A0A] placeholder:text-[#0A0A0A]/45 focus:outline-none focus:border-[#0A0A0A]"
          aria-label="Buscar posts do blog"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilter(filter)}
                className={`shrink-0 px-3 py-2 text-[11px] uppercase tracking-widest border transition ${
                  isActive
                    ? "bg-[#0A0A0A] text-[#C6FF00] border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-[#0A0A0A]/20 hover:border-[#0A0A0A]/50"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl md:text-3xl mb-5">Posts em destaque</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((post) => (
              <article key={post.id} className="group border border-[#0A0A0A]/15 p-4 md:p-5">
                <Link href={`/blog/${post.slug}`} className="block">
                  <span className="text-[10px] uppercase tracking-widest text-ouro">
                    {post.tags?.[0] || "IRPF"}
                  </span>
                  <h3 className="font-serif text-xl leading-tight mt-2 group-hover:italic transition-all">
                    {post.title}
                  </h3>
                  <div className="mt-3 overflow-hidden aspect-[16/10] bg-gray-200 relative">
                    {post.coverImage ? (
                      <BlogPostImage src={post.coverImage} alt={post.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-verde/5">
                        <span className="font-serif text-5xl text-verde/10">IR</span>
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-[#0A0A0A]/20">
          <p className="font-serif text-xl text-[#0A0A0A] mb-2">Nenhum artigo encontrado</p>
          <p className="text-sm text-[#0A0A0A]/60">Tente outro termo de busca ou selecione outro filtro.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl md:text-3xl">Todos os artigos</h2>
            <span className="text-[11px] uppercase tracking-widest text-[#0A0A0A]/55">
              {filteredPosts.length} resultados
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {visiblePosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-ouro">
                      {post.tags?.[0] || "IRPF"}
                    </span>
                    <h3 className="font-serif text-xl leading-tight mt-1 group-hover:italic transition-all">
                      {post.title}
                    </h3>
                  </div>

                  <div className="overflow-hidden mb-3 aspect-[16/10] bg-gray-200 relative">
                    {post.coverImage ? (
                      <BlogPostImage src={post.coverImage} alt={post.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-verde/5">
                        <span className="font-serif text-5xl text-verde/10">IR</span>
                      </div>
                    )}
                  </div>

                  {post.summary && (
                    <p className="text-sm text-[#0A0A0A]/65 line-clamp-2">{post.summary}</p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#0A0A0A]/45">
                    <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span>Ler artigo</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="bg-[#0A0A0A] text-[#F5F5F2] px-7 py-3 uppercase text-[11px] tracking-[0.14em] font-bold hover:bg-[#171717] transition"
              >
                Carregar mais posts
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
