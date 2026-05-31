import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pot Odds w pokerze — jak liczyć opłacalność calla',
  description: 'Pot odds w pokerze — co to jest, jak liczyć i jak stosować w praktyce. Przykłady obliczeń, implied odds, kiedy call jest matematycznie opłacalny.',
  alternates: { canonical: 'https://pokero.pl/blog/pot-odds-poker/' },
  openGraph: { type: 'article', publishedTime: '2026-06-03' },
};

export default function Post16() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(245,230,192,0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(245,230,192,0.6)' }}>Pot Odds</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Matematyka</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Pot Odds w pokerze — jak liczyć opłacalność calla
        </h1>
        <p style={{ color: 'rgba(245,230,192,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>3 czerwca 2026 · 8 min czytania</p>
        <div className="prose">
          <p>
            Pot odds to jedno z najważniejszych pojęć w pokerze. Pozwalają obiektywnie ocenić
            czy call jest matematycznie opłacalny — niezależnie od intuicji czy emocji.
            Opanuj to pojęcie a Twoja gra natychmiast poprawi się o kilka poziomów.
          </p>

          <h2>Co to są pot odds?</h2>
          <p>
            Pot odds to stosunek tego co musisz wpłacić do całkowitej puli po Twoim callu.
            Wyrażone jako procent, mówią Ci ile procent puli "kosztuje" Cię call.
          </p>
          <p>
            <strong>Wzór:</strong> Pot odds = kwota calla ÷ (pula + kwota calla) × 100%
          </p>

          <h2>Przykład obliczenia</h2>
          <p>Pula wynosi 100, rywal stawia 50. Czy powinieneś callować?</p>
          <ul>
            <li>Kwota calla: 50</li>
            <li>Pula po callu: 100 + 50 + 50 = 200</li>
            <li>Pot odds: 50 ÷ 200 = 25%</li>
          </ul>
          <p>
            Czyli płacisz 25% puli żeby wejść do gry. Jeśli Twoje equity (szansa na wygraną) jest
            wyższa niż 25% — call jest opłacalny. Jeśli niższe — fold.
          </p>

          <h2>Jak sprawdzić equity?</h2>
          <p>
            Użyj <Link href="/kalkulatory/texas-holdem/">kalkulatora Texas Hold'em</Link> żeby sprawdzić
            Twoje equity w konkretnej sytuacji. Porównaj wynik z pot odds — decyzja staje się matematyczna.
          </p>
          <p>
            Jeśli kalkulator mówi że masz 35% equity a pot odds to 25% — call jest opłacalny matematycznie.
            Długoterminowo zarabiasz na takich callach mimo że możesz przegrać tę konkretną rękę.
          </p>

          <h2>Outs i szybkie obliczenia</h2>
          <p>
            Zamiast kalkulatora możesz użyć prostej reguły opartej na outach:
          </p>
          <ul>
            <li><strong>Na flopie</strong> (2 karty do showdownu): każdy out ≈ 4% szansy</li>
            <li><strong>Na turnie</strong> (1 karta do showdownu): każdy out ≈ 2% szansy</li>
          </ul>
          <p>
            Masz flush draw (9 outów) na flopie? 9 × 4% = 36% szansy. Jeśli pot odds są poniżej 36% — call.
          </p>

          <h2>Implied odds — kiedy pot odds to nie wszystko</h2>
          <p>
            Implied odds uwzględniają żetony które możesz wygrać w przyszłości jeśli trafisz.
            Jeśli Twój rywal ma dużo żetonów i na pewno zapłaci gdy trafisz rękę —
            możesz callować nawet gdy pot odds tego nie uzasadniają.
          </p>
          <p>
            Przykład: masz 20% equity ale pot odds to 30% — matematycznie fold. Ale jeśli rywal ma
            500 żetonów za, a Ty trafisz niewidoczną rękę (np. nut flush) — implied odds mogą uzasadnić call.
          </p>

          <h2>Praktyczne zastosowanie</h2>
          <p>
            Przy każdej trudnej decyzji callu zadaj sobie dwa pytania:
          </p>
          <ol>
            <li>Ile procent puli kosztuje mnie call? (pot odds)</li>
            <li>Ile procent szansy mam na wygraną? (equity)</li>
          </ol>
          <p>
            Jeśli equity {'>'} pot odds — call. Jeśli equity {'<'} pot odds — fold. Tak prosto.
            Ćwicz te obliczenia grając w <Link href="/">Pokero</Link> ze znajomymi — bez presji
            możesz spokojnie myśleć i obliczać.
          </p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/kalkulatory/texas-holdem/" className="btn-primary">🎯 Oblicz swoje equity</Link>
          <Link href="/blog/poker-outs-kalkulator/" className="btn-outline">Outs w pokerze →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(245,230,192,0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/poker-outs-kalkulator/">Poker outs</Link> · <Link href="/blog/poker-matematyka/">Matematyka pokera</Link>
        </p>
      </div>
    </div>
  );
}
