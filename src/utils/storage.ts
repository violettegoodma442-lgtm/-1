import { DEFAULT_HEXTECH_CARDS } from '../data/defaultHextechs';
import { DuelSession, HextechCard, PoolType } from '../types';

const STORAGE_KEYS = {
  CARDS: 'ygo_hextech_cards_v1',
  CURRENT_DUEL: 'ygo_hextech_current_duel_v1',
  HISTORY: 'ygo_hextech_history_v1',
  SETTINGS: 'ygo_hextech_settings_v1',
};

export interface AppSettings {
  drawMode: 'choose3' | 'instant';
  rerollCountPerPlayer: number;
  enableAudio: boolean;
  autoSetLpForGiant: boolean; // 巨人战争自动设16000
}

export const defaultSettings: AppSettings = {
  drawMode: 'choose3',
  rerollCountPerPlayer: 1,
  enableAudio: true,
  autoSetLpForGiant: true,
};

export function loadCards(): HextechCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!raw) {
      saveCards(DEFAULT_HEXTECH_CARDS);
      return DEFAULT_HEXTECH_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse cards from storage', e);
  }
  return DEFAULT_HEXTECH_CARDS;
}

export function saveCards(cards: HextechCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save cards to storage', e);
  }
}

export function resetCardsToDefault(): HextechCard[] {
  saveCards(DEFAULT_HEXTECH_CARDS);
  return DEFAULT_HEXTECH_CARDS;
}

export function getCardsByPool(cards: HextechCard[], pool: PoolType, onlyEnabled = true): HextechCard[] {
  return cards.filter((c) => c.pool === pool && (!onlyEnabled || c.enabled));
}

export function loadDuelHistory(): DuelSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load duel history', e);
  }
  return [];
}

export function saveDuelToHistory(session: DuelSession): void {
  try {
    const history = loadDuelHistory();
    const updated = [session, ...history].slice(0, 50); // keep last 50 duels
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save duel to history', e);
  }
}

export function clearDuelHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear duel history', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
