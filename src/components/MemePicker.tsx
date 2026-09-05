'use client';

import { useState } from 'react';
import { MEMES } from '@/lib/memes';
import { MemeImage } from './MemeImage';

// Fixed page size so thumbnails always render at their real size (never
// shrunk to cram more in) — paging with arrows instead of wrapping/squeezing
// as the meme pack grows. Nav sits on its OWN row below the thumbnails
// (rather than beside them) so it never has to compete for width with the
// images — that's what caused arrows to get squeezed out of the narrow
// desktop sidebar in the first design.
const PAGE_SIZE = 5;

interface Props {
  onSend: (memeId: string) => void;
  size?: number;
  // Gap between thumbnails — kept configurable so a tighter container (e.g.
  // the 240px desktop sidebar) can shrink this without affecting the wider
  // mobile/modal pickers.
  gap?: number;
}

export function MemePicker({ onSend, size = 44, gap = 6 }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(MEMES.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = MEMES.slice(start, start + PAGE_SIZE);

  const navBtnStyle = (disabled: boolean) => ({
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(var(--pk-gold-rgb),0.15)',
    borderRadius: 6,
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(var(--pk-cream-rgb),0.5)',
    fontSize: 13,
    lineHeight: 1,
    opacity: disabled ? 0.3 : 1,
    cursor: disabled ? 'default' : 'pointer',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap, justifyContent: 'center', flexWrap: 'nowrap' }}>
        {visible.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onSend(id)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(var(--pk-gold-rgb),0.12)',
              borderRadius: 8,
              padding: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          ><MemeImage value={id} size={size} /></button>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 }}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={navBtnStyle(page === 0)}
          >‹</button>
          <span style={{ fontSize: 10, color: 'rgba(var(--pk-cream-rgb),0.35)' }}>{page + 1}/{totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={navBtnStyle(page === totalPages - 1)}
          >›</button>
        </div>
      )}
    </div>
  );
}
