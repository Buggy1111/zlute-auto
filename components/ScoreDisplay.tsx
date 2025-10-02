'use client';

import { Game } from '@/types/game';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  game: Game;
}

export default function ScoreDisplay({ game }: ScoreDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const players = Object.values(game.players).sort((a, b) => b.score - a.score);
  const topScore = players[0]?.score || 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass-strong rounded-3xl shadow-2xl p-6 border-2 border-white/40 mb-6 relative overflow-hidden">
      {/* Animated background with MORE COLOR */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.15) 50%, rgba(255,235,59,0.2) 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black gradient-text flex items-center gap-2">
            🏆 Žebříček
          </h2>
          <p className="text-sm text-gray-600 font-semibold mt-1">Live skóre</p>
        </div>
        <div className="relative">
          <div className="text-7xl animate-float" style={{ filter: 'sepia(100%) saturate(400%) brightness(100%) hue-rotate(-10deg)' }}>🚗</div>
          <div className="absolute inset-0 blur-2xl bg-yellow-primary opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Players list */}
      <div className="relative z-10 space-y-3">
        {players.map((player, index) => {
          const isLeader = player.score === topScore && topScore > 0;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

          return (
            <div
              key={player.id}
              className={`
                relative overflow-hidden transition-all duration-500 rounded-2xl
                ${isLeader
                  ? 'bg-gradient-to-r from-yellow-light via-yellow-accent/30 to-yellow-light border-3 border-yellow-primary shadow-[0_0_30px_rgba(255,215,0,0.4)] animate-glow'
                  : 'glass border border-white/30 hover:glass-strong'
                }
                transform hover:scale-102
              `}
              style={{
                animation: mounted ? `slideUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {/* Shine effect for leader */}
              {isLeader && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
              )}

              <div className="relative z-10 flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Position */}
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-3xl font-black text-gray-400">
                      #{index + 1}
                    </span>
                    {medal && <span className="text-2xl mt-1">{medal}</span>}
                  </div>

                  {/* Player info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: player.color,
                          boxShadow: `0 0 15px ${player.color}`,
                          animation: isLeader ? 'pulse 1s ease-in-out infinite' : 'none',
                        }}
                      />
                      <h3 className={`font-black text-gray-800 ${isLeader ? 'text-2xl' : 'text-xl'}`}>
                        {player.name}
                        {isLeader && ' 👑'}
                      </h3>
                    </div>
                    {isLeader && topScore > 0 && (
                      <p className="text-xs font-bold text-yellow-dark uppercase tracking-wide">
                        ⚡ Vedoucí hráč
                      </p>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div
                    className={`font-black transition-all ${isLeader ? 'text-5xl' : 'text-4xl'}`}
                    style={{
                      color: player.color,
                      textShadow: `0 0 20px ${player.color}40`,
                    }}
                  >
                    {player.score}
                  </div>
                  <div className="text-xs text-gray-500 font-bold mt-1">
                    {player.score === 1 ? 'BOD' : player.score < 5 ? 'BODY' : 'BODŮ'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confetti particles for leader */}
      {topScore > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#FFD700', '#FFA500', '#FFEB3B', '#FFB800'][i % 4],
                left: `${10 + i * 12}%`,
                animation: `float ${2 + (i % 3)}s ease-in-out infinite ${i * 0.2}s`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
