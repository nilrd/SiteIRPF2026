"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LeadsActions from "./LeadsActions";
import LeadsFilters, { FiltersState } from "@/components/admin/LeadsFilters";
import LeadsTableRow from "@/components/admin/LeadsTableRow";
import KanbanView from "@/components/admin/KanbanView";
import type { AdminPipelineItem, AdminPipelineResponse } from "@/lib/admin-pipeline-types";

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [filters, setFilters] = useState<FiltersState>({
    q: "",
    tipo: "todos",
    status: "",
    origem: "",
    page: 1,
  });

  const [data, setData] = useState<{
    items: AdminPipelineItem[];
    pagination: { page: number; perPage: number; total: number; totalPages: number };
    counters: { novos: number; em_contato: number; convertidos: number; perdidos: number; nao_lidos: number };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [view, setView] = useState<"table" | "kanban">("table");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/painel-nb-2025?callbackUrl=%2Fpainel-nb-2025%2Fleads");
    }
  }, [status, router]);

  // Fetch pipeline data
  const fetchPipeline = async (filtersToUse: FiltersState) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filtersToUse.q) params.append("q", filtersToUse.q);
      if (filtersToUse.tipo) params.append("tipo", filtersToUse.tipo);
      if (filtersToUse.status) params.append("status", filtersToUse.status);
      if (filtersToUse.origem) params.append("origem", filtersToUse.origem);
      params.append("page", String(filtersToUse.page));
      params.append("per_page", "50");

      const response = await fetch(`/api/admin/leads/pipeline?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar pipeline: ${response.statusText}`);
      }

      const result = (await response.json()) as AdminPipelineResponse;
      setData(result);
      setFilters(filtersToUse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  // On component mount, load initial data
  useEffect(() => {
    if (session) {
      fetchPipeline({
        q: "",
        tipo: "todos",
        status: "",
        origem: "",
        page: 1,
      });
    }
  }, [session]);

  // Handle filter change
  const handleFiltersChange = (newFilters: FiltersState) => {
    fetchPipeline(newFilters);
  };

  // Handle delete
  const handleDelete = async (itemId: string, itemType: "lead" | "contato") => {
    try {
      const item = data?.items.find((itemCandidate) => itemCandidate.id === itemId);
      const targetId = item?.latestSourceId || itemId;
      const targetType = item?.latestSourceType || itemType;

      const res = await fetch(`/api/admin/leads/${targetId}?tipo=${targetType}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      await fetchPipeline(filters);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    setIsUpdatingStatus(true);

    try {
      const item = data?.items.find((itemCandidate) => itemCandidate.id === itemId);
      if (!item) return;

      const response = await fetch(`/api/admin/leads/group-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          relatedItems: item.relatedItems.map((relatedItem) => ({
            id: relatedItem.id,
            itemType: relatedItem.itemType,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status");
      }

      // Refresh data after update
      await fetchPipeline(filters);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle pagination
  const handlePrevPageClick = () => {
    if (filters.page > 1) {
      fetchPipeline({ ...filters, page: filters.page - 1 });
    }
  };

  const handleNextPageClick = () => {
    if (data?.pagination && filters.page < data.pagination.totalPages) {
      fetchPipeline({ ...filters, page: filters.page + 1 });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
      <main className="flex-1 pt-16 md:pt-0 p-4 md:p-8 flex items-center justify-center">
          <div className="text-white/50">Carregando...</div>
        </main>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 pt-16 md:pt-0 p-4 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Leads & Contatos</h1>
          <div className="flex items-center gap-3">
            {/* Toggle visão */}
            <div className="flex border border-white/20">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                  view === "table" ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Tabela
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                  view === "kanban" ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Kanban
              </button>
            </div>
            <LeadsActions />
          </div>
        </div>

        {/* Filters */}
        <LeadsFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

        {/* Counters */}
        {data?.counters && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Novos</div>
              <div className="font-serif text-2xl">{data.counters.novos}</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Em Contato</div>
              <div className="font-serif text-2xl">{data.counters.em_contato}</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Convertidos</div>
              <div className="font-serif text-2xl">{data.counters.convertidos}</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Perdidos</div>
              <div className="font-serif text-2xl">{data.counters.perdidos}</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Não Lidos</div>
              <div className="font-serif text-2xl">{data.counters.nao_lidos}</div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Resultados */}
        <h2 className="font-serif text-xl mb-4">
          Resultados ({data?.pagination.total || 0})
        </h2>

        {view === "kanban" ? (
          /* Kanban View */
          <div className="mb-8">
            {data?.items && data.items.length > 0 ? (
              <KanbanView
                items={data.items}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdatingStatus}
              />
            ) : (
              <div className="py-16 text-center opacity-40 text-sm">
                {isLoading ? "Carregando..." : "Nenhum resultado encontrado"}
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div className="mb-8">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Nome</th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Email</th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Telefone</th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">
                      {filters.tipo === "lead" ? "Tipo" : "Assunto"}
                    </th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Origem</th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Status</th>
                    <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Data</th>
                    <th className="py-3 text-[10px] uppercase tracking-widest opacity-50">Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items && data.items.length > 0 ? (
                    data.items.map((item) => (
                      <LeadsTableRow
                        key={item.id}
                        item={item}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDelete}
                        isUpdating={isUpdatingStatus}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center opacity-40">
                        {isLoading ? "Carregando..." : "Nenhum resultado encontrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {data?.items && data.items.length > 0 ? (
                data.items.map((item) => {
                  const isLead = item.itemType === "lead";
                  const servico = item.servicos[0] || item.tipoDecl || item.assunto || "—";
                  const statusColors: Record<string, string> = {
                    novo: "text-white bg-white/10",
                    em_contato: "text-yellow-300 bg-yellow-500/15",
                    convertido: "text-green-300 bg-green-500/15",
                    perdido: "text-red-300 bg-red-500/15",
                  };
                  return (
                    <div key={item.id} className="border border-white/10 bg-[#111] p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{item.nome}</p>
                          <p className="text-xs opacity-50 truncate">{item.email}</p>
                          <p className="text-[10px] uppercase tracking-widest opacity-35 mt-1">
                            {item.registrationCount} cadastro{item.registrationCount > 1 ? "s" : ""} • {item.messageCount} mensagem{item.messageCount !== 1 ? "ens" : ""}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${statusColors[item.status] || "bg-white/10 text-white"}`}>
                            {item.status}
                          </span>
                          <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${isLead ? "border-[#C6FF00]/40 text-[#C6FF00]" : "border-blue-400/40 text-blue-400"}`}>
                            {isLead ? "Lead" : "Ctto"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs space-y-1 opacity-60">
                        {item.telefone && (
                          <a href={`tel:${item.telefone.replace(/\D/g, "")}`} className="block hover:text-[#C6FF00] transition-colors">
                            {item.telefone}
                          </a>
                        )}
                        <p className="truncate">{servico}</p>
                        <p className="opacity-70">
                          {item.origens.join(" • ") || item.origem} · {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {item.mensagem && (
                        <p className="text-[11px] opacity-30 line-clamp-2">{item.mensagem}</p>
                      )}
                      <div className="flex gap-2 pt-1">
                        {item.telefone && (
                          <a
                            href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 text-center text-[10px] uppercase tracking-widest bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366]"
                          >
                            WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, item.itemType)}
                          className="px-3 py-2 text-[10px] uppercase tracking-widest border border-red-500/30 text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center opacity-40 text-sm">
                  {isLoading ? "Carregando..." : "Nenhum resultado encontrado"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-60">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPageClick}
                disabled={data.pagination.page === 1 || isLoading}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={handleNextPageClick}
                disabled={data.pagination.page >= data.pagination.totalPages || isLoading}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
