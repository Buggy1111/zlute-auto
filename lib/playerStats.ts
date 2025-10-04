/**
 * Player Statistics - localStorage utility
 * Tracks personal game history and stats across sessions
 */

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
  playerName: string;
  totalGames: number;
  totalPoints: number;
  games: GameHistoryEntry[];
}

const STORAGE_KEY = 'yellowcar_player_stats';

/**
 * Get player stats from localStorage
 */
export function getPlayerStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return { playerName: '', totalGames: 0, totalPoints: 0, games: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { playerName: '', totalGames: 0, totalPoints: 0, games: [] };
    }
    return JSON.parse(data);
  } catch {
    return { playerName: '', totalGames: 0, totalPoints: 0, games: [] };
  }
}

/**
 * Save player stats to localStorage
 */
function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    // Silent fail if localStorage is full or disabled
  }
}

/**
 * Record a point for the current game
 */
export function recordPoint(gameId: string, playerName: string): void {
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

  // Keep only last 50 games to prevent localStorage overflow
  if (stats.games.length > 50) {
    stats.games = stats.games.slice(-50);
  }

  savePlayerStats(stats);
}

/**
 * Finalize game with placement info
 */
export function finalizeGame(
  gameId: string,
  placement: number,
  totalPlayers: number
): void {
  const stats = getPlayerStats();
  const gameEntry = stats.games.find(g => g.gameId === gameId);

  if (gameEntry) {
    gameEntry.placement = placement;
    gameEntry.totalPlayers = totalPlayers;
    savePlayerStats(stats);
  }
}

/**
 * Clear all player stats
 */
export function clearPlayerStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
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
