'use client';

import type { HandResult, Player, Card as CardType } from '@/lib/types';
import { Card, CardPlaceholder } from './Card';
import { RunItTwiceBoards } from './RunItTwiceBoards';

interface Props {
  result: HandResult;
  players: Player[];
  onBack: () => void;
}

function nickFor(result: HandResult, players: Player[], token: string): string {
  return result.playerStacks?.find((p) => p.sessionToken === token)?.nick
    ?? players.find((p) => p.sessionToken === token)?.nick
    ?? '?';
}

export function HandHistoryDetail({ result, players, onBack }: Props) {
  const winningSet = new Set<CardType>(result.winningCards ?? []);
  const winningSecondarySet = new Set<CardType>(result.winningCardsSecondary ?? []);
  const board = result.boardCards ?? [];

  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-poker-yellow/60 text-xs flex items-center gap-1">
        ← Back to history
      </button>

      <div className="text-center">
        <p className="text-poker-gold text-sm font-semibold">Hand #{result.handNumber ?? '?'}</p>
        <p className="text-poker-yellow/40 text-[10px] uppercase tracking-wider">{result.variant} · Pot {result.totalPot ?? 0}</p>
      </div>

      {result.runItTwiceResult ? (
        <div className="flex justify-center py-1">
          <RunItTwiceBoards
            boards={[result.runItTwiceResult.boards[0].communityCards, result.runItTwiceResult.boards[1].communityCards]}
            breakdowns={[result.runItTwiceResult.boards[0].potBreakdown, result.runItTwiceResult.boards[1].potBreakdown]}
            players={players}
          />
        </div>
      ) : (
        <div className="flex justify-center gap-1.5 py-1">
          {[0, 1, 2, 3, 4].map((i) =>
            board[i]
              ? <Card key={i} card={board[i]} size="sm" winning={winningSet.has(board[i])} winningSecondary={winningSecondarySet.has(board[i])} />
              : <CardPlaceholder key={i} size="sm" />
          )}
        </div>
      )}

      <div className="space-y-2">
        {result.showdownCards.length === 0 ? (
          <p className="text-poker-yellow/40 text-xs text-center">Won without a showdown</p>
        ) : (
          result.showdownCards.map((sc) => {
            const winning = result.winnings.find((w) => w.sessionToken === sc.sessionToken);
            return (
              <div key={sc.sessionToken} className="flex items-center justify-between gap-2 rounded-lg border border-poker-gold/15 bg-poker-yellow/5 px-2.5 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1 flex-shrink-0">
                    {sc.cards.map((c, i) => (
                      <Card key={i} card={c} size="xs" winning={winningSet.has(c)} winningSecondary={winningSecondarySet.has(c)} />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="text-poker-yellow text-xs font-medium truncate">{nickFor(result, players, sc.sessionToken)}</p>
                    <p className="text-poker-yellow/40 text-[10px] truncate">{sc.handName}</p>
                  </div>
                </div>
                {winning && (
                  <span className="text-green-400 text-xs font-semibold flex-shrink-0">
                    +{winning.netAmount !== undefined ? winning.netAmount : winning.amount}
                  </span>
                )}
              </div>
            );
          })
        )}
        {/* Winners with no showdown cards recorded (e.g. everyone else folded) */}
        {result.winnings
          .filter((w) => !result.showdownCards.some((sc) => sc.sessionToken === w.sessionToken))
          .map((w) => (
            <div key={w.sessionToken} className="flex items-center justify-between gap-2 rounded-lg border border-poker-gold/15 bg-poker-yellow/5 px-2.5 py-2">
              <p className="text-poker-yellow text-xs font-medium">{nickFor(result, players, w.sessionToken)}</p>
              <span className="text-green-400 text-xs font-semibold">+{w.netAmount !== undefined ? w.netAmount : w.amount}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
