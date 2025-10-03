'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ChallengeToastProps {
  playerName: string;
  playerColor: string;
  onChallenge: () => void;
  onClose: () => void;
  autoCloseDuration?: number; // ms
}

export default function ChallengeToast({
  playerName,
  playerColor,
  onChallenge,
  onClose,
  autoCloseDuration = 5000,
}: ChallengeToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(autoCloseDuration / 1000);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, autoCloseDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [autoCloseDuration, onClose]);

  const handleChallenge = () => {
    setIsVisible(false);
    setTimeout(() => {
      onChallenge();
      onClose();
    }, 300);
  };

  const handleAgree = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const progress = (timeLeft / (autoCloseDuration / 1000)) * 100;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="card px-6 py-4 border-2 border-accent max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            <p className="font-bold text-text">
              <span style={{ color: playerColor }}>{playerName}</span> viděl žluté auto
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-text-muted hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={handleAgree}
            className="flex-1 py-2 bg-success/20 border border-success text-success rounded-lg font-bold hover:bg-success/30 transition-colors"
          >
            ✓ Souhlasím
          </button>
          <button
            onClick={handleChallenge}
            className="flex-1 py-2 bg-danger/20 border border-danger text-danger rounded-lg font-bold hover:bg-danger/30 transition-colors flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Challenge!
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-muted text-center mt-1">
          {timeLeft.toFixed(1)}s
        </p>
      </div>
    </div>
  );
}
