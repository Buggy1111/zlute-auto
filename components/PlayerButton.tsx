'use client';

import { Player } from '@/types/game';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlayerButtonProps {
  player: Player;
  onClick: () => void;
  disabled?: boolean;
}

export default function PlayerButton({
  player,
  onClick,
  disabled = false,
}: PlayerButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Přidat bod pro hráče ${player.name}. Aktuální skóre: ${player.score} ${player.score === 1 ? 'bod' : player.score < 5 ? 'body' : 'bodů'}`}
      aria-describedby={`player-${player.id}-score`}
      className="relative w-full group overflow-hidden"
      style={{ minHeight: '140px' }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 group-active:opacity-50 blur-2xl transition-all duration-300"
        style={{ backgroundColor: player.color }}
      />

      {/* Main button */}
      <div
        className="relative h-full rounded-3xl border-4 p-6 transition-all transform group-hover:scale-105 group-active:scale-98 shadow-2xl group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
          borderColor: player.color,
        }}
      >
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${player.color} 0%, transparent 50%, ${player.color} 100%)`,
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
          }}
        />

        {/* Shine effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-left flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-4 h-4 rounded-full animate-pulse"
                style={{ backgroundColor: player.color, boxShadow: `0 0 20px ${player.color}` }}
              />
              <h3 className="text-3xl font-black text-gray-800 drop-shadow-sm">
                {player.name}
              </h3>
            </div>
            <p className="text-gray-600 font-bold text-sm flex items-center gap-2">
              <span className="text-xl">👆</span>
              Klikni pro +1 bod
            </p>
          </div>

          {/* Score display */}
          <div className="text-right">
            <div
              id={`player-${player.id}-score`}
              className="text-6xl font-black transition-all duration-300 group-hover:scale-110"
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
            <div className="sr-only">
              Skóre hráče {player.name}: {player.score} {player.score === 1 ? 'bod' : player.score < 5 ? 'body' : 'bodů'}
            </div>
          </div>
        </div>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              backgroundColor: player.color,
              transform: 'translate(-50%, -50%)',
              opacity: 0.6,
            }}
          />
        ))}

        {/* Corner decorations */}
        <div
          className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-20"
          style={{ backgroundColor: player.color }}
        />
        <div
          className="absolute bottom-2 left-2 w-6 h-6 rounded-full opacity-10"
          style={{ backgroundColor: player.color }}
        />
      </div>
    </motion.button>
  );
}
