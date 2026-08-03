// Blind-level presets for tournament creation — mirrors
// poker-backend/src/tournament.ts BLIND_LEVEL_PRESETS exactly. Duplicated
// (not shared) because frontend and backend are separate deployments, same
// pattern already used for GameVariant/isDrawmahaVariant.
import type { BlindLevel } from './types';

function buildLevels(durationSec: number, blinds: [number, number][]): BlindLevel[] {
  return blinds.map(([sb, bb], i) => ({ level: i + 1, smallBlind: sb, bigBlind: bb, durationSec }));
}

export const BLIND_LEVEL_PRESETS: Record<'turbo' | 'standard' | 'deep', { label: string; levels: BlindLevel[] }> = {
  turbo: {
    label: 'Turbo · 8 min/level',
    levels: buildLevels(480, [
      [10, 20], [15, 30], [25, 50], [50, 100], [75, 150], [100, 200], [150, 300],
      [200, 400], [300, 600], [400, 800], [500, 1000], [750, 1500], [1000, 2000],
    ]),
  },
  standard: {
    label: 'Standard · 15 min/level',
    levels: buildLevels(900, [
      [10, 20], [15, 30], [25, 50], [50, 100], [75, 150], [100, 200], [150, 300],
      [200, 400], [300, 600], [400, 800], [500, 1000], [750, 1500], [1000, 2000],
    ]),
  },
  deep: {
    label: 'Deep · 25 min/level',
    levels: buildLevels(1500, [
      [5, 10], [10, 20], [15, 30], [25, 50], [50, 100], [75, 150], [100, 200],
      [150, 300], [200, 400], [300, 600], [400, 800], [500, 1000], [750, 1500],
    ]),
  },
};

// Rescales a preset's whole schedule so level 1 starts at the chosen small
// blind, keeping each level's relative progression (2x/2.5x/etc.) intact.
// Big blind is always recomputed as 2x the scaled small blind rather than
// scaled independently, so every level stays valid (backend requires
// bigBlind >= smallBlind * 2) regardless of rounding.
export function scaleBlindLevels(levels: BlindLevel[], startingSmallBlind: number): BlindLevel[] {
  const baseSmallBlind = levels[0]?.smallBlind || 1;
  const scale = startingSmallBlind / baseSmallBlind;
  return levels.map((l) => {
    const smallBlind = Math.max(1, Math.round(l.smallBlind * scale));
    return { ...l, smallBlind, bigBlind: smallBlind * 2 };
  });
}
