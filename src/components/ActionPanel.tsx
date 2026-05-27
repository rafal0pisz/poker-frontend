'use client';

import { useState, useEffect } from 'react';
import type { Player, GameState, RoomSettings, ActionType } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  me: Player;
  gameState: GameState;
  settings: RoomSettings;
}

type ActionResponse = { ok: boolean; error?: string } | undefined;

export function ActionPanel({ me, gameState, settings }: Props) {
  const isMyTurn = gameState.currentPlayerSeat === me.seat && me.status === 'playing';
  const toCall = gameState.currentBet - me.currentBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && me.chips > 0;
  const canRaise = me.chips > 0;

  const minRaiseAmount = gameState.currentBet + gameState.minRaise;
  const maxRaiseAmount = me.currentBet + me.chips;

  const [raiseAmount, setRaiseAmount] = useState(minRaiseAmount);
  const [raiseInput, setRaiseInput] = useState(String(minRaiseAmount));
  const [showRaiseUI, setShowRaiseUI] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!isMyTurn || !gameState.actionDeadline) {
      setSecondsLeft(null);
      return;
    }
    const update = () => {
      const ms = gameState.actionDeadline! - Date.now();
      setSecondsLeft(Math.max(0, Math.ceil(ms / 1000)));
    };
    update();
    const interval = setInterval(update, 200);
    return () => clearInterval(interval);
  }, [isMyTurn, gameState.actionDeadline]);

  useEffect(() => {
    setShowRaiseUI(false);
    const initial = Math.min(minRaiseAmount, maxRaiseAmount);
    setRaiseAmount(initial);
    setRaiseInput(String(initial));
  }, [isMyTurn, minRaiseAmount, maxRaiseAmount]);

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
    if (isNaN(num) || num < minRaiseAmount) {
      updateRaise(minRaiseAmount);
    } else if (num > maxRaiseAmount) {
      updateRaise(maxRaiseAmount);
    } else {
      updateRaise(num);
    }
  };

  const sendAction = (action: ActionType, amount?: number) => {
    const socket = getSocket();
    socket.emit('game:action', { action, amount }, (response: ActionResponse) => {
      if (response && !response.ok) {
        alert(response.error || 'Action error');
      }
    });
  };

  if (!isMyTurn) {
    return (
      <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl px-4 py-3 text-center">
        <p className="text-poker-yellow/60 text-sm">
          {me.status === 'folded' && 'You folded — waiting for end of hand'}
          {me.status === 'all-in' && 'All-in — waiting for end of hand'}
          {me.status === 'waiting' && 'Waiting for the next hand to start'}
          {me.status === 'sitting-out' && "You're sitting out"}
          {me.status === 'no-chips' && 'No chips — waiting for admin to add'}
          {me.status === 'playing' && 'Waiting for your turn...'}
        </p>
      </div>
    );
  }

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
              <button
                key={preset.label}
                onClick={() => updateRaise(clamped)}
                className="bg-poker-yellow/10 text-poker-yellow text-[11px] py-1.5 rounded active:scale-95"
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowRaiseUI(false)}
            className="bg-poker-yellow/10 text-poker-yellow font-medium py-3 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (raiseAmount === maxRaiseAmount) {
                sendAction('all-in');
              } else {
                sendAction(gameState.currentBet === 0 ? 'bet' : 'raise', raiseAmount);
              }
            }}
            className="bg-poker-gold text-poker-bg font-medium py-3 rounded-lg"
          >
            Confirm {raiseAmount}
          </button>
        </div>
      </div>
    );
  }

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
        <button
          disabled={!canRaise || maxRaiseAmount < minRaiseAmount}
          onClick={() => setShowRaiseUI(true)}
          className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95 disabled:opacity-40"
        >
          {gameState.currentBet === 0 ? 'Bet' : 'Raise'}
        </button>
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
