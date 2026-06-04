import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pokero.pl';
  const now = new Date().toISOString();
  return [
    { url: `${base}/pl/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/kalkulatory/`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/kalkulatory/texas-holdem/`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/kalkulatory/omaha/`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/zasady/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/zasady/texas-holdem/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/zasady/omaha/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/zasady/crazy-pineapple/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/zasady/pineapple-klasyczny/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/zasady/drawmaha/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/zasady/uklady-kart/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // Nowe artykuły (czerwiec 2026)
    { url: `${base}/blog/poker-turniej-zasady/`, lastModified: '2026-06-10', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-matematyka/`, lastModified: '2026-06-09', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-terminy-slownik/`, lastModified: '2026-06-08', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-strategia-poczatkujacy/`, lastModified: '2026-06-07', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-na-impreze/`, lastModified: '2026-06-06', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-vs-omaha/`, lastModified: '2026-06-05', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-outs-kalkulator/`, lastModified: '2026-06-04', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/pot-odds-poker/`, lastModified: '2026-06-03', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-heads-up/`, lastModified: '2026-06-02', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-dla-poczatkujacych/`, lastModified: '2026-06-01', changeFrequency: 'monthly', priority: 0.75 },
    // Istniejące artykuły (maj 2026)
    { url: `${base}/blog/dealer-choice-poker/`, lastModified: '2026-05-31', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-zasady-blind/`, lastModified: '2026-05-31', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/gry-online-ze-znajomymi/`, lastModified: '2026-05-30', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/omaha-strategia/`, lastModified: '2026-05-29', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-na-telefonie/`, lastModified: '2026-05-28', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/side-pot-poker/`, lastModified: '2026-05-27', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-domowy-turniej/`, lastModified: '2026-05-26', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/pozycja-w-pokerze/`, lastModified: '2026-05-24', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/jak-blefowac-w-pokerze/`, lastModified: '2026-05-22', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-wieczor-kawalerski/`, lastModified: '2026-05-20', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/uklady-kart-poker/`, lastModified: '2026-05-15', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/poker-ze-znajomymi-online/`, lastModified: '2026-05-08', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/zasady-pokera-texas-holdem/`, lastModified: '2026-05-01', changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/kontakt/`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
