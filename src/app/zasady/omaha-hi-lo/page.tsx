import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha Hi-Lo — split pot, 8 or better, zasady dla początkujących',
  description: 'Kompletne zasady Omaha Hi-Lo (Omaha 8-or-Better). Jak działa podział puli między High i Low, co to znaczy "8 or better", jak wygrać obie połowy. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha-hi-lo/' },
};

export default function OmahaHiLoPage() {
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
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Omaha Hi-Lo</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>4 karty · split pot · 8 or better</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha Hi-Lo</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 640 }}>
              Omaha Hi-Lo (zwana też Omaha 8-or-Better) to wariant, w którym <strong>pula dzielona jest na pół</strong> — jedna połowa trafia do gracza z <em>najlepszą</em> ręką (High), druga do gracza z <em>najgorszą kwalifikującą się</em> ręką (Low). Możesz wygrać obie połowy jedną ręką — to nazywa się <strong>scoop</strong>.
            </p>
          </div>

          <div className="prose">
            <h2>Podstawowa zasada: dokładnie 2+3</h2>
            <p>Omaha Hi-Lo dziedziczy kluczową regułę Omaha: <strong>musisz użyć dokładnie 2 kart z ręki i dokładnie 3 kart ze stołu</strong> — zarówno do ręki High, jak i do ręki Low. Możesz użyć różnych 2 kart do High i innych 2 kart do Low z tego samego rozdania.</p>

            <h2>Przebieg gry</h2>
            <p>Rundy licytacji są identyczne jak w standardowej Omaha:</p>
            <ol>
              <li><strong>Preflop</strong> — każdy gracz dostaje 4 zakryte karty, licytacja po blindach</li>
              <li><strong>Flop</strong> — odkrycie 3 kart wspólnych, licytacja</li>
              <li><strong>Turn</strong> — 4. karta wspólna, licytacja</li>
              <li><strong>River</strong> — 5. karta wspólna, finalna licytacja</li>
              <li><strong>Showdown</strong> — pula dzielona między High i Low</li>
            </ol>

            <h2>Jak działa ręka Low — reguła &quot;8 or better&quot;</h2>
            <p>Aby zakwalifikować się do <strong>połowy Low</strong>, gracz musi ułożyć 5-kartową rękę ze wszystkich kart ósemką lub niżej (As liczy jako 1 — najniżej możliwy). Wszystkie 5 kart musi mieć różne wartości — pary, trójki i inne powtórzenia dyskwalifikują rękę Low.</p>
            <ul>
              <li>Kwalifikujące się karty do Low: <strong>A, 2, 3, 4, 5, 6, 7, 8</strong></li>
              <li>Wszystkie 5 musi być różnych wartości (bez par, trójek, itp.)</li>
              <li>Kolory kart nie mają znaczenia dla Low</li>
              <li>As zawsze gra jako najniższa karta (1) w rękach Low</li>
            </ul>
            <p>Przykłady kwalifikujących się rąk Low (od najlepszej do najgorszej):</p>
            <ul>
              <li><strong>A-2-3-4-5</strong> — &quot;wheel&quot; lub &quot;bicykl&quot; — najlepsza ręka Low (i jednocześnie straight do High!)</li>
              <li><strong>A-2-3-4-6</strong></li>
              <li><strong>A-2-3-5-7</strong></li>
              <li><strong>2-3-4-5-8</strong> — najgorsza kwalifikująca się ręka Low (ósemka-wysoka)</li>
            </ul>
            <p>Jeśli <strong>żaden gracz nie kwalifikuje się do Low</strong> (brak 5 kart ≤8 różnych wartości dostępnych na stole), cała pula trafia do zwycięzcy High — podział nie następuje.</p>

            <h2>Porównywanie rąk Low</h2>
            <p>Ręce Low porównuje się od <strong>najwyższej karty w dół</strong> — niższa najwyższa karta wygrywa. Przykłady:</p>
            <ul>
              <li>A-2-3-4-7 <strong>bije</strong> A-2-3-5-8 (7 &lt; 8 na pierwszej pozycji)</li>
              <li>A-2-3-4-6 <strong>bije</strong> A-2-3-4-7 (6 &lt; 7)</li>
              <li>A-2-3-4-5 <strong>bije</strong> wszystko (wheel)</li>
            </ul>

            <h2>Scoop — zgarniasz całą pulę</h2>
            <p>Jeśli wygrasz zarówno High jak i Low (lub nie ma kwalifikującej się ręki Low), zgarniesz <strong>całą pulę (scoop)</strong>. To cel każdej zagrywki w Omaha Hi-Lo — granie tylko o połowę rzadko jest opłacalne.</p>
            <p>Przykład: masz A♠ 2♥ K♣ Q♦, na stole 3♦ 4♠ 5♣ K♥ J♣. Twoja ręka High = K-K (para króli z K♣ + K♥), ręka Low = A-2-3-4-5 (wheel). Zgarniesz obie połowy puli.</p>

            <h2>Podział puli przy równorzędnych rękach</h2>
            <p>Jeśli dwóch graczy ma identyczną rękę Low, każdy dostaje połowę połowy Low (czyli ¼ całej puli). Podobnie dla High — remis w High dzielony jest równo.</p>

            <h2>Strategia — podstawowe zasady</h2>
            <ul>
              <li><strong>Graj ręce mogące wygrać obie połowy</strong> — A-2 w ręce plus dobre karty High to ideał</li>
              <li><strong>Unikaj grania &quot;tylko o Low&quot;</strong> — wygranie tylko połowy puli rzadko jest zyskowne przy wielu graczach w puli</li>
              <li><strong>A-2 to najcenniejsza para kart</strong> w Hi-Lo — daje dostęp do najlepszych rąk Low (wheel)</li>
              <li><strong>Sprawdź dostępność Low na flopie</strong> — jeśli flop nie daje co najmniej 3 kart ≤8, Low jest niemożliwe</li>
              <li><strong>Wheel (A-2-3-4-5) wygrywa Low i jest straightem</strong> — to ulubiona ręka scoopera</li>
            </ul>

            <h2>Omaha Hi-Lo w Pokero</h2>
            <p>Silnik automatycznie ewaluuje najlepszą rękę High i najlepszą kwalifikującą się rękę Low dla każdego gracza. Podział puli jest obsługiwany automatycznie — w wynikach zobaczysz informację o tym kto wygrał High, kto Low, i jaka była jego ręka. W Dealer&apos;s Choice możesz ustawić Omaha Hi-Lo jako swój preferowany wariant.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha/" className="btn-outline">← Omaha</Link>
            <Link href="/zasady/omaha-5-kartowa/" className="btn-outline">Omaha 5-kartowa →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(245,230,192,0.5)' }}>
              <strong style={{ color: '#d4af37' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-5-kartowa/">Omaha 5-kartowa</Link> ·{' '}
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
