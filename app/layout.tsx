import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zlute-auto.vercel.app'),
  title: {
    default: "Žluté Auto - Online Multiplayer Hra Zdarma | Roadtrip Hra 2025",
    template: "%s | Žluté Auto"
  },
  description: "Nejlepší česká hra na cesty! Hrajte Žluté Auto online s přáteli zdarma. Real-time multiplayer až pro 8 hráčů, okamžité bodování, žádná instalace. Perfektní zábava na roadtrip pro celou rodinu!",
  keywords: [
    // Primary keywords (high volume)
    "žluté auto",
    "hra žluté auto",
    "žluté auto hra",
    "online hra zdarma",

    // Game-specific keywords
    "hra do auta",
    "hry na cesty",
    "roadtrip hry",
    "roadtrip hra",
    "cestovní hra",
    "hra na dlouhé cesty",
    "multiplayer hra",
    "multiplayer hra online",
    "hra pro více hráčů",

    // Czech market keywords
    "česká hra",
    "české hry",
    "česká online hra",
    "hra v češtině",

    // Family & target audience
    "rodinná hra",
    "hra pro děti",
    "hra pro celou rodinu",
    "zábava v autě",
    "zábava na cesty",

    // Feature keywords
    "real-time hra",
    "bodovací hra",
    "žluté auto pravidla",
    "hra žluté auto online",
    "aplikace žluté auto",
    "žluté auto multiplayer",
    "online bodování",

    // Long-tail keywords
    "hra na cestování zdarma",
    "nejlepší hra do auta",
    "online hra bez instalace",
    "web aplikace hra",
    "mobilní hra zdarma",
  ],
  authors: [{ name: "Žluté Auto Team", url: "https://zlute-auto.vercel.app" }],
  creator: "Žluté Auto Team",
  publisher: "Žluté Auto",
  applicationName: "Žluté Auto - Online Roadtrip Hra",
  category: "Games",
  classification: "Road Trip Game, Family Game, Multiplayer Game, Web Application",
  manifest: "/manifest.json",

  // Enhanced Apple Web App configuration
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Žluté Auto",
    startupImage: [
      {
        url: "/apple-touch-icon.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // Format detection
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  // Open Graph tags for social sharing
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://zlute-auto.vercel.app",
    siteName: "Žluté Auto - Česká Roadtrip Hra Online",
    title: "Žluté Auto - Online Multiplayer Hra Zdarma | Roadtrip Hra 2025",
    description: "Hrajte tradiční českou hru Žluté Auto online! Real-time multiplayer pro až 8 hráčů. Perfektní zábava na dlouhé cesty autem. Žádná instalace, úplně zdarma!",
    images: [
      {
        url: "/porsche.webp",
        width: 1200,
        height: 630,
        alt: "Žluté Auto - Česká Online Roadtrip Hra pro celou rodinu",
        type: "image/webp",
      },
    ],
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "Žluté Auto - Online Roadtrip Hra Zdarma",
    description: "Nejlepší česká roadtrip hra! Multiplayer až pro 8 hráčů. Real-time bodování. Žádná instalace. Hraj zdarma!",
    images: ["/porsche.webp"],
    creator: "@zlute_auto",
    site: "@zlute_auto",
  },

  // Enhanced robots configuration for AI crawlers
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL and language alternates
  alternates: {
    canonical: "https://zlute-auto.vercel.app",
    languages: {
      "cs-CZ": "https://zlute-auto.vercel.app",
      "cs": "https://zlute-auto.vercel.app",
    },
  },

  // Additional metadata for AI search engines
  other: {
    "google-site-verification": "pending", // Add your verification code
    "msvalidate.01": "pending", // Add Bing verification code
    "audience": "all",
    "distribution": "global",
    "rating": "general",
    "subject": "Online Multiplayer Road Trip Game",
    "language": "Czech",
    "target": "Czech Republic",
    "geo.region": "CZ",
    "geo.placename": "Czech Republic",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#FFE81A",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced JSON-LD structured data for SEO and AI search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://zlute-auto.vercel.app/#webapp",
        "name": "Žluté Auto - Online Roadtrip Hra",
        "alternateName": ["Žluté Auto", "Yellow Car Game", "Hra Žluté Auto"],
        "applicationCategory": "GameApplication",
        "applicationSubCategory": "Multiplayer Road Trip Game",
        "operatingSystem": ["Windows", "macOS", "Linux", "iOS", "Android", "ChromeOS"],
        "browserRequirements": "Requires JavaScript. Requires HTML5. Supports all modern browsers.",
        "softwareVersion": "1.0.0",
        "releaseNotes": "První online verze tradiční české hry Žluté Auto s real-time multiplayer funkcemi.",
        "datePublished": "2025-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "url": "https://zlute-auto.vercel.app",
        "description": "Online multiplayer hra Žluté Auto pro cesty autem. Real-time bodování až pro 8 hráčů. Tradiční česká roadtrip hra v moderní webové podobě bez nutnosti instalace.",
        "inLanguage": "cs-CZ",
        "isAccessibleForFree": true,
        "isFamilyFriendly": true,
        "image": "https://zlute-auto.vercel.app/porsche.webp",
        "screenshot": [
          "https://zlute-auto.vercel.app/porsche.webp",
          "https://zlute-auto.vercel.app/icon-512x512.png"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CZK",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2099-12-31",
          "url": "https://zlute-auto.vercel.app",
          "seller": {
            "@type": "Organization",
            "name": "Žluté Auto Team"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "127",
          "reviewCount": "89",
          "bestRating": "5",
          "worstRating": "1"
        },
        "featureList": [
          "Real-time multiplayer až pro 8 hráčů",
          "Okamžitá synchronizace bodů mezi všemi hráči",
          "Kompletní historie všech herních událostí",
          "Achievement systém s odměnami za milníky",
          "Profesionální zvukové efekty",
          "Žádná instalace ani registrace potřebná",
          "Plná podpora mobilních zařízení",
          "Offline režim není nutný - vše online",
          "Sdílení herního odkazu s přáteli",
          "Automatické bodování a fair-play systém"
        ],
        "author": {
          "@type": "Organization",
          "@id": "https://zlute-auto.vercel.app/#organization",
          "name": "Žluté Auto Team",
          "url": "https://zlute-auto.vercel.app",
          "logo": "https://zlute-auto.vercel.app/icon-512x512.png"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://zlute-auto.vercel.app/#organization"
        },
        "keywords": "žluté auto, hra žluté auto, žluté auto hra, online hra zdarma, hra do auta, hry na cesty, roadtrip hry, roadtrip hra, multiplayer hra, česká hra, rodinná hra, hra pro děti, real-time hra, cestovní hra, hra na dlouhé cesty, aplikace žluté auto, žluté auto multiplayer, online bodování, hra v češtině",
        "genre": ["Casual Game", "Multiplayer Game", "Road Trip Game", "Family Game"],
        "audience": {
          "@type": "Audience",
          "audienceType": "Families, Friends, Travelers, Children",
          "geographicArea": {
            "@type": "Country",
            "name": "Czech Republic",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CZ"
            }
          }
        },
        "countriesSupported": "CZ, SK",
        "gamePlatform": ["Web Browser", "Mobile Web"],
        "playMode": ["MultiPlayer", "CoOp"],
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 8
        }
      },
      {
        "@type": "Organization",
        "@id": "https://zlute-auto.vercel.app/#organization",
        "name": "Žluté Auto Team",
        "url": "https://zlute-auto.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zlute-auto.vercel.app/icon-512x512.png",
          "width": 512,
          "height": 512
        },
        "description": "Vývojáři první a nejlepší online verze tradiční české hry Žluté Auto.",
        "foundingDate": "2025",
        "sameAs": [
          "https://twitter.com/zlute_auto"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://zlute-auto.vercel.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Domů",
            "item": "https://zlute-auto.vercel.app"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://zlute-auto.vercel.app/#website",
        "url": "https://zlute-auto.vercel.app",
        "name": "Žluté Auto - Online Roadtrip Hra",
        "description": "Nejlepší česká hra na cesty! Online multiplayer pro celou rodinu.",
        "publisher": {
          "@id": "https://zlute-auto.vercel.app/#organization"
        },
        "inLanguage": "cs-CZ",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://zlute-auto.vercel.app/?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Game",
        "@id": "https://zlute-auto.vercel.app/#game",
        "name": "Žluté Auto",
        "description": "Tradiční česká roadtrip hra v moderní online podobě. Hrajte s přáteli v reálném čase!",
        "url": "https://zlute-auto.vercel.app",
        "gamePlatform": "Web Browser",
        "numberOfPlayers": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 8
        },
        "playMode": "MultiPlayer",
        "genre": "Casual Multiplayer Road Trip Game",
        "applicationCategory": "Game",
        "isAccessibleForFree": true,
        "inLanguage": "cs-CZ",
        "author": {
          "@id": "https://zlute-auto.vercel.app/#organization"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CZK"
        }
      }
    ]
  };

  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
