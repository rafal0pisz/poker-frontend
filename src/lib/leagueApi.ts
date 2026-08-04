// "Pasjonaci" results API client — plain REST calls to the backend's
// /api/pasjonaci endpoints (see poker-backend/src/league-store.ts). There is
// exactly one shared ledger; results are written server-side, silently,
// after every hand on a table created via /pasjonaci. This module reads the
// ledger, lets anyone confirm their own settlement, and (password-gated)
// lets an admin edit/delete a session or remove a player from the ranking.
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

export interface Payment {
  id: string;
  from: string;
  to: string;
  amount: number;
  paidAt: number;
}

export interface LeaguePeriodView {
  startedAt: number;
  endedAt: number | null;
  balances: PlayerBalance[];
  settlements: Settlement[];
  payments: Payment[];
}

export interface PasjonaciView {
  currentPeriod: LeaguePeriodView;
  pastPeriods: LeaguePeriodView[];
  allTime: LeaguePeriodView;
  sessions: LeagueSession[];
}

// Finished tournaments — a completely separate record from the cash-game
// ledger above. Tournament chips aren't real money and never touch the
// weekly Ranking/Rozliczenie.
export interface TournamentRecordEntry {
  nick: string;
  place: number;
  amount: number;
}

export interface TournamentRecord {
  id: string;
  number: number;
  finishedAt: number;
  totalPlayers: number;
  poolTotal: number;
  rebuyCount: number;
  results: TournamentRecordEntry[]; // every entrant, not just the paid places
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return { ok: false, error: `Server error (${res.status})` };
  }
}

function postJson(path: string, body: unknown) {
  return fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getPasjonaciResults(): Promise<
  { ok: true; league: PasjonaciView } | { ok: false; error: string }
> {
  const res = await fetch(`${BACKEND_URL}/api/pasjonaci`);
  return parseJson(res);
}

export async function getPasjonaciTournaments(): Promise<
  { ok: true; tournaments: TournamentRecord[] } | { ok: false; error: string }
> {
  const res = await fetch(`${BACKEND_URL}/api/pasjonaci/tournaments`);
  return parseJson(res);
}

export async function payLeagueSettlement(
  periodId: number | 'all-time',
  from: string,
  to: string,
  amount: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/settlement/pay', { periodId, from, to, amount });
  return parseJson(res);
}

export async function undoLeaguePayment(
  periodId: number | 'all-time',
  paymentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/settlement/undo-payment', { periodId, paymentId });
  return parseJson(res);
}

export async function verifyPasjonaciAdmin(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/admin/verify', { password });
  return parseJson(res);
}

export async function deletePasjonaciSession(
  id: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson(`/api/pasjonaci/admin/session/${encodeURIComponent(id)}/delete`, { password });
  return parseJson(res);
}

export async function editPasjonaciSession(
  id: string,
  password: string,
  results: LeagueSessionResult[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson(`/api/pasjonaci/admin/session/${encodeURIComponent(id)}/edit`, { password, results });
  return parseJson(res);
}

export async function removePasjonaciPlayer(
  nick: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/admin/remove-player', { password, nick });
  return parseJson(res);
}

// Manually add a tournament that finished outside the app (or before this
// recording feature existed) — same shape a normal in-app tournament produces.
export async function addPasjonaciTournament(
  password: string,
  results: TournamentRecordEntry[],
  totalPlayers: number,
  poolTotal: number,
  rebuyCount: number,
): Promise<{ ok: true; tournament: TournamentRecord } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/admin/tournament/add', { password, results, totalPlayers, poolTotal, rebuyCount });
  return parseJson(res);
}

export async function deletePasjonaciTournament(
  id: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson(`/api/pasjonaci/admin/tournament/${encodeURIComponent(id)}/delete`, { password });
  return parseJson(res);
}
