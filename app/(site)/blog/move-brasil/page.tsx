import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BlogPostImage from "@/components/site/BlogPostImage";
import BlogCTA from "@/components/site/BlogCTA";
import AdUnit from "@/components/ads/AdUnit";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Move Brasil para Motoristas: cadastro, financiamento, renda e IRPF",
  description:
    "Guias completos para taxistas e motoristas de aplicativo entenderem o Move Brasil, organizarem documentos e se prepararem para análise de crédito.",
  alternates: {
    canonical: "https://irpf.qaplay.com.br/blog/move-brasil",
  },
  openGraph: {
    title: "Move Brasil para Motoristas: cadastro, financiamento, renda e IRPF",
    description:
      "Conteúdo prático para taxistas e motoristas de app se prepararem para análise de crédito com mais organização.",
    url: "https://irpf.qaplay.com.br/blog/move-brasil",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Hub Move Brasil para motoristas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};

type MovePost = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  coverImage: string | null;
  imageAlt: string;
  createdAt: Date;
};

async function getMovePosts(): Promise<MovePost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: {
        published: true,
        tags: { has: "Move Brasil" },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        imageAlt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function MoveBrasilHubPage() {
  const posts = await getMovePosts();

  return (
    <main className="pt-28 pb-20">
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://irpf.qaplay.com.br" },
          { name: "Blog", url: "https://irpf.qaplay.com.br/blog" },
          {
            name: "Move Brasil para Motoristas",
            url: "https://irpf.qaplay.com.br/blog/move-brasil",
          },
        ]}
      />

      <section className="max-w-7xl mx-auto px-6">
        <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 mb-3">
          Campanha Editorial Curada
        </p>
        <h1 className="font-serif text-4xl md:text-6xl leading-[0.95] mb-5">
          Move Brasil para Motoristas: cadastro, financiamento, renda e IRPF
        </h1>
        <p className="text-sm md:text-base text-[#0A0A0A]/75 max-w-4xl leading-relaxed">
          Guias completos para taxistas e motoristas de aplicativo entenderem o
          Move Brasil, organizarem documentação e chegarem mais preparados na
          análise de crédito. Conteúdo informativo: cadastro no programa não
          garante aprovação de financiamento.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AdUnit label="Publicidade" minHeight={180} />

          {posts.length === 0 ? (
            <div className="border border-[#0A0A0A]/10 p-6 mt-4">
              <p className="text-sm opacity-70">
                Ainda não há posts publicados desta campanha.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-[#0A0A0A]/10 p-4 bg-white"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f1ef] mb-4">
                      <BlogPostImage
                        src={post.coverImage || "/og-image.svg"}
                        alt={post.imageAlt || post.title}
                      />
                    </div>
                    <h2 className="font-serif text-2xl leading-tight hover:italic transition-all">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="text-sm mt-3 text-[#0A0A0A]/70 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </Link>
                  <p className="text-[11px] uppercase tracking-widest opacity-40 mt-4">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="border border-[#0A0A0A]/10 p-6 bg-[#F5F5F2]">
            <h3 className="font-serif text-2xl mb-3">
              Tente chegar mais preparado na análise do banco
            </h3>
            <p className="text-sm leading-relaxed text-[#0A0A0A]/75 mb-4">
              Vai se cadastrar no Move Brasil ou tentar financiar um carro? A
              NSB Consultoria ajuda você a organizar IRPF, CPF, MEI e documentos
              de renda para apresentar uma situação mais clara na análise de
              crédito.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/servicos"
                className="bg-[#0A0A0A] text-[#C6FF00] px-4 py-3 text-center text-xs uppercase tracking-widest font-bold"
              >
                Organizar minha documentação
              </Link>
              <a
                href="https://wa.me/5511940825120?text=Olá, vim pelo post sobre Move Brasil. Sou motorista e quero organizar minha documentação, IRPF/CPF/MEI e comprovação de renda para tentar financiamento."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#0A0A0A]/30 px-4 py-3 text-center text-xs uppercase tracking-widest font-bold"
              >
                Falar no WhatsApp
              </a>
              <Link
                href="/servicos"
                className="border border-[#0A0A0A]/30 px-4 py-3 text-center text-xs uppercase tracking-widest font-bold"
              >
                Ver serviços de IRPF e MEI
              </Link>
            </div>
          </div>

          <BlogCTA variant="sidebar" topic="irpf" />
          <AdUnit
            label="Publicidade"
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
            className="my-0"
            minHeight={250}
          />
        </aside>
      </section>
    </main>
  );
}
