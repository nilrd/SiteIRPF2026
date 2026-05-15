"use client";

import { useState } from "react";
import ModalDetalheMensagem from "@/components/admin/ModalDetalheMensagem";
import { buildWhatsAppLink } from "@/lib/whatsapp-link";

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
  {
    key: "novo",
    label: "Novo",
    borderColor: "border-t-white/60",
    dot: "bg-white/80",
    tabActiveColor: "text-white border-b-2 border-white",
    activeBg: "bg-white/5",
  },
  {
    key: "em_contato",
    label: "Em Contato",
    borderColor: "border-t-yellow-400",
    dot: "bg-yellow-400",
    tabActiveColor: "text-yellow-400 border-b-2 border-yellow-400",
    activeBg: "bg-yellow-400/8",
  },
  {
    key: "convertido",
    label: "Convertido",
    borderColor: "border-t-green-400",
    dot: "bg-green-400",
    tabActiveColor: "text-green-400 border-b-2 border-green-400",
    activeBg: "bg-green-400/8",
  },
  {
    key: "perdido",
    label: "Perdido",
    borderColor: "border-t-red-400",
    dot: "bg-red-400",
    tabActiveColor: "text-red-400 border-b-2 border-red-400",
    activeBg: "bg-red-400/8",
  },
] as const;

type ColKey = (typeof COLUMNS)[number]["key"];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (mins > 0) return `${mins}min atrás`;
  return "agora";
}

