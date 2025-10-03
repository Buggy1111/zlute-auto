import { MetadataRoute } from 'next';

/**
 * Enhanced sitemap for Žluté Auto - Online Roadtrip Hra
 * Optimized for Google.cz, Bing, and AI search engines
 * Dynamic sitemap generation for Next.js 15
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zlute-auto.vercel.app';
  const currentDate = new Date();

  return [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Note: Individual game pages are excluded from sitemap
    // They are dynamically generated and not meant to be indexed
    // The robots.txt file blocks /game/* from indexing
  ];
}

// Additional sitemap configuration
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
