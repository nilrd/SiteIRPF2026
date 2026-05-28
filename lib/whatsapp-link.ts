import { buildWhatsAppWaMeUrl, normalizeBrPhone } from "@/lib/phone-validation";

const ORIGEM_LABELS: Record<string, string> = {
  "exit-intent": "modal de saída do site",
  "declarar-agora": "página Declarar Agora",
  "blog-sticky-bar": "barra do blog",
  mei: "página MEI",
  site: "site",
};

function toOrigemMensagem(origem: string): string {
  const normalized = (origem || "site").trim().toLowerCase();
  return ORIGEM_LABELS[normalized] ?? normalized.replace(/[-_]/g, " ");
}

/**
 * Constrói link WhatsApp com mensagem pré-filled contextualizada
 * @param telefone - Número do telefone (com ou sem caracteres especiais)
 * @param nome - Nome do contato
 * @param servico - Tipo de serviço (ex: "Declaração IRPF", "Retificação")
 * @param origem - Canal de origem (ex: "site", "instagram", "email")
 * @returns URL para abrir WhatsApp com mensagem pré-preenchida
 */
export function buildWhatsAppLink(
  telefone: string,
  nome: string,
  servico: string = "Consultoria IRPF",
  origem: string = "site"
): string {
  const waBaseUrl = buildWhatsAppWaMeUrl(telefone);
  if (!waBaseUrl) return "";

  const primeiroNome = nome.split(" ")[0] || "amigo";
  const servicoLabel = servico || "Consultoria IRPF";
  const origemLabel = toOrigemMensagem(origem);
  
  // Mensagem formatada com quebras de linha
  const message = `Olá ${primeiroNome}!

Vi que você entrou em contato sobre ${servicoLabel} pelo canal ${origemLabel}.

Sou o Nilson Brites e posso te ajudar com sua IRPF 2026 de ponta a ponta.

Se você quiser, já te explico agora os próximos passos e os documentos ideais para o seu caso.

Nilson Brites | Consultoria IRPF
`;

  const encoded = encodeURIComponent(message);
  return `${waBaseUrl}?text=${encoded}`;
}

/**
 * Cria atalho rápido para WhatsApp direto sem pré-filled message
 * @param telefone - Número do telefone
 * @returns URL para abrir WhatsApp
 */
export function buildWhatsAppDirectLink(telefone: string): string {
  return buildWhatsAppWaMeUrl(telefone);
}

/**
 * Formata mensagem para exibição em modal
 * @param telefone - Número do telefone
 * @param nome - Nome do contato
 * @param servico - Tipo de serviço
 * @param origem - Canal de origem
 * @returns Mensagem formatada e legível
 */
export function formatWhatsAppMessage(
  telefone: string,
  nome: string,
  servico: string = "Consultoria IRPF",
  origem: string = "site"
): string {
  const phone = normalizeBrPhone(telefone);
  if (!phone) return "";

  const primeiroNome = nome.split(" ")[0] || "amigo";
  const servicoLabel = servico || "Consultoria IRPF";
  const origemLabel = toOrigemMensagem(origem);

  return `Olá ${primeiroNome}!

Vi que você entrou em contato sobre ${servicoLabel} pelo canal ${origemLabel}.

Sou o Nilson Brites e posso te ajudar com sua IRPF 2026 de ponta a ponta.

Se você quiser, já te explico agora os próximos passos e os documentos ideais para o seu caso.

Nilson Brites | Consultoria IRPF`;
}
