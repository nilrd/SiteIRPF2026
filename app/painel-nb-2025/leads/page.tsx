"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LeadsActions from "./LeadsActions";
import LeadsFilters, { FiltersState } from "@/components/admin/LeadsFilters";
import LeadsTableRow from "@/components/admin/LeadsTableRow";

type PipelineItem = {
  itemType: "lead" | "contato";
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  tipoDecl?: string | null;
  assunto?: string | null;
  origem: string;
  status: string;
  createdAt: string;
  mensagem: string;
};

type PipelineResponse = {
  items: PipelineItem[];
  pagination: { page: number; perPage: number; total: number; totalPages: number };
  counters: { novos: number; em_contato: number; convertidos: number; perdidos: number; nao_lidos: number };
};

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
    items: PipelineItem[];
    pagination: { page: number; perPage: number; total: number; totalPages: number };
    counters: { novos: number; em_contato: number; convertidos: number; perdidos: number; nao_lidos: number };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

      const result = (await response.json()) as PipelineResponse;
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

  // Handle status update
  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    setIsUpdatingStatus(true);

    try {
      const item = data?.items.find((itemCandidate) => itemCandidate.id === itemId);
      if (!item) return;

      const endpoint =
        item.itemType === "lead"
          ? `/api/admin/leads/${itemId}/status`
          : `/api/admin/leads/contatos/${itemId}/status`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-white/50">Carregando...</div>
        </main>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Leads & Contatos</h1>
          <LeadsActions />
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

        {/* Unified Leads & Contatos Table */}
        <h2 className="font-serif text-xl mb-4">
          Resultados ({data?.pagination.total || 0})
        </h2>
        <div className="overflow-x-auto mb-8">
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
