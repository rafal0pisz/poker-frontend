import { NextResponse } from 'next/server';

// Hand-rolled instead of the manifest.ts file convention because that
// convention only supports one global manifest — see
// pasjonaci/manifest.webmanifest/route.ts for why a second one is needed.
// application/manifest+json is the registered MIME type (RFC/W3C Web App
// Manifest spec) and is what Next's own file convention serves — some
// browsers' installability checks care about the exact content type.
export function GET() {
  return NextResponse.json(
    {
      name: 'Pokero — Poker z przyjaciółmi',
      short_name: 'Pokero',
      description: 'Darmowy poker online z przyjaciółmi. Texas, Omaha, Drawmaha i więcej.',
      start_url: '/',
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
