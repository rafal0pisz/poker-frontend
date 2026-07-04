'use client';

import type { ChatMessage } from '@/lib/types';
import { ReactionImage } from './ReactionImage';

interface Props {
  message: ChatMessage | null;
  position?: 'above' | 'below';
}

/**
 * Shows a floating speech bubble above (or below) a player avatar.
 * Fully controlled by parent: if message is null, bubble is hidden.
 * Parent handles auto-dismiss timing (via dismissedBubbleIds in PokerTable).
 */
export function FloatingBubble({ message, position = 'above' }: Props) {
  if (!message) return null;

  const isReaction = message.type === 'reaction';

  const arrowStyles =
    position === 'above'
      ? {
          bottom: '-4px',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid white',
        }
      : {
          top: '-4px',
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: '4px solid white',
        };

  const containerPosition =
    position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div
      key={message.id}
      className={`absolute ${containerPosition} left-1/2 -translate-x-1/2 z-20 pointer-events-none`}
      style={{ animation: 'bubble-pop 200ms ease-out' }}
    >
      <div
        className={
          isReaction
            ? ''
            : 'bg-white text-poker-bg px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap max-w-[180px] truncate shadow-lg relative'
        }
      >
        {isReaction ? <ReactionImage value={message.content} size={36} /> : message.content}
        {!isReaction && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              ...arrowStyles,
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes bubble-pop {
          0% { transform: translate(-50%, 4px) scale(0.85); opacity: 0; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
