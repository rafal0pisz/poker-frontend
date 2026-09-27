import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Courchevel — Omaha Hi-Lo z kartą odkrytą przed preflopem',
  description: 'Zasady Courchevel. 5 kart na rękę, split pot Hi-Lo jak w Omaha Hi-Lo, ale pierwsza karta flopu jest odkryta jeszcze przed licytacją preflop. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/courchevel/' },
};

export default function CourchevelPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Courchevel</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>5 kart na rękę · split Hi-Lo · karta odkryta przed preflopem</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Courchevel</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640 }}>
              Courchevel to Omaha Hi-Lo z jedną zaskakującą zmianą: <strong>pierwsza karta flopu ląduje na stole, zanim ktokolwiek zdąży się odezwać w licytacji preflop</strong>. Grasz z tą informacją od pierwszej decyzji — a resztę zasad (5 kart na rękę, dokładnie 2+3, podział puli high/low) zna każdy, kto grał w Omaha Hi-Lo albo Big O.
            </p>
          </div>

          <div className="prose">
            <h2>Jedyna różnica: kiedy widzisz pierwszą kartę stołu</h2>
            <p>W zwykłej Omaha cały flop (3 karty) ląduje na stole dopiero <strong>po</strong> rundzie licytacji preflop. W Courchevel <strong>jedna karta flopu jest odkrywana od razu po rozdaniu rąk — zanim ktokolwiek postawi zakład</strong>. Licytacja preflop toczy się więc z tą jedną kartą już widoczną. Dopiero potem, po zakończeniu tej rundy, dokładane są pozostałe 2 karty flopu, kompletując go do standardowych 3.</p>

            <h2>Przebieg gry</h2>
            <ol>
              <li><strong>Rozdanie</strong> — każdy gracz dostaje 5 zakrytych kart, na stole ląduje 1. karta flopu (odkryta)</li>
              <li><strong>Preflop</strong> — licytacja po blindach, z tą 1 kartą już widoczną</li>
              <li><strong>Flop</strong> — dokładane są pozostałe 2 karty (flop ma teraz komplet 3), licytacja</li>
              <li><strong>Turn</strong> — 4. karta wspólna, licytacja</li>
              <li><strong>River</strong> — 5. karta wspólna, finalna licytacja</li>
              <li><strong>Showdown</strong> — pula dzielona jak w Omaha Hi-Lo: połowa dla najlepszej ręki (dokładnie 2 z ręki + 3 ze stołu), połowa dla najlepszego low (8 lub lepiej) — jeśli nikt się nie kwalifikuje do low, high bierze całość</li>
            </ol>

            <h2>Dlaczego wcześniejsza karta zmienia grę</h2>
            <ul>
              <li><strong>Decyzje preflop są bardziej świadome</strong> — widzisz fragment stołu zanim zainwestujesz pierwsze żetony, więc łatwiej ocenić czy twoje 5 kart do niego pasuje</li>
              <li><strong>Silniejsze ręce preflop rosną jeszcze bardziej</strong> — jeśli ta 1 karta trafia w twoją rękę, wiesz to już na starcie</li>
              <li><strong>Bluff jest trudniejszy</strong> — wszyscy operują na tej samej dodatkowej informacji, więc czysto losowe agresywne zagrania łatwiej rozpoznać</li>
              <li><strong>Split pot nadal rządzi końcówką</strong> — jak w każdej Hi-Lo, kwalifikujący się low potrafi odwrócić wynik rozdania mimo słabego high</li>
            </ul>

            <h2>Porównanie: Omaha Hi-Lo vs Courchevel</h2>
            <table>
              <thead><tr><th>Cecha</th><th>Omaha Hi-Lo</th><th>Courchevel</th></tr></thead>
              <tbody>
                <tr><td>Karty na rękę</td><td>4</td><td>5</td></tr>
                <tr><td>Zasada użycia kart</td><td>Dokładnie 2+3</td><td>Dokładnie 2+3</td></tr>
                <tr><td>Podział puli</td><td>High + Low (8 lub lepiej)</td><td>High + Low (8 lub lepiej)</td></tr>
                <tr><td>Kiedy widać 1. kartę flopu</td><td>Razem z resztą flopu, po preflopie</td><td>Przed licytacją preflop</td></tr>
                <tr><td>Rundy licytacji</td><td>4</td><td>4</td></tr>
              </tbody>
            </table>

            <h2>Strategia w Courchevel</h2>
            <ul>
              <li><strong>Wykorzystaj tę jedną kartę</strong> — jeśli pasuje do twojej ręki (kolor, wysokość, potencjał na low), to realny powód by grać agresywniej już preflop</li>
              <li><strong>Myśl w dwie strony od pierwszej decyzji</strong> — planuj jednocześnie pod high i pod low, tak jak w każdej Hi-Lo</li>
              <li><strong>Nut jest równie kluczowy jak w Big O</strong> — z 5 kartami łatwiej o silny układ, więc bez nuta łatwo wpaść w kosztowną pułapkę</li>
              <li><strong>Nie przeceniaj jednej karty</strong> — to wciąż tylko 1 z 5 finalnych kart stołu, reszta informacji dopiero nadejdzie</li>
            </ul>

            <h2>Courchevel w Pokero</h2>
            <p>Silnik gry odkrywa tę pierwszą kartę automatycznie w momencie rozdania — zanim ktokolwiek zdąży zagrać, więc nie trzeba nic klikać ani potwierdzać. Podział puli high/low i reguła 2+3 działają identycznie jak w Omaha Hi-Lo. W Dealer&apos;s Choice znajdziesz Courchevel oznaczony jako &quot;Courchevel Pot Limit&quot;.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha-hi-lo/" className="btn-outline">← Omaha Hi-Lo</Link>
            <Link href="/zasady/omaha-5-kartowa/" className="btn-outline">Omaha 5-kartowa (Big O) →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-hi-lo/">Omaha Hi-Lo</Link> ·{' '}
              <Link href="/zasady/omaha-5-kartowa/">Omaha 5-kartowa</Link> ·{' '}
              <Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link> ·{' '}
              <Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link> ·{' '}
              <Link href="/zasady/dobierana-klasyczna/">Dobierana klasyczna</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
