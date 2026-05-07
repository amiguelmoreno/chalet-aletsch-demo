import type { Metadata } from "next";
import { Fraunces, EB_Garamond } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chalet Aletsch — Berghaus seit 1923",
    template: "%s · Chalet Aletsch",
  },
  description:
    "Ein traditionsreiches Berghaus auf der Riederalp, mit Blick auf den Aletschgletscher. Stuben aus Arvenholz, eine Küche aus dem Wallis, Gastfreundschaft seit drei Generationen.",
  applicationName: "Chalet Aletsch",
  authors: [{ name: "Morenodev", url: "https://morenodev.ch" }],
  keywords: [
    "Berghotel Aletsch",
    "Riederalp Unterkunft",
    "Chalet Wallis",
    "Aletschgletscher Hotel",
    "Berghaus Riederalp",
    "Walliser Stube",
  ],
  openGraph: {
    type: "website",
    locale: "de_CH",
    alternateLocale: ["en_US"],
    siteName: "Chalet Aletsch",
    url: SITE_URL,
    title: "Chalet Aletsch — Berghaus seit 1923",
    description:
      "Ein traditionsreiches Berghaus auf der Riederalp, im Schatten des Aletschgletschers.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Chalet Aletsch — ein Berghaus auf der Riederalp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chalet Aletsch — Berghaus seit 1923",
    description: "Ein Berghaus auf der Riederalp, seit hundert Jahren.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      de: `${SITE_URL}/de`,
      en: `${SITE_URL}/en`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${fraunces.variable} ${garamond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
