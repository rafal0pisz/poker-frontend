import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
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
  });
}
