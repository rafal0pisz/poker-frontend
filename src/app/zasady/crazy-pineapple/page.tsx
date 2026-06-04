import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Crazy Pineapple — poker z 3 kartami na ręce',
  description: 'Pełne zasady Crazy Pineapple. 3 karty na rękę, zasady Texas Hold\'em — możesz użyć dowolnej kombinacji kart własnych i wspólnych. Różnice vs Texas, strategia.',
  alternates: { canonical: 'https://pokero.pl/zasady/crazy-pineapple/' },
};

export default function PineapplePage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Crazy Pineapple</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>3 karty na rękę</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Crazy Pineapple</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Crazy Pineapple to Texas Hold&apos;em z jedną zmianą — każdy gracz dostaje 3 karty zamiast 2.
              Poza tym zasady są identyczne: możesz użyć dowolnej kombinacji kart własnych i wspólnych,
              wygrywa najlepsza ręka 5-kartowa.
            </p>
          </div>

          <div className="prose">
            <h2>Podstawowa zasada — jak Texas, tylko 3 karty</h2>
            <p>
              W Crazy Pineapple każdy gracz otrzymuje <strong>3 karty zakryte</strong> zamiast standardowych 2.
              Poza tym gra toczy się dokładnie jak Texas Hold&apos;em — te same 5 wspólnych kart na stole (flop, turn, river),
              te same rundy licytacji, te same układy rąk.
            </p>
            <p>
              Kluczowa różnica wobec Omaha: <strong>nie ma żadnego obowiązku użycia określonej liczby kart</strong>.
              Możesz użyć dowolnej kombinacji kart — 0, 1, 2 lub wszystkich 3 — dokładnie jak w Texas Hold&apos;em.
              Wszystkie 3 karty zostają przy Tobie do showdownu. Nie wyrzucasz żadnej.
            </p>

            <h2>Porównanie z Texas Hold'em</h2>
            <table>
              <thead><tr><th>Element</th><th>Texas Hold&apos;em</th><th>Crazy Pineapple</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>2</td><td>3</td></tr>
                <tr><td>Użycie kart własnych</td><td>0, 1 lub 2 (dowolnie)</td><td>0, 1, 2 lub 3 — grasz wszystkimi do końca</td></tr>
                <tr><td>Wspólne karty</td><td>5 (flop, turn, river)</td><td>5 (flop, turn, river)</td></tr>
                <tr><td>Ulice gry</td><td>Preflop → Flop → Turn → River</td><td>Identyczne</td></tr>
                <tr><td>Ewaluacja ręki</td><td>Najlepsza 5-kartowa z 7</td><td>Najlepsza 5-kartowa z 8</td></tr>
              </tbody>
            </table>

            <h2>Dlaczego Crazy Pineapple jest ciekawszy niż Texas?</h2>
            <p>
              Trzecia karta na ręce daje Ci więcej opcji. Masz 8 kart do budowania najlepszej ręki 5-kartowej
              (3 własne + 5 wspólnych) zamiast 7. To oznacza że silne ręce pojawiają się częściej —
              flasze, strity i full housy są bardziej prawdopodobne niż w Texas.
            </p>
            <p>
              Dodatkowa karta sprawia też że trudniej jest "czytać" rywali — mają więcej kombinacji możliwości
              niż przy 2 kartach na ręce. Blefowanie i czytanie rąk staje się bardziej wymagające.
            </p>

            <h2>Split pot — kiedy dochodzi?</h2>
            <p>
              Jeśli 5 kart wspólnych tworzy najlepszą możliwą rękę i żaden z graczy nie może jej pobić kartami własnym,
              pula jest dzielona po równo między wszystkich graczy którzy zostali do showdownu.
              Zasada identyczna jak w Texas Hold&apos;em.
            </p>
            <p>
              Przykład: stół pokazuje A♠ A♥ A♦ K♠ K♥ — kareta asów z królem. Jeśli żaden gracz nie ma
              czwartego asa ani drugiego króla w ręce żeby pobić ten układ, wszyscy grający dzielą pulę.
            </p>

            <h2>Strategia w Crazy Pineapple</h2>
            <p>
              Ponieważ każdy ma 3 karty, startowe ręce są silniejsze niż w Texas. Możesz grać nieco szerszy zakres —
              pary, konektor kolorowy, suited asy są wartościowsze gdy masz 3 karty do kombinowania.
            </p>
            <p>
              Pamiętaj jednak że rywale też mają 3 karty — więcej możliwości oznacza silniejsze ręce na showdownie.
              Nie przeceniaj pary lub dwóch par gdy stół wygląda groźnie.
            </p>

            <h2>Różnica od Pineapple Classic</h2>
            <p>
              W Pokero dostępna jest też wersja <strong>Pineapple Classic</strong> gdzie po flopie
              <em>musisz</em> wyrzucić jedną z 3 kart. W Crazy Pineapple — nie wyrzucasz nic,
              wszystkie 3 karty zostają przy Tobie przez całą grę. To prostszy i luźniejszy wariant.
            </p>
            <p>
              <Link href="/zasady/pineapple-klasyczny/">Zasady Pineapple Classic →</Link>
            </p>

            <h2>Crazy Pineapple w Pokero</h2>
            <p>
              W Pokero Crazy Pineapple jest jednym z czterech wariantów w Dealer&apos;s Choice.
              System automatycznie ocenia najlepszą rękę 5-kartową z dostępnych kart (do 8 łącznie).
              Możesz spokojnie skupić się na grze — ewaluacja odbywa się w tle.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha/" className="btn-outline">← Omaha</Link>
            <Link href="/zasady/drawmaha/" className="btn-outline">Drawmaha →</Link>
            <Link href="/" className="btn-primary">🎰 Zagraj teraz</Link>
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
