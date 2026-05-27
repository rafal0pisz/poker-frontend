// Types shared with backend
export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Card = `${Rank}${Suit}`;

export type PlayerRole = 'player' | 'vice-admin' | 'admin';

// Game variants for Dealer's Choice (Mix Poker)
export type GameVariant = 'texas' | 'omaha' | 'drawmaha';

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
  totalBetInHand: number;
  hasActedThisRound: boolean;
  preferredVariant: GameVariant;
}

export interface RoomSettings {
  smallBlind: number;
  bigBlind: number;
  startingBuyIn: number;
  maxSeats: number;
  actionTimeoutSec: 15 | 30 | 60;
}

export type HandPhase = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface SidePot {
  amount: number;
  eligiblePlayers: string[];
}

export interface HandResult {
  winnings: { sessionToken: string; amount: number; handDescription?: string }[];
  showdownCards: { sessionToken: string; cards: Card[]; handName: string }[];
  winningCards: Card[];
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

export interface Room {
  id: string;
  createdAt: number;
  players: Player[];
  settings: RoomSettings;
  gameState: GameState | null;
  messages: ChatMessage[];
}

// Reactions available as quick-tap buttons
export const QUICK_REACTIONS = ['👍', '😂', '🔥', '😎', '😠'] as const;
export type QuickReaction = typeof QUICK_REACTIONS[number];
