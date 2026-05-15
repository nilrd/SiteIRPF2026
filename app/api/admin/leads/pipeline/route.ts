import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUS = ["novo", "em_contato", "convertido", "perdido"] as const;
const ALLOWED_TIPO = ["lead", "contato", "todos"] as const;
const STATUS_PRIORITY = {
  convertido: 4,
  em_contato: 3,
  novo: 2,
  perdido: 1,
} as const;

type AllowedTipo = (typeof ALLOWED_TIPO)[number];
type PipelineSourceItem = {
  itemType: "lead" | "contato";
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  tipoDecl?: string | null;
  servico?: string | null;
  assunto?: string | null;
  origem: string;
  status: string;
  createdAt: Date;
  mensagem?: string | null;
  sortDate: Date;
};

type PipelineGroupItem = {
  id: string;
  itemType: "lead" | "contato";
  latestSourceId: string;
  latestSourceType: "lead" | "contato";
  nome: string;
  email: string;
  telefone?: string | null;
  tipoDecl?: string | null;
  servico?: string | null;
  assunto?: string | null;
  origem: string;
  status: string;
  createdAt: Date;
  mensagem: string;
  sourceTypes: Array<"lead" | "contato">;
  origens: string[];
  servicos: string[];
  registrationCount: number;
  messageCount: number;
  hasDuplicate: boolean;
  relatedItems: Array<{
    id: string;
    itemType: "lead" | "contato";
    nome: string;
    email: string;
    telefone?: string | null;
    tipoDecl?: string | null;
    servico?: string | null;
    assunto?: string | null;
    origem: string;
    status: string;
    createdAt: Date;
    mensagem: string;
  }>;
};

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

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, "") ?? "";
}

function getGroupingKey(item: PipelineSourceItem) {
  const email = normalizeEmail(item.email);
  const phone = normalizePhone(item.telefone);

  if (email && phone) return `${email}::${phone}`;
  if (email) return `email::${email}`;
  if (phone) return `phone::${phone}`;

  return `single::${item.itemType}::${item.id}`;
}

function getServiceLabel(item: PipelineSourceItem) {
  if (item.itemType === "lead") {
    return item.tipoDecl?.trim() || item.servico?.trim() || null;
  }

  return item.assunto?.trim() || null;
}

function getGroupedStatus(items: PipelineGroupItem["relatedItems"]) {
  return [...items]
    .sort((a, b) => {
      const priorityDiff =
        (STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] ?? 0) -
        (STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] ?? 0);

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0]?.status ?? "novo";
}

function groupPipelineItems(items: PipelineSourceItem[]) {
  const groups = new Map<string, PipelineGroupItem>();

  for (const item of items) {
    const groupKey = getGroupingKey(item);
    const serviceLabel = getServiceLabel(item);
    const message = item.mensagem?.trim() || "";
    const existing = groups.get(groupKey);

    if (!existing) {
      groups.set(groupKey, {
        id: groupKey,
        itemType: item.itemType,
        latestSourceId: item.id,
        latestSourceType: item.itemType,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        tipoDecl: item.tipoDecl,
        servico: item.servico,
        assunto: item.assunto,
        origem: item.origem,
        status: item.status,
        createdAt: item.createdAt,
        mensagem: message,
        sourceTypes: [item.itemType],
        origens: item.origem ? [item.origem] : [],
        servicos: serviceLabel ? [serviceLabel] : [],
        registrationCount: 1,
        messageCount: message ? 1 : 0,
        hasDuplicate: false,
        relatedItems: [
          {
            id: item.id,
            itemType: item.itemType,
            nome: item.nome,
            email: item.email,
            telefone: item.telefone,
            tipoDecl: item.tipoDecl,
            servico: item.servico,
            assunto: item.assunto,
            origem: item.origem,
            status: item.status,
            createdAt: item.createdAt,
            mensagem: message,
          },
        ],
      });
      continue;
    }

    existing.relatedItems.push({
      id: item.id,
      itemType: item.itemType,
      nome: item.nome,
      email: item.email,
      telefone: item.telefone,
      tipoDecl: item.tipoDecl,
      servico: item.servico,
      assunto: item.assunto,
      origem: item.origem,
      status: item.status,
      createdAt: item.createdAt,
      mensagem: message,
    });
    existing.registrationCount += 1;
    existing.messageCount += message ? 1 : 0;
    existing.hasDuplicate = existing.registrationCount > 1;

    if (!existing.sourceTypes.includes(item.itemType)) {
      existing.sourceTypes.push(item.itemType);
    }

    if (item.origem && !existing.origens.includes(item.origem)) {
      existing.origens.push(item.origem);
    }

    if (serviceLabel && !existing.servicos.includes(serviceLabel)) {
      existing.servicos.push(serviceLabel);
    }
  }

  return Array.from(groups.values())
    .map((group) => {
      const relatedItems = [...group.relatedItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latest = relatedItems[0];

      return {
        ...group,
        itemType: latest?.itemType ?? group.itemType,
        latestSourceId: latest?.id ?? group.latestSourceId,
        latestSourceType: latest?.itemType ?? group.latestSourceType,
        nome: latest?.nome ?? group.nome,
        email: latest?.email ?? group.email,
        telefone: latest?.telefone ?? group.telefone,
        tipoDecl: latest?.tipoDecl ?? group.tipoDecl,
        servico: latest?.servico ?? group.servico,
        assunto: latest?.assunto ?? group.assunto,
        origem: latest?.origem ?? group.origem,
        createdAt: latest?.createdAt ?? group.createdAt,
        mensagem: latest?.mensagem ?? group.mensagem,
        status: getGroupedStatus(relatedItems),
        relatedItems,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

    const [leads, contatos] = await Promise.all([
      tipo === "contato"
        ? Promise.resolve([])
        : prisma.lead.findMany({ where: leadWhere, orderBy: { createdAt: "desc" } }),
      tipo === "lead"
        ? Promise.resolve([])
        : prisma.contato.findMany({ where: contatoWhere, orderBy: { createdAt: "desc" } }),
    ]);

    const groupedItems = groupPipelineItems([
      ...leads.map((lead) => ({
        ...lead,
        itemType: "lead" as const,
        sortDate: lead.createdAt,
      })),
      ...contatos.map((contato) => ({
        ...contato,
        itemType: "contato" as const,
        sortDate: contato.createdAt,
      })),
    ]);

    const total = groupedItems.length;
    const merged = groupedItems.slice(skip, skip + perPage);

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
