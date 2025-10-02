'use client';

import { useState, useEffect } from 'react';
import { subscribeToGame, subscribeToGameEvents, addPoint } from '../game';
import type { Game, GameEvent } from '@/types/game';

export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to game updates
    const unsubscribeGame = subscribeToGame(gameId, (updatedGame) => {
      setGame(updatedGame);
      setLoading(false);
    });

    // Subscribe to events
    const unsubscribeEvents = subscribeToGameEvents(gameId, (updatedEvents) => {
      setEvents(updatedEvents);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeGame?.();
      unsubscribeEvents?.();
    };
  }, [gameId]);

  const handleAddPoint = async (playerId: string) => {
    if (!gameId) return;

    try {
      await addPoint(gameId, playerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add point');
    }
  };

  return {
    game,
    events,
    loading,
    error,
    addPoint: handleAddPoint,
  };
}
