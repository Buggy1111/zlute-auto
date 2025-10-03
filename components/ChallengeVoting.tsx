'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Users } from 'lucide-react';
import type { Challenge, Player } from '@/types/game';

interface ChallengeVotingProps {
  challenge: Challenge;
  players: Record<string, Player>;
  currentPlayerId: string;
  onVote: (vote: 'yes' | 'no') => void;
  votingDuration?: number; // ms
}

export default function ChallengeVoting({
  challenge,
  players,
  currentPlayerId,
  onVote,
  votingDuration = 10000,
}: ChallengeVotingProps) {
  const [timeLeft, setTimeLeft] = useState(votingDuration / 1000);
  const [hasVoted, setHasVoted] = useState(false);

  const player = players[challenge.playerId];
  const challenger = players[challenge.challengedBy];
  const hasCurrentPlayerVoted = currentPlayerId in challenge.votes;

  useEffect(() => {
    setHasVoted(hasCurrentPlayerVoted);
  }, [hasCurrentPlayerVoted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleVote = (vote: 'yes' | 'no') => {
    setHasVoted(true);
    onVote(vote);
  };

  const yesVotes = Object.values(challenge.votes).filter(v => v === 'yes').length;
  const noVotes = Object.values(challenge.votes).filter(v => v === 'no').length;
  const totalPlayers = Object.keys(players).length;
  const totalVotes = yesVotes + noVotes;
  const progress = (timeLeft / (votingDuration / 1000)) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card p-8 max-w-lg w-full border-2 border-accent"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <AlertTriangle className="w-16 h-16 text-accent neon-glow-strong mx-auto mb-4" />
            <h2 className="text-3xl font-bold neon-text mb-2">Challenge!</h2>
            <p className="text-text-dim">Bylo auto opravdu žluté?</p>
          </div>

          {/* Dispute */}
          <div className="card p-4 bg-surface-elevated mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center flex-1">
                <p className="text-sm text-text-dim mb-1">Viděl auto</p>
                <p className="font-bold text-lg" style={{ color: player?.color }}>
                  {challenge.playerName}
                </p>
                <p className="text-sm text-success">✓ Žluté</p>
              </div>
              <div className="text-4xl text-text-muted">VS</div>
              <div className="text-center flex-1">
                <p className="text-sm text-text-dim mb-1">Challenge</p>
                <p className="font-bold text-lg" style={{ color: challenger?.color }}>
                  {challenge.challengedByName}
                </p>
                <p className="text-sm text-danger">✗ Nebylo</p>
              </div>
            </div>
          </div>

          {/* Voting */}
          {!hasVoted ? (
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleVote('yes')}
                className="w-full py-4 bg-success/20 border-2 border-success text-success rounded-lg font-bold text-xl hover:bg-success/30 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                Ano, bylo žluté
              </button>
              <button
                onClick={() => handleVote('no')}
                className="w-full py-4 bg-danger/20 border-2 border-danger text-danger rounded-lg font-bold text-xl hover:bg-danger/30 transition-all flex items-center justify-center gap-3"
              >
                <XCircle className="w-6 h-6" />
                Ne, nebylo žluté
              </button>
            </div>
          ) : (
            <div className="card p-4 bg-accent/10 border border-accent mb-6 text-center">
              <p className="font-bold text-accent">✓ Tvůj hlas byl zaznamenán</p>
              <p className="text-sm text-text-dim mt-1">Čeká se na ostatní...</p>
            </div>
          )}

          {/* Vote counts */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-text">Žluté</span>
              </div>
              <span className="font-bold text-success">{yesVotes} hlasů</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-danger" />
                <span className="text-text">Nebylo žluté</span>
              </div>
              <span className="font-bold text-danger">{noVotes} hlasů</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-line">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-text-dim" />
                <span className="text-text-dim">Hlasovalo</span>
              </div>
              <span className="font-bold text-text">{totalVotes}/{totalPlayers}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="h-2 bg-line rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-accent transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-text-muted">
            ⏱️ Zbývá {timeLeft.toFixed(1)}s
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
