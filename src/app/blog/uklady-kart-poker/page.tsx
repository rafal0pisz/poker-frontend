import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Układy kart w pokerze — pełna tabela z przykładami i FAQ',
  description: 'Wszystkie 10 układów pokerowych z przykładami. Royal Flush, Full House, para i reszta — opisane prosto. Plus odpowiedzi na najczęstsze pytania.',
  alternates: { canonical: 'https://pokero.pl/blog/uklady-kart-poker/' },
  openGraph: {
    title: 'Układy kart w pokerze — tabela z przykładami',
    type: 'article',
    publishedTime: '2026-05-15',
  },
};

export default function Post3() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Układy kart</span>
      </div>

      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Zasady</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Układy kart w pokerze — pełna tabela z przykładami
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>15 maja 2026 · 5 min czytania</p>

        <div className="prose">
          <p>
            Niezależnie od wariantu — Texas Hold&apos;em, Omaha czy Crazy Pineapple — siła rąk w pokerze jest zawsze taka sama. 10 układów, od najsilniejszego do najsłabszego. Nauczysz się ich w 5 minut.
          </p>

          <h2>Pełna tabela układów</h2>
          <table>
            <thead>
              <tr><th>#</th><th>Układ</th><th>Przykład</th><th>Opis</th></tr>
            </thead>
            <tbody>
              {[
                [1, 'Royal Flush', 'A♠ K♠ Q♠ J♠ 10♠', 'Najsilniejszy układ. 5 najwyższych kart w jednym kolorze.'],
                [2, 'Straight Flush', '7♥ 6♥ 5♥ 4♥ 3♥', '5 kolejnych kart w jednym kolorze.'],
                [3, 'Kareta (Four of a Kind)', 'Q♠ Q♥ Q♦ Q♣ 5♠', '4 karty tego samego nominału.'],
                [4, 'Full House', '10♠ 10♥ 10♦ 6♣ 6♥', 'Trójka + para.'],
                [5, 'Kolor (Flush)', 'K♦ 10♦ 8♦ 4♦ 2♦', '5 kart tego samego koloru (niekolejne).'],
                [6, 'Strit (Straight)', 'J♠ 10♥ 9♦ 8♣ 7♠', '5 kolejnych kart (różne kolory).'],
                [7, 'Trójka (Three of a Kind)', '6♠ 6♥ 6♦ A♣ 3♠', '3 karty tego samego nominału.'],
                [8, 'Dwie pary (Two Pair)', 'A♠ A♥ 8♦ 8♣ K♠', 'Dwie różne pary.'],
                [9, 'Para (One Pair)', 'K♠ K♥ J♦ 7♣ 2♠', 'Dwie karty tego samego nominału.'],
                [10, 'Wysoka karta (High Card)', 'A♠ J♥ 9♦ 6♣ 2♠', 'Żaden układ — liczy się najwyższa karta.'],
              ].map(([n, name, ex, desc]) => (
                <tr key={String(n)}>
                  <td style={{ color: 'rgba(245,230,192,0.3)', fontWeight: 400 }}>{n}</td>
                  <td style={{ fontWeight: 700, color: '#d4af37' }}>{name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{ex}</td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Najczęstsze pytania</h2>

          <h3>Co wygrywa — kolor czy strit?</h3>
          <p>
            Kolor (Flush) jest silniejszy niż strit (Straight). Kolejność: Straight Flush &gt; Kareta &gt; Full House &gt; <strong>Kolor</strong> &gt; <strong>Strit</strong> &gt; Trójka.
          </p>

          <h3>Co wygrywa — dwie pary czy trójka?</h3>
          <p>
            Trójka jest silniejsza. Dwie pary plasują się poniżej trójki w każdym przypadku — nawet dwie pary Asów przegrywa z trójką 2-2-2.
          </p>

          <h3>Co jeśli obaj mają tę samą rękę?</h3>
          <p>
            Wygrywa karta decydująca — <strong>kicker</strong>. Np. przy parze Asów: A-A-K-9-5 vs A-A-Q-9-5 — wygrywa pierwsza ręka bo ma K (wyższy kicker).
          </p>
          <p>
            Jeśli 5 kart jest identycznych — pula dzielona między graczy po równo.
          </p>

          <h3>Czy As może być kartą numer 1?</h3>
          <p>
            Tak. As może być używany jako 1 w stricie A-2-3-4-5 (tzw. "koło" albo "wheel") albo jako 14 w 10-J-Q-K-A. Nie może jednak "zawijać" — K-A-2-3-4 nie jest stritem.
          </p>

          <h3>Czy kolory (kier, karo itd.) mają znaczenie?</h3>
          <p>
            W standardowym pokerze nie. Flush w kierach i flush w pikach są równoważne — wygrywa ta ręka, której najwyższa karta jest wyższa.
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/zasady/uklady-kart/" className="btn-outline">Pełna tabela układów →</Link>
          <Link href="/" className="btn-primary">🎰 Zagraj teraz</Link>
        </div>

        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/zasady-pokera-texas-holdem/">Zasady Texas Hold&apos;em</Link> · <Link href="/blog/poker-ze-znajomymi-online/">Poker ze znajomymi online</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: 'Układy kart w pokerze — pełna tabela z przykładami i FAQ',
              datePublished: '2026-05-15',
              publisher: { '@type': 'Organization', name: 'Pokero', url: 'https://pokero.pl' },
              mainEntityOfPage: 'https://pokero.pl/blog/uklady-kart-poker/',
            }),
          }}
        />
      </div>
    </div>
  );
}
