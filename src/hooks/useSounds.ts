'use client';

import { useCallback, useRef, useState } from 'react';

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

export function enableAudio(): void {
  try {
    const ctx = getOrCreateCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    _unlocked = true;
  } catch { }
}

export function useSounds() {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  const getCtx = useCallback((): AudioContext | null => {
    if (mutedRef.current || !_unlocked) return null;
    const ctx = getOrCreateCtx();
    if (!ctx) return null;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }, []);

  const toggleMute = useCallback(() => {
    enableAudio();
    setMuted(prev => { mutedRef.current = !prev; return !prev; });
  }, []);

  // ── Chip: Riffle żetonów — szybkie przerzucanie 8 żetonów między palcami ──
  const playChip = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
        const d = buf.getChannelData(0);
        const freq = 4000 + Math.random() * 2000;
        for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 1.5);
        const s = ctx.createBufferSource(); s.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 2;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.25, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
        s.connect(f); f.connect(g); g.connect(ctx.destination);
        s.start(); s.stop(ctx.currentTime + 0.015);
      }, i * 30);
    }
  }, [getCtx]);

  // ── Deal: Odkrycie karty — szybki flip + szelest papieru ──
  const playDeal = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    // High-freq flip
    const o = ctx.createOscillator(); const og = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(1200, t); o.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    og.gain.setValueAtTime(0.15, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + 0.035);
    // Paper rustle
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 1.5;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t); s.stop(t + 0.045);
  }, [getCtx]);

  // ── Your turn: Twoja kolej — dwa rosnące tony ──
  const playYourTurn = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    [[660, 0, 0.15, 0.22], [880, 0.12, 0.18, 0.27]].forEach(([freq, delay, dur, vol]) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t + delay); g.gain.linearRampToValueAtTime(vol, t + delay + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t + delay); o.stop(t + delay + dur);
    });
  }, [getCtx]);

  // ── Win: Wygrana (żetony) — stos żetonów zepchnięty do zwycięzcy ──
  const playWin = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    // Rising tone
    const o = ctx.createOscillator(); const og = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 523;
    og.gain.setValueAtTime(0.12, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + 0.5);
    // 8 chip sounds in rapid succession — like a big pot being pushed
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
        const d = buf.getChannelData(0);
        const freq = 3000 + Math.random() * 2000;
        for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 2);
        const s = ctx.createBufferSource(); s.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.5;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.35 + Math.random() * 0.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
        s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(); s.stop(ctx.currentTime + 0.025);
      }, i * 50);
    }
  }, [getCtx]);

  // ── Fold: Przegrana — opadający ton ──
  const playFold = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(100, t + 0.5);
    g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.55);
  }, [getCtx]);

  // ── Select: lekki tick ──
  const playSelect = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = 1200;
    g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.035);
  }, [getCtx]);

  return { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute };
}
