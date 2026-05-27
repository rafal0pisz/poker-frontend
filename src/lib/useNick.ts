// Hook for remembering nickname in localStorage
import { useEffect, useState } from 'react';

const NICK_KEY = 'poker:nick';

export function useNick(): [string, (nick: string) => void] {
  const [nick, setNickState] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(NICK_KEY);
    if (stored) setNickState(stored);
  }, []);

  const setNick = (newNick: string) => {
    const clean = newNick.trim().slice(0, 16);
    setNickState(clean);
    localStorage.setItem(NICK_KEY, clean);
  };

  return [nick, setNick];
}
