/**
 * GET    /api/admin/afiliados/ctas  → lista todos os CTAs
 * POST   /api/admin/afiliados/ctas  → criar novo CTA
 * PUT    /api/admin/afiliados/ctas  → body { id, ...fields } → update
 * DELETE /api/admin/afiliados/ctas  → body { id } → desativar (soft delete)
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

    const ctas = await prisma.affiliateCta.findMany({
      orderBy: [{ active: "desc" }, { product: "asc" }, { position: "asc" }],
    });

    return NextResponse.json({ ctas });
  } catch (err) {
    console.error("[afiliados/ctas GET]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as Record<string, unknown>;
    const { internalName, buttonText, description, product, destinationUrl, variant, position } = body;

    if (!internalName || !buttonText || !destinationUrl) {
      return NextResponse.json({ error: "internalName, buttonText e destinationUrl são obrigatórios" }, { status: 400 });
    }

    const cta = await prisma.affiliateCta.create({
      data: {
        internalName: String(internalName),
        buttonText: String(buttonText),
        description: description ? String(description) : null,
        product: product ? String(product) : null,
        destinationUrl: String(destinationUrl),
        variant: variant ? String(variant) : "inline",
        position: position ? String(position) : "meio",
        active: true,
      },
    });

    return NextResponse.json({ ok: true, cta });
  } catch (err) {
    console.error("[afiliados/ctas POST]", err);
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as { id: string; [key: string]: unknown };
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const allowed = ["internalName", "buttonText", "description", "product", "destinationUrl", "active", "variant", "position"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in fields) data[key] = fields[key];
    }

    const updated = await prisma.affiliateCta.update({ where: { id }, data });
    return NextResponse.json({ ok: true, cta: updated });
  } catch (err) {
    console.error("[afiliados/ctas PUT]", err);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json() as { id: string };
    if (!body.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    await prisma.affiliateCta.update({
      where: { id: body.id },
      data: { active: false },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[afiliados/ctas DELETE]", err);
    return NextResponse.json({ error: "Erro ao desativar" }, { status: 500 });
  }
}
