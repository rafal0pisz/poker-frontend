'use client';

import type { Player, RunItTwiceResult } from '@/lib/types';
import { Card } from './Card';

interface Props {
  runItTwiceResult: RunItTwiceResult;
  players: Player[];
  handNumber?: number;
}

export function RunItTwiceResultBoards({ runItTwiceResult, players, handNumber }: Props) {
  const nick = (token: string) => players.find((p) => p.sessionToken === token)?.nick ?? '?';

  return (
    <div className="mt-3 bg-poker-gold/15 border border-poker-gold/40 rounded-lg p-2">
      {handNumber && (
        <p className="text-poker-gold/50 text-[10px] text-center mb-1">Hand #{handNumber}</p>
      )}
      <p className="text-poker-gold text-xs text-center mb-1.5">🎲 Run It Twice!</p>
      <div className="grid grid-cols-2 gap-2">
        {runItTwiceResult.boards.map((board, i) => (
          <div key={i} className="bg-poker-bg/30 border border-poker-gold/20 rounded px-2 py-1.5">
            <p className="text-poker-gold/70 text-[10px] text-center mb-1 uppercase tracking-wide">Board {i + 1}</p>
            <div className="flex justify-center gap-1 mb-1.5 flex-wrap">
              {board.communityCards.map((c, ci) => (
                <Card key={ci} card={c} size="sm" />
              ))}
            </div>
            <div className="space-y-0.5">
              {board.potBreakdown
                .filter((pot) => pot.amount > 0)
                .map((pot, pi) => (
                  <div key={pi}>
                    {board.potBreakdown.length > 1 && (
                      <p className="text-poker-gold/40 text-[9px] text-center">{pot.label}</p>
                    )}
                    {pot.winners.map((w, wi) => (
                      <p key={wi} className="text-poker-yellow text-[10px] text-center">
                        <span className="font-medium">{nick(w.sessionToken)}</span>
                        <span className="text-poker-gold"> +{w.amount}</span>
                        {w.handDescription && (
                          <span className="text-poker-yellow/50"> · {w.handDescription}</span>
                        )}
                      </p>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
