import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, Player, GameEvent } from '@/types/game';

const PLAYER_COLORS = [
  '#FFD700', // Gold yellow
  '#FFA500', // Orange yellow
  '#FFEB3B', // Bright yellow
  '#F59E0B', // Amber yellow
  '#FFB800', // Golden orange
  '#FFDB58', // Mustard yellow
];

export async function createGame(playerNames: string[]): Promise<string> {
  try {
    const gameRef = doc(collection(db, 'games'));
    const gameId = gameRef.id;

    const players: Record<string, Player> = {};
    playerNames.forEach((name, index) => {
      const playerId = `player_${index}`;
      players[playerId] = {
        id: playerId,
        name,
        score: 0,
        color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      };
    });

    const game: Omit<Game, 'id'> = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players,
    };

    await setDoc(gameRef, game);

    return gameId;
  } catch (error: unknown) {
    console.error('❌ Error creating game:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      throw new Error(`Failed to create game: ${error.message}`);
    }
    throw new Error('Failed to create game: Unknown error');
  }
}

export async function getGame(gameId: string): Promise<Game | null> {
  const gameRef = doc(db, 'games', gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    return null;
  }

  return {
    id: gameSnap.id,
    ...gameSnap.data(),
  } as Game;
}

// Rate limiting: Store last point time per player
const lastPointTime: Record<string, number> = {};

export async function addPoint(gameId: string, playerId: string): Promise<void> {
  const now = Date.now();
  const key = `${gameId}_${playerId}`;

  // Require 2 seconds between points for the same player
  if (lastPointTime[key] && now - lastPointTime[key] < 2000) {
    throw new Error('Příliš rychle! Počkej chvilku.');
  }

  lastPointTime[key] = now;

  const gameRef = doc(db, 'games', gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error('Game not found');
  }

  const game = gameSnap.data() as Game;
  const player = game.players[playerId];

  if (!player) {
    throw new Error('Player not found');
  }

  // Update player score
  const updatedPlayers = {
    ...game.players,
    [playerId]: {
      ...player,
      score: player.score + 1,
    },
  };

  // Update game
  await updateDoc(gameRef, {
    players: updatedPlayers,
    updatedAt: Date.now(),
  });

  // Add event
  const eventRef = collection(db, 'games', gameId, 'events');
  await addDoc(eventRef, {
    playerId,
    playerName: player.name,
    timestamp: Date.now(),
    type: 'point_added',
  });
}

export function subscribeToGame(
  gameId: string,
  callback: (game: Game) => void
): () => void {
  const gameRef = doc(db, 'games', gameId);

  return onSnapshot(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Game);
    }
  });
}

export async function getGameEvents(
  gameId: string,
  limitCount: number = 50
): Promise<GameEvent[]> {
  const eventsRef = collection(db, 'games', gameId, 'events');
  const q = query(eventsRef, orderBy('timestamp', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GameEvent[];
}

export function subscribeToGameEvents(
  gameId: string,
  callback: (events: GameEvent[]) => void
): () => void {
  const eventsRef = collection(db, 'games', gameId, 'events');
  const q = query(eventsRef, orderBy('timestamp', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GameEvent[];
    callback(events);
  });
}
