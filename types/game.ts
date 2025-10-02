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
}

export interface GameWithEvents extends Game {
  events: GameEvent[];
}
