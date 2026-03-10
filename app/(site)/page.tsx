import type { Metadata } from "next";
import HeroSection from "@/components/site/HeroSection";
import MarqueeStrip from "@/components/site/MarqueeStrip";
import ServicosSection from "@/components/site/ServicosSection";
import SplitSection from "@/components/site/SplitSection";
import DadosOficiaisSection from "@/components/site/DadosOficiaisSection";
import RestituicaoCard from "@/components/site/RestituicaoCard";
import CalculadoraSection from "@/components/site/CalculadoraSection";
import BlogPreviewSection from "@/components/site/BlogPreviewSection";
import ProcessoSection from "@/components/site/ProcessoSection";
import ContatoSection from "@/components/site/ContatoSection";
import FAQSection from "@/components/site/FAQSection";
import { JsonLdWebsite } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Consultoria IRPF NSB | Declaração de Imposto de Renda Pessoa Física",
  description:
    "Consultoria especializada em IRPF. Declaração completa, atrasados, retificação e malha fina. 100% online, atendemos todo o Brasil. Mais de 10 anos de experiência.",
  keywords: [
    "IRPF",
    "imposto de renda",
    "declaração IRPF",
    "restituição",
    "malha fina",
    "IRPF atrasado",
    "retificação IRPF",
    "consultoria IRPF",
  ],
  openGraph: {
    title: "Consultoria IRPF NSB | Declaração de Imposto de Renda",
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
      <RestituicaoCard />
      <CalculadoraSection />
      <BlogPreviewSection />
      <ProcessoSection />
      <ContatoSection />
      <FAQSection />
    </>
  );
}
