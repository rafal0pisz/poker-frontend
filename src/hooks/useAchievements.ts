'use client';

import { useCallback, useRef, useState } from 'react';
import type { HandResult, Player } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  color: 'gold' | 'blue' | 'green' | 'red' | 'purple';
}

// ─── Minimal hand evaluator (for bad beat equity at turn) ─────────────────────

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['s', 'h', 'd', 'c'];
const RV: Record<string, number> = Object.fromEntries(RANKS.map((r, i) => [r, i + 2]));
const ALL_CARDS = RANKS.flatMap((r) => SUITS.map((s) => r + s));

function combos(arr: string[], k: number): string[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  return [...combos(rest, k - 1).map((c) => [first, ...c]), ...combos(rest, k)];
}

function eval5(cards: string[]): number {
  const rv = cards.map((c) => RV[c[0]]);
  const suits = cards.map((c) => c[1]);
  const fl = suits.every((s) => s === suits[0]);
  const cnt: Record<number, number> = {};
  rv.forEach((r) => { cnt[r] = (cnt[r] || 0) + 1; });
  const groups = Object.entries(cnt)
    .map(([r, c]) => [parseInt(r), c] as [number, number])
    .sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const fr = groups.map((g) => g[1]);
  const sorted = rv.slice().sort((a, b) => b - a);
  const u = [...new Set(sorted)];
  const wheel = u.length === 5 && u[0] === 14 && u[4] === 2 && u[1] === 5;
  const st = u.length === 5 && (u[0] - u[4] === 4 || wheel);
  if (fl && st) return 8_000_000 + (wheel ? 5 : u[0]);
  if (fr[0] === 4) return 7_000_000 + groups[0][0] * 100 + (groups[1]?.[0] ?? 0);
  if (fr[0] === 3 && fr[1] === 2) return 6_000_000 + groups[0][0] * 100 + groups[1][0];
  if (fl) return 5_000_000 + sorted[0] * 1e4 + sorted[1] * 1e3 + sorted[2] * 1e2 + sorted[3] * 10 + sorted[4];
  if (st) return 4_000_000 + (wheel ? 5 : u[0]);
  if (fr[0] === 3) return 3_000_000 + groups[0][0] * 1e4 + (groups[1]?.[0] ?? 0) * 1e2 + (groups[2]?.[0] ?? 0);
  if (fr[0] === 2 && fr[1] === 2) return 2_000_000 + groups[0][0] * 1e4 + groups[1][0] * 1e2 + (groups[2]?.[0] ?? 0);
  if (fr[0] === 2) return 1_000_000 + groups[0][0] * 1e4 + (groups[1]?.[0] ?? 0) * 1e2 + (groups[2]?.[0] ?? 0) * 10 + (groups[3]?.[0] ?? 0);
  return sorted[0] * 1e4 + sorted[1] * 1e3 + sorted[2] * 1e2 + sorted[3] * 10 + sorted[4];
}

function bestScore(hole: string[], board: string[]): number {
  const all = [...hole, ...board];
  if (all.length < 5) return 0;
  return Math.max(...combos(all, 5).map(eval5));
}

/**
 * Calculates win equity for myHole against all opponents using a 4-card board,
 * simulating all possible river cards. Fast (~44 iterations).
 */
