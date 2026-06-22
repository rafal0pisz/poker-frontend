'use client';

import { useState, useCallback, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import type { Player, GameState } from '@/lib/types';

type PreAction = 'fold' | 'check-fold' | null;

interface Props {
  me: Player;
  gameState: GameState;
}

export function PreActionButton({ me, gameState }: Props) {
  const [pendingAction, setPendingAction] = useState<PreAction>(null);

  const isMyTurn = gameState.currentPlayerSeat === me.seat;
  const isActive = me.status === 'playing' && !isMyTurn;

  // Reset via useEffect (not during render)
  useEffect(() => {
    if (isMyTurn) setPendingAction(null);
  }, [isMyTurn]);

  const sendPreAction = useCallback(
    (action: PreAction) => {
      const next = action === pendingAction ? null : action;
      setPendingAction(next);
      getSocket().emit('game:pre-action', { action: next }, () => {});
    },
    [pendingAction]
  );

  if (!isActive) return null;

  const active = pendingAction === 'check-fold';

  return (
    <button
      onClick={() => sendPreAction('check-fold')}
      className={`py-2.5 px-3 rounded-lg text-sm font-medium active:scale-95 border transition-all whitespace-nowrap w-full ${
        active
          ? 'bg-poker-gold/20 text-poker-gold border-poker-gold/60'
          : 'bg-poker-yellow/5 border-poker-gold/20 text-poker-yellow/60'
      }`}
      title="Will check if possible, otherwise fold automatically when it's your turn"
    >
      {active ? '✓ Check/Fold' : 'Check/Fold'}
    </button>
  );
}
