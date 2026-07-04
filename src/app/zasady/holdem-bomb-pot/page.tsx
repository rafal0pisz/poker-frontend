import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Hold\'em Bomb Pot — poker bez blindów, prosto na flopa',
  description: 'Zasady Hold\'em Bomb Pot: bez blindów, każdy gracz wpłaca ante, flop od razu na stole. Szybka, chaotyczna odmiana Texas Hold\'em na domowe rozgrywki.',
  alternates: { canonical: 'https://pokero.pl/zasady/holdem-bomb-pot/' },
};

export default function HoldemBombPotPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Hold&apos;em Bomb Pot</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>2 karty · bez blindów · ante od wszystkich</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Hold&apos;em Bomb Pot</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640 }}>
              Bomb Pot to szalona, imprezowa odmiana Texas Hold&apos;em. Nie ma blindów i nie ma licytacji na preflopie — każdy gracz przy stole wrzuca do puli tę samą stawkę (ante), po czym krupier od razu odkrywa flopa. Od tego momentu gra toczy się dokładnie jak zwykły Texas Hold&apos;em.
            </p>
          </div>

          <div className="prose">
            <h2>Cel gry</h2>
            <p>Dokładnie taki sam jak w klasycznym Texas Hold&apos;em — zbudować najlepszą 5-kartową rękę z 2 kart własnych i 5 wspólnych, albo zmusić wszystkich rywali do folda. Różnica dotyczy wyłącznie tego, jak zaczyna się ręka.</p>

            <h2>Przebieg ręki krok po kroku</h2>

            <h3>1. Ante zamiast blindów</h3>
            <p>Zanim ktokolwiek zobaczy karty, <strong>każdy gracz przy stole</strong> (nie tylko dwóch, jak przy blindach) wpłaca do puli ante równe wysokości big blinda ustawionego w pokoju. Jeśli komuś brakuje chipów na pełne ante, wpłaca tyle, ile ma, i od razu jest all-in na tę rękę — dokładnie tak samo jak przy krótkim stacku na blindach.</p>

            <h3>2. Karty i flop — bez licytacji na preflopie</h3>
            <p>Każdy gracz dostaje 2 karty zakryte, tak jak w zwykłym Holdemie. Nie ma jednak rundy licytacji preflop — krupier odkrywa od razu 3 karty flopa. Nikt nie mógł spasować przed flopem, więc każda ręka gwarantuje realną akcję z prawdziwymi pieniędzmi w puli.</p>

            <h3>3. Flop, turn, river — jak w zwykłym Holdemie</h3>
            <p>Od flopa gra toczy się już całkowicie standardowo. Licytację na flopie zaczyna pierwszy aktywny gracz po lewej stronie dealera, dokładnie jak przy zwykłym postflopowym rozdaniu. Turn, river i showdown przebiegają bez żadnych różnic względem klasycznego Texas Hold&apos;em.</p>

            <h2>Czym różni się od zwykłego Texas Hold&apos;em</h2>
            <table>
              <thead><tr><th></th><th>Texas Hold&apos;em</th><th>Hold&apos;em Bomb Pot</th></tr></thead>
              <tbody>
                <tr><td>Kto wpłaca przed kartami</td><td>2 graczy (SB + BB)</td><td>Wszyscy gracze przy stole</td></tr>
                <tr><td>Licytacja preflop</td><td>Tak</td><td>Brak — od razu flop</td></tr>
                <tr><td>Licytacja flop / turn / river</td><td>Tak</td><td>Tak, bez zmian</td></tr>
                <tr><td>Ewaluacja układów</td><td>Najlepsze 5 z 7 kart</td><td>Najlepsze 5 z 7 kart — bez zmian</td></tr>
              </tbody>
            </table>

            <h2>Dlaczego warto zagrać Bomb Pota</h2>
            <p>Bomb Pot to czysta rozrywka — wszyscy gwarantowanie widzą flopa z realną stawką w puli, więc rozdanie jest szybsze, bardziej chaotyczne i mniej przewidywalne niż standardowa ręka. To popularny sposób na urozmaicenie domowej gry, szczególnie gdy przy stole robi się zbyt ostrożnie i za dużo rąk kończy się przed flopem.</p>

            <h2>Hold&apos;em Bomb Pot w Pokero</h2>
            <p>W Pokero Bomb Pot to jeden z wariantów dostępnych w <strong>Dealer&apos;s Choice</strong> — gdy nadejdzie Twoja kolej jako dealera, wybierz &bdquo;Hold&apos;em Bomb Pot&rdquo; z listy wariantów, a Twoja ręka rozegra się bez blindów, z ante od wszystkich graczy i flopem odkrytym od razu. Wysokość ante to zawsze jeden big blind ustawiony w ustawieniach pokoju.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/" className="btn-outline">← Wszystkie zasady</Link>
            <Link href="/zasady/texas-holdem/" className="btn-outline">Texas Hold&apos;em →</Link>
            <Link href="/zasady/uklady-kart/" className="btn-outline">Układy kart →</Link>
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
