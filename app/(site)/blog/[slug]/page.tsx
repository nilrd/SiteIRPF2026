import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { JsonLdArticle, JsonLdBreadcrumb, JsonLdFAQ } from "@/components/seo/JsonLd";

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
  return {
    title: `${post.title} | Blog IRPF NSB`,
    description: post.summary || post.title,
    keywords: post.keywords || [],
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      type: "article",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Vi um artigo no blog e quero declarar meu IRPF.")}`;

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  const faqs: { question: string; answer: string }[] =
    (() => { try { return JSON.parse(post.faqsJson || "[]"); } catch { return []; } })();

  const related = await getRelated(post.tags || [], post.id);

  return (
    <main className="pt-32 pb-24">
      <JsonLdArticle
        title={post.title}
        description={post.summary || ""}
        url={`https://irpf.qaplay.com.br/blog/${post.slug}`}
        image={post.coverImage || ""}
        datePublished={post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
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
              <p className="text-lg opacity-70 mb-8 border-l-2 border-ouro pl-6">
                {post.summary}
              </p>
            )}

            {post.coverImage && (
              <div className="relative aspect-[16/9] mb-12 bg-gray-200 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose-irpf"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA Box mid-content */}
            <div className="bg-verde text-white p-8 my-12 text-center">
              <h3 className="font-serif text-2xl mb-3">
                Precisa declarar seu IRPF?
              </h3>
              <p className="opacity-70 mb-6 text-sm">
                Nosso consultor pode analisar seu caso e maximizar sua
                restituicao.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-verde px-8 py-3 inline-block uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
              >
                Falar com Consultor
              </a>
            </div>

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
              <div className="bg-verde/5 border border-verde/10 p-6">
                <h3 className="font-serif text-lg mb-3">
                  Receba nosso conteudo
                </h3>
                <p className="text-sm opacity-60 mb-4">
                  Dicas de IRPF direto no seu WhatsApp.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-verde text-white py-3 uppercase text-xs tracking-widest font-bold hover:bg-verde/90 transition"
                >
                  Entrar em Contato
                </a>
              </div>

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
    </main>
  );
}
