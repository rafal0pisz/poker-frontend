// Socket.io client — single instance for the whole app
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 500,          // start fast
      reconnectionDelayMax: 5000,      // cap at 5s
      reconnectionAttempts: Infinity,  // keep trying
      timeout: 10000,
      // Ping keepalive — critical for iOS which kills idle sockets
      // The server-side Socket.io default is 25s ping interval, 20s timeout
      // We set a tighter interval to detect drops faster
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      // 'io server disconnect' = server kicked us intentionally
      // 'transport close' / 'ping timeout' = network issue — will auto-reconnect
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
