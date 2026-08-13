'use client';

import React from 'react';
import { SaveStatus } from '@/lib/types';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  onRetry?: () => void;
  // This is the first commit

}

export function SaveStatusIndicator({ status, onRetry }: SaveStatusIndicatorProps) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#A1A1A1]">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === 'saved') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Saved</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Unable to save</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="underline hover:text-rose-700 dark:hover:text-rose-300 font-medium"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
