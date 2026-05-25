/**
 * GET  /api/admin/afiliados/links  → lista todos os links de afiliado
 * PUT  /api/admin/afiliados/links  → body { id, ...fields } → update
 */
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const links = await prisma.affiliateLink.findMany({
      orderBy: { priority: "asc" },
    });

    // Buscar cliques dos últimos 30 dias por produto
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const clickEvents = await prisma.analyticsEvent.groupBy({
      by: ["element"],
      where: {
        type: { in: ["mp_point_smart_click", "mp_point_pro_click", "mp_app_click"] },
        createdAt: { gte: since30d },
      },
      _count: { id: true },
    });

    // Mapear element → produto
    const productToEventType: Record<string, string> = {
      "point-smart-2": "mp_point_smart_click",
      "point-pro-3": "mp_point_pro_click",
      "app-mercado-pago": "mp_app_click",
    };

    const clicks30dMap: Record<string, number> = {};
    for (const ev of clickEvents) {
      const element = ev.element ?? "";
      for (const [product, evType] of Object.entries(productToEventType)) {
        if (element.includes(product) || element.includes(evType)) {
          clicks30dMap[product] = (clicks30dMap[product] ?? 0) + ev._count.id;
        }
      }
    }

    // Buscar cliques totais do tipo por produto mais precisamente
    const allProductClicks = await prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: {
        type: { in: ["mp_point_smart_click", "mp_point_pro_click", "mp_app_click"] },
        createdAt: { gte: since30d },
      },
      _count: { id: true },
    });

    const typeToProduct: Record<string, string> = {
      mp_point_smart_click: "point-smart-2",
      mp_point_pro_click: "point-pro-3",
      mp_app_click: "app-mercado-pago",
    };

    const clicks30dByProduct: Record<string, number> = {};
    for (const ev of allProductClicks) {
      const product = typeToProduct[ev.type];
      if (product) clicks30dByProduct[product] = ev._count.id;
    }

    const enriched = links.map((l) => ({
      ...l,
      clicks30d: clicks30dByProduct[l.product] ?? 0,
    }));

    return NextResponse.json({ links: enriched });
  } catch (err) {
    console.error("[afiliados/links GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as { id: string; [key: string]: unknown };
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const allowed = ["url", "buttonText", "description", "active", "priority", "label"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in fields) data[key] = fields[key];
    }

    const updated = await prisma.affiliateLink.update({ where: { id }, data });
    return NextResponse.json({ ok: true, link: updated });
  } catch (err) {
    console.error("[afiliados/links PUT]", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
