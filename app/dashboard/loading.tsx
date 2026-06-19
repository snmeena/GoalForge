"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";

export default function DashboardLoading() {
  const [loadingText, setLoadingText] = useState("Initializing execution engines...");
  const phrases = [
    "Synchronizing local matrices...",
    "Calculating adaptive pacing...",
    "Connecting to the Global Forge network..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(phrases[i]);
      i = (i + 1) % phrases.length;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[100dvh] bg-[var(--bg-base)] text-primary overflow-hidden font-sans selection:bg-primary selection:text-[var(--bg-base)] relative">
      {/* Background Dots */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Central Overlay */}
      <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-base)]/60 backdrop-blur-md">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Logo size={32} className="animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[12px] font-black text-primary uppercase tracking-[0.4em] animate-pulse h-4 text-center">
              {loadingText}
            </p>
            <div className="w-48 h-1 bg-[var(--border)] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary animate-[loading_2s_infinite_ease-in-out]" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton (Maintained to prevent layout shift) */}
      <aside className="hidden md:flex w-64 bg-[var(--bg-surface)]/80 backdrop-blur-3xl border-r border-[var(--border)] flex-col relative z-10">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--border)] animate-pulse" />
          <div className="w-24 h-4 bg-[var(--border)] rounded ml-3 animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="w-full h-10 bg-[var(--border)] rounded-xl animate-pulse" />
          <div className="w-full h-10 bg-[var(--border)] rounded-xl animate-pulse opacity-50" />
          <div className="w-full h-10 bg-[var(--border)] rounded-xl animate-pulse opacity-30" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col relative z-10">
        <header className="h-16 flex items-center justify-between px-8 border-b border-[var(--border)] bg-[var(--bg-surface)]/70 backdrop-blur-3xl">
          <div className="w-48 h-4 bg-[var(--border)] rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse" />
            <div className="w-24 h-8 rounded-full bg-[var(--border)] animate-pulse" />
          </div>
        </header>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="w-64 h-8 bg-[var(--border)] rounded-lg animate-pulse" />
              <div className="w-96 h-4 bg-[var(--border)] rounded-lg animate-pulse opacity-60" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl animate-pulse" />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-[220px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
