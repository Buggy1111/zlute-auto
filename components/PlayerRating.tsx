'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Player } from '@/types/game';

interface PlayerRatingProps {
  players: Player[];
  currentPlayerId: string;
  onSubmit: (ratings: Record<string, number>) => void;
  onSkip: () => void;
}

export default function PlayerRating({
  players,
  currentPlayerId,
  onSubmit,
  onSkip,
}: PlayerRatingProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  // Filter out current player
  const playersToRate = players.filter(p => p.id !== currentPlayerId);

  const handleRating = (playerId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [playerId]: rating,
    }));
  };

  const handleSubmit = () => {
    // Only submit if at least one rating given
    if (Object.keys(ratings).length > 0) {
      onSubmit(ratings);
    }
  };

  const allRated = playersToRate.every(p => ratings[p.id] !== undefined);
  const canSubmit = Object.keys(ratings).length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="card p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Star className="w-12 h-12 text-accent neon-glow mx-auto mb-3" />
          <h2 className="text-3xl font-bold neon-text mb-2">
            Ohodnoť spoluhráče
          </h2>
          <p className="text-text-dim">
            Jak férově podle tebe hráli?
          </p>
        </div>

        {/* Rating Grid */}
        <div className="space-y-4 mb-6">
          {playersToRate.map(player => {
            const playerRating = ratings[player.id] || 0;
            const displayRating = hoveredPlayer === player.id ? hoveredRating : playerRating;

            return (
              <div
                key={player.id}
                className="card p-4 bg-surface-elevated"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: player.color,
                        boxShadow: `0 0 10px ${player.color}`,
                      }}
                    />
                    <p className="font-bold text-lg" style={{ color: player.color }}>
                      {player.name}
                    </p>
                  </div>
                  <p className="text-sm text-text-dim">{player.score} bodů</p>
                </div>

                {/* Stars */}
                <div
                  className="flex gap-2 justify-center"
                  onMouseLeave={() => {
                    setHoveredPlayer(null);
                    setHoveredRating(0);
                  }}
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRating(player.id, rating)}
                      onMouseEnter={() => {
                        setHoveredPlayer(player.id);
                        setHoveredRating(rating);
                      }}
                      className="transition-all hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          rating <= displayRating
                            ? 'fill-accent text-accent neon-glow'
                            : 'text-line'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {playerRating > 0 && (
                  <p className="text-center text-sm text-accent mt-2">
                    {playerRating === 5 ? '⭐ Výborný!' :
                     playerRating === 4 ? '👍 Dobrý' :
                     playerRating === 3 ? '👌 OK' :
                     playerRating === 2 ? '🤔 Slabší' :
                     '😕 Nefér'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-dim">Ohodnoceno</p>
            <p className="text-sm font-bold text-accent">
              {Object.keys(ratings).length}/{playersToRate.length}
            </p>
          </div>
          <div className="h-2 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: `${(Object.keys(ratings).length / playersToRate.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 bg-surface-elevated border border-line text-text-dim rounded-lg font-bold hover:border-text-dim transition-colors"
          >
            Přeskočit
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 bg-accent text-bg rounded-lg font-bold hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {allRated ? 'Odeslat hodnocení' : `Odeslat (${Object.keys(ratings).length})`}
          </button>
        </div>

        <p className="text-xs text-text-muted text-center mt-4">
          Hodnocení je anonymní a viditelné až po skončení
        </p>
      </div>
    </div>
  );
}
