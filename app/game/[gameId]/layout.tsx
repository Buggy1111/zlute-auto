import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<Metadata> {
  const { gameId } = await params;

  return {
    title: `Aktivní hra #${gameId.substring(0, 8)}`,
    description: `Sledujte živé skóre v online hře Žluté Auto! Real-time multiplayer roadtrip hra pro celou rodinu. Připojte se a soutěžte s přáteli o nejlepší skóre!`,
    keywords: [
      'žluté auto live',
      'online hra zdarma',
      'multiplayer hra',
      'roadtrip hra live',
      'sledovat hru žluté auto',
      'živé skóre',
      'real-time bodování',
      'hra s přáteli online',
    ],
    openGraph: {
      title: `Žluté Auto - Aktivní Hra | Připoj se!`,
      description: `Hraju Žluté Auto! Připoj se a hraj se mnou. Real-time multiplayer roadtrip hra zdarma!`,
      type: 'website',
      url: `https://zlute-auto.vercel.app/game/${gameId}`,
      siteName: 'Žluté Auto - Online Roadtrip Hra',
      locale: 'cs_CZ',
      images: [
        {
          url: '/porsche.webp',
          width: 1200,
          height: 630,
          alt: 'Žluté Auto - Připoj se ke hře!',
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Žluté Auto - Připoj se ke hře!`,
      description: `Hraju Žluté Auto online! Připoj se a hraj se mnou 🚗💨`,
      images: ['/porsche.webp'],
      creator: '@zlute_auto',
      site: '@zlute_auto',
    },
    robots: {
      index: false, // Game pages should not be indexed
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: 'https://zlute-auto.vercel.app', // Canonical should point to homepage
    },
  };
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
