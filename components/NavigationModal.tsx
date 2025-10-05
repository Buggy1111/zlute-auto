'use client';

import { X, MapPin, Navigation as NavigationIcon, Smartphone } from 'lucide-react';

interface NavigationModalProps {
  onClose: () => void;
}

const NAVIGATION_APPS = [
  {
    name: 'Google Maps',
    icon: '🗺️',
    // Universal link that works on both mobile and desktop
    // On mobile with Google Maps app: Opens the app directly
    // On mobile without app or desktop: Opens web version
    url: 'https://maps.google.com/',
    color: '#4285F4',
  },
  {
    name: 'Waze',
    icon: '🚗',
    // Waze deep link - opens Waze app if installed, otherwise web
    // waze:// protocol automatically opens the Waze app on mobile
    url: 'https://waze.com/ul',
    color: '#33CCFF',
  },
  {
    name: 'Mapy.cz',
    icon: '🇨🇿',
    // Mapy.cz universal link
    url: 'https://mapy.cz',
    color: '#FF6B35',
  },
  {
    name: 'Apple Maps',
    icon: '🍎',
    // Apple Maps universal link - opens Maps app on iOS/macOS
    // Falls back to web on other platforms
    url: 'https://maps.apple.com/',
    color: '#007AFF',
  },
];

export default function NavigationModal({ onClose }: NavigationModalProps) {
  const handleNavigationClick = (url: string) => {
    // For mobile devices, try to open the app directly using window.location
    // This works better for deep links than window.open
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, use window.location for better deep link support
      // This allows the OS to intercept and open the native app
      window.location.href = url;
    } else {
      // On desktop, open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Close modal after short delay to let the user see the app opening
    setTimeout(() => {
      onClose();
    }, 500);
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
                      <p className="text-xs text-text-dim">Otevřít aplikaci</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            {/* How it works */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <NavigationIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-accent">Jak to funguje?</h3>
              </div>
              <ol className="space-y-2 text-sm text-text-dim ml-8">
                <li className="flex gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span>Klikni na svou oblíbenou navigační aplikaci</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span>Navigace se <strong className="text-text">otevře automaticky</strong> (aplikace nebo web)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span>Na mobilu: Přepínej mezi navigací a hrou pomocí přepínače aplikací</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">4.</span>
                  <span>Hra běží na pozadí - <strong className="text-text">všechny body se ukládají!</strong></span>
                </li>
              </ol>
            </div>

            {/* Android Split Screen Tip */}
            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-success">💡 Tip pro Android</h3>
              </div>
              <p className="text-sm text-text-dim ml-8">
                Použij <strong className="text-text">&ldquo;Rozdělenou obrazovku&rdquo;</strong> -
                stiskni tlačítko posledních aplikací, klikni na ikonu hry a vyber &ldquo;Rozdělená obrazovka&rdquo;.
                Navigace nahoře 🗺️, hra dole 🎮
              </p>
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
