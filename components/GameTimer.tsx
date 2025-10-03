'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  startedAt: number;
  finishedAt?: number;
}

export default function GameTimer({ startedAt, finishedAt }: GameTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (finishedAt) {
      setElapsed(finishedAt - startedAt);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, finishedAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-center gap-3">
        <Clock className="w-5 h-5 text-accent neon-glow" />
        <div className="text-center">
          <p className="text-sm text-text-dim mb-1">
            {finishedAt ? 'Celkový čas' : 'Hra trvá'}
          </p>
          <p className="text-3xl font-bold neon-text">{formatTime(elapsed)}</p>
        </div>
      </div>
    </div>
  );
}
