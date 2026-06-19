"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const supabase = createClient();

  const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings/account`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gf-layout-wrapper min-h-[100dvh] flex items-center justify-center relative p-4 selection:bg-primary selection:text-[var(--bg-base)] overflow-hidden font-sans">
      
      {/* ── BACKGROUND ── */}
      <div className="bg-dots-container absolute inset-0 -z-10">
        <div className="bg-dots" />
      </div>

      {/* ── NAVIGATION (Back to Home) ── */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-10 z-50">
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
      </div>

      {/* ── GLASS CARD ── */}
      <div className="glass-card w-full max-w-[420px] p-6 sm:p-8 relative z-10 rounded-3xl bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)] hover:bg-[var(--bg-surface)]/90">
        
        {/* BRAND LOGO (Concentric Rings) */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Logo size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary mb-1.5">
            Recover Password.
          </h1>
          <p className="text-[13px] font-medium text-muted">
            Enter your email to receive a secure recovery matrix link.
          </p>
        </div>

        {sent ? (
          <div className="text-center bg-[var(--bg-base)] border border-[var(--border)] shadow-inner rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
            <div className="text-[14px] font-bold text-primary mb-1">Transmission Successful</div>
            <p className="text-[12px] text-muted">Check your inbox for initialization parameters.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="recover-email" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${emailValid ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
                <input 
                  type="email" 
                  id="recover-email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-10 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-colors duration-300 outline-none font-mono shadow-inner"
                />
              </div>
            </div>

            {/* EXACT MATCH SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={!emailValid || isLoading}
              className={`gf-btn w-full mt-2 py-3 rounded-xl relative overflow-hidden font-bold tracking-wide transition-all duration-300 group ${
                emailValid 
                  ? 'gf-btn-primary bg-primary text-[var(--bg-base)] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5' 
                  : 'bg-[var(--bg-base)] text-muted cursor-not-allowed border border-[var(--border)]'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2 text-[13px]">
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--bg-base)] border-t-transparent animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </div>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}