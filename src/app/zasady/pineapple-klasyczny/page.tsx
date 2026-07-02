import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Pineapple Classic — poker z wyrzutem karty po flopie',
  description: 'Pineapple Classic — 3 karty na rękę, po flopie wyrzucasz jedną. Zasady, różnice od Crazy Pineapple i Texas, strategia. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/pineapple-klasyczny/' },
};

export default function PineappleClassicPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Pineapple Classic</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>3 karty → wyrzut → 2 karty</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Pineapple Classic</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 620 }}>
              Pineapple Classic to wariant Texas Hold&apos;em gdzie każdy gracz dostaje 3 karty,
              ale po odkryciu flopu <strong>musi wyrzucić jedną z nich</strong>. Od tego momentu
              gra toczy się jak klasyczny Texas Hold&apos;em z 2 kartami.
            </p>
          </div>

          <div className="prose">
            <h2>Przebieg gry krok po kroku</h2>
            <ol>
              <li><strong>Rozdanie</strong> — każdy gracz otrzymuje 3 karty zakryte</li>
              <li><strong>Preflop</strong> — licytacja jak w Texas Hold&apos;em (wszyscy mają 3 karty)</li>
              <li><strong>Flop</strong> — odkrycie 3 kart wspólnych, licytacja</li>
              <li><strong>Wyrzut</strong> — po licytacji na flopie każdy gracz wybiera 1 kartę do odrzucenia. Zostają mu 2 karty</li>
              <li><strong>Turn</strong> — odkrycie 4. karty wspólnej, licytacja</li>
              <li><strong>River</strong> — odkrycie 5. karty wspólnej, licytacja</li>
              <li><strong>Showdown</strong> — najlepsza ręka 5-kartowa z 2 kart własnych i 5 wspólnych wygrywa</li>
            </ol>

            <h2>Kluczowa zasada — wyrzut po flopie</h2>
            <p>
              Po licytacji na flopie następuje faza wyrzutu. Wszyscy aktywni gracze jednocześnie
              (w Pokero) wybierają którą z 3 kart chcą odrzucić. Wyrzucona karta znika z gry.
              Wybór jest jednoczesny — nie widzisz co odrzucają rywale zanim sam zdecydujesz.
            </p>
            <p>
              Na etapie wyrzutu widzisz już 3 karty wspólne (flop), więc masz pełną informację
              o tym co pasuje do Twojej ręki. To właśnie ten moment decyzji jest sercem Pineapple Classic
              — często masz dwie opcje i musisz zdecydować w którym kierunku iść.
            </p>

            <h2>Ewaluacja ręki — jak w Texas</h2>
            <p>
              Po wyrzucie zostają Ci 2 karty. Ocena ręki jest identyczna jak w Texas Hold&apos;em —
              możesz użyć 0, 1 lub 2 kart z ręki w połączeniu z kartami wspólnymi.
              Jeśli 5 kart na stole tworzy lepszą rękę niż cokolwiek co masz — grasz planszą.
            </p>

            <h2>Porównanie z innymi wariantami</h2>
            <table>
              <thead>
                <tr><th>Cecha</th><th>Texas Hold&apos;em</th><th>Crazy Pineapple</th><th>Pineapple Classic</th></tr>
              </thead>
              <tbody>
                <tr><td>Karty startowe</td><td>2</td><td>3</td><td>3</td></tr>
                <tr><td>Wyrzut karty</td><td>brak</td><td>brak</td><td>1 karta po flopie</td></tr>
                <tr><td>Karty do showdownu</td><td>2</td><td>3</td><td>2</td></tr>
                <tr><td>Ewaluacja</td><td>Texas (dowolnie)</td><td>Texas (dowolnie)</td><td>Texas (dowolnie)</td></tr>
              </tbody>
            </table>

            <h2>Strategia — co odrzucić?</h2>
            <p>
              Po flopie masz 3 karty i widzisz 3 karty wspólne. Typowe scenariusze decyzji:
            </p>
            <ul>
              <li><strong>Masz draw</strong> (flush draw lub open-ended straight draw) — zachowaj 2 karty tworzące draw, odrzuć trzecią</li>
              <li><strong>Masz parę na ręce</strong> — zachowaj parę (może trafisz trójkę), odrzuć najsłabszą kartę</li>
              <li><strong>Masz parę z flopem</strong> — zachowaj kartę tworzącą parę ze stołem, rozważ które dwa połączenia dają więcej potencjału</li>
              <li><strong>Nie masz nic</strong> — zachowaj dwie najwyższe karty lub te z największym potencjałem</li>
            </ul>
            <p>
              Pineapple Classic nagradza graczy którzy potrafią szybko ocenić potencjał ręki po flopie.
              Różni się od Crazy Pineapple tym, że zmusza do konkretnej decyzji — nie możesz zachować
              wszystkich 3 opcji do showdownu.
            </p>

            <h2>Pineapple Classic w Pokero</h2>
            <p>
              W Pokero faza wyrzutu pojawia się automatycznie po licytacji na flopie.
              Klikasz kartę którą chcesz odrzucić — podświetla się i możesz potwierdzić.
              Jeśli nie zdecydujesz przed upływem czasu, ostatnia karta (trzecia) zostanie
              odrzucona automatycznie.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/crazy-pineapple/" className="btn-outline">← Crazy Pineapple</Link>
            <Link href="/zasady/drawmaha/" className="btn-outline">Drawmaha →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
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
