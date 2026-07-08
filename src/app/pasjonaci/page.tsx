'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLeague, saveLeagueAdminToken } from '@/lib/leagueApi';

export default function PasjonaciHomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [code, setCode] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    const res = await createLeague(name.trim());
    setCreating(false);
    if (!res.ok) {
      setCreateError(res.error);
      return;
    }
    saveLeagueAdminToken(res.id, res.adminToken);
    router.push(`/pasjonaci/${res.id}`);
  };

  const handleOpen = () => {
    const clean = code.toUpperCase().trim();
    if (!clean) return;
    router.push(`/pasjonaci/${clean}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 mt-8">
          <p className="text-poker-gold text-3xl mb-1">🏆</p>
          <h1 className="font-serif italic text-2xl text-poker-gold mb-2">Pasjonaci</h1>
          <p className="text-poker-yellow/50 text-xs leading-relaxed">
            Trwały ranking i rozliczenie wirtualnych żetonów dla stałej grupy graczy —
            niezależny od zwykłych, jednorazowych stołów.
          </p>
        </div>

        {/* Create new table */}
        <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-4 mb-4">
          <p className="text-poker-yellow text-sm font-medium mb-3">Stwórz nowy stół</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="np. Piątki u Rafała"
            className="w-full bg-poker-yellow/10 border border-poker-gold/20 text-poker-yellow px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15 mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          {createError && (
            <p className="text-poker-coral text-xs mb-2">{createError}</p>
          )}
          <button
            onClick={handleCreate}
            disabled={creating || !name.trim()}
            className="w-full bg-poker-gold text-poker-bg font-medium py-3 rounded-lg active:scale-95 transition disabled:opacity-40"
          >
            {creating ? 'Tworzenie...' : '+ Stwórz stół'}
          </button>
        </div>

        {/* Open existing table */}
        <div className="bg-poker-yellow/5 border border-poker-gold/25 rounded-xl p-4">
          <p className="text-poker-yellow text-sm font-medium mb-3">Mam już kod stołu</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="np. 7K4M2X"
              className="flex-1 bg-poker-yellow/10 border border-poker-gold/20 px-4 py-3 rounded-lg outline-none focus:bg-poker-yellow/15 text-center text-lg font-mono tracking-widest text-poker-gold"
              onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
            />
            <button
              onClick={handleOpen}
              disabled={!code.trim()}
              className="bg-poker-yellow/10 border border-poker-gold/40 text-poker-gold font-medium px-4 rounded-lg active:scale-95 transition disabled:opacity-40"
            >
              Otwórz
            </button>
          </div>
        </div>

        <p className="text-poker-yellow/30 text-xs text-center mt-8">
          Wystarczy, że gracze wpisują ten sam nick w grze co w stole Pasjonaci —
          reszta liczy się sama.
        </p>

        <div className="mt-6 text-center">
          <a href="/" className="text-poker-yellow/40 text-xs hover:text-poker-yellow/70 transition">
            ← Wróć do gry
          </a>
        </div>
      </div>
    </main>
  );
}
