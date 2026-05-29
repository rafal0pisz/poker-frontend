'use client';

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
  const totalPlayers = Object.keys(drawState.playerStates).length;
  const drawnPlayers = Object.values(drawState.playerStates).filter((s) => s.hasDrawn).length;

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-2">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold mb-0.5">
          🃏 Draw Phase
        </p>
        {!submitted ? (
          <p className="text-poker-yellow/60 text-xs">
            Tap your cards above to mark for discard
          </p>
        ) : (
          <p className="text-poker-yellow/60 text-xs">
            Waiting for others… ({drawnPlayers}/{totalPlayers})
          </p>
        )}
      </div>

      {!submitted ? (
        <>
          <p className="text-center text-xs text-poker-yellow/50 min-h-[16px]">
            {discardCount === 0
              ? 'Stand pat — keep all cards'
              : `${discardCount} card${discardCount > 1 ? 's' : ''} selected for discard`}
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
              className="bg-poker-gold text-poker-bg text-sm font-medium py-2.5 rounded-lg active:scale-95"
            >
              {discardCount === 0 ? 'Stand Pat' : `Discard ${discardCount}`}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-2 text-poker-yellow/40 text-sm border border-poker-gold/10 rounded-lg">
          ✓ Submitted
        </div>
      )}
    </div>
  );
}
