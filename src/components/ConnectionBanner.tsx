'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

type State = 'connected' | 'disconnected' | 'reconnecting';

interface Props {
  onReconnected?: () => void;
}

export function ConnectionBanner({ onReconnected }: Props) {
  const [state, setState] = useState<State>('connected');
  const [attempt, setAttempt] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onDisconnect = (reason: string) => {
      // 'io client disconnect' = intentional (leave), don't show banner
      if (reason === 'io client disconnect') return;
      setState('disconnected');
    };

    const onReconnectAttempt = (n: number) => {
      setState('reconnecting');
      setAttempt(n);
    };

    const onConnect = () => {
      if (state !== 'connected') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onReconnected?.();
      }
      setState('connected');
      setAttempt(0);
    };

    const onConnectError = () => {
      setState('disconnected');
    };

    socket.on('disconnect', onDisconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    // Handle iOS/Android coming back from background
    const onOnline = () => {
      if (!socket.connected) {
        socket.connect();
      }
    };
    window.addEventListener('online', onOnline);

    // Visibility change — tab/app back in foreground
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        socket.connect();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [state, onReconnected]);

  if (state === 'connected' && !showSuccess) return null;

  // Success flash
  if (showSuccess) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'rgba(22,101,52,0.95)', backdropFilter: 'blur(8px)',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>✓</span>
        <span style={{ fontSize: 13, color: '#86efac', fontWeight: 500 }}>Połączono z powrotem</span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(127,29,29,0.97)', backdropFilter: 'blur(8px)',
      padding: '10px 16px',
      borderBottom: '1px solid rgba(248,113,113,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Spinner */}
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid rgba(248,113,113,0.3)',
            borderTopColor: '#f87171',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
          <div>
            <p style={{ fontSize: 13, color: '#fca5a5', fontWeight: 500, margin: 0 }}>
              {state === 'reconnecting'
                ? `Łączenie… (próba ${attempt})`
                : 'Brak połączenia z serwerem'}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(252,165,165,0.6)', margin: 0 }}>
              Twoje miejsce jest zarezerwowane przez 30 sekund
            </p>
          </div>
        </div>
        <button
          onClick={() => getSocket().connect()}
          style={{
            fontSize: 11, padding: '4px 12px', borderRadius: 8,
            background: 'rgba(248,113,113,0.15)',
            border: '1px solid rgba(248,113,113,0.4)',
            color: '#fca5a5', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          Połącz teraz
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
// Tue Jun  9 15:17:18 CEST 2026
