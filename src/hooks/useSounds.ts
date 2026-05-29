'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Sound implementation using Howler.js CDN
// Howler handles iOS/Android audio unlock automatically.
// Sounds are short beeps synthesized via data URIs — no external files needed.

// Minimal WAV files as base64 data URIs
// Each sound is a short synthesized tone

declare global {
  interface Window {
    Howl: new (config: object) => {
      play: () => number;
      stop: (id?: number) => void;
      volume: (vol: number) => void;
    };
    Howler: {
      volume: (vol: number) => void;
      mute: (muted: boolean) => void;
    };
  }
}

// Short sounds as base64-encoded OGG/WAV
// These are generated minimal beeps that work on all platforms
const SOUNDS: Record<string, string> = {
  // Short chip click — 80ms, 800Hz triangle wave
  chip: 'data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAEAAAAAAAAAP//////////AQECAQMC' +
    'AwQEBQUGBgcHCAgJCQoKCwsMDA0NDg4PDxAQERESEhMTFBQVFRYWFxcYGBkZGhoaGxscHBwdHR0e' +
    'Hh4fHx8gICAgISEhIiIiIyMjJCQkJCUlJSYmJiYnJycnKCgoKCkpKSkqKioqKysrKywsLCwtLS0t' +
    'Li4uLi8vLy8wMDAwMTExMTIyMjIzMzMzNDQ0NDU1NTU2NjY2Nzc3Nzg4ODg5OTk5Ojo6Ojs7Ozs8' +
    'PDw8PT09PT4+Pj4/Pz8/QEBAQEFBQUFCQ==',
  // Card deal — 120ms swoosh
  deal: 'data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAEAAD/AP8A/wD/AP8A/wD/AP8A',
};

let howlerLoaded = false;
let howlerLoading = false;
const howlerCallbacks: (() => void)[] = [];

function loadHowler(cb: () => void) {
  if (howlerLoaded) { cb(); return; }
  howlerCallbacks.push(cb);
  if (howlerLoading) return;
  howlerLoading = true;
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js';
  script.onload = () => {
    howlerLoaded = true;
    howlerCallbacks.forEach(fn => fn());
    howlerCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

// Web Audio API fallback for synthesized sounds
// This is more reliable than base64 WAV files for quick beeps
function getOrCreateCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  } catch { return null; }
}

let _ctx: AudioContext | null = null;
let _unlocked = false;

export function enableAudio(): void {
  try {
    if (!_ctx) _ctx = getOrCreateCtx();
    if (!_ctx) return;
    if (_ctx.state === 'suspended') _ctx.resume();
    // Silent buffer to unlock iOS
    const buf = _ctx.createBuffer(1, 1, 22050);
    const src = _ctx.createBufferSource();
    src.buffer = buf;
    src.connect(_ctx.destination);
    src.start(0);
    _unlocked = true;
  } catch { /* ignore */ }
}

function getCtx(): AudioContext | null {
  if (!_unlocked) return null;
  if (!_ctx) _ctx = getOrCreateCtx();
  if (!_ctx) return null;
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

// Synthesize sounds via Web Audio API
function synth(type: OscillatorType, freq: number, duration: number, vol: number, freqEnd?: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

function noiseClick(vol = 0.5) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 3500; f.Q.value = 1.5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.connect(f); f.connect(g); g.connect(ctx.destination);
  src.start(t); src.stop(t + 0.04);
}

export function useSounds() {
  // Default muted=true so iOS doesn't try to play before unlock
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  const toggleMute = useCallback(() => {
    enableAudio(); // MUST be called synchronously in button click
    setMuted(prev => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  const ifNotMuted = (fn: () => void) => {
    if (!mutedRef.current) fn();
  };

  // Chip: 3-layer click (impact + ring + rattle)
  const playChip = useCallback(() => ifNotMuted(() => {
    noiseClick(0.55);
    synth('sine', 900, 0.1, 0.1, 350);
    setTimeout(() => noiseClick(0.12), 22);
    setTimeout(() => noiseClick(0.06), 44);
  }), []);

  // Deal: paper swoosh
  const playDeal = useCallback(() => ifNotMuted(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.28, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(t); src.stop(t + 0.1);
  }), []);

  // Your turn: two rising tones
  const playYourTurn = useCallback(() => ifNotMuted(() => {
    synth('sine', 660, 0.15, 0.22);
    setTimeout(() => synth('sine', 880, 0.18, 0.27), 120);
  }), []);

  // Win: ascending arpeggio
  const playWin = useCallback(() => ifNotMuted(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => synth('triangle', f, 0.28, 0.2), i * 100)
    );
  }), []);

  // Fold: descending thud
  const playFold = useCallback(() => ifNotMuted(() => {
    synth('triangle', 300, 0.2, 0.16, 120);
  }), []);

  // Select card: light tick
  const playSelect = useCallback(() => ifNotMuted(() => {
    synth('square', 1200, 0.035, 0.07);
  }), []);

  return { playChip, playDeal, playYourTurn, playWin, playFold, playSelect, muted, toggleMute };
}
