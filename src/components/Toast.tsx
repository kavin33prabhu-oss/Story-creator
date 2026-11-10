import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-950/95 border border-purple-600/70 text-slate-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200">
      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
      <span className="text-xs font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-purple-400 hover:text-purple-200 ml-2"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
