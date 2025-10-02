'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGame } from '@/lib/hooks/useGame';
import PlayerButton from '@/components/PlayerButton';
import ScoreDisplay from '@/components/ScoreDisplay';
import GameHistory from '@/components/GameHistory';
import Achievement from '@/components/Achievement';
import GameMenu from '@/components/GameMenu';
import Toast from '@/components/Toast';
import FloatingParticles from '@/components/FloatingParticles';
import GradientMesh from '@/components/GradientMesh';
import { useState, useEffect } from 'react';
import { playSound } from '@/lib/sounds';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const { game, events, loading, error, addPoint } = useGame(gameId);
  const [addingPoint, setAddingPoint] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mounted, setMounted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCarDrive, setShowCarDrive] = useState(false);
  const [lastAchievement, setLastAchievement] = useState<{ score: number; playerName: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    setMounted(true);

    // Random car driving by
    const carInterval = setInterval(() => {
      setShowCarDrive(true);
      setTimeout(() => setShowCarDrive(false), 3000);
    }, 20000);

    return () => clearInterval(carInterval);
  }, []);

  const handleAddPoint = async (playerId: string) => {
    setAddingPoint(playerId);

    try {
      await addPoint(playerId);

      // Show celebration only on success
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);

      // Create massive confetti explosion
      const newConfetti = Array.from({ length: 40 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 50,
      }));
      setConfetti((prev) => [...prev, ...newConfetti]);

      // Clean up confetti
      setTimeout(() => {
        setConfetti((prev) => prev.filter((c) => !newConfetti.find((n) => n.id === c.id)));
      }, 3000);

      // Play point sound
      playSound('point');

      // Show achievement if milestone reached
      if (game) {
        const player = game.players[playerId];
        const newScore = player.score + 1;
        const achievementScores = [1, 5, 10, 20, 50, 100];

        if (achievementScores.includes(newScore)) {
          setLastAchievement({ score: newScore, playerName: player.name });
          // Play achievement sound
          setTimeout(() => playSound('achievement'), 500);
        }
      }

      // Enhanced haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    } catch (err) {
      // Play error sound
      playSound('error');

      // Show error toast instead of crashing
      const errorMessage = err instanceof Error ? err.message : 'Něco se pokazilo';
      setToastMessage({
        message: errorMessage.includes('rychle') ? 'Příliš rychle! Počkej chvilku 😊' : errorMessage,
        type: 'error'
      });
    } finally {
      setAddingPoint(null);
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-primary/20 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 blur-3xl bg-yellow-primary opacity-50 animate-pulse" />
            <div className="absolute inset-0 blur-2xl bg-yellow-secondary opacity-30 animate-glow" />
            <div className="text-9xl animate-float relative z-10 drop-shadow-[0_0_40px_rgba(255,215,0,0.9)]">
              🚗
            </div>
          </div>
          <p className="text-4xl font-black gradient-text mb-4 drop-shadow-lg">
            Načítání hry...
          </p>
          <div className="flex justify-center gap-3">
            {[0, 0.1, 0.2].map((delay, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-full shadow-lg"
                style={{
                  animation: `bounce 1s ease-in-out infinite ${delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-9xl mb-6 animate-[shake_1s_ease-in-out]">😢</div>
          <h1 className="text-5xl font-black gradient-text mb-4 drop-shadow-lg">
            Hra nenalezena
          </h1>
          <div className="glass-strong rounded-3xl p-8 mb-6 border-2 border-white/50 shadow-2xl">
            <p className="text-gray-800 font-bold text-xl mb-2">
              Tato hra neexistuje nebo byla smazána.
            </p>
            <p className="text-gray-600 font-semibold">
              Vytvořte si novou hru a začněte hrát!
            </p>
          </div>
          <button
            onClick={handleNewGame}
            className="px-10 py-5 bg-gradient-to-r from-yellow-primary to-yellow-secondary text-white rounded-2xl font-black text-2xl shadow-[0_20px_60px_rgba(255,215,0,0.5)] hover:shadow-[0_30px_80px_rgba(255,215,0,0.7)] transform hover:scale-110 transition-all"
          >
            Vytvořit novou hru 🎮
          </button>
        </div>
      </div>
    );
  }

  const players = Object.values(game.players).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <GradientMesh />

      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Game Menu */}
      <GameMenu onNewGame={handleNewGame} onShare={handleShare} />

      {/* Toast notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Achievement popup */}
      {lastAchievement && (
        <Achievement score={lastAchievement.score} playerName={lastAchievement.playerName} />
      )}

      {/* Driving Porsche animation */}
      {showCarDrive && (
        <div className="fixed top-1/4 left-0 w-full pointer-events-none z-50">
          <div className="animate-[car-drive_3s_linear]">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-primary/40 shadow-[0_0_50px_rgba(255,215,0,0.8)] bg-gradient-to-br from-yellow-light/30 to-transparent backdrop-blur-sm">
              <Image
                src="/porsche.webp"
                alt="Driving Porsche"
                width={160}
                height={160}
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="text-9xl animate-[bounce-in_0.5s_ease-out]">
            ⭐ 🎉 ⭐
          </div>
        </div>
      )}

      {/* Enhanced confetti particles */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="fixed rounded-full pointer-events-none z-50 shadow-lg"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            background: ['#FFD700', '#FFA500', '#FFEB3B', '#F59E0B', '#FFB800', '#FFDB58'][Math.floor(Math.random() * 6)],
            animation: 'confettiFall 3s ease-out forwards',
          }}
        />
      ))}

      {/* Floating background elements */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${6 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`,
              }}
            >
              {['🚗', '⭐', '💛', '✨'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className={`max-w-2xl mx-auto transition-all duration-1000 relative z-10 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Premium Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 blur-3xl bg-yellow-primary/20 animate-pulse-scale" />
          <div className="relative z-10">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-yellow-primary opacity-50 animate-glow" />
                <div className="animate-float">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-primary/30 shadow-[0_0_60px_rgba(255,215,0,0.6)] bg-gradient-to-br from-yellow-light/20 to-transparent backdrop-blur-sm">
                    <Image
                      src="/porsche.webp"
                      alt="Yellow Porsche"
                      width={128}
                      height={128}
                      priority
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-black gradient-text mb-3 drop-shadow-2xl">
              Žluté Auto
            </h1>
            <div className="glass-strong rounded-2xl px-8 py-3 inline-block border-2 border-yellow-primary/40 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
              <p className="text-gray-800 font-black text-lg">
                👀 Klikni, když vidíš žluté auto! 👀
              </p>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <ScoreDisplay game={game} />

        {/* Player Buttons */}
        <div className="space-y-5 mb-8">
          {players.map((player, index) => (
            <div
              key={player.id}
              style={{
                animation: mounted ? `slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s both` : 'none'
              }}
            >
              <PlayerButton
                player={player}
                onClick={() => handleAddPoint(player.id)}
                disabled={addingPoint !== null}
              />
            </div>
          ))}
        </div>

        {/* Game History */}
        <div
          style={{
            animation: mounted ? 'fadeIn 0.8s ease-out 1s both' : 'none'
          }}
        >
          <GameHistory events={events} />
        </div>
      </div>


    </div>
  );
}
