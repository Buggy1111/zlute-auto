'use client';

import { useState } from 'react';

interface GameMenuProps {
  onNewGame: () => void;
  onShare: () => void;
}

export default function GameMenu({ onNewGame, onShare }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

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

            {/* Support Developer */}
            <button
              onClick={() => setShowSupport(true)}
              className="w-full p-4 glass-strong rounded-2xl border-2 border-yellow-primary/30 hover:border-yellow-primary transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ☕
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg">Podpoř vývojáře</h3>
                  <p className="text-sm text-gray-600 font-semibold">Kup mi kávu! 💛</p>
                </div>
              </div>
            </button>

            {/* About Game */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-full p-4 glass-strong rounded-2xl border-2 border-yellow-primary/30 hover:border-yellow-primary transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg">O hře</h3>
                  <p className="text-sm text-gray-600 font-semibold">Proč vznikla</p>
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

      {/* About Modal */}
      {showAbout && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowAbout(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="glass-strong rounded-3xl border-2 border-yellow-primary/40 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto animate-[slideUp_0.3s_ease-out] custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">🚗💛</div>
                    <div>
                      <h2 className="text-4xl font-black gradient-text">O hře</h2>
                      <p className="text-gray-600 font-semibold">Žluté Auto</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAbout(false)}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-yellow-primary/20 transition-all"
                    aria-label="Zavřít"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 border border-yellow-primary/20">
                    <h3 className="text-2xl font-black text-gray-800 mb-3 flex items-center gap-2">
                      <span>💡</span> Proč tahle hra vznikla?
                    </h3>
                    <div className="space-y-3 text-gray-700 font-semibold">
                      <p>
                        Tuto hru jsem vytvořil, protože jsem chtěl mít jednoduchou a zábavnou aplikaci,
                        kterou si můžu hrát s kamarády nebo rodinou během dlouhých cest autem.
                      </p>
                      <p>
                        Hra &ldquo;Žluté Auto&rdquo; je klasická roadtrip hra - kdo první uvidí žluté auto na silnici,
                        klikne na své jméno a získá bod. Je to skvělý způsob, jak zabít čas během jízdy
                        a zároveň udržet všechny u vědomí a pozorné!
                      </p>
                      <p>
                        Aplikace je postavená na moderních technologiích (Next.js, React, Firebase)
                        s real-time synchronizací, takže všichni vidí body okamžitě.
                      </p>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-yellow-primary/20">
                    <h3 className="text-2xl font-black text-gray-800 mb-3 flex items-center gap-2">
                      <span>🎯</span> Jak to funguje?
                    </h3>
                    <ul className="space-y-2 text-gray-700 font-semibold">
                      <li className="flex items-start gap-3">
                        <span className="text-xl">1️⃣</span>
                        <span>Vytvoř novou hru a pozvi kamarády pomocí odkazu</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">2️⃣</span>
                        <span>Sledujte silnici a hledejte žlutá auta</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">3️⃣</span>
                        <span>Kdo první vidí žluté auto, klikne na své jméno</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">4️⃣</span>
                        <span>Vítězí hráč s nejvíce body na konci cesty!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass rounded-2xl p-6 border-2 border-red-500/30 bg-red-50/50">
                    <h3 className="text-2xl font-black text-red-700 mb-3 flex items-center gap-2">
                      <span>⚠️</span> DŮLEŽITÉ - Bezpečnost především!
                    </h3>
                    <div className="space-y-3 text-gray-800 font-bold">
                      <p className="text-lg">
                        🚗 Vždy dávejte pozor na cestu a sledujte provoz!
                      </p>
                      <p>
                        Tato hra je určena hlavně pro spolujezdce. Pokud řídíte,
                        soustřeďte se pouze na bezpečné řízení a nechte hru na ostatní.
                      </p>
                      <p className="text-yellow-dark text-xl text-center pt-2">
                        Přejeme příjemnou jízdu a hodně km bez nehod! 🛣️✨
                      </p>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-yellow-primary/20">
                    <h3 className="text-2xl font-black text-gray-800 mb-3 flex items-center gap-2">
                      <span>💬</span> Máš nápad nebo feedback?
                    </h3>
                    <div className="space-y-3 text-gray-700 font-semibold">
                      <p>
                        Pokud máš nápady na vylepšení, našel jsi chybu nebo jen chceš říct ahoj,
                        neváhej mi napsat!
                      </p>
                      <a
                        href="https://wa.me/420605954429"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <span className="text-3xl">📱</span>
                        <div className="text-left">
                          <div>WhatsApp</div>
                          <div className="text-sm font-semibold opacity-90">605 954 429</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-600 font-bold text-lg">
                      Užij si hru! 🎉
                    </p>
                    <p className="text-sm text-gray-500 font-semibold mt-2">
                      Made with 💛 for safe and fun road trips
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Support Modal */}
      {showSupport && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowSupport(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="glass-strong rounded-3xl border-2 border-yellow-primary/40 shadow-2xl max-w-lg w-full pointer-events-auto animate-[slideUp_0.3s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">☕💛</div>
                    <div>
                      <h2 className="text-4xl font-black gradient-text">Kup mi kávu!</h2>
                      <p className="text-gray-600 font-semibold">Podpoř vývojáře</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSupport(false)}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-yellow-primary/20 transition-all"
                    aria-label="Zavřít"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 border border-yellow-primary/20">
                    <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
                      <span>💛</span> Líbí se ti Žluté Auto?
                    </h3>
                    <div className="space-y-3 text-gray-700 font-semibold">
                      <p>
                        Tato hra je úplně <strong>zdarma</strong> a vždycky bude!
                      </p>
                      <p>
                        Pokud ti udělala radost, můžeš mi poslát malou odměnu na kávu
                        (nebo benzín do žlutého Porsche 😄).
                      </p>
                      <p>
                        Každá koruna mě motivuje tvořit další skvělé projekty!
                      </p>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="glass rounded-2xl p-6 border-2 border-yellow-primary/30 bg-white/50">
                    <h3 className="text-lg font-black text-gray-800 mb-4 text-center">
                      📱 Naskenuj QR kód a pošli libovolnou částku
                    </h3>
                    <div className="flex justify-center mb-4">
                      {/* Placeholder for QR code - you'll need to add your QR code image */}
                      <div className="w-64 h-64 bg-white rounded-2xl border-4 border-yellow-primary/20 flex items-center justify-center shadow-lg">
                        <div className="text-center p-4">
                          <p className="text-6xl mb-2">📱</p>
                          <p className="text-sm font-bold text-gray-600">
                            QR kód platby
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            (přidej obrázek do /public/qr-code.png)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-600">
                        Číslo účtu: <span className="text-yellow-dark">XXXX-XXXXXX/XXXX</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (nahraď svým číslem účtu)
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 font-bold text-lg">
                      Děkuji za podporu! 🙏✨
                    </p>
                    <p className="text-sm text-gray-500 font-semibold mt-2">
                      Díky tobě můžu tvořit další cool projekty
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
