'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, SessionResult, Room } from '@/lib/types';
import { QUICK_REACTIONS } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  messages: ChatMessage[];
  mySessionToken: string;
  room: Room;
  onClose: () => void;
  handLogs?: import('@/hooks/useHandLog').LogEntry[];
}

type Tab = 'chat' | 'actions' | 'summary';
type ActionResponse = { ok: boolean; error?: string } | undefined;

export function ChatModal({ messages, mySessionToken, room, onClose, handLogs }: Props) {
  const [tab, setTab] = useState<Tab>('chat');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMessages = messages.filter((m) => m.type !== 'system');
  const actionMessages = messages.filter((m) => m.type === 'system');

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, tab]);

  const sendText = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    getSocket().emit('chat:send', { type: 'text', content: trimmed }, (response: ActionResponse) => {
      setSending(false);
      if (response && !response.ok) { console.warn('Chat send failed:', response.error); }
      setText('');
    });
  };

  const sendReaction = (emoji: string) => {
    getSocket().emit('chat:send', { type: 'reaction', content: emoji }, (response: ActionResponse) => {
      if (response && !response.ok) console.warn('Reaction failed:', response.error);
    });
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Build summary — active players + those who left
  const activeSummary: SessionResult[] = room.players
    .filter((p) => p.status !== 'spectator')
    .map((p) => ({
      sessionToken: p.sessionToken,
      nick: p.nick,
      totalBuyIn: p.totalBuyIn,
      finalChips: p.chips,
      netResult: p.chips - p.totalBuyIn,
      leftAt: 0, // still in room
    }));

  const leftSummary: SessionResult[] = room.sessionSummary ?? [];

  // Merge — prefer active over left (player could have rejoined)
  const activeTokens = new Set(activeSummary.map((s) => s.sessionToken));
  const allSummary: SessionResult[] = [
    ...activeSummary,
    ...leftSummary.filter((s) => !activeTokens.has(s.sessionToken)),
  ].sort((a, b) => b.netResult - a.netResult);

  const actionEntries = handLogs && handLogs.length > 0 ? handLogs : null;
  const displayed = tab === 'chat' ? chatMessages : actionMessages;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div
        className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 flex flex-col"
        style={{ maxHeight: '85dvh', minHeight: '50vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
          <h2 className="font-serif italic text-xl text-poker-gold">Messages</h2>
          <button onClick={onClose} className="text-poker-yellow/60 hover:text-poker-yellow leading-none flex items-center justify-center" style={{ fontSize: 28, width: 44, height: 44, borderRadius: 10, background: "rgba(212,175,55,0.08)" }}>×</button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-2 gap-1.5 flex-shrink-0">
          {(['chat', 'actions', 'summary'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { chat: '💬 Chat', actions: '📋 Actions', summary: '📊 Summary' };
            const counts: Record<Tab, number> = { chat: chatMessages.length, actions: actionMessages.length, summary: allSummary.length };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                  tab === t
                    ? 'bg-poker-gold text-poker-bg'
                    : 'bg-poker-yellow/10 text-poker-yellow/60 border border-poker-gold/20'
                }`}
              >
                {labels[t]}
                {counts[t] > 0 && tab !== t && (
                  <span className="ml-1 text-[9px] opacity-70">({counts[t]})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-2" onTouchMove={(e) => e.stopPropagation()}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tab === 'summary' ? (
            <div className="space-y-2 py-1">
              <p className="text-poker-yellow/40 text-[10px] text-center uppercase tracking-wider mb-3">
                Session results · {allSummary.length} player{allSummary.length !== 1 ? 's' : ''}
              </p>
              {allSummary.length === 0 ? (
                <p className="text-poker-yellow/40 text-sm text-center mt-8">No data yet</p>
              ) : (
                allSummary.map((s) => {
                  const isMe = s.sessionToken === mySessionToken;
                  const left = s.leftAt > 0;
                  const netPositive = s.netResult > 0;
                  const netNegative = s.netResult < 0;
                  return (
                    <div
                      key={s.sessionToken}
                      className={`rounded-xl border p-3 ${
                        isMe
                          ? 'border-poker-gold/40 bg-poker-gold/8'
                          : 'border-poker-gold/15 bg-poker-yellow/5'
                      }`}
                      style={isMe ? { background: 'rgba(212,175,55,0.08)' } : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-poker-yellow font-medium text-sm">
                            {s.nick}{isMe ? ' (you)' : ''}
                          </span>
                          {left ? (
                            <span className="text-[9px] text-poker-yellow/40 bg-poker-yellow/10 px-1.5 py-0.5 rounded">left</span>
                          ) : (
                            <span className="text-[9px] text-green-400/70 bg-green-400/10 px-1.5 py-0.5 rounded">in game</span>
                          )}
                        </div>
                        {/* Net result */}
                        <span className={`text-base font-bold ${
                          netPositive ? 'text-green-400' : netNegative ? 'text-poker-coral' : 'text-poker-yellow/60'
                        }`}>
                          {netPositive ? '+' : ''}{s.netResult}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-poker-yellow/50">
                        <span>Buy-in: <span className="text-poker-yellow/70">{s.totalBuyIn}</span></span>
                        <span>·</span>
                        <span>{left ? 'Left with' : 'Current'}: <span className="text-poker-yellow/70">{s.finalChips}</span></span>
                      </div>
                    </div>
                  );
                })
              )}
              <p className="text-poker-yellow/25 text-[10px] text-center mt-4 italic">
                Net = current chips − total buy-in
              </p>
            </div>
          ) : tab === 'chat' ? (
            <div className="space-y-2 py-1">
              {chatMessages.length === 0 ? (
                <p className="text-poker-yellow/40 text-sm text-center mt-8">No messages yet. Say hi!</p>
              ) : (
                chatMessages.map((m) => {
                  const isMine = m.senderSessionToken === mySessionToken;
                  const isReaction = m.type === 'reaction';
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={isReaction ? `text-3xl ${isMine ? 'mr-1' : 'ml-1'}` : `max-w-[75%] px-3 py-1.5 rounded-2xl ${isMine ? 'bg-poker-gold text-poker-bg' : 'bg-poker-yellow/10 text-poker-yellow border border-poker-gold/15'}`}>
                        {!isMine && !isReaction && <p className="text-[10px] opacity-70 mb-0.5">{m.senderNick}</p>}
                        <p className={isReaction ? '' : 'text-sm break-words'}>{m.content}</p>
                        {!isReaction && (
                          <p className={`text-[9px] mt-0.5 text-right ${isMine ? 'text-poker-bg/50' : 'text-poker-yellow/40'}`}>
                            {formatTime(m.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-0.5 py-1">
              {actionMessages.length === 0 ? (
                <p className="text-poker-yellow/40 text-sm text-center mt-8">No game events yet.</p>
              ) : (
                actionMessages.map((m) => (
                  <div key={m.id} className="flex items-start gap-2 py-0.5">
                    <span className="text-poker-gold/30 text-[10px] font-mono flex-shrink-0 mt-0.5">{formatTime(m.timestamp)}</span>
                    <p className="text-poker-yellow/70 text-xs leading-relaxed">{m.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Reactions — chat tab only */}
        {tab === 'chat' && (
          <div className="px-4 py-2 border-t border-poker-gold/15 flex-shrink-0">
            <div className="flex gap-1.5 justify-center">
              {QUICK_REACTIONS.map((emoji) => (
                <button key={emoji} onClick={() => sendReaction(emoji)} className="bg-poker-yellow/5 hover:bg-poker-yellow/15 px-3 py-1.5 rounded-full text-lg active:scale-90 transition">{emoji}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input — chat tab only */}
        {tab === 'chat' && (
          <div className="p-3 border-t border-poker-gold/15 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                maxLength={200}
                placeholder="Type a message..."
                className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 px-4 py-2.5 rounded-full text-poker-yellow outline-none placeholder:text-poker-yellow/40" style={{ fontSize: 16 }}
              />
              <button onClick={sendText} disabled={sending || !text.trim()} className="bg-poker-gold text-poker-bg w-10 h-10 rounded-full font-medium disabled:opacity-40 active:scale-95 flex items-center justify-center">↑</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
