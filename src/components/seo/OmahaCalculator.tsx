'use client';

import { useState, useCallback } from 'react';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['h', 'd', 's', 'c'] as const;
type Suit = typeof SUITS[number];
type Card = { rank: string; suit: Suit } | null;

const SYM: Record<Suit, string> = { h: '♥', d: '♦', s: '♠', c: '♣' };
const SNAME: Record<Suit, string> = { h: 'Kier', d: 'Karo', s: 'Pik', c: 'Trefl' };
const RV: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, T: 10, J: 11, Q: 12, K: 13, A: 14 };
const IS_RED: Record<Suit, boolean> = { h: true, d: true, s: false, c: false };
const PLAYER_COLORS = ['#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#be185d', '#92400e'];

function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === arr.length) return [arr];
  if (k === 0) return [[]];
  const [f, ...r] = arr;
  return [...getCombinations(r, k - 1).map(c => [f, ...c]), ...getCombinations(r, k)];
}

function eval5(hand: Card[]): number {
  const rv = hand.map(c => RV[c!.rank]).sort((a, b) => b - a);
  const suits = hand.map(c => c!.suit);
  const fl = suits.every(s => s === suits[0]);
  const u = [...new Set(rv)].sort((a, b) => b - a);
  const isWheel = u[0] === 14 && u[1] === 5 && u[4] === 2;
  const st = u.length >= 5 && (u[0] - u[4] === 4 || isWheel);
  const cnt: Record<number, number> = {};
  rv.forEach(r => { cnt[r] = (cnt[r] || 0) + 1; });
  const fr = Object.values(cnt).sort((a, b) => b - a);
  if (fl && st) return 8e6 + (isWheel ? 5 : u[0]);
  if (fr[0] === 4) return 7e6 + rv[0] * 1e2 + rv[4];
  if (fr[0] === 3 && fr[1] === 2) return 6e6 + rv[0] * 1e2 + rv[3];
  if (fl) return 5e6 + rv[0] * 1e4 + rv[1] * 1e3 + rv[2] * 1e2 + rv[3] * 10 + rv[4];
  if (st) return 4e6 + (isWheel ? 5 : u[0]);
  if (fr[0] === 3) return 3e6 + rv[0] * 1e4 + rv[3] * 1e2 + rv[4];
  if (fr[0] === 2 && fr[1] === 2) return 2e6 + rv[0] * 1e4 + rv[2] * 1e2 + rv[4];
  if (fr[0] === 2) return 1e6 + rv[0] * 1e4 + rv[2] * 1e2 + rv[3] * 10 + rv[4];
  return rv[0] * 1e4 + rv[1] * 1e3 + rv[2] * 1e2 + rv[3] * 10 + rv[4];
}

// Omaha: MUST use exactly 2 hole cards + exactly 3 board cards
function bestOmahaHand(hole: Card[], board: Card[]): number {
  const h = hole.filter(Boolean) as NonNullable<Card>[];
  const b = board.filter(Boolean) as NonNullable<Card>[];
  if (h.length < 2 || b.length < 3) return 0;
  let best = -1;
  for (const hc of getCombinations(h, 2)) {
    for (const bc of getCombinations(b, 3)) {
      const score = eval5([...hc, ...bc]);
      if (score > best) best = score;
    }
  }
  return best;
}

