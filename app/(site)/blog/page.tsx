import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Consultoria IRPF NSB",
  description:
    "Artigos e insights sobre IRPF, planejamento tributario, malha fina e restituicao. Conteudo atualizado pela Consultoria IRPF NSB.",
};

async function getPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="pt-24 pb-16">
      <section className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div>
            <span className="block text-[11px] uppercase tracking-[0.28em] mb-3 opacity-60">
              Insights
            </span>
            <h1 className="font-serif text-4xl md:text-6xl leading-[0.95]">
              Perspectivas Tecnicas
            </h1>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-serif text-xl text-gray-400 mb-3">
              Novos artigos em breve
            </p>
            <p className="text-sm opacity-60">
              Estamos preparando conteudo especializado sobre IRPF para voce.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-ouro">
                      {post.tags?.[0] || "IRPF"}
                    </span>
                    <h2 className="font-serif text-xl leading-tight mt-1 group-hover:italic transition-all">
                      {post.title}
                    </h2>
                  </div>

                  <div className="overflow-hidden mb-3 aspect-[16/10] bg-gray-200 relative">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-verde/5">
                        <span className="font-serif text-5xl text-verde/10">
                          IR
                        </span>
                      </div>
                    )}
                  </div>

                  {post.summary && (
                    <p className="text-sm opacity-60 line-clamp-2">
                      {post.summary}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest opacity-45">
                    <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span>Ler artigo</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
