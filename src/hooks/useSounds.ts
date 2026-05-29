'use client';

import { useCallback, useRef, useState } from 'react';

// ─── Module-level singleton ───────────────────────────────────────────
// Lives outside React — survives component remounts and Strict Mode
// double-invocation. iOS requires AudioContext to be created during a
// synchronous user gesture; we unlock it explicitly via enableAudio().
// ─────────────────────────────────────────────────────────────────────

let _ctx: AudioContext | null = null;
let _unlocked = false;

function getOrCreateCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (_ctx) return _ctx;
  try {
    _ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    return _ctx;
  } catch {
    return null;
  }
}

/**
 * MUST be called directly inside a user-gesture handler (click / touchend).
 * Creates AudioContext if needed, resumes it, and plays a silent 1-frame
 * buffer — the only reliable way to unlock audio on iOS Safari.
 */
export function enableAudio(): void {
  try {
    const ctx = getOrCreateCtx();
    if (!ctx) return;

    // Resume suspended context synchronously
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Play a silent 1-frame buffer — required on iOS to mark context as
    // "user-activated". Must happen in the same call stack as the gesture.
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);

    _unlocked = true;
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────

export function useSounds() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const getCtx = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    const ctx = getOrCreateCtx();
    if (!ctx) return null;
    if (!_unlocked) return null; // not yet unlocked — skip silently
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }, []);

  // Mute toggle — also unlocks audio on iOS on the first tap.
  // This is why the mute button must be the FIRST interaction on mobile.
  const toggleMute = useCallback(() => {
    enableAudio(); // unlock on first tap
    setMuted((prev) => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  // ── Chip ──
  const playChip = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Impact click
    const clickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const cd = clickBuf.getChannelData(0);
    for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / cd.length, 3);
    const click = ctx.createBufferSource();
    click.buffer = clickBuf;
    const cf = ctx.createBiquadFilter(); cf.type = 'bandpass'; cf.frequency.value = 4000; cf.Q.value = 1.2;
    const cg = ctx.createGain(); cg.gain.setValueAtTime(0.6, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    click.connect(cf); cf.connect(cg); cg.connect(ctx.destination);
    click.start(t); click.stop(t + 0.025);

    // Ceramic resonance
    const osc = ctx.createOscillator(); const og = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(900, t); osc.frequency.exponentialRampToValueAtTime(300, t + 0.12);
    og.gain.setValueAtTime(0.12, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(og); og.connect(ctx.destination); osc.start(t); osc.stop(t + 0.12);

    // Rattle
    for (let i = 1; i <= 2; i++) {
      const off = t + i * 0.022;
      const rb = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
      const rd = rb.getChannelData(0);
      for (let j = 0; j < rd.length; j++) rd[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / rd.length, 4);
      const rs = ctx.createBufferSource(); rs.buffer = rb;
      const rf = ctx.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 2500;
      const rg = ctx.createGain(); rg.gain.setValueAtTime(0.15 / i, off); rg.gain.exponentialRampToValueAtTime(0.001, off + 0.012);
      rs.connect(rf); rf.connect(rg); rg.connect(ctx.destination); rs.start(off); rs.stop(off + 0.015);
    }
  }, [getCtx]);

  // ── Deal ──
  const playDeal = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.015); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(t); src.stop(t + 0.12);
  }, [getCtx]);

  // ── Your turn ──
  const playYourTurn = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    [[660, 0, 0.15, 0.25], [880, 0.12, 0.2, 0.3]].forEach(([freq, delay, dur, vol]) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, t + delay); g.gain.linearRampToValueAtTime(vol, t + delay + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
      osc.connect(g); g.connect(ctx.destination); osc.start(t + delay); osc.stop(t + delay + dur);
    });
  }, [getCtx]);

  // ── Win ──
  const playWin = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      const s = t + i * 0.1; osc.type = 'triangle'; osc.frequency.value = freq;
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.22, s + 0.02); g.gain.exponentialRampToValueAtTime(0.001, s + 0.3);
      osc.connect(g); g.connect(ctx.destination); osc.start(s); osc.stop(s + 0.3);
    });
  }, [getCtx]);

  // ── Fold ──
  const playFold = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(120, t + 0.2);
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g); g.connect(ctx.destination); osc.start(t); osc.stop(t + 0.2);
  }, [getCtx]);

  // ── Select ──
  const playSelect = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 1200;
    g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(g); g.connect(ctx.destination); osc.start(t); osc.stop(t + 0.04);
  }, [getCtx]);

  return { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute };
}
