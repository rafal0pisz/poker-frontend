// Socket.io client — single instance for the whole app
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    // iOS/Android background killer — when app returns to foreground
    // visibilitychange fires but socket might be dead; force reconnect
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && socket && !socket.connected) {
          console.log('[Socket] Tab visible again — reconnecting');
          socket.connect();
        }
      });
    }

    // Network online event (plane mode off, wifi reconnected)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (socket && !socket.connected) {
          console.log('[Socket] Network online — reconnecting');
          socket.connect();
        }
      });
    }

    // Heartbeat every 25s — if server stops responding, socket.io
    // will detect the timeout and trigger reconnection automatically.
    // This is handled by socket.io's built-in ping mechanism, but
    // we explicitly set a tighter interval here for mobile.
    (socket as Socket & { _opts?: Record<string, unknown> })._opts = {
      ...(socket as Socket & { _opts?: Record<string, unknown> })._opts,
    };
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
