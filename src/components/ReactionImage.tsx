'use client';

import { REACTION_IMAGE_SRC, REACTION_LABEL, type QuickReaction } from '@/lib/reactions';

interface Props {
  // Reaction content as stored on the ChatMessage — normally a QuickReaction
  // id, but chat history may still hold raw emoji sent before this change.
  value: string;
  size?: number;
}

export function ReactionImage({ value, size = 28 }: Props) {
  const src = REACTION_IMAGE_SRC[value as QuickReaction];
  if (!src) {
    // Legacy raw-emoji reaction (sent before the switch to image reactions) — show as-is.
    return <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>{value}</span>;
  }
  return (
    <img
      src={src}
      alt={REACTION_LABEL[value as QuickReaction] ?? ''}
      width={size}
      height={size}
      draggable={false}
      style={{ display: 'inline-block', objectFit: 'contain', verticalAlign: 'middle' }}
    />
  );
}
