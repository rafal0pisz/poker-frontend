'use client';

import type { PlayerStats, SessionResult } from '@/lib/types';

interface Props {
  stats: PlayerStats | null;
  sessionResult?: SessionResult;
  onClose: () => void;
}

function StatRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
      <span style={{ fontSize: 13, color: 'rgba(245,230,192,0.55)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#f5e6c0' }}>{value}</span>
        {sub && <span style={{ fontSize: 11, color: 'rgba(245,230,192,0.35)', marginLeft: 6 }}>{sub}</span>}
      </div>
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ height: 6, width: `${Math.min(100, pct)}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  );
}

export function PlayerStatsModal({ stats, sessionResult, onClose }: Props) {
  if (!stats) return null;

  const winRate = stats.handsPlayed > 0
    ? Math.round((stats.handsWon / stats.handsPlayed) * 100)
    : 0;

  const netResult = sessionResult?.netResult ?? stats.totalWon;
  const isProfit = netResult > 0;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#0f0f17', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, width: '100%', maxWidth: 360, padding: '24px 24px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '2px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#d4af37' }}>
              {stats.nick.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#f5e6c0' }}>{stats.nick}</div>
              <div style={{ fontSize: 11, color: 'rgba(245,230,192,0.4)', marginTop: 1 }}>Statystyki sesji</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(245,230,192,0.4)', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        {/* Net result hero */}
        <div style={{ background: isProfit ? 'rgba(74,222,128,0.06)' : netResult < 0 ? 'rgba(248,113,113,0.06)' : 'rgba(212,175,55,0.05)', border: `1px solid ${isProfit ? 'rgba(74,222,128,0.2)' : netResult < 0 ? 'rgba(248,113,113,0.2)' : 'rgba(212,175,55,0.15)'}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,230,192,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Wynik netto</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: isProfit ? '#4ade80' : netResult < 0 ? '#f87171' : 'rgba(245,230,192,0.5)', letterSpacing: -1 }}>
            {isProfit ? '+' : ''}{netResult}
          </div>
          {sessionResult && (
            <div style={{ fontSize: 11, color: 'rgba(245,230,192,0.35)', marginTop: 4 }}>
              buy-in {sessionResult.totalBuyIn} → {sessionResult.finalChips} żetonów
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 8 }}>
          <StatRow label="Rozegrane ręce" value={stats.handsPlayed} />

          <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(245,230,192,0.55)' }}>Win rate</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: winRate >= 50 ? '#4ade80' : '#f5e6c0' }}>{winRate}%</span>
            </div>
            <Bar pct={winRate} color={winRate >= 50 ? '#4ade80' : '#d4af37'} />
          </div>

          <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(245,230,192,0.55)' }}>
                VPIP
                <span style={{ fontSize: 10, color: 'rgba(245,230,192,0.3)', marginLeft: 4 }}>dobrowolne wejścia</span>
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f5e6c0' }}>{stats.vpip}%</span>
            </div>
            <Bar pct={stats.vpip} color='#d4af37' />
          </div>

          <StatRow label="Wygrane ręce" value={stats.handsWon} />
          <StatRow label="Spasowane ręce" value={stats.foldCount} />
          <StatRow label="All-in" value={stats.allInCount} />

          {stats.biggestPot > 0 && (
            <StatRow
              label="Największy pot"
              value={stats.biggestPot}
              sub={stats.biggestPotHand || undefined}
            />
          )}

          {stats.bestHand && (
            <StatRow label="Najlepsza ręka" value={stats.bestHand} />
          )}
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', padding: '10px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, color: '#d4af37', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 8 }}
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}
