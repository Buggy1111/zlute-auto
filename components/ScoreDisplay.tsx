'use client';

import { Game } from '@/types/game';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  game: Game;
}

export default function ScoreDisplay({ game }: ScoreDisplayProps) {
  const players = Object.values(game.players).sort((a, b) => b.score - a.score);
  const topScore = players[0]?.score || 0;

  return (
    <div className="card p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent neon-glow" />
          <h2 className="text-2xl font-bold neon-text">Žebříček</h2>
        </div>
        <p className="text-text-dim text-sm">Live skóre</p>
      </div>

      {/* Players list */}
      <div className="space-y-3">
        {players.map((player, index) => {
          const isLeader = player.score === topScore && topScore > 0;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

          return (
            <div
              key={player.id}
              className={`p-4 rounded-lg border transition-all ${
                isLeader
                  ? 'bg-accent/10 border-accent neon-border'
                  : 'bg-surface border-line'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Player info */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl text-text-muted">#{index + 1}</span>
                  {medal && <span className="text-2xl">{medal}</span>}

                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: player.color,
                        boxShadow: `0 0 10px ${player.color}`,
                      }}
                    />
                    <h3 className="text-lg font-bold text-text">
                      {player.name}
                      {isLeader && ' 👑'}
                    </h3>
                  </div>
                </div>

                {/* Score */}
                <div className="text-3xl font-bold" style={{ color: player.color }}>
                  {player.score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
