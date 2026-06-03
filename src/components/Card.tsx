'use client';

import { useEffect, useState } from 'react';
import type { Card as CardType } from '@/lib/types';

interface Props {
  card?: CardType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  facedown?: boolean;
  winning?: boolean;
  selectedForDiscard?: boolean;
  onClick?: () => void;
  // Pass dealIndex (0,1,2…) to trigger staggered deal animation
  dealIndex?: number;
  // slowFlip: used for community cards — slower, more dramatic reveal
  slowFlip?: boolean;
}

const SUIT_SYMBOLS: Record<string, string> = {
  s: '♠', h: '♥', d: '♦', c: '♣',
};
const SUIT_COLORS: Record<string, string> = {
  s: 'text-poker-bg', c: 'text-poker-bg',
  h: 'text-red-600', d: 'text-red-600',
};
const SIZE_CLASSES = {
  xs: 'w-7 h-9 text-xs',   // opponent cards — ~30% smaller than sm
  sm: 'w-9 h-12 text-sm',
  md: 'w-11 h-14 text-base',
  lg: 'w-14 h-20 text-xl',
};

type AnimPhase = 'hidden' | 'sliding' | 'flipping' | 'done';

export function Card({ card, size = 'md', facedown = false, winning = false, selectedForDiscard = false, onClick, dealIndex, slowFlip = false }: Props) {
  const [phase, setPhase] = useState<AnimPhase>(dealIndex !== undefined ? 'hidden' : 'done');

  useEffect(() => {
    if (dealIndex === undefined) return;
    // slowFlip = community card reveal — more dramatic, slower timing
    // Normal = hole card deal — quick stagger
    const stagger  = slowFlip ? dealIndex * 200 : dealIndex * 80;
    const slideAt  = slowFlip ? stagger + 100    : stagger;
    const flipAt   = slowFlip ? slideAt + 250    : slideAt + 180;
    const doneAt   = slowFlip ? flipAt  + 450    : flipAt  + 220;
    const t1 = setTimeout(() => setPhase('sliding'),  slideAt);
    const t2 = setTimeout(() => setPhase('flipping'), flipAt);
    const t3 = setTimeout(() => setPhase('done'),     doneAt);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [dealIndex, slowFlip]);

  if (!card || facedown) {
    return (
      <div className={`${SIZE_CLASSES[size]} rounded-md bg-gradient-to-br from-poker-felt-light to-poker-felt-dark border border-poker-gold/50 flex items-center justify-center shadow-card`}>
        <div className="w-full h-full rounded-md border border-poker-gold/20 flex items-center justify-center">
          <span className="text-poker-gold/40 text-lg">♠</span>
        </div>
      </div>
    );
  }

  const rank = card[0];
  const suit = card[1];
  const displayRank = rank === 'T' ? '10' : rank;

  // Inline style per phase — rotateY simulates card flip
  const phaseStyle: React.CSSProperties =
    phase === 'hidden'   ? { opacity: 0, transform: 'translateY(-20px) rotateY(90deg) scale(0.85)' }
    : phase === 'sliding'  ? { opacity: 1, transform: 'translateY(0) rotateY(90deg) scale(1)',
        transition: slowFlip
          ? 'opacity 200ms ease-out, transform 300ms cubic-bezier(0.22,1,0.36,1)'
          : 'opacity 120ms ease-out, transform 180ms cubic-bezier(0.22,1,0.36,1)' }
    : phase === 'flipping' ? { opacity: 1, transform: 'translateY(0) rotateY(0deg) scale(1)',
        transition: slowFlip
          ? 'transform 450ms cubic-bezier(0.34,1.2,0.64,1)'
          : 'transform 220ms cubic-bezier(0.34,1.56,0.64,1)' }
    :                        { transition: 'transform 150ms ease, box-shadow 150ms ease' };

  const winningCls = winning
    ? '-translate-y-2 ring-2 ring-poker-gold ring-offset-2 ring-offset-poker-bg shadow-[0_0_12px_rgba(212,175,55,0.6)]'
    : '';
  const discardCls = selectedForDiscard ? 'translate-y-1.5 opacity-70 ring-2 ring-red-500' : '';
  const clickCls   = onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : '';

  return (
    <div
      onClick={onClick}
      style={{ perspective: '400px', ...phaseStyle }}
      className={`${SIZE_CLASSES[size]} rounded-md bg-white flex flex-col items-center justify-center shadow-card relative select-none ${winningCls} ${discardCls} ${clickCls}`}
    >
      {selectedForDiscard && (
        <div className="absolute inset-0 rounded-md bg-red-500/25 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-red-600 text-[7px] font-black">✕</span>
        </div>
      )}
      <span className={`${SUIT_COLORS[suit]} font-medium leading-none`}>{displayRank}</span>
      <span className={`${SUIT_COLORS[suit]} leading-none`}>{SUIT_SYMBOLS[suit]}</span>
    </div>
  );
}

export function CardPlaceholder({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`${SIZE_CLASSES[size]} rounded-md bg-white/5 border border-dashed border-poker-gold/25`} />
  );
}
