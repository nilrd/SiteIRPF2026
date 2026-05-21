import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { JsonLdWebsite } from "@/components/seo/JsonLd";

const ChatbotWidget = dynamic(
  () => import("@/components/site/ChatbotWidget"),
  { ssr: false },
);
const ExitIntentModal = dynamic(
  () => import("@/components/site/ExitIntentModal"),
  { ssr: false },
);
const AnalyticsTracker = dynamic(
  () => import("@/components/analytics/AnalyticsTracker"),
  { ssr: false },
);

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "https://irpf.qaplay.com.br" },
  other: {
    "google-adsense-account": "ca-pub-0359891850456155",
  },
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
      <ExitIntentModal />
    </>
  );
}
