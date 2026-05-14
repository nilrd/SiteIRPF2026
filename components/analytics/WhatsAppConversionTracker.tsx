"use client";

import { useEffect } from "react";

const GOOGLE_ADS_SEND_TO = "AW-18158780982/9eoECP-48qwcELaE5NJD";
const WHATSAPP_HREF_RE = /(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp)/i;
const FALLBACK_REDIRECT_MS = 1200;

type GtagParams = {
  send_to: string;
  event_callback?: () => void;
};

type GtagFn = (command: "event", eventName: string, params: GtagParams) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

function isWhatsAppUrl(url: string): boolean {
  return WHATSAPP_HREF_RE.test(url);
}

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1;
}

function reportConversionThenNavigate(url: string, navigate: () => void): boolean {
  let didNavigate = false;

  const callback = () => {
    if (didNavigate) return;
    didNavigate = true;
    navigate();
  };

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: GOOGLE_ADS_SEND_TO,
        event_callback: callback,
      });
      window.setTimeout(callback, FALLBACK_REDIRECT_MS);
      return false;
    }
  } catch {
    // Nunca bloqueia a navegação se o gtag falhar.
  }

  callback();
  return false;
}

export default function WhatsAppConversionTracker() {
  useEffect(() => {
    window.gtag_report_conversion = (url?: string): boolean => {
      const nextUrl = url || "";
      if (!nextUrl) return false;

      return reportConversionThenNavigate(nextUrl, () => {
        window.location.assign(nextUrl);
      });
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.href || anchor.getAttribute("href") || "";
      if (!href || !isWhatsAppUrl(href)) return;

      // Evita eventos duplicados em cliques rápidos no mesmo elemento.
      if (anchor.dataset.gtagWaInFlight === "1") {
        event.preventDefault();
        return;
      }
      anchor.dataset.gtagWaInFlight = "1";

      const openInNewTab = anchor.target === "_blank" || isModifiedClick(event);
      event.preventDefault();

      reportConversionThenNavigate(href, () => {
        if (openInNewTab) {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          window.location.assign(href);
        }
        window.setTimeout(() => {
          delete anchor.dataset.gtagWaInFlight;
        }, 300);
      });
    };

    document.addEventListener("click", onDocumentClick, true);

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      delete window.gtag_report_conversion;
    };
  }, []);

  return null;
}
