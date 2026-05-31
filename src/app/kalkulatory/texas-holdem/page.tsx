import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';
import { TexasCalculator } from '@/components/seo/TexasCalculator';

export const metadata: Metadata = {
  title: 'Kalkulator szans pokerowych Texas Hold\'em — sprawdź swoje equity',
  description: 'Darmowy kalkulator szans w Texas Hold\'em. Wybierz karty, ustaw liczbę rywali i sprawdź swoje equity. Symulacja Monte Carlo 5000 rozdań. Pre-flop, flop, turn, river.',
  alternates: { canonical: 'https://pokero.pl/kalkulatory/texas-holdem/' },
  keywords: ['kalkulator pokerowy', 'szanse w pokerze', 'equity poker', 'poker odds kalkulator', 'texas holdem kalkulator'],
  openGraph: {
    title: 'Kalkulator szans pokerowych Texas Hold\'em',
    description: 'Sprawdź swoje szanse na wygraną. Symulacja 5000 rozdań.',
    type: 'website',
  },
};

export default function TexasCalculatorPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/kalkulatory/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Kalkulatory</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Texas Hold&apos;em</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Kalkulator</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.75rem' }}>
              Kalkulator szans — Texas Hold&apos;em
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Wybierz swoje karty, ustaw liczbę rywali i opcjonalnie dodaj karty wspólne.
              Kalkulator pokaże Ci szanse na wygraną oparte na symulacji 5000 rozdań.
            </p>
          </div>

          {/* Calculator component */}
          <TexasCalculator />

          {/* SEO content below */}
          <div className="prose" style={{ marginTop: '3rem' }}>
            <h2>Co to jest equity w pokerze?</h2>
            <p>
              Equity to Twój procentowy udział w puli — ile procent puli "należy do Ciebie" statystycznie biorąc
              pod uwagę aktualne karty. Jeśli masz equity 65%, oznacza to że w długiej serii wygrasz 65% takich sytuacji.
              Equity nie mówi ci co się stanie w tej konkretnej ręce — mówi ci jak sprawy mają się w dłuższej perspektywie.
            </p>
            <p>
              Znajomość equity jest kluczowa do podejmowania dobrych decyzji pokerowych. Jeśli Twoje equity wynosi 60%
              ale musiałbyś wpłacić 80% puli żeby zostać w grze — matematycznie nie opłaca się callować.
            </p>

            <h2>Jak korzystać z kalkulatora?</h2>
            <ol>
              <li><strong>Wybierz kolor</strong> — kliknij Kier, Karo, Pik lub Trefl</li>
              <li><strong>Wybierz wartość</strong> — kliknij wartość karty (A, K, Q... 2)</li>
              <li><strong>Ustaw liczbę rywali</strong> — suwakiem wybierz 1-8 przeciwników</li>
              <li><strong>Opcjonalnie: dodaj karty wspólne</strong> — flop, turn, river żeby zobaczyć equity w konkretnej sytuacji</li>
              <li><strong>Odczytaj wyniki</strong> — widzisz % wygranej, remisu i przegranej</li>
            </ol>

            <h2>Jak działa symulacja?</h2>
            <p>
              Kalkulator używa metody <strong>Monte Carlo</strong> — wykonuje 5000 losowych symulacji każdej sytuacji.
              W każdej symulacji: uzupełnia brakujące karty wspólne losowo z pozostałej talii,
              losuje karty dla każdego rywala i sprawdza który gracz ma najlepszą rękę 5-kartową.
              Po 5000 próbach wynik jest stabilny z dokładnością ±1-2%.
            </p>
            <p>
              Gdy wszystkie 5 kart wspólnych jest znanych (river), kalkulator nie musi symulować — wynik jest deterministyczny.
            </p>

            <h2>Przykłady equity — co jest mocne, co słabe?</h2>
            <table>
              <thead><tr><th>Ręka</th><th>Rywal</th><th>Equity (approx.)</th><th>Ocena</th></tr></thead>
              <tbody>
                <tr><td>A♠ A♥ (Asy)</td><td>1 rywal</td><td>~85%</td><td>Najsilniejsza ręka startowa</td></tr>
                <tr><td>K♠ K♥ (Króle)</td><td>1 rywal</td><td>~82%</td><td>Bardzo silna, ostrożnie przy Asie na flopie</td></tr>
                <tr><td>A♠ K♠ (AKs)</td><td>1 rywal</td><td>~67%</td><td>Silna ręka, ale nie asy/króle</td></tr>
                <tr><td>7♠ 2♥ (72o)</td><td>1 rywal</td><td>~34%</td><td>Najsłabsza możliwa ręka startowa</td></tr>
                <tr><td>A♠ A♥</td><td>8 rywali</td><td>~36%</td><td>Asy słabną przy wielu graczach</td></tr>
              </tbody>
            </table>

            <h2>Pre-flop equity — najważniejsze ręce startowe</h2>
            <p>
              Pary kieszonkowe (pocket pairs) są generalnie silnymi rękami startowymi — para asów to około 85% equity heads-up,
              para 2-2 to około 52%. Karty "suited" (tego samego koloru) dają bonus około 2-3% equity względem tej samej
              ręki w różnych kolorach. Konektor suited (np. 8♠ 9♠) jest wart więcej niż mogłoby się wydawać przez
              możliwości na strit i kolor.
            </p>
            <p>
              Ważna zasada: equity pre-flop przy wielu graczach spada nawet dla silnych rąk.
              Para asów przeciwko 8 rywalom ma equity tylko ~36% — bo statystycznie ktoś z 8 graczy trafi coś na flopie.
            </p>

            <h2>Jak equity przekłada się na decyzje?</h2>
            <p>
              Kluczowe pojęcie: <strong>pot odds</strong> (stosunek puli do ceny calla).
              Jeśli pula wynosi 100 i musisz wpłacić 25 żeby zostać — płacisz 25 za szansę wygrania 125, czyli 20%.
              Jeśli Twoje equity jest wyższe niż 20% — matematycznie opłaca się callować.
            </p>
            <p>
              Kalkulator pomaga zrozumieć tę matematykę w praktyce. Zanim zasiądziesz do gry w{' '}
              <Link href="/">Pokero</Link>, przetestuj różne scenariusze żeby zbudować intuicję.
            </p>

            <h2>Outs — alternatywny sposób liczenia szans</h2>
            <p>
              Poza equity możesz liczyć szanse przez "outs" — liczbę kart które poprawią Twoją rękę.
              Prosta zasada: na turnie (1 karta do river) każdy out = około 2% szansy na trafienie.
              Na flopie (2 karty do showdownu) każdy out = około 4%.
            </p>
            <p>
              Przykład: masz 4 karty do koloru (flush draw) = 9 outów.
              Na flopie: 9 × 4% = ~36% szansy na trafienie koloru do river.
              Kalkulator oblicza to dokładnie przez symulację.
            </p>
          </div>

          {/* Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Kalkulator szans pokerowych Texas Hold\'em',
                url: 'https://pokero.pl/kalkulatory/texas-holdem/',
                applicationCategory: 'UtilitiesApplication',
                description: 'Darmowy kalkulator equity dla Texas Hold\'em. Symulacja Monte Carlo 5000 rozdań.',
                inLanguage: 'pl',
                offers: { '@type': 'Offer', price: '0' },
                operatingSystem: 'Web',
              }),
            }}
          />

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Powiązane:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Zasady Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/uklady-kart/">Układy kart</Link> ·{' '}
              <Link href="/blog/jak-blefowac-w-pokerze/">Jak blefować</Link> ·{' '}
              <Link href="/blog/pozycja-w-pokerze/">Pozycja w pokerze</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
