'use client';

import type { Card as CardType } from '@/lib/types';

interface Props {
  card?: CardType;
  size?: 'sm' | 'md' | 'lg';
  facedown?: boolean;
  // If true, this card is part of the winning hand — highlight it
  winning?: boolean;
}

const SUIT_SYMBOLS: Record<string, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣',
};

const SUIT_COLORS: Record<string, string> = {
  s: 'text-poker-bg',
  c: 'text-poker-bg',
  h: 'text-red-600',
  d: 'text-red-600',
};

const SIZE_CLASSES = {
  sm: 'w-9 h-12 text-sm',
  md: 'w-11 h-14 text-base',
  lg: 'w-14 h-20 text-xl',
};

export function Card({ card, size = 'md', facedown = false, winning = false }: Props) {
  if (!card || facedown) {
    return (
      <div
        className={`${SIZE_CLASSES[size]} rounded-md bg-gradient-to-br from-poker-felt-light to-poker-felt-dark border border-poker-gold/50 flex items-center justify-center shadow-card`}
      >
        <div className="w-full h-full rounded-md border border-poker-gold/20 flex items-center justify-center">
          <span className="text-poker-gold/40 text-lg">♠</span>
        </div>
      </div>
    );
  }

  const rank = card[0];
  const suit = card[1];
  const symbol = SUIT_SYMBOLS[suit];
  const color = SUIT_COLORS[suit];
  const displayRank = rank === 'T' ? '10' : rank;

  // Winning card: gold ring + slight upward translation + glow
  const winningStyle = winning
    ? 'ring-2 ring-poker-gold ring-offset-2 ring-offset-poker-bg -translate-y-2 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
    : '';

  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-md bg-white flex flex-col items-center justify-center shadow-card transition-all duration-300 ${winningStyle}`}
    >
      <span className={`${color} font-medium leading-none`}>{displayRank}</span>
      <span className={`${color} leading-none`}>{symbol}</span>
    </div>
  );
}

export function CardPlaceholder({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-md bg-white/5 border border-dashed border-poker-gold/25`}
    />
  );
}
