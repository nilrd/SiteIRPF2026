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
  const phone = telefone.replace(/\D/g, "");
  if (!phone) return "";

  const primeiroNome = nome.split(" ")[0] || "amigo";
  const servicoLabel = servico || "Consultoria IRPF";
  
  // Mensagem formatada com quebras de linha
  const message = `Olá ${primeiroNome}!

Vi que você entrou em contato sobre ${servicoLabel} via ${origem}.

Como posso ajudar você com sua IRPF 2026?

Consultoria IRPF NSB
`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/55${phone}?text=${encoded}`;
}

/**
 * Cria atalho rápido para WhatsApp direto sem pré-filled message
 * @param telefone - Número do telefone
 * @returns URL para abrir WhatsApp
 */
export function buildWhatsAppDirectLink(telefone: string): string {
  const phone = telefone.replace(/\D/g, "");
  return phone ? `https://wa.me/55${phone}` : "";
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
  const primeiroNome = nome.split(" ")[0] || "amigo";
  const servicoLabel = servico || "Consultoria IRPF";

  return `Olá ${primeiroNome}!

Vi que você entrou em contato sobre ${servicoLabel} via ${origem}.

Como posso ajudar você com sua IRPF 2026?

Consultoria IRPF NSB`;
}
