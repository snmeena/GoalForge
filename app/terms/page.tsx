"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Scale, ShieldAlert, Zap, CircleSlash } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="gf-layout-wrapper min-h-[100dvh] flex flex-col items-center relative p-4 pt-24 pb-12 sm:pt-32 selection:bg-primary selection:text-[var(--bg-base)] overflow-hidden font-sans">
      
      {/* ── BACKGROUND ── */}
      <div className="bg-dots-container absolute inset-0 -z-10 fixed">
        <div className="bg-dots" />
      </div>

      {/* ── NAVIGATION (Back to Home) ── */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-10 z-50 flex items-center gap-3">
        <Link 
          href="/" 
          className="flex items-center gap-3 text-sm font-bold text-muted hover:text-primary transition-all group px-4 py-2 rounded-full hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-r border-[var(--border)] pr-3 mr-1">
            <Logo size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-extrabold tracking-tighter text-primary">GoalForge.</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </div>
        </Link>
        <ThemeToggle className="bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-md rounded-full p-2 shadow-lg" />
      </div>

      {/* ── GLASS CONTENT CARD ── */}
      <article className="glass-card w-full max-w-[720px] p-6 sm:p-10 relative z-10 rounded-3xl bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 border-b border-[var(--border)] pb-8">
          <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Scale size={26} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">
              Terms of Service
            </h1>
            <p className="text-[11px] font-mono text-muted uppercase tracking-widest">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <p className="mb-8 text-[14px] font-medium text-primary leading-relaxed bg-[var(--bg-base)] p-4 rounded-[14px] border border-[var(--border)] shadow-inner">
          Welcome to GoalForge. By creating an account and initializing our pacing engine, you acknowledge that you agree to the following operational parameters.
        </p>

        {/* SECTION 1 */}
        <div className="mb-6">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <Zap size={16} />
            </div>
            1. Usage Limits & Rules
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            GoalForge provides automated calculations as an analytical tool. Users are prohibited from using bots, scraping scripts, or automation frameworks to overwhelm our server resources.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="mb-6">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <CircleSlash size={16} />
            </div>
            2. Disclaimer of Liability (&quot;As-Is&quot;)
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            GoalForge services are provided on an &quot;As-Is&quot; and &quot;As-Available&quot; basis. While our pacing algorithms are mathematically accurate, we do not claim liability for any loss of routine data, server downtime, or external workflow tracking interruptions.
          </p>
        </div>

        {/* SECTION 3 */}
        <div className="mb-2">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <ShieldAlert size={16} />
            </div>
            3. Termination Policy
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            We reserve the right to restrict or terminate user profiles that are suspected of malicious execution patterns, security bypass attempts, or general violations of user integrity guidelines.
          </p>
        </div>
      </article>
    </div>
  );
}
