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

import { useState } from 'react';


interface Props {
  onBack: () => void;
}

export function ContactScreen({ onBack }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('pokerosupport@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="text-poker-yellow/70 px-2 py-1 text-sm">← Back</button>
        <div className="flex-1 flex justify-center -ml-10">
          <PokeroLogo />
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="font-serif italic text-2xl text-poker-gold text-center">Contact</h1>

        {/* Email */}
        <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-5 space-y-3">
          <p className="text-poker-gold/60 text-xs uppercase tracking-widest">Support email</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-poker-yellow font-medium text-sm">pokerosupport@gmail.com</p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 bg-poker-gold/15 border border-poker-gold/30 text-poker-gold text-xs px-3 py-1.5 rounded-lg active:scale-95"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-poker-yellow/50 text-xs leading-relaxed">
            Questions, bug reports or suggestions — write to us anytime. We typically respond within 24 hours.
          </p>
        </div>

        {/* Version */}
        <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-5 space-y-1">
          <p className="text-poker-gold/60 text-xs uppercase tracking-widest mb-2">App version</p>
          <span className="font-mono text-poker-gold text-sm">v1.0.0</span>
        </div>

        {/* About */}
        <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-5">
          <p className="text-poker-gold/60 text-xs uppercase tracking-widest mb-3">About</p>
          <p className="text-poker-yellow/60 text-sm leading-relaxed">
            Pokero is a private poker table for friends — no money, no accounts, just fun. Supports Texas Hold'em, Omaha, Crazy Pineapple and Drawmaha.
          </p>
        </div>

      </div>
    </main>
  );
}
