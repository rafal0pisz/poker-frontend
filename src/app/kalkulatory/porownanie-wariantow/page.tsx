import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';
import { VariantComparison } from '@/components/seo/VariantComparison';

export const metadata: Metadata = {
  title: 'Porównanie wariantów pokera — Texas, Omaha, Pineapple, Drawmaha',
  description: 'Interaktywna tabela wszystkich 6 wariantów pokera w Pokero. Filtruj po trudności, liczbie kart, rodzaju limitu. Znajdź wariant dla siebie.',
  alternates: { canonical: 'https://pokero.pl/kalkulatory/porownanie-wariantow/' },
};

export default function VariantComparisonPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/kalkulatory/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Kalkulatory</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Porównanie wariantów</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '0.75rem' }}>Porównanie wariantów pokera</h1>
            <p style={{ color: 'rgba(var(--pk-cream-rgb),0.6)', maxWidth: 560 }}>
              Filtruj i porównuj wszystkie 6 wariantów dostępnych w Pokero. Kliknij nagłówek kolumny aby sortować.
            </p>
          </div>

          <VariantComparison />

        </div>
      </main>
      <Footer />
    </>
  );
}
