'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Room, Card as CardType, HandResult, ChatMessage, GameVariant } from '@/lib/types';
import type { LogEntry } from '@/hooks/useHandLog';
import { Card, CardPlaceholder } from './Card';
import { PlayerSeat } from './PlayerSeat';
import { ActionPanel } from './ActionPanel';
import { FloatingBubble } from './FloatingBubble';
import { useEquity } from '@/hooks/useEquity';
import { PlayerStatsModal } from './PlayerStatsModal';

const VARIANT_LABELS: Record<GameVariant, string> = {
  texas: "Texas Hold'em",
  omaha: 'Omaha',
  pineapple: 'Crazy Pineapple',
  'pineapple-classic': 'Pineapple Classic',
  'omaha-pl': 'Omaha Pot Limit',
  'drawmaha-pl': 'Drawmaha Pot Limit',
  drawmaha: 'Drawmaha',
};

// 7 seat positions around the oval (as % of oval width/height)
// Seat 0 = YOU at bottom-center
// Opponents go CLOCKWISE starting from MY LEFT (position 1)
// so the player immediately left of me (SB if I'm dealer) appears on my screen-left
const SEAT_POSITIONS = [
  { top: '96%',  left: '50%' },  // 0 = YOU — bottom-center
  { top: '58%',  left: '2%'  },  // 1 = left  (first clockwise = my immediate left)
  { top: '12%',  left: '18%' },  // 2 = upper-left
  { top: '4%',   left: '50%' },  // 3 = top-center (opposite)
  { top: '12%',  left: '82%' },  // 4 = upper-right
  { top: '58%',  left: '98%' },  // 5 = right (my immediate right)
  { top: '96%',  left: '80%' },  // 6 = bottom-right (just to my right)
];

type BetSide = 'left' | 'right' | 'top' | 'bottom';
interface BetChipProps { amount: number; side?: BetSide }
function BetChip({ amount, side = 'bottom' }: BetChipProps) {
  const styleMap: Record<BetSide, React.CSSProperties> = {
    bottom: { position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)' },
    top:    { position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)' },
    left:   { position: 'absolute', left: -36, top: '50%', transform: 'translateY(-50%)' },
    right:  { position: 'absolute', right: -36, top: '50%', transform: 'translateY(-50%)' },
  };
  return (
    <div style={{ ...styleMap[side], background: '#d4af37', color: '#070709', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 20 }}>
      {amount}
    </div>
  );
}

