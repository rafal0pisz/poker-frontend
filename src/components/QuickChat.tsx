'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Room } from '@/lib/types';
import { QUICK_REACTIONS } from '@/lib/types';

const REACTIONS = QUICK_REACTIONS;

interface Props {
  messages: ChatMessage[];
  mySessionToken: string;
  onSendChat: (text: string) => void;
  onSendReaction?: (emoji: string) => void;
}

export function QuickChat({ messages, mySessionToken, onSendChat, onSendReaction }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(messages.length);

  const chatMessages = messages.filter(m => m.type !== 'system');

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages.length, open]);

  useEffect(() => {
    if (!open && chatMessages.length > prevLenRef.current) {
      setUnread(u => u + chatMessages.length - prevLenRef.current);
    }
    prevLenRef.current = chatMessages.length;
  }, [chatMessages.length, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSendChat(t);
    setText('');
  };

  const sendReaction = (emoji: string) => {
    onSendReaction?.(emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="border-t border-poker-gold/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-poker-yellow/60 hover:text-poker-yellow/80 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span>💬</span>
          <span className="font-medium">Chat</span>
          {!open && unread > 0 && (
            <span className="bg-poker-gold text-poker-bg text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </span>
        <span className="text-poker-yellow/30 text-[10px]">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="border-t border-poker-gold/10">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="overflow-y-auto px-4 py-2 flex flex-col gap-1.5"
            style={{ maxHeight: 160, scrollbarWidth: 'none' }}
          >
            {chatMessages.length === 0 ? (
              <p className="text-[11px] text-poker-yellow/30 text-center py-2">No messages yet</p>
            ) : (
              chatMessages.map(m => {
                const isReaction = m.type === 'reaction';
                return (
                  <div key={m.id} className={`text-[11px] leading-snug ${isReaction ? 'text-xl' : ''}`}>
                    {!isReaction && (
                      <span className="font-semibold" style={{ color: m.senderSessionToken === mySessionToken ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-gold-rgb),0.6)' }}>
                        {m.senderNick ?? 'You'}:{' '}
                      </span>
                    )}
                    <span className={isReaction ? '' : 'text-poker-yellow/70'}>{m.content}</span>
                    {!isReaction && <span className="text-poker-yellow/25 text-[9px] ml-1">{formatTime(m.timestamp)}</span>}
                  </div>
                );
              })
            )}
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="border-t border-poker-gold/10 px-3 py-2 flex gap-1.5 justify-between">
              {REACTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => sendReaction(e)}
                  className="text-xl flex-1 py-1 rounded-lg active:scale-90 transition"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(var(--pk-gold-rgb),0.12)' }}
                >{e}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-poker-gold/10 p-2 flex gap-2">
            {onSendReaction && (
              <button
                onClick={() => setShowEmojiPicker(p => !p)}
                className="w-8 h-8 rounded-lg text-sm flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: showEmojiPicker ? 'rgba(var(--pk-gold-rgb),0.2)' : 'rgba(var(--pk-gold-rgb),0.06)', border: `1px solid ${showEmojiPicker ? 'rgba(var(--pk-gold-rgb),0.5)' : 'rgba(var(--pk-gold-rgb),0.15)'}` }}
              >😊</button>
            )}
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Message..."
              className="flex-1 bg-poker-yellow/5 border border-poker-gold/10 rounded-lg px-3 py-1.5 text-[11px] text-poker-yellow/70 outline-none placeholder:text-poker-yellow/25"
            />
            <button
              onClick={send}
              className="w-8 h-8 bg-poker-gold/10 border border-poker-gold/20 rounded-lg text-poker-gold text-sm flex items-center justify-center"
            >↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  messages: ChatMessage[];
  mySessionToken: string;
  onSendChat: (text: string) => void;
}
