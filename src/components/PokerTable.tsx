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

interface Props {
  initialRoom: Room;
  mySessionToken: string;
  onLeave: () => void;
}

export function PokerTable({ initialRoom, mySessionToken, onLeave }: Props) {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [myHoleCards, setMyHoleCards] = useState<CardType[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVariantPicker, setShowVariantPicker] = useState(false);
  const [lastResult, setLastResult] = useState<HandResult | null>(null);
  const [resultTimer, setResultTimer] = useState<NodeJS.Timeout | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(initialRoom.messages || []);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastBubbleByPlayer, setLastBubbleByPlayer] = useState<Record<string, ChatMessage>>({});
  const [myLastBubble, setMyLastBubble] = useState<ChatMessage | null>(null);
  // BUGFIX: bubbles auto-dismiss after 5s and DON'T reappear on future renders
  // We keep "dismissed message IDs" to filter out already-shown bubbles
  const [dismissedBubbleIds, setDismissedBubbleIds] = useState<Set<string>>(new Set());

  // Refs for stable handlers
  const showChatRef = useRef(showChat);
  const messagesLengthRef = useRef(messages.length);
  useEffect(() => { showChatRef.current = showChat; }, [showChat]);
  useEffect(() => { messagesLengthRef.current = messages.length; }, [messages.length]);

  const me = room.players.find((p) => p.sessionToken === mySessionToken);
  const isAdmin = me?.role === 'admin' || me?.role === 'vice-admin';

  useEffect(() => {
    const socket = getSocket();

    const handleRoomState = (updatedRoom: Room) => {
      setRoom(updatedRoom);
      const myUpdated = updatedRoom.players.find((p) => p.sessionToken === mySessionToken);
      if (myUpdated?.holeCards) setMyHoleCards(myUpdated.holeCards);
      if (!updatedRoom.gameState) setMyHoleCards([]);
      if (updatedRoom.messages && updatedRoom.messages.length !== messagesLengthRef.current) {
        setMessages(updatedRoom.messages);
      }
    };

    const handleYourCards = (cards: CardType[]) => {
      setMyHoleCards(cards);
    };

    const handleHandResult = (result: HandResult) => {
      setLastResult(result);
      if (resultTimer) clearTimeout(resultTimer);
      // Result visible for 6 seconds — short enough to feel snappy, long enough to read
      const t = setTimeout(() => setLastResult(null), 6000);
      setResultTimer(t);
    };

    const handleClosed = (reason: string) => {
      alert(reason);
      clearSessionToken(room.id);
      onLeave();
    };

    const handleChatMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);

      if (message.type !== 'system' && message.senderSessionToken) {
        if (message.senderSessionToken === mySessionToken) {
          setMyLastBubble(message);
        } else {
          setLastBubbleByPlayer((prev) => ({
            ...prev,
            [message.senderSessionToken!]: message,
          }));
        }

        // BUGFIX: auto-dismiss bubble after 5 seconds — and STAY dismissed
        setTimeout(() => {
          setDismissedBubbleIds((prev) => {
            const next = new Set(prev);
            next.add(message.id);
            return next;
          });
        }, 5000);
      }

      if (
        !showChatRef.current &&
        message.type !== 'system' &&
        message.senderSessionToken !== mySessionToken
      ) {
        setUnreadCount((c) => c + 1);
      }
    };

    socket.on('room:state', handleRoomState);
    socket.on('game:your-cards', handleYourCards);
    socket.on('game:hand-result', handleHandResult);
    socket.on('room:closed', handleClosed);
    socket.on('chat:message', handleChatMessage);

    return () => {
      socket.off('room:state', handleRoomState);
      socket.off('game:your-cards', handleYourCards);
      socket.off('game:hand-result', handleHandResult);
      socket.off('room:closed', handleClosed);
      socket.off('chat:message', handleChatMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySessionToken, room.id]);

  const openChat = () => {
    setShowChat(true);
    setUnreadCount(0);
  };

  const handleLeave = () => {
    if (!confirm("Leave the room? You'll lose your seat.")) return;
    const socket = getSocket();
    socket.emit('room:leave');
    clearSessionToken(room.id);
    onLeave();
  };

  const handleSitOut = () => {
    const socket = getSocket();
    socket.emit('game:sit-out');
  };

  const handleSitBack = () => {
    const socket = getSocket();
    socket.emit('game:sit-back');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {}
  };

  const sendInlineChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const socket = getSocket();
    socket.emit('chat:send', { type: 'text', content: trimmed }, (response: { ok: boolean; error?: string } | undefined) => {
      if (response && !response.ok) {
        alert(response.error || 'Failed to send');
      }
    });
  };

  const handleSetVariant = (variant: GameVariant) => {
    const socket = getSocket();
    socket.emit('game:set-variant', { variant }, (response: { ok: boolean; error?: string } | undefined) => {
      if (response && !response.ok) {
        alert(response.error || 'Failed to set variant');
      }
      setShowVariantPicker(false);
    });
  };

  if (!me) return null;

  const gameState = room.gameState;
  const otherPlayers = room.players.filter((p) => p.sessionToken !== mySessionToken);

  const canSitOut =
    !!gameState &&
    me.status !== 'sitting-out' &&
    me.status !== 'waiting' &&
    me.status !== 'no-chips' &&
    me.status !== 'spectator';

  const isSittingOut = me.status === 'sitting-out';
  const isSpectator = me.status === 'spectator';

  // Set of winning cards for highlighting
  const winningCardsSet = new Set<CardType>();
  const activeResult = lastResult || gameState?.lastHandResult;
  if (activeResult?.winningCards) {
    for (const c of activeResult.winningCards) {
      winningCardsSet.add(c);
    }
  }

  const handleTakeSeat = () => {
    const socket = getSocket();
    socket.emit('game:take-seat', (response: { ok: boolean; error?: string } | undefined) => {
      if (response && !response.ok) {
        alert(response.error || 'Failed to take seat');
      }
    });
  };

  let resultMessage = '';
  if (lastResult) {
    const winners = lastResult.winnings.map((w) => {
      const player = room.players.find((p) => p.sessionToken === w.sessionToken);
      return `${player?.nick || '?'} (+${w.amount})${w.handDescription ? ' · ' + w.handDescription : ''}`;
    });
    resultMessage = winners.join(', ');
  }

  // Current variant being played (from gameState if running, otherwise from current dealer's preference)
  const currentVariant: GameVariant = gameState?.variant || 'texas';

  // Find the next dealer (player after current dealer in seat order)
  // For "Next: X" hint between hands
  let nextDealerVariant: GameVariant | null = null;
  if (!gameState && room.players.length > 0) {
    // Game not active — pick the first eligible player
    const eligible = room.players
      .filter((p) => p.status !== 'spectator' && p.status !== 'disconnected')
      .sort((a, b) => a.seat - b.seat);
    if (eligible[0]) {
      nextDealerVariant = eligible[0].preferredVariant || 'texas';
    }
  }

  // ===== Helpers for filtered bubbles =====
  // BUGFIX: filter out dismissed bubbles (so they don't reappear)
  const myBubbleToShow = myLastBubble && !dismissedBubbleIds.has(myLastBubble.id) ? myLastBubble : null;
  const getBubbleForPlayer = (sessionToken: string): ChatMessage | null => {
    const bubble = lastBubbleByPlayer[sessionToken];
    if (!bubble) return null;
    if (dismissedBubbleIds.has(bubble.id)) return null;
    return bubble;
  };

  // ===== TopBar (inline, not a component — avoids re-creation on every render) =====
  const topBar = (
    <div className="flex items-center justify-between mb-2 gap-2">
      <button
        onClick={copyCode}
        className="flex items-center gap-1.5 bg-poker-gold/10 border border-poker-gold/20 px-3 py-1.5 rounded-lg flex-shrink-0"
      >
        <span className="text-poker-gold/60 text-xs">#</span>
        <span className="font-mono text-poker-gold text-sm tracking-wider">{room.id}</span>
        <span className="text-poker-gold/40 text-[10px]">{codeCopied ? '✓' : '⧉'}</span>
      </button>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        <button
          onClick={openChat}
          className="md:hidden relative bg-poker-gold/10 border border-poker-gold/30 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg"
        >
          💬 Chat
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-poker-coral text-poker-bg text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {isSittingOut ? (
          <button onClick={handleSitBack} className="bg-poker-gold/20 border border-poker-gold/50 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">
            ▶ Sit back
          </button>
        ) : canSitOut ? (
          <button onClick={handleSitOut} className="bg-poker-yellow/5 border border-poker-gold/25 text-poker-yellow/70 text-xs px-2.5 py-1.5 rounded-lg">
            ⏸ Sit out
          </button>
        ) : null}
        {isAdmin && (
          <button onClick={() => setShowAdminPanel(true)} className="bg-poker-gold/15 border border-poker-gold/40 text-poker-gold text-xs px-2.5 py-1.5 rounded-lg">
            ⚙ Admin
          </button>
        )}
        <button onClick={handleLeave} className="text-poker-yellow/60 text-xs px-2 py-1.5">
          Leave
        </button>
      </div>
    </div>
  );

  // ===== Variant bar (Dealer's Choice) =====
  const variantBar = (
    <div className="flex items-center justify-between bg-poker-gold/8 border border-poker-gold/30 px-3 py-1.5 rounded-lg mb-2" style={{ background: 'rgba(212,175,55,0.08)' }}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-poker-gold/60 text-[9px] tracking-widest flex-shrink-0">NOW PLAYING</span>
        <span className="text-poker-gold text-xs font-medium truncate">{VARIANT_LABELS[currentVariant]}</span>
      </div>
      <button
        onClick={() => setShowVariantPicker(true)}
        className="bg-poker-gold text-poker-bg text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0"
        title="Dealer's choice — pick game for your turn"
      >
        D <span className="text-[9px] opacity-70">▾</span>
      </button>
    </div>
  );

  // ===== Other players row =====
  const otherPlayersRow = (
    <div className="flex justify-around items-start py-3 flex-wrap gap-3 min-h-[110px]">
      {otherPlayers.length === 0 ? (
        <p className="text-poker-yellow/40 text-sm self-center">No one else here yet...</p>
      ) : (
        otherPlayers.map((p) => {
          const showdownCard = activeResult?.showdownCards.find((sc) => sc.sessionToken === p.sessionToken);
          return (
            <PlayerSeat
              key={p.sessionToken}
              player={p}
              isCurrent={gameState?.currentPlayerSeat === p.seat}
              isDealer={gameState?.dealerSeat === p.seat}
              isSb={false}
              isBb={false}
              isYou={false}
              lastMessage={getBubbleForPlayer(p.sessionToken)}
              handName={showdownCard?.handName}
              winningCards={winningCardsSet}
            />
          );
        })
      )}
    </div>
  );

  // ===== Center: pot + community cards =====
  const tableCenter = (
    <div className="poker-felt rounded-2xl p-4 md:p-6 my-2">
      <p className="text-center text-[10px] text-poker-gold/70 tracking-widest mb-1">POT</p>
      <p className="text-center text-2xl md:text-3xl text-poker-yellow font-medium mb-3">
        {gameState ? gameState.pot : 0}
      </p>

      <div className="flex justify-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => {
          const card = gameState?.communityCards[i];
          return card ? (
            <Card key={i} card={card} size="md" winning={winningCardsSet.has(card)} />
          ) : (
            <CardPlaceholder key={i} size="md" />
          );
        })}
      </div>

      {gameState && (
        <p className="text-center text-[10px] text-poker-gold/60 tracking-widest mt-2 uppercase">
          {gameState.phase} · hand #{gameState.handNumber}
        </p>
      )}

      {lastResult && resultMessage && (
        <div className="mt-3 bg-poker-gold/15 border border-poker-gold/40 rounded-lg p-2 text-center">
          <p className="text-poker-gold text-xs">🏆 Winner:</p>
          <p className="text-poker-yellow text-sm font-medium mt-0.5">{resultMessage}</p>
        </div>
      )}
    </div>
  );

  // ===== Player section (you) =====
  const playerSection = (
    <div className="relative bg-poker-yellow/5 rounded-2xl p-3 border border-poker-gold/25">
      <div className="absolute -top-2 right-4 z-10">
        <FloatingBubble message={myBubbleToShow} position="above" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-poker-yellow font-medium text-sm flex items-center gap-2">
            {me.nick} <span className="text-poker-yellow/50 text-xs">(you)</span>
            {me.role !== 'player' && (
              <span className="text-[9px] bg-poker-gold/20 text-poker-gold px-1.5 py-0.5 rounded">
                {me.role}
              </span>
            )}
          </p>
          <p className="text-poker-yellow/60 text-xs">
            Chips: <span className="text-poker-gold font-medium">{me.chips}</span>
          </p>
        </div>
        <div className="flex gap-0.5">
          {myHoleCards.length === 2 ? (
            <>
              <Card card={myHoleCards[0]} size="lg" winning={winningCardsSet.has(myHoleCards[0])} />
              <Card card={myHoleCards[1]} size="lg" winning={winningCardsSet.has(myHoleCards[1])} />
            </>
          ) : (
            <>
              <CardPlaceholder size="lg" />
              <CardPlaceholder size="lg" />
            </>
          )}
        </div>
      </div>

      {isSpectator && (
        <div className="bg-poker-gold/10 border-2 border-poker-gold/40 rounded-xl p-4 text-center mb-2">
          <p className="text-poker-gold text-base font-medium mb-1">👀 You are watching</p>
          <p className="text-poker-yellow/70 text-xs mb-3">
            Take a seat to join the game. Admin will assign chips to you.
          </p>
          <button onClick={handleTakeSeat} className="w-full bg-poker-gold text-poker-bg font-medium py-3 rounded-lg active:scale-95">
            🪑 Take a seat at the table
          </button>
        </div>
      )}

      {gameState && !isSpectator && (
        <ActionPanel me={me} gameState={gameState} settings={room.settings} />
      )}

      {!gameState && !isSpectator && (
        <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl px-4 py-3 text-center">
          <p className="text-poker-yellow/70 text-sm">
            {isAdmin ? 'Open admin panel and click "Start game"' : 'Waiting for the admin to start the game...'}
          </p>
          {nextDealerVariant && (
            <p className="text-poker-gold/70 text-xs mt-2">
              ▸ Next: <span className="font-medium">{VARIANT_LABELS[nextDealerVariant]}</span>
            </p>
          )}
          <p className="text-poker-yellow/40 text-xs mt-1">
            Players at table: {room.players.filter((p) => p.status !== 'spectator').length} ·{' '}
            {room.players.filter((p) => p.chips > 0).length} with chips
            {room.players.some((p) => p.status === 'spectator') && (
              <> · {room.players.filter((p) => p.status === 'spectator').length} watching</>
            )}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen">
      {/* ===== MOBILE LAYOUT (< md) ===== */}
      <div className="md:hidden flex flex-col p-3 max-w-md mx-auto min-h-screen">
        {topBar}
        {variantBar}
        {otherPlayersRow}
        {tableCenter}
        <div className="flex-1" />
        {playerSection}
      </div>

      {/* ===== DESKTOP LAYOUT (>= md) ===== */}
      <div className="hidden md:grid p-4 gap-4 max-w-6xl mx-auto min-h-screen" style={{ gridTemplateColumns: '260px 1fr' }}>
        <aside className="flex flex-col gap-3 h-[calc(100vh-2rem)] sticky top-4">
          <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-3">
            <p className="text-poker-gold/60 text-[11px] uppercase tracking-wider mb-2">
              Players ({room.players.length})
            </p>
            <div className="flex flex-col gap-2">
              {room.players.map((p) => {
                const isYou = p.sessionToken === mySessionToken;
                const isCurrent = gameState?.currentPlayerSeat === p.seat;
                const isSpectatorRow = p.status === 'spectator';
                return (
                  <div
                    key={p.sessionToken}
                    className={`flex items-center gap-2 p-1.5 rounded-lg ${
                      isCurrent ? 'bg-poker-gold/10 border border-poker-gold/30' : ''
                    } ${isSpectatorRow ? 'opacity-60' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${
                        isCurrent
                          ? 'bg-poker-gold/25 border-2 border-poker-gold text-poker-gold'
                          : isYou
                          ? 'bg-poker-yellow/20 border border-poker-yellow text-poker-yellow'
                          : 'bg-poker-yellow/10 border border-poker-gold/30 text-poker-yellow'
                      }`}
                    >
                      {p.nick.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-poker-yellow text-xs truncate flex items-center gap-1">
                        {p.nick}
                        {isYou && <span className="text-poker-yellow/40">(you)</span>}
                        {isCurrent && <span className="text-poker-gold text-[9px]">·turn</span>}
                        {isSpectatorRow && <span className="text-poker-gold/60 text-[9px]">👀</span>}
                      </p>
                      <p className="text-poker-yellow/50 text-[10px]">
                        {isSpectatorRow ? 'watching' : `${p.chips} · ${p.status === 'playing' ? '' : p.status}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DesktopChat
            messages={messages}
            mySessionToken={mySessionToken}
            onSend={sendInlineChat}
          />
        </aside>

        <div className="flex flex-col">
          {topBar}
          {variantBar}
          {otherPlayersRow}
          {tableCenter}
          <div className="flex-1" />
          {playerSection}
        </div>
      </div>

      {showAdminPanel && (
        <AdminPanel
          room={room}
          mySessionToken={mySessionToken}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {showChat && (
        <ChatModal
          messages={messages}
          mySessionToken={mySessionToken}
          onClose={() => setShowChat(false)}
        />
      )}

      {showVariantPicker && me && (
        <VariantPicker
          currentVariant={me.preferredVariant || 'texas'}
          onSelect={handleSetVariant}
          onClose={() => setShowVariantPicker(false)}
        />
      )}
    </main>
  );
}

// ===== Desktop chat (compact, always-visible) =====
function DesktopChat({
  messages,
  mySessionToken,
  onSend,
}: {
  messages: ChatMessage[];
  mySessionToken: string;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const sendReaction = (emoji: string) => {
    onSend(emoji);
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
              return (
                <p key={m.id} className="text-center text-poker-gold/50 text-[10px] italic">
                  {m.content}
                </p>
              );
            }
            const isMine = m.senderSessionToken === mySessionToken;
            const isReaction = m.type === 'reaction';
            return (
              <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={
                    isReaction
                      ? 'text-xl'
                      : `max-w-[85%] px-2.5 py-1 rounded-xl text-[11px] ${
                          isMine
                            ? 'bg-poker-gold text-poker-bg'
                            : 'bg-poker-yellow/10 text-poker-yellow border border-poker-gold/15'
                        }`
                  }
                >
                  {!isMine && !isReaction && (
                    <p className="text-[9px] opacity-70 leading-tight">{m.senderNick}</p>
                  )}
                  <p className={isReaction ? '' : 'break-words leading-tight'}>{m.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-1 justify-center mt-2 pt-2 border-t border-poker-gold/10">
        {['👍', '😂', '🔥', '😎', '😠'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => sendReaction(emoji)}
            className="bg-poker-yellow/5 hover:bg-poker-yellow/15 px-2 py-1 rounded-full text-sm active:scale-90 transition"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 mt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          maxLength={200}
          placeholder="Message..."
          className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 px-3 py-1.5 rounded-full text-poker-yellow text-xs outline-none placeholder:text-poker-yellow/40"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="bg-poker-gold text-poker-bg w-7 h-7 rounded-full text-xs font-medium disabled:opacity-40 active:scale-95 flex items-center justify-center"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
