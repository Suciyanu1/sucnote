'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSucNoteStore } from '@/lib/store';
import { loginAction } from '@/lib/actions/auth';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useSucNoteStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAction(email, password);
      setLoading(false);

      if (res.success) {
        showToast('Welcome back to SucNote', 'success');
        router.push('/app');
        router.refresh();
      } else {
        setError(res.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5] flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-lg">
          S
        </div>
        <span className="font-extrabold text-xl tracking-tight">SucNote....</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] p-8 shadow-xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Sign in to SucNote</h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            Welcome back. Enter your details to access your workspace.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#666666] dark:text-[#A1A1A1]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#666666] dark:text-[#A1A1A1]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs mt-2 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#666666] dark:text-[#A1A1A1]">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-[#111111] dark:text-[#F5F5F5] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
