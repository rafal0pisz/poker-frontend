import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Kalkulatory pokerowe — szanse na wygraną, equity, outs',
  description: 'Darmowe kalkulatory pokerowe. Sprawdź swoje szanse na wygraną w Texas Hold\'em, oblicz equity i outs. Narzędzia dla graczy każdego poziomu.',
  alternates: { canonical: 'https://pokero.pl/kalkulatory/' },
};

export default function KalkulatoryPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Kalkulatory</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.75rem' }}>Kalkulatory pokerowe</h1>
          <p style={{ color: 'rgba(245,230,192,0.6)', marginBottom: '2.5rem', maxWidth: 560 }}>
            Darmowe narzędzia które pomogą Ci lepiej rozumieć matematykę pokera.
            Sprawdź swoje szanse na wygraną jeszcze przed siadaniem do stołu.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 560 }}>
            <Link href="/kalkulatory/texas-holdem/" style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>♠</div>
                <div>
                  <p style={{ fontWeight: 700, color: '#d4af37', margin: '0 0 0.25rem', fontSize: '1.05rem' }}>
                    Kalkulator Texas Hold&apos;em
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)' }}>
                    Wybierz karty, ustaw liczbę rywali — sprawdź swoje equity pre-flop, na flopie, turnie i riverze.
                  </p>
                </div>
                <span style={{ color: '#d4af37', flexShrink: 0 }}>→</span>
              </div>
            </Link>
            <div className="card" style={{ opacity: 0.5, cursor: 'default' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>♦</div>
                <div>
                  <p style={{ fontWeight: 700, color: '#d4af37', margin: '0 0 0.25rem', fontSize: '1.05rem' }}>
                    Kalkulator Omaha <span style={{ fontSize: '0.75rem', background: 'rgba(212,175,55,0.15)', padding: '2px 8px', borderRadius: 20, marginLeft: 6 }}>wkrótce</span>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)' }}>
                    Equity dla Omaha z zasadą dokładnie 2+3 kart.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
