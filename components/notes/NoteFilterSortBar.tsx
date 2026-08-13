'use client';

import React from 'react';
import { useSucNoteStore } from '@/lib/store';
import { NoteSortOption, NoteFilterOption } from '@/lib/types';
import { LayoutList, LayoutGrid, ArrowUpDown, Filter } from 'lucide-react';

export function NoteFilterSortBar() {
  const {
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    viewMode,
    setViewMode,
  } = useSucNoteStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-1 border-b border-[#E5E5E5] dark:border-[#272727] mb-4">
      {/* Filters */}
      <div className="flex items-center gap-1">
        {(['all', 'favorites', 'pinned'] as NoteFilterOption[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilterOption(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterOption === f
                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Right side: Sort + Grid/List toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#A1A1A1] bg-[#FAFAFA] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#272727] rounded-lg px-2.5 py-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as NoteSortOption)}
            className="bg-transparent text-xs text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden cursor-pointer"
          >
            <option value="updated_at">Recently Updated</option>
            <option value="created_at">Recently Created</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        <div className="flex items-center p-0.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414]">
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
