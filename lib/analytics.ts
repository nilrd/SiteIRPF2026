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
