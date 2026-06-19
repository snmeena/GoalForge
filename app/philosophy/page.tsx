"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function PhilosophyPage() {
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
            <Link href="/faq" className="text-[13px] font-bold text-muted hover:text-primary transition-colors hidden sm:block">
              FAQ
            </Link>
            <Link href="/login?mode=signup" className="gf-btn gf-btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:-translate-y-0.5 transition-all">
              Start Forging Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-primary mb-6">
            Our <span className="text-muted opacity-50 italic">Philosophy.</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted max-w-2xl mx-auto leading-relaxed">
            The traditional habit tracker is fundamentally flawed. We built GoalForge to fix it.
          </p>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">1. Streaks Are Fragile</h2>
            <p className="text-[16px] text-muted leading-relaxed">
              Most productivity apps weaponize streaks. They make you feel incredible on day 45, but utterly defeated on day 46 when life inevitably gets in the way. This brittle psychological model leads to a devastating crash: instead of missing one day, you give up completely. GoalForge eliminates the streak. We measure consistency, volume, and momentum. If you miss a day, the math simply recalibrates. You pick up where you left off.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">2. Guilt Is Not A Strategy</h2>
            <p className="text-[16px] text-muted leading-relaxed">
              You cannot hate yourself into becoming a better version of yourself. A system that relies on red Xs and angry notifications to motivate you is ultimately unsustainable. GoalForge is entirely guilt-free. We treat your goals not as moral obligations, but as mathematical matrices. They are either completed, or they require adjustment. That is all.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">3. Adaptive Mathematics</h2>
            <p className="text-[16px] text-muted leading-relaxed">
              If you want to read 100 pages in 10 days, your velocity is 10 pages per day. If you read 0 pages on day 1, your new required velocity is 11.1 pages per day. This is adaptive pacing. GoalForge constantly runs the math in the background, telling you exactly what you need to do today to win tomorrow. No guessing. No anxiety. Just data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">4. The Power of the Collective</h2>
            <p className="text-[16px] text-muted leading-relaxed">
              Success leaves clues. By analyzing the public blueprints of high-performance executors in the Global Forge, you can adopt the exact logic engines they used to succeed. We believe that shared accountability and proven strategies accelerate everyone&apos;s progress.
            </p>
          </section>

          <div className="pt-12 flex justify-center">
            <Link href="/login?mode=signup" className="gf-btn gf-btn-primary px-8 py-4 rounded-xl text-[15px] font-bold shadow-lg hover:-translate-y-1 transition-all">
              Initialize Your First Matrix
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
