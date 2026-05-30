'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Player, GameState, RoomSettings, ActionType } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  me: Player;
  gameState: GameState;
  settings: RoomSettings;
}

type ActionResponse = { ok: boolean; error?: string } | undefined;
type PreAction = 'check-fold' | 'fold' | null;

export function ActionPanel({ me, gameState, settings }: Props) {
  const isMyTurn = gameState.currentPlayerSeat === me.seat && me.status === 'playing';
  const toCall = gameState.currentBet - me.currentBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && me.chips > 0;

  const minRaiseAmount = gameState.currentBet + gameState.minRaise;
  const maxRaiseAmount = me.currentBet + me.chips; // = total chips in if going all-in
  // Can raise normally only if player has enough chips for minimum raise
  const canRaiseNormally = me.chips > 0 && maxRaiseAmount >= minRaiseAmount;
  // All-in is ALWAYS allowed as long as player has chips
  const canAllIn = me.chips > 0;

  const [raiseAmount, setRaiseAmount] = useState(minRaiseAmount);
  const [raiseInput, setRaiseInput] = useState(String(minRaiseAmount));
  const [showRaiseUI, setShowRaiseUI] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PreAction>(
    (me.pendingAction as PreAction) ?? null
  );

  useEffect(() => {
    if (!isMyTurn || !gameState.actionDeadline) { setSecondsLeft(null); return; }
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((gameState.actionDeadline! - Date.now()) / 1000)));
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [isMyTurn, gameState.actionDeadline]);

  useEffect(() => {
    setShowRaiseUI(false);
    const initial = Math.min(Math.max(minRaiseAmount, minRaiseAmount), maxRaiseAmount);
    setRaiseAmount(initial);
    setRaiseInput(String(initial));
  }, [isMyTurn]);

  // Sync pending action from server state
  useEffect(() => {
    setPendingAction((me.pendingAction as PreAction) ?? null);
  }, [me.pendingAction]);

  const updateRaise = (newValue: number) => {
    const clamped = Math.min(Math.max(newValue, minRaiseAmount), maxRaiseAmount);
    setRaiseAmount(clamped);
    setRaiseInput(String(clamped));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRaiseInput(value);
    const num = Number(value);
    if (!isNaN(num) && num > 0) {
      setRaiseAmount(Math.min(Math.max(num, minRaiseAmount), maxRaiseAmount));
    }
  };

  const handleInputBlur = () => {
    const num = Number(raiseInput);
    if (isNaN(num) || num < minRaiseAmount) updateRaise(minRaiseAmount);
    else if (num > maxRaiseAmount) updateRaise(maxRaiseAmount);
    else updateRaise(num);
  };

  const sendAction = (action: ActionType, amount?: number) => {
    getSocket().emit('game:action', { action, amount }, (response: ActionResponse) => {
      if (response && !response.ok) alert(response.error || 'Action error');
    });
  };

  const sendPreAction = useCallback((action: PreAction) => {
    const next = action === pendingAction ? null : action; // toggle off
    setPendingAction(next);
    getSocket().emit('game:pre-action', { action: next }, (response: ActionResponse) => {
      if (response && !response.ok) {
        setPendingAction(null);
        alert(response.error);
      }
    });
  }, [pendingAction]);

  // ── NOT MY TURN: show pre-action selector ────────────────────────────
  if (!isMyTurn) {
    const waitingMsg =
      me.status === 'folded' ? 'You folded — waiting for end of hand' :
      me.status === 'all-in' ? 'All-in — waiting for end of hand' :
      me.status === 'waiting' ? 'Waiting for the next hand to start' :
      me.status === 'sitting-out' ? "You're sitting out" :
      me.status === 'no-chips' ? 'No chips — waiting for admin to add' :
      null;

    if (waitingMsg) {
      return (
        <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl px-4 py-3 text-center">
          <p className="text-poker-yellow/60 text-sm">{waitingMsg}</p>
        </div>
      );
    }

    // Player is active but waiting for their turn — show pre-action
    return (
      <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-3 space-y-2">
        <p className="text-poker-yellow/50 text-[10px] uppercase tracking-wider text-center">
          Pre-action — fires when it&apos;s your turn
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => sendPreAction('fold')}
            className={`py-2.5 rounded-lg text-sm font-medium active:scale-95 border transition-all ${
              pendingAction === 'fold'
                ? 'bg-poker-coral text-white border-poker-coral'
                : 'bg-poker-coral/10 border-poker-coral/30 text-poker-coral'
            }`}
          >
            {pendingAction === 'fold' ? '✓ Fold' : 'Fold'}
          </button>
          <button
            onClick={() => sendPreAction('check-fold')}
            className={`py-2.5 rounded-lg text-sm font-medium active:scale-95 border transition-all ${
              pendingAction === 'check-fold'
                ? 'bg-poker-gold text-poker-bg border-poker-gold'
                : 'bg-poker-yellow/10 border-poker-gold/25 text-poker-yellow'
            }`}
          >
            {pendingAction === 'check-fold' ? '✓ Check/Fold' : 'Check/Fold'}
          </button>
        </div>
        {pendingAction && (
          <p className="text-[10px] text-poker-yellow/40 text-center">
            {pendingAction === 'fold'
              ? 'Will fold automatically when it\'s your turn'
              : 'Will check if possible, otherwise fold'}
          </p>
        )}
        <p className="text-poker-yellow/40 text-xs text-center">Waiting for your turn...</p>
      </div>
    );
  }

  // ── MY TURN: raise UI ─────────────────────────────────────────────────
  if (showRaiseUI) {
    return (
      <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-poker-yellow/70 text-xs whitespace-nowrap">Raise to:</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={raiseInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={(e) => e.target.select()}
            className="bg-poker-gold/10 text-poker-gold text-2xl font-medium text-right px-3 py-1 rounded-lg outline-none w-full max-w-[140px] focus:bg-poker-gold/15 border border-poker-gold/20"
          />
        </div>

        {canRaiseNormally ? (
          <>
            <div className="flex justify-between text-[10px] text-poker-yellow/40 px-1">
              <span>min {minRaiseAmount}</span>
              <span>max {maxRaiseAmount}</span>
            </div>
            <input
              type="range"
              min={minRaiseAmount}
              max={maxRaiseAmount}
              step={settings.bigBlind}
              value={raiseAmount}
              onChange={(e) => updateRaise(Number(e.target.value))}
              className="w-full accent-poker-gold"
            />
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Min', value: minRaiseAmount },
                { label: '½ pot', value: Math.floor(gameState.pot * 0.5) + gameState.currentBet },
                { label: 'Pot', value: gameState.pot + gameState.currentBet },
                { label: 'All-in', value: maxRaiseAmount },
              ].map((preset) => {
                const clamped = Math.min(Math.max(preset.value, minRaiseAmount), maxRaiseAmount);
                return (
                  <button key={preset.label} onClick={() => updateRaise(clamped)}
                    className="bg-poker-yellow/10 text-poker-yellow text-[11px] py-1.5 rounded active:scale-95">
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Can't raise normally (not enough chips for min raise) — only all-in available
          <p className="text-poker-yellow/50 text-xs text-center">
            Not enough chips for minimum raise ({minRaiseAmount}) — all-in only
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowRaiseUI(false)}
            className="bg-poker-yellow/10 text-poker-yellow font-medium py-3 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!canRaiseNormally || raiseAmount === maxRaiseAmount) {
                sendAction('all-in');
              } else {
                sendAction(gameState.currentBet === 0 ? 'bet' : 'raise', raiseAmount);
              }
            }}
            className="bg-poker-gold text-poker-bg font-medium py-3 rounded-lg"
          >
            {(!canRaiseNormally || raiseAmount === maxRaiseAmount) ? 'All-in' : `Confirm ${raiseAmount}`}
          </button>
        </div>
      </div>
    );
  }

  // ── MY TURN: main action buttons ──────────────────────────────────────
  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => sendAction('fold')}
          className="bg-poker-coral/20 border border-poker-coral/40 text-poker-coral py-3 rounded-lg text-sm font-medium active:scale-95"
        >
          Fold
        </button>

        {canCheck ? (
          <button
            onClick={() => sendAction('check')}
            className="bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow py-3 rounded-lg text-sm font-medium active:scale-95"
          >
            Check
          </button>
        ) : (
          <button
            disabled={!canCall}
            onClick={() => sendAction('call')}
            className="bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow py-3 rounded-lg text-sm font-medium active:scale-95 disabled:opacity-40"
          >
            Call {toCall > me.chips ? me.chips : toCall}
          </button>
        )}

        {canRaiseNormally ? (
          // Normal raise — opens raise UI
          <button
            onClick={() => setShowRaiseUI(true)}
            className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95"
          >
            {gameState.currentBet === 0 ? 'Bet' : 'Raise'}
          </button>
        ) : canAllIn ? (
          // Can't meet min raise but has chips — show All-in directly
          <button
            onClick={() => sendAction('all-in')}
            className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-bold active:scale-95 animate-pulse"
          >
            All-in
          </button>
        ) : null}
      </div>

      {secondsLeft !== null && (
        <div className="flex items-center justify-center gap-2 text-xs text-poker-yellow/50">
          <span>⏱</span>
          <span>Your turn · {secondsLeft}s</span>
        </div>
      )}
    </div>
  );
}
