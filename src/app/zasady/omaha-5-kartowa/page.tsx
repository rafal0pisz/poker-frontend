import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha 5-kartowej (Big O) — 5 kart na rękę, dokładnie 2+3',
  description: 'Zasady Omaha 5-kartowej (Big O). 5 kart na rękę zamiast 4, reguła 2+3 taka sama. Silniejsze układy, więcej kombinacji. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha-5-kartowa/' },
};

export default function Omaha5Page() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Omaha 5-kartowa</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>5 kart na rękę · dokładnie 2+3 · silniejsze układy</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha 5-kartowej (Big O)</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640 }}>
              Omaha 5-kartowa, znana jako <strong>Big O</strong>, to Omaha z jedną zmianą: każdy gracz dostaje <strong>5 kart</strong> zamiast 4. Reguła 2+3 pozostaje taka sama — musisz użyć dokładnie 2 kart z ręki i dokładnie 3 ze stołu. Więcej kart na ręce oznacza silniejsze układy i więcej dramatycznych showdownów.
            </p>
          </div>

          <div className="prose">
            <h2>Jedyna różnica od Omaha: 5 kart zamiast 4</h2>
            <p>Big O to Omaha, w której każdy gracz dostaje <strong>5 kart zakrytych</strong> zamiast 4. Zasada 2+3 obowiązuje tak samo: do finalnej ręki używasz dokładnie 2 swoich kart i dokładnie 3 ze stołu. Żadna inna reguła się nie zmienia.</p>

            <h2>Przebieg gry</h2>
            <ol>
              <li><strong>Preflop</strong> — każdy gracz dostaje 5 zakrytych kart, licytacja po blindach</li>
              <li><strong>Flop</strong> — odkrycie 3 kart wspólnych, licytacja</li>
              <li><strong>Turn</strong> — 4. karta wspólna, licytacja</li>
              <li><strong>River</strong> — 5. karta wspólna, finalna licytacja</li>
              <li><strong>Showdown</strong> — każdy pokazuje najlepszą kombinację 2 kart z ręki + 3 ze stołu</li>
            </ol>

            <h2>Dlaczego 5 kart robi dużą różnicę</h2>
            <p>Mając 5 kart, masz <strong>10 możliwych par</strong> do wyboru (kombinacje 2 z 5) zamiast 6 w standardowej Omaha. Każda z tych par łączy się z 10 możliwymi trójkami ze stołu — to 100 możliwych kombinacji zamiast 60. Efekty:</p>
            <ul>
              <li><strong>Znacznie silniejsze ręce w showdownie</strong> — full house i flushe są częstsze, straight flush zdarzają się regularnie</li>
              <li><strong>Gra preflop zmienia charakter</strong> — z 5 kartami łatwiej trafić w koordynację (double-suited, connected), więc więcej rąk jest grywalnych</li>
              <li><strong>Bleff jest jeszcze trudniejszy</strong> — gracze z 5 kartami rzadziej mają czyste &quot;bleffowe&quot; układy</li>
              <li><strong>Nut hand jest kluczowy</strong> — bez najsilniejszej możliwej wersji układu jesteś w bardzo trudnej sytuacji</li>
            </ul>

            <h2>Porównanie: Omaha 4-kartowa vs Big O</h2>
            <table>
              <thead><tr><th>Cecha</th><th>Omaha</th><th>Big O (Omaha 5)</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>4</td><td>5</td></tr>
                <tr><td>Możliwych par z ręki</td><td>6</td><td>10</td></tr>
                <tr><td>Kombinacji do oceny</td><td>60</td><td>100</td></tr>
                <tr><td>Zasada użycia kart</td><td>Dokładnie 2+3</td><td>Dokładnie 2+3</td></tr>
                <tr><td>Rundy licytacji</td><td>4</td><td>4</td></tr>
                <tr><td>Typowy wygrywający układ</td><td>Full house, flush</td><td>Silny full house, straight flush</td></tr>
              </tbody>
            </table>

            <h2>Strategia w Big O</h2>
            <ul>
              <li><strong>Graj ręce skoordynowane</strong> — 5 kart daje więcej możliwości, ale nieskoordynowane karty (np. 5 niepowiązanych) są słabsze niż w 4-kartowej Omaha</li>
              <li><strong>Double-suited jest ważniejszy</strong> — z 5 kart łatwiej trafić w nut flush draw</li>
              <li><strong>Nut draw &gt; inne drawy</strong> — jak w Omaha, nie-nut draw często prowadzi do utraty całego stacku</li>
              <li><strong>Oceniaj rękę globalnie</strong> — przy 5 kartach kuszące jest budowanie oczekiwań na zbyt wielu frontach jednocześnie</li>
            </ul>

            <h2>Omaha 5-kartowa w Pokero</h2>
            <p>Silnik gry automatycznie ewaluuje wszystkie 100 możliwych kombinacji i wybiera najlepszą dla każdego gracza. Reguła 2+3 jest egzekwowana bez wyjątku. W Dealer&apos;s Choice możesz ustawić Omaha 5-kartową jako swój preferowany wariant — w menu wyboru wariantu znajdziesz ją oznaczoną jako &quot;Omaha 5&quot;.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha-hi-lo/" className="btn-outline">← Omaha Hi-Lo</Link>
            <Link href="/zasady/crazy-pineapple/" className="btn-outline">Crazy Pineapple →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-hi-lo/">Omaha Hi-Lo</Link> ·{' '}
              <Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link> ·{' '}
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
