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
  omaha5: 'Omaha (5-card)',
  'omaha-hl': 'Omaha Hi-Lo',
  drawmaha: 'Drawmaha',
  pineapple: 'Crazy Pineapple',
  'pineapple-classic': 'Pineapple Classic',
  'omaha-pl': 'Omaha Pot Limit',
  'drawmaha-pl': 'Drawmaha Pot Limit',
  'drawmaha-bomb': 'Drawmaha Bomb Pot',
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

  // processRoomState — track only draw decisions (no calls/folds/raises)
  const prevDrawDecisionRef = useRef<Set<string>>(new Set());
  const processRoomState = useCallback((room: Room, _mySessionToken: string) => {
    const gs = room.gameState;
    if (!gs) return;

    if (gs.handNumber !== prevHandNumberRef.current) {
      prevHandNumberRef.current = gs.handNumber;
      prevDrawDecisionRef.current = new Set(); // reset for new hand
    }

    // ── Drawmaha draw decisions ──
    // Check drawState regardless of phase: the last player to decide triggers
    // a phase advance, so by the time the frontend receives the state the
    // phase may already be 'reveal'. drawState persists, so we log here too.
    if (gs.drawState) {
      const getNick = (token: string) =>
        room.players.find((p) => p.sessionToken === token)?.nick ?? token.slice(0, 6);
      for (const [token, ps] of Object.entries(gs.drawState.playerStates)) {
        if (!ps.hasDecided) continue;
        const key = `draw-${token}-${ps.discardIndices.length}-${ps.accepted}`;
        if (prevDrawDecisionRef.current.has(key)) continue; // already logged
        prevDrawDecisionRef.current.add(key);
        const nick = getNick(token);
        const n = ps.discardIndices.length;
        if (n === 0) {
          addEntry(entry('draw', `${nick} stands pat`));
        } else if (n === 1) {
          const decision = ps.accepted ? 'accepted open card' : 'rejected → drew blind';
          addEntry(entry('draw', `${nick} exchanged 1 → ${decision}`));
        } else {
          addEntry(entry('draw', `${nick} exchanged ${n} cards`));
        }
      }
    }
  }, [addEntry]);

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
    // Use result.winnings for TOTAL net gain (netAmount = what they won minus what they bet)
    const totalByToken = new Map<string, number>();
    for (const w of result.winnings) {
      const gain = w.netAmount !== undefined ? w.netAmount : w.amount;
      totalByToken.set(w.sessionToken, (totalByToken.get(w.sessionToken) ?? 0) + gain);
    }
    const getTotal = (token: string) => totalByToken.get(token) ?? 0;

    if (result.drawmahaResult) {
      const dr = result.drawmahaResult;
      const ow = dr.omahaWinners ?? [dr.omahaWinner];
      const tw = dr.texasWinners ?? [dr.texasWinner];
      const isScoop = ow.length === 1 && tw.length === 1 && ow[0].sessionToken === tw[0].sessionToken;
      if (isScoop) {
        const total = getTotal(ow[0].sessionToken);
        addEntry(entry('result', `🎯 ${getNick(ow[0].sessionToken)} scoops ${total} (Omaha: ${ow[0].handDescription} · Draw: ${tw[0].handDescription})`, true));
      } else {
        // Collect unique winners across both halves for total display
        const allTokens = new Set([...ow.map(w => w.sessionToken), ...tw.map(w => w.sessionToken)]);
        for (const token of allTokens) {
          const total = getTotal(token);
          const omahaW = ow.find(w => w.sessionToken === token);
          const drawW  = tw.find(w => w.sessionToken === token);
          const parts = [];
          if (omahaW) parts.push(`Omaha: ${omahaW.handDescription}${ow.length > 1 ? ' (split)' : ''}`);
          if (drawW)  parts.push(`Draw: ${drawW.handDescription}${tw.length > 1 ? ' (split)' : ''}`);
          addEntry(entry('result', `🏆 ${getNick(token)} +${total} · ${parts.join(' · ')}`, true));
        }
      }
    } else {
      for (const w of result.winnings) {
        const gain = w.netAmount !== undefined ? w.netAmount : w.amount;
        const hand = w.handDescription ? ` · ${w.handDescription}` : '';
        addEntry(entry('result', `🏆 ${getNick(w.sessionToken)} +${gain}${hand}`, true));
      }
    }

    // ── Final stacks — use result.playerStacks (captured post-distribution on backend)
    // DO NOT use players[] here — roomRef.current may have stale chips due to React
    // async state update ordering (room:state and hand-result arrive nearly simultaneously)
    const stackSource = result.playerStacks;
    if (stackSource && stackSource.length > 0) {
      const stacks = stackSource.map(p => `${p.nick} ${p.chips}`).join(' · ');
      addEntry(entry('system', `Stacks: ${stacks}`));
    }
    addEntry(entry('system', '─────────────────────────────'));
  }, [addEntry]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, processRoomState, processHandResult, clearLogs };
}
