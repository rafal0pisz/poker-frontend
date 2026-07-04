'use client';

// Desktop-only flourish: animates a small chip stack flying from a player's
// seat to the pot on every bet/call/raise, and from the pot to each winner's
// seat when a hand resolves. Purely visual — reads player.currentBet and
// activeResult, never mutates game state. Percent-based top/left so it lines
// up with OvalTable's SEAT_POSITIONS coordinate system.

import { useEffect, useRef, useState } from 'react';
import type { HandResult, Room } from '@/lib/types';

interface Pos { top: string; left: string }

interface Flight {
  id: string;
  from: Pos;
  to: Pos;
}

interface Props {
  players: Room['players'];
  positionByToken: Record<string, Pos>;
  potPos: Pos;
  activeResult: HandResult | null;
}

let flightCounter = 0;

function ChipFlight({ flight, onDone }: { flight: Flight; onDone: (id: string) => void }) {
  const [stage, setStage] = useState<'start' | 'flying' | 'arrive'>('start');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setStage('flying'));
    const t1 = setTimeout(() => setStage('arrive'), 480);
    const t2 = setTimeout(() => onDone(flight.id), 480 + 160);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = stage === 'start' ? flight.from : flight.to;
  const scale = stage === 'start' ? 1 : stage === 'flying' ? 0.85 : 0.55;

  return (
    <div
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: stage === 'arrive' ? 0 : 1,
        transition: stage === 'start'
          ? 'none'
          : stage === 'flying'
          ? 'top 480ms cubic-bezier(0.22,1,0.36,1), left 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms ease-out'
          : 'opacity 160ms ease-in, transform 160ms ease-in',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', width: 24, height: 18 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * 5,
              bottom: i * 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #f5d78e, rgb(var(--pk-gold-rgb)) 55%, #8a6d1f 100%)',
              border: '1.5px solid rgba(255,255,255,0.55)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChipFlightLayer({ players, positionByToken, potPos, activeResult }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const prevBetsRef = useRef<Record<string, number>>({});
  const isFirstBetsRun = useRef(true);
  const prevHandNumberRef = useRef<number | undefined>(undefined);

  // Bets → pot
  useEffect(() => {
    const prev = prevBetsRef.current;
    const next: Record<string, number> = {};
    const newFlights: Flight[] = [];
    for (const p of players) {
      next[p.sessionToken] = p.currentBet;
      if (!isFirstBetsRun.current && p.currentBet > (prev[p.sessionToken] ?? 0)) {
        const from = positionByToken[p.sessionToken];
        if (from) newFlights.push({ id: `bet-${p.sessionToken}-${++flightCounter}`, from, to: potPos });
      }
    }
    prevBetsRef.current = next;
    isFirstBetsRun.current = false;
    if (newFlights.length > 0) setFlights((f) => [...f, ...newFlights]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  // Pot → winners (once per resolved hand)
  useEffect(() => {
    if (!activeResult?.handNumber) return;
    if (prevHandNumberRef.current === activeResult.handNumber) return;
    const isFirstResult = prevHandNumberRef.current === undefined;
    prevHandNumberRef.current = activeResult.handNumber;
    if (isFirstResult) return; // don't animate a result that was already on screen on mount/reconnect

    const newFlights: Flight[] = [];
    for (const w of activeResult.winnings) {
      if (w.amount <= 0) continue;
      const to = positionByToken[w.sessionToken];
      if (to) newFlights.push({ id: `win-${w.sessionToken}-${++flightCounter}`, from: potPos, to });
    }
    if (newFlights.length > 0) setFlights((f) => [...f, ...newFlights]);
  }, [activeResult, positionByToken, potPos]);

  const removeFlight = (id: string) => setFlights((f) => f.filter((fl) => fl.id !== id));

  if (flights.length === 0) return null;
  return (
    <>
      {flights.map((f) => <ChipFlight key={f.id} flight={f} onDone={removeFlight} />)}
    </>
  );
}
