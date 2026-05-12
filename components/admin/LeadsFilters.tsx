"use client";

import { useState } from "react";

export interface FiltersState {
  q: string;
  tipo: "lead" | "contato" | "todos";
  status: string;
  origem: string;
  page: number;
}

export interface LeadsFiltersProps {
  onFiltersChange: (filters: FiltersState) => void;
  isLoading?: boolean;
}

const ALLOWED_STATUS = ["novo", "em_contato", "convertido", "perdido"] as const;

export default function LeadsFilters({ onFiltersChange, isLoading = false }: LeadsFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    q: "",
    tipo: "todos",
    status: "",
    origem: "",
    page: 1,
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    onFiltersChange({ ...filters, page: 1 });
  };

  const handleReset = () => {
    const defaultFilters: FiltersState = {
      q: "",
      tipo: "todos",
      status: "",
      origem: "",
      page: 1,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-none">
      <h3 className="font-serif text-lg mb-4">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Buscar (nome, email, telefone)
          </label>
          <input
            type="text"
            placeholder="ex: Nilson"
            value={filters.q}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Tipo Dropdown */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Tipo
          </label>
          <select
            value={filters.tipo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, tipo: e.target.value as FiltersState["tipo"] }))
            }
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-green-600"
          >
            <option value="todos">Todos</option>
            <option value="lead">Apenas Leads</option>
            <option value="contato">Apenas Contatos</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-green-600"
          >
            <option value="">-- Todos os status --</option>
            {ALLOWED_STATUS.map((s) => (
              <option key={s} value={s}>
                {s === "novo"
                  ? "Novo"
                  : s === "em_contato"
                  ? "Em Contato"
                  : s === "convertido"
                  ? "Convertido"
                  : "Perdido"}
              </option>
            ))}
          </select>
        </div>

        {/* Origem Input */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Origem
          </label>
          <input
            type="text"
            placeholder="ex: site, whatsapp"
            value={filters.origem}
            onChange={(e) => setFilters((prev) => ({ ...prev, origem: e.target.value }))}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-600"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-black font-bold text-xs uppercase tracking-widest hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-6 py-2 bg-white/10 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
