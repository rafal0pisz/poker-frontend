'use client';

import { useCallback, useRef, useState } from 'react';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

export function useSounds() {
  const [muted, setMuted] = useState(false);

  // useRef so sound callbacks always read the latest value
  // without needing to be recreated on every mute toggle
  const mutedRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (mutedRef.current) return null;
    if (!ctxRef.current) ctxRef.current = getAudioContext();
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []); // no deps — reads from ref, always fresh

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  // ── Poker chip stack ──
  // Layered: initial impact + secondary resonance + brief rattle
  // Modelled on the sound of a stack of clay casino chips hitting felt
  const playChip = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Layer 1: sharp impact click
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

    // Layer 2: ceramic body resonance (the "ring" of a chip)
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

    // Layer 3: subtle rattle of chips settling (2 quick secondary ticks)
    for (let i = 1; i <= 2; i++) {
      const rattleOffset = t + i * 0.022;
      const rattleBuf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
      const rattleData = rattleBuf.getChannelData(0);
      for (let j = 0; j < rattleData.length; j++) {
        rattleData[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / rattleData.length, 4);
      }
      const rattle = ctx.createBufferSource();
      rattle.buffer = rattleBuf;
      const rattleFilter = ctx.createBiquadFilter();
      rattleFilter.type = 'highpass';
      rattleFilter.frequency.value = 2500;
      const rattleGain = ctx.createGain();
      rattleGain.gain.setValueAtTime(0.15 / i, rattleOffset);
      rattleGain.gain.exponentialRampToValueAtTime(0.001, rattleOffset + 0.012);
      rattle.connect(rattleFilter);
      rattleFilter.connect(rattleGain);
      rattleGain.connect(ctx.destination);
      rattle.start(rattleOffset);
      rattle.stop(rattleOffset + 0.015);
    }
  }, [getCtx]);

  // ── Card deal ── papery whoosh
  const playDeal = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }
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

  // ── Your turn ── two rising tones
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

  // ── Win ── ascending arpeggio
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

  // ── Fold ── descending thud
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

  // ── Draw select ── light tick
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
