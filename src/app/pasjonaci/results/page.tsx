'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getPasjonaciResults,
  confirmSettlement,
  verifyPasjonaciAdmin,
  deletePasjonaciSession,
  editPasjonaciSession,
  removePasjonaciPlayer,
  type PasjonaciView,
  type PlayerBalance,
  type Settlement,
  type LeagueSession,
  type LeagueSessionResult,
} from '@/lib/leagueApi';

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ts));
}

function formatNet(net: number): string {
  return net > 0 ? `+${net}` : `${net}`;
}

function BalanceRow({ b }: { b: PlayerBalance }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-poker-yellow/5 rounded-lg">
      <div>
        <span className="text-poker-yellow text-sm">{b.nick}</span>
        <span className="text-poker-yellow/40 text-[10px] ml-2">{b.sessionsPlayed}x</span>
      </div>
      <span className={`text-sm font-medium ${b.net > 0 ? 'text-green-400' : b.net < 0 ? 'text-poker-coral' : 'text-poker-yellow/50'}`}>
        {formatNet(b.net)}
      </span>
    </div>
  );
}

function SettlementList({
  settlements,
  periodId,
  onToggle,
}: {
  settlements: Settlement[];
  periodId: number | 'all-time';
  onToggle: (periodId: number | 'all-time', s: Settlement) => void;
}) {
  if (settlements.length === 0) {
    return <p className="text-poker-yellow/40 text-xs text-center py-3">Wszyscy rozliczeni ✓</p>;
  }
  return (
    <div className="space-y-1.5">
      {settlements.map((s, i) => (
        <label
          key={i}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
            s.confirmed
              ? 'bg-green-500/5 border border-green-500/20'
              : 'bg-poker-gold/10 border border-poker-gold/20'
          }`}
        >
          <input
            type="checkbox"
            checked={s.confirmed}
            onChange={(e) => onToggle(periodId, { ...s, confirmed: e.target.checked })}
            className="accent-poker-gold w-4 h-4 shrink-0"
          />
          <span className={s.confirmed ? 'text-poker-yellow/40 line-through' : 'text-poker-yellow'}>
            <span className="font-medium">{s.from}</span> jest winny{' '}
            <span className="font-medium text-poker-gold">{s.amount}</span> żetonów <span className="font-medium">{s.to}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

function SessionEditForm({
  session,
  onSave,
  onCancel,
}: {
  session: LeagueSession;
  onSave: (results: LeagueSessionResult[]) => void;
  onCancel: () => void;
}) {
  const [rows, setRows] = useState<LeagueSessionResult[]>(session.results.map((r) => ({ ...r })));

  const updateRow = (i: number, patch: Partial<LeagueSessionResult>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const removeRow = (i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };
  const addRow = () => {
    setRows((prev) => [...prev, { nick: '', totalBuyIn: 0, finalChips: 0, netResult: 0 }]);
  };

  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            value={r.nick}
            onChange={(e) => updateRow(i, { nick: e.target.value })}
            placeholder="Nick"
            className="min-w-0 flex-1 bg-poker-bg border border-poker-gold/25 text-poker-yellow text-xs px-2 py-1.5 rounded-md placeholder:text-poker-yellow/30 focus:outline-none focus:border-poker-gold/60"
          />
          <input
            type="number"
            value={r.netResult}
            onChange={(e) => updateRow(i, { netResult: Number(e.target.value) })}
            className="w-20 bg-poker-bg border border-poker-gold/25 text-poker-yellow text-xs px-2 py-1.5 rounded-md focus:outline-none focus:border-poker-gold/60"
          />
          <button onClick={() => removeRow(i)} className="text-poker-coral text-xs px-1.5 shrink-0">✕</button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="w-full border border-dashed border-poker-gold/25 text-poker-yellow/50 text-xs py-1.5 rounded-md hover:text-poker-yellow/80 hover:border-poker-gold/40 transition"
      >
        + Dodaj gracza
      </button>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(rows.filter((r) => r.nick.trim()))}
          className="flex-1 bg-poker-gold/15 border border-poker-gold/30 text-poker-yellow text-xs font-medium py-1.5 rounded-md active:scale-95 transition"
        >
          Zapisz
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-poker-yellow/5 border border-poker-gold/15 text-poker-yellow/60 text-xs font-medium py-1.5 rounded-md active:scale-95 transition"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default function PasjonaciResultsPage() {
  const [league, setLeague] = useState<PasjonaciView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllTime, setShowAllTime] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [removeNick, setRemoveNick] = useState('');

  const load = useCallback(async () => {
    const res = await getPasjonaciResults();
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setLeague(res.league);
    setError(null);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleSettlement = async (periodId: number | 'all-time', s: Settlement) => {
    // Optimistic update — avoids a flash back to unconfirmed while the
    // request round-trips and the ledger reloads.
    setLeague((prev) => {
      if (!prev) return prev;
      const patch = (list: Settlement[]) =>
        list.map((x) => (x.from === s.from && x.to === s.to && x.amount === s.amount ? { ...x, confirmed: s.confirmed } : x));
      return {
        ...prev,
        currentPeriod: { ...prev.currentPeriod, settlements: patch(prev.currentPeriod.settlements) },
        pastPeriods: prev.pastPeriods.map((p) => ({ ...p, settlements: patch(p.settlements) })),
        allTime: { ...prev.allTime, settlements: patch(prev.allTime.settlements) },
      };
    });
    const res = await confirmSettlement(periodId, s.from, s.to, s.amount, s.confirmed);
    if (!res.ok) { alert(res.error); load(); return; }
    load();
  };

  const handleVerifyAdmin = async () => {
    if (!adminPasswordInput) return;
    setVerifying(true);
    const res = await verifyPasjonaciAdmin(adminPasswordInput);
    setVerifying(false);
    if (!res.ok) { setAdminError(res.error); return; }
    setAdminPassword(adminPasswordInput);
    setAdminError(null);
  };

  const handleDeleteSession = async (id: string) => {
    if (!adminPassword) return;
    if (!confirm('Usunąć tę sesję z historii i rankingu?')) return;
    const res = await deletePasjonaciSession(id, adminPassword);
    if (!res.ok) { alert(res.error); return; }
    load();
  };

  const handleSaveSession = async (id: string, results: LeagueSessionResult[]) => {
    if (!adminPassword) return;
    const res = await editPasjonaciSession(id, adminPassword, results);
    if (!res.ok) { alert(res.error); return; }
    setEditingSessionId(null);
    load();
  };

  const handleRemovePlayer = async () => {
    if (!adminPassword || !removeNick.trim()) return;
    if (!confirm(`Usunąć gracza "${removeNick.trim()}" ze wszystkich wyników i rankingu?`)) return;
    const res = await removePasjonaciPlayer(removeNick.trim(), adminPassword);
    if (!res.ok) { alert(res.error); return; }
    setRemoveNick('');
    load();
  };

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-poker-coral text-sm mb-4">{error}</p>
          <a href="/pasjonaci" className="text-poker-yellow/60 text-xs hover:text-poker-yellow transition">← Wróć</a>
        </div>
      </main>
    );
  }

  if (!league) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-poker-yellow/50 text-sm">Ładowanie...</p>
      </main>
    );
  }

  const activePeriod = showAllTime ? league.allTime : league.currentPeriod;
  const activePeriodId: number | 'all-time' = showAllTime ? 'all-time' : league.currentPeriod.startedAt;

  return (
    <main className="min-h-screen p-4 pb-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="pt-4 mb-1">
          <a href="/pasjonaci" className="text-poker-yellow/50 text-xs hover:text-poker-yellow transition">← Pasjonaci</a>
        </div>
        <h1 className="font-serif italic text-2xl text-poker-gold text-center mt-2 mb-1">🏆 Pasjonaci</h1>
        <p className="text-poker-yellow/40 text-xs text-center mb-6">
          Wspólne wyniki wszystkich stołów utworzonych z pokero.pl/pasjonaci
        </p>

        {/* Period toggle */}
        <div className="flex bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-1 mb-4">
          <button
            onClick={() => setShowAllTime(false)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition ${!showAllTime ? 'bg-poker-gold text-poker-bg' : 'text-poker-yellow/60'}`}
          >
            Ten tydzień
          </button>
          <button
            onClick={() => setShowAllTime(true)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition ${showAllTime ? 'bg-poker-gold text-poker-bg' : 'text-poker-yellow/60'}`}
          >
            Cały czas
          </button>
        </div>

        {!showAllTime && (
          <p className="text-poker-yellow/40 text-[11px] text-center mb-3">
            Trwa od {formatDate(activePeriod.startedAt)} · automatyczny reset po 7 dniach
          </p>
        )}

        {/* Ranking */}
        <div className="mb-5">
          <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Ranking</p>
          {activePeriod.balances.length === 0 ? (
            <p className="text-poker-yellow/40 text-xs text-center py-4">
              Brak jeszcze żadnych sesji w tym okresie. Stwórz stół na{' '}
              <a href="/pasjonaci" className="text-poker-gold underline">pokero.pl/pasjonaci</a>, żeby zaczęły się liczyć.
            </p>
          ) : (
            <div className="space-y-1.5">
              {activePeriod.balances.map((b) => <BalanceRow key={b.nick} b={b} />)}
            </div>
          )}
        </div>

        {/* Settlement */}
        <div className="mb-6">
          <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Rozliczenie</p>
          <p className="text-poker-yellow/35 text-[11px] mb-2">Zaznacz, gdy oddasz swój dług — każdy rozlicza się sam.</p>
          <SettlementList settlements={activePeriod.settlements} periodId={activePeriodId} onToggle={handleToggleSettlement} />
        </div>

        {/* Past periods */}
        {league.pastPeriods.length > 0 && (
          <div className="mb-5">
            <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Poprzednie tygodnie</p>
            <div className="space-y-2">
              {league.pastPeriods.map((p, i) => (
                <details key={i} className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg px-3 py-2">
                  <summary className="text-poker-yellow text-xs cursor-pointer">
                    {formatDate(p.startedAt)} – {p.endedAt ? formatDate(p.endedAt) : '?'}
                  </summary>
                  <div className="mt-2 space-y-1">
                    {p.balances.map((b) => <BalanceRow key={b.nick} b={b} />)}
                  </div>
                  <div className="mt-2">
                    <SettlementList settlements={p.settlements} periodId={p.startedAt} onToggle={handleToggleSettlement} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Session history */}
        {league.sessions.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2 flex items-center gap-1"
            >
              Historia sesji ({league.sessions.length}) {showHistory ? '▲' : '▼'}
            </button>
            {showHistory && (
              <div className="space-y-2">
                {league.sessions.map((s) => (
                  <div key={s.id} className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-poker-yellow/50 text-[10px]">{formatDate(s.playedAt)}</p>
                      {adminPassword && editingSessionId !== s.id && (
                        <div className="flex items-center gap-2.5">
                          <button onClick={() => setEditingSessionId(s.id)} className="text-poker-yellow/50 text-[10px] hover:text-poker-yellow transition">
                            ✏️ Edytuj
                          </button>
                          <button onClick={() => handleDeleteSession(s.id)} className="text-poker-coral text-[10px] hover:text-poker-coral/70 transition">
                            🗑 Usuń
                          </button>
                        </div>
                      )}
                    </div>
                    {editingSessionId === s.id ? (
                      <SessionEditForm
                        session={s}
                        onSave={(results) => handleSaveSession(s.id, results)}
                        onCancel={() => setEditingSessionId(null)}
                      />
                    ) : (
                      <div className="space-y-1">
                        {s.results.map((r) => (
                          <div key={r.nick} className="flex items-center justify-between text-xs">
                            <span className="text-poker-yellow">{r.nick}</span>
                            <span className={r.netResult >= 0 ? 'text-green-400' : 'text-poker-coral'}>
                              {formatNet(r.netResult)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin */}
        <div className="pt-4 border-t border-poker-gold/10">
          <button
            onClick={() => setShowAdminPrompt((v) => !v)}
            className="text-poker-yellow/30 text-[11px] flex items-center gap-1 mx-auto hover:text-poker-yellow/50 transition"
          >
            Jesteś adminem?
          </button>
          {showAdminPrompt && !adminPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyAdmin()}
                  placeholder="Hasło administratora"
                  className="flex-1 bg-poker-yellow/5 border border-poker-gold/20 text-poker-yellow text-xs px-3 py-2 rounded-lg placeholder:text-poker-yellow/30 focus:outline-none focus:border-poker-gold/50"
                />
                <button
                  onClick={handleVerifyAdmin}
                  disabled={verifying}
                  className="bg-poker-gold/15 border border-poker-gold/30 text-poker-yellow text-xs font-medium px-4 rounded-lg active:scale-95 transition disabled:opacity-40"
                >
                  {verifying ? '...' : 'Zatwierdź'}
                </button>
              </div>
              {adminError && <p className="text-poker-coral text-[11px] text-center">{adminError}</p>}
            </div>
          )}
          {adminPassword && (
            <div className="mt-3 bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-3 space-y-2">
              <p className="text-poker-yellow/60 text-[11px]">
                ✓ Tryb administratora. Edytuj/usuń sesje w historii powyżej albo usuń gracza z rankingu:
              </p>
              <div className="flex gap-2">
                <input
                  value={removeNick}
                  onChange={(e) => setRemoveNick(e.target.value)}
                  placeholder="Nick gracza"
                  className="flex-1 bg-poker-bg border border-poker-gold/25 text-poker-yellow text-xs px-3 py-2 rounded-lg placeholder:text-poker-yellow/30 focus:outline-none focus:border-poker-gold/60"
                />
                <button
                  onClick={handleRemovePlayer}
                  className="bg-poker-coral/10 border border-poker-coral/30 text-poker-coral text-xs font-medium px-3 rounded-lg active:scale-95 transition"
                >
                  Usuń z rankingu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
