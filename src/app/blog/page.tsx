import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog o pokerze — zasady, strategia, kalkulatory, organizacja gier',
  description: 'Artykuły o pokerze: zasady gier, strategie, pot odds, outs, słownik, organizacja turniejów. Praktyczne poradniki dla każdego poziomu zaawansowania.',
  alternates: { canonical: 'https://pokero.pl/blog/' },
};

const posts = [
  { href: '/blog/historia-pokera/', tag: 'Historia', title: 'Historia pokera — od Dzikiego Zachodu do pokera online', desc: 'Jak poker narodził się w Nowym Orleanie, podbił Dziki Zachód, stworzył WSOP i jak Chris Moneymaker wywołał poker boom.', date: '2026-06-20' },
  { href: '/blog/agresja-w-pokerze-cbet-3bet/', tag: 'Strategia', title: 'Agresja w pokerze — c-bet, 3-bet i budowanie puli krok po kroku', desc: 'Dlaczego agresja opłaca się matematycznie. Continuation bet, 3-bet preflop, double barrel i kiedy odpuścić.', date: '2026-06-19' },
  { href: '/blog/bledy-w-pokerze/', tag: 'Strategia', title: '15 najczęstszych błędów w pokerze — i jak je wyeliminować', desc: 'Granie za dużo rąk, limping, ignorowanie pozycji, tilt — 15 błędów które popełnia każdy gracz i jak je naprawić.', date: '2026-06-18' },
  { href: '/blog/drawmaha-zasady-strategia/', tag: 'Zasady', title: 'Drawmaha — kompletny przewodnik po wariancie split-pot z wymianą kart', desc: 'Zasady Drawmaha, split pot, faza wymiany kart, faza reveal i strategie wygrywające w tym autorskim wariancie.', date: '2026-06-17' },
  { href: '/blog/czytanie-przeciwnika-telle/', tag: 'Strategia', title: 'Jak czytać przeciwnika w pokerze — telle, betting patterns i range', desc: 'Fizyczne telle, timing w grze online, rozmiar zakładu jako informacja i budowanie range przeciwnika.', date: '2026-06-16' },
  { href: '/blog/psychologia-pokera-tilt/', tag: 'Psychologia', title: 'Psychologia pokera — tilt, emocje i mental game', desc: 'Tilt, zarządzanie emocjami, mindset i psychologia przy stole. Dlaczego mental game decyduje o wynikach bardziej niż strategia.', date: '2026-06-15' },
  { href: '/blog/poker-turniej-zasady/', tag: 'Zasady', title: 'Turniej pokerowy — zasady i format gry turniejowej', desc: 'Czym turniej różni się od cash game, struktura blindów, rebuy, strategia short stacka.', date: '2026-06-10' },
  { href: '/blog/poker-matematyka/', tag: 'Matematyka', title: 'Matematyka pokera — EV, pot odds i equity w jednym miejscu', desc: 'Expected Value, pot odds, equity, outs — wszystko z przykładami gotowymi do zastosowania.', date: '2026-06-09' },
  { href: '/blog/poker-terminy-slownik/', tag: 'Słownik', title: 'Słownik pokerowy — 45 terminów które musisz znać', desc: 'All-in, blind, tilt, equity, nuts, position — kompletny słownik pojęć pokerowych.', date: '2026-06-08' },
  { href: '/blog/poker-strategia-poczatkujacy/', tag: 'Strategia', title: 'Strategia pokera dla początkujących — 8 zasad które musisz znać', desc: 'Selekcja rąk, pozycja, agresja, czytanie stołu — 8 praktycznych zasad od razu do zastosowania.', date: '2026-06-07' },
  { href: '/blog/poker-na-impreze/', tag: 'Poradniki', title: 'Poker na imprezę — jak zorganizować turniej dla grupy', desc: 'Atrakcja na urodziny, integrację firmową, spotkanie znajomych. Format, nagrody, jak tłumaczyć zasady.', date: '2026-06-06' },
  { href: '/blog/poker-vs-omaha/', tag: 'Porównanie', title: "Texas Hold'em vs Omaha — który wariant pokera wybrać?", desc: 'Zasady, trudność, strategia, equity — kompleksowe porównanie dwóch najpopularniejszych wariantów.', date: '2026-06-05' },
  { href: '/blog/poker-outs-kalkulator/', tag: 'Matematyka', title: 'Outs w pokerze — co to jest i jak liczyć', desc: 'Definicja outa, tabela draw i outów, reguła 2 i 4 do szybkich obliczeń przy stole.', date: '2026-06-04' },
  { href: '/blog/pot-odds-poker/', tag: 'Matematyka', title: 'Pot Odds w pokerze — jak liczyć opłacalność calla', desc: 'Wzór na pot odds, przykład obliczenia, implied odds, kiedy call jest matematycznie opłacalny.', date: '2026-06-03' },
  { href: '/blog/poker-heads-up/', tag: 'Strategia', title: 'Poker Heads-Up — zasady i strategia gry 1 na 1', desc: 'Specjalne zasady blindów, dlaczego heads-up jest najtrudniejszy, kluczowe strategie.', date: '2026-06-02' },
  { href: '/blog/poker-dla-poczatkujacych/', tag: 'Dla początkujących', title: 'Poker dla początkujących — nauka od zera w 7 krokach', desc: '7 kroków dla absolutnych początkujących. Od zasad przez układy kart do pierwszej gry.', date: '2026-06-01' },
  { href: '/blog/dealer-choice-poker/', tag: 'Zasady', title: "Dealer's Choice Poker — co to jest i jak grać", desc: 'Każda ręka to inny wariant. Jak działa Dealer\'s Choice i dlaczego to świetny format.', date: '2026-05-31' },
  { href: '/blog/poker-zasady-blind/', tag: 'Zasady', title: 'Blind w pokerze — co to jest mały i duży blind', desc: 'Small Blind i Big Blind wyjaśnione prosto. Po co są blindy i jak wpływają na strategię.', date: '2026-05-31' },
  { href: '/blog/gry-online-ze-znajomymi/', tag: 'Poradniki', title: 'Gry online ze znajomymi przez internet — top 5 pomysłów', desc: 'Poker, quizy, rysowanie i więcej. Najlepsze gry online na wieczór bez wychodzenia z domu.', date: '2026-05-30' },
  { href: '/blog/omaha-strategia/', tag: 'Strategia', title: 'Strategia Omaha Poker — jak grać kiedy masz 4 karty na ręce', desc: 'Najczęstsze błędy graczy z Texas. Jakie ręce startowe grać i kiedy szukać nuts.', date: '2026-05-29' },
  { href: '/blog/poker-na-telefonie/', tag: 'Poradniki', title: 'Poker na telefonie ze znajomymi — jak grać na iOS i Android', desc: 'Pokero działa na każdym telefonie bez instalacji. Jak zacząć w 30 sekund.', date: '2026-05-28' },
  { href: '/blog/side-pot-poker/', tag: 'Zasady', title: 'Side pot w pokerze — co to jest i jak działa', desc: 'Pula boczna przy all-in — przykład z trzema graczami, jak Pokero liczy automatycznie.', date: '2026-05-27' },
  { href: '/blog/poker-domowy-turniej/', tag: 'Poradniki', title: 'Domowy turniej pokerowy — jak zorganizować krok po kroku', desc: 'Struktura blindów, żetony startowe, rebuy czy nie, ile osób i ile czasu.', date: '2026-05-26' },
  { href: '/blog/pozycja-w-pokerze/', tag: 'Strategia', title: 'Pozycja w pokerze — dlaczego dealer ma przewagę', desc: 'Dealer, Cutoff, Under the Gun — co oznaczają pozycje i jak je wykorzystać.', date: '2026-05-24' },
  { href: '/blog/jak-blefowac-w-pokerze/', tag: 'Strategia', title: 'Jak blefować w pokerze — kiedy warto i jak robić to skutecznie', desc: 'Blef to kalkulacja, nie kłamstwo. Kiedy blefować, semi-blef i najczęstsze błędy.', date: '2026-05-22' },
  { href: '/blog/poker-wieczor-kawalerski/', tag: 'Poradniki', title: 'Poker na wieczór kawalerski i panieński — jak zorganizować', desc: 'Format turnieju, specjalne zasady, jak grać online z całą ekipą.', date: '2026-05-20' },
  { href: '/blog/uklady-kart-poker/', tag: 'Zasady', title: 'Układy kart w pokerze — pełna tabela z przykładami i FAQ', desc: 'Wszystkie 10 układów pokerowych z przykładami, tabela i najczęstsze pytania.', date: '2026-05-15' },
  { href: '/blog/poker-ze-znajomymi-online/', tag: 'Poradniki', title: 'Poker ze znajomymi online — jak to zorganizować krok po kroku', desc: 'Jak szybko i bezproblemowo zorganizować wieczór pokerowy z przyjaciółmi.', date: '2026-05-08' },
  { href: '/blog/zasady-pokera-texas-holdem/', tag: 'Zasady', title: "Jak grać w pokera Texas Hold'em — zasady dla początkujących", desc: "Kompletny przewodnik po Texas Hold'em krok po kroku dla osób które nigdy nie grały.", date: '2026-05-01' },
];

export default function BlogPage() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Blog</span>
      </div>
      <h1 style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem' }}>Blog</h1>
      <p style={{ color: 'rgba(245,230,192,0.5)', marginBottom: '2.5rem' }}>
        Zasady, strategie i wszystko o pokerze — {posts.length} artykułów
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map((p) => (
          <Link key={p.href} href={p.href} style={{ textDecoration: 'none' }}>
            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <span className="badge">{p.tag}</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,230,192,0.3)' }}>
                  {new Date(p.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: 1.35 }}>{p.title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(245,230,192,0.55)', margin: 0 }}>{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
