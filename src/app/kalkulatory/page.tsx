import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Kalkulatory pokerowe — szanse na wygraną Texas Hold\'em i Omaha',
  description: 'Darmowe kalkulatory pokerowe. Sprawdź swoje equity w Texas Hold\'em i Omaha. Symulacja Monte Carlo, zasada 2+3, pre-flop i post-flop.',
  alternates: { canonical: 'https://pokero.pl/kalkulatory/' },
};

const calcs = [
  {
    href: '/kalkulatory/texas-holdem/',
    icon: '♠',
    name: "Kalkulator Texas Hold'em",
    desc: 'Wybierz 2 karty, ustaw liczbę rywali — sprawdź equity pre-flop, na flopie, turnie i riverze. Symulacja 5000 rozdań.',
    badge: null,
  },
  {
    href: '/kalkulatory/omaha/',
    icon: '♦',
    name: 'Kalkulator Omaha',
    desc: '4 karty na rękę, zasada dokładnie 2+3. Kalkulator sprawdza wszystkie 60 kombinacji. Symulacja 4000 rozdań.',
    badge: null,
  },
  {
    href: '/kalkulatory/porownanie-wariantow/',
    icon: '⚖',
    name: 'Porównanie wariantów',
    desc: 'Interaktywna tabela wszystkich 6 wariantów z filtrowaniem po trudności, liczbie kart i rodzaju limitu.',
    badge: 'Nowość',
  },
];

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
            Darmowe narzędzia które pomogą Ci lepiej rozumieć matematykę pokera. Sprawdź swoje szanse na wygraną przed siadaniem do stołu w <Link href="/">Pokero</Link>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 580 }}>
            {calcs.map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2.5rem', flexShrink: 0, color: '#d4af37' }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: '#d4af37', margin: '0 0 0.3rem', fontSize: '1.05rem' }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(245,230,192,0.55)' }}>{c.desc}</p>
                  </div>
                  <span style={{ color: '#d4af37', flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="prose" style={{ marginTop: '3rem', maxWidth: 640 }}>
            <h2>Po co używać kalkulatora pokerowego?</h2>
            <p>
              Kalkulator pokerowy to narzędzie treningowe — pokaże Ci jak silna jest Twoja ręka
              w konkretnej sytuacji zanim zasiądziesz do prawdziwej gry. Szczególnie przydatny
              gdy uczysz się nowych wariantów jak Omaha gdzie intuicja z Texas może Cię mylić.
            </p>
            <h2>Texas Hold&apos;em vs Omaha — różne kalkulatory</h2>
            <p>
              Oba kalkulatory używają symulacji Monte Carlo ale z różnymi regułami ewaluacji.
              W Texas możesz użyć dowolnych kart. W Omaha obowiązuje zasada 2+3 —
              kalkulator sprawdza wszystkie C(4,2)×C(5,3)=60 kombinacji i wybiera najlepszą.
              To dlatego intuicja z Texas nie działa w Omaha.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
