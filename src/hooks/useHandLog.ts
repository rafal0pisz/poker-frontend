'use client';

import { useCallback, useRef, useState } from 'react';
import type { Room, HandResult, GameVariant } from '@/lib/types';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'hand-start' | 'phase' | 'action' | 'draw' | 'result' | 'system';
  text: string;
  highlight?: boolean; // gold highlight for important entries
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

  // Track previous state to detect changes
  const prevHandNumberRef = useRef<number | null>(null);
  const prevPhaseRef = useRef<string | null>(null);
  const prevLastActionRef = useRef<string | null>(null);

  const addEntry = useCallback((e: LogEntry) => {
    setLogs((prev) => [...prev.slice(-200), e]); // keep last 200 entries
  }, []);

  const processRoomState = useCallback((room: Room, mySessionToken: string) => {
    const gs = room.gameState;
    if (!gs) return;

    const getPlayerNick = (token: string) =>
      room.players.find((p) => p.sessionToken === token)?.nick ?? token.slice(0, 6);

    const getChips = (token: string) =>
      room.players.find((p) => p.sessionToken === token)?.chips ?? 0;

    // ── New hand started ──
    if (gs.handNumber !== prevHandNumberRef.current) {
      prevHandNumberRef.current = gs.handNumber;
      prevPhaseRef.current = null;
      prevLastActionRef.current = null;

      const activePlayers = room.players.filter((p) =>
        ['playing', 'all-in'].includes(p.status)
      );
      const stackInfo = activePlayers
        .map((p) => `${p.nick} ${p.chips}`)
        .join(' · ');

      addEntry(entry('hand-start', `── Hand #${gs.handNumber} · ${VARIANT_NAMES[gs.variant]} ──`, true));
      addEntry(entry('system', `Stacks: ${stackInfo}`));

      const dealer = room.players.find((p) => p.seat === gs.dealerSeat);
      if (dealer) addEntry(entry('system', `Dealer: ${dealer.nick}`));
    }

    // ── Phase changed ──
    if (gs.phase !== prevPhaseRef.current) {
      prevPhaseRef.current = gs.phase;

      if (gs.phase === 'flop' && gs.communityCards.length >= 3) {
        const cards = gs.communityCards.slice(0, 3).join(' ');
        addEntry(entry('phase', `Flop: ${cards} · Pot ${gs.pot}`, true));
      } else if (gs.phase === 'turn' && gs.communityCards.length >= 4) {
        addEntry(entry('phase', `Turn: ${gs.communityCards[3]} · Pot ${gs.pot}`, true));
      } else if (gs.phase === 'river' && gs.communityCards.length >= 5) {
        addEntry(entry('phase', `River: ${gs.communityCards[4]} · Pot ${gs.pot}`, true));
      } else if (gs.phase === 'draw') {
        addEntry(entry('phase', `── Draw phase · Pot ${gs.pot} ──`, true));
      } else if (gs.phase === 'preflop') {
        addEntry(entry('phase', `Pre-flop · Pot ${gs.pot}`));
      }
    }

    // ── New action ──
    const lastAction = gs.lastAction;
    const actionKey = lastAction
      ? `${lastAction.playerSessionToken}-${lastAction.type}-${lastAction.timestamp}`
      : null;

    if (actionKey && lastAction && actionKey !== prevLastActionRef.current) {
      prevLastActionRef.current = actionKey;
      const nick = getPlayerNick(lastAction.playerSessionToken);
      const chips = getChips(lastAction.playerSessionToken);
      let text = '';
      switch (lastAction.type) {
        case 'fold':   text = `${nick} folds  (stack: ${chips})`; break;
        case 'check':  text = `${nick} checks  (stack: ${chips})`; break;
        case 'call':   text = `${nick} calls ${lastAction.amount ?? ''}  (stack: ${chips})`; break;
        case 'bet':    text = `${nick} bets ${lastAction.amount}  (stack: ${chips})`; break;
        case 'raise':  text = `${nick} raises to ${lastAction.amount}  (stack: ${chips})`; break;
        case 'all-in': text = `${nick} ALL-IN ${lastAction.amount}  (stack: 0)`; break;
      }
      if (text) addEntry(entry('action', text, lastAction.type === 'all-in'));
    }

    // ── Draw phase: track decisions from drawState ──
    if (gs.phase === 'draw' && gs.drawState) {
      const ds = gs.drawState;
      for (const [token, ps] of Object.entries(ds.playerStates)) {
        if (!ps.hasDrawn) continue;
        const nick = getPlayerNick(token);
        const discardCount = ps.discardIndices.length;
        const entryKey = `draw-${token}-${discardCount}-${ps.hasDecided}-${ps.accepted}`;

        // We use the action key pattern to avoid duplicates
        if (ps.hasDecided) {
          const drawKey = `draw-decided-${token}-${ps.accepted}`;
          if (drawKey !== prevLastActionRef.current) {
            prevLastActionRef.current = drawKey;
            if (discardCount === 0) {
              addEntry(entry('draw', `${nick} stands pat`));
            } else if (discardCount === 1) {
              const decision = ps.accepted ? 'took open card' : 'rejected → drew blind';
              addEntry(entry('draw', `${nick} exchanged 1 → ${decision}`));
            } else {
              addEntry(entry('draw', `${nick} exchanged ${discardCount} cards`));
            }
          }
        }
      }
    }
  }, [addEntry]);

  const processHandResult = useCallback((result: HandResult, players: Room['players']) => {
    const getPlayerNick = (token: string) =>
      players.find((p) => p.sessionToken === token)?.nick ?? token.slice(0, 6);

    // Header with Hand # and board cards
    const handNum = result.handNumber ? `Hand #${result.handNumber}` : '';
    const board = result.boardCards && result.boardCards.length > 0
      ? `  Board: ${result.boardCards.join(' ')}` : '';
    addEntry(entry('phase', `── ${handNum}${board} ──`, true));

    // Show all cards at showdown
    if (result.showdownCards.length > 0) {
      for (const sc of result.showdownCards) {
        const nick = getPlayerNick(sc.sessionToken);
        addEntry(entry('action', `${nick}: ${sc.cards.join(' ')}  (${sc.handName})`));
      }
    }

    // Result
    if (result.drawmahaResult) {
      const { omahaWinner, texasWinner } = result.drawmahaResult;
      const isScoop = omahaWinner.sessionToken === texasWinner.sessionToken;
      if (isScoop) {
        const nick = getPlayerNick(omahaWinner.sessionToken);
        const total = omahaWinner.amount + texasWinner.amount;
        addEntry(entry('result', `🎯 SCOOP: ${nick} wins ${total} (Omaha: ${omahaWinner.handDescription} · Draw: ${texasWinner.handDescription})`, true));
      } else {
        const omahaNick = getPlayerNick(omahaWinner.sessionToken);
        const texasNick = getPlayerNick(texasWinner.sessionToken);
        addEntry(entry('result', `Omaha: ${omahaNick} wins ${omahaWinner.amount} (${omahaWinner.handDescription})`, true));
        addEntry(entry('result', `Draw:  ${texasNick} wins ${texasWinner.amount} (${texasWinner.handDescription})`, true));
      }
    } else {
      for (const w of result.winnings) {
        const nick = getPlayerNick(w.sessionToken);
        const hand = w.handDescription ? ` (${w.handDescription})` : '';
        addEntry(entry('result', `🏆 ${nick} wins ${w.amount}${hand}`, true));
      }
    }

    // Final stacks
    const stackSummary = players
      .filter((p) => p.status !== 'spectator')
      .map((p) => `${p.nick} ${p.chips}`)
      .join(' · ');
    addEntry(entry('system', `Final stacks: ${stackSummary}`));
    addEntry(entry('system', '─────────────────────────'));
  }, [addEntry]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, processRoomState, processHandResult, clearLogs };
}
