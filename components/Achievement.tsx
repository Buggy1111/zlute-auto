'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Gem, Crown, Award } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AchievementProps {
  score: number;
  playerName: string;
}

interface Achievement {
  score: number;
  title: string;
  icon: LucideIcon;
  message: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { score: 1, title: 'První bod!', icon: Star, message: 'Výborný začátek!' },
  { score: 5, title: '5 bodů!', icon: Star, message: 'Jede to!' },
  { score: 10, title: '10 bodů!', icon: Flame, message: 'Bomba!' },
  { score: 20, title: '20 bodů!', icon: Gem, message: 'Šampion!' },
  { score: 50, title: '50 bodů!', icon: Crown, message: 'Legenda!' },
  { score: 100, title: '100 bodů!', icon: Trophy, message: 'Mistr světa!' },
];

export default function Achievement({ score, playerName }: AchievementProps) {
  const [show, setShow] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const unlocked = ACHIEVEMENTS.find((a) => a.score === score);
    if (unlocked) {
      setAchievement(unlocked);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
  }, [score]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="card p-8 max-w-sm mx-4 border-accent neon-border pointer-events-auto"
          >
            {/* Icon */}
            <achievement.icon
              className="w-20 h-20 text-accent neon-glow-strong mx-auto mb-4"
              strokeWidth={1.5}
            />

            {/* Title */}
            <h2 className="text-3xl font-bold text-center neon-text mb-2">
              {achievement.title}
            </h2>

            {/* Player */}
            <p className="text-xl text-center text-text mb-2">{playerName}</p>

            {/* Message */}
            <p className="text-lg text-center text-text-dim">
              {achievement.message}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
