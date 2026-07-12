import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Matematyka pokera — EV, pot odds, equity w jednym miejscu',
  description: 'Matematyka pokera dla graczy bez tła matematycznego. Expected Value (EV), pot odds, equity, liczba outów — wszystko z przykładami które możesz od razu zastosować.',
  alternates: { canonical: 'https://pokero.pl/blog/poker-matematyka/' },
  openGraph: { type: 'article', publishedTime: '2026-06-09' },
};

export default function Post22() {
  return (
    <div className="container">
      <div style={{ marginBottom: '0.5rem' }}>
        <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <Link href="/blog/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Blog</Link>
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Matematyka pokera</span>
      </div>
      <div style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>Matematyka</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Matematyka pokera — EV, pot odds i equity w jednym miejscu
        </h1>
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>9 czerwca 2026 · 10 min czytania</p>
        <div className="prose">
          <p>
            Poker to gra matematyczna. Nie musisz być matematykiem żeby wygrywać,
            ale musisz rozumieć kilka kluczowych pojęć. Ten artykuł tłumaczy je
            bez zbędnego żargonu — z przykładami gotowymi do zastosowania przy stole.
          </p>

          <h2>Expected Value (EV) — oczekiwana wartość</h2>
          <p>
            EV to fundamentalne pojęcie. Pozytywny EV (+EV) oznacza że decyzja jest długoterminowo
            zyskowna. Negatywny EV (-EV) oznacza stratę w długim terminie.
          </p>
          <p>
            <strong>Wzór:</strong> EV = (% wygranej × kwota wygranej) - (% przegranej × kwota przegranej)
          </p>
          <p>
            Przykład: masz 60% szansy wygrania puli 100 i callując ryzykujesz 40.
            EV = (0.60 × 100) - (0.40 × 40) = 60 - 16 = +44. Decyzja +EV.
          </p>

          <h2>Equity — Twój udział w puli</h2>
          <p>
            Equity to procent puli który "należy do Ciebie" statystycznie. Sprawdź je używając{' '}
            <Link href="/kalkulatory/texas-holdem/">kalkulatora Texas Hold'em</Link>.
            Jeśli masz 65% equity przy puli 200, Twoja "wartość" w tej puli to 130 żetonów.
          </p>

          <h2>Pot odds — opłacalność calla</h2>
          <p>
            Pot odds mówią ile % puli kosztuje Cię call. Wzór: call ÷ (pula + call) × 100%.
            Porównaj z equity — jeśli equity {'>'} pot odds, call jest +EV.
          </p>
          <p>Szczegóły: <Link href="/blog/pot-odds-poker/">Pot odds w pokerze</Link>.</p>

          <h2>Outs — ile kart Cię poprawi</h2>
          <p>
            Out to karta poprawiająca Twoją rękę. Reguła 2 i 4 do szybkich obliczeń:
            outy × 4 na flopie, outy × 2 na turnie.
          </p>
          <p>Szczegóły: <Link href="/blog/poker-outs-kalkulator/">Outs w pokerze</Link>.</p>

          <h2>Prawdopodobieństwo dostania premium rąk</h2>
          <table>
            <thead><tr><th>Ręka</th><th>Prawdopodobieństwo</th><th>Średnio co</th></tr></thead>
            <tbody>
              <tr><td>Para Asów (AA)</td><td>0.45%</td><td>221 rąk</td></tr>
              <tr><td>Dowolna para kieszonkowa</td><td>5.88%</td><td>17 rąk</td></tr>
              <tr><td>AK (suited)</td><td>0.30%</td><td>331 rąk</td></tr>
              <tr><td>AK (dowolny)</td><td>1.21%</td><td>83 ręce</td></tr>
              <tr><td>Suited connectors (np. 76s)</td><td>0.30%</td><td>331 rąk</td></tr>
            </tbody>
          </table>

          <h2>Jak stosować matematykę w praktyce?</h2>
          <p>
            Przy każdej decyzji callu: policz outy → oblicz szansę (×4 lub ×2) → oblicz pot odds →
            porównaj. Jeśli szansa {'>'} pot odds — call. Jeśli niższa — fold.
          </p>
          <p>
            Używaj <Link href="/kalkulatory/texas-holdem/">kalkulatora</Link> żeby weryfikować
            swoje intuicje i budować matematyczną intuicję pokerową.
            Graj ze znajomymi w <Link href="/">Pokero</Link> i ćwicz te obliczenia na żywo.
          </p>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/kalkulatory/texas-holdem/" className="btn-primary">🎯 Kalkulator equity</Link>
          <Link href="/blog/pot-odds-poker/" className="btn-outline">Pot odds →</Link>
        </div>
        <hr className="divider" style={{ marginTop: '2.5rem' }} />
        <p style={{ color: 'rgba(var(--pk-cream-rgb),0.35)', fontSize: '0.85rem' }}>
          Powiązane: <Link href="/blog/pot-odds-poker/">Pot odds</Link> · <Link href="/blog/poker-outs-kalkulator/">Outs</Link> · <Link href="/kalkulatory/">Kalkulatory</Link>
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Matematyka pokera — EV, pot odds, equity w jednym miejscu",
              "datePublished": "2026-06-09",
              "publisher": {
                "@type": "Organization",
                "name": "Pokero",
                "url": "https://pokero.pl"
              },
              "mainEntityOfPage": "https://pokero.pl/blog/poker-matematyka/"
            }),
          }}
        />
      </div>
    </div>
  );
}
