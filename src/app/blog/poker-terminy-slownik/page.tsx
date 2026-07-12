import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Słownik pokerowy — 50 terminów które musisz znać',
  description: 'Kompletny słownik pojęć pokerowych. All-in, blind, flop, turn, river, tilt, pot odds, equity, nuts, position i 40 innych terminów wyjaśnionych prosto.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-terminy-slownik/' },
  openGraph: { type: 'article', publishedTime: '2026-06-08' },
};

const terms = [
  { term: 'All-in', def: 'Postawienie wszystkich posiadanych żetonów w jednej akcji.' },
  { term: 'Ante', def: 'Obowiązkowa stawka wpłacana przez wszystkich graczy przed rozdaniem.' },
  { term: 'Bad beat', def: 'Przegrana silnej ręki ze statystycznie słabszą ręką rywala.' },
  { term: 'Big Blind (BB)', def: 'Obowiązkowa stawka pełna wpłacana przez gracza na drugiej pozycji od dealera.' },
  { term: 'Blef', def: 'Stawianie z słabą ręką w celu zmuszenia rywali do foldowania.' },
  { term: 'Board', def: 'Karty wspólne leżące na stole (flop + turn + river).' },
  { term: 'Button', def: 'Pozycja dealera — najlepsza pozycja przy stole, gra ostatni.' },
  { term: 'Check', def: 'Przekazanie kolei bez stawiania, gdy nikt nie obstawił w tej rundzie.' },
  { term: 'Cooler', def: 'Sytuacja gdzie dwie silne ręce zderzają się — przegrana nieunikniona.' },
  { term: 'Cutoff (CO)', def: 'Pozycja jeden przed dealerem — bardzo dobra pozycja.' },
  { term: 'Dead money', def: 'Żetony w puli od graczy którzy już sfoldowali.' },
  { term: 'Equity', def: 'Procentowy udział w puli — ile procent szansy masz na wygraną.' },
  { term: 'Flop', def: 'Pierwsze 3 karty wspólne odkrywane jednocześnie.' },
  { term: 'Fold', def: 'Rezygnacja z ręki — wyrzucasz karty i nie możesz wygrać puli.' },
  { term: 'Gutshot', def: 'Draw na strita gdzie czekasz na jedną konkretną kartę w środku (4 outy).' },
  { term: 'Heads-up', def: 'Gra 1 vs 1 — dwóch graczy przy stole.' },
  { term: 'Implied odds', def: 'Szacowane przyszłe wygrane uwzględniane przy decyzji o callu.' },
  { term: 'Kicker', def: 'Karta decydująca przy remisie układu — np. para Asów z K vs para Asów z Q.' },
  { term: 'Limp', def: 'Wyrównanie BB na preflopie bez podbicia — zazwyczaj słaba strategia.' },
  { term: 'Nuts', def: 'Najlepsza możliwa ręka przy danym układzie kart na stole.' },
  { term: 'OESD', def: 'Open-Ended Straight Draw — draw na strita z dwóch stron (8 outów).' },
  { term: 'Out', def: 'Karta która poprawi Twoją rękę do lepszego układu.' },
  { term: 'Overcard', def: 'Karta wyższa niż wszystkie karty na stole.' },
  { term: 'Pocket pair', def: 'Para kieszonkowa — dwie karty tej samej wartości w ręce przed flopem.' },
  { term: 'Position', def: 'Kolejność gracza względem dealera — późniejsza = lepsza.' },
  { term: 'Pot odds', def: 'Stosunek kosztu calla do całkowitej puli — podstawa decyzji matematycznych.' },
  { term: 'Pre-flop', def: 'Faza gry przed odkryciem flopa — pierwsze licytacje po otrzymaniu kart.' },
  { term: 'Raise', def: 'Podbicie stawki powyżej aktualnego betu.' },
  { term: 'Re-raise (3-bet)', def: 'Podbicie po istniejącym podbicu.' },
  { term: 'River', def: 'Piąta i ostatnia karta wspólna.' },
  { term: 'Semi-blef', def: 'Blef z ręką która ma szansę poprawy (np. flush draw).' },
  { term: 'Set', def: 'Trójka gdzie dwie karty są z ręki, jedna ze stołu.' },
  { term: 'Short stack', def: 'Gracz z małą ilością żetonów względem blindów i stołu.' },
  { term: 'Showdown', def: 'Odsłonięcie kart wszystkich graczy po ostatniej rundzie licytacji.' },
  { term: 'Small Blind (SB)', def: 'Obowiązkowa połowa BB wpłacana przez pierwszego gracza po dealerze.' },
  { term: 'Slow play', def: 'Granie mocnej ręki pasywnie żeby ukryć siłę i przyciągnąć rywali.' },
  { term: 'Stack', def: 'Całkowita ilość żetonów gracza.' },
  { term: 'Suited', def: 'Dwie karty w tym samym kolorze — dają szansę na flush.' },
  { term: 'Tilt', def: 'Stan emocjonalny po stratach który prowadzi do złych decyzji.' },
  { term: 'Trips', def: 'Trójka gdzie jedna karta jest z ręki, dwie ze stołu (słabsze niż set).' },
  { term: 'Turn', def: 'Czwarta karta wspólna odkrywana pojedynczo.' },
  { term: 'Under the Gun (UTG)', def: 'Pierwsza pozycja po blindach — najgorsza pozycja przy stole.' },
  { term: 'Value bet', def: 'Bet z mocną ręką żeby wyciągnąć żetony od słabszej ręki rywala.' },
  { term: 'VPIP', def: 'Voluntarily Put in Pot — procent rąk w które dobrowolnie wchodzisz.' },
  { term: 'Wheel', def: 'Strit A-2-3-4-5 — najniższy możliwy strit.' },
];

export default function Post21() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Słownik pokerowy</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Słownik</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Słownik pokerowy — {terms.length} terminów które musisz znać
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>8 czerwca 2026 · 7 min czytania</p>
        <div className="prose">
          <p>
            Poker ma swój własny język — spora część terminów jest po angielsku i używana
            nawet przez polskich graczy. Ten słownik tłumaczy wszystkie kluczowe pojęcia
            od A do Z z krótkimi, zrozumiałymi definicjami.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
            {terms.map(t => (
              <div key={t.term} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                <span style={{ fontWeight: 700, color: 'rgb(var(--pk-gold-rgb))', minWidth: 140, flexShrink: 0, fontSize: '0.9rem' }}>{t.term}</span>
                <span style={{ color: 'rgba(var(--pk-cream-rgb),0.65)', fontSize: '0.9rem' }}>{t.def}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj używając tych terminów</Link>
          <Link href="/zasady/texas-holdem/" className="btn-outline">Zasady Texas →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/zasady-pokera-texas-holdem/">Zasady Texas Hold'em</Link> · <Link href="/blog/poker-dla-poczatkujacych/">Poker dla początkujących</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Słownik pokerowy — 50 terminów które musisz znać",
              "datePublished": "2026-06-08",
              "publisher": {
                "@type": "Organization",
                "name": "Pokero",
                "url": "https://pokero.pl"
              },
              "mainEntityOfPage": "https://pokero.pl/blog/poker-terminy-slownik/"
            }),
          }}
        />
      </div>
    </div>
  );
}
