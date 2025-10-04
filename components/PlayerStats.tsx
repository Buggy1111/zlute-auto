'use client';

import { getCalculatedStats, clearPlayerStats } from '@/lib/playerStats';
import { X, Trophy, Target, TrendingUp, Award, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PlayerStatsProps {
  onClose: () => void;
}

export default function PlayerStats({ onClose }: PlayerStatsProps) {
  const [stats, setStats] = useState(getCalculatedStats());
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Refresh stats when component mounts
    setStats(getCalculatedStats());
  }, []);

  const handleClear = () => {
    clearPlayerStats();
    setStats(getCalculatedStats());
    setShowConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Dnes';
    if (diffDays === 1) return 'Včera';
    if (diffDays < 7) return `Před ${diffDays} dny`;
    return date.toLocaleDateString('cs-CZ');
  };

  const getPlacementEmoji = (placement: number) => {
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    return `${placement}.`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold neon-text">Moje statistiky</h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text"
              aria-label="Zavřít"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {stats.totalGames === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-text mb-2">
                Zatím žádné hry
              </h3>
              <p className="text-text-dim">
                Začni hrát a tvoje statistiky se objeví zde!
              </p>
            </div>
          ) : (
            <>
              {/* Overall Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    <h3 className="text-sm text-text-dim">Celkem her</h3>
                  </div>
                  <p className="text-3xl font-bold text-text">{stats.totalGames}</p>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-accent" />
                    <h3 className="text-sm text-text-dim">Celkem bodů</h3>
                  </div>
                  <p className="text-3xl font-bold text-text">{stats.totalPoints}</p>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h3 className="text-sm text-text-dim">Průměr</h3>
                  </div>
                  <p className="text-3xl font-bold text-text">{stats.avgScore}</p>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-accent" />
                    <h3 className="text-sm text-text-dim">Vítězství</h3>
                  </div>
                  <p className="text-3xl font-bold text-text">
                    {stats.wins}
                    <span className="text-sm text-text-dim ml-2">
                      ({stats.winRate}%)
                    </span>
                  </p>
                </div>
              </div>

              {/* Best Score */}
              {stats.bestScore > 0 && (
                <div className="p-4 bg-accent/10 border border-accent rounded-lg mb-6">
                  <h3 className="text-sm text-text-dim mb-1">🏆 Nejlepší hra</h3>
                  <p className="text-2xl font-bold text-accent">
                    {stats.bestScore} bodů
                  </p>
                </div>
              )}

              {/* Game History */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-text mb-4">
                  📜 Historie her
                </h3>
                <div className="space-y-3">
                  {stats.games
                    .slice()
                    .sort((a, b) => b.date - a.date)
                    .slice(0, 10)
                    .map((game, index) => (
                      <div
                        key={game.gameId + index}
                        className="p-4 bg-surface-elevated rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getPlacementEmoji(game.placement || 0)}
                            </span>
                            <div>
                              <p className="font-bold text-text">
                                {game.playerName}
                              </p>
                              <p className="text-sm text-text-dim">
                                {formatDate(game.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              {game.finalScore}
                            </p>
                            <p className="text-xs text-text-dim">
                              {game.totalPlayers > 0
                                ? `${game.totalPlayers} hráčů`
                                : 'probíhá'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Clear Stats Button */}
              <div className="pt-4 border-t border-line">
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full p-3 bg-danger/20 border border-danger text-danger rounded-lg font-bold hover:bg-danger/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Vymazat všechny statistiky
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-text-dim text-sm">
                      Opravdu chceš smazat všechny statistiky?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleClear}
                        className="flex-1 p-3 bg-danger text-bg rounded-lg font-bold hover:bg-danger/90 transition-colors"
                      >
                        Ano, smazat
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 p-3 bg-surface-elevated text-text rounded-lg font-bold hover:bg-line transition-colors"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
