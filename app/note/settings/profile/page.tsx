'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { getProfile, updateProfileAction } from '@/lib/actions/profile';
import { UserProfile } from '@/lib/types';
import { Save, RefreshCw } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { showToast } = useSucNoteStore();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfileData() {
      setLoading(true);
      const prof = await getProfile();
      if (active && prof) {
        setUserProfile(prof);
        setFullName(prof.full_name || '');
        setBio(prof.bio || '');
        setLoading(false);
      }
    }

    loadProfileData();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updateProfileAction({ full_name: fullName, bio });
    setSaving(false);

    if (res.success) {
      showToast('Profile updated successfully in Supabase', 'success');
      setUserProfile((prev) => (prev ? { ...prev, full_name: fullName, bio } : null));
    } else {
      showToast(res.error || 'Failed to update profile', 'error');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full p-12 text-zinc-400 gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs">Loading profile details...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Update your account details and profile information stored in Supabase.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414]">
            <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-lg flex items-center justify-center">
              {fullName ? fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">{fullName || 'User'}</h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">{userProfile?.email}</p>
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
              value={userProfile?.email || ''}
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
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
