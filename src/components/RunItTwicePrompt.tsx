'use client';

import { useEffect, useState } from 'react';
import type { Player, RunItTwiceState } from '@/lib/types';

interface Props {
  runItTwiceState: RunItTwiceState;
  mySessionToken: string;
  players: Player[];
  onDecide: (accept: boolean) => void;
}

export function RunItTwicePrompt({ runItTwiceState, mySessionToken, players, onDecide }: Props) {
  const [decided, setDecided] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const myDecision = runItTwiceState.decisions[mySessionToken];
  const iCanVote = mySessionToken in runItTwiceState.decisions;
  const alreadyDecided = myDecision !== null && myDecision !== undefined;

  useEffect(() => {
    if (!iCanVote || alreadyDecided || decided) return;
    const deadline = runItTwiceState.deadline;
    if (!deadline) return;
    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [iCanVote, alreadyDecided, decided, runItTwiceState.deadline]);

  const handleDecide = (accept: boolean) => {
    if (decided || alreadyDecided) return;
    setDecided(true);
    onDecide(accept);
  };

  const votersTotal = Object.keys(runItTwiceState.decisions).length;
  const votedCount = Object.values(runItTwiceState.decisions).filter((d) => d !== null).length;

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 space-y-3">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold mb-0.5">
          🎲 Run It Twice?
        </p>
        <p className="text-poker-yellow/60 text-xs">{votedCount}/{votersTotal} decided</p>
      </div>

      {iCanVote && !alreadyDecided && !decided ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke={timeLeft <= 4 ? '#f87171' : 'rgb(var(--pk-gold-rgb))'}
                  strokeWidth="2.5"
                  strokeDasharray={`${(timeLeft / 10) * 100} 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.2s' }}
                />
              </svg>
              <span className={`text-xs font-bold ${timeLeft <= 4 ? 'text-red-400' : 'text-poker-gold'}`}>
                {timeLeft}
              </span>
            </div>
            <p className="text-poker-yellow text-sm">Deal the board twice?</p>
          </div>
          <p className="text-poker-yellow/40 text-[10px] text-center">Everyone still in the hand must agree</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleDecide(true)}
              className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95"
            >
              ✓ Run it twice
            </button>
            <button
              onClick={() => handleDecide(false)}
              className="bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow py-2.5 rounded-lg text-xs active:scale-95"
            >
              Once is fine
            </button>
          </div>
        </div>
      ) : iCanVote && (alreadyDecided || decided) ? (
        <p className="text-center text-poker-yellow/40 text-sm">
          You voted {myDecision || decided ? '✓ Run it twice' : '— once is fine'}. Waiting for the rest…
        </p>
      ) : (
        <p className="text-center text-poker-yellow/60 text-sm">Waiting for players to decide…</p>
      )}

      <div className="flex gap-1.5 flex-wrap justify-center">
        {players
          .filter((p) => p.sessionToken in runItTwiceState.decisions)
          .map((p) => {
            const d = runItTwiceState.decisions[p.sessionToken];
            return (
              <span
                key={p.sessionToken}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                  d === true
                    ? 'border-poker-gold/40 text-poker-gold bg-poker-gold/10'
                    : d === false
                    ? 'border-white/10 text-poker-yellow/40'
                    : 'border-poker-gold/70 text-poker-yellow bg-poker-gold/15 animate-pulse'
                }`}
              >
                {p.nick} {d === true ? '✓' : d === false ? '✗' : '⏳'}
              </span>
            );
          })}
      </div>
    </div>
  );
}
