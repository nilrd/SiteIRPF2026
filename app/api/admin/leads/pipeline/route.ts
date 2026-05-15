import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUS = ["novo", "em_contato", "convertido", "perdido"] as const;
const ALLOWED_TIPO = ["lead", "contato", "todos"] as const;

type AllowedTipo = (typeof ALLOWED_TIPO)[number];

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function isAllowedStatus(value: string): value is (typeof ALLOWED_STATUS)[number] {
  return (ALLOWED_STATUS as readonly string[]).includes(value);
}

function isAllowedTipo(value: string): value is AllowedTipo {
  return (ALLOWED_TIPO as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tipoRaw = searchParams.get("tipo") ?? "todos";
    const tipo = tipoRaw.toLowerCase();

    if (!isAllowedTipo(tipo)) {
      return NextResponse.json({ error: "tipo inválido. Use: lead, contato, todos" }, { status: 400 });
    }

    const status = searchParams.get("status")?.trim().toLowerCase();
    if (status && !isAllowedStatus(status)) {
      return NextResponse.json({ error: "status inválido. Use: novo, em_contato, convertido, perdido" }, { status: 400 });
    }

    const origem = searchParams.get("origem")?.trim();
    const q = searchParams.get("q")?.trim();
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const perPage = Math.min(parsePositiveInt(searchParams.get("per_page"), 20), 100);
    const skip = (page - 1) * perPage;

    const leadWhere = {
      ...(status ? { status } : {}),
      ...(origem ? { origem } : {}),
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { telefone: { contains: q, mode: "insensitive" as const } },
              { mensagem: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const contatoWhere = {
      ...(status ? { status } : {}),
      ...(origem ? { origem } : {}),
      ...(q
        ? {
            OR: [
              { nome: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { telefone: { contains: q, mode: "insensitive" as const } },
              { assunto: { contains: q, mode: "insensitive" as const } },
              { mensagem: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [leadCounters, contatoCounters, naoLidos] = await Promise.all([
      Promise.all([
        prisma.lead.count({ where: { status: "novo" } }),
        prisma.lead.count({ where: { status: "em_contato" } }),
        prisma.lead.count({ where: { status: "convertido" } }),
        prisma.lead.count({ where: { status: "perdido" } }),
      ]),
      Promise.all([
          prisma.contato.count({ where: { status: "novo" } }),
          prisma.contato.count({ where: { status: "em_contato" } }),
          prisma.contato.count({ where: { status: "convertido" } }),
          prisma.contato.count({ where: { status: "perdido" } }),
      ]),
      prisma.contato.count({ where: { lido: false } }),
    ]);

    const counters = {
      novos: leadCounters[0] + contatoCounters[0],
      em_contato: leadCounters[1] + contatoCounters[1],
      convertidos: leadCounters[2] + contatoCounters[2],
      perdidos: leadCounters[3] + contatoCounters[3],
      nao_lidos: naoLidos,
    };

    if (tipo === "lead") {
      const [total, leads] = await Promise.all([
        prisma.lead.count({ where: leadWhere }),
        prisma.lead.findMany({
          where: leadWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        }),
      ]);

      return NextResponse.json({
        items: leads.map((lead) => ({ ...lead, itemType: "lead" as const })),
        pagination: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) },
        counters,
      });
    }

    if (tipo === "contato") {
      const [total, contatos] = await Promise.all([
        prisma.contato.count({ where: contatoWhere }),
        prisma.contato.findMany({
          where: contatoWhere,
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        }),
      ]);

      return NextResponse.json({
        items: contatos.map((contato) => ({ ...contato, itemType: "contato" as const })),
        pagination: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) },
        counters,
      });
    }

    const [leads, contatos] = await Promise.all([
      prisma.lead.findMany({ where: leadWhere, orderBy: { createdAt: "desc" }, take: 500 }),
      prisma.contato.findMany({ where: contatoWhere, orderBy: { createdAt: "desc" }, take: 500 }),
    ]);

    const allSorted = [
      ...leads.map((lead) => ({ ...lead, itemType: "lead" as const, sortDate: lead.createdAt })),
      ...contatos.map((contato) => ({ ...contato, itemType: "contato" as const, sortDate: contato.createdAt })),
    ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

    // Deduplicate: same email + normalized phone → keep most recent only
    const seenKeys = new Set<string>();
    const dedupedAll = allSorted.filter((item) => {
      const phone = (item.telefone ?? "").replace(/\D/g, "");
      const key = phone
        ? `${item.email.toLowerCase()}::${phone}`
        : `__unique__${item.id}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    const total = dedupedAll.length;
    const merged = dedupedAll
      .slice(skip, skip + perPage)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ sortDate, ...item }) => item);

    return NextResponse.json({
      items: merged,
      pagination: { page, perPage, total, totalPages: Math.max(1, Math.ceil(total / perPage)) },
      counters,
    });
  } catch (error) {
    console.error("[admin/leads/pipeline GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
