import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Turniej pokerowy — zasady i format gry turniejowej',
  description: 'Zasady gry turniejowej w pokera. Czym turniej różni się od cash game, struktura blindów, rebuy, add-on, ICM — wszystko wyjaśnione krok po kroku.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-turniej-zasady/' },
  openGraph: { type: 'article', publishedTime: '2026-06-10' },
};

export default function Post23() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Turniej pokerowy — zasady</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Turniej pokerowy — zasady i format gry turniejowej
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>10 czerwca 2026 · 8 min czytania</p>
        <div className="prose">
          <p>
            Turniej pokerowy to zupełnie inny format niż cash game. Inne priorytety,
            inna strategia, inne napięcie. Poznaj zasady zanim zasiądziesz do pierwszego turnieju.
          </p>

          <h2>Turniej vs cash game — kluczowe różnice</h2>
          <table>
            <thead><tr><th>Cecha</th><th>Turniej</th><th>Cash game</th></tr></thead>
            <tbody>
              <tr><td>Buy-in</td><td>Stały, jednorazowy</td><td>Elastyczny, możesz dokupić</td></tr>
              <tr><td>Żetony</td><td>Nie mają wartości pieniężnej</td><td>Reprezentują prawdziwe pieniądze</td></tr>
              <tr><td>Blindy</td><td>Rosną co określony czas</td><td>Stałe przez całą sesję</td></tr>
              <tr><td>Koniec gry</td><td>Gdy wypadniesz — to koniec</td><td>Możesz wyjść kiedy chcesz</td></tr>
              <tr><td>Cel</td><td>Przetrwać jak najdłużej</td><td>Maksymalizować wygraną każdej ręki</td></tr>
            </tbody>
          </table>

          <h2>Struktura blindów w turnieju</h2>
          <p>
            Blindy rosną co określony czas (poziom). Typowy turniej domowy:
            15-minutowe poziomy, blindy od 10/20 do 100/200 lub wyżej.
            Rosnące blindy wymuszają akcję — gracze z małymi stackami muszą działać.
          </p>

          <h2>Rebuy i add-on</h2>
          <p>
            <strong>Rebuy</strong> — możliwość "dokupienia" nowych żetonów po wypadnięciu,
            zazwyczaj tylko w określonych pierwszych poziomach. Zwiększa pulę nagród.
          </p>
          <p>
            <strong>Add-on</strong> — jednorazowa możliwość dokupienia żetonów (często na przerwie
            po ostatnim poziomie rebuy), dostępna dla wszystkich graczy niezależnie od stanu stacku.
          </p>
          <p>
            W <Link href="/">Pokero</Link> admin może dodać żetony dowolnemu graczowi w trakcie gry —
            obsługuje rebuy bezpośrednio przez panel admina.
          </p>

          <h2>Strategia turniejowa vs cash game</h2>
          <p>
            W cash game możesz grać agresywnie za każdym razem gdy masz przewagę. W turnieju
            przeżycie jest ważniejsze — szczególnie gdy zbliżasz się do strefy wygranych.
            Nie musisz wygrywać każdej ręki — wystarczy nie wypaść.
          </p>

          <h2>Short stack — strategia małego stacka</h2>
          <p>
            Gdy masz mało żetonów (mniej niż 15 big blindów) — masz ograniczone opcje.
            Zazwyczaj: albo fold, albo all-in. Push/fold strategy — wejdź z dobrą ręką
            i idź all-in pre-flop. Nie ma sensu limp z małym stackiem.
          </p>

          <h2>Zorganizuj turniej w Pokero</h2>
          <p>
            Wszystkie elementy turnieju są w Pokero: admin zarządza żetonami, blindy możesz
            zmieniać ręcznie co odpowiedni czas, możesz dodawać rebuy. Uruchom rozmowę głosową
            równolegle i masz pełnowartościowy turniej domowy.
          </p>
          <p>
            Szczegółowe wskazówki organizacyjne: <Link href="/blog/poker-domowy-turniej/">Domowy turniej pokerowy</Link>.
          </p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zacznij turniej teraz</Link>
          <Link href="/blog/poker-domowy-turniej/" className="btn-outline">Organizacja turnieju →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/poker-domowy-turniej/">Domowy turniej</Link> · <Link href="/blog/poker-zasady-blind/">Blind w pokerze</Link>
        </p>
      </div>
    </div>
  );
}
