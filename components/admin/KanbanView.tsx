"use client";

import { useState } from "react";
import ModalDetalheMensagem from "@/components/admin/ModalDetalheMensagem";

type KanbanItem = {
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

interface KanbanViewProps {
  items: KanbanItem[];
  onStatusUpdate?: (itemId: string, newStatus: string) => void;
  isUpdating?: boolean;
}

const COLUMNS = [
  { key: "novo", label: "Novo", color: "border-white/20", dot: "bg-white/60" },
  { key: "em_contato", label: "Em Contato", color: "border-yellow-500/40", dot: "bg-yellow-400" },
  { key: "convertido", label: "Convertido", color: "border-green-500/40", dot: "bg-green-400" },
  { key: "perdido", label: "Perdido", color: "border-red-500/40", dot: "bg-red-400" },
] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function KanbanCard({
  item,
  onStatusUpdate,
  isUpdating,
}: {
  item: KanbanItem;
  onStatusUpdate?: (id: string, status: string) => void;
  isUpdating?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nextStatuses = COLUMNS.map((c) => c.key).filter((k) => k !== item.status);

  return (
    <>
      <div className="bg-white/5 border border-white/10 p-4 space-y-3 hover:bg-white/8 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{item.nome}</p>
            <p className="text-[11px] text-white/50 truncate">{item.email}</p>
          </div>
          <span className="shrink-0 text-[9px] uppercase tracking-widest px-2 py-0.5 border border-white/20 opacity-60">
            {item.itemType}
          </span>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-2 text-[10px] text-white/50">
          {item.telefone && <span>{item.telefone}</span>}
          <span className="opacity-40">·</span>
          <span>{item.origem}</span>
          <span className="opacity-40">·</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>

        {/* Assunto/tipo */}
        {(item.tipoDecl || item.assunto) && (
          <p className="text-[11px] text-white/60 truncate">
            {item.tipoDecl || item.assunto}
          </p>
        )}

        {/* Message preview */}
        {item.mensagem && (
          <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
            {item.mensagem}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            Ver msg
          </button>

          <span className="text-white/20">|</span>

          {/* Move to status menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              disabled={isUpdating}
              className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors disabled:opacity-30"
            >
              Mover ▾
            </button>
            {isMenuOpen && (
              <div className="absolute bottom-full left-0 mb-1 z-20 bg-[#111] border border-white/20 min-w-[130px]">
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onStatusUpdate?.(item.id, s);
                    }}
                    className="block w-full text-left px-3 py-2 text-[11px] hover:bg-white/10 transition-colors"
                  >
                    {COLUMNS.find((c) => c.key === s)?.label ?? s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalDetalheMensagem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
      />
    </>
  );
}

export default function KanbanView({ items, onStatusUpdate, isUpdating }: KanbanViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colItems = items.filter((i) => i.status === col.key);
        return (
          <div key={col.key} className={`border-t-2 ${col.color} pt-4`}>
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className="text-[11px] uppercase tracking-widest font-medium">
                {col.label}
              </span>
              <span className="ml-auto text-[10px] opacity-40">
                {colItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {colItems.length === 0 ? (
                <div className="text-[11px] text-white/20 py-6 text-center border border-dashed border-white/10">
                  Vazio
                </div>
              ) : (
                colItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onStatusUpdate={onStatusUpdate}
                    isUpdating={isUpdating}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
