import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blind w pokerze — co to jest mały i duży blind',
  description: 'Co to jest blind w pokerze, dlaczego jest obowiązkowy, ile wynosi i jak wpływa na strategię. Small blind i big blind wyjaśnione dla początkujących.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-zasady-blind/' },
  openGraph: { type: 'article', publishedTime: '2026-05-31' },
};

export default function Post12() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Blind w pokerze</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Blind w pokerze — co to jest mały i duży blind
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>31 maja 2026 · 5 min czytania</p>
        <div className="prose">
          <p>Jeśli zaczynasz przygodę z pokerem, jedno z pierwszych słów które usłyszysz to "blind". Co to jest, po co i ile wynosi? Wyjaśniam prosto.</p>

          <h2>Co to jest blind?</h2>
          <p>Blind (po angielsku "ślepy") to obowiązkowa stawka którą dwaj gracze muszą wpłacić przed rozdaniem kart — nie widząc swoich kart. Stąd nazwa: grasz "w ciemno".</p>
          <p>Blindy są obowiązkowe żeby zawsze była jakaś pula do wygrania. Bez nich gracze mogliby czekać w nieskończoność na idealną rękę i nie grać w ogóle.</p>

          <h2>Small Blind i Big Blind</h2>
          <p><strong>Small Blind (mała ciemna, SB)</strong> — gracz bezpośrednio po lewej stronie dealera. Wpłaca połowę minimalnej stawki. Przy blindach 5/10 — SB wpłaca 5.</p>
          <p><strong>Big Blind (duża ciemna, BB)</strong> — następny gracz po SB. Wpłaca pełną minimalną stawkę. Przy blindach 5/10 — BB wpłaca 10. BB jest też minimalna stawką którą trzeba wyrównać żeby wejść do gry (call).</p>

          <h2>Jak blindy rotują?</h2>
          <p>Po każdej rozegranej ręce dealer przesuwa się o jedno miejsce w prawo (zgodnie z ruchem wskazówek zegara), SB i BB podążają za nim. Dzięki temu każdy gracz płaci blindy równomiernie przez całą sesję.</p>

          <h2>Jak blindy wpływają na strategię?</h2>
          <p>Granie z pozycji BB jest trudne bo grasz pierwszy na każdej ulicy po preflopie. Ale masz też pewne zalety:</p>
          <ul>
            <li>Przy braku podbicia możesz checkować za darmo (już wpłaciłeś BB)</li>
            <li>Masz "discount" na call — płacisz tylko różnicę między BB a aktualnym raise</li>
            <li>Możesz defendować szerszy zakres rąk bo masz już część stawki w puli</li>
          </ul>

          <h2>Ile powinny wynosić blindy?</h2>
          <p>Nie ma jednej odpowiedzi — zależy od ilości żetonów i oczekiwanego czasu gry. Ogólna zasada: SB+BB = 1.5-3% stacku startowego. Przy 1000 żetonach startowych — blindy 5/10 lub 10/20 to dobry punkt startowy.</p>
          <p>W Pokero admin ustawia blindy przed startem gry i może je zmieniać w trakcie (np. żeby przyspieszyć turniej gdy ktoś gra zbyt zachowawczo).</p>

          <h2>Heads-up — specjalne zasady blindów</h2>
          <p>W grze 1 vs 1 (heads-up) zasady blindów są odwrócone: dealer jest jednocześnie Small Blindem i gra PIERWSZY na preflopie. BB gra drugi przed flopem, ale pierwszy na wszystkich kolejnych ulicach. To trochę dezorientujące na początku, ale Pokero obsługuje to automatycznie.</p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">🎰 Zagraj teraz</Link>
          <Link href="/zasady/texas-holdem/" className="btn-outline">Pełne zasady Texas Hold'em →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/pozycja-w-pokerze/">Pozycja w pokerze</Link> · <Link href="/blog/zasady-pokera-texas-holdem/">Zasady Texas Hold'em</Link>
        </p>
      </div>
    </div>
  );
}
