'use client';

import React from 'react';

export function NoteCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] animate-pulse space-y-3">
      <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
      <div className="space-y-1.5">
        <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
        <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
        <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
      </div>
    </div>
  );
}

export function NoteListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NoteEditorSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6 animate-pulse">
      <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
      <div className="space-y-3 pt-6">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5"></div>
      </div>
    </div>
  );
}
