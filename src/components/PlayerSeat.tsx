'use client';

import type { Player, PlayerStatus, ChatMessage, Card as CardType } from '@/lib/types';
import { Card } from './Card';
import { FloatingBubble } from './FloatingBubble';

interface Props {
  player: Player;
  isCurrent: boolean;
  isDealer: boolean;
  isSb: boolean;
  isBb: boolean;
  isYou: boolean;
  lastMessage?: ChatMessage | null;
  handName?: string;
  winningCards?: Set<CardType>;
  cardCount?: number;
}

const STATUS_LABEL: Record<PlayerStatus, string> = {
  playing: '',
  folded: 'FOLD',
  'all-in': 'ALL-IN',
  'sitting-out': 'AFK',
  waiting: 'WAITING',
  'no-chips': 'NO CHIPS',
  disconnected: 'OFFLINE',
  spectator: 'SPECTATOR',
};

export function PlayerSeat({
  player,
  isCurrent,
  isDealer,
  isSb,
  isBb,
  isYou,
  lastMessage,
  handName,
  winningCards,
  cardCount = 2,
}: Props) {
  const dimmed =
    player.status === 'folded' ||
    player.status === 'sitting-out' ||
    player.status === 'disconnected' ||
    player.status === 'spectator';

  const revealedCards = player.holeCards || [];
  const hasRevealedCards = revealedCards.length > 0;
  const useSmallGap = cardCount >= 4 || revealedCards.length >= 4;

  return (
    <div className={`relative flex flex-col items-center ${dimmed ? 'opacity-50' : ''}`}>
      <FloatingBubble message={lastMessage || null} position="above" />

      {/* Hole cards */}
      {hasRevealedCards ? (
        <div className={`flex mb-1 ${useSmallGap ? '-space-x-1.5' : 'gap-0.5'}`}>
          {revealedCards.map((c, i) => (
            <Card key={`${c}-${i}`} card={c} size="sm" winning={!!winningCards?.has(c)} />
          ))}
        </div>
      ) : player.status === 'playing' || player.status === 'all-in' || player.status === 'folded' ? (
        <div className={`flex mb-1 ${useSmallGap ? '-space-x-1.5' : 'gap-0.5'}`}>
          {Array.from({ length: cardCount }).map((_, i) => (
            <Card key={i} size="sm" facedown />
          ))}
        </div>
      ) : (
        <div className="h-12 mb-1" />
      )}

      {/* Avatar + position badges row */}
      <div className="relative flex items-center justify-center">
        {/* SB badge — left of avatar */}
        {isSb && !isDealer && (
          <span className="absolute -left-5 bottom-0 bg-blue-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            SB
          </span>
        )}

        {/* Avatar circle */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
            isCurrent
              ? 'bg-poker-gold/25 border-2 border-poker-gold text-poker-gold animate-pulse'
              : isYou
              ? 'bg-poker-yellow/20 border-2 border-poker-yellow text-poker-yellow'
              : 'bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow'
          }`}
        >
          {player.nick.slice(0, 2).toUpperCase()}
        </div>

        {/* D badge — right of avatar */}
        {isDealer && (
          <span className="absolute -right-5 bottom-0 bg-poker-gold text-poker-bg text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            D
          </span>
        )}

        {/* BB badge — right of avatar (when not also dealer) */}
        {isBb && !isDealer && (
          <span className="absolute -right-5 bottom-0 bg-purple-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            BB
          </span>
        )}

        {/* BB badge when also dealer (below avatar) */}
        {isBb && isDealer && (
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-purple-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            BB
          </span>
        )}
      </div>

      {/* Name & chips */}
      <div className="text-center mt-1">
        <p className="text-xs text-poker-yellow truncate max-w-[80px]">{player.nick}</p>
        <p className="text-[10px] text-poker-yellow/60">{player.chips}</p>
      </div>

      {/* Showdown hand name */}
      {handName && hasRevealedCards && (
        <div className="mt-0.5 bg-poker-gold/15 border border-poker-gold/30 px-2 py-0.5 rounded text-[9px] text-poker-gold font-medium max-w-[90px] truncate">
          {handName}
        </div>
      )}

      {/* Status badge */}
      {STATUS_LABEL[player.status] && (
        <div className="absolute -top-1 -right-1 bg-poker-bg-light px-1.5 py-0.5 rounded text-[9px] text-poker-yellow/70 border border-poker-gold/20">
          {STATUS_LABEL[player.status]}
        </div>
      )}

      {/* Current bet */}
      {player.currentBet > 0 && (
        <div className="mt-1 bg-poker-gold/20 border border-poker-gold/30 px-2 py-0.5 rounded-full text-[10px] text-poker-yellow font-medium">
          {player.currentBet}
        </div>
      )}
    </div>
  );
}
