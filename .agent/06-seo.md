# AGENTE: SEO TÉCNICO AVANÇADO

## Objetivo
Implementar SEO técnico completo para dominar o Google.

---

## ARQUIVO: `components/seo/JsonLd.tsx`

```typescript
export function JsonLd() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Nilson Brites — Declaração de Imposto de Renda",
    "description": "Especialista em IRPF com 10 anos de experiência. Declarações novas, atrasadas e retificações para todo Brasil.",
    "telephone": "+5511940825120",
    "email": "nilson.brites@gmail.com",
    "url": "https://irpf.qaplay.com.br",
    "areaServed": { "@type": "Country", "name": "Brazil" },
    "priceRange": "$",
    "sameAs": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços IRPF",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Declaração IRPF Nova" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Declaração IRPF Atrasada" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Retificação de Declaração" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Declaração com Dependentes" }}
      ]
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nilson Brites",
    "jobTitle": "Analista Financeiro — Especialista em IRPF",
    "worksFor": { "@type": "Organization", "name": "Nilson Brites IRPF" },
    "knowsAbout": ["Imposto de Renda", "IRPF", "Declaração Fiscal", "Análise Financeira"],
    "url": "https://irpf.qaplay.com.br/sobre",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+5511940825120",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}

// FAQ Schema (usar em páginas com FAQ)
export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema (usar em posts do blog)
export function ArticleJsonLd({ post, url }: { post: any; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.titulo,
    "description": post.resumo,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": "Nilson Brites",
      "url": "https://irpf.qaplay.com.br/sobre"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nilson Brites IRPF",
      "url": "https://irpf.qaplay.com.br"
    },
    "url": url,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## ARQUIVO: `app/sitemap.ts`

```typescript
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://irpf.qaplay.com.br";

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/servicos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/como-funciona`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/ferramentas/calculadora-ir`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
    { url: `${baseUrl}/ferramentas/simulador-multa`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/ebook`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Posts do blog
  const posts = await prisma.blogPost.findMany({
    where: { publicado: true },
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
```

---

## ARQUIVO: `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /painel-nb-2025/
Disallow: /api/

Sitemap: https://irpf.qaplay.com.br/sitemap.xml
```

---

## SEO por página — Implementar em cada `page.tsx`

### `/servicos`
```typescript
export const metadata: Metadata = {
  title: "Serviços de Declaração IRPF | Novo, Atrasado, Retificação",
  description: "Declaração de IR nova, atrasada e retificação para todo Brasil. Preço justo, entrega 24h. Especialista com 10 anos de experiência.",
};
```

### `/blog`
```typescript
export const metadata: Metadata = {
  title: "Blog IRPF — Dicas e Informações sobre Imposto de Renda",
  description: "Aprenda sobre declaração de IR, restituição, deduções e como evitar a malha fina. Conteúdo criado por Analista Financeiro especializado.",
};
```

### `/ferramentas/calculadora-ir`
```typescript
export const metadata: Metadata = {
  title: "Calculadora de IR 2025 — Simule sua Restituição ou Imposto a Pagar",
  description: "Calcule gratuitamente quanto você vai receber de restituição ou quanto terá que pagar no IR 2025. Tabela IRPF 2025 oficial.",
};
```

---

## Otimizações de Performance

### `next.config.js` — Headers de cache e segurança

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```
