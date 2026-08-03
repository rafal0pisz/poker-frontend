'use client';

import { useEffect, useState } from 'react';

interface Props {
  deadline: number;
  startingStack: number;
  onDecide: (rebuy: boolean) => void;
}

const REBUY_WINDOW_SEC = 20;

export function RebuyPrompt({ deadline, startingStack, onDecide }: Props) {
  const [decided, setDecided] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(REBUY_WINDOW_SEC);

  useEffect(() => {
    if (decided !== null) return;
    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [deadline, decided]);

  const handleDecide = (rebuy: boolean) => {
    if (decided !== null) return;
    setDecided(rebuy);
    onDecide(rebuy);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-sm rounded-2xl border border-poker-gold/30 p-5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-poker-gold font-bold mb-2">💸 Wypadłeś z turnieju</p>

        {decided === null ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke={timeLeft <= 6 ? '#f87171' : 'rgb(var(--pk-gold-rgb))'}
                    strokeWidth="2.5"
                    strokeDasharray={`${(timeLeft / REBUY_WINDOW_SEC) * 100} 100`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.2s' }}
                  />
                </svg>
                <span className={`text-xs font-bold ${timeLeft <= 6 ? 'text-red-400' : 'text-poker-gold'}`}>{timeLeft}</span>
              </div>
              <p className="text-poker-yellow text-sm">Dokupić się za {startingStack} żetonów?</p>
            </div>
            <p className="text-poker-yellow/40 text-[11px] mb-4">To Twoja jedyna, ostatnia szansa na powrót w tym turnieju.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDecide(true)}
                className="bg-poker-gold text-poker-bg py-3 rounded-lg text-sm font-medium active:scale-95"
              >
                💰 Dokup się za {startingStack}
              </button>
              <button
                onClick={() => handleDecide(false)}
                className="bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow py-2.5 rounded-lg text-xs active:scale-95"
              >
                Zakończ udział w turnieju
              </button>
            </div>
          </>
        ) : (
          <p className="text-poker-yellow/60 text-sm py-2">
            {decided ? 'Dokupujesz się…' : 'Kończysz udział…'}
          </p>
        )}
      </div>
    </div>
  );
}
