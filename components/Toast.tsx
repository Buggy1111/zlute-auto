'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

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

  const Icon =
    type === 'error' ? AlertCircle : type === 'success' ? CheckCircle : Info;
  const colorClass =
    type === 'error'
      ? 'border-danger text-danger'
      : type === 'success'
      ? 'border-success text-success'
      : 'border-accent text-accent';

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className={`card px-6 py-4 flex items-center gap-3 max-w-sm ${colorClass} border-2`}
      >
        <Icon className="w-5 h-5" />
        <p className="font-bold text-text">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-text-muted hover:text-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
