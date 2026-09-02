'use client';

import { MEME_IMAGE_SRC, MEME_LABEL, type Meme } from '@/lib/memes';

interface Props {
  // Meme content as stored on the ChatMessage — a Meme id.
  value: string;
  size?: number;
}

export function MemeImage({ value, size = 120 }: Props) {
  const src = MEME_IMAGE_SRC[value as Meme];
  if (!src) return null; // unknown/legacy meme id — nothing sensible to show

  return (
    <img
      src={src}
      alt={MEME_LABEL[value as Meme] ?? ''}
      width={size}
      height={size}
      draggable={false}
      style={{
        display: 'inline-block',
        width: size,
        height: 'auto',
        maxHeight: size * 1.4,
        objectFit: 'cover',
        borderRadius: 10,
        border: '1px solid rgba(var(--pk-gold-rgb),0.25)',
        verticalAlign: 'middle',
      }}
    />
  );
}
