'use client';

import { memo, useEffect, useState } from 'react';
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
  winningCardsSecondary?: Set<CardType>;
  cardCount?: number;
  actionDeadline?: number | null;
  actionTimeoutSec?: number;
  revealedCards?: CardType[];
  equity?: number;
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

// SVG ring timer — animates circumference as time runs out
function TimerRing({ deadline, timeoutSec }: { deadline: number; timeoutSec: number }) {
  const [progress, setProgress] = useState(1); // 1 = full, 0 = empty

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, deadline - Date.now());
      setProgress(remaining / (timeoutSec * 1000));
    };
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [deadline, timeoutSec]);

  // Avatar circle: w=48 h=48, ring r=23, circumference = 2π*23 ≈ 144.5
  const R = 23;
  const CIRC = 2 * Math.PI * R;
  const dash = progress * CIRC;
  const color = progress > 0.4 ? 'rgb(var(--pk-gold-rgb))' : progress > 0.2 ? '#e07b39' : '#e05050';

  return (
    <svg
      width="48" height="48" viewBox="0 0 48 48"
      style={{ position: 'absolute', top: '-3px', left: '-3px', pointerEvents: 'none' }}
    >
      {/* Background track */}
      <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(var(--pk-gold-rgb),0.12)" strokeWidth="3" />
      {/* Progress arc */}
      <circle
        cx="24" cy="24" r={R}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${dash} ${CIRC - dash}`}
        strokeDashoffset={CIRC / 4} // start at top
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.1s linear, stroke 0.3s' }}
      />
    </svg>
  );
}

export const PlayerSeat = memo(function PlayerSeat({
  player,
  isCurrent,
  isDealer,
  isSb,
  isBb,
  isYou,
  lastMessage,
  handName,
  winningCards,
  winningCardsSecondary,
  cardCount = 2,
  actionDeadline,
  actionTimeoutSec = 30,
  revealedCards,
  equity,
}: Props) {
  const dimmed =
    player.status === 'folded' ||
    player.status === 'sitting-out' ||
    player.status === 'disconnected' ||
    player.status === 'spectator';

  const playerRevealedCards = player.holeCards || [];
  // Also show cards revealed via Show Hand button
  const shownCards = revealedCards || playerRevealedCards;
  const hasRevealedCards = shownCards.length > 0;
  const isShowHandReveal = !!(revealedCards && revealedCards.length > 0 && playerRevealedCards.length === 0);
  const useSmallGap = cardCount >= 4 || (shownCards.length >= 4);

  // Show timer ring only for non-self active players
  const showRing = isCurrent && !isYou && !!actionDeadline;

  return (
    <div className={`relative flex flex-col items-center ${dimmed ? 'opacity-50' : ''}`}>
      <FloatingBubble message={lastMessage || null} position="above" />

      {/* Hole cards */}
      {hasRevealedCards ? (
        <div className={`flex mb-1 ${useSmallGap ? '-space-x-1.5' : 'gap-0.5'}`}>
          {shownCards.map((c, i) => (
            <Card key={`${c}-${i}`} card={c} size="sm" winning={!!winningCards?.has(c)} winningSecondary={!!winningCardsSecondary?.has(c)} />
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

      {/* Avatar + badges */}
      <div className="relative flex items-center justify-center">
        {/* SB badge — left */}
        {isSb && (
          <span className="absolute -left-5 bottom-0 bg-blue-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            SB
          </span>
        )}

        {/* Avatar circle wrapper (relative so SVG ring can overlay) */}
        <div style={{ position: 'relative', width: 42, height: 42 }}>
          {/* Timer ring SVG — behind avatar visually but layered via z */}
          {showRing && (
            <TimerRing deadline={actionDeadline!} timeoutSec={actionTimeoutSec} />
          )}

          <div
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-sm font-medium ${
              isCurrent
                ? 'bg-poker-gold/25 border-2 border-poker-gold text-poker-gold animate-pulse'
                : isYou
                ? 'bg-poker-yellow/20 border-2 border-poker-yellow text-poker-yellow'
                : 'bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow'
            }`}
          >
            {player.nick.slice(0, 2).toUpperCase()}
          </div>
          {equity !== undefined && (
            <div style={{
              position: 'absolute',
              bottom: -6,
              right: -8,
              background: equity >= 50 ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
              border: `1px solid ${equity >= 50 ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'}`,
              borderRadius: 6,
              padding: '1px 5px',
              fontSize: 9,
              fontWeight: 700,
              color: equity >= 50 ? '#4ade80' : '#f87171',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}>
              {equity}%
            </div>
          )}
        </div>

        {/* D badge — right */}
        {isDealer && (
          <span className="absolute -right-5 bottom-0 bg-poker-gold text-poker-bg text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            D
          </span>
        )}

        {/* BB badge — right (when not dealer) */}
        {isBb && !isDealer && (
          <span className="absolute -right-5 bottom-0 bg-purple-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            BB
          </span>
        )}

        {/* BB + Dealer edge case */}
        {isBb && isDealer && (
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-purple-400 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
            BB
          </span>
        )}
      </div>

      {/* "Showed hand" label */}
      {isShowHandReveal && (
        <p className="text-[9px] text-poker-gold/50 mt-0.5">showed hand</p>
      )}

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
});
