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
  const [chipsAction, setChipsAction] = useState<{ token: string; mode: ChipsMode }>({ token: '', mode: null });
  const [chipsAmount, setChipsAmount] = useState(100);
  const [pendingMsg, setPendingMsg] = useState<string | null>(null);
  const TABLE_COLORS = [
    { value: '#1a3a1a', label: 'Classic green' },
    { value: '#1F0808', label: 'Casino red' },
    { value: '#0a1a2e', label: 'Midnight blue' },
    { value: '#1a1a2e', label: 'Deep purple' },
    { value: '#1a1208', label: 'Bourbon brown' },
    { value: '#0d0d17', label: 'Obsidian' },
  ];

  const tableColor = room.settings.tableColor || '#1a3a1a';

  const handleTableColor = (color: string) => {
    getSocket().emit('admin:set-table-color', { color }, (res: { ok: boolean; error?: string }) => {
      if (!res.ok) console.error('table color error:', res.error);
    });
  };

  const handleAddChips = (target: Player) => {
    getSocket().emit('admin:add-chips', { targetSessionToken: target.sessionToken, amount: chipsAmount }, (response: ActionResponse) => {
      if (response && !response.ok) { alert(response.error || 'Error'); return; }
      setChipsAction({ token: '', mode: null });
      if (response?.queued) {
        setPendingMsg(`+${chipsAmount} chips queued for ${target.nick} — will apply after current hand`);
        setTimeout(() => setPendingMsg(null), 8000);
      }
    });
  };

  const handleRemoveChips = (target: Player) => {
    getSocket().emit('admin:remove-chips', { targetSessionToken: target.sessionToken, amount: chipsAmount }, (response: ActionResponse) => {
      if (response && !response.ok) { alert(response.error || 'Error'); return; }
      setChipsAction({ token: '', mode: null });
    });
  };

  const handleRemovePlayer = (target: Player) => {
    if (!confirm(`Remove ${target.nick} from the room?`)) return;
    getSocket().emit('admin:remove-player', { targetSessionToken: target.sessionToken }, (response: ActionResponse) => {
      if (response && !response.ok) alert(response.error || 'Error');
    });
  };

  const handleStartGame = () => {
    getSocket().emit('game:start', (response: ActionResponse) => {
      if (response && !response.ok) { alert(response.error || "Couldn't start"); return; }
      onClose();
    });
  };

  const handleTransferAdmin = (target: Player) => {
    if (!confirm(`Transfer admin to ${target.nick}? You will lose admin access.`)) return;
    getSocket().emit('admin:transfer', { targetSessionToken: target.sessionToken }, (response: ActionResponse) => {
      if (response && !response.ok) alert(response.error || 'Failed');
      else onClose();
    });
  };

  const handlePause = () => {
    getSocket().emit(room.paused ? 'game:unpause' : 'game:pause', (response: ActionResponse) => {
      if (response && !response.ok) alert(response.error || 'Failed');
    });
  };

  const handleNextHand = () => {
    if (!confirm('Force start a new hand now?')) return;
    getSocket().emit('game:next-hand', (response: ActionResponse) => {
      if (response && !response.ok) { alert(response.error || "Couldn't start next hand"); return; }
      onClose();
    });
  };

  const eligiblePlayers = room.players.filter((p) => p.chips > 0 && p.connected);
  const canStartGame = !room.gameState && eligiblePlayers.length >= 2;
  const canForceNextHand = eligiblePlayers.length >= 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-poker-bg-light flex items-center justify-between p-4 border-b border-poker-gold/15">
          <h2 className="font-serif italic text-xl text-poker-gold">Admin panel</h2>
          <button onClick={onClose} className="text-poker-yellow/60 hover:text-poker-yellow text-2xl leading-none">×</button>
        </div>

        <div className="p-4 space-y-4">

          {/* Game controls */}
          {!room.gameState ? (
            <button onClick={handleStartGame} disabled={!canStartGame}
              className="w-full bg-poker-gold text-poker-bg font-medium py-3 rounded-xl disabled:opacity-40">
              {canStartGame ? '🎰 Start game' : 'Need at least 2 players with chips'}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-poker-gold/10 border border-poker-gold/20 px-3 py-2 rounded-lg text-poker-yellow/70 text-xs text-center">
                Game in progress · hand #{room.gameState.handNumber}
              </div>
              <button onClick={handleNextHand} disabled={!canForceNextHand}
                className="w-full bg-poker-gold/15 border border-poker-gold/40 text-poker-gold font-medium py-2.5 rounded-xl text-sm disabled:opacity-40">
                ⏭ Force next hand
              </button>
              <button onClick={handlePause}
                className={`w-full font-medium py-2.5 rounded-xl text-sm active:scale-95 border ${
                  room.paused
                    ? 'bg-poker-gold text-poker-bg border-poker-gold'
                    : 'border-poker-coral/40 text-poker-coral bg-poker-coral/5'
                }`}>
                {room.paused ? '▶ Resume game' : '⏸ Pause game'}
              </button>
              {room.paused && (
                <p className="text-poker-gold text-[11px] text-center font-medium animate-pulse">
                  ⏸ Game paused — players cannot act
                </p>
              )}
            </div>
          )}

          {/* Pending chips message */}
          {pendingMsg && (
            <div className="bg-poker-gold/15 border border-poker-gold/40 rounded-lg px-3 py-2.5 flex items-start gap-2">
              <span className="text-poker-gold text-base flex-shrink-0">⏳</span>
              <p className="text-poker-yellow/80 text-xs leading-snug">{pendingMsg}</p>
            </div>
          )}

          {/* Players */}
          <div>
            <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Players</p>
            <div className="space-y-2">
              {room.players.map((p) => {
                const isMe = p.sessionToken === mySessionToken;
                const isAdd = chipsAction.token === p.sessionToken && chipsAction.mode === 'add';
                const isRemove = chipsAction.token === p.sessionToken && chipsAction.mode === 'remove';
                const chipsOpen = isAdd || isRemove;

                return (
                  <div key={p.sessionToken} className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg p-3">
                    {/* Player info row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-poker-yellow truncate">
                            {p.nick}{isMe ? ' (you)' : ''}
                          </span>
                          {p.role !== 'player' && (
                            <span className="text-[10px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded">{p.role}</span>
                          )}
                          {!p.connected && (
                            <span className="text-[10px] bg-poker-coral/20 text-poker-coral px-1.5 py-0.5 rounded">offline</span>
                          )}
                        </div>
                        <p className="text-xs text-poker-yellow/60 mt-0.5">{p.chips} chips · {p.status}</p>
                      </div>
                    </div>

                    {/* Chips input (open) */}
                    {chipsOpen && (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-1 flex-wrap">
                          {[50, 100, 200, 400].map((preset) => (
                            <button key={preset} onClick={() => setChipsAmount(preset)}
                              className={`text-[10px] px-2 py-1 rounded border ${
                                chipsAmount === preset
                                  ? 'bg-poker-gold text-poker-bg border-poker-gold'
                                  : 'border-poker-gold/30 text-poker-yellow/60'
                              }`}>
                              {preset}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={chipsAmount}
                            onChange={(e) => setChipsAmount(Math.max(1, Number(e.target.value) || 1))}
                            min={1}
                            step={50}
                            inputMode="numeric"
                            className="flex-1 bg-poker-bg px-3 py-2 rounded-lg text-poker-yellow outline-none border border-poker-gold/20 text-lg font-medium"
                          />
                          <button
                            onClick={() => isAdd ? handleAddChips(p) : handleRemoveChips(p)}
                            className={`px-4 py-2 rounded-lg font-bold text-base active:scale-95 ${isAdd ? 'bg-poker-gold text-poker-bg' : 'bg-poker-coral text-white'}`}>
                            {isAdd ? '+ Add' : '− Remove'}
                          </button>
                          <button onClick={() => setChipsAction({ token: '', mode: null })}
                            className="text-poker-yellow/60 px-3 py-2 text-lg">
                            ×
                          </button>
                        </div>
                        <p className="text-poker-yellow/40 text-[11px] text-center">
                          {isAdd ? `Adding ${chipsAmount} chips to ${p.nick}` : `Removing up to ${chipsAmount} chips from ${p.nick}`}
                        </p>
                      </div>
                    )}

                    {/* Action buttons (closed) */}
                    {!chipsOpen && (
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-3 gap-1.5">
                          <button onClick={() => setChipsAction({ token: p.sessionToken, mode: 'add' })}
                            className="bg-poker-gold/15 border border-poker-gold/40 text-poker-gold text-xs py-2 rounded-lg">
                            + Chips
                          </button>
                          <button onClick={() => setChipsAction({ token: p.sessionToken, mode: 'remove' })}
                            disabled={p.chips === 0}
                            className="bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow/70 text-xs py-2 rounded-lg disabled:opacity-40">
                            − Chips
                          </button>
                          {!isMe ? (
                            <button onClick={() => handleRemovePlayer(p)}
                              className="bg-poker-coral/10 border border-poker-coral/30 text-poker-coral text-xs py-2 rounded-lg">
                              Kick
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                        {!isMe && (
                          <button onClick={() => handleTransferAdmin(p)}
                            className="w-full bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow/50 text-[10px] py-1.5 rounded-lg active:scale-95">
                            👑 Make admin
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Force next hand */}
          <div className="border-t border-poker-gold/10 pt-4">
            <p className="text-xs text-poker-yellow/50 mb-2">Emergency controls</p>
            <button
              onClick={() => {
                if (!confirm('Force next hand? Current hand will be cancelled.')) return;
                getSocket().emit('admin:force-next-hand', {}, (res: { ok: boolean; error?: string }) => {
                  if (!res.ok) setPendingMsg(res.error ?? 'Error');
                  else onClose();
                });
              }}
              className="w-full py-2.5 rounded-lg text-sm font-medium border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
            >
              ⚡ Force next hand
            </button>
            <p className="text-[10px] text-poker-yellow/25 mt-1.5">
              Use if the game freezes. Current hand is cancelled and chips are not awarded.
            </p>
          </div>

          {/* Table color */}
          <div className="border-t border-poker-gold/10 pt-4">
            <p className="text-xs text-poker-yellow/50 mb-3">Table color</p>
            <div className="grid grid-cols-3 gap-2">
              {TABLE_COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleTableColor(value)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg border text-[10px] transition-all active:scale-95"
                  style={{
                    borderColor: tableColor === value ? '#d4af37' : 'rgba(212,175,55,0.15)',
                    background: tableColor === value ? 'rgba(212,175,55,0.1)' : 'transparent',
                    color: tableColor === value ? '#d4af37' : 'rgba(245,230,192,0.5)',
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: value, flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
