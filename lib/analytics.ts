/**
 * Rastreamento GA4 — utilitário client-side.
 * Seguro chamar de qualquer parte: a função verifica window antes de executar.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag("event", name, params ?? {});
}

/**
 * Rastreamento FB Pixel — dispara evento padrão ou customizado.
 * Seguro chamar mesmo sem pixel configurado.
 */
export function trackFbEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq !== "function") return;
  w.fbq("track", event, params ?? {});
}

/**
 * Dispara Lead em GA4 + FB Pixel simultaneamente.
 * Chamar após envio bem-sucedido de formulário de lead/contato.
 */
export function trackLead(origem: string) {
  trackEvent("generate_lead", { event_category: "lead", event_label: origem });
  trackFbEvent("Lead", { content_name: origem });
}
