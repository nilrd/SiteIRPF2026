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
    <main className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
              Insights
            </span>
            <h1 className="font-serif text-5xl md:text-7xl">
              Perspectivas Tecnicas
            </h1>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-400 mb-4">
              Novos artigos em breve
            </p>
            <p className="opacity-60">
              Estamos preparando conteudo especializado sobre IRPF para voce.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <Link href={`/blog/${post.slug}`}>
                  <div className="overflow-hidden mb-6 aspect-[4/5] bg-gray-200 relative">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-verde/5">
                        <span className="font-serif text-6xl text-verde/10">
                          IR
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-ouro">
                    {post.tags?.[0] || "IRPF"}
                  </span>
                  <h2 className="font-serif text-xl md:text-2xl mt-2 group-hover:italic transition-all">
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-sm opacity-60 mt-2 line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