function buildDeck(exclude: Card[]): Card[] {
  const ex = new Set(exclude.filter(Boolean).map(c => c!.rank + c!.suit));
  return RANKS.flatMap(r => SUITS.map(s => ({ rank: r, suit: s } as Card))).filter(c => !ex.has(c!.rank + c!.suit));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CardDisplay({ card, onClick, size = 'normal' }: { card: Card; onClick: () => void; size?: 'normal' | 'board' }) {
  const w = size === 'board' ? 52 : 44;
  const h = size === 'board' ? 72 : 62;
  const fs = size === 'board' ? 18 : 15;
  const sfs = size === 'board' ? 13 : 11;
  if (!card) {
    return (
      <div onClick={onClick} style={{ width: w, height: h, borderRadius: 6, background: '#f9fafb', border: '1.5px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: '#9ca3af', flexShrink: 0 }}>+</div>
    );
  }
  const red = IS_RED[card.suit];
  return (
    <div onClick={onClick} style={{ width: w, height: h, borderRadius: 6, background: '#fff', border: '1.5px solid #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, gap: 1, color: red ? '#dc2626' : '#111827' }}>
      <span style={{ fontSize: fs, fontWeight: 700, lineHeight: 1 }}>{card.rank === 'T' ? '10' : card.rank}</span>
      <span style={{ fontSize: sfs, lineHeight: 1 }}>{SYM[card.suit]}</span>
    </div>
  );
}

export function OmahaCalculator() {
  const [heroCards, setHeroCards] = useState<[Card, Card, Card, Card]>([null, null, null, null]);
  const [boardCards, setBoardCards] = useState<[Card, Card, Card, Card, Card]>([null, null, null, null, null]);
  const [numOpp, setNumOpp] = useState(2);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);
  const [activeSuit, setActiveSuit] = useState<Suit>('h');
  const [result, setResult] = useState<{ win: number; tie: number; lose: number; oppAvg: number; n: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allCards: Card[] = [...heroCards, ...boardCards];
  const usedKeys = new Set(allCards.filter(Boolean).map(c => c!.rank + c!.suit));

  const getCard = (slot: string): Card => {
    if (slot.startsWith('h')) return heroCards[parseInt(slot[1])] ?? null;
    return boardCards[parseInt(slot[1])] ?? null;
  };

  const setCard = (slot: string, card: Card) => {
    if (slot.startsWith('h')) {
      const idx = parseInt(slot[1]);
      setHeroCards(prev => { const n = [...prev] as [Card, Card, Card, Card]; n[idx] = card; return n; });
    } else {
      const idx = parseInt(slot[1]);
      setBoardCards(prev => { const n = [...prev] as [Card, Card, Card, Card, Card]; n[idx] = card; return n; });
    }
  };

  const openPicker = (slot: string) => setPickerTarget(prev => prev === slot ? null : slot);

  const pickCard = (rank: string) => {
    if (!pickerTarget) return;
    setCard(pickerTarget, { rank, suit: activeSuit });
    setPickerTarget(null);
    setResult(null);
    setError(null);
  };

  const clearCard = (slot: string) => {
    setCard(slot, null);
    setResult(null);
    setError(null);
    setPickerTarget(null);
  };

  const reset = () => {
    setHeroCards([null, null, null, null]);
    setBoardCards([null, null, null, null, null]);
    setResult(null);
    setError(null);
    setPickerTarget(null);
    setNumOpp(2);
  };

  const heroFilled = heroCards.filter(Boolean).length;
  const boardFilled = boardCards.filter(Boolean).length;

  const calcEquity = useCallback(() => {
    const h = heroCards.filter(Boolean) as NonNullable<Card>[];
    if (h.length < 4) {
      setError('W Omaha musisz wybrać dokładnie 4 karty na rękę.');
      return;
    }
    const board = boardCards.filter(Boolean) as NonNullable<Card>[];
    if (board.length > 0 && board.length < 3) {
      setError('Karty wspólne: podaj 0 (pre-flop), 3 (flop), 4 (turn) lub 5 (river).');
      return;
    }
    setError(null);
    setRunning(true);
    setTimeout(() => {
      const N = 4000;
      let wins = 0, ties = 0;
      for (let i = 0; i < N; i++) {
        const deck = shuffle(buildDeck([...h, ...board]));
        let di = 0;
        const sb = [...board];
        while (sb.length < 5) sb.push(deck[di++]);
        const hs = bestOmahaHand(h, sb);
        let ob = 0;
        for (let o = 0; o < numOpp; o++) {
          const oh = [deck[di++], deck[di++], deck[di++], deck[di++]];
          const s = bestOmahaHand(oh, sb);
          if (s > ob) ob = s;
        }
        if (hs > ob) wins++;
        else if (hs === ob) ties++;
      }
      const win = wins / N * 100;
      const tie = ties / N * 100;
      setResult({ win, tie, lose: 100 - win - tie, oppAvg: (100 - win - tie / 2) / numOpp, n: N });
      setRunning(false);
    }, 10);
  }, [heroCards, boardCards, numOpp]);

  const slotLabel: Record<string, string> = { h0: 'Karta 1', h1: 'Karta 2', h2: 'Karta 3', h3: 'Karta 4', b0: 'Flop 1', b1: 'Flop 2', b2: 'Flop 3', b3: 'Turn', b4: 'River' };

  return (
    <div style={{ background: '#1a1a2a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, padding: '1.5rem', maxWidth: 700 }}>

      {/* Hero cards — 4 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(212,175,55,0.6)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
            Twoje karty — 4 karty ({heroFilled}/4)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {([0, 1, 2, 3] as const).map(i => (
              <div key={i} onClick={() => heroCards[i] ? clearCard(`h${i}`) : openPicker(`h${i}`)}>
                <CardDisplay card={heroCards[i]} onClick={() => {}} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(212,175,55,0.6)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>Liczba rywali</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <input type="range" min={1} max={8} value={numOpp} onChange={e => { setNumOpp(+e.target.value); setResult(null); }} style={{ flex: 1, accentColor: '#d4af37' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#d4af37', minWidth: 24 }}>{numOpp}</span>
            <span style={{ fontSize: 13, color: 'rgba(245,230,192,0.5)' }}>graczy</span>
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(212,175,55,0.06)', borderRadius: 8, fontSize: 12, color: 'rgba(245,230,192,0.5)', lineHeight: 1.5 }}>
            Omaha: musisz użyć dokładnie 2 kart z ręki + 3 ze stołu
          </div>
        </div>
      </div>

      {/* Board cards */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(212,175,55,0.6)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
          Karty wspólne (opcjonalne — 0, 3, 4 lub 5)
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {([0, 1, 2, 3, 4] as const).map(i => (
            <div key={i} onClick={() => boardCards[i] ? clearCard(`b${i}`) : openPicker(`b${i}`)}>
              <CardDisplay card={boardCards[i]} onClick={() => {}} size="board" />
            </div>
          ))}
        </div>
      </div>

      {/* Picker */}
      {pickerTarget && (
        <div style={{ background: '#13131f', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(245,230,192,0.5)', marginBottom: 10 }}>
            Wybierz kolor — <strong style={{ color: '#d4af37' }}>{slotLabel[pickerTarget]}</strong>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {SUITS.map(s => {
              const active = activeSuit === s;
              const red = IS_RED[s];
              const bg = active ? (red ? '#fee2e2' : (s === 's' ? '#e0e7ff' : '#d1fae5')) : '#fff';
              const borderCol = active ? (red ? '#dc2626' : (s === 's' ? '#3730a3' : '#065f46')) : '#d1d5db';
              return (
                <button key={s} onClick={() => setActiveSuit(s)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, border: `1.5px solid ${borderCol}`, background: bg, fontSize: 15, fontWeight: 700, cursor: 'pointer', color: red ? '#dc2626' : '#111827' }}>
                  {SYM[s]} {SNAME[s]}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(245,230,192,0.5)', marginBottom: 8 }}>Wybierz wartość:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 3 }}>
            {RANKS.map(r => {
              const key = r + activeSuit;
              const taken = usedKeys.has(key) && !(pickerTarget && getCard(pickerTarget)?.rank === r && getCard(pickerTarget)?.suit === activeSuit);
              return (
                <button key={r} disabled={taken} onClick={() => pickCard(r)} style={{ aspectRatio: '1', borderRadius: 4, border: '1px solid #e5e7eb', background: taken ? '#f3f4f6' : '#fff', fontSize: 11, fontWeight: 700, cursor: taken ? 'default' : 'pointer', color: taken ? '#9ca3af' : (IS_RED[activeSuit] ? '#dc2626' : '#111827'), opacity: taken ? 0.35 : 1 }}>
                  {r === 'T' ? '10' : r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#450a0a', borderLeft: '3px solid #dc2626', borderRadius: 6, fontSize: 13, color: '#fca5a5', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Calculate button */}
      {heroFilled === 4 && (
        <button onClick={calcEquity} disabled={running} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#d4af37', border: 'none', color: '#0d0d14', fontSize: 15, fontWeight: 700, cursor: running ? 'default' : 'pointer', opacity: running ? 0.7 : 1, marginBottom: '1.5rem' }}>
          {running ? 'Obliczam (4000 symulacji)...' : '🎯 Oblicz szanse na wygraną'}
        </button>
      )}

      {heroFilled < 4 && (
        <div style={{ padding: '10px 14px', background: 'rgba(212,175,55,0.06)', borderLeft: '3px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 13, color: 'rgba(245,230,192,0.5)', marginBottom: '1rem' }}>
          Wybierz {4 - heroFilled} {4 - heroFilled === 1 ? 'kartę' : 'karty'} na rękę żeby obliczyć szanse.
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Wygrana', val: result.win, col: '#1d4ed8' },
              { label: 'Remis', val: result.tie, col: '#9ca3af' },
              { label: 'Przegrana', val: result.lose, col: '#dc2626' },
            ].map(s => (
              <div key={s.label} style={{ background: '#13131f', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(245,230,192,0.4)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.col }}>{s.val.toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1d3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>H</div>
              <div style={{ fontSize: 13, fontWeight: 600, flex: '0 0 64px', color: '#1d4ed8' }}>Ty (Hero)</div>
              <div style={{ flex: 1, height: 8, background: '#2d2d3f', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: 8, width: `${result.win.toFixed(1)}%`, background: '#1d4ed8', borderRadius: 4, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, minWidth: 52, textAlign: 'right', color: '#1d4ed8' }}>{result.win.toFixed(1)}%</div>
            </div>
            {Array.from({ length: numOpp }, (_, i) => {
              const col = PLAYER_COLORS[i + 1] || PLAYER_COLORS[PLAYER_COLORS.length - 1];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < numOpp - 1 ? '1px solid rgba(212,175,55,0.08)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: col, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: 'rgba(245,230,192,0.5)', flex: '0 0 64px' }}>Rywal {i + 1}</div>
                  <div style={{ flex: 1, height: 8, background: '#2d2d3f', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: 8, width: `${result.oppAvg.toFixed(1)}%`, background: col, borderRadius: 4, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, minWidth: 52, textAlign: 'right', color: col }}>{result.oppAvg.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1f3d', borderLeft: '3px solid #3b82f6', borderRadius: 6, fontSize: 13, color: '#93c5fd' }}>
            Symulacja Monte Carlo: {result.n.toLocaleString('pl-PL')} rozdań (zasada dokładnie 2+3).{' '}
            {boardFilled === 0 ? 'Equity pre-flop.' : `${boardFilled} kart wspólnych.`}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={reset} style={{ padding: '6px 14px', fontSize: 13, borderRadius: 8, border: '1px solid rgba(212,175,55,0.25)', background: 'transparent', color: 'rgba(245,230,192,0.5)', cursor: 'pointer' }}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
