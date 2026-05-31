import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha Poker — różnice vs Texas Hold\'em',
  description: 'Pełne zasady pokera Omaha. 4 karty na rękę, obowiązek użycia dokładnie 2. Porównanie z Texas Hold\'em, przykłady rąk, strategia dla początkujących.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha/' },
};

export default function OmahaPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Omaha</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>4 karty na rękę</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha Poker</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Omaha to drugi pod względem popularności wariant pokera. Wygląda jak Texas Hold&apos;em, ale ma jeden kluczowy twist — i przez to jest znacznie bardziej emocjonujący.
            </p>
          </div>

          <div className="prose">
            <h2>Najważniejsza zasada Omaha</h2>
            <p>
              W Omaha musisz użyć <strong>dokładnie 2 kart z ręki</strong> i <strong>dokładnie 3 kart ze stołu</strong>. Nie możesz grać 1+4, 0+5 ani 3+2. Zawsze 2+3.
            </p>
            <p>
              To fundamentalna różnica vs Texas Hold&apos;em, gdzie możesz użyć dowolnej kombinacji kart. W Omaha ta zasada jest obowiązkowa i zmienia wszystko.
            </p>

            <h2>Przebieg gry</h2>
            <p>Identyczny jak Texas Hold&apos;em: Preflop → Flop → Turn → River → Showdown. Blindy, kolejność, pula — wszystko tak samo.</p>
            <p>Różnica jest tylko na ręce: każdy gracz dostaje <strong>4 karty zakryte</strong> zamiast 2.</p>

            <h2>Omaha vs Texas Hold'em — porównanie</h2>
            <table>
              <thead><tr><th>Element</th><th>Texas Hold&apos;em</th><th>Omaha</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>2</td><td>4</td></tr>
                <tr><td>Użycie kart własnych</td><td>0, 1 lub 2</td><td>Dokładnie 2</td></tr>
                <tr><td>Karty ze stołu</td><td>3, 4 lub 5</td><td>Dokładnie 3</td></tr>
                <tr><td>Możliwe kombinacje</td><td>21</td><td>60</td></tr>
                <tr><td>Siła rąk</td><td>Standardowa</td><td>Wyższa (więcej kart)</td></tr>
              </tbody>
            </table>

            <h2>Częsty błąd początkujących</h2>
            <p>
              Gracz ma w ręce 4 karty kolorowe. Na stole leżą 3 karty w tym samym kolorze. Wydaje mu się, że ma flacha. Ale jeśli w jego ręce tylko 1 karta jest w tym kolorze — nie ma flasha, bo musi użyć dokładnie 2 kart z ręki.
            </p>
            <p>
              W Pokero ewaluacja rąk odbywa się automatycznie — gra sama wybiera najlepszą kombinację spełniającą zasadę 2+3.
            </p>

            <h2>Strategia w Omaha</h2>
            <p>
              Ponieważ każdy ma 4 karty, dobre ręce są częstsze. Przy pięciu graczach na stole spodziewaj się, że showdown wygra lepszy układ niż w Texasie. Dwie pary rzadko wystarczają — szukaj kolorów, stritów i fullów.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/texas-holdem/" className="btn-outline">← Texas Hold&apos;em</Link>
            <Link href="/zasady/crazy-pineapple/" className="btn-outline">Crazy Pineapple →</Link>
            <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
