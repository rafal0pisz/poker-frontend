// sessionToken per room — stored in localStorage

const sessionKey = (roomId: string) => `poker:session:${roomId}`;

export function getSessionToken(roomId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(sessionKey(roomId));
}

export function setSessionToken(roomId: string, token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(sessionKey(roomId), token);
}

export function clearSessionToken(roomId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(sessionKey(roomId));
}
