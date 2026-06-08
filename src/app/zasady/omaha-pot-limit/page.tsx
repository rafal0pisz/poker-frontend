import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha Pot Limit (PLO) — poker z limitem puli',
  description: 'Omaha Pot Limit — 4 karty na rękę, musisz użyć dokładnie 2+3, maksymalny bet to rozmiar puli. Zasady PLO, strategia, różnice vs Omaha bez limitu.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha-pot-limit/' },
};

export default function OmahaPotLimitPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Omaha Pot Limit</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>4 karty · limit puli</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha Pot Limit</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 620 }}>
              Omaha Pot Limit (PLO) to najpopularniejszy wariant Omahy. Zasady identyczne jak w Omaha,
              z jedną kluczową różnicą: <strong>maksymalny raise jest ograniczony do rozmiaru aktualnej puli</strong>.
              Nie możesz podbić więcej niż wynosi pula po Twoim callu.
            </p>
          </div>

          <div className="prose">
            <h2>Zasady — identyczne jak Omaha</h2>
            <p>
              Pełne zasady Omaha obowiązują bez zmian. Każdy gracz dostaje 4 karty zakryte.
              Przy ocenie ręki musisz użyć <strong>dokładnie 2 kart z ręki i dokładnie 3 kart ze stołu</strong>.
              Gra toczy się przez preflop, flop, turn i river — standardowa struktura Texas Hold&apos;em.
            </p>
            <p>
              Więcej o zasadach Omahy: <Link href="/zasady/omaha/">Zasady Omaha →</Link>
            </p>

            <h2>Formuła Pot Limit</h2>
            <p>
              Maksymalny raise w Pot Limit to: <strong>rozmiar puli + dwukrotność kwoty do wyrównania</strong>.
              Inaczej mówiąc — maksymalny bet to tyle, ile wyniosłaby pula po Twoim callu.
            </p>
            <p>
              Przykład: pula wynosi 100, aktualny bet to 20, masz 0 wpłacone. Żeby wyrównać (call) płacisz 20,
              pula po callu = 140. Możesz podbić do 140. Łącznie wpłacasz 20 (call) + 140 (raise) = 160.
            </p>
            <p>
              Na preflop, kiedy blindy nie są jeszcze w głównej puli (są w aktualnych betach graczy),
              formuła uwzględnia wartość blindów — minimum raise wynosi zawsze 2× big blind.
            </p>

            <h2>Porównanie limitów</h2>
            <table>
              <thead>
                <tr><th>Limit</th><th>Maksymalny raise</th><th>Styl gry</th></tr>
              </thead>
              <tbody>
                <tr><td>No Limit</td><td>Całość chipów (all-in)</td><td>Agresywny, duże pule</td></tr>
                <tr><td>Pot Limit</td><td>Rozmiar aktualnej puli</td><td>Kontrolowany, strategiczny</td></tr>
                <tr><td>Fixed Limit</td><td>Stała kwota per ulica</td><td>Matematyczny, przewidywalny</td></tr>
              </tbody>
            </table>

            <h2>Dlaczego PLO jest popularniejsze niż NLO?</h2>
            <p>
              W Omahy No Limit można stracić cały stack w jednej ręce preflop, co przy 4 kartach
              i częstszych silnych układach prowadzi do gry &quot;push/fold&quot; zamiast prawdziwego pokera.
              Pot Limit wymusza głębszą grę — blef, pozycja i czytanie rywali mają realny wpływ.
            </p>
            <p>
              PLO jest uważany za grę wymagającą więcej umiejętności niż NLO właśnie przez ten mechanizm
              kontroli puli. Trudniej o przypadkowe zwycięstwo dużym all-inem preflop.
            </p>

            <h2>Strategia w PLO</h2>
            <p>
              Kluczowe różnice w strategii wobec Texas Hold&apos;em No Limit:
            </p>
            <ul>
              <li><strong>Nut ręka jest ważniejsza</strong> — w Omaha 4 karty oznacza że rywale często mają mocne ręce. Graj głównie nut drawy i nut made hands</li>
              <li><strong>Pozycja jest kluczowa</strong> — skoro nie możesz all-in preflop, późna pozycja daje ogromną przewagę informacyjną</li>
              <li><strong>Pot Limit ogranicza bleff</strong> — ciężej zrobić ogromny overbet. Bleff wymaga konsekwencji na wielu ulicach</li>
              <li><strong>Draw kombinacje</strong> — z 4 kartami masz znacznie więcej opcji na drawy. Opłacalność drawów liczy się inaczej niż w Texas</li>
            </ul>

            <h2>Omaha Pot Limit w Pokero</h2>
            <p>
              W Pokero przycisk raise pokazuje presety: min, ¼ puli, ½ puli i pełna pula.
              Nie możesz ręcznie wpisać kwoty wyższej niż aktualna pula — serwer odrzuci taki bet.
              Wszystkie obliczenia puli są automatyczne, możesz skupić się na grze.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha/" className="btn-outline">← Omaha</Link>
            <Link href="/zasady/drawmaha-pot-limit/" className="btn-outline">Drawmaha Pot Limit →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link> ·{' '}
              <Link href="/zasady/drawmaha-pot-limit/">Drawmaha Pot Limit</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
