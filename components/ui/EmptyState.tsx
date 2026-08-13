'use client';

import React from 'react';
import { LucideIcon, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/50 dark:bg-[#141414]/30 my-6 space-y-4">
      <div className="p-3.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-semibold text-[#111111] dark:text-[#F5F5F5]">{title}</h3>
        <p className="text-sm text-[#666666] dark:text-[#A1A1A1] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-opacity shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
