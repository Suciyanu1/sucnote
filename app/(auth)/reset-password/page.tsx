'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSucNoteStore } from '@/lib/store';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useSucNoteStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    showToast('Password updated successfully', 'success');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5] flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg">
          S
        </div>
        <span className="font-extrabold text-xl tracking-tight">SucNote</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] p-8 shadow-xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            Create a secure new password for your account.
          </p>
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
