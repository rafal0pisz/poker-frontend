'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function createCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

// Play a silent 1-frame buffer — required to "unlock" audio on iOS Safari.
// Must be called inside a user-gesture handler (touchstart / click).
function playSilentBuffer(ctx: AudioContext) {
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch { /* ignore */ }
}

export function useSounds() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);

  // Unlock AudioContext on first user interaction.
  // This is required on iOS Safari and some Android browsers —
  // AudioContext can only be created/resumed inside a user-gesture handler.
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      if (!ctxRef.current) ctxRef.current = createCtx();
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      playSilentBuffer(ctx);
      unlockedRef.current = true;
    };

    // Listen on both touch and click to cover all mobile browsers
    document.addEventListener('touchstart', unlock, { passive: true, once: true });
    document.addEventListener('click', unlock, { once: true });

    return () => {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
  }, []);

  const getCtx = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    if (!ctxRef.current) ctxRef.current = createCtx();
    const ctx = ctxRef.current;
    if (!ctx) return null;
    // Resume if suspended (e.g. tab backgrounded)
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  // ── Poker chip stack ──
  const playChip = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const clickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / clickData.length, 3);
    }
    const click = ctx.createBufferSource();
    click.buffer = clickBuf;
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = 4000;
    clickFilter.Q.value = 1.2;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.6, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    click.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start(t);
    click.stop(t + 0.025);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.12);
    oscGain.gain.setValueAtTime(0.12, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);

    for (let i = 1; i <= 2; i++) {
      const offset = t + i * 0.022;
      const rattleBuf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
      const d = rattleBuf.getChannelData(0);
      for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / d.length, 4);
      const rattle = ctx.createBufferSource();
      rattle.buffer = rattleBuf;
      const rf = ctx.createBiquadFilter();
      rf.type = 'highpass';
      rf.frequency.value = 2500;
      const rg = ctx.createGain();
      rg.gain.setValueAtTime(0.15 / i, offset);
      rg.gain.exponentialRampToValueAtTime(0.001, offset + 0.012);
      rattle.connect(rf);
      rf.connect(rg);
      rg.connect(ctx.destination);
      rattle.start(offset);
      rattle.stop(offset + 0.015);
    }
  }, [getCtx]);

  // ── Card deal ──
  const playDeal = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.12);
  }, [getCtx]);

  // ── Your turn ──
  const playYourTurn = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [[660, 0, 0.15, 0.25], [880, 0.12, 0.2, 0.3]].forEach(([freq, delay, dur, vol]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(vol, t + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + delay);
      osc.stop(t + delay + dur);
    });
  }, [getCtx]);

  // ── Win ──
  const playWin = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t + i * 0.1;
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }, [getCtx]);

  // ── Fold ──
  const playFold = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.2);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }, [getCtx]);

  // ── Draw select ──
  const playSelect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }, [getCtx]);

  return { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute };
}
