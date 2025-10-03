export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface GameEvent {
  id: string;
  playerId: string;
  playerName: string;
  timestamp: number;
  type: 'point_added';
}

export interface Game {
  id: string;
  createdAt: number;
  updatedAt: number;
  players: Record<string, Player>;
  status: 'playing' | 'finished';
  startedAt?: number;
  finishedAt?: number;
}

export interface Challenge {
  id: string;
  gameId: string;
  eventId: string;
  playerId: string;
  playerName: string;
  challengedBy: string;
  challengedByName: string;
  votes: Record<string, 'yes' | 'no'>;
  status: 'voting' | 'approved' | 'rejected';
  createdAt: number;
  resolvedAt?: number;
  expiresAt: number;
}

export interface PlayerRating {
  gameId: string;
  playerId: string;
  playerName: string;
  ratings: Record<string, number>;
  averageRating?: number;
  ratedBy: string[];
}
