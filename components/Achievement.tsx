'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementProps {
  score: number;
  playerName: string;
}

interface Achievement {
  score: number;
  title: string;
  emoji: string;
  message: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { score: 1, title: 'První bod!', emoji: '🎉', message: 'Výborný začátek!' },
  { score: 5, title: '5 bodů!', emoji: '⭐', message: 'Jede to!' },
  { score: 10, title: '10 bodů!', emoji: '🔥', message: 'Bomba!' },
  { score: 20, title: '20 bodů!', emoji: '💎', message: 'Šampion!' },
  { score: 50, title: '50 bodů!', emoji: '👑', message: 'Legenda!' },
  { score: 100, title: '100 bodů!', emoji: '🏆', message: 'Mistr světa!' },
];

export default function Achievement({ score, playerName }: AchievementProps) {
  const [show, setShow] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const unlocked = ACHIEVEMENTS.find((a) => a.score === score);
    if (unlocked) {
      setAchievement(unlocked);
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    }
  }, [score]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="pointer-events-auto"
          >
            <div className="glass-strong rounded-3xl p-8 border-4 border-yellow-primary shadow-[0_0_80px_rgba(255,215,0,0.8)] max-w-sm mx-4">
          {/* Emoji */}
          <motion.div
            className="text-8xl text-center mb-4"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
          >
            {achievement.emoji}
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl font-black text-center gradient-text mb-2">
            {achievement.title}
          </h2>

          {/* Player */}
          <p className="text-xl font-bold text-center text-gray-800 mb-2">
            {playerName}
          </p>

          {/* Message */}
          <p className="text-lg font-semibold text-center text-yellow-dark">
            {achievement.message}
          </p>

          {/* Confetti decoration */}
          <div className="flex justify-center gap-2 mt-4">
            {['🎊', '✨', '🎉', '✨', '🎊'].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
