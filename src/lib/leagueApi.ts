// "Pasjonaci" results API client — plain REST calls to the backend's
// /api/pasjonaci endpoints (see poker-backend/src/league-store.ts). There is
// exactly one shared ledger; results are written server-side, silently,
// after every hand on a table created via /pasjonaci — nothing here submits
// data, this module only reads and closes the current period.
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

export interface PasjonaciView {
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

export async function getPasjonaciResults(): Promise<
  { ok: true; league: PasjonaciView } | { ok: false; error: string }
> {
  const res = await fetch(`${BACKEND_URL}/api/pasjonaci`);
  return parseJson(res);
}

export async function closePasjonaciPeriod(): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch(`${BACKEND_URL}/api/pasjonaci/close-period`, { method: 'POST' });
  return parseJson(res);
}
