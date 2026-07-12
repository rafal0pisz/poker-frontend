import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Domowy turniej pokerowy — jak zorganizować krok po kroku',
  description: 'Organizacja domowego turnieju pokerowego: struktura blindów, czas trwania, liczba graczy, zasady rebuy. Kompletny poradnik dla organizatora.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-domowy-turniej/' },
  openGraph: { type: 'article', publishedTime: '2026-05-26' },
};

export default function Post7() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Domowy turniej pokerowy</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Poradniki</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Domowy turniej pokerowy — jak zorganizować krok po kroku
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>26 maja 2026 · 9 min czytania</p>
        <div className="prose">
          <p>Dobry domowy turniej pokerowy to coś więcej niż tylko karty i żetony — to wieczór który wszyscy będą wspominać. Pokażę Ci jak go zorganizować od A do Z, niezależnie czy grasz stacjonarnie czy online przez Pokero.</p>

          <h2>Ile osób na turniej?</h2>
          <p>Idealnie 6-9 graczy przy jednym stole. Przy 10+ możesz rozważyć dwa stoły — ale to już poważna logistyka. Minimum to 4 graczy — turniej czteroosobowy jest krótki (30-45 min) ale intensywny.</p>

          <h2>Struktura blindów — klucz do dobrego turnieju</h2>
          <p>Struktura blindów decyduje jak długo potrwa turniej i kiedy robi się "push or fold" (tylko all-in albo pas). Przykładowa struktura na 2-godzinny turniej (6 graczy, 1000 żetonów startowych):</p>
          <table>
            <thead><tr><th>Poziom</th><th>SB</th><th>BB</th><th>Czas</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>10</td><td>20</td><td>15 min</td></tr>
              <tr><td>2</td><td>15</td><td>30</td><td>15 min</td></tr>
              <tr><td>3</td><td>25</td><td>50</td><td>15 min</td></tr>
              <tr><td>4</td><td>50</td><td>100</td><td>15 min</td></tr>
              <tr><td>5</td><td>75</td><td>150</td><td>15 min</td></tr>
              <tr><td>6</td><td>100</td><td>200</td><td>do końca</td></tr>
            </tbody>
          </table>

          <h2>Żetony startowe — ile dać?</h2>
          <p>Zasada: żetony startowe powinny wynosić 50-100x BB pierwszego poziomu. Przy BB=20, startowe 1000-2000 żetonów daje komfortowe granie przez pierwsze rundy.</p>
          <p>W Pokero admin ustawia żetony startowe dla każdego gracza przed startem — jedno kliknięcie dla każdego uczestnika.</p>

          <h2>Rebuy — tak czy nie?</h2>
          <p><strong>Bez rebuy (freeze-out)</strong> — klasyczny turniej. Kto straci wszystko, odpada. Prostsze w zarządzaniu, bardziej dramatyczne.</p>
          <p><strong>Z rebuy</strong> — gracz który wypadnie może "dokupić" żetony (zazwyczaj tylko przez pierwsze kilka poziomów). Turniej trwa dłużej, jest więcej akcji, ale niektórzy wolą wiedzieć że "wyszli z gry".</p>
          <p>W Pokero admin może dodać żetony dowolnemu graczowi w trakcie gry — rebuy jest w pełni obsługiwany.</p>

          <h2>Kiedy grać online, kiedy stacjonarnie?</h2>
          <p>Online przez Pokero ma sens gdy:</p>
          <ul>
            <li>Ekipa jest w różnych miastach</li>
            <li>Nie masz fizycznych kart i żetonów</li>
            <li>Chcesz grać spontanicznie w 5 minut</li>
          </ul>
          <p>Stacjonarnie lepiej gdy:</p>
          <ul>
            <li>Wszyscy są w tym samym miejscu</li>
            <li>Lubisz fizyczne żetony i karty</li>
            <li>Chcesz widzieć miny przeciwników</li>
          </ul>

          <h2>Jak robić to online w Pokero</h2>
          <p>Wszystkie elementy turnieju są obsługiwane: admin zarządza żetonami, blindy możesz zmieniać ręcznie co odpowiedni czas, możesz wymusić następną rękę ("Force next hand") gdy ktoś zbyt długo czeka. Uruchom rozmowę głosową równolegle i grasz jak przy prawdziwym stole.</p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zacznij turniej teraz</Link>
          <Link href="/blog/poker-wieczor-kawalerski/" className="btn-outline">Poker na wieczór kawalerski →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/poker-ze-znajomymi-online/">Poker ze znajomymi online</Link> · <Link href="/zasady/texas-holdem/">Zasady Texas Hold'em</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Domowy turniej pokerowy — jak zorganizować krok po kroku",
              "datePublished": "2026-05-26",
              "publisher": {
                "@type": "Organization",
                "name": "Pokero",
                "url": "https://pokero.pl"
              },
              "mainEntityOfPage": "https://pokero.pl/blog/poker-domowy-turniej/"
            }),
          }}
        />
      </div>
    </div>
  );
}
