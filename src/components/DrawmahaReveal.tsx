'use client';

import { useEffect, useState } from 'react';
import type { Card as CardType, DrawState, Player } from '@/lib/types';
import { Card } from './Card';

interface Props {
  drawState: DrawState;
  mySessionToken: string;
  myPlayer: Player;
  players: Player[];
  onDecide: (accept: boolean) => void;
}

export function DrawmahaReveal({ drawState, mySessionToken, myPlayer, players, onDecide }: Props) {
  const [decided, setDecided] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const myDrawState = drawState.playerStates[mySessionToken];
  const isMyTurn = drawState.currentDecidingSeat === myPlayer.seat;
  const alreadyDecided = myDrawState?.hasDecided ?? false;

  // Countdown timer
  useEffect(() => {
    if (!isMyTurn || alreadyDecided || decided) return;
    const deadline = drawState.decideDeadline;
    if (!deadline) return;

    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [isMyTurn, alreadyDecided, decided, drawState.decideDeadline]);

  const handleDecide = (accept: boolean) => {
    if (decided || alreadyDecided) return;
    setDecided(true);
    onDecide(accept);
  };

  const currentDecidingPlayer = players.find((p) => p.seat === drawState.currentDecidingSeat);
  const openCard: CardType | undefined = currentDecidingPlayer
    ? drawState.openCards[currentDecidingPlayer.sessionToken]
    : undefined;

  const totalPlayers = Object.keys(drawState.playerStates).length;
  const decidedCount = Object.values(drawState.playerStates).filter((s) => s.hasDecided).length;

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-3">
      {/* Header */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold mb-0.5">
          ✨ Reveal Phase
        </p>
        <p className="text-poker-yellow/60 text-xs">
          {decidedCount}/{totalPlayers} decided
        </p>
      </div>

      {openCard && currentDecidingPlayer ? (
        <>
          <div className="flex flex-col items-center gap-2">
            <p className="text-poker-yellow/50 text-[10px] uppercase tracking-wider">
              {currentDecidingPlayer.nick}&apos;s open card
            </p>

            {/* Card with glow */}
            <div className="relative">
              <div className="absolute inset-0 rounded-md bg-poker-gold/30 blur-lg animate-pulse" />
              <div className="relative ring-2 ring-poker-gold/70 rounded-md">
                <Card card={openCard} size="lg" />
              </div>
            </div>
          </div>

          {/* My turn to decide */}
          {isMyTurn && !alreadyDecided && !decided ? (
            <div className="space-y-2">
              {/* Timer */}
              <div className="flex items-center justify-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={timeLeft <= 5 ? '#f87171' : '#d4af37'}
                      strokeWidth="2.5"
                      strokeDasharray={`${(timeLeft / 15) * 100} 100`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 0.2s' }}
                    />
                  </svg>
                  <span className={`text-xs font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-poker-gold'}`}>
                    {timeLeft}
                  </span>
                </div>
                <p className="text-poker-yellow text-sm">Accept this card?</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDecide(true)}
                  className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95"
                >
                  ✓ Take this card
                </button>
                <button
                  onClick={() => handleDecide(false)}
                  className="bg-poker-coral/20 border border-poker-coral/50 text-poker-coral py-2.5 rounded-lg text-xs active:scale-95"
                >
                  ✗ Reject — draw blind card instead
                </button>
              </div>
            </div>
          ) : isMyTurn && (alreadyDecided || decided) ? (
            <p className="text-center text-poker-yellow/40 text-sm">Decision submitted ✓</p>
          ) : (
            <div className="text-center space-y-1">
              <p className="text-poker-yellow/60 text-sm">
                Waiting for <span className="text-poker-yellow font-medium">{currentDecidingPlayer.nick}</span>…
              </p>
              {drawState.decideDeadline && (
                <p className="text-poker-gold/60 text-xs">
                  {timeLeft}s remaining
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-poker-yellow/40 text-sm py-2">
          Preparing open cards…
        </p>
      )}

      {/* Player progress pills */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {players
          .filter((p) => drawState.playerStates[p.sessionToken])
          .map((p) => {
            const ps = drawState.playerStates[p.sessionToken];
            const isDeciding = drawState.currentDecidingSeat === p.seat;
            // Player with no open card (discarded 0 or 2+) — auto-skipped
            const noReveal = ps.hasDecided && ps.revealedCard === null;
            return (
              <span
                key={p.sessionToken}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                  noReveal
                    ? 'border-white/10 text-poker-yellow/40'
                    : ps.hasDecided
                    ? 'border-poker-gold/40 text-poker-gold bg-poker-gold/10'
                    : isDeciding
                    ? 'border-poker-gold/70 text-poker-yellow bg-poker-gold/15 animate-pulse'
                    : 'border-white/10 text-poker-yellow/30'
                }`}
              >
                {p.nick}{' '}
                {noReveal ? '—' : ps.hasDecided ? (ps.accepted ? '✓' : '✗') : isDeciding ? '⏳' : '…'}
              </span>
            );
          })}
      </div>
    </div>
  );
}
