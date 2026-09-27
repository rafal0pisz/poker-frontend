'use client';

import { useEffect, useState } from 'react';
import type { FiveCardDrawState } from '@/lib/types';

// The submit/status half of five-card-draw's discard round — pairs with the
// existing (Drawmaha-built, but fully generic) DrawCardsDisplay for the
// card-picking grid. Deliberately its own small component rather than
// reusing DrawmahaDraw: that component reads DrawState fields (hasDrawn,
// drawSubmitDeadline) that don't exist on FiveCardDrawState, and there's no
// reveal/accept-reject step here to make room for.
interface Props {
  discardCount: number;
  drawState: FiveCardDrawState;
  submitted: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export function FiveCardDrawSubmit({ discardCount, drawState, submitted, onSubmit, onClear }: Props) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const totalPlayers = Object.keys(drawState.playerStates).length;
  const discardedPlayers = Object.values(drawState.playerStates).filter((s) => s.hasDiscarded).length;
  const deadline = drawState.discardDeadline;

  useEffect(() => {
    if (!deadline || submitted) {
      setTimeLeft(null);
      return;
    }
    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [deadline, submitted]);

  const timerColor =
    timeLeft !== null && timeLeft <= 5 ? 'text-red-400'
      : timeLeft !== null && timeLeft <= 10 ? 'text-poker-coral'
      : 'text-poker-gold';

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold">
          🂠 Draw
        </p>
        {timeLeft !== null && !submitted && (
          <span className={`text-[11px] font-bold ${timerColor}`}>{timeLeft}s</span>
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
          ✓ Submitted — waiting ({discardedPlayers}/{totalPlayers})
        </div>
      )}
    </div>
  );
}
