'use client';

import { useEffect, useRef, useState } from 'react';
import type { LogEntry } from '@/hooks/useHandLog';

interface Props {
  logs: LogEntry[];
}

export function HandLog({ logs }: Props) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top (newest entries are rendered first)
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs.length, open]);

  const getColor = (type: LogEntry['type'], highlight: boolean) => {
    if (highlight) return 'text-poker-gold';
    switch (type) {
      case 'hand-start': return 'text-poker-gold font-bold';
      case 'phase':      return 'text-poker-yellow font-medium';
      case 'action':     return 'text-poker-yellow/80';
      case 'draw':       return 'text-blue-300/80';
      case 'result':     return 'text-green-400';
      case 'system':     return 'text-poker-yellow/40 italic';
      default:           return 'text-poker-yellow/60';
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-poker-yellow/5 border border-poker-gold/20 px-3 py-2 rounded-lg text-xs text-poker-yellow/70 active:scale-95"
      >
        <span className="flex items-center gap-2">
          <span>📋</span>
          <span>Hand Log</span>
          {logs.length > 0 && (
            <span className="bg-poker-gold/20 text-poker-gold px-1.5 rounded text-[10px]">
              {logs.length}
            </span>
          )}
        </span>
        <span className="text-poker-gold/50">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-1 bg-black/60 border border-poker-gold/15 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-poker-gold/10">
            <span className="text-[10px] text-poker-gold/50 uppercase tracking-wider font-mono">
              Hand history
            </span>
            <span className="text-[10px] text-poker-yellow/30 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Log entries */}
          <div
            ref={scrollRef}
            className="overflow-y-auto p-2 space-y-0.5 font-mono"
            style={{ maxHeight: '220px', fontSize: '11px' }}
          >
            {logs.length === 0 ? (
              <p className="text-poker-yellow/30 text-center py-4">No actions yet</p>
            ) : (
              [...logs].reverse().map((log) => (
                <div key={log.id} className={`leading-snug ${getColor(log.type, log.highlight ?? false)}`}>
                  {log.text}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-poker-gold/10 flex items-center justify-between">
            <span className="text-[9px] text-poker-yellow/25 font-mono">
              All amounts in chips · For verification purposes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
