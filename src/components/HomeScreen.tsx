'use client';

import { useState, useRef, useEffect } from 'react';
import { useNick } from '@/lib/useNick';
import { CreateRoomScreen } from './CreateRoomScreen';
import { JoinRoomScreen } from './JoinRoomScreen';
import { PokerTable } from './PokerTable';
import { RulesScreen } from './RulesScreen';
import { ContactScreen } from './ContactScreen';
import type { Room } from '@/lib/types';

type View = 'home' | 'create' | 'join' | 'table' | 'rules' | 'contact';

interface Props {
  // Tables created here silently sync results to the shared Pasjonaci
  // ledger — otherwise this is byte-for-byte the same screen as the main
  // site. See CreateRoomScreen's `source` prop and room:create's handler.
  isPasjonaci?: boolean;
}

export function HomeScreen({ isPasjonaci = false }: Props) {
  const basePath = isPasjonaci ? '/pasjonaci' : '';
  const [nick, setNick] = useNick();
  const [editingNick, setEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState('');
  const [view, setView] = useState<View>('home');
  const [room, setRoom] = useState<Room | null>(null);
  const [mySessionToken, setMySessionToken] = useState<string>('');
  const [shakeHint, setShakeHint] = useState(false);
  const [urlRoomCode, setUrlRoomCode] = useState<string>('');

  const nickInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('room')?.toUpperCase().trim();
    if (code) {
      setUrlRoomCode(code);
      setView('join');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const startEditNick = () => { setNickInput(nick); setEditingNick(true); };
  const saveNick = () => { setNick(nickInput); setEditingNick(false); };

  const handleRoomReady = (newRoom: Room, sessionToken: string) => {
    setRoom(newRoom);
    setMySessionToken(sessionToken);
    setView('table');
    // Update URL to reflect active room — GTM is suppressed when ?room= is present
    window.history.replaceState({}, '', `${basePath}/?room=${newRoom.id}`);
  };

  const goHome = () => {
    setRoom(null);
    setMySessionToken('');
    setView('home');
    // Clear room from URL
    window.history.replaceState({}, '', `${basePath}/`);
  };

  const handleActionClick = (target: 'create' | 'join') => {
    if (!nick) {
      startEditNick();
      setShakeHint(true);
      setTimeout(() => setShakeHint(false), 600);
      setTimeout(() => nickInputRef.current?.focus(), 50);
      return;
    }
    setView(target);
  };

  if (view === 'create') {
    return (
      <CreateRoomScreen
        defaultNick={nick}
        source={isPasjonaci ? 'pasjonaci' : undefined}
        onCancel={() => setView('home')}
        onRoomCreated={handleRoomReady}
      />
    );
  }

  if (view === 'join') {
    return (
      <JoinRoomScreen
        defaultNick={nick}
        defaultRoomId={urlRoomCode}
        onCancel={() => { setUrlRoomCode(''); setView('home'); }}
        onRoomJoined={handleRoomReady}
      />
    );
  }

  if (view === 'rules') {
    return <RulesScreen onBack={() => setView('home')} />;
  }

  if (view === 'contact') {
    return <ContactScreen onBack={() => setView('home')} />;
  }

  if (view === 'table' && room) {
    return (
      <PokerTable
        initialRoom={room}
        mySessionToken={mySessionToken}
        onLeave={goHome}
      />
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10 mt-8">
          <div className="flex justify-center mb-3">
            <svg width="186" height="46" viewBox="0 0 186 46" xmlns="http://www.w3.org/2000/svg">
              <text x="4" y="38"
                fontFamily="Rajdhani,'Arial Narrow',sans-serif"
                fontWeight="700" fontSize="40" fill="rgb(var(--pk-gold-rgb))"
                textLength="140" lengthAdjust="spacingAndGlyphs">POKER</text>
              <circle cx="159" cy="24" r="14.5" fill="#0d0d14" stroke="rgb(var(--pk-gold-rgb))" strokeWidth="2.3"/>
              <circle cx="159" cy="24" r="9.5" fill="#7a1414"/>
              <circle cx="159" cy="24" r="12.2" fill="none" stroke="#f5d76e" strokeWidth="0.8" strokeDasharray="2.2 1.9" opacity="0.75"/>
              <circle cx="159" cy="24" r="6.2" fill="none" stroke="rgb(var(--pk-gold-rgb))" strokeWidth="1"/>

            </svg>
          </div>
          <p className="text-poker-yellow/50 text-xs tracking-widest uppercase">Play with friends online</p>
        </div>

        {/* Main buttons */}
        <button
          onClick={() => handleActionClick('create')}
          className={`w-full font-medium py-4 rounded-xl mb-3 flex items-center justify-center gap-2 active:scale-95 transition ${
            nick ? 'bg-poker-gold text-poker-bg' : 'bg-poker-gold/40 text-poker-bg/70'
          }`}
        >
          <span className="text-xl">+</span>
          Create room
        </button>

        <button
          onClick={() => handleActionClick('join')}
          className={`w-full border font-medium py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition ${
            nick ? 'border-poker-gold/40 text-poker-gold' : 'border-poker-gold/15 text-poker-gold/50'
          }`}
        >
          <span>→</span>
          Join room
        </button>

        {/* Nick section */}
        <div
          className={`mt-8 pt-6 border-t transition-colors ${
            shakeHint ? 'border-poker-coral/60' : 'border-poker-gold/15'
          }`}
          style={shakeHint ? { animation: 'shake 0.5s' } : undefined}
        >
          {!nick && (
            <div className={`mb-3 px-3 py-2 rounded-lg text-xs text-center ${
              shakeHint
                ? 'bg-poker-coral/20 border border-poker-coral/40 text-poker-coral'
                : 'bg-poker-gold/10 border border-poker-gold/25 text-poker-gold'
            }`}>
              👇 Please set your nickname first
            </div>
          )}

          <p className="text-poker-yellow/50 text-xs mb-3 text-center">Your nickname (remembered)</p>

          {editingNick ? (
            <div className="flex gap-2">
              <input
                ref={nickInputRef}
                type="text"
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                maxLength={16}
                autoFocus
                placeholder="Enter nickname"
                className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 text-poker-yellow px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15"
                onKeyDown={(e) => e.key === 'Enter' && nickInput.trim() && saveNick()}
              />
              <button
                onClick={saveNick}
                disabled={!nickInput.trim()}
                className="bg-poker-gold text-poker-bg px-4 py-3 rounded-lg font-medium active:scale-95 disabled:opacity-40"
              >
                OK
              </button>
            </div>
          ) : (
            <button
              onClick={startEditNick}
              className="w-full bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3.5 rounded-lg text-poker-yellow flex items-center justify-between active:scale-95 transition"
            >
              <span>{nick || 'Tap to set nickname'}</span>
              <span className="text-poker-gold/50 text-sm">edit</span>
            </button>
          )}
        </div>

        <p className="text-poker-yellow/30 text-xs text-center mt-12">
          Virtual chips · No monetary value
        </p>

        {/* Footer links */}
        <div className="mt-6 flex justify-center gap-6 flex-wrap">
          <a
            href="/pl/"
            className="text-poker-yellow/40 text-xs hover:text-poker-yellow/70 transition"
          >
            Homepage
          </a>
          <span className="text-poker-gold/20 text-xs">·</span>
          <button
            onClick={() => setView('rules')}
            className="text-poker-yellow/40 text-xs hover:text-poker-yellow/70 transition"
          >
            Game rules
          </button>
          <span className="text-poker-gold/20 text-xs">·</span>
          <button
            onClick={() => setView('contact')}
            className="text-poker-yellow/40 text-xs hover:text-poker-yellow/70 transition"
          >
            Contact
          </button>
          {isPasjonaci && (
            <>
              <span className="text-poker-gold/20 text-xs">·</span>
              <a
                href="/pasjonaci/results"
                className="text-poker-yellow/40 text-xs hover:text-poker-yellow/70 transition"
              >
                📊 Wyniki
              </a>
            </>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </main>
  );
}
