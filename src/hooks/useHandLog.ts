'use client';

import { useCallback, useRef, useState } from 'react';
import type { Room, HandResult, GameVariant } from '@/lib/types';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'hand-start' | 'phase' | 'action' | 'draw' | 'result' | 'system';
  text: string;
  highlight?: boolean;
}

const VARIANT_NAMES: Record<GameVariant, string> = {
  texas: "Texas Hold'em",
  omaha: 'Omaha',
  drawmaha: 'Drawmaha',
  pineapple: 'Crazy Pineapple',
  'pineapple-classic': 'Pineapple Classic',
  'omaha-pl': 'Omaha Pot Limit',
  'drawmaha-pl': 'Drawmaha Pot Limit',
};

let _entryId = 0;
function makeId() { return String(++_entryId); }
function entry(type: LogEntry['type'], text: string, highlight = false): LogEntry {
  return { id: makeId(), timestamp: Date.now(), type, text, highlight };
}

export function useHandLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const prevHandNumberRef = useRef<number | null>(null);

  const addEntry = useCallback((e: LogEntry) => {
    setLogs((prev) => [...prev.slice(-200), e]);
  }, []);

  // processRoomState — track only new hand starts (no per-action logging)
  const processRoomState = useCallback((room: Room, _mySessionToken: string) => {
    const gs = room.gameState;
    if (!gs) return;
    if (gs.handNumber !== prevHandNumberRef.current) {
      prevHandNumberRef.current = gs.handNumber;
    }
  }, []);

  // processHandResult — full hand summary after hand ends
  const processHandResult = useCallback((result: HandResult, players: Room['players']) => {
    const getNick = (token: string) =>
      players.find((p) => p.sessionToken === token)?.nick ?? token.slice(0, 6);

    // ── Header: Hand # + variant + board ──
    const handNum = result.handNumber ? `Hand #${result.handNumber}` : 'Hand';
    const variant = result.variant ? ` · ${VARIANT_NAMES[result.variant as GameVariant] ?? result.variant}` : '';
    const board = result.boardCards && result.boardCards.length > 0
      ? `  Board: ${result.boardCards.join(' ')}` : '';
    addEntry(entry('hand-start', `── ${handNum}${variant}${board} ──`, true));

    // ── Showdown cards ──
    if (result.showdownCards.length > 0) {
      for (const sc of result.showdownCards) {
        addEntry(entry('action', `${getNick(sc.sessionToken)}: ${sc.cards.join(' ')}  (${sc.handName})`));
      }
    }

    // ── Result ──
    if (result.drawmahaResult) {
      const dr = result.drawmahaResult;
      const ow = dr.omahaWinners ?? [dr.omahaWinner];
      const tw = dr.texasWinners ?? [dr.texasWinner];
      const isScoop = ow.length === 1 && tw.length === 1 && ow[0].sessionToken === tw[0].sessionToken;
      if (isScoop) {
        const total = ow[0].amount + tw[0].amount;
        addEntry(entry('result', `🎯 ${getNick(ow[0].sessionToken)} scoops ${total} (Omaha: ${ow[0].handDescription} · Draw: ${tw[0].handDescription})`, true));
      } else {
        for (const w of ow) {
          const tieNote = ow.length > 1 ? ' (split)' : '';
          addEntry(entry('result', `Omaha: ${getNick(w.sessionToken)} +${w.amount}${tieNote} · ${w.handDescription}`, true));
        }
        for (const w of tw) {
          const tieNote = tw.length > 1 ? ' (split)' : '';
          addEntry(entry('result', `Draw: ${getNick(w.sessionToken)} +${w.amount}${tieNote} · ${w.handDescription}`, true));
        }
      }
    } else {
      for (const w of result.winnings) {
        const hand = w.handDescription ? ` · ${w.handDescription}` : '';
        addEntry(entry('result', `🏆 ${getNick(w.sessionToken)} +${w.amount}${hand}`, true));
      }
    }

    // ── Final stacks ──
    const stacks = players
      .filter((p) => p.status !== 'spectator')
      .map((p) => `${p.nick} ${p.chips}`)
      .join(' · ');
    addEntry(entry('system', `Stacks: ${stacks}`));
    addEntry(entry('system', '─────────────────────────────'));
  }, [addEntry]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, processRoomState, processHandResult, clearLogs };
}
