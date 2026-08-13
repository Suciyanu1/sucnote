'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { testSupabaseConnection } from '@/lib/supabase/sync';
import { Database, Copy, RefreshCw, ShieldCheck, FileCode, ExternalLink } from 'lucide-react';

const SCHEMA_SQL = `-- ===================================================
-- SUCNOTE SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ===================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. FOLDERS TABLE
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content JSONB NOT NULL DEFAULT '{"type": "doc", "content": []}'::jsonb,
  excerpt TEXT DEFAULT '',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own folders" ON public.folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own folders" ON public.folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own folders" ON public.folders FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);`;

export default function DatabaseSettingsPage() {
  const { showToast } = useSucNoteStore();

  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{
    connected: boolean;
    tablesCreated?: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const checkConnection = async () => {
    setTesting(true);
    const result = await testSupabaseConnection();
    setStatus(result);
    setTesting(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await testSupabaseConnection();
      if (active) {
        setStatus(result);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    showToast('SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
        <div className="border-b border-[#E5E5E5] dark:border-[#272727] pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              Supabase Database & Integration
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
              Verify database connection and inspect Row Level Security (RLS) policies.
            </p>
          </div>
          <button
            onClick={checkConnection}
            disabled={testing}
            className="p-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        {/* Connection Status Card */}
        <div className="p-5 rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111111] dark:text-[#F5F5F5]">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Connection Diagnostics</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold ${
                status?.connected
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {status?.connected ? 'Online & Configured' : 'Needs Configuration'}
            </span>
          </div>

          <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
            {status?.message || 'Testing connection to Supabase instance...'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Environment Variables</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {isConfigured ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Valid Supabase Keys</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">Placeholder Credentials</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Row-Level Security (RLS)</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Isolated per auth.uid()</span>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Schema Copy Box */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Supabase SQL Schema</h3>
            </div>
            <button
              onClick={handleCopySQL}
              className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            Copy this SQL script into your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-medium inline-flex items-center gap-0.5">Supabase SQL Editor <ExternalLink className="w-3 h-3 inline" /></a> to create tables and RLS security policies.
          </p>

          <pre className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-[11px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto max-h-60 leading-relaxed">
            {SCHEMA_SQL}
          </pre>
        </div>
      </div>
    </AppLayout>
  );
}
