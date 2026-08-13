'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { User, Sun, Shield, ChevronRight } from 'lucide-react';

export default function SettingsHubPage() {
  const sections = [
    {
      title: 'Profile',
      description: 'Update your name, bio, and profile details.',
      href: '/app/settings/profile',
      icon: User,
    },
    {
      title: 'Appearance',
      description: 'Customize light mode, dark mode, and workspace themes.',
      href: '/app/settings/appearance',
      icon: Sun,
    },
    {
      title: 'Security',
      description: 'Change password, manage active sessions, and security options.',
      href: '/app/settings/security',
      icon: Shield,
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Manage your account preferences, theme, and workspace options.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.href}
                href={sec.href}
                className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">{sec.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
