import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Outs w pokerze — co to jest i jak liczyć',
  description: 'Outs w pokerze — definicja, jak liczyć outy, tabela najczęstszych draw i ich outów. Reguła 2 i 4 do szybkich obliczeń przy stole.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-outs-kalkulator/' },
  openGraph: { type: 'article', publishedTime: '2026-06-04' },
};

export default function Post17() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Outs w pokerze</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Matematyka</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Outs w pokerze — co to jest i jak liczyć
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>4 czerwca 2026 · 7 min czytania</p>
        <div className="prose">
          <p>
            Out to karta która poprawi Twoją rękę. Jeśli masz cztery karty do koloru — 9 kart w talii
            może domknąć Twój kolor — masz 9 outów. Znajomość outów to podstawa obliczania szans w pokerze.
          </p>

          <h2>Definicja outa</h2>
          <p>
            Out to każda karta pozostała w talii (niewidoczna ani w Twojej ręce, ani na stole)
            która poprawia Twoją rękę do lepszego układu. Kluczowe: out musi poprawiać Twoją rękę
            do czegoś co prawdopodobnie wygra — liczymy tylko "dobre" outy.
          </p>

          <h2>Tabela najczęstszych draw i ich outów</h2>
          <table>
            <thead><tr><th>Sytuacja (draw)</th><th>Liczba outów</th><th>Przykład</th></tr></thead>
            <tbody>
              <tr><td>Flush draw (4 karty do koloru)</td><td>9</td><td>4♥ 7♥ na stole 2♥ 9♥ J♦</td></tr>
              <tr><td>Open-ended straight draw</td><td>8</td><td>6-7-8-9, czekasz na 5 lub 10</td></tr>
              <tr><td>Gutshot straight draw</td><td>4</td><td>5-6-8-9, czekasz na 7</td></tr>
              <tr><td>Flush draw + gutshot</td><td>12</td><td>Kombinacja dwóch draw</td></tr>
              <tr><td>Flush draw + open-ended</td><td>15</td><td>Bardzo silny draw</td></tr>
              <tr><td>Overcards (2 wysokie karty)</td><td>6</td><td>A-K bez pary, czekasz na parę</td></tr>
              <tr><td>Set draw (masz parę, czekasz na trójkę)</td><td>2</td><td>Masz 7-7, czekasz na trzeciego 7</td></tr>
            </tbody>
          </table>

          <h2>Reguła 2 i 4 — szybkie obliczenia przy stole</h2>
          <p>
            Nie masz czasu na dokładne obliczenia? Użyj prostej reguły:
          </p>
          <ul>
            <li><strong>Na flopie</strong> (2 karty do showdownu): outy × 4 = przybliżona szansa %</li>
            <li><strong>Na turnie</strong> (1 karta do showdownu): outy × 2 = przybliżona szansa %</li>
          </ul>
          <p>
            Przykład: masz flush draw (9 outów) na flopie. 9 × 4 = 36% szansy na trafienie koloru do river.
            Na turnie: 9 × 2 = 18% szansy na river card.
          </p>

          <h2>Jak to połączyć z pot odds?</h2>
          <p>
            Gdy znasz swoje outy, możesz szybko ocenić czy call jest opłacalny:
          </p>
          <ol>
            <li>Policz outy (np. 9 flush draw)</li>
            <li>Oblicz szansę: 9 × 4 = 36% na flopie</li>
            <li>Oblicz pot odds: call ÷ (pula + call)</li>
            <li>Jeśli 36% {'>'} pot odds — call matematycznie poprawny</li>
          </ol>
          <p>Szczegóły o pot odds: <Link href="/blog/pot-odds-poker/">Pot odds w pokerze</Link>.</p>

          <h2>Kiedy out nie jest "dobrym" outem?</h2>
          <p>
            Uwaga: nie każdy out jest naprawdę pomocny. Jeśli czekasz na parę Asów ale rywal
            prawdopodobnie ma już gotową rękę wyższą (np. two pair lub set) — Twój "out" może
            nie wygrać showdownu. Dostosuj liczbę efektywnych outów do realnej sytuacji.
          </p>
          <p>
            Używaj <Link href="/kalkulatory/texas-holdem/">kalkulatora equity</Link> żeby dokładnie
            sprawdzić swoje szanse w konkretnej sytuacji bez liczenia outów ręcznie.
          </p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/kalkulatory/texas-holdem/" className="btn-primary">🎯 Kalkulator equity</Link>
          <Link href="/blog/pot-odds-poker/" className="btn-outline">Pot odds →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/pot-odds-poker/">Pot odds w pokerze</Link> · <Link href="/blog/poker-matematyka/">Matematyka pokera</Link>
        </p>
      </div>
    </div>
  );
}
