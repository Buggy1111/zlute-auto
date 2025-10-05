'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, Share2, Plus, Coffee, BookOpen, Info, BarChart3, MapPin } from 'lucide-react';
import PlayerStats from './PlayerStats';
import NavigationModal from './NavigationModal';

interface GameMenuProps {
  onNewGame: () => void;
  onShare: () => void;
  onEndGame?: () => void;
  gameStatus?: 'playing' | 'finished';
}

export default function GameMenu({ onNewGame, onShare }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed safe-top right-4 z-50 w-12 h-12 card flex items-center justify-center hover:border-accent transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-accent" />
        ) : (
          <Menu className="w-6 h-6 text-accent" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-surface border-l border-line z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold neon-text mb-4 sm:mb-6">Menu</h2>

          <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
            {/* About */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">O hře</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Proč vznikla</p>
                </div>
              </div>
            </button>

            {/* How to Play */}
            <button
              onClick={() => setShowHowToPlay(true)}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Jak hrát</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Pravidla a mechaniky</p>
                </div>
              </div>
            </button>

            {/* New Game */}
            <button
              onClick={() => {
                onNewGame();
                setIsOpen(false);
              }}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Nová hra</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Začít znovu</p>
                </div>
              </div>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                onShare();
                setIsOpen(false);
              }}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Sdílet hru</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Pošli link kamarádům</p>
                </div>
              </div>
            </button>

            {/* Stats */}
            <button
              onClick={() => setShowStats(true)}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Moje statistiky</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Tvoje herní výsledky</p>
                </div>
              </div>
            </button>

            {/* Navigation */}
            <button
              onClick={() => setShowNavigation(true)}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Navigace</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Otevři mapy a hraj dál</p>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-line my-2 sm:my-3"></div>

            {/* Support */}
            <button
              onClick={() => setShowSupport(true)}
              className="w-full card p-3 sm:p-4 hover:border-accent transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm sm:text-base">Podpoř vývojáře</h3>
                  <p className="text-xs sm:text-sm text-text-dim">Pomoz mi tvořit další projekty</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-auto pt-4 sm:pt-6 border-t border-line">
            <p className="text-center text-xs text-text-muted">
              Žluté Auto v1.0
              <br />
              <span className="text-accent">Made with 💛</span>
            </p>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => setShowAbout(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold neon-text">O hře</h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="text-text-muted hover:text-text"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    💡 Proč tahle hra vznikla?
                  </h3>
                  <div className="space-y-3 text-text-dim">
                    <p>
                      Tuto hru jsem vytvořil, protože jsem chtěl mít jednoduchou
                      a zábavnou aplikaci, kterou si můžu hrát s kamarády nebo
                      rodinou během dlouhých cest autem.
                    </p>
                    <p>
                      Hra &ldquo;Žluté Auto&rdquo; je klasická roadtrip hra -
                      kdo první uvidí žluté auto na silnici, klikne na své jméno
                      a získá bod.
                    </p>
                    <p>
                      Aplikace je postavená na moderních technologiích (Next.js,
                      React, Firebase) s real-time synchronizací.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    🎯 Jak to funguje?
                  </h3>
                  <ul className="space-y-2 text-text-dim">
                    <li>1️⃣ Vytvoř novou hru a pozvi kamarády pomocí odkazu</li>
                    <li>2️⃣ Sledujte silnici a hledejte žlutá auta</li>
                    <li>3️⃣ Kdo první vidí žluté auto, klikne na své jméno</li>
                    <li>4️⃣ Vítězí hráč s nejvíce body na konci cesty!</li>
                  </ul>
                </div>

                <div className="p-4 bg-danger/20 border border-danger rounded-lg">
                  <h3 className="text-xl font-bold text-danger mb-3">
                    ⚠️ DŮLEŽITÉ - Bezpečnost především!
                  </h3>
                  <div className="space-y-2 text-text">
                    <p className="font-bold">
                      🚗 Vždy dávejte pozor na cestu a sledujte provoz!
                    </p>
                    <p className="text-text-dim">
                      Tato hra je určena hlavně pro spolujezdce. Pokud řídíte,
                      soustřeďte se pouze na bezpečné řízení.
                    </p>
                    <p className="text-accent text-center pt-2">
                      Přejeme příjemnou jízdu! 🛣️✨
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    💬 Máš nápad nebo feedback?
                  </h3>
                  <p className="text-text-dim mb-4">
                    Pokud máš nápady na vylepšení nebo našel jsi chybu, neváhej
                    mi napsat!
                  </p>
                  <a
                    href="https://wa.me/420605954429"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-success text-bg rounded-lg font-bold hover:bg-success/90 transition-colors"
                  >
                    <span className="text-2xl">📱</span>
                    <div className="text-left">
                      <div>WhatsApp</div>
                      <div className="text-sm opacity-90">605 954 429</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => setShowHowToPlay(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold neon-text">Jak hrát</h2>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-text-muted hover:text-text"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    🎯 Základní pravidla
                  </h3>
                  <ul className="space-y-2 text-text-dim">
                    <li>1️⃣ Sledujte silnici a hledejte žlutá auta</li>
                    <li>2️⃣ Když vidíš žluté auto, klikni na své tlačítko</li>
                    <li>3️⃣ Za každé žluté auto získáš 1 bod</li>
                    <li>4️⃣ Vyhrává hráč s nejvíce body na konci hry</li>
                  </ul>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    ⚡ Challenge systém
                  </h3>
                  <div className="space-y-3 text-text-dim">
                    <p>
                      <strong className="text-text">Není si jistý, že auto bylo žluté?</strong>
                    </p>
                    <p>
                      Po každém bodu se zobrazí <strong className="text-accent">5sekundové okno</strong>,
                      kdy můžeš stisknout tlačítko &ldquo;Challenge!&rdquo;
                    </p>
                    <p>
                      Otevře se <strong className="text-text">hlasování na 10 sekund</strong>,
                      kde všichni hráči hlasují, zda auto bylo opravdu žluté.
                    </p>
                    <p className="text-success">
                      ✓ Většina řekne ANO → Bod zůstává
                    </p>
                    <p className="text-danger">
                      ✗ Většina řekne NE → Bod se odebere
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    ⭐ Hodnocení hráčů
                  </h3>
                  <div className="space-y-3 text-text-dim">
                    <p>
                      Po skončení hry můžeš ohodnotit spoluhráče hvězdičkami (1-5).
                    </p>
                    <p>
                      Hodnocení je <strong className="text-text">anonymní</strong> a
                      pomáhá zjistit, kdo hrál férově.
                    </p>
                    <p className="text-accent">
                      Průměrné hodnocení se zobrazí ve výsledkové tabulce.
                    </p>
                    <div className="mt-3 pt-3 border-t border-line">
                      <p className="font-bold text-text mb-2">Hodnocení:</p>
                      <ul className="space-y-1 text-sm">
                        <li>⭐⭐⭐⭐⭐ (5) - Výborný!</li>
                        <li>⭐⭐⭐⭐ (4) - Dobrý</li>
                        <li>⭐⭐⭐ (3) - OK</li>
                        <li>⭐⭐ (2) - Slabší</li>
                        <li>⭐ (1) - Nefér</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    🏆 Achievementy
                  </h3>
                  <ul className="space-y-2 text-text-dim">
                    <li>⭐ <strong>1 bod</strong> - První bod!</li>
                    <li>⭐ <strong>3 body</strong> - Jede to!</li>
                    <li>🔥 <strong>5 bodů</strong> - Bomba!</li>
                    <li>💎 <strong>10 bodů</strong> - Šampion!</li>
                    <li>👑 <strong>15 bodů</strong> - Legenda!</li>
                    <li>🏆 <strong>20 bodů</strong> - Mistr světa!</li>
                  </ul>
                </div>

                <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                  <h3 className="text-xl font-bold text-text mb-3">
                    💡 Tipy pro fér hru
                  </h3>
                  <ul className="space-y-2 text-text-dim">
                    <li>• Nezbytně žluté = platí (ne oranžové, ne zelenkavé)</li>
                    <li>• Taxi počítá, pokud je žluté</li>
                    <li>• Když si nejsi jistý, radši to neber</li>
                    <li>• Používej Challenge systém při pochybnostech</li>
                    <li>• Hraj fér a bav se! 🎮✨</li>
                  </ul>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={() => setShowSupport(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold neon-text">Děkuji za podporu!</h2>
                <button
                  onClick={() => setShowSupport(false)}
                  className="text-text-muted hover:text-text"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-surface-elevated rounded-lg">
                  <h3 className="text-lg font-bold text-text mb-3">
                    💛 Líbí se ti Žluté Auto?
                  </h3>
                  <div className="space-y-3 text-text-dim">
                    <p>
                      Tato hra je úplně <strong>zdarma</strong> a vždycky bude!
                    </p>
                    <p>
                      Pokud ti udělala radost, můžeš mi poslat malý příspěvek
                      a podpořit další vývoj (nebo benzín do žlutého Porsche 😄).
                    </p>
                    <p>Každá koruna mě motivuje tvořit další skvělé projekty!</p>
                  </div>
                </div>

                <div className="p-6 bg-surface-elevated border-2 border-accent/30 rounded-lg">
                  <h3 className="text-lg font-bold text-text mb-4 text-center">
                    📱 Naskenuj QR kód
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="w-64 h-64 bg-bg rounded-lg border-2 border-line flex items-center justify-center overflow-hidden">
                      <Image
                        src="/QR.jpg"
                        alt="QR kód pro platbu"
                        width={256}
                        height={256}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-text-dim">
                      Číslo účtu:{' '}
                      <span className="text-accent">5934865043/0800</span>
                    </p>
                    <p className="text-xs text-text-muted mt-2">
                      Michal Bürgermeister
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-text font-bold">Děkuji za podporu! 🙏✨</p>
                  <p className="text-sm text-text-dim mt-2">
                    Díky tobě můžu tvořit další cool projekty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats Modal */}
      {showStats && <PlayerStats onClose={() => setShowStats(false)} />}

      {/* Navigation Modal */}
      {showNavigation && <NavigationModal onClose={() => setShowNavigation(false)} />}
    </>
  );
}
