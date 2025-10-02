'use client';

import { useState } from 'react';

interface GameMenuProps {
  onNewGame: () => void;
  onShare: () => void;
}

export default function GameMenu({ onNewGame, onShare }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button - Fixed top right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 w-14 h-14 glass-strong rounded-full border-2 border-yellow-primary/40 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Menu"
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute left-0 top-1 h-0.5 w-6 bg-yellow-dark transition-all duration-300 ${
              isOpen ? 'rotate-45 top-3' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-3 h-0.5 w-6 bg-yellow-dark transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-5 h-0.5 w-6 bg-yellow-dark transition-all duration-300 ${
              isOpen ? '-rotate-45 top-3' : ''
            }`}
          />
        </div>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-br from-yellow-light to-white border-l-4 border-yellow-primary shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black gradient-text mb-2">Menu</h2>
            <p className="text-gray-600 font-semibold">Nastavení a možnosti</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-4 flex-1">
            {/* Share Game */}
            <button
              onClick={() => {
                onShare();
                setIsOpen(false);
              }}
              className="w-full p-4 glass-strong rounded-2xl border-2 border-yellow-primary/30 hover:border-yellow-primary transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📤
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg">Sdílet hru</h3>
                  <p className="text-sm text-gray-600 font-semibold">Pošli link kamarádům</p>
                </div>
              </div>
            </button>

            {/* New Game */}
            <button
              onClick={() => {
                onNewGame();
                setIsOpen(false);
              }}
              className="w-full p-4 glass-strong rounded-2xl border-2 border-yellow-primary/30 hover:border-yellow-primary transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg">Nová hra</h3>
                  <p className="text-sm text-gray-600 font-semibold">Začít znovu</p>
                </div>
              </div>
            </button>

            {/* Game Info */}
            <div className="p-4 glass rounded-2xl border border-white/40">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 mb-2">Jak hrát</h3>
                  <ul className="space-y-1 text-sm text-gray-600 font-semibold">
                    <li>👀 Sleduj silnici</li>
                    <li>🚗 Vidíš žluté auto?</li>
                    <li>👆 Klikni na své jméno</li>
                    <li>🏆 První s nejvíc body vyhrává!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 font-semibold">
              Žluté Auto v1.0
              <br />
              <span className="text-yellow-dark">Made with 💛</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
