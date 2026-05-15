"use client";

import { buildWhatsAppLink, formatWhatsAppMessage } from "@/lib/whatsapp-link";

interface ModalDetalheMensagemProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    nome: string;
    email?: string | null;
    telefone?: string | null;
    mensagem?: string | null;
    origem?: string | null;
    origens?: string[];
    tipoDecl?: string | null;
    assunto?: string | null;
    servicos?: string[];
    sourceTypes?: Array<"lead" | "contato">;
    registrationCount?: number;
    messageCount?: number;
    relatedItems?: Array<{
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
      createdAt: string | Date;
      mensagem: string;
    }>;
    status?: string | null;
    createdAt?: string | Date | null;
    itemType: "lead" | "contato";
  };
}

export default function ModalDetalheMensagem({ isOpen, onClose, item }: ModalDetalheMensagemProps) {
  if (!isOpen) return null;

  const servico = item.itemType === "lead" ? item.tipoDecl || "Consultoria IRPF" : item.assunto || "Consultoria IRPF";
  const origem = item.origem || "site";
  const telefone = item.telefone || "";
  const whatsappLink = telefone ? buildWhatsAppLink(telefone, item.nome, servico, origem) : "";
  const suggestedMessage = formatWhatsAppMessage(telefone, item.nome, servico, origem);
  const hasHistory = (item.relatedItems?.length ?? 0) > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl bg-black border border-white/20 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="font-serif text-2xl">Detalhes da Mensagem</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl leading-none"
            aria-label="Fechar modal"
          >
            x
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Nome</p>
              <p className="text-lg font-semibold">{item.nome}</p>
            </div>
            {item.email && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Email</p>
                <a href={`mailto:${item.email}`} className="text-sm hover:text-[#C6FF00] transition-colors break-all">
                  {item.email}
                </a>
              </div>
            )}
            {item.telefone && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Telefone / WhatsApp</p>
                <a href={`tel:${item.telefone.replace(/\D/g, "")}`} className="text-sm hover:text-[#C6FF00] transition-colors">
                  {item.telefone}
                </a>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Tipo</p>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                item.itemType === "lead"
                  ? "border-[#C6FF00]/40 text-[#C6FF00]"
                  : "border-blue-400/40 text-blue-400"
              }`}>
                {item.itemType === "lead" ? "Lead" : "Contato"}
              </span>
            </div>
            {(item.tipoDecl || item.assunto) && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">
                  {item.itemType === "lead" ? "Tipo de Declaração" : "Assunto"}
                </p>
                <p className="text-sm opacity-80">{item.tipoDecl || item.assunto}</p>
              </div>
            )}
            {item.origem && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Origem</p>
                <p className="text-sm opacity-80">{item.origens?.join(" • ") || item.origem}</p>
              </div>
            )}
            {item.status && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Status</p>
                <p className="text-sm opacity-80">{item.status}</p>
              </div>
            )}
            {!!item.registrationCount && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Cadastros vinculados</p>
                <p className="text-sm opacity-80">{item.registrationCount}</p>
              </div>
            )}
            {!!item.messageCount && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Mensagens</p>
                <p className="text-sm opacity-80">{item.messageCount}</p>
              </div>
            )}
            {!!item.servicos?.length && (
              <div className="sm:col-span-2">
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Serviços / assuntos</p>
                <p className="text-sm opacity-80">{item.servicos.join(" • ")}</p>
              </div>
            )}
            {item.createdAt && (
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Recebido em</p>
                <p className="text-sm opacity-80">
                  {new Date(item.createdAt).toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Mensagem enviada</p>
            <div className="p-4 bg-white/5 border border-white/10 text-sm whitespace-pre-wrap">
              {item.mensagem || "Sem mensagem"}
            </div>
          </div>

          {hasHistory && (
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Linha do tempo de cadastros</p>
              <div className="space-y-3">
                {item.relatedItems?.map((relatedItem) => {
                  const label = relatedItem.itemType === "lead"
                    ? relatedItem.tipoDecl || relatedItem.servico || "Lead"
                    : relatedItem.assunto || "Contato";

                  return (
                    <div key={`${relatedItem.itemType}-${relatedItem.id}`} className="border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-semibold">{label}</p>
                          <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">
                            {relatedItem.itemType} • {relatedItem.origem} • {new Date(relatedItem.createdAt).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-white/10 text-white/60">
                          {relatedItem.status}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap text-white/80">
                        {relatedItem.mensagem || "Sem mensagem registrada"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Sugestao WhatsApp</p>
            <div className="p-4 bg-white/5 border border-white/10 text-sm whitespace-pre-wrap">
              {suggestedMessage}
            </div>
          </div>

          <div className="flex gap-3">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#20bd59] transition-colors"
              >
                Enviar via WhatsApp
              </a>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-white/10 border border-white/20 text-white/50 text-xs uppercase tracking-widest cursor-not-allowed"
              >
                Sem telefone
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/20 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
