"use client";

import Image from "next/image";
import { useState } from "react";

interface UnsplashAttribution {
  photographerName: string;
  photographerUrl: string;
  photoUrl: string;
}

interface BlogPostImageProps {
  src: string;
  alt: string;
  attribution?: UnsplashAttribution | null;
}

export default function BlogPostImage({ src, alt, attribution }: BlogPostImageProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-verde/5">
        <span className="font-serif text-5xl text-verde/10">IR</span>
      </div>
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        quality={95}
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 33vw"
        onError={() => setBroken(true)}
      />
      {attribution && !src.includes("supabase.co") && (
        <div
          className="absolute bottom-0 right-0 bg-black/50 px-2 py-1 text-white"
          style={{ fontSize: "10px", lineHeight: 1.4 }}
        >
          Foto:{" "}
          <a
            href={attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {attribution.photographerName}
          </a>{" "}
          via{" "}
          <a
            href={attribution.photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            Unsplash
          </a>
        </div>
      )}
    </>
  );
}
