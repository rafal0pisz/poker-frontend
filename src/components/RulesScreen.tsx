'use client';

const PokeroLogo = () => (
  <svg width="140" height="34" viewBox="0 0 186 46" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="38"
      fontFamily="Rajdhani,'Arial Narrow',sans-serif"
      fontWeight="700" fontSize="40" fill="#d4af37"
      textLength="140" lengthAdjust="spacingAndGlyphs">POKER</text>
    <circle cx="159" cy="24" r="14.5" fill="#0d0d14" stroke="#d4af37" strokeWidth="2.3"/>
    <circle cx="159" cy="24" r="9.5" fill="#7a1414"/>
    <circle cx="159" cy="24" r="12.2" fill="none" stroke="#f5d76e" strokeWidth="0.8" strokeDasharray="2.2 1.9" opacity="0.75"/>
    <circle cx="159" cy="24" r="6.2" fill="none" stroke="#d4af37" strokeWidth="1"/>
  </svg>
);

interface Props {
  onBack: () => void;
}

const variants = [
  {
    name: "Texas Hold'em",
    icon: '♠',
    color: '#d4af37',
    cards: '2 hole cards',
    desc: "The most popular poker variant. Each player receives 2 hole cards and combines them with 5 community cards (flop, turn, river) to make the best 5-card hand. You can use any combination of your hole cards and the board.",
    streets: ['Preflop', 'Flop (3)', 'Turn (1)', 'River (1)', 'Showdown'],
  },
  {
    name: 'Omaha',
    icon: '♦',
    color: '#e07b39',
    cards: '4 hole cards',
    desc: "Each player receives 4 hole cards but must use exactly 2 of them combined with exactly 3 community cards. This creates bigger hands and more action compared to Texas Hold'em.",
    streets: ['Preflop', 'Flop (3)', 'Turn (1)', 'River (1)', 'Showdown'],
  },
  {
    name: 'Crazy Pineapple',
    icon: '🍍',
    color: '#5da832',
    cards: '3 hole cards',
    desc: "A fun twist on Texas Hold'em — each player gets 3 hole cards instead of 2. Just like Texas, you can use 0, 1 or 2 of your hole cards (maximum 2) combined with community cards to make the best 5-card hand. All 3 cards stay with you until showdown.",
    streets: ['Preflop', 'Flop (3)', 'Turn (1)', 'River (1)', 'Showdown'],
  },
  {
    name: 'Drawmaha',
    icon: '🃏',
    color: '#7b52d4',
    cards: '5 hole cards + draw',
    desc: "A unique split-pot variant. Players get 5 hole cards, then after the flop there's a draw phase where you can exchange cards. The pot is split 50/50 between the Omaha winner (best 2+3 board) and the Draw winner (best 5-card hand from hole cards only).",
    streets: ['Preflop', 'Flop (3)', 'Draw phase', 'Turn (1)', 'River (1)', 'Showdown'],
    special: 'Split pot: Omaha half + Five-card Draw half',
  },
  {
    name: 'Omaha Pot Limit',
    icon: '♦',
    color: '#e07b39',
    cards: '4 hole cards · max bet = pot',
    desc: "Same rules as Omaha — exactly 2 hole cards + exactly 3 board cards. The difference: your maximum raise is capped at the size of the current pot. You cannot go all-in beyond the pot size. Builds deeper, more strategic play.",
    streets: ['Preflop', 'Flop (3)', 'Turn (1)', 'River (1)', 'Showdown'],
    special: 'Pot Limit: max raise = current pot size',
  },
  {
    name: 'Drawmaha Pot Limit',
    icon: '🃏',
    color: '#7b52d4',
    cards: '5 hole cards + draw · max bet = pot',
    desc: 'All Drawmaha rules apply — 5 cards, draw phase after the flop, split pot. The difference: maximum raise is capped at the pot size. The card exchange phase becomes more strategic since you cannot end the hand with a massive all-in immediately after drawing.',
    streets: ['Preflop', 'Flop (3)', 'Draw phase', 'Turn (1)', 'River (1)', 'Showdown'],
    special: 'Split pot + Pot Limit: max raise = current pot size',
  },
];

