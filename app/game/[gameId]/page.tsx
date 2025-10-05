'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGame } from '@/lib/hooks/useGame';
import PlayerButton from '@/components/PlayerButton';
import GameMenu from '@/components/GameMenu';
import Toast from '@/components/Toast';
import GameTimer from '@/components/GameTimer';
import GameResults from '@/components/GameResults';
import ChallengeToast from '@/components/ChallengeToast';
import ChallengeVoting from '@/components/ChallengeVoting';
import BackgroundIndicator from '@/components/BackgroundIndicator';
import { useState, useEffect } from 'react';
import { playSound } from '@/lib/sounds';
import { endGame, createChallenge, voteOnChallenge, resolveChallenge, subscribeToActiveChallenge } from '@/lib/game';
import type { Challenge } from '@/types/game';
import { Car } from 'lucide-react';
import { recordPoint } from '@/lib/playerStats';
import { requestWakeLock, releaseWakeLock, setupWakeLockReacquisition } from '@/lib/wakeLock';

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
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [showChallengeToast, setShowChallengeToast] = useState(false);
  const [lastPointPlayer, setLastPointPlayer] = useState<{ id: string; name: string; color: string } | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');

  // Let user select their player on first load
  useEffect(() => {
    if (!game) return;

    const storedPlayerId = localStorage.getItem(`gamePlayer_${gameId}`);
    if (storedPlayerId && game.players[storedPlayerId]) {
      setCurrentPlayerId(storedPlayerId);
    } else if (Object.keys(game.players).length > 0 && !currentPlayerId) {
      // Auto-select first player if not set (can be changed later)
      const firstPlayerId = Object.keys(game.players)[0];
      setCurrentPlayerId(firstPlayerId);
      localStorage.setItem(`gamePlayer_${gameId}`, firstPlayerId);
    }
  }, [game, gameId, currentPlayerId]);

  const isPlaying = game?.status === 'playing';
  const isFinished = game?.status === 'finished';

  // Wake Lock: Keep screen on during gameplay
  useEffect(() => {
    if (!isPlaying) return;

    // Request wake lock when game starts
    requestWakeLock();

    // Setup reacquisition when page becomes visible again
    const cleanup = setupWakeLockReacquisition();

    return () => {
      cleanup();
      releaseWakeLock();
    };
  }, [isPlaying]);

  // Subscribe to active challenges
  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToActiveChallenge(gameId, (challenge) => {
      setActiveChallenge(challenge);

      // Auto-resolve challenge when it expires
      if (challenge && challenge.status === 'voting') {
        const timeUntilExpire = challenge.expiresAt - Date.now();
        if (timeUntilExpire > 0) {
          const timer = setTimeout(async () => {
            try {
              const result = await resolveChallenge(gameId, challenge.id);
              setToastMessage({
                message: result === 'approved'
                  ? '✅ Bod byl schválen!'
                  : '❌ Bod byl zamítnut!',
                type: result === 'approved' ? 'success' : 'error',
              });
              playSound(result === 'approved' ? 'achievement' : 'error');
            } catch (err) {
              console.error('Error auto-resolving challenge:', err);
            }
          }, timeUntilExpire + 100);

          return () => clearTimeout(timer);
        }
      }
    });

    return unsubscribe;
  }, [gameId]);

  const handleAddPoint = async (playerId: string) => {
    if (!isPlaying || !game) return;

    setAddingPoint(playerId);

    try {
      await addPoint(playerId);
      playSound('point');

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      // Record point in localStorage if this is current player
      const player = game.players[playerId];
      if (player && playerId === currentPlayerId) {
        recordPoint(gameId, player.name);
      }

      // Get the latest event ID and show challenge toast
      if (player && events.length > 0) {
        const latestEvent = events[0]; // Events are sorted desc
        setLastEventId(latestEvent.id);
        setLastPointPlayer({
          id: playerId,
          name: player.name,
          color: player.color,
        });
        setShowChallengeToast(true);
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

  const handleChallenge = async () => {
    if (!lastPointPlayer || !lastEventId || !game) return;

    try {
      // Find current player's info from game.players
      const currentPlayer = Object.values(game.players).find(p => p.id === currentPlayerId);
      if (!currentPlayer) {
        throw new Error('Player not found');
      }

      await createChallenge(
        gameId,
        lastEventId,
        lastPointPlayer.id,
        lastPointPlayer.name,
        currentPlayerId,
        currentPlayer.name
      );
      playSound('error');
    } catch {
      setToastMessage({
        message: 'Chyba při vytváření challenge',
        type: 'error',
      });
    }
  };

  const handleVote = async (vote: 'yes' | 'no') => {
    if (!activeChallenge) return;

    try {
      await voteOnChallenge(gameId, activeChallenge.id, currentPlayerId, vote);

      // Check if all players have voted
      const totalPlayers = Object.keys(game?.players || {}).length;
      const totalVotes = Object.keys(activeChallenge.votes).length + 1; // +1 for current vote

      if (totalVotes >= totalPlayers) {
        // Resolve challenge after short delay
        setTimeout(async () => {
          try {
            const result = await resolveChallenge(gameId, activeChallenge.id);
            setToastMessage({
              message: result === 'approved'
                ? '✅ Bod byl schválen!'
                : '❌ Bod byl zamítnut!',
              type: result === 'approved' ? 'success' : 'error',
            });
            playSound(result === 'approved' ? 'achievement' : 'error');
          } catch (err) {
            console.error('Error resolving challenge:', err);
          }
        }, 1000);
      }
    } catch {
      setToastMessage({
        message: 'Chyba při hlasování',
        type: 'error',
      });
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
    } catch {
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

      {/* Background Indicator */}
      {isPlaying && <BackgroundIndicator />}

      {/* Player Selector - only show during playing */}
      {isPlaying && game && (
        <div className="fixed top-4 left-4 z-40">
          <select
            value={currentPlayerId}
            onChange={(e) => {
              setCurrentPlayerId(e.target.value);
              localStorage.setItem(`gamePlayer_${gameId}`, e.target.value);
            }}
            className="card px-4 py-2 text-sm font-bold bg-surface border-line hover:border-accent transition-colors cursor-pointer"
            style={{ color: game.players[currentPlayerId]?.color || '#FFD700' }}
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Challenge Toast */}
      {showChallengeToast && lastPointPlayer && (
        <ChallengeToast
          playerName={lastPointPlayer.name}
          playerColor={lastPointPlayer.color}
          onChallenge={handleChallenge}
          onClose={() => setShowChallengeToast(false)}
        />
      )}

      {/* Challenge Voting Modal */}
      {activeChallenge && game && (
        <ChallengeVoting
          challenge={activeChallenge}
          players={game.players}
          currentPlayerId={currentPlayerId}
          onVote={handleVote}
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
        {isFinished && <GameResults game={game} events={events} currentPlayerId={currentPlayerId} />}
      </div>
    </div>
  );
}
