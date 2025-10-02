import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zlute-auto.vercel.app'),
  title: "Žluté Auto - Online Hra na Cesty | Zdarma Multiplayer | Česká Roadtrip Hra",
  description: "🚗 Nejlepší česká hra na cesty! Hrajte Žluté Auto online s přáteli. Real-time bodování, multiplayer až pro 6 hráčů. Perfektní zábava do auta pro celou rodinu zdarma! 🎮",
  keywords: [
    "žluté auto",
    "hra žluté auto",
    "hra do auta",
    "hry na cesty",
    "roadtrip hry",
    "multiplayer hra",
    "online hra zdarma",
    "hra pro děti",
    "rodinná hra",
    "hra na dlouhé cesty",
    "české hry",
    "zábava v autě",
    "cestovní hra",
    "bodovací hra",
    "real-time hra",
    "žluté auto pravidla",
    "hra žluté auto online",
    "aplikace žluté auto",
  ],
  authors: [{ name: "Žluté Auto Team" }],
  creator: "Žluté Auto",
  publisher: "Žluté Auto",
  applicationName: "Žluté Auto",
  category: "Games",
  classification: "Road Trip Game, Family Game, Multiplayer Game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Žluté Auto - Hra na Cesty",
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://zlute-auto.vercel.app",
    siteName: "Žluté Auto - Česká Hra na Cesty",
    title: "Žluté Auto - Online Multiplayer Hra na Cesty Zdarma",
    description: "🚗 Hrajte tradiční českou hru Žluté Auto online! Real-time multiplayer pro až 6 hráčů. Perfektní zábava na dlouhé cesty autem. Žádná instalace, hra zdarma! 🎮",
    images: [
      {
        url: "/porsche.webp",
        width: 1200,
        height: 630,
        alt: "Žluté Auto - Česká Online Roadtrip Hra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Žluté Auto - Online Hra na Cesty",
    description: "🚗 Nejlepší česká roadtrip hra! Multiplayer až pro 6 hráčů. Real-time bodování. Zdarma! 🎮",
    images: ["/porsche.webp"],
    creator: "@zlute_auto",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://zlute-auto.vercel.app",
    languages: {
      "cs-CZ": "https://zlute-auto.vercel.app",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#FFD700",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Žluté Auto - Online Hra na Cesty",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK"
    },
    "description": "Online multiplayer hra Žluté Auto pro cesty autem. Real-time bodování až pro 6 hráčů. Tradiční česká roadtrip hra v moderní podobě.",
    "url": "https://zlute-auto.vercel.app",
    "inLanguage": "cs-CZ",
    "image": "https://zlute-auto.vercel.app/porsche.webp",
    "screenshot": "https://zlute-auto.vercel.app/porsche.webp",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Real-time multiplayer až pro 6 hráčů",
      "Okamžitá synchronizace bodů",
      "Historie všech událostí",
      "Achievement systém",
      "Zvukové efekty",
      "Žádná instalace potřebná"
    ],
    "author": {
      "@type": "Organization",
      "name": "Žluté Auto Team"
    },
    "keywords": "žluté auto, hra na cesty, roadtrip hra, multiplayer, online hra zdarma, česká hra, rodinná hra"
  };

  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
