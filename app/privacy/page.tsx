"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Shield, Eye, Lock, Globe } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Shield size={26} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">
              Privacy Policy
            </h1>
            <p className="text-[11px] font-mono text-muted uppercase tracking-widest">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <p className="mb-8 text-[14px] font-medium text-primary leading-relaxed bg-[var(--bg-base)] p-4 rounded-[14px] border border-[var(--border)] shadow-inner">
          At GoalForge, we value your privacy above everything else. This policy outlines how we handle your data when you use our adaptive pacing engine.
        </p>

        {/* SECTION 1 */}
        <div className="mb-6">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <Eye size={16} />
            </div>
            1. Data We Collect
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            We keep data collection minimal. To use GoalForge, we collect your email address, account credentials, and the raw metric logs (e.g., problems solved, chapters read) that you input into your custom dashboards.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="mb-6">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <Lock size={16} />
            </div>
            2. Security & Encryption
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            Your personal tracking matrix and account details are stored safely. We use industry-standard encryption protocols to ensure that your habit velocity metrics are only accessible by you.
          </p>
        </div>

        {/* SECTION 3 */}
        <div className="mb-2">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted shadow-sm">
              <Globe size={16} />
            </div>
            3. No Third-Party Selling
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted pl-11">
            We strictly do not rent, sell, or trade your data or behavioral habits to advertisers or data brokers. Your execution metrics belong solely to you.
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] text-[12px] text-faint font-medium text-center">
          Questions regarding data processing? Reach us at <a href="mailto:extrasonu974@gmail.com" className="text-primary hover:underline underline-offset-2">extrasonu974@gmail.com</a>
        </div>
      </article>
    </div>
  );
}