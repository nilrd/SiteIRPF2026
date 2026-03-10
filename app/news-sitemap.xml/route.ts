import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // revalida a cada hora

export async function GET() {
  try {
    // Google News Sitemap aceita apenas artigos das últimas 48h
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        createdAt: { gte: twoDaysAgo },
      },
      select: { title: true, slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://irpf.qaplay.com.br";

    const items = posts
      .map(
        (post) => `  <url>
    <loc>${siteUrl}/blog/${encodeURIComponent(post.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>Consultoria IRPF NSB</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${post.createdAt.toISOString()}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
    </news:news>
  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" />`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
