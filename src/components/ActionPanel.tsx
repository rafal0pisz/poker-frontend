'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Player, GameState, RoomSettings, ActionType } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  me: Player;
  gameState: GameState;
  settings: RoomSettings;
  players: Player[];
}

type ActionResponse = { ok: boolean; error?: string } | undefined;
type PreAction = 'check-fold' | 'fold' | null;

export function ActionPanel({ me, gameState, settings, players }: Props) {
  const isMyTurn = gameState.currentPlayerSeat === me.seat && me.status === 'playing';
  const toCall = gameState.currentBet - me.currentBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && me.chips > 0;

  // Effective max bet = the most I can put at risk meaningfully.
  // In heads-up or when opponents have fewer chips, going all-in
  // for more than they can cover is equivalent to calling/betting their stack.
  // Formula: sum of min(myChips, opponent.chips + opponent.currentBet - me.currentBet) for each active opponent.
  const activeOpponents = players.filter(
    (p) =>
      p.sessionToken !== me.sessionToken &&
      (p.status === 'playing' || p.status === 'all-in')
  );

  // Max I can win from each opponent = min(my total chips in, their total chips in)
  const effectiveMaxBet = activeOpponents.length === 0
    ? me.currentBet + me.chips // no opponents (shouldn't happen)
    : activeOpponents.reduce((sum, opp) => {
        // What opponent can cover = their remaining chips + what they already put in
        const oppMaxContrib = opp.currentBet + opp.chips;
        // My effective bet vs this opponent = min(my max, their max)
        return sum + Math.min(me.currentBet + me.chips, oppMaxContrib);
      }, 0);

  // All-in button value: capped at effectiveMaxBet (so we don't show 200 when only 100 matters)
  const allInAmount = Math.min(me.currentBet + me.chips, effectiveMaxBet);

  const minRaiseAmount = gameState.currentBet + gameState.minRaise;

  // Pot Limit cap: max raise = currentBet + pot + toCall
  const isPotLimit = gameState.variant === 'omaha-pl' || gameState.variant === 'drawmaha-pl';

  // Pot Limit max raise formula:
  // potLimitMax = currentBet + pot + toCall
  // This equals: the pot after calling (call makes the pot bigger, then you can raise that amount)
  // Special case: if currentBet=0 (first bet on a street), potLimitMax = pot (just bet the pot)
  // Note: gameState.pot may be 0 between streets (collected into sidePots) — use pot + sidePots
  // effectivePot = everything visible in the pot:
  //   collected pot + side pots + ALL uncollected bets on the table (player.currentBet)
  // This is what players see as "the pot" during a betting round.
  const betsOnTable = players.reduce((s, p) => s + (p.currentBet || 0), 0);
  // gameState.pot is already the sum of all sidePots (set by collectBets in backend)
  // DO NOT add sidePots again — that would double-count!
  const collectedPot = gameState.pot;
  const effectivePot = collectedPot + betsOnTable;
  const totalPot = collectedPot;
  // PL max formula: effectivePot + 2×toCall (= call the bet + raise by pot-after-call)
  // Must include betsOnTable (uncollected bets from current round)
  const potLimitMax = isPotLimit
    ? Math.max(effectivePot + 2 * toCall, minRaiseAmount)
    : Infinity;

  // Cap maxRaiseAmount: effective max (opponent coverage) AND pot limit
  const maxRaiseAmount = Math.min(
    me.currentBet + me.chips,
    effectiveMaxBet,
    isPotLimit ? potLimitMax : Infinity
  );

  // Can raise normally = have enough chips AND there's value in raising
  const canRaiseNormally = me.chips > 0 && maxRaiseAmount >= minRaiseAmount;

  // Show standalone All-in button:
  // - Can't do a normal raise (not enough chips for minRaise)
  // - BUT going all-in is still > toCall (would create a side pot or cover call)
  // - AND the all-in amount is actually different from just calling
  const allInIsDistinctFromCall = allInAmount > toCall;
  // In No Limit, all-in is always available (it's just max raise)
  // Standalone all-in button shows when: can't raise normally, OR NL where all-in preset grid handles it
  const canAllIn = me.chips > 0 && (
    (!canRaiseNormally && allInIsDistinctFromCall) ||
    // NL: if the preset grid doesn't show (e.g., showRaiseUI is false and canRaiseNormally),
    // the grid already has All-in. So standalone button only for edge cases above.
    false
  );

  const [raiseAmount, setRaiseAmount] = useState(minRaiseAmount);
  const [raiseInput, setRaiseInput] = useState(String(minRaiseAmount));
  const [showRaiseUI, setShowRaiseUI] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PreAction>(
    (me.pendingAction as PreAction) ?? null
  );

  useEffect(() => {
    if (!isMyTurn || !gameState.actionDeadline) { setSecondsLeft(null); return; }
    const update = () =>
      setSecondsLeft(Math.max(0, Math.ceil((gameState.actionDeadline! - Date.now()) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isMyTurn, gameState.actionDeadline]);

  useEffect(() => {
    if (!isMyTurn) return; // only reset when turn changes TO my turn
    setShowRaiseUI(false);
    setSelectedPreset(null);
    const initial = Math.min(Math.max(minRaiseAmount, minRaiseAmount), maxRaiseAmount);
    setRaiseAmount(initial);
    setRaiseInput(String(initial));
  }, [isMyTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear pre-action when it's our turn (action was consumed or turn arrived)
  useEffect(() => {
    if (isMyTurn) {
      setPendingAction(null);
    }
  }, [isMyTurn]);

  // Sync from server state (for reconnects)
  useEffect(() => {
    if (!isMyTurn) {
      setPendingAction((me.pendingAction as PreAction) ?? null);
    }
  }, [me.pendingAction, isMyTurn]);

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
      if (response && !response.ok) console.warn('Action failed:', response.error);
    });
  };

  const sendPreAction = useCallback(
    (action: PreAction) => {
      const next = action === pendingAction ? null : action;
      setPendingAction(next);
      getSocket().emit('game:pre-action', { action: next }, (response: ActionResponse) => {
        if (response && !response.ok) {
          setPendingAction(null);
          console.warn('Pre-action failed:', response.error);
        }
      });
    },
    [pendingAction]
  );

  // ── NOT MY TURN ───────────────────────────────────────────────────────
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

    // Playing but waiting for turn — return null (pre-action is now a separate component)
    return null;
  }

  // ── RAISE UI ──────────────────────────────────────────────────────────
  if (showRaiseUI) {
    // Note: actual all-in detection is now inline in the confirm button click handler
    return (
      <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-3" style={{ position: 'relative' }}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-poker-yellow/70 text-xs whitespace-nowrap">
            {gameState.currentBet === 0 ? 'Bet:' : 'Raise to:'}
          </span>
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
          <span>max {maxRaiseAmount}{isPotLimit ? ' (pot limit)' : maxRaiseAmount < me.currentBet + me.chips ? ' (capped)' : ''}</span>
        </div>

        <input
          type="range"
          min={minRaiseAmount}
          max={maxRaiseAmount}
          step={settings.bigBlind}
          value={Math.min(raiseAmount, maxRaiseAmount)}
          onChange={(e) => updateRaise(Number(e.target.value))}
          className="w-full accent-poker-gold"
        />

        <div className="grid grid-cols-4 gap-1.5">
          {(isPotLimit ? [
            { label: 'Min',    value: minRaiseAmount },
            { label: '¼ pot',  value: Math.max(Math.floor((effectivePot + 2 * toCall) * 0.25) + toCall, minRaiseAmount) },
            { label: '½ pot',  value: Math.max(Math.floor((effectivePot + 2 * toCall) * 0.5) + toCall, minRaiseAmount) },
            { label: 'Pot',    value: maxRaiseAmount },
          ] : gameState.phase === 'preflop' ? [
            { label: 'Min',    value: minRaiseAmount },
            { label: '2x BB',  value: settings.bigBlind * 2 },
            { label: '3x BB',  value: settings.bigBlind * 3 },
            { label: 'All-in', value: maxRaiseAmount },
          ] : [
            { label: 'Min',    value: minRaiseAmount },
            { label: '½ pot',  value: Math.max(Math.floor(effectivePot / 2), minRaiseAmount) },
            { label: 'Pot',    value: Math.max(effectivePot, minRaiseAmount) },
            { label: 'All-in', value: maxRaiseAmount },
          ]).map((preset) => {
            const clamped = Math.min(Math.max(preset.value, minRaiseAmount), maxRaiseAmount);
            const isSelected = selectedPreset === preset.label;
            return (
              <button
                key={preset.label}
                onClick={() => { updateRaise(clamped); setSelectedPreset(preset.label); }}
                className={`text-[11px] py-1.5 rounded active:scale-95 transition-all ${
                  isSelected
                    ? 'bg-poker-gold/30 text-poker-gold border border-poker-gold/60'
                    : 'bg-poker-yellow/10 text-poker-yellow border border-transparent'
                }`}
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
              // Parse input directly to avoid stale closure on raiseAmount state
              const finalAmount = Math.min(
                Math.max(Number(raiseInput) || raiseAmount, minRaiseAmount),
                maxRaiseAmount
              );
              const isActuallyAllIn = finalAmount >= me.currentBet + me.chips;
              if (isActuallyAllIn) {
                sendAction('all-in');
              } else {
                sendAction(gameState.currentBet === 0 ? 'bet' : 'raise', finalAmount);
              }
              setShowRaiseUI(false);
            }}
            className="bg-poker-gold text-poker-bg font-medium py-3 rounded-lg"
          >
            {raiseAmount >= me.currentBet + me.chips ? 'All-in' : `Confirm ${raiseAmount}`}
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN ACTION BUTTONS ───────────────────────────────────────────────
  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {/* Fold */}
        <button
          onClick={() => sendAction('fold')}
          className="bg-poker-coral/20 border border-poker-coral/40 text-poker-coral py-3 rounded-lg text-sm font-medium active:scale-95"
        >
          Fold
        </button>

        {/* Check or Call */}
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
            {/* Show actual call amount, capped at my chips */}
            Call {Math.min(toCall, me.chips)}
          </button>
        )}

        {/* Raise or All-in */}
        {canRaiseNormally ? (
          <button
            onClick={() => setShowRaiseUI(true)}
            className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95"
          >
            {gameState.currentBet === 0 ? 'Bet' : 'Raise'}
          </button>
        ) : canAllIn ? (
          // Can't raise normally but all-in is distinct from call
          <button
            onClick={() => sendAction('all-in')}
            className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-bold active:scale-95 animate-pulse"
          >
            All-in
          </button>
        ) : (
          // Can't raise and all-in = call → empty slot (call covers it)
          <div />
        )}
      </div>

      {secondsLeft !== null && (
        <div className="h-1 w-full bg-poker-yellow/10 rounded-full overflow-hidden">
          <div
            className="h-1 rounded-full"
            style={{
              width: `${Math.min(100, (secondsLeft / settings.actionTimeoutSec) * 100)}%`,
              background: secondsLeft > 10 ? '#d4af37' : secondsLeft > 5 ? '#e07b39' : '#e05050',
              transition: 'width 0.9s linear, background 0.3s',
            }}
          />
        </div>
      )}
    </div>
  );
}
