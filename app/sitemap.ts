import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://irpf.qaplay.com.br";

  // Data da ultima atualizacao do conteudo
  const now = new Date();
  const staticPages = [
    { url: baseUrl,                                        lastModified: now, changeFrequency: "weekly"  as const, priority: 1.0 },
    { url: `${baseUrl}/mei`,                               lastModified: now, changeFrequency: "weekly"  as const, priority: 0.9 },
    { url: `${baseUrl}/mei/ferramentas-para-mei`,          lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${baseUrl}/mei/receber-pagamentos`,            lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${baseUrl}/mei/leitura-financeira-para-mei`,   lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicos`,                          lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/como-funciona`,                     lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/ferramentas/calculadora-ir`,        lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/ferramentas/simulador-multa`,       lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/ferramentas/consulta-situacao`,     lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog`,                              lastModified: now, changeFrequency: "weekly"  as const, priority: 0.8 },
    { url: `${baseUrl}/blog/move-brasil`,                  lastModified: now, changeFrequency: "daily"   as const, priority: 0.85 },
    { url: `${baseUrl}/ebook`,                             lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/sobre`,                             lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/contato`,                           lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/politica-de-privacidade`,           lastModified: now, changeFrequency: "yearly"  as const, priority: 0.3 },
    { url: `${baseUrl}/termos-de-uso`,                     lastModified: now, changeFrequency: "yearly"  as const, priority: 0.3 },
  ];

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true, hiddenFromBlogList: false, needsReview: false },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available - return static pages only
  }

  return [...staticPages, ...blogPages];
}
