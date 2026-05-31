import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pokero.pl';
  const now = new Date().toISOString();

  return [
    { url: `${base}/pl/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/zasady/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/zasady/texas-holdem/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/zasady/omaha/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/zasady/crazy-pineapple/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/zasady/drawmaha/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/zasady/uklady-kart/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/zasady-pokera-texas-holdem/`, lastModified: '2026-05-01', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-ze-znajomymi-online/`, lastModified: '2026-05-08', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/uklady-kart-poker/`, lastModified: '2026-05-15', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/kontakt/`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
