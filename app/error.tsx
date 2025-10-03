'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl mb-6 animate-[shake_1s_ease-in-out]">😢</div>
        <h1 className="text-5xl font-black gradient-text mb-4 drop-shadow-lg">
          Něco se pokazilo
        </h1>
        <div className="glass-strong rounded-3xl p-8 mb-6 border-2 border-white/50 shadow-2xl">
          <p className="text-gray-800 font-bold text-xl mb-2">
            Omlouváme se, došlo k neočekávané chybě.
          </p>
          <p className="text-gray-600 text-sm font-semibold">
            {error.message || 'Zkuste to prosím znovu.'}
          </p>
        </div>
        <button
          onClick={reset}
          className="px-10 py-5 bg-gradient-to-r from-yellow-primary to-yellow-secondary text-white rounded-2xl font-black text-2xl shadow-[0_20px_60px_rgba(255,215,0,0.5)] hover:shadow-[0_30px_80px_rgba(255,215,0,0.7)] transform hover:scale-110 transition-all"
        >
          Zkusit znovu 🔄
        </button>
      </div>
    </div>
  );
}
