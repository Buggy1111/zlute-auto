'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from '@/lib/game';
import GameMenu from '@/components/GameMenu';
import { Car } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const sanitized = name.slice(0, 20).replace(/[<>]/g, '').trim();
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
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );

      const gameId = (await Promise.race([
        createGame(validNames),
        timeoutPromise,
      ])) as string;

      router.push(`/game/${gameId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
      setError(`Chyba: ${errorMessage}. Zkontrolujte připojení.`);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Žluté Auto - Hra',
          text: 'Pojď hrát Žluté Auto! 🚗💨',
          url: url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('✅ Link zkopírován do schránky!');
    }
  };

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-bg">
      <GameMenu onNewGame={handleNewGame} onShare={handleShare} />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <Car className="w-24 h-24 text-accent neon-glow-strong" strokeWidth={1.5} />
          </div>

          <h1 className="neon-text mb-4">Žluté Auto</h1>

          <div className="card p-5">
            <p className="text-text text-lg font-bold mb-1">
              Kdo první vidí žluté auto?
            </p>
            <p className="text-text-dim text-sm">Získej bod a staň se šampionem!</p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold text-text mb-6">Hráči</h2>

          <div className="space-y-4 mb-6">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder={`Jméno hráče ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  maxLength={20}
                  className="flex-1 px-4 py-3 bg-surface-elevated border border-line rounded-lg text-text focus:border-accent focus:outline-none transition-colors"
                  disabled={loading}
                />
                {playerNames.length > 2 && (
                  <button
                    onClick={() => handleRemovePlayer(index)}
                    className="px-4 py-3 bg-danger/20 border border-danger text-danger rounded-lg hover:bg-danger/30 transition-colors"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {playerNames.length < 8 && (
            <button
              onClick={handleAddPlayer}
              className="w-full py-3 mb-5 bg-surface-elevated border border-line rounded-lg text-text-dim hover:border-accent hover:text-accent transition-colors"
              disabled={loading}
            >
              + Přidat hráče
            </button>
          )}

          {error && (
            <div className="mb-5 p-4 bg-danger/20 border border-danger text-danger rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={loading}
            className="w-full py-4 bg-accent text-bg rounded-lg font-bold text-lg neon-border hover:bg-accent-hover transition-all disabled:opacity-50"
          >
            {loading ? 'Vytváření hry...' : 'ZAČÍT HRÁT'}
          </button>
        </div>

        {/* SEO Content */}
        <div className="space-y-6 text-text-dim">
          <div className="card p-6">
            <h2 className="text-xl font-bold neon-text mb-3">🚗 Co je Žluté Auto?</h2>
            <p className="leading-relaxed">
              <strong>Žluté Auto</strong> je tradiční česká{' '}
              <strong>hra na cesty</strong>, kterou si milují rodiny po celé
              České republice. Naše <strong>online multiplayer aplikace</strong>{' '}
              přináší tuto oblíbenou <strong>roadtrip hru</strong> do 21. století s
              real-time bodováním.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold neon-text mb-3">🎮 Jak hrát?</h2>
            <ul className="space-y-2">
              <li>✅ <strong>Real-time bodování</strong></li>
              <li>✅ <strong>Žádná instalace</strong></li>
              <li>✅ <strong>Multiplayer až pro 8 hráčů</strong></li>
              <li>✅ <strong>Historie všech událostí</strong></li>
              <li>✅ <strong>Achievement systém</strong></li>
              <li>✅ <strong>Zvukové efekty</strong></li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold neon-text mb-3">
              🏆 Proč hrát online?
            </h2>
            <p className="leading-relaxed">
              Naše <strong>česká aplikace</strong> je{' '}
              <strong>první a jediná</strong> online verze této populární{' '}
              <strong>hry do auta</strong>. Férové bodování s historií, ochrana
              proti spamování a profesionální herní zážitek.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold neon-text mb-3">
              📱 Česká roadtrip hra zdarma
            </h2>
            <p className="leading-relaxed">
              <strong>Hra žluté auto</strong> je legendární{' '}
              <strong>cestovní hra</strong>. S naší aplikací můžete{' '}
              <strong>hrát Žluté Auto online</strong> s automatickým počítáním
              bodů, live žebříčkem a <strong>multiplayer funkcí zdarma</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
