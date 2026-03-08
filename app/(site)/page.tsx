import type { Metadata } from "next";
import HeroSection from "@/components/site/HeroSection";
import MarqueeStrip from "@/components/site/MarqueeStrip";
import ServicosSection from "@/components/site/ServicosSection";
import SplitSection from "@/components/site/SplitSection";
import DadosOficiaisSection from "@/components/site/DadosOficiaisSection";
import CalculadoraSection from "@/components/site/CalculadoraSection";
import BlogPreviewSection from "@/components/site/BlogPreviewSection";
import ProcessoSection from "@/components/site/ProcessoSection";
import ContatoSection from "@/components/site/ContatoSection";
import FAQSection from "@/components/site/FAQSection";
import { JsonLdWebsite } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Consultoria IRPF NSB | Declaracao de Imposto de Renda Pessoa Fisica",
  description:
    "Consultoria especializada em IRPF. Declaracao completa, atrasados, retificacao e malha fina. 100% online, atendemos todo o Brasil. Mais de 10 anos de experiencia.",
  keywords: [
    "IRPF",
    "imposto de renda",
    "declaracao IRPF",
    "restituicao",
    "malha fina",
    "IRPF atrasado",
    "retificacao IRPF",
    "consultoria IRPF",
  ],
  openGraph: {
    title: "Consultoria IRPF NSB | Declaracao de Imposto de Renda",
    description:
      "Consultoria especializada em IRPF. 100% online, todo o Brasil.",
    type: "website",
    url: "https://irpf.qaplay.com.br",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLdWebsite />
      <HeroSection />
      <MarqueeStrip />
      <ServicosSection />
      <SplitSection />
      <DadosOficiaisSection />
      <CalculadoraSection />
      <BlogPreviewSection />
      <ProcessoSection />
      <ContatoSection />
      <FAQSection />
    </>
  );
}
