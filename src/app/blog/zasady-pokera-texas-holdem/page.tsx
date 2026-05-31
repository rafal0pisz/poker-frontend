import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Jak grać w pokera Texas Hold'em — zasady dla początkujących",
  description: "Kompletny przewodnik po Texas Hold'em. Nauczysz się: karty, blindy, kolejność gry, licytacja, showdown. Krok po kroku dla osób które nigdy nie grały.",
  alternates: { canonical: 'https://pokero.pl/blog/zasady-pokera-texas-holdem/' },
  openGraph: {
    title: "Jak grać w pokera Texas Hold'em — zasady dla początkujących",
    description: "Kompletny przewodnik po Texas Hold'em krok po kroku.",
    type: 'article',
    publishedTime: '2026-05-01',
  },
};

export default function Post1() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Texas Hold&apos;em dla początkujących</span>
      </div>

      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Jak grać w pokera Texas Hold&apos;em — zasady dla początkujących
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>1 maja 2026 · 8 min czytania</p>

        <div className="prose">
          <p>
            Texas Hold&apos;em to najpopularniejszy wariant pokera na świecie. Grają go miliony ludzi — od domowych spotkań po największe turnieje pokerowe z pula nagród sięgającą milionów dolarów. Jeśli nigdy nie grałeś w pokera i nie wiesz od czego zacząć — jesteś we właściwym miejscu.
          </p>
          <p>
            W tym artykule wyjaśnię Ci zasady Texas Hold&apos;em krok po kroku. Po przeczytaniu będziesz gotowy żeby zagrać ze znajomymi.
          </p>

          <h2>Czego potrzebujesz do gry</h2>
          <p>
            Tradycyjnie: talia 52 kart, żetony i 2-9 graczy. Jeśli grasz online — tylko link do pokoju w Pokero. Wszystko inne robi aplikacja.
          </p>

          <h2>Jak wygrać w Texas Hold'em</h2>
          <p>
            Celem gry jest wygranie żetonów. Możesz to zrobić na dwa sposoby:
          </p>
          <ul>
            <li><strong>Pokaż najlepszą rękę</strong> podczas showdownu (odsłonięcia kart na końcu rundy)</li>
            <li><strong>Sprawdź, że inni spasują</strong> — jeśli wszyscy sfoldują, wygrywasz bez pokazywania kart</li>
          </ul>

          <h2>Przed rozdaniem — blindy</h2>
          <p>
            Zanim zobaczysz karty, dwóch graczy wpłaca obowiązkowe stawki zwane <strong>blindami</strong>. Blindy "pompują" pulę i powodują, że zawsze jest o co grać.
          </p>
          <ul>
            <li><strong>Small Blind (mała ciemna)</strong> — gracz po lewej stronie dealera, wpłaca połowę BB</li>
            <li><strong>Big Blind (duża ciemna)</strong> — następny gracz w lewo, wpłaca pełną stawkę</li>
          </ul>
          <p>
            Przy blindach 5/10: SB = 5 żetonów, BB = 10 żetonów. Blindy rotują z każdą ręką.
          </p>

          <h2>Rozdanie kart — Preflop</h2>
          <p>
            Każdy gracz dostaje <strong>2 karty zakryte</strong> (hole cards). Widzisz tylko swoje karty — nie wiesz co mają inni.
          </p>
          <p>
            Teraz zaczyna się pierwsza runda licytacji. Możesz:
          </p>
          <ul>
            <li><strong>Fold</strong> — spasować, wyrzucić karty. Tracisz tylko to co już wpłaciłeś.</li>
            <li><strong>Call</strong> — wyrównać najwyższą stawkę na stole.</li>
            <li><strong>Raise</strong> — podbić stawkę (minimum 2x BB).</li>
          </ul>

          <h2>Flop — pierwsze 3 karty na stole</h2>
          <p>
            Po preflopie odkrywają się 3 wspólne karty (<strong>flop</strong>). Możesz już ocenić jaką rękę możesz zbudować.
          </p>
          <p>
            Kolejna runda licytacji — tym razem zaczyna gracz po lewej od dealera. Teraz możesz też <strong>check</strong> — "pas bez stawki" jeśli nikt jeszcze nie obstawił.
          </p>

          <h2>Turn — czwarta karta</h2>
          <p>
            Odkrywa się czwarta wspólna karta (turn). Jeszcze jedna runda licytacji. Pula zazwyczaj rośnie.
          </p>

          <h2>River — piąta i ostatnia karta</h2>
          <p>
            Piąta karta (river) to ostatnia wspólna. Finalna runda licytacji. Jeśli zostali gracze — następuje showdown.
          </p>

          <h2>Showdown — kto wygrywa?</h2>
          <p>
            Gracze odsłaniają karty. Najlepsza ręka 5-kartowa wygrywa pulę. Możesz użyć:
          </p>
          <ul>
            <li>Obu kart własnych + 3 ze stołu</li>
            <li>Jednej karty własnej + 4 ze stołu</li>
            <li>Tylko kart ze stołu (rzadkie)</li>
          </ul>

          <h2>Układy rąk od najsilniejszego</h2>
          <p>
            Skrócona lista — od najlepszej do najgorszej:
          </p>
          <ol>
            <li>Royal Flush (A-K-Q-J-10 w kolorze)</li>
            <li>Straight Flush (5 kolejnych w kolorze)</li>
            <li>Kareta (4 karty tego samego nominału)</li>
            <li>Full House (trójka + para)</li>
            <li>Kolor / Flush (5 kart w jednym kolorze)</li>
            <li>Strit / Straight (5 kolejnych)</li>
            <li>Trójka</li>
            <li>Dwie pary</li>
            <li>Para</li>
            <li>Wysoka karta</li>
          </ol>
          <p>
            Pełna tabela z przykładami: <Link href="/zasady/uklady-kart/">Układy kart w pokerze</Link>
          </p>

          <h2>Gotowy? Zagraj ze znajomymi</h2>
          <p>
            Najlepszy sposób nauki pokera to granie. W Pokero możesz stworzyć prywatny stół w 30 sekund — bez rejestracji, bez pieniędzy.
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          <Link href="/zasady/texas-holdem/" className="btn-outline">Szczegółowe zasady Texas →</Link>
        </div>

        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/uklady-kart-poker/">Układy kart w pokerze</Link> · <Link href="/blog/poker-ze-znajomymi-online/">Poker ze znajomymi online</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: "Jak grać w pokera Texas Hold'em — zasady dla początkujących",
              datePublished: '2026-05-01',
              publisher: { '@type': 'Organization', name: 'Pokero', url: 'https://pokero.pl' },
              mainEntityOfPage: 'https://pokero.pl/blog/zasady-pokera-texas-holdem/',
            }),
          }}
        />
      </div>
    </div>
  );
}
