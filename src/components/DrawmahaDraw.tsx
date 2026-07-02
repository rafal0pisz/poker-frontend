'use client';

import { useEffect, useState } from 'react';
import type { DrawState } from '@/lib/types';

interface Props {
  discardCount: number;
  drawState: DrawState;
  mySessionToken: string;
  submitted: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export function DrawmahaDraw({
  discardCount,
  drawState,
  mySessionToken,
  submitted,
  onSubmit,
  onClear,
}: Props) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const totalPlayers = Object.keys(drawState.playerStates).length;
  const drawnPlayers = Object.values(drawState.playerStates).filter((s) => s.hasDrawn).length;
  const deadline = drawState.drawSubmitDeadline;

  // Countdown timer
  useEffect(() => {
    if (!deadline || submitted) {
      setTimeLeft(null);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [deadline, submitted]);

  const timerColor =
    timeLeft !== null && timeLeft <= 5
      ? 'text-red-400'
      : timeLeft !== null && timeLeft <= 10
      ? 'text-poker-coral'
      : 'text-poker-gold';

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold">
          🃏 Draw Phase
        </p>
        {/* Timer — always visible until submitted */}
        {timeLeft !== null && !submitted && (
          <div className="flex items-center gap-1.5">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="11"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2.5"
                />
                <circle cx="14" cy="14" r="11"
                  fill="none"
                  stroke={timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#ff8282' : 'rgb(var(--pk-gold-rgb))'}
                  strokeWidth="2.5"
                  strokeDasharray={`${(timeLeft / (deadline ? Math.ceil((deadline - Date.now() + timeLeft * 1000) / 1000) : 30)) * 69.1} 69.1`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.2s' }}
                />
              </svg>
              <span className={`text-[10px] font-bold ${timerColor}`}>{timeLeft}</span>
            </div>
          </div>
        )}
      </div>

      {!submitted ? (
        <>
          <p className="text-poker-yellow/60 text-xs text-center">
            Tap your cards above to mark for discard
          </p>
          <p className="text-center text-xs text-poker-yellow/50 min-h-[16px]">
            {discardCount === 0
              ? 'Stand pat — keep all cards'
              : `${discardCount} card${discardCount > 1 ? 's' : ''} selected`}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClear}
              disabled={discardCount === 0}
              className="bg-poker-yellow/10 text-poker-yellow text-sm py-2.5 rounded-lg active:scale-95 disabled:opacity-30"
            >
              Clear
            </button>
            <button
              onClick={onSubmit}
              className={`text-sm font-medium py-2.5 rounded-lg active:scale-95 ${
                timeLeft !== null && timeLeft <= 5
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-poker-gold text-poker-bg'
              }`}
            >
              {discardCount === 0 ? 'Stand Pat' : `Discard ${discardCount}`}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-2 text-poker-yellow/40 text-sm border border-poker-gold/10 rounded-lg">
          ✓ Submitted — waiting ({drawnPlayers}/{totalPlayers})
        </div>
      )}
    </div>
  );
}
