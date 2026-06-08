import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Texas Hold\'em — kompletny przewodnik dla początkujących',
  description: 'Pełne zasady Texas Hold\'em krok po kroku. Blindy, rundy licytacji, układy kart, pozycje przy stole. Naucz się grać w najpopularniejszą grę pokerową.',
  alternates: { canonical: 'https://pokero.pl/zasady/texas-holdem/' },
};

export default function TexasHoldemPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Texas Hold&apos;em</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>2 karty · 5 wspólnych · najlepsza 5-kartowa ręka</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Texas Hold&apos;em</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 640 }}>
              Texas Hold&apos;em to najpopularniejsza forma pokera na świecie — ta sama którą widzisz w World Series of Poker i w kasynach online. Każdy gracz dostaje 2 karty zakryte i łączy je z 5 kartami wspólnymi na stole, by zbudować najlepszą 5-kartową rękę.
            </p>
          </div>

          <div className="prose">
            <h2>Cel gry</h2>
            <p>Wygrać pulę — zbiór chipów wrzuconych przez wszystkich graczy w danej ręce. Możesz to zrobić na dwa sposoby: posiadając najlepszą rękę przy showdownie, albo zmuszając wszystkich rywali do folda przed showdownem.</p>

            <h2>Przebieg ręki krok po kroku</h2>

            <h3>1. Blindy — obowiązkowe zakłady</h3>
            <p>Przed rozdaniem kart dwóch graczy wpłaca obowiązkowe zakłady zwane blindami. Gracz po lewej stronie dealera wpłaca <strong>small blind</strong> (np. 5 chipów), gracz następny — <strong>big blind</strong> (np. 10 chipów). Blindy rotują po stole z każdą ręką, więc każdy gracz po kolei ponosi ten koszt.</p>

            <h3>2. Preflop — rozdanie kart i pierwsza licytacja</h3>
            <p>Każdy gracz dostaje 2 karty zakryte (hole cards). Następuje runda licytacji zaczynająca się od gracza po lewej stronie big blinda. Każdy może: <strong>fold</strong> (spasować), <strong>call</strong> (wyrównać big blind), lub <strong>raise</strong> (podbić).</p>

            <h3>3. Flop — trzy karty wspólne</h3>
            <p>Krupier odkrywa 3 karty na stole (board). Są to pierwsze z pięciu kart wspólnych, z których korzystają wszyscy gracze. Następuje runda licytacji, zaczynając od pierwszego aktywnego gracza po lewej stronie dealera.</p>

            <h3>4. Turn — czwarta karta</h3>
            <p>Odkrywana jest czwarta karta wspólna. Kolejna runda licytacji. Stawki wzrastają — w Fixed Limit jest to moment podwojenia limitu.</p>

            <h3>5. River — piąta karta</h3>
            <p>Ostatnia, piąta karta wspólna. Finalna runda licytacji. To tutaj bleff ma największe znaczenie — gracze z silnymi rękami chcą zmaksymalizować pulę, słabi — uciec przed kosztownym showdownem.</p>

            <h3>6. Showdown</h3>
            <p>Jeśli po riverze zostaje więcej niż jeden gracz, następuje showdown. Gracze odkrywają karty. Najlepsza 5-kartowa kombinacja z 7 dostępnych (2 karty własne + 5 wspólnych) wygrywa pulę. Można użyć 0, 1 lub 2 własnych kart — zawsze jednak końcowa ręka ma dokładnie 5 kart.</p>

            <h2>Akcje licytacyjne</h2>
            <table>
              <thead><tr><th>Akcja</th><th>Kiedy dostępna</th><th>Co oznacza</th></tr></thead>
              <tbody>
                <tr><td>Check</td><td>Gdy nikt nie bet w tej rundzie</td><td>Przepuść bez wpłacania</td></tr>
                <tr><td>Bet</td><td>Gdy nikt nie bet w tej rundzie</td><td>Otwórz licytację kwotą</td></tr>
                <tr><td>Call</td><td>Gdy ktoś już bet lub raise</td><td>Wyrównaj aktualną stawkę</td></tr>
                <tr><td>Raise</td><td>Gdy ktoś już bet lub raise</td><td>Podnieś stawkę powyżej bieżącej</td></tr>
                <tr><td>Fold</td><td>Zawsze</td><td>Zrezygnuj z ręki</td></tr>
                <tr><td>All-in</td><td>Zawsze</td><td>Wpłać wszystkie posiadane chipy</td></tr>
              </tbody>
            </table>

            <h2>Układy kart od najsilniejszego</h2>
            <ol>
              <li><strong>Royal Flush</strong> — A K Q J 10 jednego koloru</li>
              <li><strong>Straight Flush</strong> — 5 kart po kolei jednego koloru</li>
              <li><strong>Four of a Kind</strong> — cztery karty tej samej wartości</li>
              <li><strong>Full House</strong> — trójka + para</li>
              <li><strong>Flush</strong> — 5 kart tego samego koloru (dowolne wartości)</li>
              <li><strong>Straight</strong> — 5 kart po kolei (różne kolory)</li>
              <li><strong>Three of a Kind</strong> — trzy karty tej samej wartości</li>
              <li><strong>Two Pair</strong> — dwie pary</li>
              <li><strong>Pair</strong> — jedna para</li>
              <li><strong>High Card</strong> — najwyższa karta gdy żaden układ nie pasuje</li>
            </ol>

            <h2>Pozycje przy stole</h2>
            <p>Pozycja to jedna z najważniejszych koncepcji w pokerze. Gracz działający <em>po</em> rywalu ma ogromną przewagę informacyjną — widzi co rywal zrobił, zanim sam musi podjąć decyzję.</p>
            <ul>
              <li><strong>Dealer (Button)</strong> — najlepsza pozycja, działa ostatni na flopie, turnie i riverze</li>
              <li><strong>Small Blind / Big Blind</strong> — najgorsza pozycja, działają pierwsi po flopie</li>
              <li><strong>UTG (Under the Gun)</strong> — pierwszy do działania na preflopie (po blindach)</li>
              <li><strong>Cutoff, HiJack</strong> — pozycje "średnie", bliżej dealera = lepiej</li>
            </ul>

            <h2>Podstawowa strategia preflopowa</h2>
            <p>Jako początkujący graj tylko mocnymi kartami startowymi. Silne ręce w każdej pozycji to pary premium (AA, KK, QQ, JJ), AK suited i AQ suited. Im gorsza pozycja (wcześniejsza), tym mocniejszych kart potrzebujesz do wejścia do gry.</p>
            <p>Najważniejsza zasada: <strong>nie graj zbyt wielu rąk</strong>. Gracze przegrywają głównie przez granie za dużo słabych kart w nadziei na cudowny flop.</p>

            <h2>Texas Hold&apos;em w Pokero</h2>
            <p>W Pokero Texas Hold&apos;em to domyślny wariant gry. Blindy ustala admin pokoju przed startem. Limit działania na decyzję to 30 sekund — po przekroczeniu następuje automatyczny fold. W Dealer&apos;s Choice każdy gracz może ustawić swój preferowany wariant na swoją turę jako dealera.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/" className="btn-outline">← Wszystkie zasady</Link>
            <Link href="/zasady/omaha/" className="btn-outline">Omaha →</Link>
            <Link href="/zasady/uklady-kart/" className="btn-outline">Układy kart →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
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
