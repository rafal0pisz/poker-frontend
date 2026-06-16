'use client';

import { useState, useEffect } from 'react';
import type { Card as CardType } from '@/lib/types';

const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const SUITS = ['s','h','d','c'];
const RV: Record<string, number> = Object.fromEntries(RANKS.map((r, i) => [r, i + 2]));

/**
 * Evaluates a 5-card poker hand. Returns a numeric score where higher = better.
 *
 * Key fix from previous version: grouped ranks by COUNT first (pairs/trips/quads),
 * then by rank value within the count tier. This ensures e.g. AAAA+2 > 2222+A,
 * which the old version got wrong (both scored identically).
 */
function eval5(cards: string[]): number {
  const rv = cards.map(c => RV[c[0]]);
  const suits = cards.map(c => c[1]);
  const fl = suits.every(s => s === suits[0]);

  // Count occurrences of each rank
  const cnt: Record<number, number> = {};
  rv.forEach(r => { cnt[r] = (cnt[r] || 0) + 1; });

  // Group [rank, count] sorted by count DESC, then by rank DESC.
  // groups[0] = the most numerous rank (e.g. quad rank, or trip rank, or top pair).
  // For two pair, groups[0]=higher pair, groups[1]=lower pair, groups[2]=kicker.
  const groups: Array<[number, number]> = Object.entries(cnt)
    .map(([r, c]) => [parseInt(r, 10), c] as [number, number])
    .sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const fr = groups.map(g => g[1]);

  const sortedRanks = rv.slice().sort((a, b) => b - a);
  const u = [...new Set(sortedRanks)];
  const isWheel = u.length === 5 && u[0] === 14 && u[1] === 5 && u[4] === 2;
  const st = u.length === 5 && (u[0] - u[4] === 4 || isWheel);

  if (fl && st) return 8_000_000 + (isWheel ? 5 : u[0]);
  if (fr[0] === 4) {
    // Quad rank * 100 + kicker
    const kicker = groups[1] ? groups[1][0] : 0;
    return 7_000_000 + groups[0][0] * 100 + kicker;
  }
  if (fr[0] === 3 && fr[1] === 2) {
    // Full house: trip rank * 100 + pair rank
    return 6_000_000 + groups[0][0] * 100 + groups[1][0];
  }
  if (fl) {
    // Flush: all 5 ranks high-to-low
    return 5_000_000 + sortedRanks[0]*1e4 + sortedRanks[1]*1e3 + sortedRanks[2]*1e2 + sortedRanks[3]*10 + sortedRanks[4];
  }
  if (st) return 4_000_000 + (isWheel ? 5 : u[0]);
  if (fr[0] === 3) {
    // Trips: trip_rank * 1e4 + kicker1 * 1e2 + kicker2
    const k1 = groups[1] ? groups[1][0] : 0;
    const k2 = groups[2] ? groups[2][0] : 0;
    return 3_000_000 + groups[0][0] * 1e4 + k1 * 1e2 + k2;
  }
  if (fr[0] === 2 && fr[1] === 2) {
    // Two pair: high_pair * 1e4 + low_pair * 1e2 + kicker
    // groups already sorted by rank within same count, so groups[0]=high pair, groups[1]=low pair
    const kicker = groups[2] ? groups[2][0] : 0;
    return 2_000_000 + groups[0][0] * 1e4 + groups[1][0] * 1e2 + kicker;
  }
  if (fr[0] === 2) {
    // One pair: pair * 1e4 + k1 * 1e2 + k2 * 10 + k3
    const k1 = groups[1] ? groups[1][0] : 0;
    const k2 = groups[2] ? groups[2][0] : 0;
    const k3 = groups[3] ? groups[3][0] : 0;
    return 1_000_000 + groups[0][0] * 1e4 + k1 * 1e2 + k2 * 10 + k3;
  }
  // High card
  return sortedRanks[0]*1e4 + sortedRanks[1]*1e3 + sortedRanks[2]*1e2 + sortedRanks[3]*10 + sortedRanks[4];
}

function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  return [
    ...combos(rest, k - 1).map(c => [first, ...c]),
    ...combos(rest, k),
  ];
}

function bestHand(hole: string[], board: string[], isOmaha: boolean): number {
  if (!isOmaha) {
    // Texas: any 5 of 7 cards
    const all = [...hole, ...board];
    if (all.length < 5) return all.reduce((s,c) => s + RV[c[0]], 0);
    return Math.max(...combos(all, 5).map(eval5));
  }
  // Omaha: must use EXACTLY 2 hole + 3 board
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

export interface EquityResult {
  sessionToken: string;
  equity: number;
}

export function useEquity(
  players: { sessionToken: string; cards: CardType[] }[] | null,
  communityCards: CardType[],
  variant: string,
): EquityResult[] {
  const [results, setResults] = useState<EquityResult[]>([]);

  // Drawmaha has split pot (Omaha half + Draw half) — equity is meaningless
  // as a single number. Skip entirely to avoid confusion.
  const isDrawmaha = variant === 'drawmaha' || variant === 'drawmaha-pl';

  const playerKey = players?.map(p => `${p.sessionToken}:${p.cards.join(',')}`).join('|') ?? '';
  const boardKey = communityCards.join(',');

  useEffect(() => {
    if (isDrawmaha || !players || players.length < 2) {
      setResults([]);
      return;
    }
    if (communityCards.length < 3) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const tid = setTimeout(() => {
      if (cancelled) return;

      const isOmaha = variant === 'omaha' || variant === 'omaha-pl';
      const board = communityCards as string[];
      const knownCards = new Set([
        ...players.flatMap(p => p.cards as string[]),
        ...board,
      ]);
      const deck = RANKS.flatMap(r => SUITS.map(s => `${r}${s}`)).filter(c => !knownCards.has(c));

      const N = board.length === 5 ? 1 : 2000;
      // Track equity directly (split ties properly among tied winners)
      const equityShares = new Array(players.length).fill(0);

      for (let i = 0; i < N; i++) {
        const simBoard = board.length === 5
          ? board
          : [...board, ...shuffle(deck).slice(0, 5 - board.length)];

        const scores = players.map(p => bestHand(p.cards as string[], simBoard, isOmaha));
        const maxScore = Math.max(...scores);
        const winnerCount = scores.filter(s => s === maxScore).length;
        // Each winner gets 1/winnerCount of this simulation
        // (single winner = 1.0, 2-way tie = 0.5 each, 3-way tie = 0.333 each, etc.)
        const sharePerWinner = 1 / winnerCount;

        scores.forEach((s, idx) => {
          if (s === maxScore) equityShares[idx] += sharePerWinner;
        });
      }

      if (!cancelled) {
        setResults(players.map((p, idx) => ({
          sessionToken: p.sessionToken,
          equity: Math.round((equityShares[idx] / N) * 100),
        })));
      }
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerKey, boardKey, variant, isDrawmaha]);

  return results;
}
