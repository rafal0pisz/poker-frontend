'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getPasjonaciResults,
  closePasjonaciPeriod,
  resetPasjonaci,
  type PasjonaciView,
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

export default function PasjonaciResultsPage() {
  const [league, setLeague] = useState<PasjonaciView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllTime, setShowAllTime] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [password, setPassword] = useState('');
  const [closing, setClosing] = useState(false);
  const [resetting, setResetting] = useState(false);

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

  const handleClosePeriod = async () => {
    if (!password) { alert('Podaj hasło'); return; }
    if (!confirm('Zamknąć bieżący tydzień teraz i zacząć rozliczenie od nowa?')) return;
    setClosing(true);
    const res = await closePasjonaciPeriod(password);
    setClosing(false);
    if (!res.ok) { alert(res.error); return; }
    setPassword('');
    load();
  };

  const handleReset = async () => {
    if (!password) { alert('Podaj hasło'); return; }
    if (!confirm('Usunąć WSZYSTKIE wyniki i całą historię? Tej operacji nie można cofnąć.')) return;
    setResetting(true);
    const res = await resetPasjonaci(password);
    setResetting(false);
    if (!res.ok) { alert(res.error); return; }
    setPassword('');
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
        <div className="mb-5">
          <p className="text-poker-yellow/60 text-xs uppercase tracking-wide mb-2">Rozliczenie</p>
          <SettlementList settlements={activePeriod.settlements} />
        </div>

        {/* Password-gated settlement actions */}
        <div className="mb-6">
          <button
            onClick={() => setShowSettle((v) => !v)}
            className="text-poker-yellow/50 text-xs flex items-center gap-1 mx-auto"
          >
            🔒 Rozliczenia {showSettle ? '▲' : '▼'}
          </button>
          {showSettle && (
            <div className="mt-3 bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-3 space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
                className="w-full bg-poker-bg border border-poker-gold/25 text-poker-yellow text-sm px-3 py-2 rounded-lg placeholder:text-poker-yellow/30 focus:outline-none focus:border-poker-gold/60"
              />
              <button
                onClick={handleClosePeriod}
                disabled={closing || resetting || activePeriod.balances.length === 0}
                className="w-full bg-poker-gold/10 border border-poker-gold/25 text-poker-yellow text-xs font-medium py-2.5 rounded-lg active:scale-95 transition disabled:opacity-40"
              >
                {closing ? 'Zamykanie...' : '⏭ Zamknij tydzień teraz'}
              </button>
              <button
                onClick={handleReset}
                disabled={closing || resetting}
                className="w-full bg-poker-coral/10 border border-poker-coral/30 text-poker-coral text-xs font-medium py-2.5 rounded-lg active:scale-95 transition disabled:opacity-40"
              >
                {resetting ? 'Usuwanie...' : '🗑 Usuń wszystkie wyniki'}
              </button>
            </div>
          )}
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
                    <SettlementList settlements={p.settlements} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Session history */}
        {league.sessions.length > 0 && (
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
        )}
      </div>
    </main>
  );
}
