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

  // processRoomState — track only draw decisions (no calls/folds/raises)
  const prevDrawDecisionRef = useRef<string>('');
  const processRoomState = useCallback((room: Room, _mySessionToken: string) => {
    const gs = room.gameState;
    if (!gs) return;

    if (gs.handNumber !== prevHandNumberRef.current) {
      prevHandNumberRef.current = gs.handNumber;
      prevDrawDecisionRef.current = '';
    }

    // ── Drawmaha draw decisions ──
    if (gs.phase === 'draw' && gs.drawState) {
      const getNick = (token: string) =>
        room.players.find((p) => p.sessionToken === token)?.nick ?? token.slice(0, 6);
      for (const [token, ps] of Object.entries(gs.drawState.playerStates)) {
        if (!ps.hasDecided) continue;
        const key = `draw-${token}-${ps.discardIndices.length}-${ps.accepted}`;
        if (key === prevDrawDecisionRef.current) continue;
        prevDrawDecisionRef.current = key;
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
    // Use result.winnings for TOTAL amounts (drawmahaResult only has main pot amounts)
    const totalByToken = new Map<string, number>();
    for (const w of result.winnings) {
      totalByToken.set(w.sessionToken, (totalByToken.get(w.sessionToken) ?? 0) + w.amount);
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
        const hand = w.handDescription ? ` · ${w.handDescription}` : '';
        addEntry(entry('result', `🏆 ${getNick(w.sessionToken)} +${w.amount}${hand}`, true));
      }
    }

    // ── Final stacks — use playerStacks from result (accurate post-hand chips) ──
    const stackSource = result.playerStacks ?? players.filter(p => p.status !== 'spectator').map(p => ({ nick: p.nick, chips: p.chips, sessionToken: p.sessionToken }));
    const stacks = stackSource.map(p => `${p.nick} ${p.chips}`).join(' · ');
    addEntry(entry('system', `Stacks: ${stacks}`));
    addEntry(entry('system', '─────────────────────────────'));
  }, [addEntry]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, processRoomState, processHandResult, clearLogs };
}
