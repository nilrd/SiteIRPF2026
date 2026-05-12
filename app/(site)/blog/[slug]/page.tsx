import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BlogPostImage from "@/components/site/BlogPostImage";
import AuthorBadge from "@/components/site/AuthorBadge";
import BlogCTA from "@/components/site/BlogCTA";
import BlogStickyBar from "@/components/site/BlogStickyBar";
import { JsonLdArticle, JsonLdBreadcrumb, JsonLdFAQ, JsonLdSpeakable } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    return post;
  } catch {
    return null;
  }
}

async function getRelated(tags: string[], excludeId: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        id: { not: excludeId },
        tags: { hasSome: tags },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Artigo nao encontrado" };
  const url = `https://irpf.qaplay.com.br/blog/${post.slug}`;
  return {
    title: `${post.title} | Blog IRPF NSB`,
    description: post.summary || post.title,
    keywords: post.keywords || [],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      type: "article",
      url,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["https://irpf.qaplay.com.br/sobre"],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

/** Mapeia categoria do post para o topic do BlogCTA */
function topicFromCategoria(categoria: string): "irpf" | "mei" | "desenrola" {
  if (categoria === "MEI") return "mei";
  if (categoria === "DESENROLA") return "desenrola";
  return "irpf";
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  // Increment view count (fire-and-forget — never blocks render)
  void prisma.blogPost
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const faqs: { question: string; answer: string }[] =
    (() => { try { return JSON.parse(post.faqsJson || "[]"); } catch { return []; } })();

  const related = await getRelated(post.tags || [], post.id);

  // Parsear atribuicao da imagem (Unsplash)
  const imageAttribution = (() => {
    try {
      return post.imageAttribution ? JSON.parse(post.imageAttribution) : null;
    } catch {
      return null;
    }
  })();

  return (
    <main className="pt-32 pb-24">
      <JsonLdArticle
        title={post.title}
        description={post.summary || ""}
        url={`https://irpf.qaplay.com.br/blog/${post.slug}`}
        image={post.coverImage || ""}
        datePublished={post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        type={(Date.now() - post.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000 ? "NewsArticle" : "Article"}
        articleSection={post.tags?.[0] ?? "IRPF"}
      />
      <JsonLdSpeakable
        url={`https://irpf.qaplay.com.br/blog/${post.slug}`}
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Blog", url: "https://irpf.qaplay.com.br/blog" },
          {
            name: post.title,
            url: `https://irpf.qaplay.com.br/blog/${post.slug}`,
          },
        ]}
      />
      {faqs.length > 0 && <JsonLdFAQ faqs={faqs} />}

      <article className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="md:col-span-8">
            {/* Breadcrumb */}
            <nav className="text-[10px] uppercase tracking-widest opacity-40 mb-8">
              <Link href="/" className="hover:opacity-100 transition">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:opacity-100 transition">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="opacity-70">{post.title}</span>
            </nav>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-ouro"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-lg opacity-70 mb-4 border-l-2 border-ouro pl-6 article-summary">
                {post.summary}
              </p>
            )}

            <AuthorBadge
              readTime={post.readTime || undefined}
              publishedAt={post.createdAt}
            />

            {post.coverImage && (
              <div className="relative aspect-[16/9] mb-12 bg-gray-200 overflow-hidden">
                <BlogPostImage
                  src={post.coverImage}
                  alt={post.imageAlt || post.title}
                  attribution={imageAttribution}
                />
              </div>
            )}

            {/* Conteudo do artigo */}
            <div
              className="prose-irpf"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA Box mid-content */}
            <BlogCTA variant="inline" topic={topicFromCategoria(post.categoria)} />

            {/* FAQ Accordion */}
            {faqs.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-3xl mb-8">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="editorial-border pb-4">
                      <summary className="font-serif text-lg cursor-pointer py-3 hover:italic transition-all">
                        {faq.question}
                      </summary>
                      <p className="text-sm opacity-70 leading-relaxed pl-0 mt-2">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Mini calculator CTA */}
              <div className="border border-gray-200 p-6">
                <h3 className="font-serif text-lg mb-3">
                  Calculadora de IR
                </h3>
                <p className="text-sm opacity-60 mb-4">
                  Simule seu imposto de renda gratuitamente.
                </p>
                <Link
                  href="/ferramentas/calculadora-ir"
                  className="block w-full text-center bg-preto text-white py-3 uppercase text-xs tracking-widest font-bold hover:bg-preto/80 transition"
                >
                  Calcular Agora
                </Link>
              </div>

              {/* Lead form */}
              <BlogCTA variant="sidebar" topic={topicFromCategoria(post.categoria)} />

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-serif text-lg mb-4">
                    Artigos Relacionados
                  </h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/blog/${r.slug}`}
                        className="block group"
                      >
                        <span className="text-[10px] uppercase tracking-widest text-ouro">
                          {r.tags?.[0] || "IRPF"}
                        </span>
                        <h4 className="font-serif text-sm group-hover:italic transition-all mt-1">
                          {r.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
      <BlogStickyBar />
    </main>
  );
}
