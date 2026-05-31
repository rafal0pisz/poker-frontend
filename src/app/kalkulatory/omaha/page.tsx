import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';
import { OmahaCalculator } from '@/components/seo/OmahaCalculator';

export const metadata: Metadata = {
  title: 'Kalkulator szans Omaha Poker — equity z zasadą 2+3',
  description: 'Darmowy kalkulator equity dla Omaha Poker. 4 karty na rękę, zasada dokładnie 2+3. Sprawdź swoje szanse na wygraną — symulacja Monte Carlo 4000 rozdań.',
  alternates: { canonical: 'https://pokero.pl/kalkulatory/omaha/' },
  keywords: ['kalkulator omaha', 'omaha equity', 'omaha odds kalkulator', 'szanse omaha poker', 'kalkulator pokerowy omaha'],
  openGraph: {
    title: 'Kalkulator szans Omaha Poker',
    description: 'Equity dla Omaha z zasadą dokładnie 2 karty z ręki + 3 ze stołu.',
    type: 'website',
  },
};

export default function OmahaCalculatorPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>

          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/kalkulatory/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Kalkulatory</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Omaha</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Kalkulator</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.75rem' }}>
              Kalkulator szans — Omaha Poker
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 620 }}>
              Wybierz 4 karty na rękę, ustaw liczbę rywali i opcjonalnie karty wspólne.
              Kalkulator oblicza equity z zachowaniem zasady Omaha: musisz użyć
              <strong style={{ color: '#d4af37' }}> dokładnie 2 karty z ręki + 3 ze stołu</strong>.
            </p>
          </div>

          <OmahaCalculator />

          <div className="prose" style={{ marginTop: '3rem' }}>
            <h2>Czym różni się kalkulator Omaha od Texas Hold&apos;em?</h2>
            <p>
              Kluczowa różnica to <strong>zasada 2+3</strong>. W Texas Hold&apos;em możesz użyć dowolnej kombinacji
              kart własnych i wspólnych — w Omaha musisz użyć dokładnie 2 kart z ręki i dokładnie 3 ze stołu.
              Dlatego kalkulator Omaha nie może po prostu wziąć wszystkich 9 kart (4 własne + 5 stołu)
              i wybrać najlepszej 5-kartowej ręki — musi sprawdzać wszystkie kombinacje C(4,2)×C(5,3) = 6×10 = 60
              możliwych układów i wybrać najlepszy spośród nich.
            </p>
            <p>
              To fundamentalna różnica która zmienia strategię: nawet jeśli widzisz świetną rękę
              na stole, możesz jej nie móc użyć jeśli nie masz pasujących 2 kart w ręce.
            </p>

            <h2>Jak korzystać z kalkulatora Omaha?</h2>
            <ol>
              <li><strong>Wybierz 4 karty na rękę</strong> — to obowiązkowe, bez 4 kart obliczenia nie są możliwe</li>
              <li><strong>Ustaw liczbę rywali</strong> — każdy rywal też losuje 4 karty i gra zasadą 2+3</li>
              <li><strong>Opcjonalnie: dodaj karty wspólne</strong> — 0 (pre-flop), 3 (flop), 4 (turn) lub 5 (river)</li>
              <li><strong>Kliknij Oblicz</strong> — symulacja 4000 rozdań z zasadą Omaha</li>
            </ol>
            <p>
              Uwaga: kalkulator waliduje że podane karty wspólne mają prawidłową liczbę
              (nie możesz podać np. 1 lub 2 kart wspólnych — to nie są prawidłowe stany gry).
            </p>

            <h2>Przykłady equity w Omaha</h2>
            <table>
              <thead><tr><th>Ręka</th><th>Rywal</th><th>Equity (approx.)</th><th>Uwaga</th></tr></thead>
              <tbody>
                <tr><td>A♠A♥K♠K♥ (top double-suited)</td><td>1 rywal</td><td>~70%</td><td>Najlepsza możliwa ręka startowa</td></tr>
                <tr><td>A♠A♥J♠T♥ (asy z konektor)</td><td>1 rywal</td><td>~66%</td><td>Silna z możliwościami</td></tr>
                <tr><td>K♠Q♠J♥T♥ (konektor double-suited)</td><td>1 rywal</td><td>~58%</td><td>Spekulatywna ale cenna</td></tr>
                <tr><td>A♠7♦3♥2♣ (słaby start)</td><td>1 rywal</td><td>~43%</td><td>Słaba bez połączeń</td></tr>
                <tr><td>A♠A♥K♠K♥</td><td>5 rywali</td><td>~32%</td><td>Nawet top hand słabnie przy wielu graczach</td></tr>
              </tbody>
            </table>

            <h2>Dlaczego equity w Omaha jest "bardziej wyrównane" niż w Texas?</h2>
            <p>
              W Texas Hold&apos;em para Asów ma equity ~85% heads-up. W Omaha nawet
              najlepsza ręka (A-A-K-K double-suited) ma tylko ~70%. Dlaczego?
            </p>
            <p>
              Każdy gracz ma 4 karty zamiast 2, co daje C(4,2)=6 kombinacji par do wyboru.
              Rywal ma statystycznie więcej możliwości budowania silnych rąk — flaszy, stritów i fullów.
              Dlatego w Omaha pojedyncze pary i dwie pary rzadko wygrywają showdown przy wielu graczach.
              Szukaj nuts (najlepszej możliwej ręki) lub nut-drawów.
            </p>

            <h2>Jak czytać wyniki?</h2>
            <p>
              Wynik pokazuje ile procent z 4000 symulowanych rozdań wygrałeś (lub zremisowałeś).
              Każdy rywal losuje 4 karty ze stołu i gra też zasadą 2+3. Wynik jest
              statystycznym przybliżeniem Twojego equity — im bliżej jesteś showdownu
              (więcej kart wspólnych), tym dokładniejszy jest wynik.
            </p>
            <p>
              Pre-flop equity zmienia się znacznie po flopie — szczególnie w Omaha gdzie
              draw possibilities są ogromne. Zawsze przeliczaj equity po każdej ulicy.
            </p>

            <h2>Strategiczne zastosowania kalkulatora</h2>
            <p>
              Kalkulator jest szczególnie przydatny do nauki <strong>doboru rąk startowych</strong>.
              Przetestuj różne kombinacje 4 kart i porównaj ich equity — szybko zobaczysz
              że ręce &quot;double-suited&quot; (dwie pary w tych samych kolorach) są znacznie
              silniejsze od tej samej ręki w różnych kolorach.
            </p>
            <p>
              Możesz też testować scenariusze post-flop: masz flush draw + straight draw
              z konkretną ręką? Dodaj karty stołu i sprawdź ile procent szansy masz
              na zamknięcie ręki do river. To pozwoli lepiej oceniać czy call jest opłacalny.
            </p>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Kalkulator szans Omaha Poker',
                url: 'https://pokero.pl/kalkulatory/omaha/',
                applicationCategory: 'UtilitiesApplication',
                description: 'Kalkulator equity dla Omaha Poker z zasadą dokładnie 2+3. Symulacja Monte Carlo 4000 rozdań.',
                inLanguage: 'pl',
                offers: { '@type': 'Offer', price: '0' },
                operatingSystem: 'Web',
              }),
            }}
          />

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Powiązane:</strong>{' '}
              <Link href="/kalkulatory/texas-holdem/">Kalkulator Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Zasady Omaha</Link> ·{' '}
              <Link href="/blog/omaha-strategia/">Strategia Omaha</Link> ·{' '}
              <Link href="/blog/poker-vs-omaha/">Texas vs Omaha — porównanie</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
