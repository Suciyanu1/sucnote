'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useSucNoteStore } from '@/lib/store';
import {
  FileText,
  Folder,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Star,
  Sun,
  Moon,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function LandingPage() {
  const { theme, setTheme } = useSucNoteStore();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDarkActive = mounted
    ? theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  const toggleThemeMode = () => {
    if (isDarkActive) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5] selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E5E5E5] dark:border-[#272727] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-base tracking-tighter">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight">SucNote</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#666666] dark:text-[#A1A1A1]">
          <a href="#features" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors">
            Features
          </a>
          <a href="#workflow" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors">
            How It Works
          </a>
          <a href="#preview" className="hover:text-[#111111] dark:hover:text-[#F5F5F5] transition-colors">
            Workspace Preview
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleThemeMode}
            title={isDarkActive ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkActive ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-[#E5E5E5] dark:border-[#272727] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-opacity shadow-xs"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Open Writer.<br />
          <span className="text-zinc-500 dark:text-zinc-400">Easy to use.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#666666] dark:text-[#A1A1A1] max-w-2xl mx-auto leading-relaxed">
          A simple, focused workspace for capturing, organizing, and finding your ideas with Tiptap autosave, nested folders, and instant search.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/app"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Product Interactive Preview Mockup */}
      <section id="preview" className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] shadow-2xl overflow-hidden p-2 md:p-4">
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar Preview */}
            <div className="w-full md:w-64 border-r border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] p-4 space-y-4 hidden sm:block">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5] dark:border-[#272727]">
                <div className="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center">
                  S
                </div>
                <span className="font-bold text-xs">SucNote Workspace</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-xs font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes (12)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#666666] dark:text-[#A1A1A1]">
                  <Star className="w-3.5 h-3.5" />
                  <span>Favorites (4)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#666666] dark:text-[#A1A1A1]">
                  <Folder className="w-3.5 h-3.5" />
                  <span>Work Projects</span>
                </div>
              </div>
            </div>

            {/* Note Canvas Preview */}
            <div className="flex-1 p-6 md:p-10 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#272727] text-xs text-[#666666] dark:text-[#A1A1A1]">
                <span className="flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5 text-zinc-400" /> Work Projects / Website Redesign
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Saved</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111111] dark:text-[#F5F5F5]">
                SucNote Minimalist Design Principles
              </h2>

              <blockquote className="p-3 border-l-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 text-sm italic text-[#666666] dark:text-[#A1A1A1]">
                &quot;Visual direction is strictly monochrome: black and white as primary brand colors with full light and dark mode support.&quot;
              </blockquote>

              <p className="text-sm text-[#111111] dark:text-[#F5F5F5] leading-relaxed">
                Avoid unnecessary cards, excessive rounded corners, or bright brand colors. Focus strictly on typography and generous whitespace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 border-t border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Engineered for clarity and focus</h2>
            <p className="text-sm text-[#666666] dark:text-[#A1A1A1]">
              Every feature in SucNote is built to reduce cognitive friction and keep you in flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] space-y-3">
              <div className="p-3 w-fit rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Real-time Tiptap Autosave</h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
                Never lose a single word. Edits are debounced and automatically persisted to database state.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] space-y-3">
              <div className="p-3 w-fit rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                <Folder className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Nested Folder Hierarchy</h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
                Organize projects seamlessly with parent and subfolders, move notes, and manage breadcrumbs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] space-y-3">
              <div className="p-3 w-fit rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Instant Cmd+K Search</h3>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
                Find any note, title, excerpt, or folder in milliseconds using global command palette fuzzy search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold">How SucNote Works</h2>
          <p className="text-sm text-[#666666] dark:text-[#A1A1A1]">Three simple steps to seamless note organization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <span className="text-3xl font-black text-zinc-300 light:text-zinc-700">01</span>
            <h3 className="text-base font-bold">Capture Thoughts</h3>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
              Click &quot;+ New Note&quot; or type immediately. Use slash commands for rich formatting, checklists, and code.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-3xl font-black text-zinc-300 light:text-zinc-700">02</span>
            <h3 className="text-base font-bold">Organize Effortlessly</h3>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
              File notes into nested folders, star your key favorites, or pin critical items to the top of your list.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-3xl font-black text-zinc-300 light:text-zinc-700">03</span>
            <h3 className="text-base font-bold">Find & Retrieve</h3>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] leading-relaxed">
              Press Cmd+K anytime to instantly filter through all titles, excerpts, and folder tags across your workspace.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="border-t border-[#E5E5E5] dark:border-[#272727] py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666] dark:text-[#A1A1A1]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-[10px]">
            S
          </div>
          <span className="font-semibold text-[#111111] dark:text-[#F5F5F5]">SucNote</span>
          <span>© 2026. Less interface. More thinking.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:underline">Sign In</Link>
          <Link href="/register" className="hover:underline">Register</Link>
          <Link href="/note" className="hover:underline font-semibold text-[#111111] dark:text-[#F5F5F5]">
            Open App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
