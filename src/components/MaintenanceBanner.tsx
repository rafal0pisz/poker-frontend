'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

// Shown when the backend broadcasts 'server:maintenance' — sent right before
// a deploy restarts the process (see gracefulShutdown in the backend). Hides
// itself as soon as the socket actually disconnects, handing off to
// ConnectionBanner's "reconnecting" state, so only one banner shows at a time.
export function MaintenanceBanner() {
  const [message, setMessage] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const socket = getSocket();

    const onMaintenance = (payload: { message: string; secondsUntilRestart: number }) => {
      setMessage(payload.message);
      setDeadline(Date.now() + payload.secondsUntilRestart * 1000);
    };
    const onDisconnect = () => { setMessage(null); setDeadline(null); };

    socket.on('server:maintenance', onMaintenance);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('server:maintenance', onMaintenance);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
        background: 'rgba(120,72,0,0.97)', backdropFilter: 'blur(8px)',
        padding: '12px 16px', borderBottom: '1px solid rgba(251,191,36,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 560, margin: '0 auto' }}>
        <span style={{ fontSize: 20, flexShrink: 0, lineHeight: '20px' }}>🛠️</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, color: '#fde68a', fontWeight: 700, margin: 0 }}>
            {secondsLeft > 0 ? `Server restarting in ${secondsLeft}s` : 'Restarting now…'}
          </p>
          <p style={{ fontSize: 11.5, color: 'rgba(253,230,138,0.8)', margin: '2px 0 0', lineHeight: 1.4 }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
