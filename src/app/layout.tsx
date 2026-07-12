import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokero — Play poker with friends',
  description: 'Free online poker with friends. Texas Hold\'em, Omaha, Crazy Pineapple, Drawmaha and more. No download needed — play in browser.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pokero',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1F0808',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Site-wide entity identity for search engines and AI answer
            engines — was missing entirely; every other schema on the site
            is per-page (Article/FAQPage), nothing declared what the site
            itself is. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Pokero',
              url: 'https://pokero.pl',
              description: 'Darmowy poker online z przyjaciółmi — bez rejestracji, bez pieniędzy. Texas Hold\'em, Omaha, Crazy Pineapple, Drawmaha i więcej.',
              publisher: { '@type': 'Organization', name: 'Pokero', url: 'https://pokero.pl' },
            }),
          }}
        />
        {/* GTM — loaded on all pages except active game room (?room=...) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.location.search.indexOf('room=') !== -1) return;
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WVQPKV2F');
              })();
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVQPKV2F"
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
