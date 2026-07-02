import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/seo/Nav';
import { Footer } from '@/components/seo/Footer';

export const metadata: Metadata = {
  title: 'Zasady Omaha Hi-Lo — split pot, 8 or better, zasady dla początkujących',
  description: 'Kompletne zasady Omaha Hi-Lo (Omaha 8-or-Better). Jak działa podział puli między High i Low, co to znaczy "8 or better", jak wygrać obie połowy. Graj w Pokero.',
  alternates: { canonical: 'https://pokero.pl/zasady/omaha-hi-lo/' },
};

// ── Visual card component ──
function Card({ value, suit }: { value: string; suit?: '♠' | '♥' | '♦' | '♣' }) {
  const red = suit === '♥' || suit === '♦';
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', width: 40, height: 56,
      background: 'linear-gradient(135deg,#fff 80%,#f0f0f0)',
      border: '1px solid #aaa', borderRadius: 5,
      color: red ? '#c0392b' : '#111',
      fontWeight: 800, fontSize: '1.15rem', lineHeight: 1,
      boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
      margin: '0 3px', flexShrink: 0, userSelect: 'none',
    }}>
      <span>{value}</span>
      {suit && <span style={{ fontSize: '0.65rem', marginTop: 1 }}>{suit}</span>}
    </span>
  );
}

