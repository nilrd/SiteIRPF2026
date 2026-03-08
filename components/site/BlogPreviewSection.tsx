"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const placeholderPosts = [
  {
    slug: "novas-regras-irpf-2026",
    category: "Legislacao",
    title: "Novas regras do IRPF 2026: o que muda para voce.",
    image:
      "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "como-maximizar-restituicao",
    category: "Planejamento",
    title: "Como maximizar sua restituicao com deducoes legais.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "erros-malha-fina",
    category: "Malha Fina",
    title: "Os 5 erros mais comuns que levam a retencao da declaracao.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogPreviewSection() {
  return (
    <section id="blog" className="py-14 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-16">
        <h2 className="font-serif text-4xl md:text-5xl">
          Perspectivas Tecnicas
        </h2>
        <Link
          href="/blog"
          className="text-xs uppercase border-b border-preto pb-1 hover:opacity-50 transition"
        >
          Ver todos os artigos
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {placeholderPosts.map((post, i) => (
          <motion.article
            key={post.slug}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="overflow-hidden mb-6 aspect-[4/5] bg-gray-200 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ouro">
                {post.category}
              </span>
              <h3 className="font-serif text-xl md:text-2xl mt-2 group-hover:italic transition-all">
                {post.title}
              </h3>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
