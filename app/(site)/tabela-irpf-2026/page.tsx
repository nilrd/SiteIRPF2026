import type { Metadata } from "next";
import TabelaIRPFClient from "./TabelaIRPFClient";

export const metadata: Metadata = {
  title: "Tabela IRPF 2026 | Faixas e Alíquotas Atualizadas — Receita Federal",
  description:
    "Tabela completa do IRPF 2026 com faixas, alíquotas progressivas e deduções oficiais da Receita Federal (Lei 15.270/2025). Simulador gratuito incluso.",
  keywords: [
    "tabela irpf 2026",
    "tabela imposto de renda 2026",
    "aliquotas irpf 2026",
    "faixas irpf 2026",
    "tabela progressiva irpf",
    "deducao irpf 2026",
    "receita federal tabela 2026",
  ],
  alternates: {
    canonical: "https://irpf.qaplay.com.br/tabela-irpf-2026",
  },
  openGraph: {
    title: "Tabela IRPF 2026 | Faixas e Alíquotas Atualizadas",
    description:
      "Consulte a tabela completa do Imposto de Renda 2026 com alíquotas, deduções e simulador gratuito.",
    url: "https://irpf.qaplay.com.br/tabela-irpf-2026",
    type: "website",
  },
};

const jsonLdTable = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Tabela IRPF 2026 — Faixas e Alíquotas Atualizadas",
  description:
    "Tabela completa do Imposto de Renda Pessoa Física 2026 com faixas, alíquotas e deduções oficiais da Receita Federal.",
  url: "https://irpf.qaplay.com.br/tabela-irpf-2026",
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
      name: "Quem é obrigado a declarar o IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Quem recebeu rendimentos tributáveis acima de R$ 35.584,00 em 2025, teve receita bruta de atividade rural acima de R$ 177.920,00, possuía bens acima de R$ 800.000,00 em 31/12/2025, ou se enquadra em outros critérios da Receita Federal.",
      },
    },
    {
      "@type": "Question",
      name: "Qual é o prazo de entrega do IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O prazo de entrega da declaração IRPF 2026 (ano-base 2025) é de 23 de março a 29 de maio de 2026. A multa mínima por atraso é de R$ 165,74.",
      },
    },
    {
      "@type": "Question",
      name: "Quais as alíquotas do IRPF 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A tabela progressiva mensal do IRPF 2026 tem 5 faixas: isento (até R$ 2.428,80), 7,5% (R$ 2.428,81 a R$ 2.826,65), 15% (R$ 2.826,66 a R$ 3.751,05), 22,5% (R$ 3.751,06 a R$ 4.664,68) e 27,5% (acima de R$ 4.664,68). Fonte: Lei 15.270/2025.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://irpf.qaplay.com.br" },
    { "@type": "ListItem", position: 2, name: "Tabela IRPF 2026", item: "https://irpf.qaplay.com.br/tabela-irpf-2026" },
  ],
};

export default function TabelaIRPF2026Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTable) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <TabelaIRPFClient />
        </div>
      </main>
    </>
  );
}
