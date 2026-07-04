'use client';

import { memo, useEffect, useState } from 'react';
import type { Card as CardType } from '@/lib/types';

interface Props {
  card?: CardType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  facedown?: boolean;
  // Part of the (primary) winning hand — gold ring. In a split pot
  // (Omaha Hi-Lo, Drawmaha) this marks the High / Omaha hand.
  winning?: boolean;
  // Part of the OTHER winning hand in a split pot — the Low / Draw hand.
  // Teal ring. A card that's both `winning` and `winningSecondary` (e.g. a
  // shared board card used by both hands) gets a ring split in half.
  winningSecondary?: boolean;
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

export const Card = memo(function Card({ card, size = 'md', facedown = false, winning = false, winningSecondary = false, selectedForDiscard = false, onClick, dealIndex, slowFlip = false }: Props) {
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

  // Split-pot highlight: 'both' when a card is part of BOTH winning hands
  // (e.g. a shared board card used by the High hand and the Low hand) —
  // rendered as a ring split diagonally between the two colors, rather than
  // just picking one color and losing the other half of the information.
  const highlight: 'none' | 'primary' | 'secondary' | 'both' =
    winning && winningSecondary ? 'both' : winning ? 'primary' : winningSecondary ? 'secondary' : 'none';

  const winningCls =
    highlight === 'primary' ? '-translate-y-2 ring-2 ring-poker-gold ring-offset-2 ring-offset-poker-bg shadow-[0_0_12px_rgba(var(--pk-gold-rgb),0.6)]'
    : highlight === 'secondary' ? '-translate-y-2 ring-2 ring-[#6fb3c9] ring-offset-2 ring-offset-poker-bg shadow-[0_0_12px_rgba(111,179,201,0.55)]'
    : highlight === 'both' ? '-translate-y-2'
    : '';
  // Tailwind's `ring` utility can't express a two-color split, so the 'both'
  // case gets a gradient-border via the background-clip trick instead —
  // border-box layer paints the gradient, padding-box layer paints white
  // back over the middle, leaving only a rounded-rect "ring" of gradient.
  const splitRingStyle: React.CSSProperties | undefined = highlight === 'both' ? {
    border: '3px solid transparent',
    backgroundImage:
      'linear-gradient(#fff, #fff), linear-gradient(135deg, rgb(var(--pk-gold-rgb)) 0%, rgb(var(--pk-gold-rgb)) 49%, #6fb3c9 51%, #6fb3c9 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 0 12px rgba(var(--pk-gold-rgb),0.35)',
  } : undefined;
  const discardCls = selectedForDiscard ? 'translate-y-1.5 opacity-70 ring-2 ring-red-500' : '';
  const clickCls   = onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : '';

  return (
    <div
      onClick={onClick}
      style={{ perspective: '400px', ...phaseStyle, ...splitRingStyle }}
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
});

export const CardPlaceholder = memo(function CardPlaceholder({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`${SIZE_CLASSES[size]} rounded-md bg-white/5 border border-dashed border-poker-gold/25`} />
  );
});
