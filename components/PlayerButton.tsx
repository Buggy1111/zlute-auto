'use client';

import { Player } from '@/types/game';
import { useState } from 'react';

interface PlayerButtonProps {
  player: Player;
  onClick: () => void;
  disabled?: boolean;
  hideScore?: boolean;
}

export default function PlayerButton({
  player,
  onClick,
  disabled = false,
  hideScore = false,
}: PlayerButtonProps) {
  const [showPulse, setShowPulse] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setShowPulse(true);
    setTimeout(() => {
      setShowPulse(false);
    }, 500);

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Přidat bod pro hráče ${player.name}`}
      className="w-full card p-6 hover:bg-surface-elevated transition-all active:scale-[0.98] disabled:opacity-50"
      style={{
        borderColor: player.color,
        boxShadow: showPulse
          ? `0 0 40px ${player.color}80`
          : `0 0 20px ${player.color}40`,
      }}
    >
      <div className={`flex items-center ${hideScore ? 'justify-center' : 'justify-between'}`}>
        {/* Player info */}
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: player.color,
              boxShadow: `0 0 10px ${player.color}`,
            }}
          />
          <h3 className="text-2xl font-bold text-text">{player.name}</h3>
        </div>

        {/* Score - hidden during playing */}
        {!hideScore && (
          <div className="text-right">
            <div
              className="text-4xl font-bold"
              style={{ color: player.color }}
            >
              {player.score}
            </div>
            <div className="text-xs text-text-muted font-bold mt-1">
              {player.score === 1 ? 'BOD' : player.score < 5 ? 'BODY' : 'BODŮ'}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
