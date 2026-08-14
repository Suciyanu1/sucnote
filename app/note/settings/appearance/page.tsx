'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const { theme, setTheme, showToast } = useSucNoteStore();

  const handleSelectTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    showToast(`Theme changed to ${selectedTheme}`, 'info');
  };

  const themeOptions = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Clean monochrome white background with high contrast dark text.',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Calm #0A0A0A canvas designed for low-light environments.',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System Sync',
      description: 'Automatically match your system device light/dark preferences.',
      icon: Laptop,
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Appearance & Theme
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Select your preferred visual mode for the SucNote workspace.
          </p>
        </div>

        <div className="space-y-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectTheme(opt.id as any)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-black dark:border-white bg-[#FAFAFA] dark:bg-[#141414] shadow-xs'
                    : 'border-[#E5E5E5] dark:border-[#272727] hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">
                      {opt.label}
                    </h3>
                    <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">{opt.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
