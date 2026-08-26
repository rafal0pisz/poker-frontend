// "Pasjonaci" results API client — plain REST calls to the backend's
// /api/pasjonaci endpoints (see poker-backend/src/league-store.ts). There is
// exactly one shared ledger; results are written server-side, silently,
// after every hand on a table created via /pasjonaci. Settlement is entirely
// per-session — no aggregation across sessions — so each game's "who owes
// whom" and "paid" history stands on its own. This module reads the ledger,
// lets anyone confirm their own settlement, and (password-gated) lets an
// admin edit/delete a session, remove a player from history, or reset the
// whole ledger.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export interface LeagueSessionResult {
  nick: string;
  totalBuyIn: number;
  finalChips: number;
  netResult: number;
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

export interface LeagueSession {
  id: string;
  playedAt: number;
  results: LeagueSessionResult[];
  settlements: Settlement[]; // still-outstanding debt for THIS session
  payments: Payment[]; // history for THIS session, newest first
}

export interface PasjonaciView {
  sessions: LeagueSession[]; // newest first
}

// Finished tournaments — a completely separate record from the cash-game
// ledger above. Tournament chips aren't real money and never touch the
// weekly Ranking/Rozliczenie.
export interface TournamentRecordEntry {
  nick: string;
  place: number;
  amount: number;
  rebuy?: boolean; // whether THIS player used their one rebuy — needed for net profit/loss
}

export interface TournamentRecord {
  id: string;
  number: number;
  finishedAt: number;
  totalPlayers: number;
  poolTotal: number;
  rebuyCount: number;
  startingStack?: number; // absent on records saved before this field existed
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
  sessionId: string,
  from: string,
  to: string,
  amount: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/settlement/pay', { sessionId, from, to, amount });
  return parseJson(res);
}

export async function undoLeaguePayment(
  sessionId: string,
  paymentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/settlement/undo-payment', { sessionId, paymentId });
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

// Wipes the entire cash-game ledger (every session, its results, and its
// payment history). Tournaments are untouched. Irreversible.
export async function resetPasjonaciLedger(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/admin/reset', { password });
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
  startingStack: number,
): Promise<{ ok: true; tournament: TournamentRecord } | { ok: false; error: string }> {
  const res = await postJson('/api/pasjonaci/admin/tournament/add', { password, results, totalPlayers, poolTotal, rebuyCount, startingStack });
  return parseJson(res);
}

export async function deletePasjonaciTournament(
  id: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await postJson(`/api/pasjonaci/admin/tournament/${encodeURIComponent(id)}/delete`, { password });
  return parseJson(res);
}
