'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Check your email</h2>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
              We sent a password reset link to <span className="font-semibold">{email}</span>.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-black dark:text-white hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
                Enter your email address and we'll send you a recovery link.
              </p>
            </div>

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
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg text-sm font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all shadow-xs"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#A1A1A1] hover:text-[#111111] dark:hover:text-[#F5F5F5]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
