import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: "Zasady Texas Hold'em — jak grać w pokera krok po kroku",
  description: "Pełne zasady Texas Hold'em: karty, blindy, rundy licytacji, układy rąk. Przewodnik dla początkujących i przypomnienie dla zaawansowanych.",
  alternates: { canonical: 'https://pokero.pl/zasady/texas-holdem/' },
};

export default function TexasPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Texas Hold&apos;em</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>2 karty na rękę</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Texas Hold&apos;em</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Texas Hold&apos;em to najpopularniejszy wariant pokera na świecie — grany w kasynach, turniejach i domowych rozgrywkach. Zasady są proste, ale strategia może być bardzo głęboka.
            </p>
          </div>

          <div className="prose">
            <h2>Cel gry</h2>
            <p>
              Celem jest wygranie żetonów z puli. Możesz to osiągnąć na dwa sposoby: mieć najlepszą rękę podczas showdownu (odsłonięcia kart) albo sprawić, by wszyscy pozostali gracze spasowali (sfoldowali).
            </p>

            <h2>Karty i gracze</h2>
            <p>
              Gra odbywa się standardową talią 52 kart. Przy stole może siedzieć od 2 do 9 graczy. Każdy gracz otrzymuje na początku <strong>2 karty zakryte</strong> (hole cards), widoczne tylko dla niego.
            </p>
            <p>
              Na środku stołu pojawia się 5 wspólnych kart (community cards), z których korzystają wszyscy gracze. Najlepsza ręka to 5 kart z dowolnej kombinacji kart własnych i wspólnych.
            </p>

            <h2>Układ pozycji</h2>
            <p>Kluczowe pozycje przy stole, w kolejności od dealera:</p>
            <table>
              <thead><tr><th>Pozycja</th><th>Opis</th></tr></thead>
              <tbody>
                <tr><td>Dealer (D)</td><td>Rozdaje karty, gra ostatni (poza preflopem w HU). Najlepsza pozycja.</td></tr>
                <tr><td>Small Blind (SB)</td><td>Gracz po lewej od dealera. Wymagana stawka = ½ BB.</td></tr>
                <tr><td>Big Blind (BB)</td><td>Gracz po lewej od SB. Wymagana stawka = 1 BB (pełna ciemna).</td></tr>
                <tr><td>UTG, HJ, CO…</td><td>Pozostałe pozycje — grają po blindach.</td></tr>
              </tbody>
            </table>

            <h2>Przebieg rundy — 4 etapy</h2>

            <h3>1. Preflop</h3>
            <p>Każdy gracz dostaje 2 karty zakryte. Licytacja zaczyna się od gracza po BB i biegnie w lewo. Opcje: <strong>fold</strong> (pas), <strong>call</strong> (wyrównanie), <strong>raise</strong> (podbicie).</p>

            <h3>2. Flop</h3>
            <p>Na stole odkrywają się 3 wspólne karty. Licytacja od SB (lub pierwszego aktywnego po lewej od dealera).</p>

            <h3>3. Turn</h3>
            <p>Czwarta wspólna karta. Kolejna runda licytacji.</p>

            <h3>4. River</h3>
            <p>Piąta i ostatnia karta. Finalna runda licytacji. Jeśli zostało 2+ graczy — następuje <strong>showdown</strong>.</p>

            <h2>Showdown</h2>
            <p>
              Gracze odsłaniają karty. Wygrywa najlepsza ręka 5-kartowa złożona z dowolnych kart własnych i wspólnych. Możesz też użyć obu kart własnych, jednej, albo żadnej (graj planszą) — byleby 5 kart było najlepszą kombinacją.
            </p>

            <h2>Zasada blindów</h2>
            <p>
              Blindy to obowiązkowe stawki, które "kupują" możliwość gry. SB = połowa BB, np. przy blindach 5/10 — SB wpłaca 5, BB wpłaca 10. Blindy rotują z każdą ręką zgodnie z ruchem wskazówek zegara.
            </p>

            <h2>Heads-up (1 vs 1)</h2>
            <p>
              W grze dwuosobowej zasady są nieco inne: dealer jest jednocześnie SB i gra pierwszy na preflopie. BB gra drugi. Po preflopie kolejność się odwraca — BB gra pierwszy.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/uklady-kart/" className="btn-outline">Układy kart →</Link>
            <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
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