// Oval seat component — mini version for around-the-table display
function OvalSeat({
  player, isCurrent, isDealer, isSb, isBb, seatIndex, cardCount, onAvatarClick, equity,
  winningCards, lastMessage, handName, actionDeadline, actionTimeoutSec, revealedCards,
}: {
  player: Room['players'][0]; isCurrent: boolean; isDealer: boolean;
  isSb: boolean; isBb: boolean; seatIndex: number; cardCount: number;
  winningCards: Set<CardType>; lastMessage: ChatMessage | null; handName?: string; onAvatarClick?: () => void; equity?: number;
  actionDeadline?: number | null; actionTimeoutSec?: number; revealedCards?: CardType[];
}) {
  const pos = SEAT_POSITIONS[seatIndex];
  const isFolded = player.status === 'folded';
  const shownCards = revealedCards || player.holeCards || [];
  const hasCards = shownCards.length > 0;

  // Chip bet direction — push inward toward center
  // Bet chips pushed toward center based on seat position
  const betSide: BetSide = seatIndex === 0 ? 'top'
    : seatIndex === 1 ? 'bottom'
    : seatIndex === 2 ? 'bottom'
    : seatIndex === 3 ? 'left'
    : seatIndex === 4 ? 'bottom'
    : seatIndex === 5 ? 'right'
    : 'top'; // 6 = bottom-right → top

  return (
    <div style={{ position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10, opacity: isFolded ? 0.4 : 1 }}>
      <FloatingBubble message={lastMessage} position="above" />

      {/* Cards above avatar for top seats, below for bottom */}
      {seatIndex >= 3 && (
        <div style={{ display: 'flex', gap: 2 }}>
          {hasCards
            ? shownCards.map((c, i) => <Card key={i} card={c} size="md" winning={winningCards.has(c)} />)
            : (player.status === 'playing' || player.status === 'all-in' || isFolded)
              ? Array.from({ length: cardCount }).map((_, i) => <Card key={i} size="md" facedown />)
              : null}
        </div>
      )}

      {/* Avatar */}
      <div style={{ position: 'relative', width: 42, height: 42 }}>
        {/* Timer ring */}
        {isCurrent && actionDeadline && (
          <TimerRingSmall deadline={actionDeadline} timeoutSec={actionTimeoutSec ?? 30} />
        )}
        <div onClick={onAvatarClick} style={{ width: 42, height: 42, borderRadius: '50%', background: isCurrent ? 'rgba(212,175,55,0.2)' : '#1a1a28', border: isCurrent ? '2px solid #d4af37' : '1.5px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: isCurrent ? '#d4af37' : 'rgba(245,230,192,0.6)', boxShadow: isCurrent ? '0 0 12px rgba(212,175,55,0.3)' : 'none', position: 'relative', cursor: onAvatarClick ? 'pointer' : 'default' }}>
          {player.nick.slice(0, 2).toUpperCase()}
          {isDealer && <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: '#fff', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</span>}
          {isSb && !isDealer && <span style={{ position: 'absolute', bottom: -4, left: -4, width: 14, height: 14, background: '#3b82f6', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</span>}
          {isBb && !isDealer && <span style={{ position: 'absolute', bottom: -4, right: -4, width: 14, height: 14, background: '#7c3aed', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>B</span>}
        </div>
        {player.currentBet > 0 && <BetChip amount={player.currentBet} side={betSide as 'top' | 'bottom' | 'left' | 'right'} />}
        {player.status === 'all-in' && (
          <span style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(220,38,38,0.2)', color: '#f87171', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 6, whiteSpace: 'nowrap', border: '1px solid rgba(220,38,38,0.3)' }}>ALL-IN</span>
        )}
      </div>

      {/* Name + chips */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 9, color: isCurrent ? '#d4af37' : 'rgba(245,230,192,0.55)', whiteSpace: 'nowrap', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.nick}</p>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(245,230,192,0.85)' }}>{player.chips}</p>
      </div>

      {/* Hand name at showdown */}
      {handName && <span style={{ fontSize: 8, color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 4, padding: '1px 5px', maxWidth: 80, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{handName}</span>}
      {equity !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 700, color: equity >= 50 ? '#4ade80' : '#f87171', background: equity >= 50 ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)', border: `1px solid ${equity >= 50 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' }}>
          {equity}%
        </span>
      )}

      {/* Cards below avatar for bottom seats */}
      {seatIndex < 3 && (
        <div style={{ display: 'flex', gap: 2 }}>
          {hasCards
            ? shownCards.map((c, i) => <Card key={i} card={c} size="md" winning={winningCards.has(c)} />)
            : (player.status === 'playing' || player.status === 'all-in' || isFolded)
              ? Array.from({ length: cardCount }).map((_, i) => <Card key={i} size="md" facedown />)
              : null}
        </div>
      )}
    </div>
  );
}

function TimerRingSmall({ deadline, timeoutSec }: { deadline: number; timeoutSec: number }) {
  const ref = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const R = 23, CIRC = 2 * Math.PI * R;
    const update = () => {
      const progress = Math.max(0, (deadline - Date.now()) / (timeoutSec * 1000));
      const color = progress > 0.4 ? '#d4af37' : progress > 0.2 ? '#e07b39' : '#e05050';
      if (ref.current) {
        ref.current.style.strokeDasharray = `${progress * CIRC} ${(1 - progress) * CIRC}`;
        ref.current.style.stroke = color;
      }
    };
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [deadline, timeoutSec]);
  const R = 23, CIRC = 2 * Math.PI * R;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'absolute', top: -3, left: -3, pointerEvents: 'none' }}>
      <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="3" />
      <circle ref={ref} cx="24" cy="24" r={R} fill="none" strokeWidth="3" strokeDasharray={`0 ${CIRC}`} strokeDashoffset={CIRC / 4} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.1s linear, stroke 0.3s' }} />
    </svg>
  );
}

