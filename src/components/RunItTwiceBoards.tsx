'use client';

import type { Card as CardType, Player, PotWinBreakdown } from '@/lib/types';
import { Card, CardPlaceholder } from './Card';

interface Props {
  // Each board's community cards so far — 0 to 5 cards while dealing, 5 once done.
  boards: [CardType[], CardType[]];
  // Per-board pot breakdown — null until that board finishes dealing and gets evaluated.
  breakdowns: [PotWinBreakdown[] | null, PotWinBreakdown[] | null];
  // Which board is currently being dealt. Omit once both boards are final.
  activeBoard?: 0 | 1;
  players: Player[];
}

const ROW_ACCENT: [string, string] = ['rgb(var(--pk-gold-rgb))', '#6fb3c9'];

function nick(players: Player[], token: string): string {
  return players.find((p) => p.sessionToken === token)?.nick ?? '?';
}

function BoardRow({
  label, cards, breakdown, isActive, accent, players,
}: {
  label: string; cards: CardType[]; breakdown: PotWinBreakdown[] | null;
  isActive: boolean; accent: string; players: Player[];
}) {
  const winners = (breakdown ?? []).flatMap((pot) => pot.winners.filter((w) => w.amount > 0));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 }}>
      <span
        style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: accent, width: 50, textAlign: 'right', flexShrink: 0, opacity: isActive ? 1 : 0.7,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {[0, 1, 2, 3, 4].map((i) =>
          cards[i]
            ? <Card key={i} card={cards[i]} size="sm" />
            : <CardPlaceholder key={i} size="sm" />
        )}
      </div>
      {winners.length > 0 ? (
        <span style={{ fontSize: 10.5, color: accent, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {winners.map((w) => nick(players, w.sessionToken)).join(' & ')} +{winners.reduce((s, w) => s + w.amount, 0)}
        </span>
      ) : isActive ? (
        <span style={{ fontSize: 9.5, color: accent, opacity: 0.6, whiteSpace: 'nowrap' }}>dealing…</span>
      ) : null}
    </div>
  );
}

// Shown directly on the table (community-card area) both while a Run It
// Twice hand is being dealt (live, growing boards) and after it resolves
// (final, complete boards) — same component, same spot, so cards are never
// shown a second time somewhere else.
export function RunItTwiceBoards({ boards, breakdowns, activeBoard, players }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <BoardRow label="Board 1" cards={boards[0]} breakdown={breakdowns[0]} isActive={activeBoard === 0} accent={ROW_ACCENT[0]} players={players} />
      <BoardRow label="Board 2" cards={boards[1]} breakdown={breakdowns[1]} isActive={activeBoard === 1} accent={ROW_ACCENT[1]} players={players} />
    </div>
  );
}
