'use client';

import React, { useEffect } from 'react';
import { useSucNoteStore } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const { toastMessage, toastType, clearToast } = useSucNoteStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] text-sm text-[#111111] dark:text-[#F5F5F5] transition-all duration-200 animate-in fade-in slide-in-from-bottom-3">
      {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
      {toastType === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
      {toastType === 'info' && <Info className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />}
      <span className="font-medium">{toastMessage}</span>
      <button
        onClick={clearToast}
        className="ml-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
