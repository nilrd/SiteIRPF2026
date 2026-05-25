/**
 * POST /api/afiliados/click
 * Rota pública — registra clique em link de afiliado MP.
 * Incrementa AffiliateLink.clickCount e salva AnalyticsEvent.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_PRODUCTS = ["point-smart-2", "point-pro-3", "app-mercado-pago"] as const;
type ValidProduct = typeof VALID_PRODUCTS[number];

const PRODUCT_EVENT_TYPE: Record<ValidProduct, string> = {
  "point-smart-2": "mp_point_smart_click",
  "point-pro-3": "mp_point_pro_click",
  "app-mercado-pago": "mp_app_click",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      product: string;
      page?: string;
      element?: string;
    };

    const product = body.product as ValidProduct;
    if (!VALID_PRODUCTS.includes(product)) {
      return NextResponse.json({ error: "produto inválido" }, { status: 400 });
    }

    const page = body.page ?? "/";
    const element = body.element ?? product;
    const eventType = PRODUCT_EVENT_TYPE[product];

    // Executar em paralelo — não bloquear
    await Promise.allSettled([
      prisma.affiliateLink.updateMany({
        where: { product },
        data: {
          clickCount: { increment: 1 },
          lastClickAt: new Date(),
        },
      }),
      prisma.analyticsEvent.create({
        data: {
          sessionId: `click-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: eventType,
          page,
          element,
          referrer: req.headers.get("referer") ?? null,
          device: req.headers.get("user-agent")?.includes("Mobile") ? "mobile" : "desktop",
          country: null,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Não quebrar o fluxo do usuário por erro de tracking
    console.error("[afiliados/click]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
