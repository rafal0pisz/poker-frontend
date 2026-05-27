'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/lib/types';
import { QUICK_REACTIONS } from '@/lib/types';
import { getSocket } from '@/lib/socket';

interface Props {
  messages: ChatMessage[];
  mySessionToken: string;
  onClose: () => void;
}

type ActionResponse = { ok: boolean; error?: string } | undefined;

export function ChatModal({ messages, mySessionToken, onClose }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const sendText = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    const socket = getSocket();
    socket.emit('chat:send', { type: 'text', content: trimmed }, (response: ActionResponse) => {
      setSending(false);
      if (response && !response.ok) {
        alert(response.error || 'Failed to send');
        return;
      }
      setText('');
    });
  };

  const sendReaction = (emoji: string) => {
    const socket = getSocket();
    socket.emit('chat:send', { type: 'reaction', content: emoji }, (response: ActionResponse) => {
      if (response && !response.ok) {
        console.warn('Reaction failed:', response.error);
      }
    });
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 flex flex-col"
        style={{ maxHeight: '85vh', minHeight: '60vh' }}>

        <div className="flex items-center justify-between p-4 border-b border-poker-gold/15 flex-shrink-0">
          <h2 className="font-serif italic text-xl text-poker-gold">Chat</h2>
          <button
            onClick={onClose}
            className="text-poker-yellow/60 hover:text-poker-yellow text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
        >
          {messages.length === 0 ? (
            <p className="text-poker-yellow/40 text-sm text-center mt-8">
              No messages yet. Say hi!
            </p>
          ) : (
            messages.map((m) => {
              if (m.type === 'system') {
                return (
                  <div key={m.id} className="text-center my-2">
                    <p className="text-poker-gold/50 text-[11px] italic">
                      {m.content}
                    </p>
                  </div>
                );
              }

              const isMine = m.senderSessionToken === mySessionToken;
              const isReaction = m.type === 'reaction';

              return (
                <div
                  key={m.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      isReaction
                        ? `text-3xl ${isMine ? 'mr-1' : 'ml-1'}`
                        : `max-w-[75%] px-3 py-1.5 rounded-2xl ${
                            isMine
                              ? 'bg-poker-gold text-poker-bg'
                              : 'bg-poker-yellow/10 text-poker-yellow border border-poker-gold/15'
                          }`
                    }
                  >
                    {!isMine && !isReaction && (
                      <p className="text-[10px] opacity-70 mb-0.5">{m.senderNick}</p>
                    )}
                    <p className={isReaction ? '' : 'text-sm break-words'}>
                      {m.content}
                    </p>
                    {!isReaction && (
                      <p
                        className={`text-[9px] mt-0.5 text-right ${
                          isMine ? 'text-poker-bg/50' : 'text-poker-yellow/40'
                        }`}
                      >
                        {formatTime(m.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-poker-gold/15 flex-shrink-0">
          <div className="flex gap-1.5 justify-center">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="bg-poker-yellow/5 hover:bg-poker-yellow/15 px-3 py-1.5 rounded-full text-lg active:scale-90 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-poker-gold/15 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendText();
                }
              }}
              maxLength={200}
              placeholder="Type a message..."
              className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 px-4 py-2.5 rounded-full text-poker-yellow outline-none placeholder:text-poker-yellow/40"
            />
            <button
              onClick={sendText}
              disabled={sending || !text.trim()}
              className="bg-poker-gold text-poker-bg w-10 h-10 rounded-full font-medium disabled:opacity-40 active:scale-95 flex items-center justify-center"
            >
              ↑
            </button>
          </div>
          <p className="text-poker-yellow/30 text-[10px] mt-1 text-right">
            {text.length}/200
          </p>
        </div>
      </div>
    </div>
  );
}