export interface OvalTableProps {
  room: Room;
  mySessionToken: string;
  gameState: Room['gameState'];
  otherPlayers: Room['players'];
  me: Room['players'][0];
  myHoleCards: CardType[];
  myFoldedCards: CardType[];
  winningCardsSet: Set<CardType>;
  activeResult: HandResult | null;
  lastResult: HandResult | null;
  resultMessage: string;
  isShowdown: boolean;
  myHandShown: boolean;
  isSpectator: boolean;
  isAdmin: boolean;
  isSittingOut: boolean;
  canSitOut: boolean;
  muted: boolean;
  codeCopied: boolean;
  currentVariant: GameVariant;
  currentCardCount: number;
  isDrawPhase: boolean;
  revealedHands: Record<string, CardType[]>;
  sbSeat: number;
  bbSeat: number;
  prevCommCardCountRef: React.RefObject<number>;
  myBubbleToShow: ChatMessage | null;
  getBubble: (token: string) => ChatMessage | null;
  messages: ChatMessage[];
  sendChat: (t: string) => void;
  sendReaction: (e: string) => void;
  showDiscardUI: boolean;
  showRevealUI: boolean;
  nextDealerVariant: GameVariant | null;
  onLeave: () => void;
  onShowHand: () => void;
  onCopyCode: () => void;
  onToggleMute: () => void;
  onEnableAudio: () => void;
  onShowAdmin: () => void;
  onShowVariantPicker: () => void;
  drawUI: React.ReactNode;
  actionPanel: React.ReactNode;
  preActionButton?: React.ReactNode;
  resultPanel?: React.ReactNode;
  chipRequestUI?: React.ReactNode;
  handLogs?: LogEntry[];
  unreadCount: number;
  playerStats: Record<string, import('@/lib/types').PlayerStats>;
  onOpenChat: () => void;
  onSitBack: () => void;
  onSitOut: () => void;
  onTakeSeat: () => void;
}

