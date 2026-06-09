'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Room } from '@/lib/types';

interface Props {
  messages: ChatMessage[];
  mySessionToken: string;
  onSendChat: (text: string) => void;
}

export function QuickChat({ messages, mySessionToken, onSendChat }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(messages.length);

  const chatMessages = messages.filter(m => m.type !== 'system');

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages.length, open]);

  // Count unread when closed
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

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="border-t border-poker-gold/10">
      {/* Toggle header — same pattern as HandLog */}
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
              chatMessages.map(m => (
                <div key={m.id} className="text-[11px] leading-snug">
                  <span
                    className="font-semibold"
                    style={{ color: m.senderSessionToken === mySessionToken ? '#d4af37' : 'rgba(212,175,55,0.6)' }}
                  >
                    {m.senderNick ?? 'You'}:{' '}
                  </span>
                  <span className="text-poker-yellow/70">{m.content}</span>
                  <span className="text-poker-yellow/25 text-[9px] ml-1">{formatTime(m.timestamp)}</span>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-poker-gold/10 p-2 flex gap-2">
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
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
