'use client';

import { useEffect, useState } from 'react';
import type { Achievement } from '@/hooks/useAchievements';

const COLORS: Record<Achievement['color'], { bg: string; border: string }> = {
  gold:   { bg: 'rgba(212,175,55,0.13)',  border: 'rgba(212,175,55,0.45)'  },
  blue:   { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.4)'   },
  green:  { bg: 'rgba(74,205,122,0.11)',  border: 'rgba(74,205,122,0.38)'  },
  red:    { bg: 'rgba(239,68,68,0.11)',   border: 'rgba(239,68,68,0.38)'   },
  purple: { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.4)'  },
};

function Toast({ achievement, onDone }: { achievement: Achievement; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[achievement.color];

  useEffect(() => {
    // Slide in on next tick
    const t1 = setTimeout(() => setVisible(true), 30);
    // Start slide-out after 4s
    const t2 = setTimeout(() => setVisible(false), 4000);
    // Remove from DOM after animation
    const t3 = setTimeout(onDone, 4350);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px 9px 12px',
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: c.bg,
        transition: 'transform 0.32s cubic-bezier(0.34,1.2,0.64,1), opacity 0.32s ease',
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
        minWidth: 210,
        maxWidth: 280,
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{achievement.icon}</span>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#f0e8cc', margin: 0, lineHeight: 1.3 }}>
          {achievement.title}
        </p>
        {achievement.subtitle && (
          <p style={{ fontSize: 10, color: 'rgba(245,230,192,0.45)', margin: '2px 0 0', lineHeight: 1.3 }}>
            {achievement.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

interface Props {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToast({ achievements, onDismiss }: Props) {
  if (achievements.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        right: 12,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {achievements.slice(-4).map((a) => (
        <Toast key={a.id} achievement={a} onDone={() => onDismiss(a.id)} />
      ))}
    </div>
  );
}
