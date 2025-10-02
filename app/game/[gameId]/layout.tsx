import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<Metadata> {
  const { gameId } = await params;
  return {
    title: `Žluté Auto - Hra #${gameId}`,
    description: 'Sledujte živé skóre v naší rodinné hře Žluté Auto! Kdo první vidí žluté auto?',
    openGraph: {
      title: `Žluté Auto - Hra`,
      description: 'Pojď hrát Žluté Auto! Kdo první vidí žluté auto?',
      type: 'website',
      images: ['/porsche.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Žluté Auto - Hra`,
      description: 'Pojď hrát Žluté Auto!',
      images: ['/porsche.webp'],
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
