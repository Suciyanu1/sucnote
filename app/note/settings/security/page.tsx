'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { getProfile } from '@/lib/actions/profile';
import { updatePasswordAction, logoutAction } from '@/lib/actions/auth';
import { UserProfile } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Shield, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { showToast } = useSucNoteStore();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    getProfile().then(setUserProfile);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    const res = await updatePasswordAction(newPassword);
    setLoading(false);

    if (res.success) {
      showToast('Password updated in Supabase Auth', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.error || 'Failed to update password', 'error');
    }
  };

  const handleSignOutAll = async () => {
    await logoutAction();
    showToast('Signed out of session', 'info');
    router.push('/login');
    router.refresh();
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Security & Authentication
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Manage your password, Row-Level Security (RLS), and active Supabase auth sessions.
          </p>
        </div>

        {/* Security Overview Status Card */}
        <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111111] dark:text-[#F5F5F5]">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Authentication Provider</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
              isConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isConfigured ? 'Supabase Cloud Auth' : 'Local Workspace Mode'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A]">
              <span className="text-zinc-400 text-[10px] uppercase font-mono block mb-0.5">Signed In Email</span>
              <span className="font-semibold text-[#111111] dark:text-[#F5F5F5] truncate block">
                {userProfile?.email || 'Not authenticated'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A]">
              <span className="text-zinc-400 text-[10px] uppercase font-mono block mb-0.5">User Unique ID</span>
              <span className="font-mono text-[11px] text-[#111111] dark:text-[#F5F5F5] truncate block">
                {userProfile?.id || ''}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Change Password</h3>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>

        <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#272727] space-y-3">
          <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Active Session Management</h3>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            End your current session or clear credentials on this browser.
          </p>
          <button
            onClick={handleSignOutAll}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Clear Session</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
