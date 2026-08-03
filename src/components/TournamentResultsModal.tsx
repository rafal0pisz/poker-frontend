'use client';

import type { Room } from '@/lib/types';

interface Props {
  room: Room;
  onClose: () => void;
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function TournamentResultsModal({ room, onClose }: Props) {
  const ts = room.tournamentState;
  if (!ts || !ts.finalResults) return null;

  const pool = (room.settings.tournamentSettings?.startingStack ?? 0) * ts.registeredTokens.length;
  // Everyone who registered, ranked by finishing place (winner first).
  const allPlaces = [...ts.eliminationOrder].sort((a, b) => a.place - b.place);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif italic text-lg text-poker-gold">🏆 Tournament Results</h2>
          <button onClick={onClose} className="text-poker-yellow/60 hover:text-poker-yellow text-2xl leading-none">×</button>
        </div>
        <p className="text-poker-yellow/50 text-xs mb-4">
          Prize pool: {pool.toLocaleString()} · {ts.registeredTokens.length} players
        </p>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {allPlaces.map((p) => {
            const payout = ts.finalResults!.find((r) => r.sessionToken === p.sessionToken);
            return (
              <div
                key={p.sessionToken}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  payout ? 'bg-poker-gold/10 border-poker-gold/30' : 'bg-poker-yellow/5 border-poker-gold/15'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg w-6 text-center">{MEDALS[p.place] ?? `${p.place}.`}</span>
                  <span className={`text-sm ${payout ? 'text-poker-yellow font-medium' : 'text-poker-yellow/70'}`}>{p.nick}</span>
                </div>
                {payout && (
                  <span className="text-poker-gold text-sm font-medium">+{payout.amount?.toLocaleString()}</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-poker-gold text-poker-bg font-medium py-3 rounded-xl active:scale-95 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
