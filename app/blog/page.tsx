import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, BookOpen, Clock, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "The Forge Log | GoalForge Blog",
  description: "Insights and engineering updates from the GoalForge team.",
};

export default function BlogPage() {
  const posts = [
    { date: "Oct 24, 2026", time: "5 min read", title: "The Math Behind the Pacing Algorithm", desc: "How we calculate dynamic recovery sprints without breaking your motivation." },
    { date: "Sep 12, 2026", time: "8 min read", title: "Why Streaks Are Ruining Your Habits", desc: "The psychological downside of 'Don't Break The Chain' and what to do instead." },
    { date: "Aug 05, 2026", time: "4 min read", title: "GoalForge Architecture Overview", desc: "A deep dive into our ultra-low latency sync engine built for maximum scale." }
  ];

  return (
    <div className="gf-layout-wrapper min-h-[100dvh] flex flex-col items-center relative p-4 pt-24 pb-12 sm:pt-32 selection:bg-primary selection:text-[var(--bg-base)] overflow-hidden font-sans">
      <div className="bg-dots-container absolute inset-0 -z-10 fixed"><div className="bg-dots" /></div>

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

      <article className="glass-card w-full max-w-[720px] p-6 sm:p-10 relative z-10 rounded-3xl bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 border-b border-[var(--border)] pb-8">
          <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <BookOpen size={26} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">The Forge Log</h1>
            <p className="text-[11px] font-mono text-muted uppercase tracking-widest">Insights & Engineering</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map((post, idx) => (
            <div key={idx} className="group relative overflow-hidden bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 transition-all hover:border-primary/50 cursor-pointer">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-[11px] font-mono text-muted mb-3 uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.time}</span>
                </div>
                <h2 className="text-[17px] font-bold text-primary mb-2 flex items-center justify-between">
                  {post.title}
                  <ArrowUpRight size={18} className="text-muted group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                </h2>
                <p className="text-[13.5px] text-muted leading-relaxed">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
