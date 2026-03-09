"use client";

import Image from "next/image";
import { useState } from "react";

interface BlogPostImageProps {
  src: string;
  alt: string;
}

export default function BlogPostImage({ src, alt }: BlogPostImageProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-verde/5">
        <span className="font-serif text-5xl text-verde/10">IR</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
      sizes="(max-width: 768px) 100vw, 33vw"
      onError={() => setBroken(true)}
    />
  );
}
