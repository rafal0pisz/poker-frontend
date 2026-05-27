'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage } from '@/lib/types';

interface Props {
  message: ChatMessage | null;
  position?: 'above' | 'below'; // above avatar (for top row) or below (for "you")
}

const BUBBLE_LIFETIME_MS = 5000;

/**
 * Shows a floating speech bubble above (or below) a player avatar.
 * Auto-dismisses after BUBBLE_LIFETIME_MS.
 */
export function FloatingBubble({ message, position = 'above' }: Props) {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState<ChatMessage | null>(null);

  useEffect(() => {
    if (!message) return;
    setCurrentMsg(message);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), BUBBLE_LIFETIME_MS);
    return () => clearTimeout(t);
  }, [message?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentMsg || !visible) return null;

  // Reaction = bigger, no background
  const isReaction = currentMsg.type === 'reaction';

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
    position === 'above'
      ? 'bottom-full mb-2'
      : 'top-full mt-2';

  return (
    <div
      className={`absolute ${containerPosition} left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bubble-pop`}
      style={{
        animation: 'bubble-pop 200ms ease-out',
      }}
    >
      <div
        className={
          isReaction
            ? 'text-2xl'
            : 'bg-white text-poker-bg px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap max-w-[180px] truncate shadow-lg'
        }
      >
        {currentMsg.content}
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
