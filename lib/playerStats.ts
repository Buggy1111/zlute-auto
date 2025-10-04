/**
 * Player Statistics - Firebase + localStorage hybrid
 * Tracks personal game history and stats across sessions and devices
 */

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export interface GameHistoryEntry {
  gameId: string;
  date: number;
  playerName: string;
  finalScore: number;
  placement: number;
  totalPlayers: number;
  pointTimestamps: number[];
}

export interface PlayerStats {
  playerId: string; // Unique ID per device/player
  playerName: string;
  totalGames: number;
  totalPoints: number;
  games: GameHistoryEntry[];
  lastUpdated: number;
}

const STORAGE_KEY = 'yellowcar_player_stats';
const PLAYER_ID_KEY = 'yellowcar_player_id';

/**
 * Get or create unique player ID for this device
 */
function getPlayerId(): string {
  if (typeof window === 'undefined') return '';

  let playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
}

/**
 * Get player stats from localStorage (fallback/cache)
 */
export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return {
      playerId: '',
      playerName: '',
      totalGames: 0,
      totalPoints: 0,
      games: [],
      lastUpdated: 0,
    };
  }

  const playerId = getPlayerId();

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        playerId,
        playerName: '',
        totalGames: 0,
        totalPoints: 0,
        games: [],
        lastUpdated: 0,
      };
    }
    const stats = JSON.parse(data);
    // Ensure playerId is set
    stats.playerId = playerId;
    return stats;
  } catch {
    return {
      playerId,
      playerName: '',
      totalGames: 0,
      totalPoints: 0,
      games: [],
      lastUpdated: 0,
    };
  }
}

/**
 * Save player stats to localStorage (cache)
 */
function savePlayerStatsLocal(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Silent fail if localStorage is full or disabled
  }
}

/**
 * Save player stats to Firebase
 */
async function savePlayerStatsFirebase(stats: PlayerStats): Promise<void> {
  if (!stats.playerId) return;

  try {
    const statsRef = doc(db, 'playerStats', stats.playerId);
    await setDoc(statsRef, {
      ...stats,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error('Error saving stats to Firebase:', error);
  }
}

/**
 * Save player stats to both localStorage and Firebase
 */
async function savePlayerStats(stats: PlayerStats): Promise<void> {
  stats.lastUpdated = Date.now();
  savePlayerStatsLocal(stats);
  await savePlayerStatsFirebase(stats);
}

/**
 * Load player stats from Firebase (with localStorage fallback)
 */
export async function loadPlayerStats(): Promise<PlayerStats> {
  const playerId = getPlayerId();
  if (!playerId) return getPlayerStats();

  try {
    const statsRef = doc(db, 'playerStats', playerId);
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      const firebaseStats = statsSnap.data() as PlayerStats;
      // Update localStorage cache
      savePlayerStatsLocal(firebaseStats);
      return firebaseStats;
    }
  } catch (error) {
    console.error('Error loading stats from Firebase:', error);
  }

  // Fallback to localStorage
  return getPlayerStats();
}

/**
 * Subscribe to real-time player stats updates from Firebase
 */
export function subscribeToPlayerStats(
  callback: (stats: PlayerStats) => void
): () => void {
  const playerId = getPlayerId();
  if (!playerId) {
    callback(getPlayerStats());
    return () => {};
  }

  const statsRef = doc(db, 'playerStats', playerId);

  return onSnapshot(
    statsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const stats = snapshot.data() as PlayerStats;
        // Update localStorage cache
        savePlayerStatsLocal(stats);
        callback(stats);
      } else {
        callback(getPlayerStats());
      }
    },
    (error) => {
      console.error('Error subscribing to stats:', error);
      callback(getPlayerStats());
    }
  );
}

/**
 * Record a point for the current game
 */
export async function recordPoint(gameId: string, playerName: string): Promise<void> {
  const stats = getPlayerStats();

  // Find or create game entry
  let gameEntry = stats.games.find(g => g.gameId === gameId);

  if (!gameEntry) {
    gameEntry = {
      gameId,
      date: Date.now(),
      playerName,
      finalScore: 0,
      placement: 0,
      totalPlayers: 0,
      pointTimestamps: [],
    };
    stats.games.push(gameEntry);
  }

  // Add point timestamp
  gameEntry.pointTimestamps.push(Date.now());
  gameEntry.finalScore = gameEntry.pointTimestamps.length;
  gameEntry.playerName = playerName; // Update name in case it changed

  // Update totals
  stats.playerName = playerName;
  stats.totalPoints = stats.games.reduce((sum, g) => sum + g.finalScore, 0);
  stats.totalGames = stats.games.length;

  // Keep only last 50 games to prevent overflow
  if (stats.games.length > 50) {
    stats.games = stats.games.slice(-50);
  }

  await savePlayerStats(stats);
}

/**
 * Finalize game with placement info
 */
export async function finalizeGame(
  gameId: string,
  placement: number,
  totalPlayers: number
): Promise<void> {
  const stats = getPlayerStats();
  const gameEntry = stats.games.find(g => g.gameId === gameId);

  if (gameEntry) {
    gameEntry.placement = placement;
    gameEntry.totalPlayers = totalPlayers;
    await savePlayerStats(stats);
  }
}

/**
 * Clear all player stats (both localStorage and Firebase)
 */
export async function clearPlayerStats(): Promise<void> {
  if (typeof window === 'undefined') return;

  const playerId = getPlayerId();

  // Clear localStorage
  localStorage.removeItem(STORAGE_KEY);

  // Clear Firebase
  if (playerId) {
    try {
      const statsRef = doc(db, 'playerStats', playerId);
      const emptyStats: PlayerStats = {
        playerId,
        playerName: '',
        totalGames: 0,
        totalPoints: 0,
        games: [],
        lastUpdated: Date.now(),
      };
      await setDoc(statsRef, emptyStats);
    } catch (error) {
      console.error('Error clearing Firebase stats:', error);
    }
  }
}

/**
 * Get calculated statistics
 */
export function getCalculatedStats() {
  const stats = getPlayerStats();

  const wins = stats.games.filter(g => g.placement === 1).length;
  const bestScore = Math.max(0, ...stats.games.map(g => g.finalScore));
  const avgScore = stats.totalGames > 0
    ? Math.round((stats.totalPoints / stats.totalGames) * 10) / 10
    : 0;
  const winRate = stats.totalGames > 0
    ? Math.round((wins / stats.totalGames) * 100)
    : 0;

  return {
    ...stats,
    wins,
    bestScore,
    avgScore,
    winRate,
  };
}
