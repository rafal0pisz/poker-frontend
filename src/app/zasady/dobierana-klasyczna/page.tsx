import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Dobieranej klasycznej (Five Card Draw) — bez kart wspólnych',
  description: 'Zasady Dobieranej klasycznej (Five Card Draw). 5 kart na rękę, brak kart wspólnych, jedna wymiana kart między dwiema rundami licytacji. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/dobierana-klasyczna/' },
};

export default function DobieranaKlasycznaPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Dobierana klasyczna</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>5 kart na rękę · bez stołu · jedna wymiana</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Dobieranej klasycznej (Five Card Draw)</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640 }}>
              Dobierana klasyczna to najstarszy wariant pokera z tej listy — i najprostszy w zasadach. <strong>Brak kart wspólnych, brak flopu, turnu i riveru</strong>. Dostajesz 5 kart, licytujesz, wymieniasz dowolną liczbę kart raz, licytujesz jeszcze raz i pokazujesz karty. Standardowy ranking układów, bez podziału puli.
            </p>
          </div>

          <div className="prose">
            <h2>Bez stołu — tylko Twoje 5 kart</h2>
            <p>To jedyny wariant w Pokero, w którym <strong>nie ma żadnych kart wspólnych</strong>. Cała gra toczy się wokół 5 kart, które trzymasz w ręce od rozdania aż do showdownu — poza tymi, które sam zdecydujesz się wymienić. Wygrywa standardowy układ pokerowy, oceniany tylko z tych 5 kart, tak jak w klasycznym rankingu (para, dwie pary, kolor, full itd.).</p>

            <h2>Przebieg gry</h2>
            <ol>
              <li><strong>Rozdanie</strong> — każdy gracz dostaje 5 zakrytych kart, bez żadnych kart na stole</li>
              <li><strong>Pierwsza licytacja</strong> — po blindach, zanim ktokolwiek wymieni kartę</li>
              <li><strong>Wymiana kart (draw)</strong> — każdy gracz jednocześnie i prywatnie wybiera od 0 do 5 kart do wymiany na nowe z talii. Zero wymian = &quot;stoję&quot; (stand pat)</li>
              <li><strong>Druga licytacja</strong> — ostatnia runda zakładów, już z nowymi kartami</li>
              <li><strong>Showdown</strong> — najlepszy standardowy układ z 5 kart wygrywa całą pulę</li>
            </ol>

            <h2>Czym różni się od innych wariantów z wymianą</h2>
            <ul>
              <li><strong>Wymiana jest prywatna i jednorazowa</strong> — w przeciwieństwie do Drawmahy, nikt nie zobaczy która karta trafiła do stołu ani nie ma rundy &quot;akceptuję/odrzucam&quot;. Wymieniasz i od razu masz nowe karty</li>
              <li><strong>Zero kart wspólnych</strong> — inaczej niż w każdym innym wariancie w Pokero, tu w ogóle nie ma stołu do odczytywania</li>
              <li><strong>Brak podziału puli</strong> — jeden zwycięzca, standardowy ranking układów, bez high/low</li>
              <li><strong>No Limit</strong> — zakłady nie są ograniczone rozmiarem puli, tak jak w Texasie</li>
            </ul>

            <h2>Porównanie: Dobierana klasyczna vs Drawmaha</h2>
            <table>
              <thead><tr><th>Cecha</th><th>Dobierana klasyczna</th><th>Drawmaha</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>5</td><td>5</td></tr>
                <tr><td>Karty wspólne</td><td>Brak</td><td>Tak (Omaha-style)</td></tr>
                <tr><td>Wymiana kart</td><td>0-5, prywatnie, bez rewelacji</td><td>1 karta ujawniana publicznie na żywo</td></tr>
                <tr><td>Podział puli</td><td>Nie — jeden zwycięzca</td><td>Tak — Omaha + Draw</td></tr>
                <tr><td>Limit zakładów</td><td>No Limit</td><td>Pot Limit</td></tr>
                <tr><td>Rundy licytacji</td><td>2</td><td>4</td></tr>
              </tbody>
            </table>

            <h2>Strategia w Dobieranej klasycznej</h2>
            <ul>
              <li><strong>Licz na co grasz przed wymianą</strong> — para, trójka, strit-draw czy kolor-draw wymaga innej liczby wymienianych kart</li>
              <li><strong>Stanie (stand pat) to informacja</strong> — gracz, który nie wymienia żadnej karty, zwykle reprezentuje bardzo silny układ</li>
              <li><strong>Liczba wymienionych kart zdradza rękę</strong> — doświadczeni gracze czytają przeciwników po tym, ile kart dobierają</li>
              <li><strong>Pozycja ma jeszcze większe znaczenie</strong> — działając jako ostatni, widzisz ile kart wymienili wszyscy przed Tobą</li>
            </ul>

            <h2>Dobierana klasyczna w Pokero</h2>
            <p>Wybierasz karty do wymiany dotknięciem, dokładnie tak jak w Drawmasze — różnica w tym, że tutaj wymiana jest w pełni prywatna i natychmiastowa, bez etapu ujawniania. Silnik gry rozdaje nowe karty z talii od razu po zatwierdzeniu wyboru. W Dealer&apos;s Choice znajdziesz ją jako &quot;Five Card Draw&quot;.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/drawmaha/" className="btn-outline">← Drawmaha</Link>
            <Link href="/zasady/uklady-kart/" className="btn-outline">Układy kart →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-hi-lo/">Omaha Hi-Lo</Link> ·{' '}
              <Link href="/zasady/courchevel/">Courchevel</Link> ·{' '}
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
