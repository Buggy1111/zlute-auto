'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [wasHidden, setWasHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWasHidden(true);
      } else if (wasHidden) {
        // Page became visible again after being hidden
        setIsVisible(true);
        // Hide indicator after 3 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
          setWasHidden(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wasHidden]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="card p-4 border-success bg-success/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <div>
                <p className="font-bold text-success text-sm">
                  ✅ Hra běžela na pozadí
                </p>
                <p className="text-xs text-text-dim">
                  Všechny body byly uloženy
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
