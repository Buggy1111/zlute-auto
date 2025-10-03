'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGame } from '@/lib/hooks/useGame';
import PlayerButton from '@/components/PlayerButton';
import GameMenu from '@/components/GameMenu';
import Toast from '@/components/Toast';
import GameTimer from '@/components/GameTimer';
import GameResults from '@/components/GameResults';
import { useState } from 'react';
import { playSound } from '@/lib/sounds';
import { endGame } from '@/lib/game';
import { Car } from 'lucide-react';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const { game, events, loading, error, addPoint } = useGame(gameId);
  const [addingPoint, setAddingPoint] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const isPlaying = game?.status === 'playing';
  const isFinished = game?.status === 'finished';

  const handleAddPoint = async (playerId: string) => {
    if (!isPlaying) return;

    setAddingPoint(playerId);

    try {
      await addPoint(playerId);
      playSound('point');

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (err) {
      playSound('error');
      const errorMessage = err instanceof Error ? err.message : 'Něco se pokazilo';
      setToastMessage({
        message: errorMessage.includes('rychle')
          ? 'Příliš rychle! Počkej chvilku 😊'
          : errorMessage,
        type: 'error',
      });
    } finally {
      setAddingPoint(null);
    }
  };

  const handleEndGame = async () => {
    if (!game) return;

    try {
      await endGame(gameId);
      playSound('achievement');
      setToastMessage({
        message: 'Hra ukončena! Zobrazuji výsledky...',
        type: 'success',
      });
    } catch (err) {
      playSound('error');
      setToastMessage({
        message: 'Chyba při ukončení hry',
        type: 'error',
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Žluté Auto - Hra',
          text: 'Pojď hrát Žluté Auto! 🚗💨',
          url: url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('✅ Link zkopírován do schránky!');
    }
  };

  const handleNewGame = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4">
        <div className="text-center">
          <Car className="w-24 h-24 text-accent neon-glow-strong mx-auto mb-6 animate-pulse" />
          <p className="text-2xl font-bold neon-text mb-4">Načítání hry...</p>
          <div className="flex justify-center gap-2">
            {[0, 0.1, 0.2].map((delay, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">😢</div>
          <h1 className="text-4xl font-bold neon-text mb-4">Hra nenalezena</h1>
          <div className="card p-8 mb-6">
            <p className="text-text font-bold text-lg mb-2">
              Tato hra neexistuje nebo byla smazána.
            </p>
            <p className="text-text-dim">Vytvořte si novou hru a začněte hrát!</p>
          </div>
          <button
            onClick={handleNewGame}
            className="px-10 py-5 bg-accent text-bg rounded-lg font-bold text-xl neon-border hover:bg-accent-hover transition-all"
          >
            Vytvořit novou hru 🎮
          </button>
        </div>
      </div>
    );
  }

  const players = Object.values(game.players).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4 bg-bg">
      <GameMenu
        onNewGame={handleNewGame}
        onShare={handleShare}
        onEndGame={handleEndGame}
        gameStatus={game.status}
      />

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Car className="w-16 h-16 text-accent neon-glow mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="neon-text text-4xl mb-3">Žluté Auto</h1>
          <p className="text-text-dim">
            {isPlaying ? 'Klikni, když vidíš žluté auto!' : 'Výsledky hry'}
          </p>
        </div>

        {/* Timer - show during playing and finished */}
        {game.startedAt && (
          <GameTimer startedAt={game.startedAt} finishedAt={game.finishedAt} />
        )}

        {/* Playing state - show only buttons */}
        {isPlaying && (
          <>
            <div className="space-y-4 mb-6">
              {players.map((player) => (
                <PlayerButton
                  key={player.id}
                  player={player}
                  onClick={() => handleAddPoint(player.id)}
                  disabled={addingPoint !== null}
                  hideScore={true}
                />
              ))}
            </div>

            {/* End Game Button */}
            <button
              onClick={handleEndGame}
              className="w-full py-5 bg-danger/20 border-2 border-danger text-danger rounded-lg font-bold text-xl hover:bg-danger/30 transition-all flex items-center justify-center gap-3"
            >
              <span>🏁</span>
              Ukončit hru a zobrazit výsledky
            </button>
          </>
        )}

        {/* Finished state - show results */}
        {isFinished && <GameResults game={game} events={events} />}
      </div>
    </div>
  );
}
