import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
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
    default: "Declaração IRPF 2026 | Nilson Brites — Prazo 29 de Maio",
    template: "%s | Nilson Brites IRPF 2026",
  },
  description:
    "Declare seu IRPF 2026 com segurança. Especialista com 10+ anos de experiência, atendimento 100% online para todo o Brasil. Prazo: 29 de maio de 2026. Evite multa mínima de R$ 165,74.",
  keywords: [
    "IRPF 2026",
    "declaração imposto de renda 2026",
    "prazo IRPF 2026",
    "declarar imposto de renda online",
    "declaração IRPF atrasada",
    "retificação IRPF",
    "malha fina imposto de renda",
    "multa IRPF 2026",
    "declaração IR Nilson Brites",
    "IRPF 100% online",
    "restituição imposto de renda 2026",
  ],
  authors: [{ name: "Nilson Brites", url: "https://irpf.qaplay.com.br" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nilson Brites — Declaração IRPF 2026",
    title: "Declaração IRPF 2026 | Nilson Brites — Prazo 29 de Maio",
    description:
      "Declare seu IRPF 2026 com segurança. Especialista com 10+ anos, 100% online para todo o Brasil. Prazo: 29 de maio. Evite multass.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Nilson Brites — Declaração IRPF 2026 — Prazo 29 de Maio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Declaração IRPF 2026 | Nilson Brites — Prazo 29 de Maio",
    description:
      "Declare seu IRPF 2026 com segurança. Especialista com 10+ anos, 100% online. Prazo: 29 de maio de 2026.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://irpf.qaplay.com.br",
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

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || "G-7FYYGX7C12";
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

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
        {fbPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
