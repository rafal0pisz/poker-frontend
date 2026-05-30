'use client';

import { useState } from 'react';

interface Props {
  onBack: () => void;
}

const PokeroLogo = ({ size = 32 }: { size?: number }) => {
  const scale = size / 46;
  const w = Math.round(190 * scale);
  const h = Math.round(46 * scale);
  return (
    <svg width={w} height={h} viewBox="0 0 190 46" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="38" fontFamily="Rajdhani,'Arial Narrow',sans-serif" fontWeight="700" fontSize={Math.round(36 * scale)} fill="#d4af37" letterSpacing="5">POKER</text>
      <g transform={`translate(${Math.round(161 * scale)}, ${Math.round(4 * scale)})`}>
        <circle cx={Math.round(15 * scale)} cy={Math.round(19 * scale)} r={Math.round(15 * scale)} fill="none" stroke="#d4af37" strokeWidth={Math.round(2.5 * scale)}/>
        <circle cx={Math.round(15 * scale)} cy={Math.round(19 * scale)} r={Math.round(10 * scale)} fill="#6b1414"/>
        <circle cx={Math.round(15 * scale)} cy={Math.round(19 * scale)} r={Math.round(12.5 * scale)} fill="none" stroke="#f5d76e" strokeWidth={Math.round(0.8 * scale)} strokeDasharray={`${Math.round(2.3 * scale)} ${Math.round(2 * scale)}`} opacity="0.7"/>
        <circle cx={Math.round(15 * scale)} cy={Math.round(19 * scale)} r={Math.round(6.5 * scale)} fill="none" stroke="#d4af37" strokeWidth={Math.round(0.9 * scale)}/>
        <text x={Math.round(15 * scale)} y={Math.round(23 * scale)} textAnchor="middle" fontSize={Math.round(9 * scale)} fill="#f5d76e" fontFamily="serif">♥</text>
      </g>
    </svg>
  );
};

export function ContactScreen({ onBack }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('pokerosuppport@gmail.com').then(() => {
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
          <PokeroLogo size={32} />
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="font-serif italic text-2xl text-poker-gold text-center">Contact</h1>

        {/* Email */}
        <div className="bg-poker-yellow/5 border border-poker-gold/20 rounded-xl p-5 space-y-3">
          <p className="text-poker-gold/60 text-xs uppercase tracking-widest">Support email</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-poker-yellow font-medium text-sm">pokerosuppport@gmail.com</p>
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