// ── Hand display: array of [value, suit?] ──
function Hand({ cards, label, winner }: {
  cards: [string, '♠'|'♥'|'♦'|'♣'|undefined][];
  label?: string;
  winner?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {label && (
        <span style={{ fontSize: '0.78rem', color: winner ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-cream-rgb),0.45)', fontWeight: winner ? 700 : 400 }}>
          {label}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {cards.map(([v, s], i) => <Card key={i} value={v} suit={s} />)}
      </div>
      {winner !== undefined && (
        <span style={{
          fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12,
          background: winner ? 'rgba(var(--pk-gold-rgb),0.2)' : 'rgba(180,60,60,0.15)',
          color: winner ? 'rgb(var(--pk-gold-rgb))' : '#e07070',
          border: `1px solid ${winner ? 'rgba(var(--pk-gold-rgb),0.4)' : 'rgba(180,60,60,0.3)'}`,
        }}>
          {winner ? '✓ Wygrywa' : '✗ Przegrywa'}
        </span>
      )}
    </div>
  );
}

// ── Side-by-side comparison ──
function Vs({ left, right, note }: {
  left: { cards: [string,'♠'|'♥'|'♦'|'♣'|undefined][]; label: string; wins: boolean };
  right: { cards: [string,'♠'|'♥'|'♦'|'♣'|undefined][]; label: string; wins: boolean };
  note?: string;
}) {
  return (
    <div style={{
      background: 'rgba(30,20,10,0.45)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)',
      borderRadius: 12, padding: '1.25rem 1rem', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Hand cards={left.cards} label={left.label} winner={left.wins} />
        <span style={{ color: 'rgba(var(--pk-cream-rgb),0.3)', fontSize: '1.5rem', fontWeight: 300 }}>vs</span>
        <Hand cards={right.cards} label={right.label} winner={right.wins} />
      </div>
      {note && <p style={{ textAlign: 'center', margin: '0.75rem 0 0', fontSize: '0.82rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>{note}</p>}
    </div>
  );
}

// ── Poker table SVG ──
function PokerTable() {
  return (
    <svg viewBox="0 0 520 260" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      {/* Felt */}
      <ellipse cx="260" cy="130" rx="230" ry="110" fill="#1a5c2a" stroke="#0d3a1a" strokeWidth="8"/>
      {/* Rail */}
      <ellipse cx="260" cy="130" rx="230" ry="110" fill="none" stroke="#8B4513" strokeWidth="16"/>
      {/* Center label */}
      <text x="260" y="118" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="13" fontFamily="serif">OMAHA HI-LO</text>
      <text x="260" y="136" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="10" fontFamily="serif">8 or Better · Split Pot</text>
      {/* Community cards placeholders */}
      {[175,213,251,289,327].map((x,i) => (
        <g key={i}>
          <rect x={x} y="148" width="28" height="40" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        </g>
      ))}
      {/* HIGH label top */}
      <text x="80" y="80" textAnchor="middle" fill="rgb(var(--pk-gold-rgb))" fontSize="11" fontWeight="bold">HIGH</text>
      <text x="80" y="94" textAnchor="middle" fill="rgba(var(--pk-cream-rgb),0.4)" fontSize="9">najlepsza ręka</text>
      {/* LOW label top */}
      <text x="440" y="80" textAnchor="middle" fill="#7ec8e3" fontSize="11" fontWeight="bold">LOW</text>
      <text x="440" y="94" textAnchor="middle" fill="rgba(var(--pk-cream-rgb),0.4)" fontSize="9">najgorsza ręka</text>
      {/* Arrow left */}
      <text x="260" y="60" textAnchor="middle" fill="rgba(var(--pk-cream-rgb),0.5)" fontSize="10">½ puli → High winner</text>
      <text x="260" y="75" textAnchor="middle" fill="rgba(var(--pk-cream-rgb),0.5)" fontSize="10">½ puli → Low winner</text>
    </svg>
  );
}

export default function OmahaHiLoPage() {
  return (
    <>
      <Nav />
      <main style={{ padding: '3rem 0 4rem' }}>
        <div className="container">

          {/* Breadcrumb */}
          <div style={{ marginBottom: '0.5rem' }}>
            <Link href="/pl/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Strona główna</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <Link href="/zasady/" style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>Zasady gry</Link>
            <span style={{ color: 'rgba(var(--pk-cream-rgb),0.2)', margin: '0 0.5rem' }}>›</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.6)' }}>Omaha Hi-Lo</span>
          </div>

          {/* Hero */}
          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>4 karty · split pot · 8 or better</span>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Zasady Omaha Hi-Lo</h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(var(--pk-cream-rgb),0.65)', maxWidth: 640 }}>
              Omaha Hi-Lo (zwana też Omaha 8-or-Better) to wariant, w którym <strong>pula dzielona jest na pół</strong> — połowa trafia do gracza z <em>najlepszą</em> ręką (High), połowa do gracza z <em>najlepszą kwalifikującą się</em> ręką Low. Możesz wygrać obie połowy — to <strong>scoop</strong>.
            </p>
          </div>

          {/* Table graphic */}
          <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 16, border: '1px solid rgba(var(--pk-gold-rgb),0.1)' }}>
            <PokerTable />
          </div>

          <div className="prose">

            {/* Kwalifikacja Low */}
            <h2>Kwalifikacja do Low — reguła &quot;8 or better&quot;</h2>
            <p>Aby zakwalifikować się do połowy Low, musisz ułożyć 5-kartową rękę gdzie <strong>wszystkie 5 kart ma wartość ósemki lub niżej</strong> (As liczy jako 1), i <strong>wszystkie mają różne wartości</strong> — pary dyskwalifikują.</p>
            <ul>
              <li>Dozwolone karty: <strong>A, 2, 3, 4, 5, 6, 7, 8</strong></li>
              <li>Kolory nie mają znaczenia dla Low</li>
              <li>Straighty i flushe są <strong>ignorowane</strong> przy ocenie Low</li>
              <li>Musisz użyć dokładnie 2 kart z ręki i 3 ze stołu (reguła 2+3)</li>
            </ul>
          </div>

          {/* Top 5 best hands */}
          <div style={{ margin: '2rem 0' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'rgb(var(--pk-gold-rgb))' }}>5 najlepszych rąk Low</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {([
                { rank: '🥇 #1', cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['5','♠']], note: 'Wheel / Bicykl — najlepsza możliwa + straight do High!' },
                { rank: '🥈 #2', cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['6','♠']], note: 'Najwyższa: 6' },
                { rank: '🥉 #3', cards: [['A','♠'],['2','♥'],['3','♦'],['5','♣'],['6','♠']], note: 'Najwyższa: 6 — ale 2. pozycja 5 > 4 (gorsza od #2)' },
                { rank: '#4',   cards: [['A','♠'],['2','♥'],['4','♦'],['5','♣'],['6','♠']], note: 'Najwyższa: 6' },
                { rank: '#5',   cards: [['A','♠'],['3','♥'],['4','♦'],['5','♣'],['6','♠']], note: 'Najwyższa: 6 — wszystkie pięć rąk z najwyższą 6 jest lepszych niż cokolwiek 7-wysokiego' },
              ] as { rank: string; cards: [string, '♠'|'♥'|'♦'|'♣'][], note: string }[]).map(({ rank, cards, note }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(var(--pk-gold-rgb),0.05)', border: '1px solid rgba(var(--pk-gold-rgb),0.12)', borderRadius: 10, padding: '0.6rem 1rem', flexWrap: 'wrap' }}>
                  <span style={{ width: 42, fontSize: '0.85rem', color: 'rgb(var(--pk-gold-rgb))', fontWeight: 700, flexShrink: 0 }}>{rank}</span>
                  <div style={{ display: 'flex' }}>
                    {cards.map(([v, s], i) => <Card key={i} value={v} suit={s as '♠'|'♥'|'♦'|'♣'} />)}
                  </div>
                  {note && <span style={{ fontSize: '0.8rem', color: 'rgba(var(--pk-cream-rgb),0.45)', fontStyle: 'italic' }}>{note}</span>}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(var(--pk-cream-rgb),0.4)' }}>
              Najgorsza kwalifikująca się ręka Low: <strong style={{ color: 'rgba(var(--pk-cream-rgb),0.7)' }}>8-7-6-5-4</strong> (wszystkie maksymalne dozwolone wartości)
            </p>
          </div>

          <div className="prose">
            <h2>Jak porównywać ręce Low — od najwyższej karty</h2>
            <p>Porównujesz od <strong>najwyższej karty w dół</strong>. Pierwsza różnica rozstrzyga — <strong>niższa karta wygrywa</strong> na tej pozycji. As liczy jako 1 (najniższy), więc pojawia się na końcu porównania.</p>
          </div>

          {/* Visual comparisons */}
          <div style={{ margin: '1.5rem 0' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(var(--pk-cream-rgb),0.8)' }}>Przykłady porównań</h3>

            <Vs
              left={{ cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['5','♠']], label: 'A-2-3-4-5', wins: true }}
              right={{ cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['6','♠']], label: 'A-2-3-4-6', wins: false }}
              note="Porównanie: 6=6? Nie — tu najwyższe to 5 vs 6. 5 < 6 → A-2-3-4-5 wygrywa (wheel bije wszystko)"
            />

            <Vs
              left={{ cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['7','♠']], label: 'A-2-3-4-7', wins: true }}
              right={{ cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['8','♠']], label: 'A-2-3-4-8', wins: false }}
              note="Najwyższa karta: 7 vs 8 → 7 < 8 → A-2-3-4-7 wygrywa"
            />

            <Vs
              left={{ cards: [['2','♠'],['3','♥'],['4','♦'],['5','♣'],['6','♠']], label: '2-3-4-5-6', wins: true }}
              right={{ cards: [['A','♠'],['4','♥'],['5','♦'],['6','♣'],['8','♠']], label: 'A-4-5-6-8', wins: false }}
              note="Najwyższa karta: 6 vs 8 → 6 < 8 → 2-3-4-5-6 wygrywa — As nie pomaga gdy wyższa karta jest lepsza"
            />

            <Vs
              left={{ cards: [['2','♠'],['3','♥'],['5','♦'],['6','♣'],['7','♠']], label: '2-3-5-6-7', wins: true }}
              right={{ cards: [['A','♠'],['4','♥'],['5','♦'],['6','♣'],['7','♠']], label: 'A-4-5-6-7', wins: false }}
              note="Kolejno: 7=7, 6=6, 5=5, następnie 3 vs 4 → 3 < 4 → 2-3-5-6-7 wygrywa — As dopiero na 5. miejscu, nie zdążył pomóc"
            />

            <Vs
              left={{ cards: [['A','♠'],['2','♥'],['4','♦'],['5','♣'],['7','♠']], label: 'A-2-4-5-7', wins: true }}
              right={{ cards: [['2','♠'],['3','♥'],['4','♦'],['5','♣'],['7','♠']], label: '2-3-4-5-7', wins: false }}
              note="Kolejno: 7=7, 5=5, 4=4, teraz 2 vs 3 → 2 < 3 → A-2-4-5-7 wygrywa — tu As (jako 1) pojawia się na 5. miejscu i bije 2"
            />

            <Vs
              left={{ cards: [['A','♠'],['2','♥'],['3','♦'],['5','♣'],['8','♠']], label: 'A-2-3-5-8', wins: true }}
              right={{ cards: [['A','♠'],['2','♥'],['4','♦'],['5','♣'],['8','♠']], label: 'A-2-4-5-8', wins: false }}
              note="Kolejno: 8=8, 5=5, następnie 3 vs 4 → 3 < 4 → A-2-3-5-8 wygrywa"
            />

            <Vs
              left={{ cards: [['A','♠'],['2','♥'],['3','♦'],['4','♣'],['8','♠']], label: 'A-2-3-4-8', wins: false }}
              right={{ cards: [['2','♠'],['3','♥'],['4','♦'],['5','♣'],['6','♠']], label: '2-3-4-5-6', wins: true }}
              note="Najwyższa karta: 8 vs 6 → 6 < 8 → 2-3-4-5-6 wygrywa już na 1. pozycji. As nie pomaga gdy wyższa karta jest lepsza po drugiej stronie"
            />

            <Vs
              left={{ cards: [['A','♠'],['3','♥'],['4','♦'],['5','♣'],['6','♠']], label: 'A-3-4-5-6', wins: true }}
              right={{ cards: [['2','♠'],['3','♥'],['4','♦'],['5','♣'],['6','♠']], label: '2-3-4-5-6', wins: false }}
              note="Kolejno: 6=6, 5=5, 4=4, 3=3, teraz A(1) vs 2 → 1 < 2 → A-3-4-5-6 wygrywa! Tu As rozstrzyga na ostatniej pozycji"
            />
          </div>

          <div className="prose">
            <h2>Kiedy As pomaga — a kiedy nie</h2>
            <p>As (=1) jest <strong>najlepszą kartą Low</strong>, ale decyduje dopiero gdy wszystkie wyższe karty w obu rękach są takie same. Jeśli wcześniej pojawi się różnica na innej karcie — As nie ma szansy pomóc.</p>
            <ul>
              <li><strong>As rozstrzyga:</strong> A-3-4-5-6 bije 2-3-4-5-6 — dopiero na 5. pozycji (A=1 vs 2)</li>
              <li><strong>As nie pomaga:</strong> A-4-5-6-7 przegrywa z 2-3-5-6-7 — różnica pojawia się na 4. pozycji (4 vs 3), As nawet nie wchodzi do porównania</li>
              <li><strong>Najwyższa karta decyduje:</strong> 2-3-4-5-6 (najwyższa: 6) bije A-4-5-6-8 (najwyższa: 8) już na 1. pozycji</li>
            </ul>

            <h2>Scoop — wygrywasz całą pulę</h2>
            <p>Jeśli wygrasz zarówno High jak i Low, zgarniesz <strong>całą pulę (scoop)</strong>. Wheel (A-2-3-4-5) to ulubiona ręka scoopera — jest najlepszą ręką Low i jednocześnie straightem w High.</p>
            <p>Przykład scoopa: masz <strong>A♠ 2♥ K♣ Q♦</strong>, na stole <strong>3♦ 4♠ 5♣ K♥ J♣</strong>. Twoja ręka High = K-K (para Króli), ręka Low = A-2-3-4-5 (wheel). Wygrywasz obie połowy.</p>

            <h2>Podział przy remisie</h2>
            <p>Identyczne ręce Low dzielą połowę Low równo (każdy dostaje ¼ całej puli). To samo dotyczy High.</p>

            <h2>Omaha Hi-Lo w Pokero</h2>
            <p>Silnik automatycznie ewaluuje wszystkie kombinacje 2+3, wybiera najlepszą rękę High i Low dla każdego gracza, i dzieli pulę. W wynikach zobaczysz kto wygrał High, kto Low, i jaka była jego ręka.</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/zasady/omaha/" className="btn-outline">← Omaha</Link>
            <Link href="/zasady/omaha-5-kartowa/" className="btn-outline">Omaha 5-kartowa →</Link>
            <Link href="/" className="btn-primary">Zagraj teraz</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(var(--pk-gold-rgb),0.06)', border: '1px solid rgba(var(--pk-gold-rgb),0.15)', borderRadius: 12 }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(var(--pk-cream-rgb),0.5)' }}>
              <strong style={{ color: 'rgb(var(--pk-gold-rgb))' }}>Inne warianty:</strong>{' '}
              <Link href="/zasady/texas-holdem/">Texas Hold&apos;em</Link> ·{' '}
              <Link href="/zasady/omaha/">Omaha</Link> ·{' '}
              <Link href="/zasady/omaha-5-kartowa/">Omaha 5-kartowa</Link> ·{' '}
              <Link href="/zasady/omaha-pot-limit/">Omaha Pot Limit</Link> ·{' '}
              <Link href="/zasady/crazy-pineapple/">Crazy Pineapple</Link> ·{' '}
              <Link href="/zasady/drawmaha/">Drawmaha</Link>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
