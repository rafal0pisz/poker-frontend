'use client';

import { useState, useEffect } from 'react';
import type { Card as CardType } from '@/lib/types';
import { Card } from './Card';

interface Props {
  holeCards: CardType[];
  onDiscard: (index: number) => void;
  deadline: number | null;
}

export function PineappleDiscard({ holeCards, onDiscard, deadline }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    if (!deadline) return;
    const update = () => {
      const secs = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTimeLeft(secs);
    };
    update();
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, [deadline]);

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onDiscard(selected);
  };

  if (submitted) {
    return (
      <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl px-4 py-3 text-center">
        <p className="text-poker-yellow/60 text-sm">✓ Card discarded — waiting for other players</p>
      </div>
    );
  }

  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-poker-yellow text-sm font-semibold">
          Pineapple Classic — discard 1 card
        </p>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${timeLeft <= 5 ? 'text-red-400 bg-red-400/10' : 'text-poker-yellow/50 bg-poker-yellow/5'}`}>
          {timeLeft}s
        </span>
      </div>
      <p className="text-poker-yellow/50 text-xs mb-4">
        Click the card you want to discard. The other 2 stay in your hand.
      </p>
      <div className="flex gap-3 justify-center mb-4">
        {holeCards.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="relative transition-all"
            style={{
              transform: selected === i ? 'translateY(-8px) scale(1.05)' : 'none',
              opacity: selected !== null && selected !== i ? 0.45 : 1,
            }}
          >
            <Card card={card} size="lg" />
            {selected === i && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                odrzucam
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-40"
        style={{
          background: selected !== null ? 'rgb(var(--pk-gold-rgb))' : 'transparent',
          color: selected !== null ? '#0d0d14' : 'rgba(var(--pk-cream-rgb),0.4)',
          border: selected !== null ? 'none' : '1px solid rgba(var(--pk-gold-rgb),0.2)',
        }}
      >
        {selected !== null ? 'Discard card' : 'Select a card to discard'}
      </button>
    </div>
  );
}
