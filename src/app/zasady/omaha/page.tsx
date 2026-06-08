import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha — 4 karty, reguła 2+3, strategia dla początkujących',
  description: 'Kompletne zasady Omaha Hold\'em. Musisz użyć dokładnie 2 kart z ręki i 3 ze stołu. Różnice vs Texas, strategie, typowe błędy. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha/' },
};

export default function OmahaPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Omaha</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>4 karty · dokładnie 2+3 · silniejsze układy</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 640 }}>
              Omaha to drugi co do popularności wariant pokera. Wygląda jak Texas Hold&apos;em — te same rundy licytacji, te same 5 kart wspólnych — ale każdy gracz dostaje <strong>4 karty</strong> zamiast 2, z obowiązkiem użycia dokładnie 2 z nich i dokładnie 3 ze stołu. Ta jedna zasada zmienia wszystko.
            </p>
          </div>

          <div className="prose">
            <h2>Kluczowa zasada: dokładnie 2+3</h2>
            <p>W Omaha <strong>zawsze musisz użyć dokładnie 2 kart z ręki i dokładnie 3 kart ze stołu</strong>. Nie możesz użyć 1 lub 3 własnych — tylko 2. To fundamentalna różnica od Texas Hold&apos;em.</p>
            <p>Przykład: masz A♠ A♥ K♦ Q♣, a na stole leży A♦ A♣ 7♠ 8♥ 9♦. Mimo że są 4 asy na stole i w ręce, możesz użyć maksymalnie 2 asy (bo masz tylko 2 w ręce) i potrzebujesz 3 ze stołu. Twoja najlepsza ręka to Four of a Kind tylko jeśli użyjesz A♠ A♥ z ręki + A♦ A♣ 7♠ ze stołu.</p>

            <h2>Przebieg gry — identyczny jak Texas</h2>
            <p>Omaha używa dokładnie tych samych rund licytacji co Texas Hold&apos;em:</p>
            <ol>
              <li><strong>Preflop</strong> — każdy dostaje 4 zakryte karty, licytacja po blindach</li>
              <li><strong>Flop</strong> — odkrycie 3 kart wspólnych, licytacja</li>
              <li><strong>Turn</strong> — 4. karta wspólna, licytacja</li>
              <li><strong>River</strong> — 5. karta wspólna, finalna licytacja</li>
              <li><strong>Showdown</strong> — gracze odsłaniają karty, wygrywa najlepsza ręka 2+3</li>
            </ol>
            <p>Zasady blindów, kolejność działania i typy akcji (fold, call, raise, all-in) są identyczne jak w <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link>.</p>

            <h2>Dlaczego 4 karty radykalnie zmienia grę</h2>
            <p>Mając 4 karty masz 6 możliwych par do wybrania (kombinacje 2 z 4). Każda z tych par łączy się z 10 możliwymi trójkami ze stołu (kombinacje 3 z 5). To oznacza 60 możliwych kombinacji zamiast 21 w Texas. Efekty:</p>
            <ul>
              <li><strong>Silniejsze ręce są częstsze</strong> — w Omaha flushes i full housy zdarzają się znacznie częściej. Para na flopie rzadko wygrywa</li>
              <li><strong>Nut handy mają kluczowe znaczenie</strong> — bez najsilniejszej możliwej wersji układu (nut) jesteś w bardzo trudnej pozycji</li>
              <li><strong>Draw kombinacje są silniejsze</strong> — mając 4 karty łatwiej trafić w draw, co oznacza że gra preflop i na flopie jest bardziej agresywna</li>
              <li><strong>Bleff jest trudniejszy</strong> — rywale częściej mają realne ręce, więc bleff bywa droższy</li>
            </ul>

            <h2>Typowe błędy graczy z Texas</h2>
            <p>Gracze przyzwyczajeni do Texas popełniają w Omaha te same błędy:</p>
            <ul>
              <li><strong>Przecenianie par premierowych</strong> — AA w Texas to świetna ręka preflopowa; w Omaha AA z dwoma losowymi kartami jest tylko lekkim faworytem</li>
              <li><strong>Ignorowanie reguły 2+3</strong> — myślenie "mam asa i jest as na stole" podczas gdy do ręki potrzebujesz drugiego asa</li>
              <li><strong>Brak nut drawów</strong> — w Texas draw na flushu bez najwyższej karty koloru bywa akceptowalny; w Omaha nie-nut draw często prowadzi do drugiej co do jakości ręki (i utraty całego stacku)</li>
            </ul>

            <h2>Porównanie Texas vs Omaha</h2>
            <table>
              <thead><tr><th>Cecha</th><th>Texas Hold&apos;em</th><th>Omaha</th></tr></thead>
              <tbody>
                <tr><td>Karty startowe</td><td>2</td><td>4</td></tr>
                <tr><td>Reguła użycia kart</td><td>0, 1 lub 2 z ręki</td><td>Dokładnie 2 z ręki</td></tr>
                <tr><td>Rundy licytacji</td><td>4 (pre/flop/turn/river)</td><td>4 (identyczne)</td></tr>
                <tr><td>Typowy wygrywający układ</td><td>Para, dwie pary</td><td>Full house, flush</td></tr>
                <tr><td>Znaczenie pozycji</td><td>Bardzo wysokie</td><td>Bardzo wysokie</td></tr>
                <tr><td>Trudność nauki</td><td>Łatwa</td><td>Średnia</td></tr>
              </tbody>
            </table>

            <h2>Omaha Pot Limit (PLO)</h2>
            <p>Omaha jest najczęściej grana w wersji Pot Limit (PLO), gdzie maksymalny raise jest ograniczony do rozmiaru puli. Pełny opis: <Link href="/zasady/omaha-pot-limit/">Zasady Omaha Pot Limit →</Link></p>

            <h2>Omaha w Pokero</h2>
            <p>W Pokero dostępna jest zarówno Omaha No Limit jak i Omaha Pot Limit. Reguła 2+3 jest egzekwowana automatycznie — silnik gry sam wybiera najlepszą kombinację zgodną z zasadami. W Dealer&apos;s Choice możesz wybrać Omaha lub PLO jako swój wariant na turę dealera.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/texas-holdem/" className="btn-outline">← Texas Hold&apos;em</Link>
            <Link href="/zasady/omaha-pot-limit/" className="btn-outline">Omaha Pot Limit →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
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
