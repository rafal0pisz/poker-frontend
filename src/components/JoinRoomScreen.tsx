'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { getSessionToken, setSessionToken } from '@/lib/session';
import type { Room } from '@/lib/types';

interface Props {
  defaultNick: string;
  onCancel: () => void;
  onRoomJoined: (room: Room, sessionToken: string) => void;
}

type JoinRoomResponse =
  | { ok: true; room: Room; sessionToken: string }
  | { ok: false; error: string };

export function JoinRoomScreen({ defaultNick, onCancel, onRoomJoined }: Props) {
  const [roomId, setRoomId] = useState('');
  const [nick, setNick] = useState(defaultNick);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    setJoining(true);
    setError(null);
    const cleanRoomId = roomId.toUpperCase().trim();
    const existingToken = getSessionToken(cleanRoomId);

    const socket = getSocket();
    socket.emit('room:join',
      { roomId: cleanRoomId, nick, sessionToken: existingToken || undefined },
      (response: JoinRoomResponse) => {
        setJoining(false);
        if (response.ok) {
          setSessionToken(response.room.id, response.sessionToken);
          onRoomJoined(response.room, response.sessionToken);
        } else {
          setError(response.error);
        }
      },
    );
  };

  return (
    <main className="min-h-screen p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="text-poker-yellow/70 px-2 py-1">← Back</button>
        <h1 className="font-serif italic text-2xl flex-1 text-center -ml-12 text-poker-gold">Join room</h1>
      </div>

      <div className="flex-1 max-w-sm mx-auto w-full space-y-5">
        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Room code</label>
          <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            maxLength={8} placeholder="e.g. 7K4M2X" autoFocus
            className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-4 rounded-lg outline-none focus:bg-poker-yellow/15 text-center text-2xl font-mono tracking-widest text-poker-gold"/>
        </div>

        <div>
          <label className="text-poker-yellow/60 text-xs uppercase tracking-wide block mb-2">Your nickname</label>
          <input type="text" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={16}
            className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"/>
        </div>

        <div className="bg-poker-gold/10 border border-poker-gold/25 rounded-lg p-3">
          <p className="text-poker-yellow/70 text-xs">
            ℹ️ You'll join as a spectator. Click "Take a seat" once inside to join the game — admin will then assign you chips.
          </p>
        </div>

        {error && (
          <div className="bg-poker-coral/20 border border-poker-coral/40 text-poker-coral px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="max-w-sm mx-auto w-full mt-6">
        <button onClick={handleJoin} disabled={joining || !roomId.trim() || !nick.trim()}
          className="w-full bg-poker-gold text-poker-bg font-medium py-4 rounded-xl active:scale-95 transition disabled:opacity-40">
          {joining ? 'Joining...' : 'Join'}
        </button>
      </div>
    </main>
  );
}
