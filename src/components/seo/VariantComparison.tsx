'use client';

import { useState } from 'react';
import Link from 'next/link';

const VARIANTS = [
  {
    id: 'texas',
    name: "Texas Hold'em",
    cards: 2,
    rule: 'Dowolna kombinacja (0–2)',
    limit: 'No Limit',
    splitPot: false,
    draw: false,
    difficulty: 1,
    difficultyLabel: 'Łatwy',
    players: '2–9',
    href: '/zasady/texas-holdem/',
    tag: 'Najpopularniejszy',
    tagColor: 'rgb(var(--pk-gold-rgb))',
  },
  {
    id: 'omaha',
    name: 'Omaha',
    cards: 4,
    rule: 'Dokładnie 2+3',
    limit: 'No Limit',
    splitPot: false,
    draw: false,
    difficulty: 2,
    difficultyLabel: 'Średni',
    players: '2–9',
    href: '/zasady/omaha/',
    tag: null,
    tagColor: null,
  },
  {
    id: 'omaha-pl',
    name: 'Omaha Pot Limit',
    cards: 4,
    rule: 'Dokładnie 2+3',
    limit: 'Pot Limit',
    splitPot: false,
    draw: false,
    difficulty: 2,
    difficultyLabel: 'Średni',
    players: '2–9',
    href: '/zasady/omaha-pot-limit/',
    tag: 'Popularne PLO',
    tagColor: 'rgb(var(--pk-gold-rgb))',
  },
  {
    id: 'pineapple',
    name: 'Crazy Pineapple',
    cards: 3,
    rule: 'Max 2 z ręki (Texas-style)',
    limit: 'No Limit',
    splitPot: false,
    draw: false,
    difficulty: 1,
    difficultyLabel: 'Łatwy',
    players: '2–9',
    href: '/zasady/crazy-pineapple/',
    tag: 'Dobry dla nowych',
    tagColor: '#4ade80',
  },
  {
    id: 'drawmaha',
    name: 'Drawmaha',
    cards: 5,
    rule: 'Split: Omaha 2+3 + Draw',
    limit: 'No Limit',
    splitPot: true,
    draw: true,
    difficulty: 3,
    difficultyLabel: 'Zaawansowany',
    players: '2–7',
    href: '/zasady/drawmaha/',
    tag: 'Unikalny',
    tagColor: '#a78bfa',
  },
  {
    id: 'drawmaha-pl',
    name: 'Drawmaha Pot Limit',
    cards: 5,
    rule: 'Split: Omaha 2+3 + Draw',
    limit: 'Pot Limit',
    splitPot: true,
    draw: true,
    difficulty: 3,
    difficultyLabel: 'Zaawansowany',
    players: '2–7',
    href: '/zasady/drawmaha-pot-limit/',
    tag: null,
    tagColor: null,
  },
];

type SortKey = 'name' | 'cards' | 'difficulty' | 'limit';
type Filter = 'all' | 'easy' | 'medium' | 'hard' | 'pot-limit' | 'split';

function DifficultyDots({ level }: { level: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i <= level ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-gold-rgb),0.2)',
        }} />
      ))}
    </div>
  );
}

