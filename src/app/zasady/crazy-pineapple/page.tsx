import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Crazy Pineapple — zasady gry i strategia',
  description: 'Zasady Crazy Pineapple — wariant pokera z 3 kartami na ręce. Możesz użyć 1 lub 2 kart. Porównanie z Texas Hold\'em, kiedy warto grać Pineapple.',
  alternates: { canonical: 'https://pokero.pl/zasady/crazy-pineapple/' },
};

export default function PineapplePage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Crazy Pineapple</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>3 karty na rękę</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Crazy Pineapple — zasady gry</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Crazy Pineapple to jeden z najbardziej przystępnych wariantów pokera dla graczy znających Texas Hold&apos;em. Zasady są prawie identyczne — jedyna różnica to liczba kart na ręce.
            </p>
          </div>

          <div className="prose">
            <h2>Podstawowe zasady</h2>
            <p>
              Każdy gracz otrzymuje <strong>3 karty zakryte</strong> zamiast standardowych 2. Na stole pojawia się 5 wspólnych kart, tak samo jak w Texasie.
            </p>
            <p>
              Kluczowa zasada: musisz użyć <strong>1 lub 2 karty z ręki</strong> — nie wolno grać wszystkimi 3. Najlepsza ręka to 5 kart z dozwolonej kombinacji.
            </p>

            <h2>Porównanie z Texas Hold'em</h2>
            <table>
              <thead><tr><th>Element</th><th>Texas Hold&apos;em</th><th>Crazy Pineapple</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>2</td><td>3</td></tr>
                <tr><td>Użycie kart własnych</td><td>0, 1 lub 2</td><td>1 lub 2 (nie 0, nie 3)</td></tr>
                <tr><td>Ulice gry</td><td>Preflop, Flop, Turn, River</td><td>Identyczne</td></tr>
                <tr><td>Możliwe kombinacje własne</td><td>C(2,1)+C(2,2) = 3</td><td>C(3,1)+C(3,2) = 6</td></tr>
              </tbody>
            </table>

            <h2>Dlaczego "Crazy"?</h2>
            <p>
              Trzecia karta na ręce daje Ci dodatkową opcję blefa i ukrywania siły ręki. Przeciwnicy nie wiedzą którą z Twoich trzech kart "wyrzuciłeś" w obliczeniach — muszą rozważać więcej możliwości.
            </p>

            <h2>Strategia</h2>
            <p>
              Crazy Pineapple nagradza graczy którzy potrafią ocenić relatywną siłę swoich kart przed obejrzeniem flopa. Mając 3 karty masz więcej "startowych kombinacji" — ale musisz umieć ocenić czy Twoje 3 karty tworzą dobrze skomunikowaną rękę.
            </p>
            <p>
              Najsilniejsze starty to 3 karty które oferują wiele możliwości: dwie wysokie pary, kolor+strit draw, lub dwie wysokie plus connector.
            </p>

            <h2>Crazy Pineapple w Pokero</h2>
            <p>
              W Pokero Crazy Pineapple jest jednym z czterech wariantów w Dealer&apos;s Choice. Dealer wybiera wariant co rękę — Pineapple świetnie sprawdza się jako "odmiana" między rundami Texasa.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha/" className="btn-outline">← Omaha</Link>
            <Link href="/zasady/drawmaha/" className="btn-outline">Drawmaha →</Link>
            <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
