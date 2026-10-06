export type PoolType = 'global' | 'first' | 'second';

export type Rarity = 'silver' | 'gold' | 'prismatic';

export interface HextechCard {
  id: string;
  name: string;
  pool: PoolType;
  description: string;
  rarity: Rarity;
  tag: string;
  flavorText?: string;
  isCustom?: boolean;
  enabled: boolean;
  createdAt?: number;
}

export type DrawStep = 'config' | 'global' | 'first' | 'second' | 'ready';

export interface DuelSession {
  id: string;
  timestamp: number;
  player1Name: string; // 先手玩家
  player2Name: string; // 后手玩家
  globalCard: HextechCard | null;
  player1Card: HextechCard | null;
  player2Card: HextechCard | null;
  initialLp: number;
  winner?: 'p1' | 'p2' | 'draw';
}

export interface LPLogEntry {
  id: string;
  player: 'p1' | 'p2';
  diff: number;
  oldLp: number;
  newLp: number;
  reason?: string;
  time: string;
}
