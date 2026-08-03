'use client';

import { useEffect, useState } from 'react';
import type { Room } from '@/lib/types';

function formatClock(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  room: Room;
  onShowResults?: () => void;
}

export function TournamentHUD({ room, onShowResults }: Props) {
  const ts = room.tournamentState;
  const settings = room.settings.tournamentSettings;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (ts?.status !== 'running') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ts?.status]);

  if (!ts || !settings) return null;

  const activePlayers = ts.registeredTokens.filter(
    (token) => !ts.eliminationOrder.some((e) => e.sessionToken === token),
  ).length;

  if (ts.status === 'registering') {
    return (
      <div className="flex items-center justify-between bg-poker-gold/10 border border-poker-gold/25 rounded-lg px-3 py-2 mb-2 text-xs">
        <span className="text-poker-gold font-medium">🏆 Tournament · registration open</span>
        <span className="text-poker-yellow/60">{ts.registeredTokens.length} registered</span>
      </div>
    );
  }

  if (ts.status === 'finished') {
    return (
      <button
        onClick={onShowResults}
        className="w-full flex items-center justify-between bg-poker-gold/15 border border-poker-gold/40 rounded-lg px-3 py-2 mb-2 text-xs active:scale-[0.99] transition"
      >
        <span className="text-poker-gold font-medium">🏆 Tournament finished</span>
        <span className="text-poker-yellow/70">View results →</span>
      </button>
    );
  }

  const levelDef = settings.blindLevels[ts.currentLevel - 1];
  const nextLevelDef = settings.blindLevels[ts.currentLevel];
  const remainingMs = ts.levelStartedAt !== null && levelDef
    ? levelDef.durationSec * 1000 - (now - ts.levelStartedAt)
    : 0;

  return (
    <div className="flex items-center justify-between gap-2 bg-poker-gold/10 border border-poker-gold/25 rounded-lg px-3 py-2 mb-2 text-xs">
      <span className="text-poker-gold font-medium whitespace-nowrap">
        🏆 Level {ts.currentLevel}
      </span>
      <span className="text-poker-yellow/70 whitespace-nowrap">
        {room.settings.smallBlind}/{room.settings.bigBlind}
      </span>
      <span className="text-poker-yellow/50 whitespace-nowrap">
        {nextLevelDef ? `next in ${formatClock(remainingMs)}` : 'final level'}
      </span>
      <span className="text-poker-yellow/60 whitespace-nowrap ml-auto">
        {activePlayers}/{ts.registeredTokens.length} left
      </span>
    </div>
  );
}
