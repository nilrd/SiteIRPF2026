export function JsonLdWebsite() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Consultoria IRPF NSB",
    description:
      "Consultoria especializada em declaracao de Imposto de Renda Pessoa Fisica. Declaracoes novas, atrasadas e retificacoes para todo Brasil.",
    url: "https://irpf.qaplay.com.br",
    telephone: "+5511940825120",
    email: "nilson.brites@gmail.com",
    areaServed: { "@type": "Country", name: "Brazil" },
    serviceType: "Declaracao de Imposto de Renda Pessoa Fisica",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
    sameAs: [],
    founder: {
      "@type": "Person",
      name: "Consultoria IRPF NSB",
      jobTitle: "Analista Financeiro",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdFAQ({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdArticle({
  title,
  description,
  url,
  image,
  imageAlt,
  datePublished,
  dateModified,
  type = "Article",
  articleSection,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  datePublished: string;
  dateModified: string;
  type?: "Article" | "NewsArticle";
  articleSection?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description,
    url,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
        ...(imageAlt && { caption: imageAlt }),
      },
    }),
    datePublished,
    dateModified,
    isAccessibleForFree: true,
    ...(articleSection && { articleSection }),
    author: {
      "@type": "Person",
      name: "Nilson Brites",
      url: "https://irpf.qaplay.com.br/sobre",
      jobTitle: "Analista Financeiro",
    },
    publisher: {
      "@type": "Organization",
      name: "Consultoria IRPF NSB",
      url: "https://irpf.qaplay.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://irpf.qaplay.com.br/og-image.svg",
        width: 1200,
        height: 630,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdBreadcrumb({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite schema com SearchAction — ativa Sitelinks Searchbox no Google */
export function JsonLdWebSite() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Consultoria IRPF NSB",
    url: "https://irpf.qaplay.com.br",
    description:
      "Consultoria especializada em declaracao de Imposto de Renda Pessoa Fisica. Declaracoes novas, atrasadas e retificacoes para todo Brasil.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://irpf.qaplay.com.br/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Consultoria IRPF NSB",
      url: "https://irpf.qaplay.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://irpf.qaplay.com.br/og-image.svg",
        width: 1200,
        height: 630,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Person schema — entidade do autor Nilson Brites para E-E-A-T */
export function JsonLdPerson() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nilson Brites",
    jobTitle: "Analista Financeiro",
    description:
      "Especialista em declaracao de Imposto de Renda Pessoa Fisica com mais de 10 anos de experiencia. Fundador da Consultoria IRPF NSB.",
    url: "https://irpf.qaplay.com.br/sobre",
    worksFor: {
      "@type": "Organization",
      name: "Consultoria IRPF NSB",
      url: "https://irpf.qaplay.com.br",
    },
    knowsAbout: [
      "IRPF",
      "Tributacao Pessoa Fisica",
      "Declaracao Imposto de Renda",
      "Malha Fina Receita Federal",
      "Retificacao IRPF",
      "Planejamento Tributario PF",
    ],
    areaServed: { "@type": "Country", name: "Brazil" },
    telephone: "+5511940825120",
    email: "nilson.brites@gmail.com",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SpeakableSpecification — indica ao Google quais trechos devem ser lidos em voz alta (Discover + assistentes) */
export function JsonLdSpeakable({
  url,
  cssSelectors,
}: {
  url: string;
  cssSelectors?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors ?? ["h1", ".article-summary", ".tldr-box"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
