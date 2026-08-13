'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { User, Mail, Save, Check } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateProfile, showToast } = useSucNoteStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: fullName, bio });
    showToast('Profile updated successfully', 'success');
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Update your account details and profile information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414]">
            <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-lg flex items-center justify-center">
              {fullName ? fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">{fullName || 'User'}</h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-zinc-100 dark:bg-zinc-800/50 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Bio / Subtitle
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
