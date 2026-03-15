import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "ID", "Nome", "Email", "Telefone",
      "Tipo Declaracao", "Origem", "Status", "Mensagem", "Data"
    ];

    const rows = leads.map((l) =>
      [
        l.id,
        l.nome,
        l.email,
        l.telefone ?? "",
        l.tipoDecl ?? "",
        l.origem,
        l.status,
        (l.mensagem ?? "").replace(/"/g, '""'),
        new Date(l.createdAt).toLocaleDateString("pt-BR"),
      ].map((v) => `"${v}"`).join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("[leads/export]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
