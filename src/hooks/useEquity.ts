'use client';

import { useState, useEffect } from 'react';
import type { Card as CardType } from '@/lib/types';

const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
const SUITS = ['s','h','d','c'];
const RV: Record<string, number> = Object.fromEntries(RANKS.map((r, i) => [r, i + 2]));

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
  if (fl) return 5e6 + rv[0]*1e4 + rv[1]*1e3 + rv[2]*1e2 + rv[3]*10 + rv[4];
  if (st) return 4e6 + (isWheel ? 5 : u[0]);
  if (fr[0] === 3) return 3e6 + rv[0]*1e4 + rv[3]*1e2 + rv[4];
  if (fr[0] === 2 && fr[1] === 2) return 2e6 + rv[0]*1e4 + rv[2]*1e2 + rv[4];
  if (fr[0] === 2) return 1e6 + rv[0]*1e4 + rv[2]*1e2 + rv[3]*10 + rv[4];
  return rv[0]*1e4 + rv[1]*1e3 + rv[2]*1e2 + rv[3]*10 + rv[4];
}

function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k === arr.length) return [arr];
  const [f, ...r] = arr;
  return [...combos(r, k-1).map(c => [f,...c]), ...combos(r, k)];
}

function bestHand(hole: string[], board: string[], isOmaha: boolean): number {
  const all = [...hole, ...board];
  if (!isOmaha) {
    if (all.length < 5) return all.reduce((s,c) => s + RV[c[0]], 0);
    return Math.max(...combos(all, 5).map(eval5));
  }
  if (hole.length < 2 || board.length < 3) return 0;
  let best = -1;
  for (const hc of combos(hole, 2)) {
    for (const bc of combos(board, 3)) {
      const s = eval5([...hc,...bc]);
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

  // Stable key: who is playing + how many board cards
  const playerKey = players?.map(p => `${p.sessionToken}:${p.cards.join(',')}`).join('|') ?? '';
  const boardKey = communityCards.join(',');

  useEffect(() => {
    // Clear when no players
    if (!players || players.length < 2) {
      setResults([]);
      return;
    }
    // Need at least flop to calculate
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
      const wins = new Array(players.length).fill(0);
      const ties = new Array(players.length).fill(0);

      for (let i = 0; i < N; i++) {
        const simBoard = board.length === 5
          ? board
          : [...board, ...shuffle(deck).slice(0, 5 - board.length)];

        const scores = players.map(p => bestHand(p.cards as string[], simBoard, isOmaha));
        const maxScore = Math.max(...scores);
        const winnerCount = scores.filter(s => s === maxScore).length;

        scores.forEach((s, idx) => {
          if (s === maxScore && winnerCount === 1) wins[idx]++;
          else if (s === maxScore) ties[idx]++;
        });
      }

      if (!cancelled) {
        setResults(players.map((p, idx) => ({
          sessionToken: p.sessionToken,
          equity: Math.round((wins[idx] + ties[idx] * 0.5) / N * 100),
        })));
      }
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerKey, boardKey, variant]);

  return results;
}
