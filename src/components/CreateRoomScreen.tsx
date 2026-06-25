'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { setSessionToken } from '@/lib/session';
import type { Room, RoomSettings } from '@/lib/types';

interface Props {
  defaultNick: string;
  onCancel: () => void;
  onRoomCreated: (room: Room, sessionToken: string) => void;
}

type CreateRoomResponse =
  | { ok: true; room: Room; sessionToken: string }
  | { ok: false; error: string };

export function CreateRoomScreen({ defaultNick, onCancel, onRoomCreated }: Props) {
  const [nick, setNick] = useState(defaultNick);
  const [smallBlind, setSmallBlind] = useState(10);
  const [bigBlind, setBigBlind] = useState(20);
  const [startingBuyIn, setStartingBuyIn] = useState(1000);
  const [maxSeats, setMaxSeats] = useState(9);
  const [actionTimeoutSec, setActionTimeoutSec] = useState<15 | 30 | 60>(30);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateWithBot = () => {
    setCreating(true);
    setError(null);
    const socket = getSocket();
    socket.emit('room:create-with-bot', { nick: nick.trim() || 'Player', botCount: 7 },
      (response: { ok: boolean; roomId?: string; sessionToken?: string; error?: string }) => {
        setCreating(false);
        if (response.ok && response.roomId && response.sessionToken) {
          // Rejoin to get full room object
          socket.emit('room:join',
            { nick: nick.trim() || 'Player', roomId: response.roomId, sessionToken: response.sessionToken },
            (res: { ok: boolean; room?: import('@/lib/types').Room; sessionToken?: string }) => {
              if (res.ok && res.room) {
                setSessionToken(res.room.id, response.sessionToken!);
                onRoomCreated(res.room, response.sessionToken!);
              }
            }
          );
        } else {
          setError(response.error ?? 'Error creating bot room');
        }
      }
    );
  };

  const handleCreate = () => {
    setCreating(true);
    setError(null);

    const settings: RoomSettings = {
      smallBlind, bigBlind, startingBuyIn, maxSeats, actionTimeoutSec,
    };

    const socket = getSocket();
    socket.emit('room:create', { nick, settings }, (response: CreateRoomResponse) => {
      setCreating(false);
      if (response.ok) {
        setSessionToken(response.room.id, response.sessionToken);
        onRoomCreated(response.room, response.sessionToken);
      } else {
        setError(response.error);
      }
    });
  };

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="text-poker-yellow/70 px-2 py-1">← Back</button>
        <h1 className="font-serif italic text-2xl flex-1 text-center -ml-12 text-poker-gold">New room</h1>
      </div>

      <div className="flex-1 max-w-sm mx-auto w-full space-y-5">
        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Your nickname</label>
          <input
            type="text"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            maxLength={16}
            className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Small blind</label>
            <input
              type="number"
              value={smallBlind}
              onChange={(e) => {
                const sb = Math.max(1, Number(e.target.value));
                setSmallBlind(sb);
                if (bigBlind < sb * 2) setBigBlind(sb * 2);
              }}
              min={1}
              className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"
            />
          </div>
          <div>
            <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Big blind</label>
            <input
              type="number"
              value={bigBlind}
              onChange={(e) => setBigBlind(Math.max(smallBlind * 2, Number(e.target.value)))}
              min={smallBlind * 2}
              className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"
            />
          </div>
        </div>

        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">
            Your starting chips
          </label>
          {/* No minimum tied to blinds — enter any value you want */}
          <input
            type="number"
            value={startingBuyIn}
            onChange={(e) => setStartingBuyIn(Math.max(1, Number(e.target.value)))}
            min={1}
            step={1}
            className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"
          />
          <p className="text-poker-yellow/40 text-[11px] mt-1">
            Other players join with 0 chips — assign chips from the admin panel.
          </p>
        </div>

        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">
            Number of seats: <span className="text-poker-gold font-medium">{maxSeats}</span>
          </label>
          <input
            type="range"
            min={2}
            max={9}
            value={maxSeats}
            onChange={(e) => setMaxSeats(Number(e.target.value))}
            className="w-full accent-poker-gold"
          />
        </div>

        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Action time</label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => setActionTimeoutSec(sec as 15 | 30 | 60)}
                className={`py-3 rounded-lg font-medium transition border ${
                  actionTimeoutSec === sec
                    ? 'bg-poker-gold text-poker-bg border-poker-gold'
                    : 'bg-poker-yellow/10 text-poker-yellow border-poker-gold/20'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-poker-coral/20 border border-poker-coral/40 text-poker-coral px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="max-w-sm mx-auto w-full mt-6 flex flex-col gap-3">
        <button
          onClick={handleCreate}
          disabled={creating || !nick.trim()}
          className="w-full bg-poker-gold text-poker-bg font-medium py-4 rounded-xl active:scale-95 transition disabled:opacity-40"
        >
          {creating ? 'Creating...' : 'Create room'}
        </button>
        <button
          onClick={handleCreateWithBot}
          disabled={creating || !nick.trim()}
          className="w-full bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow font-medium py-4 rounded-xl active:scale-95 transition disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <span>🤖</span>
          <span>{creating ? 'Creating...' : 'Test with Bots (7 players)'}</span>
        </button>
        <p className="text-center text-[11px] text-poker-yellow/35">Bot room uses blinds 5/10, 1000 chips each</p>
      </div>
    </main>
  );
}
