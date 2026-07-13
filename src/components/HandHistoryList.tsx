'use client';

import type { HandResult, Player } from '@/lib/types';

interface Props {
  handHistory: HandResult[];
  players: Player[];
  mySessionToken: string;
  onSelect: (result: HandResult) => void;
}

const VARIANT_SHORT: Record<string, string> = {
  texas: "Hold'em",
  omaha: 'Omaha',
  'omaha-pl': 'Omaha PL',
  omaha5: 'Omaha-5',
  'omaha-hl': 'Omaha Hi-Lo',
  drawmaha: 'Drawmaha',
  'drawmaha-pl': 'Drawmaha PL',
  pineapple: 'Pineapple',
  'pineapple-classic': 'Pineapple Classic',
};

function nickFor(result: HandResult, players: Player[], token: string): string {
  return result.playerStacks?.find((p) => p.sessionToken === token)?.nick
    ?? players.find((p) => p.sessionToken === token)?.nick
    ?? '?';
}

export function HandHistoryList({ handHistory, players, mySessionToken, onSelect }: Props) {
  if (handHistory.length === 0) {
    return <p className="text-poker-yellow/40 text-xs text-center mt-6">No hands played yet this session</p>;
  }

  // Most recently played first
  const ordered = [...handHistory].reverse();

  return (
    <div className="space-y-1.5">
      {ordered.map((result, i) => {
        const iWasIn = !!result.playerStacks?.some((p) => p.sessionToken === mySessionToken);
        const myWinning = result.winnings.find((w) => w.sessionToken === mySessionToken);
        const summary = result.winnings
          .map((w) => `${nickFor(result, players, w.sessionToken)} +${w.netAmount ?? w.amount}`)
          .join(', ');
        return (
          <button
            key={`${result.handNumber ?? i}-${i}`}
            onClick={() => onSelect(result)}
            className={`w-full text-left rounded-lg border px-2.5 py-2 transition active:scale-[0.98] ${
              iWasIn ? 'border-poker-gold/20 bg-poker-yellow/5' : 'border-poker-gold/10 bg-transparent opacity-70'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-poker-yellow text-xs font-medium truncate">
                Hand #{result.handNumber ?? '?'} · {VARIANT_SHORT[result.variant ?? 'texas'] ?? result.variant}
              </span>
              <span className="text-poker-gold text-xs font-semibold flex-shrink-0">Pot {result.totalPot ?? 0}</span>
            </div>
            <p className="text-poker-yellow/50 text-[10.5px] truncate mt-0.5">
              {summary || 'No showdown'}
              {myWinning && <span className="text-green-400 ml-1">· you {myWinning.netAmount !== undefined ? (myWinning.netAmount >= 0 ? '+' : '') + myWinning.netAmount : `+${myWinning.amount}`}</span>}
            </p>
          </button>
        );
      })}
    </div>
  );
}
