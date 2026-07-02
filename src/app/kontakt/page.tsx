import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Kontakt — Pokero',
  description: 'Skontaktuj się z zespołem Pokero. Email wsparcia, informacje o aplikacji.',
  alternates: { canonical: 'https://pokero.pl/kontakt/' },
};

export default function KontaktPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Kontakt</span>
          </div>

          <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 2rem' }}>Kontakt</h1>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(var(--pk-cream-rgb),0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email wsparcia</p>
            <p style={{ fontWeight: 600, color: 'rgb(var(--pk-gold-rgb))', fontSize: '1rem', marginBottom: '0.5rem' }}>pokerosupport@gmail.com</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.5)', margin: 0 }}>
              Pytania, zgłoszenia błędów, sugestie — odpiszemy w ciągu 24h.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(var(--pk-cream-rgb),0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Wersja aplikacji</p>
            <p style={{ fontFamily: 'monospace', color: 'rgb(var(--pk-gold-rgb))', marginBottom: 0 }}>v1.0.0</p>
          </div>

          <div className="card">
            <p style={{ fontSize: '0.75rem', color: 'rgba(var(--pk-cream-rgb),0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>O Pokero</p>
            <p style={{ fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.6)', margin: 0, lineHeight: 1.6 }}>
              Pokero to prywatny stół pokerowy dla znajomych — bez pieniędzy, bez rejestracji, tylko dobra zabawa. Zbudowane w Next.js i Socket.io. Obsługuje Texas Hold&apos;em, Omaha, Crazy Pineapple i Drawmaha.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
