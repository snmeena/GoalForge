"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-primary font-sans selection:bg-primary selection:text-[var(--bg-base)]">
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size={28} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-extrabold text-xl tracking-tight text-primary">GoalForge.</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>
            <Link href="/philosophy" className="text-[13px] font-bold text-muted hover:text-primary transition-colors hidden sm:block">
              Philosophy
            </Link>
            <Link href="/login?mode=signup" className="gf-btn gf-btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:-translate-y-0.5 transition-all">
              Start Forging Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-primary mb-6">
            Frequently Asked <span className="text-muted opacity-50 italic">Questions.</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about adaptive pacing, our streak-free philosophy, and how GoalForge accelerates your execution.
          </p>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm hover:border-primary/30 transition-all">
            <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">What is GoalForge?</h3>
            <p className="text-[15px] text-muted leading-relaxed">
              GoalForge is an adaptive goal tracking SaaS built for high-performance executors. We use mathematical pacing and logic engines (Volume, Routine, Pipeline, Siege) to track progress without the guilt of broken streaks.
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm hover:border-primary/30 transition-all">
            <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">What is Adaptive Pacing?</h3>
            <p className="text-[15px] text-muted leading-relaxed">
              Instead of punishing you for missing a day, adaptive pacing recalibrates your required daily volume to meet your final deadline. If you fall behind, the system calculates the optimal recovery velocity required to get you back on track.
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm hover:border-primary/30 transition-all">
            <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">Why &quot;Streak-Free&quot; tracking?</h3>
            <p className="text-[15px] text-muted leading-relaxed">
              Traditional habit trackers rely on streaks, which create a brittle mindset. Missing a single day shouldn&apos;t demoralize you. Our streak-free philosophy focuses on total volume and consistency over time, rewarding resilience over perfection.
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm hover:border-primary/30 transition-all">
            <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">What is the Global Forge?</h3>
            <p className="text-[15px] text-muted leading-relaxed">
              The Global Forge is our decentralized community hub. It allows users to publish their successful tracking matrices (blueprints) and synchronize with community-vetted goals to accelerate their own progress.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
