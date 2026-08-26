'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getPasjonaciResults,
  getPasjonaciTournaments,
  payLeagueSettlement,
  undoLeaguePayment,
  verifyPasjonaciAdmin,
  deletePasjonaciSession,
  editPasjonaciSession,
  removePasjonaciPlayer,
  resetPasjonaciLedger,
  addPasjonaciTournament,
  deletePasjonaciTournament,
  type PasjonaciView,
  type Settlement,
  type Payment,
  type LeagueSession,
  type LeagueSessionResult,
  type TournamentRecord,
  type TournamentRecordEntry,
} from '@/lib/leagueApi';
import { payoutShares } from '@/lib/tournamentPresets';

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function TournamentCard({ t, onDelete }: { t: TournamentRecord; onDelete?: (id: string) => void }) {
  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg px-3 py-2.5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-poker-gold text-sm font-medium">Turniej {t.number}</p>
        <div className="flex items-center gap-2">
          <p className="text-poker-yellow/40 text-[10px]">{formatDate(t.finishedAt)} · {t.totalPlayers} graczy</p>
          {onDelete && (
            <button onClick={() => onDelete(t.id)} className="text-poker-coral text-[10px] hover:text-poker-coral/70 transition">
              🗑
            </button>
          )}
        </div>
      </div>
      <p className="text-poker-yellow/40 text-[10px] mb-2">
        Pula: {t.poolTotal}{t.rebuyCount > 0 ? ` · ${t.rebuyCount} dokupie${t.rebuyCount === 1 ? 'nie' : t.rebuyCount < 5 ? 'nia' : 'ń'}` : ''}
      </p>
      <div className="space-y-1">
        {t.results.map((r) => {
          // Net profit/loss = prize won - total invested (starting stack, x2
          // if this player used their rebuy). Only computable on records that
          // saved startingStack (added alongside the per-player rebuy flag) —
          // older manually-migrated records won't have it.
          const invested = t.startingStack != null ? t.startingStack * (1 + (r.rebuy ? 1 : 0)) : null;
          const net = invested != null ? r.amount - invested : null;
          return (
            <div key={r.nick} className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-1.5 ${r.amount > 0 ? 'text-poker-yellow' : 'text-poker-yellow/50'}`}>
                <span>{MEDALS[r.place] ?? `${r.place}.`}</span>
                {r.nick}
              </span>
              <span className="flex items-center gap-2">
                <span className={r.amount > 0 ? 'text-poker-gold font-medium' : 'text-poker-yellow/30'}>
                  {r.amount > 0 ? `+${r.amount}` : '—'}
                </span>
                {net !== null && (
                  <span className={`text-[10px] ${net > 0 ? 'text-green-400' : net < 0 ? 'text-poker-coral' : 'text-poker-yellow/40'}`}>
                    ({formatNet(net)})
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ts));
}

function formatNet(net: number): string {
  return net > 0 ? `+${net}` : `${net}`;
}

function SettlementList({ settlements, onPay }: { settlements: Settlement[]; onPay: (s: Settlement) => void }) {
  if (settlements.length === 0) {
    return <p className="text-poker-yellow/40 text-xs text-center py-3">Wszyscy rozliczeni ✓</p>;
  }
  return (
    <div className="space-y-1.5">
      {settlements.map((s, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm bg-poker-gold/10 border border-poker-gold/20">
          <span className="flex-1 text-poker-yellow">
            <span className="font-medium">{s.from}</span> jest winny{' '}
            <span className="font-medium text-poker-gold">{s.amount}</span> żetonów <span className="font-medium">{s.to}</span>
          </span>
          <button
            onClick={() => onPay(s)}
            className="shrink-0 text-[11px] text-green-400 border border-green-500/30 bg-green-500/5 px-2 py-1 rounded-md active:scale-95 transition hover:bg-green-500/10"
          >
            ✓ Opłacone
          </button>
        </div>
      ))}
    </div>
  );
}

function PaymentHistoryList({ payments, onUndo }: { payments: Payment[]; onUndo: (paymentId: string) => void }) {
  if (payments.length === 0) {
    return <p className="text-poker-yellow/40 text-xs text-center py-3">Brak jeszcze żadnych wpłat</p>;
  }
  return (
    <div className="space-y-1.5">
      {payments.map((p) => (
        <div key={p.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm bg-poker-yellow/5 border border-poker-gold/15">
          <span className="flex-1 text-poker-yellow/50 line-through">
            <span className="font-medium">{p.from}</span> → <span className="font-medium">{p.to}</span>:{' '}
            <span className="font-medium">{p.amount}</span>
          </span>
          <button
            onClick={() => onUndo(p.id)}
            className="shrink-0 text-[11px] text-poker-yellow/50 border border-poker-gold/20 px-2 py-1 rounded-md active:scale-95 transition hover:text-poker-yellow/80"
          >
            ↩ Cofnij
          </button>
        </div>
      ))}
    </div>
  );
}

// One game/session = one fully self-contained card: its own results, its
// own settlement (who owes whom for THIS game), and its own paid history —
// nothing here aggregates across other sessions.
function GameCard({
  session,
  isAdmin,
  isEditing,
  isExpanded,
  onToggleExpanded,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onPay,
  onUndo,
}: {
  session: LeagueSession;
  isAdmin: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onSave: (results: LeagueSessionResult[]) => void;
  onCancel: () => void;
  onDelete: () => void;
  onPay: (s: Settlement) => void;
  onUndo: (paymentId: string) => void;
}) {
  return (
    <div className="bg-poker-yellow/5 border border-poker-gold/15 rounded-lg px-3 py-2.5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-poker-yellow/50 text-[10px]">{formatDate(session.playedAt)}</p>
        {isAdmin && !isEditing && (
          <div className="flex items-center gap-2.5">
            <button onClick={onEdit} className="text-poker-yellow/50 text-[10px] hover:text-poker-yellow transition">
              ✏️ Edytuj
            </button>
            <button onClick={onDelete} className="text-poker-coral text-[10px] hover:text-poker-coral/70 transition">
              🗑 Usuń
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <SessionEditForm session={session} onSave={onSave} onCancel={onCancel} />
      ) : (
        <>
          <div className="space-y-1 mb-3">
            {session.results.map((r) => (
              <div key={r.nick} className="flex items-center justify-between text-xs">
                <span className="text-poker-yellow">{r.nick}</span>
                <span className={r.netResult >= 0 ? 'text-green-400' : 'text-poker-coral'}>{formatNet(r.netResult)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-poker-gold/10">
            <p className="text-poker-yellow/40 text-[10px] uppercase tracking-wide mb-1.5">Rozliczenie</p>
            <SettlementList settlements={session.settlements} onPay={onPay} />
          </div>

          {session.payments.length > 0 && (
            <div className="mt-2">
              <button onClick={onToggleExpanded} className="text-poker-yellow/40 text-[10px] flex items-center gap-1">
                Historia wpłat ({session.payments.length}) {isExpanded ? '▲' : '▼'}
              </button>
              {isExpanded && (
                <div className="mt-1.5">
                  <PaymentHistoryList payments={session.payments} onUndo={onUndo} />
                </div>
              )}
            </div>
          )}
        </>
      )}
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

interface TournamentRow {
  nick: string;
  place: number;
  rebuy: boolean;
}

function TournamentAddForm({
  onSave,
  onCancel,
}: {
  onSave: (rows: TournamentRow[], startingStack: number) => void;
  onCancel: () => void;
}) {
  const [startingStack, setStartingStack] = useState(200);
  const [rows, setRows] = useState<TournamentRow[]>([{ nick: '', place: 1, rebuy: false }]);

  const updateRow = (i: number, patch: Partial<TournamentRow>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const removeRow = (i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  };
  const addRow = () => {
    setRows((prev) => [...prev, { nick: '', place: prev.length + 1, rebuy: false }]);
  };

  return (
    <div className="space-y-2 bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-3 mb-3">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-poker-yellow/50 text-[11px] whitespace-nowrap">Starting stack</label>
        <input
          type="number"
          value={startingStack}
          onChange={(e) => setStartingStack(Math.max(1, Number(e.target.value)))}
          className="w-24 bg-poker-bg border border-poker-gold/25 text-poker-yellow text-xs px-2 py-1.5 rounded-md focus:outline-none focus:border-poker-gold/60"
        />
      </div>
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
            value={r.place}
            onChange={(e) => updateRow(i, { place: Math.max(1, Number(e.target.value)) })}
            placeholder="Miejsce"
            className="w-16 bg-poker-bg border border-poker-gold/25 text-poker-yellow text-xs px-2 py-1.5 rounded-md placeholder:text-poker-yellow/30 focus:outline-none focus:border-poker-gold/60"
          />
          <label className="flex items-center gap-1 text-[10px] text-poker-yellow/60 shrink-0 whitespace-nowrap">
            <input type="checkbox" checked={r.rebuy} onChange={(e) => updateRow(i, { rebuy: e.target.checked })} />
            rebuy
          </label>
          <button onClick={() => removeRow(i)} className="text-poker-coral text-xs px-1.5 shrink-0">✕</button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="w-full border border-dashed border-poker-gold/25 text-poker-yellow/50 text-xs py-1.5 rounded-md hover:text-poker-yellow/80 hover:border-poker-gold/40 transition"
      >
        + Dodaj gracza
      </button>
      <p className="text-poker-yellow/35 text-[10px]">
        Pula = starting stack × (liczba graczy + liczba rebuyów). Nagrody 50/30/20% dla top 3 (albo 62.5/37.5% przy 2 graczach) liczą się automatycznie.
      </p>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(rows.filter((r) => r.nick.trim()), startingStack)}
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

type Tab = 'games' | 'tournaments';

export default function PasjonaciResultsPage() {
  const [league, setLeague] = useState<PasjonaciView | null>(null);
  const [tournaments, setTournaments] = useState<TournamentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('games');
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({});

  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [removeNick, setRemoveNick] = useState('');
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [resetting, setResetting] = useState(false);

  const load = useCallback(async () => {
    const res = await getPasjonaciResults();
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setLeague(res.league);
    setError(null);
    const tRes = await getPasjonaciTournaments();
    if (tRes.ok) setTournaments(tRes.tournaments);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePaySettlement = async (sessionId: string, s: Settlement) => {
    if (!confirm(`Oznaczyć jako opłacone: ${s.from} → ${s.to}, ${s.amount} żetonów?\n\nTo trwale zmniejszy dług dla tej gry — nie da się tego cofnąć poza przyciskiem "Cofnij".`)) return;
    const res = await payLeagueSettlement(sessionId, s.from, s.to, s.amount);
    if (!res.ok) { alert(res.error); return; }
    load();
  };

  const handleUndoPayment = async (sessionId: string, paymentId: string) => {
    if (!confirm('Cofnąć tę wpłatę? Dług wróci do rozliczenia tej gry.')) return;
    const res = await undoLeaguePayment(sessionId, paymentId);
    if (!res.ok) { alert(res.error); return; }
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
    if (!confirm('Usunąć tę grę z historii?')) return;
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
    if (!confirm(`Usunąć gracza "${removeNick.trim()}" ze wszystkich gier w historii?`)) return;
    const res = await removePasjonaciPlayer(removeNick.trim(), adminPassword);
    if (!res.ok) { alert(res.error); return; }
    setRemoveNick('');
    load();
  };

  const handleResetLedger = async () => {
    if (!adminPassword) return;
    if (!confirm('Zresetować WSZYSTKIE wyniki cash game? Usunie to każdą grę, jej rozliczenie i historię wpłat. Turnieje zostaną nietknięte.')) return;
    if (!confirm('To naprawdę nieodwracalne — dane przepadną na zawsze. Kontynuować?')) return;
    setResetting(true);
    const res = await resetPasjonaciLedger(adminPassword);
    setResetting(false);
    if (!res.ok) { alert(res.error); return; }
    load();
  };

  const handleAddTournament = async (rows: TournamentRow[], startingStack: number) => {
    if (!adminPassword) return;
    if (rows.length === 0) { alert('Dodaj przynajmniej jednego gracza'); return; }
    const totalPlayers = rows.length;
    const rebuyCount = rows.filter((r) => r.rebuy).length;
    const poolTotal = startingStack * (totalPlayers + rebuyCount);
    const shares = payoutShares(totalPlayers);
    const results: TournamentRecordEntry[] = rows.map((r) => ({
      nick: r.nick.trim(),
      place: r.place,
      amount: r.place <= shares.length ? Math.round(poolTotal * shares[r.place - 1]) : 0,
      rebuy: r.rebuy,
    }));
    const res = await addPasjonaciTournament(adminPassword, results, totalPlayers, poolTotal, rebuyCount, startingStack);
    if (!res.ok) { alert(res.error); return; }
    setShowAddTournament(false);
    load();
  };

  const handleDeleteTournament = async (id: string) => {
    if (!adminPassword) return;
    if (!confirm('Usunąć ten turniej z historii?')) return;
    const res = await deletePasjonaciTournament(id, adminPassword);
    if (!res.ok) { alert(res.error); return; }
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

  return (
    <main className="min-h-screen p-4 pb-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="pt-4 mb-1">
          <a href="/pasjonaci" className="text-poker-yellow/50 text-xs hover:text-poker-yellow transition">← Pasjonaci</a>
        </div>
        <h1 className="font-serif italic text-2xl text-poker-gold text-center mt-2 mb-1">🏆 Pasjonaci</h1>
        <p className="text-poker-yellow/40 text-xs text-center mb-6">
          Wspólne wyniki wszystkich stołów utworzonych z pokero.pl/pasjonaci — każda gra rozliczana osobno
        </p>

        {/* Tab toggle */}
        <div className="flex bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition ${activeTab === 'games' ? 'bg-poker-gold text-poker-bg' : 'text-poker-yellow/60'}`}
          >
            Gry
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition ${activeTab === 'tournaments' ? 'bg-poker-gold text-poker-bg' : 'text-poker-yellow/60'}`}
          >
            Turnieje
          </button>
        </div>

        {activeTab === 'tournaments' ? (
          <div className="mb-8">
            {adminPassword && (
              showAddTournament ? (
                <TournamentAddForm onSave={handleAddTournament} onCancel={() => setShowAddTournament(false)} />
              ) : (
                <button
                  onClick={() => setShowAddTournament(true)}
                  className="w-full border border-dashed border-poker-gold/25 text-poker-yellow/50 text-xs py-2 rounded-md hover:text-poker-yellow/80 hover:border-poker-gold/40 transition mb-3"
                >
                  + Dodaj turniej ręcznie
                </button>
              )
            )}
            {tournaments.length === 0 ? (
              <p className="text-poker-yellow/40 text-xs text-center py-4">
                Brak jeszcze żadnych turniejów. Stwórz stół turniejowy na{' '}
                <a href="/pasjonaci" className="text-poker-gold underline">pokero.pl/pasjonaci</a>, żeby zaczęły się liczyć.
              </p>
            ) : (
              <div className="space-y-2">
                {tournaments.map((t) => <TournamentCard key={t.id} t={t} onDelete={adminPassword ? handleDeleteTournament : undefined} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-poker-yellow/35 text-[11px] mb-3">
              Każda gra ma własne rozliczenie — kliknij &quot;Opłacone&quot;, gdy dług z TEJ gry zostanie oddany.
            </p>
            {league.sessions.length === 0 ? (
              <p className="text-poker-yellow/40 text-xs text-center py-4">
                Brak jeszcze żadnych gier. Stwórz stół na{' '}
                <a href="/pasjonaci" className="text-poker-gold underline">pokero.pl/pasjonaci</a>, żeby zaczęły się liczyć.
              </p>
            ) : (
              <div className="space-y-3">
                {league.sessions.map((s) => (
                  <GameCard
                    key={s.id}
                    session={s}
                    isAdmin={!!adminPassword}
                    isEditing={editingSessionId === s.id}
                    isExpanded={!!expandedPayments[s.id]}
                    onToggleExpanded={() => setExpandedPayments((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                    onEdit={() => setEditingSessionId(s.id)}
                    onSave={(results) => handleSaveSession(s.id, results)}
                    onCancel={() => setEditingSessionId(null)}
                    onDelete={() => handleDeleteSession(s.id)}
                    onPay={(s2) => handlePaySettlement(s.id, s2)}
                    onUndo={(paymentId) => handleUndoPayment(s.id, paymentId)}
                  />
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
            <div className="mt-3 bg-poker-yellow/5 border border-poker-gold/20 rounded-lg p-3 space-y-3">
              <p className="text-poker-yellow/60 text-[11px]">
                ✓ Tryb administratora. Edytuj/usuń gry na liście powyżej albo usuń gracza z całej historii:
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
                  Usuń z historii
                </button>
              </div>
              <div className="pt-2 border-t border-poker-gold/10">
                <p className="text-poker-yellow/40 text-[10px] mb-1.5">
                  Nieodwracalne — usuwa wszystkie gry, rozliczenia i wpłaty (turnieje zostają).
                </p>
                <button
                  onClick={handleResetLedger}
                  disabled={resetting}
                  className="w-full bg-poker-coral/10 border border-poker-coral/40 text-poker-coral text-xs font-medium py-2 rounded-lg active:scale-95 transition disabled:opacity-40"
                >
                  {resetting ? 'Resetowanie...' : '⚠ Zresetuj wszystkie wyniki'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
