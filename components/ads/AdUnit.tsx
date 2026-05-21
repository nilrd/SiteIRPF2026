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
}

export default function AdUnit({
  className = "",
  label = "Publicidade",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG;
  const adKey = useMemo(
    () => `ad-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  useEffect(() => {
    if (!slot || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Falha silenciosa para ambientes sem script/adblock
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <section className={`my-10 ${className}`} aria-label="Anuncio">
      <p className="text-[9px] uppercase tracking-[0.16em] opacity-35 mb-2">
        {label}
      </p>
      <ins
        key={adKey}
        ref={adRef}
        className="adsbygoogle block w-full min-h-[120px]"
        style={{ display: "block" }}
        data-ad-client="ca-pub-0359891850456155"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