function calcTurnEquity(myHole: string[], oppHoles: string[][], turnBoard: string[]): number {
  if (oppHoles.length === 0 || turnBoard.length < 4) return 0;
  const known = new Set([...myHole, ...oppHoles.flat(), ...turnBoard]);
  const deck = ALL_CARDS.filter((c) => !known.has(c));
  if (deck.length === 0) return 0;
  let equity = 0;
  for (const river of deck) {
    const board5 = [...turnBoard, river];
    const myS = bestScore(myHole, board5);
    const maxOpp = Math.max(...oppHoles.map((h) => bestScore(h, board5)));
    if (myS > maxOpp) equity += 1;
    else if (myS === maxOpp) equity += 0.5;
  }
  return equity / deck.length;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface SessionStats {
  biggestPot: number;
  winStreak: number;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const statsRef = useRef<SessionStats>({ biggestPot: 0, winStreak: 0 });

  const dismiss = useCallback((id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const processResult = useCallback((result: HandResult, myToken: string, players: Player[]) => {
    const stats = statsRef.current;
    const found: Achievement[] = [];
    const hand = result.handNumber ?? Date.now();

    const iWon = result.winnings.some((w) => w.sessionToken === myToken);
    const isDrawmaha = result.variant === 'drawmaha' || result.variant === 'drawmaha-pl';
    const isHiLo = result.variant === 'omaha-hl';
    const isOmaha = ['omaha', 'omaha-pl', 'omaha5', 'omaha-hl'].includes(result.variant ?? '');

    // ── 1. CHOP ────────────────────────────────────────────────────────────
    // Genuine tie at showdown — not applicable to Drawmaha/HiLo (different split logic)
    if (!isDrawmaha && !isHiLo && result.winnings.length > 1 && result.showdownCards.length > 0) {
      const amounts = result.winnings.map((w) => w.amount);
      const avg = amounts.reduce((s, a) => s + a, 0) / amounts.length;
      const equal = amounts.every((a) => Math.abs(a - avg) <= 1);
      if (equal && iWon) {
        found.push({ id: `chop-${hand}`, icon: '🤝', title: 'Chop!', subtitle: 'Split pot — everyone tied', color: 'blue' });
      }
    }

    // ── 2. BIGGEST POT ────────────────────────────────────────────────────
    const pot = result.totalPot ?? result.winnings.reduce((s, w) => s + w.amount, 0);
    if (pot > stats.biggestPot) {
      stats.biggestPot = pot;
      if (iWon) {
        found.push({ id: `bigpot-${hand}`, icon: '🏅', title: 'Biggest pot of the session!', subtitle: `${pot} chips`, color: 'gold' });
      }
    }

    // ── 3. WIN STREAK ─────────────────────────────────────────────────────
    if (iWon) {
      stats.winStreak++;
      if (stats.winStreak === 3) {
        found.push({ id: `streak3-${hand}`, icon: '⚡', title: '3 wins in a row!', subtitle: "On a roll", color: 'blue' });
      } else if (stats.winStreak === 5) {
        found.push({ id: `streak5-${hand}`, icon: '⚡', title: '5 wins in a row!', subtitle: 'Unstoppable', color: 'purple' });
      }
    } else {
      stats.winStreak = 0;
    }

    // ── 4. ELIMINATOR ─────────────────────────────────────────────────────
    if (iWon && result.eliminatedTokens && result.eliminatedTokens.length > 0) {
      result.eliminatedTokens
        .filter((t) => t !== myToken)
        .forEach((eliminated) => {
          const nick = players.find((p) => p.sessionToken === eliminated)?.nick ?? 'Player';
          found.push({
            id: `eliminator-${hand}-${eliminated}`,
            icon: '🗡️',
            title: 'Eliminator!',
            subtitle: `${nick} is out`,
            color: 'red',
          });
        });
    }

    // ── 5. BAD BEAT ───────────────────────────────────────────────────────
    // Requires showdown with revealed cards and a full 5-card board
    const myEntry = result.showdownCards.find((sc) => sc.sessionToken === myToken);
    const board = result.boardCards ?? [];
    if (!iWon && myEntry && result.showdownCards.length >= 2 && board.length === 5) {
      const turnBoard = board.slice(0, 4);
      const oppCards = result.showdownCards
        .filter((sc) => sc.sessionToken !== myToken)
        .map((sc) => sc.cards as string[]);
      if (oppCards.length > 0 && oppCards.every((h) => h.length >= 2)) {
        try {
          const equity = calcTurnEquity(myEntry.cards as string[], oppCards, turnBoard);
          if (equity > 0.7) {
            found.push({
              id: `badbeat-${hand}`,
              icon: '🤡',
              title: 'Bad Beat!',
              subtitle: `You had ${Math.round(equity * 100)}% equity at the turn`,
              color: 'red',
            });
          }
        } catch {
          // ignore evaluation errors
        }
      }
    }

    if (found.length > 0) {
      setAchievements((prev) => [...prev, ...found]);
    }
  }, []);

  return { achievements, processResult, dismiss };
}