function formatDate(dateStr: string): string {
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
  isDragged,
  onDragStart,
  onDragEnd,
}: {
  item: KanbanItem;
  onStatusUpdate?: (id: string, status: string) => void;
  isUpdating?: boolean;
  isDragged: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const otherCols = COLUMNS.filter((c) => c.key !== item.status);
  const servico = item.tipoDecl || item.assunto || "Consultoria IRPF";
  const waLink = item.telefone
    ? buildWhatsAppLink(item.telefone, item.nome, servico, item.origem)
    : "";
  const isLead = item.itemType === "lead";

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          onDragStart(item.id);
        }}
        onDragEnd={onDragEnd}
        className={`
          relative bg-[#141414] border border-white/10 cursor-grab active:cursor-grabbing
          hover:border-white/30 hover:shadow-lg hover:shadow-black/40 transition-all duration-150
          ${isDragged ? "opacity-40 scale-[0.97]" : ""}
        `}
      >
        {/* Type accent bar */}
        <div className={`h-[3px] ${isLead ? "bg-[#C6FF00]" : "bg-blue-400"}`} />

        <div className="p-4 space-y-3">
          {/* Header: name + type badge */}
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-sm leading-tight">{item.nome}</p>
            <span
              className={`shrink-0 text-[9px] uppercase tracking-widest px-1.5 py-0.5 border ${
                isLead
                  ? "border-[#C6FF00]/40 text-[#C6FF00]"
                  : "border-blue-400/40 text-blue-400"
              }`}
            >
              {isLead ? "Lead" : "Ctto"}
            </span>
          </div>

          {/* Contact info */}
          <div className="space-y-0.5 text-xs opacity-60">
            <p className="truncate">{item.email}</p>
            {item.telefone && (
              <a
                href={`tel:${item.telefone.replace(/\D/g, "")}`}
                className="block hover:opacity-100 hover:text-[#C6FF00] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.telefone}
              </a>
            )}
          </div>

          {/* Service + origin tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 bg-white/8 border border-white/10 text-white/50 truncate max-w-[120px]">
              {servico}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-white/8 border border-white/10 text-white/40">
              {item.origem}
            </span>
          </div>

          {/* Message preview */}
          {item.mensagem && (
            <p className="text-[11px] opacity-40 line-clamp-2 leading-relaxed">
              {item.mensagem}
            </p>
          )}

          {/* Date */}
          <div className="text-[10px] opacity-30 flex items-center justify-between pt-1 border-t border-white/5">
            <span>{formatDate(item.createdAt)}</span>
            <span>{timeAgo(item.createdAt)}</span>
          </div>

          {/* Actions — always visible */}
          <div className="flex flex-wrap gap-2 pt-1">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center py-2 text-[10px] uppercase tracking-widest bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
              >
                WhatsApp
              </a>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2 text-[10px] uppercase tracking-widest bg-white/8 border border-white/15 text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            >
              Detalhes
            </button>

            {/* Move status dropdown */}
            <div className="relative w-full">
              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                disabled={isUpdating}
                className="w-full py-2 text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                Mover para →
              </button>
              {isMenuOpen && (
                <div className="absolute z-30 bottom-full mb-1 left-0 right-0 bg-[#0A0A0A] border border-white/20 shadow-xl">
                  {otherCols.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onStatusUpdate?.(item.id, col.key);
                      }}
                      disabled={isUpdating}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-[11px] hover:bg-white/10 transition-colors text-white/70 hover:text-white disabled:opacity-40"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
                      {col.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

function KanbanColumn({
  col,
  items,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onStatusUpdate,
  isUpdating,
  draggedId,
  onDragStart,
  onDragEnd,
}: {
  col: (typeof COLUMNS)[number];
  items: KanbanItem[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isUpdating?: boolean;
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        flex-none w-[272px] flex flex-col border-t-2 ${col.borderColor}
        transition-colors duration-150
        ${isDragOver ? col.activeBg + " ring-1 ring-white/20 ring-inset" : "bg-[#0D0D0D]"}
      `}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-white/5">
        <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
        <span className="text-[11px] uppercase tracking-widest font-bold text-white/80 flex-1">
          {col.label}
        </span>
        <span className="text-[12px] font-bold tabular-nums text-white/40 min-w-[20px] text-right">
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-2"
        style={{ maxHeight: "calc(100vh - 340px)", minHeight: "120px" }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/8 mx-1 mt-1">
            <p className="text-[10px] uppercase tracking-widest text-white/15">
              {isDragOver ? "Soltar aqui" : "Vazio"}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              onStatusUpdate={onStatusUpdate}
              isUpdating={isUpdating}
              isDragged={draggedId === item.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function KanbanView({ items, onStatusUpdate, isUpdating }: KanbanViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColKey | null>(null);
  const [mobileActiveCol, setMobileActiveCol] = useState<ColKey>("novo");

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colKey: ColKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  };

  const handleDrop = (e: React.DragEvent, colKey: ColKey) => {
    e.preventDefault();
    if (draggedId) {
      const dragged = items.find((i) => i.id === draggedId);
      if (dragged && dragged.status !== colKey) {
        onStatusUpdate?.(draggedId, colKey);
      }
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-white/40">
        <span>{items.length} item{items.length !== 1 ? "s" : ""} no board</span>
        {COLUMNS.map((col) => {
          const count = items.filter((i) => i.status === col.key).length;
          return count > 0 ? (
            <span key={col.key} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              {count} {col.label.toLowerCase()}
            </span>
          ) : null;
        })}
        {draggedId && (
          <span className="text-[#C6FF00]/60 ml-2">Arraste para uma coluna...</span>
        )}
      </div>

      {/* Mobile column tabs */}
      <div className="flex md:hidden border-b border-white/10">
        {COLUMNS.map((col) => {
          const count = items.filter((i) => i.status === col.key).length;
          const isActive = mobileActiveCol === col.key;
          return (
            <button
              key={col.key}
              onClick={() => setMobileActiveCol(col.key)}
              className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest transition-colors ${
                isActive ? col.tabActiveColor : "text-white/30 hover:text-white/60"
              }`}
            >
              {col.label}
              {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Desktop: all columns */}
      <div className="hidden md:flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "480px" }}>
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            col={col}
            items={items.filter((i) => i.status === col.key)}
            isDragOver={dragOverCol === col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={() => {
              if (dragOverCol === col.key) setDragOverCol(null);
            }}
            onDrop={(e) => handleDrop(e, col.key)}
            onStatusUpdate={onStatusUpdate}
            isUpdating={isUpdating}
            draggedId={draggedId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Mobile: single active column, full width */}
      <div className="md:hidden">
        {COLUMNS.filter((col) => col.key === mobileActiveCol).map((col) => {
          const colItems = items.filter((i) => i.status === col.key);
          return (
            <div key={col.key} className={`border-t-2 ${col.borderColor} bg-[#0D0D0D]`}>
              <div className="p-3 space-y-3">
                {colItems.length === 0 ? (
                  <div className="py-12 text-center text-[11px] opacity-20 uppercase tracking-widest">
                    Nenhum item
                  </div>
                ) : (
                  colItems.map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onStatusUpdate={onStatusUpdate}
                      isUpdating={isUpdating}
                      isDragged={false}
                      onDragStart={() => {}}
                      onDragEnd={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

