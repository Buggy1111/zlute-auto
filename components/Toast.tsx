'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'from-red-500 to-red-600' :
                  type === 'success' ? 'from-green-500 to-green-600' :
                  'from-yellow-primary to-yellow-secondary';

  const emoji = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm`}>
        <span className="text-2xl">{emoji}</span>
        <p className="font-bold">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
