'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Without this, any render-time throw inside the table (a bad card index, a
// briefly-inconsistent server payload, a future bug of the same shape as
// past ones) unmounts the entire React tree and leaves a blank/white
// screen with no recovery — indistinguishable from "the app crashed and
// kicked me". This contains that to the table view and offers a reload,
// which re-fetches fresh room state through the normal reconnect flow
// instead of losing the player's seat.
export class TableErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[TableErrorBoundary] Caught a render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-xs">
            <p className="text-poker-yellow text-lg mb-2">😵 Coś poszło nie tak</p>
            <p className="text-poker-yellow/50 text-sm mb-6">
              Wystąpił nieoczekiwany błąd przy wyświetlaniu stołu. Odśwież stronę, żeby wrócić do gry — Twoje miejsce przy stole zostaje zachowane.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-poker-gold text-poker-bg font-medium px-6 py-3 rounded-lg active:scale-95 transition"
            >
              Odśwież stronę
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
