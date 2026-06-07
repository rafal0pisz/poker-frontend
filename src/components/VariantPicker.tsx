'use client';

import type { GameVariant } from '@/lib/types';

export const VARIANT_LABELS: Record<GameVariant, string> = {
  texas: "Texas Hold'em",
  omaha: 'Omaha (4-card)',
  'omaha-pl': 'Omaha Pot Limit',
  drawmaha: 'Drawmaha',
  'drawmaha-pl': 'Drawmaha Pot Limit',
  pineapple: 'Crazy Pineapple',
  'pineapple-classic': 'Pineapple Classic',
};

const VARIANT_DESCRIPTIONS: Record<GameVariant, string> = {
  texas: 'Classic · 2 hole + 5 board',
  omaha: '4 hole · must use 2 + 3 board',
  'omaha-pl': '4 hole · must use exactly 2+3 · max bet = pot size',
  drawmaha: '5 hole · Five-card Draw · split pot (Omaha + Draw)',
  'drawmaha-pl': '5 hole · draw + split pot · max bet = pot size',
  pineapple: '3 hole · use 0, 1 or 2 from hand · no discard',
  'pineapple-classic': '3 hole · discard 1 after flop · Texas rules',
};

// All variants are now fully implemented
const AVAILABLE_VARIANTS: GameVariant[] = ['texas', 'omaha', 'omaha-pl', 'drawmaha', 'drawmaha-pl', 'pineapple'];

interface Props {
  currentVariant: GameVariant;
  onSelect: (variant: GameVariant) => void;
  onClose: () => void;
}

export function VariantPicker({ currentVariant, onSelect, onClose }: Props) {
  const variants: GameVariant[] = AVAILABLE_VARIANTS;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-poker-bg-light w-full max-w-md rounded-2xl border border-poker-gold/30 p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif italic text-lg text-poker-gold">Dealer&apos;s Choice</h2>
          <button
            onClick={onClose}
            className="text-poker-yellow/60 hover:text-poker-yellow text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-poker-yellow/50 text-xs mb-4">
          When you&apos;re the dealer, deal this game
        </p>

        <div className="flex flex-col gap-2">
          {variants.map((v) => {
            const isAvailable = AVAILABLE_VARIANTS.includes(v);
            const isSelected = v === currentVariant;

            if (!isAvailable) {
              return (
                <div
                  key={v}
                  className="bg-poker-yellow/5 border border-poker-gold/15 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-poker-yellow text-sm">{VARIANT_LABELS[v]}</p>
                      <p className="text-poker-yellow/50 text-[10px]">{VARIANT_DESCRIPTIONS[v]}</p>
                    </div>
                    <span className="bg-poker-yellow/10 text-poker-yellow/50 text-[9px] tracking-wider px-2 py-0.5 rounded">
                      SOON
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={v}
                onClick={() => onSelect(v)}
                className={`text-left px-4 py-3 rounded-lg border transition active:scale-[0.98] ${
                  isSelected
                    ? 'bg-poker-gold/15 border-poker-gold border-2'
                    : 'bg-poker-yellow/5 border-poker-gold/20 hover:bg-poker-yellow/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-poker-gold' : 'text-poker-yellow'}`}>
                      {VARIANT_LABELS[v]}

                    </p>
                    <p className={`text-[10px] ${isSelected ? 'text-poker-gold/70' : 'text-poker-yellow/50'}`}>
                      {VARIANT_DESCRIPTIONS[v]}
                    </p>
                  </div>
                  {isSelected && <span className="text-poker-gold text-lg">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-poker-gold/40 text-[10px] text-center mt-4 italic">
          Your pick stays for all your future deals
        </p>
      </div>
    </div>
  );
}
