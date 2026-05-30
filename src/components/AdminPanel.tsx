'use client';

import { useState } from 'react';
import type { Room, Player } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  room: Room;
  mySessionToken: string;
  onClose: () => void;
}

type ChipsMode = 'add' | 'remove' | null;

type ActionResponse = { ok: boolean; error?: string; queued?: boolean } | undefined;

export function AdminPanel({ room, mySessionToken, onClose }: Props) {
  const [chipsAction, setChipsAction] = useState<{ token: string; mode: ChipsMode }>({
    token: '',
    mode: null,
  });
  const [chipsAmount, setChipsAmount] = useState(1000);
  const [pendingMsg, setPendingMsg] = useState<string | null>(null);

  const handleAddChips = (target: Player) => {
    const socket = getSocket();
    socket.emit(
      'admin:add-chips',
      { targetSessionToken: target.sessionToken, amount: chipsAmount },
      (response: ActionResponse) => {
        if (response && !response.ok) {
          alert(response.error || 'Error');
          return;
        }
        setChipsAction({ token: '', mode: null });
        if (response?.queued) {
          setPendingMsg(`+${chipsAmount} chips queued for ${target.nick} — will apply after current hand`);
          setTimeout(() => setPendingMsg(null), 8000);
        }
      },
    );
  };

  const handleRemoveChips = (target: Player) => {
    const socket = getSocket();
    socket.emit(
      'admin:remove-chips',
      { targetSessionToken: target.sessionToken, amount: chipsAmount },
      (response: ActionResponse) => {
        if (response && !response.ok) {
          alert(response.error || 'Error');
          return;
        }
        setChipsAction({ token: '', mode: null });
      },
    );
  };

  const handleRemovePlayer = (target: Player) => {
    if (!confirm(`Remove ${target.nick} from the room?`)) return;
    const socket = getSocket();
    socket.emit(
      'admin:remove-player',
      { targetSessionToken: target.sessionToken },
      (response: ActionResponse) => {
        if (response && !response.ok) {
          alert(response.error || 'Error');
        }
      },
    );
  };

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit('game:start', (response: ActionResponse) => {
      if (response && !response.ok) {
        alert(response.error || "Couldn't start the game");
        return;
      }
      onClose();
    });
  };

  const handlePause = () => {
    const socket = getSocket();
    const isPaused = room.paused;
    socket.emit(isPaused ? 'game:unpause' : 'game:pause', (response: ActionResponse) => {
      if (response && !response.ok) alert(response.error || 'Failed');
    });
  };

  const handleNextHand = () => {
    if (!confirm('Force start a new hand now?')) return;
    const socket = getSocket();
    socket.emit('game:next-hand', (response: ActionResponse) => {
      if (response && !response.ok) {
        alert(response.error || "Couldn't start next hand");
        return;
      }
      onClose();
    });
  };

  const eligiblePlayers = room.players.filter((p) => p.chips > 0 && p.connected);
  const canStartGame = !room.gameState && eligiblePlayers.length >= 2;
  const canForceNextHand = !!room.gameState && eligiblePlayers.length >= 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-poker-bg-light flex items-center justify-between p-4 border-b border-poker-gold/15">
          <h2 className="font-serif italic text-xl text-poker-gold">Admin panel</h2>
          <button
            onClick={onClose}
            className="text-poker-yellow/60 hover:text-poker-yellow text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!room.gameState ? (
            <button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className="w-full bg-poker-gold text-poker-bg font-medium py-3 rounded-xl disabled:opacity-40"
            >
              {canStartGame ? '🎰 Start game' : 'Need at least 2 players with chips'}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-poker-gold/10 border border-poker-gold/20 px-3 py-2 rounded-lg text-poker-yellow/70 text-xs text-center">
                Game in progress · hand #{room.gameState.handNumber}
              </div>
              <button
                onClick={handleNextHand}
                disabled={!canForceNextHand}
                className="w-full bg-poker-gold/15 border border-poker-gold/40 text-poker-gold font-medium py-2.5 rounded-xl text-sm disabled:opacity-40"
              >
                ⏭ Force next hand
              </button>
              <p className="text-poker-yellow/40 text-[11px] text-center">
                Use if the game seems stuck after chip adjustments
              </p>
              <button
                onClick={handlePause}
                className={`w-full font-medium py-2.5 rounded-xl text-sm active:scale-95 border ${
                  room.paused
                    ? 'bg-poker-gold text-poker-bg border-poker-gold'
                    : 'border-poker-coral/40 text-poker-coral bg-poker-coral/5'
                }`}
              >
                {room.paused ? '▶ Resume game' : '⏸ Pause game'}
              </button>
              {room.paused && (
                <p className="text-poker-gold text-[11px] text-center font-medium animate-pulse">
                  ⏸ Game paused — players cannot act
                </p>
              )}
            </div>
          )}

          {pendingMsg && (
            <div className="bg-poker-gold/15 border border-poker-gold/40 rounded-lg px-3 py-2.5 flex items-start gap-2">
              <span className="text-poker-gold text-base flex-shrink-0">⏳</span>
              <p className="text-poker-yellow/80 text-xs leading-snug">{pendingMsg}</p>
            </div>
          )}

          <div>
            <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">
              Players
            </p>
            <div className="space-y-2">
              {room.players.map((p) => {
                const isMe = p.sessionToken === mySessionToken;
                const isAddingChipsForThis =
                  chipsAction.token === p.sessionToken && chipsAction.mode === 'add';
                const isRemovingChipsForThis =
                  chipsAction.token === p.sessionToken && chipsAction.mode === 'remove';
                const isAnyChipsActionOpen = isAddingChipsForThis || isRemovingChipsForThis;

                return (
                  <div
                    key={p.sessionToken}
                    className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-poker-yellow truncate">
                            {p.nick}
                            {isMe && ' (you)'}
                          </span>
                          {p.role !== 'player' && (
                            <span className="text-[10px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded">
                              {p.role}
                            </span>
                          )}
                          {!p.connected && (
                            <span className="text-[10px] bg-poker-coral/20 text-poker-coral px-1.5 py-0.5 rounded">
                              offline
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-poker-yellow/60 mt-0.5">
                          {p.chips} chips · {p.status}
                        </p>
                      </div>
                    </div>

                    {isAnyChipsActionOpen ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2 items-center">
                          {/* Preset quick amounts */}
                          <div className="flex gap-1 flex-wrap">
                            {[100, 500, 1000, 2000].map((preset) => (
                              <button
                                key={preset}
                                onClick={() => setChipsAmount(preset)}
                                className={`text-[10px] px-2 py-1 rounded border ${
                                  chipsAmount === preset
                                    ? 'bg-poker-gold text-poker-bg border-poker-gold'
                                    : 'border-poker-gold/30 text-poker-yellow/60'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={chipsAmount}
                            onChange={(e) =>
                              setChipsAmount(Math.max(1, Number(e.target.value) || 1))
                            }
                            min={1}
                            step={100}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="flex-1 bg-poker-bg px-3 py-2 rounded-lg text-poker-yellow outline-none border border-poker-gold/20 text-lg font-medium"
                          />
                          <button
                            onClick={() =>
                              isAddingChipsForThis
                                ? handleAddChips(p)
                                : handleRemoveChips(p)
                            }
                            className={`px-4 py-2 rounded-lg font-bold text-base active:scale-95 ${
                              isAddingChipsForThis
                                ? 'bg-poker-gold text-poker-bg'
                                : 'bg-poker-coral text-white'
                            }`}
                          >
                            {isAddingChipsForThis ? '+ Add' : '− Remove'}
                          </button>
                          <button
                            onClick={() => setChipsAction({ token: '', mode: null })}
                            className="text-poker-yellow/60 px-3 py-2 text-lg"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-poker-yellow/40 text-[11px] text-center">
                          {isAddingChipsForThis
                            ? `Adding ${chipsAmount} chips to ${p.nick}`
                            : `Removing up to ${chipsAmount} chips from ${p.nick}`}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() =>
                            setChipsAction({ token: p.sessionToken, mode: 'add' })
                          }
                          className="bg-poker-gold/15 border border-poker-gold/40 text-poker-gold text-xs py-2 rounded-lg"
                        >
                          + Chips
                        </button>
                        <button
                          onClick={() =>
                            setChipsAction({ token: p.sessionToken, mode: 'remove' })
                          }
                          disabled={p.chips === 0}
                          className="bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow/70 text-xs py-2 rounded-lg disabled:opacity-40"
                        >
                          − Chips
                        </button>
                        {!isMe ? (
                          <button
                            onClick={() => handleRemovePlayer(p)}
                            className="bg-poker-coral/10 border border-poker-coral/30 text-poker-coral text-xs py-2 rounded-lg"
                          >
                            Kick
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
