import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Układy kart w pokerze — pełna tabela z przykładami',
  description: 'Kompletna tabela układów pokerowych od Royal Flush do Wysokiej karty. Przykłady każdej ręki, porównanie siły układów, opis zasad.',
  alternates: { canonical: 'https://pokero.pl/zasady/uklady-kart/' },
};

const hands = [
  { rank: 1, name: 'Royal Flush', pl: 'Poker królewski', example: 'A♠ K♠ Q♠ J♠ 10♠', desc: 'Pięć najwyższych kart w tym samym kolorze. Najrzadsza i najsilniejsza ręka.' },
  { rank: 2, name: 'Straight Flush', pl: 'Poker', example: '9♥ 8♥ 7♥ 6♥ 5♥', desc: 'Pięć kolejnych kart w tym samym kolorze. Wygrywa wyższa karta szczytowa.' },
  { rank: 3, name: 'Four of a Kind', pl: 'Kareta', example: 'K♠ K♥ K♦ K♣ 2♠', desc: 'Cztery karty tego samego nominału. Wygrywa wyższy nominał karety.' },
  { rank: 4, name: 'Full House', pl: 'Full', example: 'J♠ J♥ J♦ 7♣ 7♥', desc: 'Trójka + para. Wygrywa wyższa trójka, przy remisie — wyższa para.' },
  { rank: 5, name: 'Flush', pl: 'Kolor', example: 'A♣ J♣ 8♣ 5♣ 2♣', desc: 'Pięć kart w tym samym kolorze (niekolejne). Wygrywa najwyższa karta.' },
  { rank: 6, name: 'Straight', pl: 'Strit', example: '8♠ 7♥ 6♦ 5♣ 4♠', desc: 'Pięć kolejnych kart (różne kolory). As może być 1 lub 14.' },
  { rank: 7, name: 'Three of a Kind', pl: 'Trójka', example: '7♠ 7♥ 7♦ K♣ 2♠', desc: 'Trzy karty tego samego nominału plus dwie niepasujące.' },
  { rank: 8, name: 'Two Pair', pl: 'Dwie pary', example: 'A♠ A♥ 9♦ 9♣ K♠', desc: 'Dwie różne pary. Wygrywa wyższa para, przy remisie — niższa, potem kicker.' },
  { rank: 9, name: 'One Pair', pl: 'Para', example: 'Q♠ Q♥ 9♦ 5♣ 2♠', desc: 'Dwie karty tego samego nominału plus trzy niepasujące (kickery).' },
  { rank: 10, name: 'High Card', pl: 'Wysoka karta', example: 'A♠ J♥ 8♦ 5♣ 2♠', desc: 'Żaden układ. Wygrywa najwyższa karta, przy remisie — kolejna i tak dalej.' },
];

export default function UkladyKartPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Układy kart</span>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Układy kart w pokerze</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,230,192,0.65)', maxWidth: 600 }}>
              Kompletna tabela 10 układów pokerowych od najsilniejszego do najsłabszego. Obowiązuje we wszystkich wariantach: Texas Hold&apos;em, Omaha, Crazy Pineapple i Drawmaha.
            </p>
          </div>

          <div className="prose" style={{ marginBottom: '2rem' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Układ</th>
                  <th>Polska nazwa</th>
                  <th>Przykład</th>
                  <th>Opis</th>
                </tr>
              </thead>
              <tbody>
                {hands.map((h) => (
                  <tr key={h.rank}>
                    <td style={{ color: 'rgba(245,230,192,0.35)', fontWeight: 400 }}>{h.rank}</td>
                    <td style={{ fontWeight: 700, color: '#d4af37', whiteSpace: 'nowrap' }}>{h.name}</td>
                    <td style={{ color: 'rgba(245,230,192,0.7)', whiteSpace: 'nowrap' }}>{h.pl}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{h.example}</td>
                    <td>{h.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose">
            <h2>Kilka ważnych zasad</h2>
            <h3>Kicker — karta decydująca przy remisie</h3>
            <p>
              Gdy dwóch graczy ma taki sam układ (np. obaj mają parę Asów), wygrywa ten który ma wyższe karty poza parą — są one nazywane kickerami. Np. A-A-K-9-5 wygrywa z A-A-Q-9-5.
            </p>

            <h3>As jako 1 lub 14</h3>
            <p>
              As może być najniższą kartą stritu (A-2-3-4-5, zwany "wheel" lub "koło") albo najwyższą (10-J-Q-K-A). Nie może jednak "zawijać" — K-A-2-3-4 nie jest stritem.
            </p>

            <h3>Kolory są równe</h3>
            <p>
              W standardowym pokerze kier (♥), karo (♦), trefl (♣) i pik (♠) mają tę samą wartość. Flush w kierach i flush w pikach są równoważne — wygrywa najwyższa karta koloru.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/" className="btn-outline">← Wszystkie zasady</Link>
            <Link href="/graj/" className="btn-primary">🎰 Zagraj teraz</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
