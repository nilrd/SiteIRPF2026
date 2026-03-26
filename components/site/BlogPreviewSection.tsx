import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogPreviewSection() {
  let posts: Array<{
    title: string;
    slug: string;
    tags: string[];
    coverImage: string | null;
    summary: string | null;
  }> = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        title: true,
        slug: true,
        tags: true,
        coverImage: true,
        summary: true,
      },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: 3,
    });
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-14 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-16">
        <h2 className="font-serif text-4xl md:text-5xl">
          Perspectivas Técnicas
        </h2>
        <Link
          href="/blog"
          className="text-xs uppercase border-b border-preto pb-1 hover:opacity-50 transition"
        >
          Ver todos os artigos
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {posts.map((post) => (
          <article key={post.slug} className="group cursor-pointer">
            <Link href={`/blog/${post.slug}`}>
              <div className="overflow-hidden mb-6 aspect-[4/5] relative bg-gray-100">
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
                    <span className="font-serif text-5xl text-verde/20">IR</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ouro">
                {post.tags?.[0] || "IRPF"}
              </span>
              <h3 className="font-serif text-xl md:text-2xl mt-2 group-hover:italic transition-all">
                {post.title}
              </h3>
              {post.summary && (
                <p className="text-sm opacity-60 mt-2 leading-relaxed line-clamp-2">
                  {post.summary}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
