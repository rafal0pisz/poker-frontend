'use client';

import type { Player, PlayerStatus, ChatMessage } from '@/lib/types';
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
}

const STATUS_LABEL: Record<PlayerStatus, string> = {
  playing: '',
  folded: 'FOLD',
  'all-in': 'ALL-IN',
  'sitting-out': 'AFK',
  waiting: 'WAITING',
  'no-chips': 'NO CHIPS',
  disconnected: 'OFFLINE',
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
}: Props) {
  const dimmed = player.status === 'folded' || player.status === 'sitting-out' || player.status === 'disconnected';

  const hasRevealedCards = !!player.holeCards && player.holeCards.length === 2;

  return (
    <div className={`relative flex flex-col items-center ${dimmed ? 'opacity-50' : ''}`}>
      {/* Floating chat bubble */}
      <FloatingBubble message={lastMessage || null} position="above" />

      {/* Cards: revealed OR facedown OR none */}
      {hasRevealedCards ? (
        <div className="flex gap-0.5 mb-1">
          <Card card={player.holeCards![0]} size="sm" />
          <Card card={player.holeCards![1]} size="sm" />
        </div>
      ) : player.status === 'playing' || player.status === 'all-in' || player.status === 'folded' ? (
        <div className="flex gap-0.5 mb-1">
          <Card size="sm" facedown />
          <Card size="sm" facedown />
        </div>
      ) : (
        <div className="h-12 mb-1" />
      )}

      <div
        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
          isCurrent
            ? 'bg-poker-gold/25 border-2 border-poker-gold text-poker-gold animate-pulse'
            : isYou
            ? 'bg-poker-yellow/20 border-2 border-poker-yellow text-poker-yellow'
            : 'bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow'
        }`}
      >
        {player.nick.slice(0, 2).toUpperCase()}

        {isDealer && (
          <span className="absolute -bottom-1 -right-1 bg-poker-gold text-poker-bg text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            D
          </span>
        )}
        {isSb && (
          <span className="absolute -bottom-1 -right-1 bg-blue-400 text-poker-bg text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            SB
          </span>
        )}
        {isBb && (
          <span className="absolute -bottom-1 -right-1 bg-purple-400 text-poker-bg text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            BB
          </span>
        )}
      </div>

      <div className="text-center mt-1">
        <p className="text-xs text-poker-yellow truncate max-w-[80px]">{player.nick}</p>
        <p className="text-[10px] text-poker-yellow/60">{player.chips}</p>
      </div>

      {/* Hand name at showdown */}
      {handName && hasRevealedCards && (
        <div className="mt-0.5 bg-poker-gold/15 border border-poker-gold/30 px-2 py-0.5 rounded text-[9px] text-poker-gold font-medium max-w-[90px] truncate">
          {handName}
        </div>
      )}

      {STATUS_LABEL[player.status] && (
        <div className="absolute -top-1 -right-1 bg-poker-bg-light px-1.5 py-0.5 rounded text-[9px] text-poker-yellow/70 border border-poker-gold/20">
          {STATUS_LABEL[player.status]}
        </div>
      )}

      {player.currentBet > 0 && (
        <div className="mt-1 bg-poker-gold/20 border border-poker-gold/30 px-2 py-0.5 rounded-full text-[10px] text-poker-yellow font-medium">
          {player.currentBet}
        </div>
      )}
    </div>
  );
}
