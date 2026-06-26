// Types shared with backend
export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Card = `${Rank}${Suit}`;

export type PlayerRole = 'player' | 'vice-admin' | 'admin';

export type GameVariant = 'texas' | 'omaha' | 'omaha-pl' | 'omaha5' | 'omaha-hl' | 'drawmaha' | 'drawmaha-pl' | 'pineapple' | 'pineapple-classic';

export type PlayerStatus =
  | 'playing'
  | 'folded'
  | 'all-in'
  | 'sitting-out'
  | 'waiting'
  | 'no-chips'
  | 'disconnected'
  | 'spectator';

export type ActionType = 'check' | 'call' | 'bet' | 'raise' | 'fold' | 'all-in';

export interface Action {
  type: ActionType;
  amount?: number;
  playerSessionToken: string;
  timestamp: number;
}

export interface Player {
  sessionToken: string;
  nick: string;
  chips: number;
  seat: number;
  role: PlayerRole;
  status: PlayerStatus;
  connected: boolean;
  lastSeenAt: number;
  holeCards?: Card[];
  currentBet: number;
  chipRequest?: number;
  isBot?: boolean;
  totalBetInHand: number;
  hasActedThisRound: boolean;
  preferredVariant: GameVariant;
  totalBuyIn: number;
  pendingChipsAdjustment: number;
  pendingAction: 'check-fold' | 'fold' | null;
}

export interface RoomSettings {
  smallBlind: number;
  bigBlind: number;
  startingBuyIn: number;
  maxSeats: number;
  actionTimeoutSec: 15 | 30 | 60;
  tableColor?: string;
}

// 'draw' = Drawmaha draw phase (after flop, before turn)
export type HandPhase = 'preflop' | 'flop' | 'draw' | 'pineapple-discard' | 'turn' | 'river' | 'showdown';

export interface SidePot {
  amount: number;
  eligiblePlayers: string[];
}

export interface HandResult {
  winnings: { sessionToken: string; amount: number; netAmount?: number; handDescription?: string }[];
  showdownCards: { sessionToken: string; cards: Card[]; handName: string }[];
  winningCards: Card[];
  boardCards?: Card[];     // community cards at end of hand
  handNumber?: number;    // Hand #N
  totalPot?: number;      // total chips in pot
  variant?: string;       // game variant
  playerStacks?: { sessionToken: string; nick: string; chips: number }[];
  // Present for Drawmaha — split pot details (arrays support tied winners)
  drawmahaResult?: {
    omahaWinner: { sessionToken: string; amount: number; handDescription: string };
    texasWinner: { sessionToken: string; amount: number; handDescription: string };
    omahaWinners?: { sessionToken: string; amount: number; handDescription: string }[];
    texasWinners?: { sessionToken: string; amount: number; handDescription: string }[];
  };
  omahaHlResult?: {
    highWinners: { sessionToken: string; amount: number; handDescription: string }[];
    lowWinners: { sessionToken: string; amount: number; handDescription: string }[] | null;
    noLow: boolean;
  };
  // Per-pot breakdown for side pot scenarios.
  // Only present when there are multiple pots (main + side). Empty/absent for single-pot.
  potBreakdown?: PotWinBreakdown[];
  // Players who busted out in this hand (chips → 0)
  eliminatedTokens?: string[];
}

export interface PotWinBreakdown {
  label: string; // "Main pot", "Side pot 1", "Side pot 2", ...
  amount: number;
  winners: {
    sessionToken: string;
    amount: number;
    netAmount?: number;
    handDescription?: string;
    drawmahaHalf?: 'omaha' | 'draw';
  }[];
}

// ===== DRAWMAHA =====

export interface DrawPlayerState {
  discardIndices: number[];
  revealedCard: Card | null;
  accepted: boolean | null;
  hasDrawn: boolean;
  hasDecided: boolean;
}

export interface DrawState {
  playerStates: Record<string, DrawPlayerState>;
  openCards: Record<string, Card>;
  decideDeadline: number | null;
  currentDecidingSeat: number | null;
  // Timer for the draw submission phase (shown in DrawmahaDraw)
  drawSubmitDeadline: number | null;
}

// ========================

export interface PineappleDiscardState {
  playerStates: Record<string, { hasDiscarded: boolean; discardIndex: number | null }>;
  discardDeadline: number | null;
}

export interface GameState {
  phase: HandPhase;
  variant: GameVariant;
  communityCards: Card[];
  pot: number;
  sidePots: SidePot[];
  currentBet: number;
  minRaise: number;
  dealerSeat: number;
  currentPlayerSeat: number | null;
  actionDeadline: number | null;
  lastAction: Action | null;
  handNumber: number;
  lastHandResult: HandResult | null;
  drawState?: DrawState;
  pineappleDiscardState?: PineappleDiscardState;
}

// Chat
export type ChatMessageType = 'text' | 'reaction' | 'system';

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  senderSessionToken: string | null;
  senderNick: string;
  content: string;
  timestamp: number;
}

export interface PlayerStats {
  sessionToken: string;
  nick: string;
  handsPlayed: number;
  handsWon: number;
  vpip: number;
  vpipHands: number;
  biggestPot: number;
  biggestPotHand: string;
  totalWon: number;
  bestHand: string;
  allInCount: number;
  foldCount: number;
  showdownCount: number;
  showdownWins: number;
  biggestLoss: number;
}

export interface SessionResult {
  sessionToken: string;
  nick: string;
  totalBuyIn: number;
  finalChips: number;
  netResult: number;
  leftAt: number;
}

export interface Room {
  id: string;
  createdAt: number;
  players: Player[];
  settings: RoomSettings;
  gameState: GameState | null;
  messages: ChatMessage[];
  sessionSummary: SessionResult[];
  playerStats: Record<string, PlayerStats>;
  paused: boolean;
}

// Reactions available as quick-tap buttons
export const QUICK_REACTIONS = ['🤣', '💀', '🤑', '🫣', '🤡', '🤯'] as const;
export type QuickReaction = typeof QUICK_REACTIONS[number];
