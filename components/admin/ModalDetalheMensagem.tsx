"use client";

import { buildWhatsAppLink, formatWhatsAppMessage } from "@/lib/whatsapp-link";

interface ModalDetalheMensagemProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    nome: string;
    telefone?: string | null;
    mensagem?: string | null;
    origem?: string | null;
    tipoDecl?: string | null;
    assunto?: string | null;
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
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Contato</p>
            <p className="text-lg">{item.nome}</p>
            {item.telefone && <p className="text-sm opacity-60">{item.telefone}</p>}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">Mensagem enviada</p>
            <div className="p-4 bg-white/5 border border-white/10 text-sm whitespace-pre-wrap">
              {item.mensagem || "Sem mensagem"}
            </div>
          </div>

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
