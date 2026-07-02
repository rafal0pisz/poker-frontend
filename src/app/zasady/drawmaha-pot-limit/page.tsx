import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Drawmaha Pot Limit — poker z wymianą kart i limitem puli',
  description: 'Drawmaha Pot Limit — 5 kart, wymiana po flopie, split pot, max bet = rozmiar puli. Zasady, strategia i różnice vs Drawmaha No Limit.',
  alternates: { canonical: 'https://pokero.pl/zasady/drawmaha-pot-limit/' },
};

export default function DrawmahaPotLimitPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Drawmaha Pot Limit</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>5 kart · wymiana · split pot · limit puli</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Drawmaha Pot Limit</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 620 }}>
              Drawmaha Pot Limit to ta sama gra co Drawmaha — 5 kart, wymiana po flopie, split pot —
              z jedną różnicą: <strong>maksymalny raise jest ograniczony do rozmiaru aktualnej puli</strong>.
            </p>
          </div>

          <div className="prose">
            <h2>Zasady — identyczne jak Drawmaha</h2>
            <p>
              Pełne zasady Drawmaha obowiązują bez zmian. Każdy gracz dostaje 5 kart.
              Po licytacji na flopie gracze <strong>wymieniają dowolną liczbę kart</strong> (0–5).
              Pula jest podzielona na dwie połowy: jedna dla najlepszej ręki Omaha (2+3 z ręki),
              druga dla najlepszej ręki Draw (najlepsza 5-kartowa z kart w ręce).
            </p>
            <p>
              Więcej o zasadach Drawmaha: <Link href="/zasady/drawmaha/">Zasady Drawmaha →</Link>
            </p>

            <h2>Pot Limit w Drawmaha</h2>
            <p>
              Formuła jest identyczna jak w <Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link>:
              maksymalny raise = rozmiar puli po Twoim callu. Nie możesz podbić więcej niż wynosi pula.
            </p>
            <p>
              Limit puli szczególnie wpływa na licytację po fazie wymiany kart (po flopie, przed turnem).
              Gracze którzy wymienili dużo kart i trafili mocną rękę nie mogą od razu wpłacić całego stacku —
              muszą budować pulę przez kilka ulic.
            </p>

            <h2>Dlaczego Pot Limit zmienia strategię Drawmaha?</h2>
            <p>
              W Drawmaha No Limit gracz który trafił straight flush w Draw może natychmiast all-in po wymianie,
              co eliminuje większość trudniejszych decyzji. Pot Limit wymusza stopniowe budowanie puli:
            </p>
            <ul>
              <li><strong>Faza wymiany staje się ważniejsza</strong> — decyzja o tym ile kart wymienić
              jest bardziej strategiczna, bo nie można wygrać &quot;od razu&quot; dużym all-inem</li>
              <li><strong>Czytanie rywali po wymianie</strong> — ile kart wymienił rywal? Czy wziął 0 (mocna ręka
              Omaha lub zatrzymał Draw), czy wziął dużo (szuka Draw)?</li>
              <li><strong>Zarządzanie dwiema połowami puli</strong> — Pot Limit sprawia że warto grać
              na obie połowy zamiast koncentrować się tylko na jednej</li>
            </ul>

            <h2>Split pot w Pot Limit</h2>
            <p>
              Każda połowa puli jest licytowana osobno. Przy Pot Limit obie połowy rosną wolniej,
              więc częściej dochodzi do sytuacji gdzie warto walczyć o obie części zamiast
              poświęcać jedną na rzecz drugiej.
            </p>
            <p>
              Przykład: masz mocną rękę Draw (trójka asów) i solidny draw Omaha (nut flush draw).
              W No Limit gracz z gotową ręką Omaha może all-in i zakończyć grę. W Pot Limit
              masz więcej ulic żeby trafić flush i wyrównać lub pobić.
            </p>

            <h2>Drawmaha Pot Limit w Pokero</h2>
            <p>
              Mechanizm identyczny jak w Omaha Pot Limit — presety ¼ puli, ½ puli i pełna pula.
              Faza wymiany kart wygląda tak samo jak w Drawmaha: po licytacji na flopie
              każdy gracz wybiera które karty wymienić (można zatrzymać wszystkie).
              Karty wymienione przez rywali nie są widoczne do czasu odsłonięcia.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/drawmaha/" className="btn-outline">← Drawmaha</Link>
            <Link href="/zasady/omaha-pot-limit/" className="btn-outline">Omaha Pot Limit →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link> ·{' '}
              <Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
