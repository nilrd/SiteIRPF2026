import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ChatbotWidget from "@/components/site/ChatbotWidget";
import { JsonLdWebsite } from "@/components/seo/JsonLd";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://irpf.qaplay.com.br"),
  title: {
    template: "%s | Consultoria IRPF NSB",
    default:
      "Declaracao de Imposto de Renda 2026 | Consultoria IRPF NSB",
  },
  description:
    "Declaracao de IR em 24h para todo Brasil. Mais de 10 anos de experiencia. Preco justo, suporte por 1 ano. IRPF novo, atrasado e retificacao.",
  openGraph: {
    siteName: "Consultoria IRPF NSB",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://irpf.qaplay.com.br" },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdWebsite />
      <AnalyticsTracker />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <ChatbotWidget />
    </>
  );
}
