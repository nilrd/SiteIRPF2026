import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogListingClient from "@/components/site/BlogListingClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Consultoria IRPF NSB",
  description:
    "Dicas e guias sobre IRPF, CPF e MEI. Encontre conteúdos para declarar com mais tranquilidade e regularizar pendências fiscais.",
};

async function getPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        coverImage: true,
        tags: true,
        categoria: true,
        createdAt: true,
      },
    });

    return posts.map((post) => ({
      ...post,
      tags: post.tags || [],
      createdAt: post.createdAt.toISOString(),
    }));
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
              Dicas e Guias
            </span>
            <h1 className="font-serif text-4xl md:text-6xl leading-[0.95]">
              Dicas sobre IRPF, CPF e MEI
            </h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-[#0A0A0A]/70 leading-relaxed">
              Guias simples para declarar seu Imposto de Renda, regularizar CPF, resolver pendências fiscais e cuidar do seu MEI.
            </p>
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
          <BlogListingClient posts={posts} />
        )}
      </section>
    </main>
  );
}
