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
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: "Consultoria IRPF NSB",
    },
    publisher: {
      "@type": "Organization",
      name: "Consultoria IRPF NSB",
      url: "https://irpf.qaplay.com.br",
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
