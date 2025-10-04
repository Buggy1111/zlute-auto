'use client';

import { X, MapPin, Navigation as NavigationIcon, Smartphone } from 'lucide-react';

interface NavigationModalProps {
  onClose: () => void;
}

const NAVIGATION_APPS = [
  {
    name: 'Google Maps',
    icon: '🗺️',
    url: 'https://www.google.com/maps',
    color: '#4285F4',
  },
  {
    name: 'Waze',
    icon: '🚗',
    url: 'https://www.waze.com/live-map',
    color: '#33CCFF',
  },
  {
    name: 'Mapy.cz',
    icon: '🇨🇿',
    url: 'https://mapy.cz',
    color: '#FF6B35',
  },
  {
    name: 'Apple Maps',
    icon: '🍎',
    url: 'https://maps.apple.com',
    color: '#007AFF',
  },
];

export default function NavigationModal({ onClose }: NavigationModalProps) {
  const handleNavigationClick = (url: string) => {
    // Open navigation in new tab/window
    window.open(url, '_blank', 'noopener,noreferrer');

    // Show instructions after short delay
    setTimeout(() => {
      // Keep modal open to show instructions
    }, 100);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="card p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-7 h-7 text-accent neon-glow" />
              <h2 className="text-2xl sm:text-3xl font-bold neon-text">Navigace</h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text transition-colors"
              aria-label="Zavřít"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Apps */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <NavigationIcon className="w-5 h-5 text-accent" />
              Vyber si navigaci:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NAVIGATION_APPS.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleNavigationClick(app.url)}
                  className="p-4 bg-surface-elevated border border-line rounded-lg hover:border-accent transition-all hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{app.icon}</span>
                    <div className="text-left">
                      <p className="font-bold text-text">{app.name}</p>
                      <p className="text-xs text-text-dim">Otevřít navigaci</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            {/* Android Instructions */}
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-success">📱 Android</h3>
              </div>
              <ol className="space-y-2 text-sm text-text-dim ml-8">
                <li className="flex gap-2">
                  <span className="text-success font-bold">1.</span>
                  <span>Otevře se navigace v nové kartě</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-success font-bold">2.</span>
                  <span>Stiskni tlačítko <strong className="text-text">&ldquo;Poslední aplikace&rdquo;</strong> (čtverec)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-success font-bold">3.</span>
                  <span>Klikni na ikonu hry nahoře a vyber <strong className="text-text">&ldquo;Rozdělená obrazovka&rdquo;</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-success font-bold">4.</span>
                  <span>Navigace nahoře 🗺️, hra dole 🎮</span>
                </li>
              </ol>
            </div>

            {/* iOS Instructions */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-accent">📱 iPhone/iPad</h3>
              </div>
              <ol className="space-y-2 text-sm text-text-dim ml-8">
                <li className="flex gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span>Otevře se navigace v nové kartě</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span>Přejeď zpět do hry (swipe zespodu)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span>Hra běží na pozadí - <strong className="text-text">všechny body se ukládají!</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">4.</span>
                  <span>Přepínej mezi navigací a hrou dle potřeby</span>
                </li>
              </ol>
            </div>

            {/* Background Info */}
            <div className="p-4 bg-surface-elevated rounded-lg border border-line">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse mt-2 flex-shrink-0"></div>
                <div className="space-y-2">
                  <p className="font-bold text-text">
                    ✅ Hra běží na pozadí
                  </p>
                  <p className="text-sm text-text-dim">
                    I když nevidíš hru, všechny body se <strong className="text-text">automaticky synchronizují</strong> přes Firebase.
                    Můžeš klidně přepínat mezi navigací a hrou - nic se neztratí!
                  </p>
                </div>
              </div>
            </div>

            {/* Wake Lock Info */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div className="space-y-2">
                  <p className="font-bold text-text">
                    Tip: Obrazovka nezhasne
                  </p>
                  <p className="text-sm text-text-dim">
                    Hra automaticky udržuje obrazovku zapnutou, takže se ti nemusíš bát,
                    že by ti telefon zhasl během hry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-6 p-4 bg-accent text-bg rounded-lg font-bold hover:bg-accent/90 transition-colors"
          >
            Rozumím, zavřít
          </button>
        </div>
      </div>
    </>
  );
}
