'use client';

import { useEffect, useRef, useState } from 'react';
import type { Room, Card as CardType, HandResult, ChatMessage, GameVariant } from '@/lib/types';
import { getSocket } from '@/lib/socket';
import { clearSessionToken } from '@/lib/session';
import { Card, CardPlaceholder } from './Card';
import { PlayerSeat } from './PlayerSeat';
import { ActionPanel } from './ActionPanel';
import { AdminPanel } from './AdminPanel';
import { ChatModal } from './ChatModal';
import { FloatingBubble } from './FloatingBubble';
import { VariantPicker, VARIANT_LABELS } from './VariantPicker';
import { DrawmahaDraw } from './DrawmahaDraw';
import { DrawmahaReveal } from './DrawmahaReveal';
import { useSounds } from '@/hooks/useSounds';

interface Props {
  initialRoom: Room;
  mySessionToken: string;
  onLeave: () => void;
}

// ──────────────────────────────────────────────
// Sub-components (defined outside PokerTable)
// ──────────────────────────────────────────────

function ResultPanel({ lastResult, players, resultMessage }: {
  lastResult: HandResult | null;
  players: Room['players'];
  resultMessage: string;
}) {
  if (!lastResult) return null;
  const dr = lastResult.drawmahaResult;
  if (dr) {
    const omahaNick = players.find((p) => p.sessionToken === dr.omahaWinner.sessionToken)?.nick ?? '?';
    const texasNick = players.find((p) => p.sessionToken === dr.texasWinner.sessionToken)?.nick ?? '?';
    const isScoop = dr.omahaWinner.sessionToken === dr.texasWinner.sessionToken;
    return (
      <div className="mt-3 bg-poker-gold/15 border border-poker-gold/40 rounded-lg p-2 text-center">
        <p className="text-poker-gold text-xs mb-1">{isScoop ? '🎯 Scoop!' : '🃏 Split pot'}</p>
        <p className="text-poker-yellow text-xs">
          <span className="text-poker-gold/70">Omaha: </span>
          {omahaNick} ({dr.omahaWinner.handDescription}) +{dr.omahaWinner.amount}
        </p>
        <p className="text-poker-yellow text-xs mt-0.5">
          <span className="text-poker-gold/70">Draw: </span>
          {texasNick} ({dr.texasWinner.handDescription}) +{dr.texasWinner.amount}
        </p>
      </div>
    );
  }
  return (
    <div className="mt-3 bg-poker-gold/15 border border-poker-gold/40 rounded-lg p-2 text-center">
      <p className="text-poker-gold text-xs">🏆 Result:</p>
      <p className="text-poker-yellow text-sm font-medium mt-0.5">{resultMessage}</p>
    </div>
  );
}

