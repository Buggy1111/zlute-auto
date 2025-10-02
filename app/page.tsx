'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createGame } from '@/lib/game';

export default function Home() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showCar, setShowCar] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Random car driving by
    const interval = setInterval(() => {
      setShowCar(true);
      setTimeout(() => setShowCar(false), 3000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAddPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    // Sanitize and validate input
    const sanitized = name
      .slice(0, 20) // Max 20 characters
      .replace(/[<>]/g, '') // Remove potential HTML
      .trim();

    const newNames = [...playerNames];
    newNames[index] = sanitized;
    setPlayerNames(newNames);
  };

  const handleStartGame = async () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');

    if (validNames.length < 2) {
      setError('Musíte zadat alespoň 2 hráče');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Game creation took too long')), 15000)
      );

      const gameId = await Promise.race([
        createGame(validNames),
        timeoutPromise
      ]) as string;

      router.push(`/game/${gameId}`);
    } catch (err: unknown) {
      console.error('❌ Failed to start game:', err);
      const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
      setError(`Chyba: ${errorMessage}. Zkontrolujte připojení k internetu.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated road lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute left-1/4 top-0 w-2 h-32 bg-yellow-dark animate-[road-line_2s_linear_infinite]" />
        <div className="absolute left-3/4 top-0 w-2 h-32 bg-yellow-dark animate-[road-line_2s_linear_infinite_0.5s]" />
        <div className="absolute left-1/2 top-0 w-3 h-40 bg-yellow-primary/50 animate-[road-line_1.5s_linear_infinite]" />
      </div>

      {/* Random driving yellow Porsche */}
      {showCar && (
        <div className="fixed top-1/3 left-0 w-full pointer-events-none z-50">
          <div className="animate-[car-drive_3s_linear]">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-primary/40 shadow-[0_0_50px_rgba(255,215,0,0.8)] bg-gradient-to-br from-yellow-light/30 to-transparent backdrop-blur-sm">
              <Image
                src="/porsche.webp"
                alt="Driving Porsche"
                width={160}
                height={160}
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating background elements */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 30}px`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s`,
              }}
            >
              {['🚗', '🚕', '🚙', '⭐', '✨', '💛'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header with premium animations */}
        <div className="text-center mb-12">
          {/* Floating Porsche with mega glow */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 blur-3xl bg-yellow-primary opacity-60 animate-pulse-scale" />
            <div className="absolute inset-0 blur-2xl bg-yellow-secondary opacity-40 animate-glow" />
            <div className="relative z-10 animate-float">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-primary/30 shadow-[0_0_60px_rgba(255,215,0,0.6)] bg-gradient-to-br from-yellow-light/20 to-transparent backdrop-blur-sm">
                <Image
                  src="/porsche.webp"
                  alt="Yellow Porsche"
                  width={192}
                  height={192}
                  priority
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </div>
          </div>

          {/* Premium gradient title with better effects */}
          <h1 className="text-7xl font-black mb-4 tracking-tight gradient-text drop-shadow-2xl animate-bounce-in">
            Žluté Auto
          </h1>

          {/* Enhanced subtitle */}
          <div className="glass-strong rounded-2xl p-5 mx-8 border-2 border-yellow-primary/30 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
            <p className="text-gray-800 text-xl font-black mb-1">
              Kdo první vidí žluté auto?
            </p>
            <p className="text-yellow-dark text-sm font-bold">
              🏆 Získej bod a staň se šampionem! 🏆
            </p>
          </div>
        </div>

        {/* Form with enhanced glassmorphism */}
        <div className="glass-strong rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 border-2 border-white/50 backdrop-blur-2xl relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-primary/10 via-transparent to-yellow-secondary/10 animate-pulse-scale" />

          {/* Premium header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black gradient-text">Hráči</h2>
            <div className="text-5xl animate-pulse drop-shadow-lg">👥</div>
          </div>

          <div className="relative z-10 space-y-4 mb-6">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="flex gap-3 transition-all duration-300 hover:scale-102"
                style={{
                  animation: mounted ? `slideIn 0.5s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <div className="relative flex-1 group">
                  {/* Player number badge */}
                  <div className="absolute -left-2 -top-2 w-8 h-8 bg-gradient-to-br from-yellow-primary to-yellow-secondary rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg z-10 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  {/* Input with premium styling */}
                  <input
                    type="text"
                    placeholder={`Zadej jméno hráče ${index + 1}`}
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    maxLength={20}
                    aria-label={`Jméno hráče ${index + 1}`}
                    className="w-full px-6 py-5 pl-10 rounded-2xl border-3 border-yellow-primary/40 bg-white/90 backdrop-blur-sm focus:border-yellow-primary focus:outline-none focus:ring-4 focus:ring-yellow-primary/30 text-lg font-bold transition-all placeholder:text-gray-400 shadow-xl hover:shadow-2xl"
                    disabled={loading}
                  />
                  {name.length >= 18 && (
                    <p className="text-xs text-yellow-dark mt-1 font-semibold">
                      Maximálně 20 znaků
                    </p>
                  )}

                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-primary/20 to-transparent group-hover:animate-shimmer" />
                  </div>
                </div>

                {playerNames.length > 2 && (
                  <button
                    onClick={() => handleRemovePlayer(index)}
                    className="px-6 py-5 bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white rounded-2xl hover:from-red-500 hover:to-red-700 transition-all font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-110 hover:rotate-3 active:scale-95"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add player button */}
          {playerNames.length < 6 && (
            <button
              onClick={handleAddPlayer}
              className="relative z-10 w-full py-5 mb-5 glass-strong rounded-2xl text-gray-800 hover:bg-white/60 transition-all font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-yellow-primary/30 overflow-hidden group"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-primary/0 via-yellow-primary/10 to-yellow-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                <span className="text-3xl group-hover:rotate-90 transition-transform">➕</span>
                Přidat hráče
              </span>
            </button>
          )}

          {/* Error message with shake animation */}
          {error && (
            <div className="relative z-10 mb-5 p-5 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white rounded-2xl text-center font-black text-lg shadow-2xl animate-[shake_0.5s_ease-in-out]">
              <span className="text-3xl mr-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Premium start button with mega effects */}
          <button
            onClick={handleStartGame}
            disabled={loading}
            className="relative z-10 w-full py-6 bg-gradient-to-r from-yellow-primary via-yellow-secondary to-yellow-dark text-white rounded-2xl font-black text-3xl shadow-[0_20px_60px_rgba(255,215,0,0.5)] hover:shadow-[0_30px_80px_rgba(255,215,0,0.7)] transform hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group border-2 border-yellow-light"
          >
            {/* Multiple animated layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-light/0 via-yellow-light/20 to-yellow-light/0 animate-pulse" />

            <span className="relative z-10 flex items-center justify-center gap-4">
              {loading ? (
                <>
                  <span className="animate-spin text-4xl">⚡</span>
                  Vytváření hry...
                  <span className="animate-spin text-4xl">⚡</span>
                </>
              ) : (
                <>
                  <span className="text-4xl group-hover:scale-125 transition-transform">🎮</span>
                  ZAČÍT HRÁT!
                  <span className="text-4xl animate-bounce group-hover:translate-x-2 transition-transform">🚗💨</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Enhanced footer */}
        <div className="text-center mt-8">
          <div className="glass-strong rounded-2xl p-5 shadow-2xl border-2 border-yellow-primary/30 backdrop-blur-xl">
            <p className="text-gray-700 font-black text-lg mb-2 gradient-text">
              ✨ Hra pro celou rodinu! ✨
            </p>
            <p className="text-gray-600 text-sm font-semibold">
              Sledujte silnici a buďte první, kdo uvidí žluté auto!
            </p>
          </div>
        </div>

        {/* SEO Content Section - Hidden but readable by search engines */}
        <div className="mt-12 space-y-6 text-gray-800">
          <div className="glass rounded-3xl p-6 border border-yellow-primary/20">
            <h2 className="text-2xl font-black gradient-text mb-3">
              🚗 Co je Žluté Auto?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Žluté Auto</strong> je tradiční česká <strong>hra na cesty</strong>, kterou si milují rodiny po celé České republice.
              Naše <strong>online multiplayer aplikace</strong> přináší tuto oblíbenou <strong>roadtrip hru</strong> do 21. století
              s real-time bodováním a synchronizací pro až <strong>6 hráčů současně</strong>.
            </p>
          </div>

          <div className="glass rounded-3xl p-6 border border-yellow-primary/20">
            <h2 className="text-2xl font-black gradient-text mb-3">
              🎮 Jak hrát online Žluté Auto?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Tato <strong>online hra zdarma</strong> je perfektní <strong>zábava do auta</strong> na dlouhé cesty.
              Jednoduše zadejte jména hráčů (2-6 osob), vytvořte hru a sdílejte link s cestujícími.
              Když někdo uvidí žluté auto na silnici, klikne na své jméno a získá bod!
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>✅ <strong>Real-time bodování</strong> - všichni vidí skóre okamžitě</li>
              <li>✅ <strong>Žádná instalace</strong> - hra běží v prohlížeči</li>
              <li>✅ <strong>Multiplayer až pro 6 hráčů</strong></li>
              <li>✅ <strong>Historie všech událostí</strong></li>
              <li>✅ <strong>Achievement systém</strong> (milníky: 1, 5, 10, 20, 50, 100 bodů)</li>
              <li>✅ <strong>Zvukové efekty</strong> pro lepší zážitek</li>
            </ul>
          </div>

          <div className="glass rounded-3xl p-6 border border-yellow-primary/20">
            <h2 className="text-2xl font-black gradient-text mb-3">
              🏆 Proč hrát Žluté Auto online?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Naše <strong>česká aplikace</strong> je <strong>první a jediná</strong> online verze této populární <strong>hry do auta</strong>.
              Na rozdíl od tradiční verze &ldquo;na slovo&rdquo;, nabízíme férové bodování s historií,
              ochranu proti spamování (2s cooldown) a profesionální herní zážitek. Perfektní pro <strong>rodinné cesty</strong>,
              <strong>výlety s přáteli</strong> nebo <strong>dlouhé cesty autem</strong> s dětmi.
            </p>
          </div>

          <div className="glass rounded-3xl p-6 border border-yellow-primary/20">
            <h2 className="text-2xl font-black gradient-text mb-3">
              📱 Žluté Auto - Česká roadtrip hra zdarma
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Hra žluté auto</strong> je legendární <strong>cestovní hra</strong>, kterou znají všichni Češi.
              Pravidla jsou jednoduchá: kdo první vidí žluté auto, dostane bod. S naší aplikací můžete
              <strong> hrát Žluté Auto online</strong> s automatickým počítáním bodů, live žebříčkem
              a <strong>multiplayer funkcí zdarma</strong>. Ideální <strong>hra pro děti</strong> i dospělé
              na dlouhé cesty po České republice i zahraničí.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
