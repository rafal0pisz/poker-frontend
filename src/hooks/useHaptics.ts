// Haptic feedback (vibration) for key game moments — mobile only in practice,
// since the Vibration API has no effect on desktop browsers / iOS Safari.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HAPTICS_KEY = 'poker:haptics-enabled';

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

export function useHaptics() {
  const [enabled, setEnabled] = useState(true);
  // Mirrors `enabled` in a ref so `vibrate` below can stay referentially stable
  // (empty deps) while still reading the latest toggle state — callers that
  // capture `vibrate` in a long-lived effect closure (e.g. a socket handler
  // set up once on mount) always see the current on/off setting.
  const enabledRef = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem(HAPTICS_KEY);
    if (stored !== null) {
      const value = stored === '1';
      enabledRef.current = value;
      setEnabled(value);
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      localStorage.setItem(HAPTICS_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!enabledRef.current || !isSupported()) return;
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }, []);

  const yourTurn = useCallback(() => vibrate(15), [vibrate]);
  const win = useCallback(() => vibrate([15, 60, 15, 60, 30]), [vibrate]);
  const timeoutWarning = useCallback(() => vibrate([10, 40, 10]), [vibrate]);

  return { enabled, supported: isSupported(), toggle, vibrate, yourTurn, win, timeoutWarning };
}
