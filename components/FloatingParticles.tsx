'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  glowIntensity: number;
}

interface LightBeam {
  id: number;
  x: number;
  rotation: number;
  opacity: number;
  duration: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lightBeams, setLightBeams] = useState<LightBeam[]>([]);

  useEffect(() => {
    const emojis = ['🚗', '⭐', '💛', '✨', '🏆', '⚡'];
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 20,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      glowIntensity: 0.3 + Math.random() * 0.4,
    }));
    setParticles(newParticles);

    // Create ambient light beams
    const newBeams: LightBeam[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      rotation: -45 + Math.random() * 90,
      opacity: 0.03 + Math.random() * 0.05,
      duration: 15 + Math.random() * 10,
    }));
    setLightBeams(newBeams);
  }, []);

  return (
    <>
      {/* Ambient light beams */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {lightBeams.map((beam) => (
          <motion.div
            key={`beam-${beam.id}`}
            className="absolute -top-1/2 w-1 h-[200vh]"
            style={{
              left: `${beam.x}%`,
              background: `linear-gradient(180deg,
                rgba(255, 215, 0, 0) 0%,
                rgba(255, 215, 0, ${beam.opacity}) 30%,
                rgba(255, 165, 0, ${beam.opacity * 0.8}) 50%,
                rgba(255, 215, 0, ${beam.opacity}) 70%,
                rgba(255, 215, 0, 0) 100%)`,
              filter: 'blur(40px)',
              transformOrigin: 'top center',
              rotate: `${beam.rotation}deg`,
            }}
            animate={{
              opacity: [beam.opacity * 0.5, beam.opacity, beam.opacity * 0.5],
              scaleY: [1, 1.1, 1],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating particles with ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          >
            {/* Ambient glow around particle */}
            <motion.div
              className="absolute inset-0"
              style={{
                width: `${particle.size * 2}px`,
                height: `${particle.size * 2}px`,
                marginLeft: `${-particle.size / 2}px`,
                marginTop: `${-particle.size / 2}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(255, 215, 0, ${particle.glowIntensity}) 0%, transparent 70%)`,
                filter: 'blur(15px)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [particle.glowIntensity * 0.5, particle.glowIntensity, particle.glowIntensity * 0.5],
              }}
              transition={{
                duration: particle.duration * 0.7,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Particle emoji */}
            <motion.div
              style={{
                fontSize: `${particle.size}px`,
                filter: particle.emoji === '🚗' ? 'sepia(100%) saturate(400%) brightness(100%) hue-rotate(-10deg)' : 'none',
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {particle.emoji}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
