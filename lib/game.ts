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
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, Player, GameEvent, Challenge, PlayerRating } from '@/types/game';

const PLAYER_COLORS = [
  '#FFD700', // Gold yellow
  '#FFA500', // Orange yellow
  '#FFEB3B', // Bright yellow
  '#F59E0B', // Amber yellow
  '#FFB800', // Golden orange
  '#FFDB58', // Mustard yellow
  '#FFC107', // Amber
  '#FFAA00', // Dark golden
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

    const now = Date.now();
    const game: Omit<Game, 'id'> = {
      createdAt: now,
      updatedAt: now,
      players,
      status: 'playing',
      startedAt: now,
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

export async function endGame(gameId: string): Promise<void> {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, {
    status: 'finished',
    finishedAt: Date.now(),
    updatedAt: Date.now(),
  });
}

// Challenge functions
export async function createChallenge(
  gameId: string,
  eventId: string,
  playerId: string,
  playerName: string,
  challengedBy: string,
  challengedByName: string
): Promise<string> {
  const challengeRef = collection(db, 'games', gameId, 'challenges');
  const now = Date.now();

  const challenge: Omit<Challenge, 'id'> = {
    gameId,
    eventId,
    playerId,
    playerName,
    challengedBy,
    challengedByName,
    votes: {},
    status: 'voting',
    createdAt: now,
    expiresAt: now + 10000, // 10 seconds
  };

  const docRef = await addDoc(challengeRef, challenge);
  return docRef.id;
}

export async function voteOnChallenge(
  gameId: string,
  challengeId: string,
  voterId: string,
  vote: 'yes' | 'no'
): Promise<void> {
  const challengeRef = doc(db, 'games', gameId, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);

  if (!challengeSnap.exists()) {
    throw new Error('Challenge not found');
  }

  const challenge = challengeSnap.data() as Challenge;

  await updateDoc(challengeRef, {
    votes: {
      ...challenge.votes,
      [voterId]: vote,
    },
  });
}

export async function resolveChallenge(
  gameId: string,
  challengeId: string
): Promise<'approved' | 'rejected'> {
  const challengeRef = doc(db, 'games', gameId, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);

  if (!challengeSnap.exists()) {
    throw new Error('Challenge not found');
  }

  const challenge = challengeSnap.data() as Challenge;
  const votes = Object.values(challenge.votes);
  const yesVotes = votes.filter(v => v === 'yes').length;
  const noVotes = votes.filter(v => v === 'no').length;

  const result: 'approved' | 'rejected' = yesVotes > noVotes ? 'approved' : 'rejected';

  await updateDoc(challengeRef, {
    status: result,
    resolvedAt: Date.now(),
  });

  // If rejected, remove the point
  if (result === 'rejected') {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const game = gameSnap.data() as Game;
      const player = game.players[challenge.playerId];

      if (player && player.score > 0) {
        await updateDoc(gameRef, {
          players: {
            ...game.players,
            [challenge.playerId]: {
              ...player,
              score: player.score - 1,
            },
          },
          updatedAt: Date.now(),
        });

        // Delete the event
        const eventRef = doc(db, 'games', gameId, 'events', challenge.eventId);
        await deleteDoc(eventRef);
      }
    }
  }

  return result;
}

export function subscribeToActiveChallenge(
  gameId: string,
  callback: (challenge: Challenge | null) => void
): () => void {
  const challengesRef = collection(db, 'games', gameId, 'challenges');
  const q = query(
    challengesRef,
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const doc = snapshot.docs[0];
    const challenge = { id: doc.id, ...doc.data() } as Challenge;

    // Only show voting challenges that haven't expired
    if (challenge.status === 'voting' && challenge.expiresAt > Date.now()) {
      callback(challenge);
    } else {
      callback(null);
    }
  });
}

// Rating functions
export async function submitRating(
  gameId: string,
  raterId: string,
  ratings: Record<string, number>
): Promise<void> {
  const gameRef = doc(db, 'games', gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error('Game not found');
  }

  const game = gameSnap.data() as Game;

  // Save ratings for each player
  for (const [playerId, rating] of Object.entries(ratings)) {
    const player = game.players[playerId];
    if (!player) continue;

    const ratingRef = doc(db, 'games', gameId, 'ratings', playerId);
    const ratingSnap = await getDoc(ratingRef);

    if (ratingSnap.exists()) {
      const existingRating = ratingSnap.data() as PlayerRating;

      // Check if this rater already rated
      if (existingRating.ratedBy.includes(raterId)) {
        continue; // Skip duplicate ratings
      }

      const newRatings = {
        ...existingRating.ratings,
        [raterId]: rating,
      };
      const ratedBy = [...existingRating.ratedBy, raterId];
      const totalRatings = Object.values(newRatings).reduce((sum, r) => sum + r, 0);
      const averageRating = totalRatings / Object.keys(newRatings).length;

      await updateDoc(ratingRef, {
        ratings: newRatings,
        ratedBy,
        averageRating,
      });
    } else {
      const playerRating: PlayerRating = {
        gameId,
        playerId,
        playerName: player.name,
        ratings: { [raterId]: rating },
        ratedBy: [raterId],
        averageRating: rating,
      };
      await setDoc(ratingRef, playerRating);
    }
  }
}

export async function getPlayerRatings(gameId: string): Promise<Record<string, PlayerRating>> {
  const ratingsRef = collection(db, 'games', gameId, 'ratings');
  const snapshot = await getDocs(ratingsRef);

  const ratings: Record<string, PlayerRating> = {};
  snapshot.docs.forEach(doc => {
    const rating = { ...doc.data() } as PlayerRating;
    ratings[rating.playerId] = rating;
  });

  return ratings;
}

export function subscribeToPlayerRatings(
  gameId: string,
  callback: (ratings: Record<string, PlayerRating>) => void
): () => void {
  const ratingsRef = collection(db, 'games', gameId, 'ratings');

  return onSnapshot(ratingsRef, (snapshot) => {
    const ratings: Record<string, PlayerRating> = {};
    snapshot.docs.forEach(doc => {
      const rating = { ...doc.data() } as PlayerRating;
      ratings[rating.playerId] = rating;
    });
    callback(ratings);
  });
}
