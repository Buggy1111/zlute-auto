'use client';

import { GameEvent } from '@/types/game';
import { useEffect, useState } from 'react';

interface GameHistoryProps {
  events: GameEvent[];
}

export default function GameHistory({ events }: GameHistoryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (events.length === 0) {
    return (
      <div className="glass-strong rounded-3xl shadow-xl p-6 border-2 border-white/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-transparent" />

        <div className="relative z-10">
          <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
            📜 Historie
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-30 animate-pulse">🚗</div>
            <p className="text-gray-500 font-semibold text-lg">
              Zatím žádné žluté auto nebylo viděno...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Buď první, kdo ho uvidí!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'před chvílí';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `před ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `před ${hours} h`;
  };

  return (
    <div className="glass-strong rounded-3xl shadow-xl p-6 border-2 border-white/40 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-primary/5 to-transparent animate-pulse-scale" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black gradient-text flex items-center gap-2">
              📜 Historie
            </h2>
            <p className="text-sm text-gray-600 font-semibold mt-1">
              {events.length} {events.length === 1 ? 'záznam' : events.length < 5 ? 'záznamy' : 'záznamů'}
            </p>
          </div>
          <div className="text-4xl animate-bounce">🚗💨</div>
        </div>

        {/* Events list */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="group relative overflow-hidden transition-all hover:scale-102"
              style={{
                animation: mounted ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
              }}
            >
              {/* Card */}
              <div className="glass rounded-2xl p-4 border border-white/40 hover:glass-strong transition-all shadow-lg hover:shadow-xl">
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className="relative">
                      <div className="text-3xl animate-bounce">🚗</div>
                      <div className="absolute inset-0 blur-xl bg-yellow-primary opacity-30" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-lg">
                        {event.playerName}
                      </p>
                      <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                        <span>✨</span>
                        viděl žluté auto
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-bold">
                      {formatTime(event.timestamp)}
                    </div>
                    <div className="text-xs text-yellow-dark font-semibold mt-1">
                      {getTimeAgo(event.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-primary to-yellow-secondary rounded-full"
                    style={{
                      width: '100%',
                      animation: 'progress 0.5s ease-out',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {events.length > 0 && (
          <div className="mt-4 glass rounded-xl p-3 text-center border border-white/30">
            <p className="text-sm font-bold text-gray-700">
              🎯 Celkem viděno: <span className="text-yellow-dark text-lg">{events.length}</span> žlutých aut
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
