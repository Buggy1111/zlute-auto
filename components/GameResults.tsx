'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Gem, Crown, Award, Car } from 'lucide-react';
import type { Game, GameEvent, Player } from '@/types/game';

interface GameResultsProps {
  game: Game;
  events: GameEvent[];
}

const ACHIEVEMENTS = [
  { score: 1, title: 'První bod!', icon: Star, message: 'Výborný začátek!' },
  { score: 5, title: '5 bodů!', icon: Star, message: 'Jede to!' },
  { score: 10, title: '10 bodů!', icon: Flame, message: 'Bomba!' },
  { score: 20, title: '20 bodů!', icon: Gem, message: 'Šampion!' },
  { score: 50, title: '50 bodů!', icon: Crown, message: 'Legenda!' },
  { score: 100, title: '100 bodů!', icon: Trophy, message: 'Mistr světa!' },
];

export default function GameResults({ game, events }: GameResultsProps) {
  const players = Object.values(game.players).sort((a, b) => b.score - a.score);
  const winner = players[0];
  const totalPoints = players.reduce((sum, p) => sum + p.score, 0);

  // Get achievements for each player
  const getPlayerAchievements = (player: Player) => {
    return ACHIEVEMENTS.filter(a => player.score >= a.score);
  };

  const allAchievements = players.flatMap(player =>
    getPlayerAchievements(player).map(ach => ({
      player,
      achievement: ach
    }))
  );

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="card p-8 text-center border-accent neon-border"
      >
        <Trophy className="w-20 h-20 text-accent neon-glow-strong mx-auto mb-4" />
        <h2 className="text-4xl font-bold neon-text mb-2">Vítěz!</h2>
        <p className="text-5xl font-bold mb-2" style={{ color: winner.color }}>
          {winner.name}
        </p>
        <p className="text-2xl text-text-dim">
          {winner.score} {winner.score === 1 ? 'bod' : winner.score < 5 ? 'body' : 'bodů'}
        </p>
      </motion.div>

      {/* Final Scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-accent neon-glow" />
          <h2 className="text-2xl font-bold neon-text">Finální Žebříček</h2>
        </div>

        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="p-4 bg-surface-elevated rounded-lg border border-line"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: player.color }}>
                      {player.name}
                    </p>
                    <p className="text-sm text-text-dim">
                      {getPlayerAchievements(player).length} achievementů
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: player.color }}>
                    {player.score}
                  </p>
                  <p className="text-xs text-text-dim">
                    {player.score > 0 ? `${Math.round((player.score / totalPoints) * 100)}%` : '0%'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      {allAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-accent neon-glow" />
            <h2 className="text-2xl font-bold neon-text">Achievementy</h2>
          </div>

          <div className="grid gap-3">
            {allAchievements.map((item, idx) => {
              const Icon = item.achievement.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-surface-elevated rounded-lg border border-line flex items-center gap-4"
                >
                  <Icon className="w-8 h-8 text-accent neon-glow" />
                  <div className="flex-1">
                    <p className="font-bold text-text">{item.achievement.title}</p>
                    <p className="text-sm text-text-dim">{item.achievement.message}</p>
                  </div>
                  <p className="font-bold" style={{ color: item.player.color }}>
                    {item.player.name}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Game History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Car className="w-6 h-6 text-accent neon-glow" />
          <h2 className="text-2xl font-bold neon-text">Kompletní Historie</h2>
        </div>

        {events.length === 0 ? (
          <p className="text-text-dim text-center py-4">Žádná žlutá auta nebyla spatřena!</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.map((event) => {
              const player = game.players[event.playerId];
              return (
                <div
                  key={event.id}
                  className="p-3 bg-surface-elevated border border-line rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-accent neon-glow" />
                    <span className="font-bold" style={{ color: player?.color }}>
                      {event.playerName}
                    </span>
                  </div>
                  <span className="text-sm text-text-dim">
                    {new Date(event.timestamp).toLocaleTimeString('cs-CZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
