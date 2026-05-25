"use client";

import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  className?: string;
  label?: string;
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  minHeight?: number;
}

export default function AdUnit({
  className = "",
  label = "Publicidade",
  slot,
  format = "auto",
  minHeight = 120,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const resolvedSlot =
    slot ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG;
  const adKey = useMemo(
    () => `ad-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  useEffect(() => {
    if (!adClient || !resolvedSlot || !adRef.current) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[AdSense] AdUnit sem configuracao. Defina NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT e um slot (NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE/NEXT_PUBLIC_ADSENSE_SLOT_BLOG).",
        );
      }
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[AdSense] adsbygoogle.push falhou (script ausente, adblock ou slot invalido).",
        );
      }
    }
  }, [adClient, resolvedSlot]);

  if (!adClient || !resolvedSlot) return null;

  return (
    <section className={`my-10 ${className}`} aria-label="Anuncio">
      <p className="text-[9px] uppercase tracking-[0.16em] opacity-35 mb-2">
        {label}
      </p>
      <ins
        key={adKey}
        ref={adRef}
        className="adsbygoogle block w-full min-h-[120px]"
        style={{ display: "block", minHeight: `${minHeight}px` }}
        data-ad-client={adClient}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </section>
  );
}
