"use client";

import { useState } from "react";
import ModalDetalheMensagem from "@/components/admin/ModalDetalheMensagem";
import type { AdminPipelineItem } from "@/lib/admin-pipeline-types";

export interface LeadsTableRowProps {
  item: AdminPipelineItem;
  onStatusUpdate?: (itemId: string, newStatus: string) => void;
  onDelete?: (itemId: string, itemType: "lead" | "contato") => void;
  isUpdating?: boolean;
}

const ALLOWED_STATUS = ["novo", "em_contato", "convertido", "perdido"] as const;

function getStatusColor(status: string) {
  switch (status) {
    case "convertido":
      return "bg-green-500/20 text-green-300";
    case "em_contato":
      return "bg-yellow-500/20 text-yellow-300";
    case "perdido":
      return "bg-red-500/20 text-red-300";
    default:
      return "bg-white/10 text-white";
  }
}

export default function LeadsTableRow({
  item,
  onStatusUpdate,
  onDelete,
  isUpdating = false,
}: LeadsTableRowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdatingLocal, setIsUpdatingLocal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Reseta confirmação após 4s se não confirmar
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    if (onDelete) onDelete(item.id, item.itemType);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingLocal(true);
    setIsDropdownOpen(false);

    if (onStatusUpdate) {
      await onStatusUpdate(item.id, newStatus);
    }

    setIsUpdatingLocal(false);
  };

  const isLead = item.itemType === "lead";
  const createdDate = new Date(item.createdAt).toLocaleDateString("pt-BR");

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-white/5">
        <td className="py-3 pr-4">
          <span>{item.nome}</span>
          <span className="block text-[10px] uppercase tracking-widest opacity-35 mt-1">
            {item.registrationCount} cadastro
            {item.registrationCount > 1 ? "s" : ""} • {item.messageCount}{" "}
            mensagem{item.messageCount !== 1 ? "ens" : ""}
          </span>
          {item.mensagem && (
            <span
              className="block text-[10px] opacity-40 max-w-[160px] truncate"
              title={item.mensagem}
            >
              {item.mensagem}
            </span>
          )}
        </td>
        <td className="py-3 pr-4 opacity-60">{item.email}</td>
        <td className="py-3 pr-4 opacity-60">
          {item.telefone ? (
            <a
              href={`tel:${item.telefone.replace(/\D/g, "")}`}
              className="hover:text-[#C6FF00] transition-colors"
            >
              {item.telefone}
            </a>
          ) : (
            "—"
          )}
        </td>
        <td className="py-3 pr-4 opacity-60">
          {item.servicos[0] ||
            (isLead
              ? item.tipoDecl || item.servico || "—"
              : item.assunto || "—")}
        </td>
        <td className="py-3 pr-4 opacity-60">
          {item.origens.join(" • ") || item.origem}
        </td>
        <td className="py-3 pr-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isUpdatingLocal || isUpdating}
              className={`text-[10px] uppercase tracking-widest px-2 py-1 ${getStatusColor(
                item.status,
              )} cursor-pointer hover:opacity-80 disabled:opacity-50 transition-opacity`}
            >
              {item.status}
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 bg-black border border-white/20 rounded-none shadow-lg">
                {ALLOWED_STATUS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdatingLocal || isUpdating}
                    className={`block w-full text-left px-3 py-2 text-xs uppercase tracking-widest ${
                      item.status === status
                        ? "bg-green-600/20"
                        : "hover:bg-white/10"
                    } disabled:opacity-50 transition-colors`}
                  >
                    {status === "novo"
                      ? "Novo"
                      : status === "em_contato"
                        ? "Em Contato"
                        : status === "convertido"
                          ? "Convertido"
                          : "Perdido"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </td>
        <td className="py-3 pr-4 opacity-40">{createdDate}</td>
        <td className="py-3">
          <div className="flex flex-col gap-1">
            {item.telefone && (
              <a
                href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 text-xs hover:underline"
              >
                WhatsApp
              </a>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white/70 text-xs hover:underline text-left"
            >
              Ver histórico
            </button>
            {!item.hasDuplicate && (
              <button
                onClick={handleDelete}
                className={`text-xs hover:underline text-left transition-colors ${
                  confirmDelete
                    ? "text-red-400 font-bold"
                    : "text-white/30 hover:text-red-400"
                }`}
              >
                {confirmDelete ? "Confirmar exclusão" : "Excluir"}
              </button>
            )}
          </div>
        </td>
      </tr>

      <ModalDetalheMensagem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={{
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          mensagem: item.mensagem,
          origem: item.origem,
          tipoDecl: item.tipoDecl,
          assunto: item.assunto,
          servicos: item.servicos,
          origens: item.origens,
          sourceTypes: item.sourceTypes,
          registrationCount: item.registrationCount,
          messageCount: item.messageCount,
          relatedItems: item.relatedItems,
          status: item.status,
          createdAt: item.createdAt,
          itemType: item.itemType,
        }}
      />
    </>
  );
}