export function VariantComparison() {
  const [sort, setSort] = useState<SortKey>('difficulty');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [filter, setFilter] = useState<Filter>('all');

  function toggleSort(key: SortKey) {
    if (sort === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSort(key); setSortDir(1); }
  }

  const filtered = VARIANTS.filter(v => {
    if (filter === 'easy') return v.difficulty === 1;
    if (filter === 'medium') return v.difficulty === 2;
    if (filter === 'hard') return v.difficulty === 3;
    if (filter === 'pot-limit') return v.limit === 'Pot Limit';
    if (filter === 'split') return v.splitPot;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sort] as string | number;
    const vb = b[sort] as string | number;
    return va < vb ? -sortDir : va > vb ? sortDir : 0;
  });

  const thStyle = (key: SortKey): React.CSSProperties => ({
    padding: '10px 12px',
    textAlign: 'left' as const,
    fontSize: 11,
    fontWeight: 500,
    color: sort === key ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-cream-rgb),0.5)',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
    userSelect: 'none' as const,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.15)',
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Wszystkie' },
    { key: 'easy', label: 'Łatwe' },
    { key: 'medium', label: 'Średnie' },
    { key: 'hard', label: 'Zaawansowane' },
    { key: 'pot-limit', label: 'Pot Limit' },
    { key: 'split', label: 'Split pot' },
  ];

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: `1px solid ${filter === f.key ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-gold-rgb),0.25)'}`,
              background: filter === f.key ? 'rgba(var(--pk-gold-rgb),0.12)' : 'transparent',
              color: filter === f.key ? 'rgb(var(--pk-gold-rgb))' : 'rgba(var(--pk-cream-rgb),0.55)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr>
              <th style={thStyle('name')} onClick={() => toggleSort('name')}>
                Wariant {sort === 'name' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th style={thStyle('cards')} onClick={() => toggleSort('cards')}>
                Karty {sort === 'cards' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th style={{ ...thStyle('limit'), cursor: 'default' }}>Reguła użycia</th>
              <th style={thStyle('limit')} onClick={() => toggleSort('limit')}>
                Limit {sort === 'limit' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th style={thStyle('difficulty')} onClick={() => toggleSort('difficulty')}>
                Poziom {sort === 'difficulty' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th style={{ ...thStyle('name'), cursor: 'default' }}>Graczy</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v, i) => (
              <tr key={v.id} style={{ background: i % 2 === 0 ? 'rgba(var(--pk-gold-rgb),0.03)' : 'transparent' }}>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  <div>
                    <Link
                      href={v.href}
                      style={{ fontSize: 14, fontWeight: 500, color: 'rgb(var(--pk-cream-rgb))', textDecoration: 'none' }}
                    >
                      {v.name}
                    </Link>
                    {v.tag && (
                      <span style={{
                        display: 'inline-block',
                        marginLeft: 8,
                        fontSize: 9,
                        padding: '1px 6px',
                        borderRadius: 4,
                        border: `1px solid ${v.tagColor}40`,
                        color: v.tagColor!,
                        background: `${v.tagColor}12`,
                      }}>
                        {v.tag}
                      </span>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {v.splitPot && <span style={{ fontSize: 9, color: 'rgba(167,139,250,0.8)', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 3, padding: '1px 5px' }}>split pot</span>}
                      {v.draw && <span style={{ fontSize: 9, color: 'rgba(74,222,128,0.8)', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 3, padding: '1px 5px' }}>wymiana kart</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 12px', fontSize: 14, color: 'rgb(var(--pk-gold-rgb))', fontWeight: 500, borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  {v.cards}
                </td>
                <td style={{ padding: '12px 12px', fontSize: 12, color: 'rgba(var(--pk-cream-rgb),0.55)', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  {v.rule}
                </td>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: v.limit === 'Pot Limit' ? 'rgba(251,146,60,0.1)' : 'rgba(var(--pk-cream-rgb),0.06)',
                    border: `1px solid ${v.limit === 'Pot Limit' ? 'rgba(251,146,60,0.3)' : 'rgba(var(--pk-cream-rgb),0.15)'}`,
                    color: v.limit === 'Pot Limit' ? '#fb923c' : 'rgba(var(--pk-cream-rgb),0.6)',
                  }}>
                    {v.limit}
                  </span>
                </td>
                <td style={{ padding: '12px 12px', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <DifficultyDots level={v.difficulty} />
                    <span style={{ fontSize: 10, color: 'rgba(var(--pk-cream-rgb),0.4)' }}>{v.difficultyLabel}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 12px', fontSize: 13, color: 'rgba(var(--pk-cream-rgb),0.6)', borderBottom: '1px solid rgba(var(--pk-gold-rgb),0.08)' }}>
                  {v.players}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(var(--pk-cream-rgb),0.4)', padding: '2rem', fontSize: 14 }}>
          Brak wariantów pasujących do filtra.
        </p>
      )}

      <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(var(--pk-cream-rgb),0.3)' }}>
        Kliknij nagłówek kolumny aby sortować. Kliknij nazwę wariantu aby przejść do pełnych zasad.
      </p>
    </div>
  );
}
