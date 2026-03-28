import type { Metadata } from "next";
import QuemDeveClient from "./QuemDeveClient";

export const metadata: Metadata = {
  title: "Quem Deve Declarar o IRPF 2026? Descubra em 2 Minutos",
  description:
    "Descubra se você é obrigado a declarar o Imposto de Renda 2026 (IRPF). Checklist interativo com os 8 critérios oficiais da Receita Federal. Prazo: 23/03 a 29/05/2026.",
  keywords: [
    "quem deve declarar irpf 2026",
    "quem é obrigado a declarar imposto de renda 2026",
    "obrigatoriedade declaracao irpf",
    "limite declaracao ir 2026",
    "isento de declarar imposto de renda",
    "criterios obrigatoriedade irpf",
    "declarar ou nao imposto de renda 2026",
  ],
  alternates: {
    canonical: "https://irpf.qaplay.com.br/quem-deve-declarar-irpf-2026",
  },
  openGraph: {
    title: "Quem Deve Declarar o IRPF 2026? Descubra em 2 Minutos",
    description:
      "Checklist interativo com os 8 critérios oficiais da Receita Federal. Descubra agora se você precisa declarar o IR 2026.",
    url: "https://irpf.qaplay.com.br/quem-deve-declarar-irpf-2026",
    type: "website",
  },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Quem Deve Declarar o IRPF 2026?",
  description:
    "Checklist interativo com os 8 critérios oficiais da Receita Federal para obrigatoriedade de declaração do IRPF 2026.",
  url: "https://irpf.qaplay.com.br/quem-deve-declarar-irpf-2026",
  inLanguage: "pt-BR",
  publisher: {
    "@type": "Organization",
    name: "Consultoria IRPF NSB",
    url: "https://irpf.qaplay.com.br",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual o limite de rendimentos para declarar IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Quem recebeu rendimentos tributáveis acima de R$ 35.584,00 em 2025 é obrigado a declarar o IRPF 2026. Esse limite equivale a R$ 2.965,34 por mês.",
      },
    },
    {
      "@type": "Question",
      name: "Quem recebeu somente salário precisa declarar o IR 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, se o total de salários recebidos em 2025 (incluindo décimo terceiro e férias) ultrapassar R$ 35.584,00, a declaração é obrigatória, mesmo que o empregador já tenha retido na fonte (IRRF).",
      },
    },
    {
      "@type": "Question",
      name: "Preciso declarar se vendi meu apartamento em 2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Qualquer alienação de bens (imóveis, veículos, ações etc.) sujeita ao ganho de capital, ou com valor acima de R$ 40.000,00, obriga à declaração do IRPF 2026, independente de ter havido lucro.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a multa por não declarar o IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A multa mínima por não entregar a declaração no prazo é de R$ 165,74. Se houver imposto a pagar, a multa é de 1% ao mês sobre o valor do imposto devido, limitada a 20% do total. Prazo de entrega: 23/03 a 29/05/2026.",
      },
    },
    {
      "@type": "Question",
      name: "Aposentado precisa declarar o IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aposentados e pensionistas com rendimentos totais acima de R$ 35.584,00 em 2025 devem declarar. Portadores de doenças graves têm isenção sobre proventos de aposentadoria, mas ainda podem ser obrigados a declarar por outros rendimentos.",
      },
    },
    {
      "@type": "Question",
      name: "Quem pode declarar em conjunto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cônjuges e companheiros podem declarar em conjunto, consolidando todos os rendimentos e bens em uma única declaração. Apenas um é o declarante principal; o outro é incluído como dependente.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://irpf.qaplay.com.br" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Quem Deve Declarar IRPF 2026",
      item: "https://irpf.qaplay.com.br/quem-deve-declarar-irpf-2026",
    },
  ],
};

export default function QuemDeveDeclarar2026Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <QuemDeveClient />
        </div>
      </main>
    </>
  );
}
