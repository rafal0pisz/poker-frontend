'use client';

import { useState, useEffect, useRef } from 'react';
import type { Card as CardType } from '@/lib/types';

// ── Poker equity calculator (Monte Carlo) ────────────────────────────────
// Runs in the browser after showdown is revealed.
// Calculates what each player's equity WAS just before the final community
// cards were dealt — i.e. "who was ahead and by how much".

const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const SUITS = ['s','h','d','c'];
const RV: Record<string, number> = Object.fromEntries(
  RANKS.map((r, i) => [r, i + 2])
);

function eval5(cards: string[]): number {
  const rv = cards.map(c => RV[c[0]]).sort((a, b) => b - a);
  const suits = cards.map(c => c[1]);
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

function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k === arr.length) return [arr];
  const [f, ...r] = arr;
  return [...combos(r, k - 1).map(c => [f, ...c]), ...combos(r, k)];
}

function bestHand(hole: string[], board: string[], isOmaha: boolean): number {
  const all = [...hole, ...board];
  if (!isOmaha) {
    // Texas / Pineapple: best 5 from all available
    if (all.length < 5) return all.reduce((s, c) => s + RV[c[0]], 0);
    return Math.max(...combos(all, 5).map(eval5));
  } else {
    // Omaha: exactly 2 from hole + 3 from board
    if (hole.length < 2 || board.length < 3) return 0;
    let best = -1;
    for (const hc of combos(hole, 2)) {
      for (const bc of combos(board, 3)) {
        const s = eval5([...hc, ...bc]);
        if (s > best) best = s;
      }
    }
    return best;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface EquityResult {
  sessionToken: string;
  equity: number; // 0-100
}

export function useEquity(
  showdownCards: { sessionToken: string; cards: CardType[] }[] | null,
  communityCards: CardType[],
  variant: string,
): EquityResult[] {
  const [results, setResults] = useState<EquityResult[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!showdownCards || showdownCards.length < 2 || communityCards.length < 3) {
      setResults([]);
      return;
    }
    if (runningRef.current) return;
    runningRef.current = true;

    // Run in next tick to avoid blocking render
    const tid = setTimeout(() => {
      const isOmaha = variant === 'omaha' || variant === 'omaha-pl';
      const board5 = communityCards.slice(0, 5);
      const knownCards = new Set([
        ...showdownCards.flatMap(sc => sc.cards),
        ...board5,
      ]);

      // If all 5 board cards are known, we can compute exact equity
      // (simulate remaining board cards if < 5)
      const remaining = board5.length < 5
        ? RANKS.flatMap(r => SUITS.map(s => `${r}${s}`)).filter(c => !knownCards.has(c as CardType))
        : [];

      const N = board5.length === 5 ? 1 : 3000;
      const wins = new Array(showdownCards.length).fill(0);
      const ties = new Array(showdownCards.length).fill(0);

      for (let i = 0; i < N; i++) {
        let simBoard: string[];
        if (board5.length === 5) {
          simBoard = board5 as string[];
        } else {
          const extra = shuffle(remaining).slice(0, 5 - board5.length);
          simBoard = [...board5, ...extra] as string[];
        }

        const scores = showdownCards.map(sc =>
          bestHand(sc.cards as string[], simBoard, isOmaha)
        );
        const maxScore = Math.max(...scores);
        const winnerCount = scores.filter(s => s === maxScore).length;

        scores.forEach((s, idx) => {
          if (s === maxScore && winnerCount === 1) wins[idx]++;
          else if (s === maxScore) ties[idx]++;
        });
      }

      const equityResults: EquityResult[] = showdownCards.map((sc, idx) => ({
        sessionToken: sc.sessionToken,
        equity: Math.round((wins[idx] + ties[idx] * 0.5) / N * 100),
      }));

      setResults(equityResults);
      runningRef.current = false;
    }, 50);

    return () => {
      clearTimeout(tid);
      runningRef.current = false;
    };
  }, [showdownCards?.map(sc => sc.sessionToken).join(','), communityCards.length, variant]);

  return results;
}
