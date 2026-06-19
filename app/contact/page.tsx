"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactUs() {
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    
    setIsLoading(true);
    
    // Mock network delay
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      
      // Reset form after success
      setTimeout(() => {
        setMsg("");
        setSent(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="gf-layout-wrapper min-h-[100dvh] flex items-center justify-center relative p-4 selection:bg-primary selection:text-[var(--bg-base)] overflow-hidden font-sans">
      
      {/* ── ORIGINAL BACKGROUND ── */}
      <div className="bg-dots-container absolute inset-0 -z-10">
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

      {/* ── GLASS CARD ── */}
      <div className="glass-card w-full max-w-[420px] p-6 sm:p-8 relative z-10 rounded-3xl bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)] hover:bg-[var(--bg-surface)]/90">
        
        {/* ANIMATED ICON HEADER */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Mail size={24} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary mb-1.5">
            Contact Hub.
          </h1>
          <p className="text-[13px] font-medium text-muted">
            Have a bug to report or an optimization idea?
          </p>
        </div>

        {/* ── DIRECT EMAIL LINK BOX ── */}
        <div className="group relative overflow-hidden bg-[var(--bg-base)] border border-[var(--border)] rounded-[14px] p-4 text-center mb-6 transition-colors hover:border-primary/50">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">
              Official Support Desk
            </div>
            <a
              href="mailto:extrasonu974@gmail.com"
              className="text-[14px] font-mono font-bold text-primary hover:text-primary transition-colors underline decoration-[var(--border)] hover:decoration-primary/50 underline-offset-4"
            >
              extrasonu974@gmail.com
            </a>
          </div>
        </div>

        {/* ── QUICK MESSAGE FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">
              Message Drop
            </label>
            <div className="relative group">
              <MessageSquare 
                size={16} 
                className={`absolute left-3.5 top-3.5 transition-colors duration-300 ${msg.trim() ? 'text-primary' : 'text-muted group-focus-within:text-primary'}`} 
              />
              <textarea 
                rows={4}
                placeholder="Describe the feature request or technical issue..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                disabled={isLoading || sent}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-primary transition-all outline-none resize-none shadow-inner leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!msg.trim() || isLoading || sent}
            className={`gf-btn w-full mt-2 py-3 rounded-xl relative overflow-hidden font-bold tracking-wide transition-all duration-300 group ${
              msg.trim() && !sent && !isLoading
                ? 'gf-btn-primary bg-primary text-[var(--bg-base)] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5' 
                : 'bg-[var(--bg-base)] text-muted cursor-not-allowed border border-[var(--border)]'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 text-[13px]">
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-[var(--bg-base)] border-t-transparent animate-spin" />
              ) : sent ? (
                <>
                  Message Transmitted <CheckCircle2 size={16} className="text-green-500" />
                </>
              ) : (
                <>
                  Transmit Message <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </form>

      </div>
    </div>
  );
}