export function OvalTable({
  room, mySessionToken, gameState, otherPlayers, me, myHoleCards, myFoldedCards,
  winningCardsSet, activeResult, lastResult, resultMessage,
  isShowdown, myHandShown, isSpectator, isAdmin, isSittingOut, canSitOut,
  muted, codeCopied, currentVariant, currentCardCount, isDrawPhase,
  revealedHands, sbSeat, bbSeat, prevCommCardCountRef,
  myBubbleToShow, getBubble, messages, sendChat, sendReaction,
  showDiscardUI, nextDealerVariant, onLeave, onShowHand,
  onCopyCode, onToggleMute, onEnableAudio, onShowAdmin, onShowVariantPicker,
  drawUI, actionPanel, preActionButton, resultPanel, chipRequestUI, handLogs, unreadCount, playerStats,
  onSitBack, onSitOut, onTakeSeat,
}: OvalTableProps) {

  // Assign visual seat positions (1-6) to opponents based on their seat order
  // relative to MY seat — so the visual layout matches the actual deal rotation.
  // The player immediately after me (clockwise in dealing order) goes to position 1
  // (top-center, opposite me), then continues clockwise around the oval.
  //
  // Bug fix: previously this used otherPlayers array index which didn't reflect
  // who comes after me in the dealing rotation, causing visual confusion with 6+ players.
  // We use the same algorithm as mobile: modulo by maxSeats for correct clockwise rotation.
  const mySeat = me?.seat ?? 0;
  const maxSeats = room.settings.maxSeats || 9;
  const opponentsByRotation = [...otherPlayers].sort((a, b) => {
    const aDist = (a.seat - mySeat + maxSeats) % maxSeats;
    const bDist = (b.seat - mySeat + maxSeats) % maxSeats;
    return aDist - bDist;
  });
  const seatedOpponents = opponentsByRotation.slice(0, 6).map((p, i) => ({ player: p, seatIndex: i + 1 }));
  const youPos = SEAT_POSITIONS[0];

  // Chat tab state
  const [tab, setTab] = useState<'chat' | 'actions' | 'summary'>('chat');
  const [selectedStatsToken, setSelectedStatsToken] = useState<string | null>(null);
  const tableColor = room.settings.tableColor || '#1a3a1a';

  // Equity — show at showdown AND during all-in runout
  // isShowdown comes from props — DO NOT redefine it
  const isAllInRunout = !isShowdown && Object.keys(revealedHands).length >= 2;
  const showEquity = isShowdown || isAllInRunout;
  const equityInput = showEquity
    ? isShowdown
      ? (activeResult?.showdownCards ?? null)
      : Object.entries(revealedHands).map(([token, cards]) => ({ sessionToken: token, cards }))
    : null;
  const equityResults = useEquity(equityInput, gameState?.communityCards ?? [], currentVariant);
  const equityMap = Object.fromEntries(equityResults.map(e => [e.sessionToken, e.equity]));
  const [chatText, setChatText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMessages = messages.filter(m => m.type !== 'system');
  const actionMessages = messages.filter(m => m.type === 'system');

  const activeSummary = room.players.filter(p => p.status !== 'spectator').map(p => ({ sessionToken: p.sessionToken, nick: p.nick, totalBuyIn: p.totalBuyIn, finalChips: p.chips, netResult: p.chips - p.totalBuyIn, leftAt: 0 }));
  const activeTokens = new Set(activeSummary.map(s => s.sessionToken));
  const allSummary = [...activeSummary, ...(room.sessionSummary ?? []).filter(s => !activeTokens.has(s.sessionToken))].sort((a, b) => b.netResult - a.netResult);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, tab]);

  const handleSendChat = () => {
    const t = chatText.trim();
    if (!t) return;
    sendChat(t);
    setChatText('');
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#070709', overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: 240, flexShrink: 0, background: '#0d0d17', borderRight: '1px solid rgba(212,175,55,0.1)', display: 'flex', flexDirection: 'column' }}>
        {/* Room code + controls */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={onCopyCode} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', flex: 1 }}>
            <span style={{ fontSize: 9, color: 'rgba(212,175,55,0.5)' }}>#</span>
            <span style={{ fontFamily: 'monospace', color: '#d4af37', fontSize: 13, letterSpacing: 2 }}>{room.id}</span>
            <span style={{ fontSize: 9, color: 'rgba(212,175,55,0.35)' }}>{codeCopied ? '✓' : '⧉'}</span>
          </button>
          <button onClick={() => { onEnableAudio(); onToggleMute(); }} style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 7, padding: '4px 8px', fontSize: 12, color: 'rgba(245,230,192,0.6)', cursor: 'pointer' }}>{muted ? '🔇' : '🔊'}</button>
          {isAdmin && <button onClick={onShowAdmin} style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>⚙ Admin</button>}
          {isSittingOut
            ? <button onClick={() => onSitBack()} style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 7, padding: '4px 8px', fontSize: 10, color: '#d4af37', cursor: 'pointer' }}>▶ Back</button>
            : canSitOut
            ? <button
                onClick={() => (me as any)?.pendingSitOut ? onSitBack() : onSitOut()}
                style={{
                  background: (me as any)?.pendingSitOut ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                  border: (me as any)?.pendingSitOut ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 7, padding: '4px 8px', fontSize: 10,
                  color: (me as any)?.pendingSitOut ? 'rgb(251,191,36)' : 'rgba(245,230,192,0.5)',
                  cursor: 'pointer',
                }}
              >
                {(me as any)?.pendingSitOut ? '✕ Cancel' : '⏸ Out'}
              </button>
            : null}
          <button onClick={onLeave} style={{ background: 'transparent', border: 'none', fontSize: 10, color: 'rgba(245,230,192,0.35)', cursor: 'pointer', padding: '4px 4px' }}>Leave</button>
        </div>

        {/* Variant pill */}
        <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(212,175,55,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 8, color: 'rgba(212,175,55,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Playing</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#d4af37' }}>{VARIANT_LABELS[currentVariant]}</span>
            {isDrawPhase && <span style={{ fontSize: 8, background: 'rgba(212,175,55,0.15)', color: '#d4af37', padding: '1px 5px', borderRadius: 4 }}>DRAW</span>}
          </div>
          <button onClick={onShowVariantPicker} style={{ background: '#d4af37', color: '#070709', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, border: 'none', cursor: 'pointer' }}>D ▾</button>
        </div>

        {/* Chat tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
          {(['chat', 'actions', 'summary'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px 4px', fontSize: 10, fontWeight: 500, color: tab === t ? '#d4af37' : 'rgba(245,230,192,0.3)', background: 'transparent', border: 'none', borderBottom: tab === t ? '2px solid #d4af37' : '2px solid transparent', cursor: 'pointer', transition: 'color 0.15s' }}>
              {t === 'chat' ? `💬 Chat${chatMessages.length > 0 && tab !== 'chat' ? ` (${chatMessages.length})` : ''}` : t === 'actions' ? `📋 Actions${actionMessages.length > 0 && tab !== 'actions' ? ` (${actionMessages.length})` : ''}` : `📊 Summary`}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 5, scrollbarWidth: 'none' }}>
          {tab === 'chat' && (chatMessages.length === 0
            ? <p style={{ fontSize: 11, color: 'rgba(245,230,192,0.25)', textAlign: 'center', marginTop: 20 }}>No messages yet</p>
            : chatMessages.map(m => (
              <div key={m.id} style={{ fontSize: 11, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600, color: m.senderSessionToken === mySessionToken ? '#d4af37' : 'rgba(212,175,55,0.6)' }}>{m.senderNick ?? 'You'}: </span>
                <span style={{ color: 'rgba(245,230,192,0.7)' }}>{m.content}</span>
                <span style={{ fontSize: 9, color: 'rgba(245,230,192,0.2)', marginLeft: 4 }}>{formatTime(m.timestamp)}</span>
              </div>
            ))
          )}
          {tab === 'actions' && (() => {
            const entries = handLogs && handLogs.length > 0 ? handLogs : [];
            if (entries.length === 0) return <p style={{ fontSize: 11, color: 'rgba(245,230,192,0.25)', textAlign: 'center', marginTop: 20 }}>No actions yet</p>;
            return entries.slice().reverse().map(e => (
              <p key={e.id} style={{
                fontSize: 10,
                color: e.highlight ? '#d4af37' : e.type === 'result' ? '#f5e6c0' : e.type === 'phase' ? 'rgba(212,175,55,0.7)' : 'rgba(245,230,192,0.45)',
                fontWeight: e.highlight ? 500 : 400,
                textAlign: (e.type === 'phase' || e.type === 'system') ? 'center' as const : 'left' as const,
                fontStyle: e.type === 'system' ? 'italic' : 'normal',
                lineHeight: 1.5, margin: '1px 0',
              }}>{e.text}</p>
            ));
          })()}
          {tab === 'summary' && (allSummary.length === 0
            ? <p style={{ fontSize: 11, color: 'rgba(245,230,192,0.25)', textAlign: 'center', marginTop: 20 }}>No data yet</p>
            : allSummary.map(s => {
              const isMe = s.sessionToken === mySessionToken;
              const pos = s.netResult > 0, neg = s.netResult < 0;
              return (
                <div key={s.sessionToken} style={{ background: isMe ? 'rgba(212,175,55,0.06)' : 'transparent', border: `1px solid ${isMe ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)'}`, borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(245,230,192,0.85)' }}>{s.nick}{isMe ? ' (you)' : ''}{s.leftAt > 0 ? ' · left' : ''}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: pos ? '#4ade80' : neg ? '#f87171' : 'rgba(245,230,192,0.4)' }}>{pos ? '+' : ''}{s.netResult}</span>
                  </div>
                  <p style={{ fontSize: 9, color: 'rgba(245,230,192,0.35)', marginTop: 2 }}>buy-in {s.totalBuyIn} · {s.leftAt > 0 ? 'left' : 'now'} {s.finalChips}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        {tab === 'chat' && (
          <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)', padding: 8, display: 'flex', gap: 6 }}>
            <input
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Message..."
              style={{ flex: 1, background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: 'rgba(245,230,192,0.7)', outline: 'none' }}
            />
            <button onClick={handleSendChat} style={{ width: 30, height: 30, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 7, color: '#d4af37', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          </div>
        )}
      </div>

      {/* ── TABLE AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* Oval table + seats */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 0 }}>
          <div style={{ position: 'relative', width: '76%', paddingBottom: '40%' }}>

            {/* Felt oval */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 35%, ${tableColor}ee, ${tableColor}99 70%, ${tableColor}44)`, border: '8px solid #1a0f04', boxShadow: '0 0 0 3px #3d2208, 0 0 0 5px #1a0f04, inset 0 0 100px rgba(0,0,0,0.5), 0 20px 80px rgba(0,0,0,0.7)' }}>
              <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.1)' }} />
            </div>

            {/* Community cards + pot — center of oval */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 5 }}>
              {lastResult && (
                <div style={{ fontSize: 11, color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '4px 12px', textAlign: 'center', maxWidth: 280 }}>
                  {resultMessage}
                </div>
              )}
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 700, color: '#d4af37' }}>
                POT {gameState ? gameState.pot : 0}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2, 3, 4].map(i => {
                  const card = gameState?.communityCards[i];
                  const isNew = card && i >= (prevCommCardCountRef.current ?? 0);
                  return card
                    ? <Card key={i} card={card} size="lg" winning={winningCardsSet.has(card)} dealIndex={isNew ? i - (prevCommCardCountRef.current ?? 0) : undefined} slowFlip={isNew} />
                    : <CardPlaceholder key={i} size="lg" />;
                })}
              </div>
              {gameState && <p style={{ fontSize: 9, color: 'rgba(212,175,55,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{gameState.phase} · #{gameState.handNumber}</p>}
            </div>

            {/* Opponent seats */}
            {seatedOpponents.map(({ player, seatIndex }) => (
              <OvalSeat
                key={player.sessionToken}
                player={player}
                isCurrent={gameState?.currentPlayerSeat === player.seat}
                isDealer={gameState?.dealerSeat === player.seat}
                isSb={player.seat === sbSeat}
                isBb={player.seat === bbSeat}
                seatIndex={seatIndex}
                cardCount={currentCardCount}
                winningCards={winningCardsSet}
                lastMessage={getBubble(player.sessionToken)}
                handName={activeResult?.showdownCards.find(sc => sc.sessionToken === player.sessionToken)?.handName}
                actionDeadline={gameState?.actionDeadline}
                actionTimeoutSec={room.settings.actionTimeoutSec}
                revealedCards={revealedHands[player.sessionToken]}
                onAvatarClick={() => setSelectedStatsToken(player.sessionToken)}
                equity={showEquity ? equityMap[player.sessionToken] : undefined}
              />
            ))}

            {/* YOU seat on oval — bottom-center */}
            <div style={{ position: 'absolute', top: youPos.top, left: youPos.left, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10 }}>
              {/* Cards above avatar (shown during hand) */}
              {!showDiscardUI && (
                <div style={{ display: 'flex', gap: 2 }}>
                  {myHoleCards.length > 0
                    ? myHoleCards.map((c, i) => <Card key={i} card={c} size="md" winning={winningCardsSet.has(c)} />)
                    : myFoldedCards.length > 0
                    ? myFoldedCards.map((fc, i) => (
                        <div key={i} style={{ opacity: 0.38, filter: 'grayscale(1)' }}>
                          <Card card={fc} size="md" winning={false} />
                        </div>
                      ))
                    : <><Card size="md" facedown /><Card size="md" facedown /></>
                  }
                </div>
              )}
              {/* Avatar */}
              <div style={{ position: 'relative', width: 42, height: 42 }}>
                <div onClick={() => setSelectedStatsToken(mySessionToken)} style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(99,179,237,0.15)', border: '2px solid rgba(99,179,237,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#90cdf4', position: 'relative', cursor: 'pointer' }}>
                  {me.nick.slice(0, 2).toUpperCase()}
                  {gameState?.dealerSeat === me.seat && <span style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: '#fff', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>D</span>}
                  {me.seat === sbSeat && gameState?.dealerSeat !== me.seat && <span style={{ position: 'absolute', bottom: -4, left: -4, width: 14, height: 14, background: '#3b82f6', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</span>}
                  {me.seat === bbSeat && gameState?.dealerSeat !== me.seat && <span style={{ position: 'absolute', bottom: -4, right: -4, width: 14, height: 14, background: '#7c3aed', borderRadius: '50%', fontSize: 7, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>B</span>}
                </div>
                {me.currentBet > 0 && (
                  <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: '#d4af37', color: '#070709', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 20 }}>{me.currentBet}</div>
                )}
              </div>
              {/* YOU badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(99,179,237,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>YOU</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(245,230,192,0.7)' }}>{me.chips}</span>
                {showEquity && equityMap[mySessionToken] !== undefined && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: (equityMap[mySessionToken] ?? 0) >= 50 ? '#4ade80' : '#f87171', background: (equityMap[mySessionToken] ?? 0) >= 50 ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)', border: `1px solid ${(equityMap[mySessionToken] ?? 0) >= 50 ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, borderRadius: 4, padding: '1px 6px' }}>
                    {equityMap[mySessionToken]}%
                  </span>
                )}
              </div>
            </div>

            {/* Waiting message */}
            {!gameState && otherPlayers.length === 0 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 5 }}>
                <p style={{ fontSize: 13, color: 'rgba(245,230,192,0.4)' }}>No one else here yet...</p>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{ flexShrink: 0, background: 'rgba(7,7,9,0.97)', borderTop: '1px solid rgba(212,175,55,0.1)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* FloatingBubble for own player is intentionally hidden in bottom bar */}
          {/* Own messages are visible to others via their FloatingBubbles */}
          <div style={{ position: 'relative' }} />

          {/* My info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: 'rgba(245,230,192,0.4)' }}>{me.nick} (you)</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f5e6c0' }}>{me.chips}</p>
            {gameState?.dealerSeat === me.seat && <span style={{ fontSize: 8, background: '#fff', color: '#070709', borderRadius: 10, padding: '1px 5px', fontWeight: 800 }}>D</span>}
          </div>

          <div style={{ width: 1, height: 44, background: 'rgba(212,175,55,0.1)', flexShrink: 0 }} />

          {/* Actions / draw UI */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isSpectator && (
              <button onClick={() => onTakeSeat()} style={{ background: '#d4af37', color: '#070709', fontWeight: 600, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13 }}>
                🪑 Take a seat
              </button>
            )}
            {!gameState && !isSpectator && (
              <p style={{ fontSize: 12, color: 'rgba(245,230,192,0.5)' }}>
                {isAdmin ? 'Open admin panel → Start game' : 'Waiting for admin to start…'}
                {nextDealerVariant && <span style={{ color: 'rgba(212,175,55,0.6)', marginLeft: 8 }}>▸ Next: {VARIANT_LABELS[nextDealerVariant]}</span>}
              </p>
            )}
            {drawUI}
            {isShowdown && !isSpectator && myHoleCards.length > 0 && (
              <button onClick={onShowHand} disabled={myHandShown} style={{ marginBottom: 6, padding: '5px 14px', borderRadius: 8, border: `1px solid ${myHandShown ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.2)'}`, background: myHandShown ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.06)', color: myHandShown ? '#d4af37' : 'rgba(245,230,192,0.6)', fontSize: 11, fontWeight: 500, cursor: myHandShown ? 'default' : 'pointer', display: 'block' }}>
                {myHandShown ? '✓ Hand shown' : 'Show Hand'}
              </button>
            )}
            {resultPanel}
            {preActionButton && (
              <div style={{ marginBottom: 6, width: '33%' }}>
                {preActionButton}
              </div>
            )}
            {chipRequestUI}
            {actionPanel}
          </div>
        </div>
      </div>
        {selectedStatsToken && (
          <PlayerStatsModal
            stats={playerStats[selectedStatsToken] ?? null}
            sessionResult={[
              ...room.players.map(p => ({ sessionToken: p.sessionToken, nick: p.nick, totalBuyIn: p.totalBuyIn, finalChips: p.chips, netResult: p.chips - p.totalBuyIn, leftAt: 0 })),
              ...(room.sessionSummary ?? [])
            ].find(s => s.sessionToken === selectedStatsToken)}
            onClose={() => setSelectedStatsToken(null)}
          />
        )}
    </div>
  );
}