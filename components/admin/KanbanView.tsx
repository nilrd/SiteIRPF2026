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
    headerBg: "bg-white/5",
    dot: "bg-white/80",
    countColor: "text-white/70",
  },
  {
    key: "em_contato",
    label: "Em Contato",
    borderColor: "border-t-yellow-400",
    headerBg: "bg-yellow-400/10",
    dot: "bg-yellow-400",
    countColor: "text-yellow-400",
  },
  {
    key: "convertido",
    label: "Convertido",
    borderColor: "border-t-green-400",
    headerBg: "bg-green-400/10",
    dot: "bg-green-400",
    countColor: "text-green-400",
  },
  {
    key: "perdido",
    label: "Perdido",
    borderColor: "border-t-red-400",
    headerBg: "bg-red-400/10",
    dot: "bg-red-400",
    countColor: "text-red-400",
  },
] as const;

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

  const nextStatuses = COLUMNS.filter((c) => c.key !== item.status);
  const servico = item.tipoDecl || item.assunto || "Consultoria IRPF";
  const waLink = item.telefone
    ? buildWhatsAppLink(item.telefone, item.nome, servico, item.origem)
    : "";
  const isLead = item.itemType === "lead";

  return (
    <>
      <div className="group relative bg-[#141414] border border-white/10 hover:border-white/25 hover:shadow-lg hover:shadow-black/40 transition-all duration-150">
        {/* Type accent top bar */}
        <div className={`h-[3px] ${isLead ? "bg-[#C6FF00]" : "bg-blue-400"}`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[13px] text-white leading-tight">{item.nome}</p>
              <p className="text-[11px] text-white/40 truncate mt-0.5">{item.email}</p>
            </div>
            <span
              className={`shrink-0 text-[9px] uppercase tracking-widest px-2 py-1 font-bold border ${
                isLead
                  ? "bg-[#C6FF00]/10 text-[#C6FF00] border-[#C6FF00]/30"
                  : "bg-blue-400/10 text-blue-400 border-blue-400/30"
              }`}
            >
              {item.itemType}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.origem && (
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 text-white/45">
                {item.origem}
              </span>
            )}
            {servico && servico !== "Consultoria IRPF" && (
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 text-white/45 max-w-[140px] truncate">
                {servico}
              </span>
            )}
            {item.telefone && (
              <span className="text-[9px] text-white/35">{item.telefone}</span>
            )}
          </div>

          {/* Message preview */}
          {item.mensagem && (
            <p className="text-[11px] text-white/30 line-clamp-2 leading-[1.6] mb-3 select-none">
              {item.mensagem}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-[10px] text-white/20">{timeAgo(item.createdAt)}</span>

            {/* Actions (always visible on mobile, hover on desktop) */}
            <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
              {/* WhatsApp */}
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 border border-green-500/40 text-green-400 hover:bg-green-400/10 transition-colors"
                  title="Enviar WhatsApp"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}

              {/* Ver mensagem */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-7 h-7 border border-white/20 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                title="Ver mensagem completa"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>

              {/* Mover */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen((v) => !v)}
                  disabled={isUpdating}
                  className="flex items-center justify-center w-7 h-7 border border-white/20 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30"
                  title="Mover para outra coluna"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 3 21 3 21 9"/>
                    <polyline points="9 21 3 21 3 15"/>
                    <line x1="21" y1="3" x2="14" y2="10"/>
                    <line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-1 z-30 bg-[#0A0A0A] border border-white/20 shadow-2xl shadow-black/60 min-w-[150px]">
                    <p className="px-3 pt-2.5 pb-1.5 text-[9px] uppercase tracking-widest text-white/30 border-b border-white/10">
                      Mover para
                    </p>
                    {nextStatuses.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => {
                          setIsMenuOpen(false);
                          onStatusUpdate?.(item.id, col.key);
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-[11px] hover:bg-white/8 transition-colors text-white/70 hover:text-white"
                      >
                        <span className={`w-2 h-2 rounded-full ${col.dot} shrink-0`} />
                        {col.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

export default function KanbanView({ items, onStatusUpdate, isUpdating }: KanbanViewProps) {
  const totalItems = items.length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-6 text-[11px] text-white/40">
        <span>{totalItems} item{totalItems !== 1 ? "s" : ""} no board</span>
        <div className="flex items-center gap-4">
          {COLUMNS.map((col) => {
            const count = items.filter((i) => i.status === col.key).length;
            return count > 0 ? (
              <span key={col.key} className={`${col.countColor} opacity-80`}>
                {count} {col.label.toLowerCase()}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "480px" }}>
        {COLUMNS.map((col) => {
          const colItems = items.filter((i) => i.status === col.key);
          return (
            <div
              key={col.key}
              className={`flex-none flex flex-col border-t-2 ${col.borderColor} bg-[#0D0D0D]`}
              style={{ width: "272px" }}
            >
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-3 ${col.headerBg} border-b border-white/5`}>
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <span className="text-[11px] uppercase tracking-widest font-bold text-white/80 flex-1">
                  {col.label}
                </span>
                <span className={`text-[12px] font-bold tabular-nums ${col.countColor} min-w-[20px] text-right`}>
                  {colItems.length}
                </span>
              </div>

              {/* Cards scroll area */}
              <div
                className="flex-1 overflow-y-auto p-2 space-y-2"
                style={{ maxHeight: "calc(100vh - 340px)" }}
              >
                {colItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/8 mx-1 mt-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/15">Nenhum item</p>
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
    </div>
  );
}