function DrawCardsDisplay({ holeCards, discardIndices, submitted, onToggle }: {
  holeCards: CardType[];
  discardIndices: Set<number>;
  submitted: boolean;
  onToggle: (i: number) => void;
}) {
  if (submitted || holeCards.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="text-[10px] uppercase tracking-widest text-poker-gold/70 mb-2 text-center">
        Tap to discard
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {holeCards.map((c, i) => {
          const isSelected = discardIndices.has(i);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <Card
                card={c}
                size="lg"
                selectedForDiscard={isSelected}
                onClick={() => onToggle(i)}
                dealIndex={i}
              />
              {isSelected && (
                <span className="text-red-400 text-[9px] font-bold tracking-wider">DISCARD</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DesktopChat({ messages, mySessionToken, onSend }: {
  messages: ChatMessage[];
  mySessionToken: string;
  onSend: (t: string) => void;
}) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);
  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };
  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3 flex-1 flex flex-col min-h-0">
      <p className="font-serif italic text-poker-gold mb-2 text-sm">Chat</p>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 min-h-[200px]">
        {messages.length === 0 ? (
          <p className="text-poker-yellow/40 text-xs text-center mt-4">No messages yet</p>
        ) : (
          messages.map((m) => {
            if (m.type === 'system') {
              return <p key={m.id} className="text-center text-poker-gold/50 text-[10px] italic">{m.content}</p>;
            }
            const isMine = m.senderSessionToken === mySessionToken;
            const isReaction = m.type === 'reaction';
            return (
              <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={isReaction ? 'text-xl' : `max-w-[85%] px-2.5 py-1 rounded-xl text-[11px] ${isMine ? 'bg-poker-gold text-poker-bg' : 'bg-poker-yellow/10 text-poker-yellow border border-poker-gold/15'}`}>
                  {!isMine && !isReaction && <p className="text-[9px] opacity-70 leading-tight">{m.senderNick}</p>}
                  <p className={isReaction ? '' : 'break-words leading-tight'}>{m.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="flex gap-1 justify-center mt-2 pt-2 border-t border-poker-gold/10">
        {['👍', '😂', '🔥', '😎', '😠'].map((e) => (
          <button key={e} onClick={() => onSend(e)} className="bg-poker-yellow/5 hover:bg-poker-yellow/15 px-2 py-1 rounded-full text-sm active:scale-90 transition">{e}</button>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          maxLength={200}
          placeholder="Message..."
          className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 px-3 py-1.5 rounded-full text-poker-yellow text-xs outline-none placeholder:text-poker-yellow/40"
        />
        <button onClick={handleSend} disabled={!text.trim()} className="bg-poker-gold text-poker-bg w-7 h-7 rounded-full text-xs font-medium disabled:opacity-40 active:scale-95 flex items-center justify-center">↑</button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export function PokerTable({ initialRoom, mySessionToken, onLeave }: Props) {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [myHoleCards, setMyHoleCards] = useState<CardType[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVariantPicker, setShowVariantPicker] = useState(false);
  const [lastResult, setLastResult] = useState<HandResult | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [discardIndices, setDiscardIndices] = useState(new Set<number>());
  const [drawSubmitted, setDrawSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialRoom.messages || []);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastBubbleByPlayer, setLastBubbleByPlayer] = useState<Record<string, ChatMessage>>({});
  const [myLastBubble, setMyLastBubble] = useState<ChatMessage | null>(null);
  const [dismissedBubbleIds, setDismissedBubbleIds] = useState(new Set<string>());

  const { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute } = useSounds();

  const showChatRef = useRef(showChat);
  const messagesLengthRef = useRef(messages.length);
  const prevCurrentSeatRef = useRef<number | null>(null);
  const prevHandNumberRef = useRef<number | null>(null);

  useEffect(() => { showChatRef.current = showChat; }, [showChat]);
  useEffect(() => { messagesLengthRef.current = messages.length; }, [messages.length]);

  const me = room.players.find((p) => p.sessionToken === mySessionToken);

  useEffect(() => {
    const handNumber = room.gameState?.handNumber ?? null;
    if (handNumber !== prevHandNumberRef.current) {
      prevHandNumberRef.current = handNumber;
      setDiscardIndices(new Set<number>());
      setDrawSubmitted(false);
    }
  }, [room.gameState?.handNumber]);

  useEffect(() => {
    const socket = getSocket();

    const handleRoomState = (updated: Room) => {
      setRoom(updated);
      const myUpdated = updated.players.find((p) => p.sessionToken === mySessionToken);
      if (myUpdated?.holeCards) setMyHoleCards(myUpdated.holeCards);
      if (!updated.gameState) setMyHoleCards([]);
      if (updated.messages && updated.messages.length !== messagesLengthRef.current) {
        setMessages(updated.messages);
      }
      const newSeat = updated.gameState?.currentPlayerSeat ?? null;
      const mySeat = myUpdated?.seat ?? null;
      if (newSeat !== prevCurrentSeatRef.current && newSeat === mySeat && mySeat !== null && updated.gameState?.phase !== 'showdown') {
        playYourTurn();
      }
      prevCurrentSeatRef.current = newSeat;
      const lastAction = updated.gameState?.lastAction;
      if (lastAction) {
        if (['bet', 'raise', 'call', 'all-in'].includes(lastAction.type)) playChip();
        else if (lastAction.type === 'fold') playFold();
      }
    };

    const handleYourCards = (cards: CardType[]) => { setMyHoleCards(cards); playDeal(); };

    const handleHandResult = (result: HandResult) => {
      setLastResult(result);
      setTimeout(() => setLastResult(null), 6000);
      if (result.winnings.some((w) => w.sessionToken === mySessionToken && w.amount > 0)) playWin();
    };

    const handleClosed = (reason: string) => { alert(reason); clearSessionToken(room.id); onLeave(); };

    const handleChatMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.type !== 'system' && msg.senderSessionToken) {
        if (msg.senderSessionToken === mySessionToken) {
          setMyLastBubble(msg);
        } else {
          setLastBubbleByPlayer((prev) => ({ ...prev, [msg.senderSessionToken!]: msg }));
        }
        setTimeout(() => setDismissedBubbleIds((prev) => { const n = new Set(prev); n.add(msg.id); return n; }), 5000);
      }
      if (!showChatRef.current && msg.type !== 'system' && msg.senderSessionToken !== mySessionToken) {
        setUnreadCount((c) => c + 1);
      }
    };

    socket.on('room:state', handleRoomState);
    socket.on('game:your-cards', handleYourCards);
    socket.on('game:hand-result', handleHandResult);
    socket.on('room:closed', handleClosed);
    socket.on('chat:message', handleChatMessage);
    socket.on('game:draw-open-card', () => {});

    return () => {
      socket.off('room:state', handleRoomState);
      socket.off('game:your-cards', handleYourCards);
      socket.off('game:hand-result', handleHandResult);
      socket.off('room:closed', handleClosed);
      socket.off('chat:message', handleChatMessage);
      socket.off('game:draw-open-card');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionToken, room.id]);

  const handleDrawDiscard = () => {
    if (drawSubmitted) return;
    setDrawSubmitted(true);
    getSocket().emit('game:draw-discard', { discardIndices: [...discardIndices] }, (res: { ok: boolean; error?: string } | undefined) => {
      if (res && !res.ok) { console.error('[draw-discard]', res.error); setDrawSubmitted(false); }
    });
  };

  const handleDrawDecide = (accept: boolean) => {
    getSocket().emit('game:draw-decide', { accept }, (res: { ok: boolean; error?: string } | undefined) => {
      if (res && !res.ok) console.error('[draw-decide]', res.error);
    });
  };

  const toggleDiscardIndex = (idx: number) => {
    if (drawSubmitted) return;
    playSelect();
    setDiscardIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/?room=' + room.id);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch { /* ignore */ }
  };

  const sendChat = (text: string) => {
    const t = text.trim();
    if (!t) return;
    getSocket().emit('chat:send', { type: 'text', content: t }, (r: { ok: boolean; error?: string } | undefined) => {
      if (r && !r.ok) alert(r.error || 'Failed to send');
    });
  };

  const handleSetVariant = (variant: GameVariant) => {
    getSocket().emit('game:set-variant', { variant }, (r: { ok: boolean; error?: string } | undefined) => {
      if (r && !r.ok) alert(r.error || 'Failed');
      setShowVariantPicker(false);
    });
  };

  if (!me) return null;

  const gameState = room.gameState;
  const isAdmin = me.role === 'admin' || me.role === 'vice-admin';
  const isSittingOut = me.status === 'sitting-out';
  const isSpectator = me.status === 'spectator';
  const canSitOut = !!gameState && !['sitting-out', 'waiting', 'no-chips', 'spectator'].includes(me.status);

  const winningCardsSet = new Set<CardType>();
  const activeResult = lastResult || gameState?.lastHandResult;
  if (activeResult?.winningCards) {
    for (const c of activeResult.winningCards) winningCardsSet.add(c);
  }

  const currentVariant: GameVariant = gameState?.variant || 'texas';
  const currentCardCount = currentVariant === 'omaha' ? 4 : currentVariant === 'drawmaha' ? 5 : 2;

  const isDrawPhase = gameState?.phase === 'draw';
  const drawState = gameState?.drawState;
  const myDrawPlayerState = drawState?.playerStates[mySessionToken];
  const showDrawUI = isDrawPhase && drawState != null && (me.status === 'playing' || me.status === 'all-in');
  const showDiscardUI = showDrawUI && !(myDrawPlayerState?.hasDrawn ?? false);
  const showRevealUI = showDrawUI && (myDrawPlayerState?.hasDrawn ?? false) && (drawState?.currentDecidingSeat != null);

  const myBubbleToShow = (myLastBubble && !dismissedBubbleIds.has(myLastBubble.id)) ? myLastBubble : null;
  const getBubble = (token: string): ChatMessage | null => {
    const b = lastBubbleByPlayer[token];
    return (b && !dismissedBubbleIds.has(b.id)) ? b : null;
  };

  let resultMessage = '';
  if (lastResult) {
    if (lastResult.drawmahaResult) {
      const { omahaWinner, texasWinner } = lastResult.drawmahaResult;
      const on = room.players.find((p) => p.sessionToken === omahaWinner.sessionToken)?.nick ?? '?';
      const tn = room.players.find((p) => p.sessionToken === texasWinner.sessionToken)?.nick ?? '?';
      if (omahaWinner.sessionToken === texasWinner.sessionToken) {
        resultMessage = on + ' scoops! Omaha: ' + omahaWinner.handDescription + ' / Draw: ' + texasWinner.handDescription;
      } else {
        resultMessage = 'Split — Omaha: ' + on + ' +' + omahaWinner.amount + ' · Draw: ' + tn + ' +' + texasWinner.amount;
      }
    } else {
      resultMessage = lastResult.winnings.map((w) => {
        const nick = room.players.find((p) => p.sessionToken === w.sessionToken)?.nick || '?';
        return nick + ' (+' + w.amount + ')' + (w.handDescription ? ' · ' + w.handDescription : '');
      }).join(', ');
    }
  }

  let nextDealerVariant: GameVariant | null = null;
  if (!gameState) {
    const eligible = room.players.filter((p) => p.status !== 'spectator' && p.status !== 'disconnected').sort((a, b) => a.seat - b.seat);
    if (eligible[0]) nextDealerVariant = eligible[0].preferredVariant || 'texas';
  }

  const otherPlayers = room.players.filter((p) => p.sessionToken !== mySessionToken);

  return (
    <main className="min-h-screen">
      {/* ─── MOBILE ─── */}
      <div className="md:hidden flex flex-col p-3 max-w-md mx-auto min-h-screen">

        {/* TopBar */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <button onClick={copyCode} className="flex items-center gap-1.5 bg-poker-gold/10 border border-poker-gold/20 px-3 py-1.5 rounded-lg flex-shrink-0">
            <span className="text-poker-gold/60 text-xs">#</span>
            <span className="font-mono text-poker-gold text-sm tracking-wider">{room.id}</span>
            <span className="text-poker-gold/40 text-[10px]">{codeCopied ? '✓' : '⧉'}</span>
          </button>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} className="bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow/70 text-xs px-2.5 py-1.5 rounded-lg">
              {muted ? '🔇' : '🔊'}
            </button>
            <button onClick={() => { setShowChat(true); setUnreadCount(0); }} className="md:hidden relative bg-poker-gold/10 border border-poker-gold/30 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">
              💬
              {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-poker-coral text-poker-bg text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>
            {isSittingOut
              ? <button onClick={() => getSocket().emit('game:sit-back')} className="bg-poker-gold/20 border border-poker-gold/50 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">▶ Sit back</button>
              : canSitOut
              ? <button onClick={() => getSocket().emit('game:sit-out')} className="bg-poker-yellow/5 border border-poker-gold/25 text-poker-yellow/70 text-xs px-2.5 py-1.5 rounded-lg">⏸ Sit out</button>
              : null}
            {isAdmin && <button onClick={() => setShowAdminPanel(true)} className="bg-poker-gold/15 border border-poker-gold/40 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">⚙ Admin</button>}
            <button onClick={() => { if (confirm("Leave? You'll lose your seat.")) { getSocket().emit('room:leave'); clearSessionToken(room.id); onLeave(); } }} className="text-poker-yellow/60 text-xs px-2 py-1.5">Leave</button>
          </div>
        </div>

        {/* Variant bar */}
        <div className="flex items-center justify-between border border-poker-gold/30 px-3 py-1.5 rounded-lg mb-2" style={{ background: 'rgba(212,175,55,0.08)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-poker-gold/60 text-[9px] tracking-widest flex-shrink-0">NOW PLAYING</span>
            <span className="text-poker-gold text-xs font-medium truncate">{VARIANT_LABELS[currentVariant]}</span>
            {isDrawPhase && <span className="text-[9px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded tracking-wider animate-pulse">DRAW</span>}
          </div>
          <button onClick={() => setShowVariantPicker(true)} className="bg-poker-gold text-poker-bg text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
            D <span className="text-[9px] opacity-70">▾</span>
          </button>
        </div>

        {/* Other players */}
        <div className="flex justify-around items-start py-3 flex-wrap gap-3 min-h-[110px]">
          {otherPlayers.length === 0
            ? <p className="text-poker-yellow/40 text-sm self-center">No one else here yet...</p>
            : otherPlayers.map((p) => (
                <PlayerSeat
                  key={p.sessionToken}
                  player={p}
                  isCurrent={gameState?.currentPlayerSeat === p.seat}
                  isDealer={gameState?.dealerSeat === p.seat}
                  isSb={false}
                  isBb={false}
                  isYou={false}
                  lastMessage={getBubble(p.sessionToken)}
                  handName={activeResult?.showdownCards.find((sc) => sc.sessionToken === p.sessionToken)?.handName}
                  winningCards={winningCardsSet}
                  cardCount={currentCardCount}
                />
              ))}
        </div>

        {/* Table center */}
        <div className="poker-felt rounded-2xl p-4 my-2">
          <p className="text-center text-[10px] text-poker-gold/70 tracking-widest mb-1">POT</p>
          <p className="text-center text-2xl text-poker-yellow font-medium mb-3">{gameState ? gameState.pot : 0}</p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => {
              const card = gameState?.communityCards[i];
              return card
                ? <Card key={i} card={card} size="md" winning={winningCardsSet.has(card)} />
                : <CardPlaceholder key={i} size="md" />;
            })}
          </div>
          {gameState && <p className="text-center text-[10px] text-poker-gold/60 tracking-widest mt-2 uppercase">{gameState.phase} · hand #{gameState.handNumber}</p>}
          <ResultPanel lastResult={lastResult} players={room.players} resultMessage={resultMessage} />
        </div>

        <div className="flex-1" />

        {/* Player section */}
        <div className="relative bg-poker-yellow/5 rounded-2xl p-3 border border-poker-gold/25">
          <div className="absolute -top-2 right-4 z-10">
            <FloatingBubble message={myBubbleToShow} position="above" />
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-poker-yellow font-medium text-sm flex items-center gap-2">
                {me.nick}
                <span className="text-poker-yellow/50 text-xs">(you)</span>
                {me.role !== 'player' && <span className="text-[9px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded">{me.role}</span>}
              </p>
              <p className="text-poker-yellow/60 text-xs">Chips: <span className="text-poker-gold font-medium">{me.chips}</span></p>
            </div>
            {!showDiscardUI && (
              <div className={myHoleCards.length >= 5 ? 'flex -space-x-2' : 'flex gap-0.5'}>
                {myHoleCards.length > 0
                  ? myHoleCards.map((c, i) => (
                      <Card key={i} card={c} size={myHoleCards.length >= 5 ? 'sm' : myHoleCards.length >= 4 ? 'md' : 'lg'} winning={winningCardsSet.has(c)} dealIndex={i} />
                    ))
                  : <>
                      <CardPlaceholder size="lg" />
                      <CardPlaceholder size="lg" />
                    </>}
              </div>
            )}
          </div>

          {isSpectator && (
            <div className="bg-poker-gold/10 border-2 border-poker-gold/40 rounded-xl p-4 text-center mb-2">
              <p className="text-poker-gold text-base font-medium mb-1">👀 You are watching</p>
              <p className="text-poker-yellow/70 text-xs mb-3">Take a seat to join the game.</p>
              <button
                onClick={() => getSocket().emit('game:take-seat', (r: { ok: boolean; error?: string } | undefined) => { if (r && !r.ok) alert(r.error); })}
                className="w-full bg-poker-gold text-poker-bg font-medium py-3 rounded-lg active:scale-95"
              >
                🪑 Take a seat
              </button>
            </div>
          )}

          {showDiscardUI && drawState && (
            <DrawCardsDisplay
              holeCards={myHoleCards}
              discardIndices={discardIndices}
              submitted={drawSubmitted}
              onToggle={toggleDiscardIndex}
            />
          )}

          {showDiscardUI && drawState && (
            <DrawmahaDraw
              discardCount={discardIndices.size}
              drawState={drawState}
              mySessionToken={mySessionToken}
              submitted={drawSubmitted}
              onSubmit={handleDrawDiscard}
              onClear={() => setDiscardIndices(new Set<number>())}
            />
          )}

          {showRevealUI && drawState && (
            <DrawmahaReveal
              drawState={drawState}
              mySessionToken={mySessionToken}
              myPlayer={me}
              players={room.players}
              onDecide={handleDrawDecide}
            />
          )}

          {gameState && !isSpectator && isDrawPhase && !showDiscardUI && !showRevealUI && (
            <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl px-4 py-3 text-center">
              <p className="text-poker-yellow/60 text-sm">
                {!myDrawPlayerState?.hasDrawn ? 'Waiting for draw phase…' : myDrawPlayerState.revealedCard ? '✓ Draw submitted — waiting to decide…' : '✓ Draw submitted — waiting for others…'}
              </p>
            </div>
          )}

          {gameState && !isSpectator && !isDrawPhase && (
            <ActionPanel me={me} gameState={gameState} settings={room.settings} />
          )}

          {!gameState && !isSpectator && (
            <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl px-4 py-3 text-center">
              <p className="text-poker-yellow/70 text-sm">
                {isAdmin ? 'Open admin panel and click "Start game"' : 'Waiting for the admin to start…'}
              </p>
              {nextDealerVariant && <p className="text-poker-gold/70 text-xs mt-2">▸ Next: <span className="font-medium">{VARIANT_LABELS[nextDealerVariant]}</span></p>}
              <p className="text-poker-yellow/40 text-xs mt-1">Players: {room.players.filter((p) => p.status !== 'spectator').length} · {room.players.filter((p) => p.chips > 0).length} with chips</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── DESKTOP ─── */}
      <div className="hidden md:grid p-4 gap-4 max-w-6xl mx-auto min-h-screen" style={{ gridTemplateColumns: '260px 1fr' }}>
        <aside className="flex flex-col gap-3 h-[calc(100vh-2rem)] sticky top-4">
          <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3">
            <p className="text-poker-gold/60 text-[11px] uppercase tracking-wider mb-2">Players ({room.players.length})</p>
            <div className="flex flex-col gap-2">
              {room.players.map((p) => {
                const isYou = p.sessionToken === mySessionToken;
                const isCurrent = gameState?.currentPlayerSeat === p.seat;
                return (
                  <div key={p.sessionToken} className={`flex items-center gap-2 p-1.5 rounded-lg ${isCurrent ? 'bg-poker-gold/10 border border-poker-gold/30' : ''} ${p.status === 'spectator' ? 'opacity-60' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${isCurrent ? 'bg-poker-gold/25 border-2 border-poker-gold text-poker-gold' : isYou ? 'bg-poker-yellow/20 border border-poker-yellow text-poker-yellow' : 'bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow'}`}>
                      {p.nick.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-poker-yellow text-xs truncate">{p.nick}{isYou ? ' (you)' : ''}{isCurrent ? ' ·turn' : ''}</p>
                      <p className="text-poker-yellow/50 text-[10px]">{p.status === 'spectator' ? 'watching' : p.chips + ' · ' + (p.status !== 'playing' ? p.status : '')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DesktopChat messages={messages} mySessionToken={mySessionToken} onSend={sendChat} />
        </aside>

        <div className="flex flex-col">
          {/* TopBar (desktop duplicate) */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <button onClick={copyCode} className="flex items-center gap-1.5 bg-poker-gold/10 border border-poker-gold/20 px-3 py-1.5 rounded-lg flex-shrink-0">
              <span className="text-poker-gold/60 text-xs">#</span>
              <span className="font-mono text-poker-gold text-sm tracking-wider">{room.id}</span>
              <span className="text-poker-gold/40 text-[10px]">{codeCopied ? '✓' : '⧉'}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} className="bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow/70 text-xs px-2.5 py-1.5 rounded-lg">{muted ? '🔇' : '🔊'}</button>
              {isSittingOut
                ? <button onClick={() => getSocket().emit('game:sit-back')} className="bg-poker-gold/20 border border-poker-gold/50 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">▶ Sit back</button>
                : canSitOut
                ? <button onClick={() => getSocket().emit('game:sit-out')} className="bg-poker-yellow/5 border border-poker-gold/25 text-poker-yellow/70 text-xs px-2.5 py-1.5 rounded-lg">⏸ Sit out</button>
                : null}
              {isAdmin && <button onClick={() => setShowAdminPanel(true)} className="bg-poker-gold/15 border border-poker-gold/40 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">⚙ Admin</button>}
              <button onClick={() => { if (confirm("Leave?")) { getSocket().emit('room:leave'); clearSessionToken(room.id); onLeave(); } }} className="text-poker-yellow/60 text-xs px-2 py-1.5">Leave</button>
            </div>
          </div>

          {/* Variant bar (desktop) */}
          <div className="flex items-center justify-between border border-poker-gold/30 px-3 py-1.5 rounded-lg mb-2" style={{ background: 'rgba(212,175,55,0.08)' }}>
            <div className="flex items-center gap-2">
              <span className="text-poker-gold/60 text-[9px] tracking-widest">NOW PLAYING</span>
              <span className="text-poker-gold text-xs font-medium">{VARIANT_LABELS[currentVariant]}</span>
              {isDrawPhase && <span className="text-[9px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded tracking-wider animate-pulse">DRAW</span>}
            </div>
            <button onClick={() => setShowVariantPicker(true)} className="bg-poker-gold text-poker-bg text-[11px] font-medium px-2 py-0.5 rounded">D ▾</button>
          </div>

          {/* Other players (desktop) */}
          <div className="flex justify-around items-start py-3 flex-wrap gap-3 min-h-[110px]">
            {otherPlayers.map((p) => (
              <PlayerSeat
                key={p.sessionToken}
                player={p}
                isCurrent={gameState?.currentPlayerSeat === p.seat}
                isDealer={gameState?.dealerSeat === p.seat}
                isSb={false}
                isBb={false}
                isYou={false}
                lastMessage={getBubble(p.sessionToken)}
                handName={activeResult?.showdownCards.find((sc) => sc.sessionToken === p.sessionToken)?.handName}
                winningCards={winningCardsSet}
                cardCount={currentCardCount}
              />
            ))}
          </div>

          {/* Table center (desktop) */}
          <div className="poker-felt rounded-2xl p-6 my-2">
            <p className="text-center text-[10px] text-poker-gold/70 tracking-widest mb-1">POT</p>
            <p className="text-center text-3xl text-poker-yellow font-medium mb-3">{gameState ? gameState.pot : 0}</p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => {
                const card = gameState?.communityCards[i];
                return card
                  ? <Card key={i} card={card} size="md" winning={winningCardsSet.has(card)} />
                  : <CardPlaceholder key={i} size="md" />;
              })}
            </div>
            {gameState && <p className="text-center text-[10px] text-poker-gold/60 tracking-widest mt-2 uppercase">{gameState.phase} · hand #{gameState.handNumber}</p>}
            <ResultPanel lastResult={lastResult} players={room.players} resultMessage={resultMessage} />
          </div>

          <div className="flex-1" />

          {/* Player section (desktop) — same as mobile */}
          <div className="relative bg-poker-yellow/5 rounded-2xl p-3 border border-poker-gold/25">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-poker-yellow font-medium text-sm">{me.nick} <span className="text-poker-yellow/50 text-xs">(you)</span></p>
                <p className="text-poker-yellow/60 text-xs">Chips: <span className="text-poker-gold font-medium">{me.chips}</span></p>
              </div>
              {!showDiscardUI && (
                <div className={myHoleCards.length >= 5 ? 'flex -space-x-2' : 'flex gap-0.5'}>
                  {myHoleCards.length > 0
                    ? myHoleCards.map((c, i) => <Card key={i} card={c} size={myHoleCards.length >= 5 ? 'sm' : 'md'} winning={winningCardsSet.has(c)} dealIndex={i} />)
                    : <><CardPlaceholder size="lg" /><CardPlaceholder size="lg" /></>}
                </div>
              )}
            </div>

            {showDiscardUI && drawState && <DrawCardsDisplay holeCards={myHoleCards} discardIndices={discardIndices} submitted={drawSubmitted} onToggle={toggleDiscardIndex} />}
            {showDiscardUI && drawState && <DrawmahaDraw discardCount={discardIndices.size} drawState={drawState} mySessionToken={mySessionToken} submitted={drawSubmitted} onSubmit={handleDrawDiscard} onClear={() => setDiscardIndices(new Set<number>())} />}
            {showRevealUI && drawState && <DrawmahaReveal drawState={drawState} mySessionToken={mySessionToken} myPlayer={me} players={room.players} onDecide={handleDrawDecide} />}
            {gameState && !isSpectator && !isDrawPhase && <ActionPanel me={me} gameState={gameState} settings={room.settings} />}
            {!gameState && !isSpectator && (
              <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl px-4 py-3 text-center">
                <p className="text-poker-yellow/70 text-sm">{isAdmin ? 'Click Admin → Start game' : 'Waiting for admin to start…'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdminPanel && <AdminPanel room={room} mySessionToken={mySessionToken} onClose={() => setShowAdminPanel(false)} />}
      {showChat && <ChatModal messages={messages} mySessionToken={mySessionToken} onClose={() => setShowChat(false)} />}
      {showVariantPicker && (
        <VariantPicker
          currentVariant={me.preferredVariant || 'texas'}
          onSelect={handleSetVariant}
          onClose={() => setShowVariantPicker(false)}
        />
      )}
    </main>
  );
}
