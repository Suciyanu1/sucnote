'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { Shield, Lock, LogOut } from 'lucide-react';

export default function SecuritySettingsPage() {
  const { showToast } = useSucNoteStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    showToast('Password updated successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4">
          <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
            Security Settings
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
            Manage your password, active sessions, and security credentials.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Change Password</h3>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
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
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              required
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all flex items-center gap-2 shadow-xs"
          >
            <Lock className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </form>

        <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#272727] space-y-3">
          <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Active Sessions</h3>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            You are currently signed in on this web browser session.
          </p>
          <button
            onClick={() => showToast('All other sessions signed out', 'info')}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Other Sessions</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
