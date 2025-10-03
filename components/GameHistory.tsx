'use client';

import { GameEvent } from '@/types/game';
import { Car, Clock } from 'lucide-react';

interface GameHistoryProps {
  events: GameEvent[];
}

export default function GameHistory({ events }: GameHistoryProps) {
  if (events.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-bold text-text mb-4">Historie</h2>
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <p className="text-text-dim">Zatím žádné žluté auto nebylo viděno...</p>
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

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold neon-text">Historie</h2>
        <p className="text-text-dim text-sm">{events.length} záznamů</p>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 bg-surface border border-line rounded-lg hover:border-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-accent neon-glow" />
                <div>
                  <p className="font-bold text-text">{event.playerName}</p>
                  <p className="text-sm text-text-dim">viděl žluté auto</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Clock className="w-4 h-4" />
                {formatTime(event.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div className="mt-4 p-3 bg-surface-elevated rounded-lg text-center">
          <p className="text-sm text-text-dim">
            Celkem viděno:{' '}
            <span className="text-accent font-bold">{events.length}</span> žlutých
            aut
          </p>
        </div>
      )}
    </div>
  );
}
