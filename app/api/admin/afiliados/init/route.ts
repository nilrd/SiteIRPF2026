/**
 * POST /api/admin/afiliados/init
 * Popula as tabelas affiliate_pages, affiliate_links e affiliate_ctas
 * com os dados do registry. Seguro de rodar múltiplas vezes (upsert).
 */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { AFFILIATE_PAGES_REGISTRY, AFFILIATE_LINKS_SEED } from "@/lib/affiliate-registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Upsert pages
    const pageResults = await Promise.all(
      AFFILIATE_PAGES_REGISTRY.map((p) =>
        prisma.affiliatePage.upsert({
          where: { slug: p.slug },
          create: {
            slug: p.slug,
            path: p.path,
            title: p.title,
            pageType: p.pageType,
            mainProduct: p.mainProduct ?? null,
            mainCta: p.mainCta ?? null,
            metaTitle: p.metaTitle ?? null,
            metaDesc: p.metaDesc ?? null,
            targetKeyword: p.targetKeyword ?? null,
            status: "publicado",
            indexable: true,
            inSitemap: true,
            allowRelated: true,
          },
          update: {
            title: p.title,
            pageType: p.pageType,
            mainProduct: p.mainProduct ?? null,
            mainCta: p.mainCta ?? null,
            metaTitle: p.metaTitle ?? null,
            metaDesc: p.metaDesc ?? null,
            targetKeyword: p.targetKeyword ?? null,
          },
        })
      )
    );

    // Upsert affiliate links
    const linkResults = await Promise.all(
      AFFILIATE_LINKS_SEED.map((l) =>
        prisma.affiliateLink.upsert({
          where: { product: l.product },
          create: l,
          update: {
            label: l.label,
            url: l.url,
            buttonText: l.buttonText,
            description: l.description,
          },
        })
      )
    );

    // Seed default CTAs if none exist
    const ctaCount = await prisma.affiliateCta.count();
    let ctasCreated = 0;
    if (ctaCount === 0) {
      await prisma.affiliateCta.createMany({
        data: [
          {
            internalName: "point-smart-2-inline",
            buttonText: "Ver condições da Point Smart 2",
            description: "CTA inline para Point Smart 2",
            product: "point-smart-2",
            destinationUrl: "https://mpago.li/1UXbbb9",
            active: true,
            variant: "inline",
            position: "meio",
          },
          {
            internalName: "point-pro-3-inline",
            buttonText: "Conhecer a Point Pro 3",
            description: "CTA inline para Point Pro 3",
            product: "point-pro-3",
            destinationUrl: "https://mpago.li/31QNkWU",
            active: true,
            variant: "inline",
            position: "meio",
          },
          {
            internalName: "app-mp-inline",
            buttonText: "Conhecer o App Mercado Pago",
            description: "CTA inline para App Mercado Pago",
            product: "app-mercado-pago",
            destinationUrl: "https://mpago.li/18rGCG2",
            active: true,
            variant: "inline",
            position: "meio",
          },
          {
            internalName: "point-smart-2-footer",
            buttonText: "Ver a Point Smart 2 no Mercado Pago",
            description: "CTA de footer para Point Smart 2",
            product: "point-smart-2",
            destinationUrl: "https://mpago.li/1UXbbb9",
            active: true,
            variant: "footer",
            position: "fim",
          },
          {
            internalName: "quiz-resultado-smart2",
            buttonText: "Ver condições da Point Smart 2",
            description: "CTA no resultado do quiz — recomendação Smart 2",
            product: "point-smart-2",
            destinationUrl: "https://mpago.li/1UXbbb9",
            active: true,
            variant: "quiz",
            position: "quiz",
          },
          {
            internalName: "quiz-resultado-pro3",
            buttonText: "Conhecer a Point Pro 3",
            description: "CTA no resultado do quiz — recomendação Pro 3",
            product: "point-pro-3",
            destinationUrl: "https://mpago.li/31QNkWU",
            active: true,
            variant: "quiz",
            position: "quiz",
          },
          {
            internalName: "quiz-resultado-app",
            buttonText: "Abrir conta no Mercado Pago grátis",
            description: "CTA no resultado do quiz — recomendação App",
            product: "app-mercado-pago",
            destinationUrl: "https://mpago.li/18rGCG2",
            active: true,
            variant: "quiz",
            position: "quiz",
          },
        ],
      });
      ctasCreated = 7;
    }

    return NextResponse.json({
      ok: true,
      pages: pageResults.length,
      links: linkResults.length,
      ctasCreated,
    });
  } catch (err) {
    console.error("[afiliados/init]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
