import { NextResponse } from 'next/server';

// Next.js's file-convention manifest.ts only generates a single, top-level
// /manifest.webmanifest — it doesn't support a per-segment override. This
// route hand-rolls a second manifest so installing the "app" from
// /pasjonaci launches back into /pasjonaci (not the main site's start_url).
export function GET() {
  return NextResponse.json(
    {
      name: 'Pasjonaci — Pokero',
      short_name: 'Pasjonaci',
      description: 'Stały stół dla Pasjonaci — wyniki zawsze zapisywane na wspólnej lidze.',
      start_url: '/pasjonaci',
      display: 'standalone',
      background_color: '#0d0d14',
      theme_color: '#d4af37',
      orientation: 'portrait',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
      ],
      categories: ['games', 'entertainment'],
    },
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
}
