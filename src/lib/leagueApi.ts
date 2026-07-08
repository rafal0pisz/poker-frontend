// "Pasjonaci" league API client — plain REST calls to the backend's
// /api/leagues endpoints (see poker-backend/src/league-store.ts). Separate
// from socket.ts since leagues are read/written from standalone pages, not
// just from inside a live room.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export interface LeagueSessionResult {
  nick: string;
  totalBuyIn: number;
  finalChips: number;
  netResult: number;
}

export interface LeagueSession {
  id: string;
  playedAt: number;
  results: LeagueSessionResult[];
}

export interface PlayerBalance {
  nick: string;
  net: number;
  sessionsPlayed: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface LeaguePeriodView {
  startedAt: number;
  endedAt: number | null;
  balances: PlayerBalance[];
  settlements: Settlement[];
}

export interface LeagueView {
  id: string;
  name: string;
  createdAt: number;
  currentPeriod: LeaguePeriodView;
  pastPeriods: LeaguePeriodView[];
  allTime: LeaguePeriodView;
  sessions: LeagueSession[];
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return { ok: false, error: `Server error (${res.status})` };
  }
}

export async function createLeague(name: string): Promise<
  { ok: true; id: string; name: string; adminToken: string } | { ok: false; error: string }
> {
  const res = await fetch(`${BACKEND_URL}/api/leagues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return parseJson(res);
}

export async function getLeague(id: string): Promise<
  { ok: true; league: LeagueView } | { ok: false; error: string }
> {
  const res = await fetch(`${BACKEND_URL}/api/leagues/${encodeURIComponent(id)}`);
  return parseJson(res);
}

export async function submitLeagueSession(
  id: string,
  results: LeagueSessionResult[],
): Promise<{ ok: true; session: LeagueSession } | { ok: false; error: string }> {
  const res = await fetch(`${BACKEND_URL}/api/leagues/${encodeURIComponent(id)}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results }),
  });
  return parseJson(res);
}

export async function closeLeaguePeriod(
  id: string,
  adminToken: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${BACKEND_URL}/api/leagues/${encodeURIComponent(id)}/close-period`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminToken }),
  });
  return parseJson(res);
}

export async function verifyLeagueAdmin(id: string, adminToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/leagues/${encodeURIComponent(id)}/verify-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminToken }),
    });
    const data = await parseJson(res);
    return !!data.isAdmin;
  } catch {
    return false;
  }
}

// ── Local admin-token storage ────────────────────────────────────────────
// Whoever creates a league gets an adminToken back once — remembered in this
// browser (localStorage) so they can come back later and close periods
// without needing a real account system.
const STORAGE_PREFIX = 'pasjonaci-admin-';

export function saveLeagueAdminToken(leagueId: string, adminToken: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_PREFIX + leagueId, adminToken);
}

export function getLeagueAdminToken(leagueId: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_PREFIX + leagueId);
}
