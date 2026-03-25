import type { Metadata } from "next";
import ContatoSection from "@/components/site/ContatoSection";
import FAQSection from "@/components/site/FAQSection";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contato | Consultoria IRPF NSB",
  description:
    "Entre em contato com a Consultoria IRPF NSB. Atendimento por WhatsApp e formulário. 100% online.",
  keywords: ["contato IRPF", "declaração imposto de renda", "WhatsApp IRPF", "consultoria IRPF online"],
  alternates: { canonical: "https://irpf.qaplay.com.br/contato" },
};

export default function ContatoPage() {
  return (
    <main className="pt-32 pb-0">
      <JsonLdBreadcrumb
        items={[
          { name: "Contato", url: "https://irpf.qaplay.com.br/contato" },
        ]}
      />
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Fale Conosco
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-4">Contato</h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Estamos prontos para ajudar com sua declaração de Imposto de Renda.
          Escolha o canal mais conveniente.
        </p>
      </section>
      <ContatoSection />
      <FAQSection />
    </main>
  );
}
