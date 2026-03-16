import "@/app/globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { JsonLdWebSite } from "@/components/seo/JsonLd";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://irpf.qaplay.com.br"),
  title: {
    default: "Consultoria IRPF NSB | Declaracao de Imposto de Renda",
    template: "%s | Consultoria IRPF NSB",
  },
  description:
    "Consultoria especializada em IRPF. Declaracao completa, atrasados, retificacao e malha fina. 100% online, todo o Brasil.",
  keywords: ["IRPF", "imposto de renda", "declaracao", "restituicao", "malha fina"],
  authors: [{ name: "Nilson Brites", url: "https://irpf.qaplay.com.br/sobre" }],
  themeColor: "#2D4033",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Consultoria IRPF NSB",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Consultoria IRPF NSB — Declaracao de Imposto de Renda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Consultoria IRPF NSB | Declaracao de Imposto de Renda",
    description:
      "Consultoria especializada em IRPF. Declaracao completa, atrasados, retificacao e malha fina. 100% online.",
    images: ["/og-image.svg"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || "G-7FYYGX7C12";

  return (
    <html lang="pt-br" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-base text-preto">
        <JsonLdWebSite />
        {children}
        {ga4Id && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
