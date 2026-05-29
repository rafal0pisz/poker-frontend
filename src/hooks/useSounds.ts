'use client';

import { useCallback, useRef, useState } from 'react';

// Module-level singleton — survives React re-renders
let _ctx: AudioContext | null = null;
let _unlocked = false;

function getOrCreateCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (_ctx) return _ctx;
  try {
    _ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    return _ctx;
  } catch { return null; }
}

// Called synchronously inside a button onClick — the ONLY reliable way to
// unlock Web Audio on iOS Safari. Sounds are muted by default; user must
// tap the 🔊 button first, which unlocks audio at the same time.
export function enableAudio(): void {
  try {
    const ctx = getOrCreateCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    // Silent 1-frame buffer — iOS Safari requires this to mark ctx as user-activated
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    _unlocked = true;
  } catch { /* ignore */ }
}

export function useSounds() {
  // Default: muted=true — sounds are OFF until user taps 🔊
  // This means the first tap on the button both unlocks AudioContext AND enables sounds
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  const getCtx = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    if (!_unlocked) return null;
    const ctx = getOrCreateCtx();
    if (!ctx) return null;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }, []);

  const toggleMute = useCallback(() => {
    // enableAudio() MUST be called here synchronously — iOS requires it
    enableAudio();
    setMuted((prev) => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  const playChip = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    // Impact click
    const cb = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const cd = cb.getChannelData(0);
    for (let i = 0; i < cd.length; i++) cd[i] = (Math.random()*2-1) * Math.pow(1-i/cd.length, 3);
    const cs = ctx.createBufferSource(); cs.buffer = cb;
    const cf = ctx.createBiquadFilter(); cf.type='bandpass'; cf.frequency.value=4000; cf.Q.value=1.2;
    const cg = ctx.createGain(); cg.gain.setValueAtTime(0.6,t); cg.gain.exponentialRampToValueAtTime(0.001,t+0.025);
    cs.connect(cf); cf.connect(cg); cg.connect(ctx.destination); cs.start(t); cs.stop(t+0.025);
    // Ceramic ring
    const o = ctx.createOscillator(); const og = ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(900,t); o.frequency.exponentialRampToValueAtTime(300,t+0.12);
    og.gain.setValueAtTime(0.12,t); og.gain.exponentialRampToValueAtTime(0.001,t+0.12);
    o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t+0.12);
    // Rattle
    for (let i=1;i<=2;i++) {
      const off=t+i*0.022;
      const rb=ctx.createBuffer(1,ctx.sampleRate*0.012,ctx.sampleRate);
      const rd=rb.getChannelData(0);
      for (let j=0;j<rd.length;j++) rd[j]=(Math.random()*2-1)*Math.pow(1-j/rd.length,4);
      const rs=ctx.createBufferSource(); rs.buffer=rb;
      const rf=ctx.createBiquadFilter(); rf.type='highpass'; rf.frequency.value=2500;
      const rg=ctx.createGain(); rg.gain.setValueAtTime(0.15/i,off); rg.gain.exponentialRampToValueAtTime(0.001,off+0.012);
      rs.connect(rf); rf.connect(rg); rg.connect(ctx.destination); rs.start(off); rs.stop(off+0.015);
    }
  }, [getCtx]);

  const playDeal = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const buf=ctx.createBuffer(1,ctx.sampleRate*0.12,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for (let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const f=ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=1800;
    const g=ctx.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.3,t+0.015); g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(t); src.stop(t+0.12);
  }, [getCtx]);

  const playYourTurn = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    ([[660,0,0.15,0.25],[880,0.12,0.2,0.3]] as number[][]).forEach(([freq,delay,dur,vol]) => {
      const o=ctx.createOscillator(); const g=ctx.createGain();
      o.type='sine'; o.frequency.value=freq;
      g.gain.setValueAtTime(0,t+delay); g.gain.linearRampToValueAtTime(vol,t+delay+0.01); g.gain.exponentialRampToValueAtTime(0.001,t+delay+dur);
      o.connect(g); g.connect(ctx.destination); o.start(t+delay); o.stop(t+delay+dur);
    });
  }, [getCtx]);

  const playWin = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    [523,659,784,1047].forEach((freq,i) => {
      const o=ctx.createOscillator(); const g=ctx.createGain();
      const s=t+i*0.1; o.type='triangle'; o.frequency.value=freq;
      g.gain.setValueAtTime(0,s); g.gain.linearRampToValueAtTime(0.22,s+0.02); g.gain.exponentialRampToValueAtTime(0.001,s+0.3);
      o.connect(g); g.connect(ctx.destination); o.start(s); o.stop(s+0.3);
    });
  }, [getCtx]);

  const playFold = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='triangle'; o.frequency.setValueAtTime(300,t); o.frequency.exponentialRampToValueAtTime(120,t+0.2);
    g.gain.setValueAtTime(0.18,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.2);
  }, [getCtx]);

  const playSelect = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='square'; o.frequency.value=1200;
    g.gain.setValueAtTime(0.08,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.04);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.04);
  }, [getCtx]);

  return { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute };
}
