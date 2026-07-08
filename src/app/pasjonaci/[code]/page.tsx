'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getLeague,
  closeLeaguePeriod,
  getLeagueAdminToken,
  type LeagueView,
  type PlayerBalance,
  type Settlement,
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

function SettlementList({ settlements }: { settlements: Settlement[] }) {
  if (settlements.length === 0) {
    return <p className="text-poker-yellow/40 text-xs text-center py-3">Wszyscy rozliczeni ✓</p>;
  }
  return (
    <div className="space-y-1.5">
      {settlements.map((s, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2 bg-poker-gold/10 border border-poker-gold/20 rounded-lg text-sm">
          <span className="text-poker-yellow">
            <span className="font-medium">{s.from}</span> jest winny <span className="font-medium text-poker-gold">{s.amount}</span> żetonów <span className="font-medium">{s.to}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PasjonaciLeaguePage({ params }: { params: { code: string } }) {
  const leagueId = params.code.toUpperCase();
  const [league, setLeague] = useState<LeagueView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAllTime, setShowAllTime] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    const res = await getLeague(leagueId);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setLeague(res.league);
    setError(null);
  }, [leagueId]);

  useEffect(() => {
    load();
    // Admin status is purely local (adminToken stored in this browser) —
    // no server round-trip needed to gate the "close period" button.
    setIsAdmin(!!getLeagueAdminToken(leagueId));
  }, [leagueId, load]);

  const handleClosePeriod = async () => {
    const token = getLeagueAdminToken(leagueId);
    if (!token) return;
    if (!confirm('Zamknąć bieżący tydzień teraz i zacząć rozliczenie od nowa?')) return;
    setClosing(true);
    const res = await closeLeaguePeriod(leagueId, token);
    setClosing(false);
    if (!res.ok) { alert(res.error); return; }
    load();
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(leagueId);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
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

  return (
    <main className="min-h-screen p-4 pb-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-1 pt-4">
          <a href="/pasjonaci" className="text-poker-yellow/50 text-xs hover:text-poker-yellow transition">← Pasjonaci</a>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 bg-poker-yellow/10 border border-poker-gold/20 px-2.5 py-1 rounded-lg"
          >
            <span className="font-mono text-poker-gold text-xs tracking-wider">{league.id}</span>
            <span className="text-poker-gold/50 text-[10px]">{codeCopied ? '✓' : '⧉'}</span>
          </button>
        </div>
        <h1 className="font-serif italic text-2xl text-poker-gold text-center mt-2 mb-1">{league.name}</h1>
        <p className="text-poker-yellow/40 text-xs text-center mb-6">
          Stół Pasjonaci · od {formatDate(league.createdAt)}
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
            <p className="text-poker-yellow/40 text-xs text-center py-4">Brak jeszcze żadnych sesji w tym okresie.</p>
          ) : (
            <div className="space-y-1.5">
              {activePeriod.balances.map((b) => <BalanceRow key={b.nick} b={b} />)}
            </div>
          )}
        </div>

        {/* Settlement */}
        <div className="mb-5">
          <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Rozliczenie</p>
          <SettlementList settlements={activePeriod.settlements} />
        </div>

        {/* Admin: close period */}
        {isAdmin && !showAllTime && (
          <button
            onClick={handleClosePeriod}
            disabled={closing}
            className="w-full bg-poker-yellow/5 border border-poker-gold/25 text-poker-yellow/70 text-xs font-medium py-2.5 rounded-lg active:scale-95 transition mb-6 disabled:opacity-40"
          >
            {closing ? 'Zamykanie...' : '⏭ Zamknij tydzień teraz'}
          </button>
        )}

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
                    <SettlementList settlements={p.settlements} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Session history */}
        <div>
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
                  <p className="text-poker-yellow/50 text-[10px] mb-1.5">{formatDate(s.playedAt)}</p>
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
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-poker-yellow/30 text-[11px] text-center mt-8">
          Podepnij ten stół w panelu admina swojego pokoju (kod: <span className="font-mono text-poker-gold/50">{league.id}</span>),
          żeby wyniki zapisywały się tu automatycznie.
        </p>
      </div>
    </main>
  );
}
