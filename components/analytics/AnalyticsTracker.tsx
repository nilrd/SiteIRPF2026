"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return "mobile";
  if (/iPad|Tablet/.test(ua)) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (/Mac OS/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

async function sendEvent(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // silent — analytics never breaks the app
  }
}

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTimeRef = useRef<number>(0);
  const scrollDepthRef = useRef<Set<number>>(new Set());
  const sentLeaveRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    scrollDepthRef.current = new Set();
    sentLeaveRef.current = false;

    // Session ID — persists across pages in same tab
    let sessionId = sessionStorage.getItem("_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("_sid", sessionId);
    }

    const page = pathname;
    const referrer = document.referrer || undefined;

    // UTMs — read from URL or fall back to persisted session values
    const utmSource =
      searchParams.get("utm_source") ||
      sessionStorage.getItem("_utm_source") ||
      undefined;
    const utmMedium =
      searchParams.get("utm_medium") ||
      sessionStorage.getItem("_utm_medium") ||
      undefined;
    const utmCampaign =
      searchParams.get("utm_campaign") ||
      sessionStorage.getItem("_utm_campaign") ||
      undefined;
    const utmContent = searchParams.get("utm_content") || undefined;
    const utmTerm = searchParams.get("utm_term") || undefined;

    // Persist UTMs for subsequent pages in same session
    if (searchParams.get("utm_source")) sessionStorage.setItem("_utm_source", searchParams.get("utm_source")!);
    if (searchParams.get("utm_medium")) sessionStorage.setItem("_utm_medium", searchParams.get("utm_medium")!);
    if (searchParams.get("utm_campaign")) sessionStorage.setItem("_utm_campaign", searchParams.get("utm_campaign")!);

    // Pageview
    sendEvent({
      sessionId,
      type: "pageview",
      page,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      device: getDevice(),
      browser: getBrowser(),
      os: getOS(),
      screenW: window.screen.width,
      screenH: window.screen.height,
    });

    // Scroll depth
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const pct = Math.round((scrolled / total) * 100);
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !scrollDepthRef.current.has(threshold)) {
          scrollDepthRef.current.add(threshold);
          sendEvent({ sessionId, type: "scroll", page, scrollDepth: threshold });
        }
      }
    };

    // CTA / WhatsApp click tracking
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a") as HTMLAnchorElement | null;
      const button = target.closest("button") as HTMLButtonElement | null;
      const el = (link || button) as HTMLElement | null;
      if (!el) return;

      const text = el.textContent?.trim().slice(0, 100) ?? "";
      const href = link?.href ?? "";
      const isWhatsApp = href.includes("wa.me") || href.includes("whatsapp.com");
      const isCTA =
        isWhatsApp ||
        el.getAttribute("data-cta") != null ||
        /declarar|contratar|whatsapp|grátis|gratuito|começar|quero|agendar|enviar|solicitar|calcular/i.test(
          text
        );

      if (isCTA) {
        sendEvent({
          sessionId,
          type: isWhatsApp ? "whatsapp_click" : "cta_click",
          page,
          element: (text || href).slice(0, 200),
        });
      }
    };

    // Time on page — fired on leave / tab switch
    const handleLeave = () => {
      if (sentLeaveRef.current) return;
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (seconds < 2) return;
      sentLeaveRef.current = true;
      sendEvent({ sessionId, type: "time_on_page", page, timeOnPage: seconds });
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") handleLeave();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      handleLeave(); // fires on route change / unmount
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}
