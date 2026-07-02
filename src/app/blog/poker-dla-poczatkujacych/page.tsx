import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Poker dla początkujących — nauka pokera od zera w 7 krokach',
  description: 'Jak nauczyć się pokera od zera? 7 kroków dla absolutnych początkujących: zasady, układy kart, strategia, pierwsze gry. Zacznij grać w 30 minut.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-dla-poczatkujacych/' },
  openGraph: { type: 'article', publishedTime: '2026-06-01' },
};

export default function Post14() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Poker dla początkujących</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Dla początkujących</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Poker dla początkujących — nauka od zera w 7 krokach
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>1 czerwca 2026 · 10 min czytania</p>
        <div className="prose">
          <p>
            Nigdy nie grałeś w pokera i nie wiesz od czego zacząć? Ten artykuł przeprowadzi Cię przez wszystko
            co musisz wiedzieć żeby zasiąść przy stole i grać. Bez żargonu, bez zakładania że coś już wiesz.
          </p>

          <h2>Krok 1 — Zacznij od Texas Hold'em</h2>
          <p>
            Jest kilkanaście wariantów pokera, ale <Link href="/zasady/texas-holdem/">Texas Hold'em</Link> to
            właściwy start dla każdego. To najpopularniejszy wariant na świecie — grają w nim miliony osób,
            jest pełno materiałów edukacyjnych i najłatwiej znaleźć do kogo grać.
          </p>
          <p>
            Inne warianty (Omaha, Pineapple, Drawmaha) możesz poznać później — na razie zostań przy Texasie.
          </p>

          <h2>Krok 2 — Naucz się układów kart</h2>
          <p>
            Zanim zagrasz pierwszą rękę, musisz wiedzieć co bije co. Układy pokerowe od najsilniejszego:
          </p>
          <ol>
            <li>Royal Flush (A-K-Q-J-10 w kolorze)</li>
            <li>Straight Flush (5 kolejnych w kolorze)</li>
            <li>Kareta — cztery karty tego samego nominału</li>
            <li>Full House — trójka + para</li>
            <li>Kolor (Flush) — pięć kart w jednym kolorze</li>
            <li>Strit (Straight) — pięć kolejnych kart</li>
            <li>Trójka</li>
            <li>Dwie pary</li>
            <li>Para</li>
            <li>Wysoka karta</li>
          </ol>
          <p>
            Pełna tabela z przykładami: <Link href="/zasady/uklady-kart/">Układy kart w pokerze</Link>.
            Wydrukuj lub zachowaj na telefonie — pierwsze kilka gier możesz sprawdzać.
          </p>

          <h2>Krok 3 — Zrozum przebieg ręki</h2>
          <p>
            Każda ręka w Texas Hold'em przebiega tak samo: <strong>Preflop → Flop → Turn → River → Showdown</strong>.
          </p>
          <p>
            Przed rozdaniem dwaj gracze wpłacają blindy (obowiązkowe stawki). Każdy dostaje 2 karty zakryte.
            Potem kolejno odkrywają się karty wspólne na stole (3+1+1). Po każdej ulicy jest runda licytacji.
            Na koniec kto ma najlepszą rękę z 5 dowolnych kart — wygrywa.
          </p>

          <h2>Krok 4 — Opanuj 3 podstawowe akcje</h2>
          <p>W każdej rundzie licytacji masz do wyboru:</p>
          <ul>
            <li><strong>Fold</strong> — pas, wyrzucasz karty, kończysz rękę</li>
            <li><strong>Call</strong> — wyrównujesz aktualną stawkę</li>
            <li><strong>Raise</strong> — podbijasz stawkę (minimum 2x poprzedni bet)</li>
            <li><strong>Check</strong> — "pas bez stawki" gdy nikt nie obstawił (tylko wtedy)</li>
          </ul>

          <h2>Krok 5 — Graj selektywnie</h2>
          <p>
            Największy błąd początkujących: grają zbyt dużo rąk. Większość rąk startowych powinna skończyć
            w koszu na preflopie. Silne starty to: asy, króle, damy, walety, A-K, A-Q w parach lub kolorze.
          </p>
          <p>
            Prosta zasada na start: jeśli nie masz pary lub dwóch kart powyżej 9 — poważnie rozważ foldowanie.
          </p>

          <h2>Krok 6 — Nie przywiązuj się do żetonów</h2>
          <p>
            Żetony które wpłaciłeś do puli nie są już "Twoje" — należą do puli. Nie graj ręki tylko dlatego
            że już dużo wpłaciłeś (to nazywa się "sunk cost fallacy"). Jeśli masz słabą rękę po flopie — fold.
          </p>

          <h2>Krok 7 — Zacznij grać natychmiast</h2>
          <p>
            Teoria bez praktyki nic nie da. Najszybszy sposób nauki to granie ze znajomymi na wirtualne żetony —
            bez ryzyka, bez stresu. W <Link href="/">Pokero</Link> stworzysz prywatny stół w 30 sekund,
            bez rejestracji. Zaproś znajomych przez link i graj już dziś.
          </p>
          <p>
            Po kilku sesjach układy wejdą w nawyk, akcje będą automatyczne i możesz zacząć myśleć o strategii.
          </p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj teraz za darmo</Link>
          <Link href="/zasady/texas-holdem/" className="btn-outline">Pełne zasady Texas →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/zasady-pokera-texas-holdem/">Zasady Texas Hold'em</Link> · <Link href="/blog/uklady-kart-poker/">Układy kart</Link> · <Link href="/blog/jak-blefowac-w-pokerze/">Jak blefować</Link>
        </p>
      </div>
    </div>
  );
}