const handRankings = [
  { rank: 1, name: 'Royal Flush', example: 'A♠ K♠ Q♠ J♠ 10♠', desc: 'Same suit, Ace to Ten' },
  { rank: 2, name: 'Straight Flush', example: '9♥ 8♥ 7♥ 6♥ 5♥', desc: '5 consecutive, same suit' },
  { rank: 3, name: 'Four of a Kind', example: 'K♠ K♥ K♦ K♣ 2♠', desc: '4 cards of same rank' },
  { rank: 4, name: 'Full House', example: 'J♠ J♥ J♦ 7♣ 7♥', desc: 'Three of a kind + pair' },
  { rank: 5, name: 'Flush', example: 'A♣ J♣ 8♣ 5♣ 2♣', desc: '5 cards same suit' },
  { rank: 6, name: 'Straight', example: '8♠ 7♥ 6♦ 5♣ 4♠', desc: '5 consecutive ranks' },
  { rank: 7, name: 'Three of a Kind', example: '7♠ 7♥ 7♦ K♣ 2♠', desc: '3 cards of same rank' },
  { rank: 8, name: 'Two Pair', example: 'A♠ A♥ 9♦ 9♣ K♠', desc: 'Two different pairs' },
  { rank: 9, name: 'One Pair', example: 'Q♠ Q♥ 9♦ 5♣ 2♠', desc: '2 cards of same rank' },
  { rank: 10, name: 'High Card', example: 'A♠ J♥ 8♦ 5♣ 2♠', desc: 'None of the above' },
];

export function RulesScreen({ onBack }: Props) {
  return (
    <main className="min-h-screen p-4 pb-12">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="text-poker-yellow/70 px-2 py-1 text-sm">← Back</button>
        <div className="flex-1 flex justify-center -ml-10">
          <PokeroLogo />
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-8">
        <h1 className="font-serif italic text-2xl text-poker-gold text-center">Game Rules</h1>

        {/* Dealer's Choice note */}
        <div className="bg-poker-gold/10 border border-poker-gold/25 rounded-xl p-4">
          <p className="text-poker-yellow/80 text-sm leading-relaxed">
            <span className="text-poker-gold font-medium">Dealer's Choice:</span> In each hand, the dealer picks the variant. Every player can set their preferred game — it activates when they deal. Use the <span className="text-poker-gold">D ▾</span> button during the game to select your preference.
          </p>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h2 className="text-poker-gold/70 text-xs uppercase tracking-widest">Game variants</h2>
          {variants.map((v) => (
            <div key={v.name} className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <p className="font-medium text-poker-yellow">{v.name}</p>
                  <p className="text-[11px] text-poker-yellow/50">{v.cards}</p>
                </div>
              </div>
              <p className="text-sm text-poker-yellow/70 leading-relaxed">{v.desc}</p>
              {v.special && (
                <div className="bg-poker-gold/10 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-poker-gold">✦ {v.special}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1 pt-1">
                {v.streets.map((s, i) => (
                  <span key={i} className="text-[10px] bg-poker-yellow/8 border border-poker-gold/15 text-poker-yellow/60 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,220,80,0.06)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hand rankings */}
        <div className="space-y-3">
          <h2 className="text-poker-gold/70 text-xs uppercase tracking-widest">Hand rankings (best → worst)</h2>
          <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl overflow-hidden">
            {handRankings.map((h, i) => (
              <div key={h.rank} className={`flex items-center gap-3 px-4 py-2.5 ${i < handRankings.length - 1 ? 'border-b border-poker-gold/10' : ''}`}>
                <span className="text-poker-gold/40 text-[11px] font-mono w-4">{h.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-poker-yellow font-medium">{h.name}</p>
                  <p className="text-[10px] text-poker-yellow/40">{h.desc}</p>
                </div>
                <span className="text-[10px] text-poker-gold/50 font-mono whitespace-nowrap">{h.example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blind structure */}
        <div className="space-y-3">
          <h2 className="text-poker-gold/70 text-xs uppercase tracking-widest">Blind structure</h2>
          <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-4 space-y-2">
            <p className="text-sm text-poker-yellow/70 leading-relaxed">
              <span className="text-poker-gold">Small Blind (SB)</span> — the player to the left of the dealer posts half the minimum bet.
            </p>
            <p className="text-sm text-poker-yellow/70 leading-relaxed">
              <span className="text-poker-gold">Big Blind (BB)</span> — the next player posts the full minimum bet.
            </p>
            <p className="text-sm text-poker-yellow/70 leading-relaxed">
              Action starts with the player after BB (preflop), then moves left from the dealer on all later streets.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
