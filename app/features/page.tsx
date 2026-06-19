import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Sparkles, RefreshCw, BarChart2, TrendingUp, Zap } from "lucide-react";

export const metadata = {
  title: "Engine Features | GoalForge",
  description: "Explore the advanced mathematical pacing modules that make GoalForge the ultimate execution tracker.",
};

export default function FeaturesPage() {
  const features = [
    { icon: RefreshCw, title: "Adaptive Targets", desc: "Quotas auto-recalculate based on remaining volume. Miss a day? The engine balances the rest automatically." },
    { icon: TrendingUp, title: "Recovery Sprints", desc: "Generate rigid 3, 5, or 7 day sprint plans to recover mathematical deficits without breaking your long-term pace." },
    { icon: BarChart2, title: "Developer Analytics", desc: "View GitHub-style matrices, rolling averages, and raw data trends over time for complete transparency." },
    { icon: Zap, title: "Zero Latency Sync", desc: "Engineered for speed. Your pace updates across all your devices in under 3 seconds using our optimized backend." }
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
        <ThemeToggle className="glass-card rounded-full p-2 backdrop-blur-md border border-[var(--border)]" />
      </div>

      <article className="w-full max-w-[800px] relative z-10 flex flex-col transition-all duration-500">
        
        <div className="glass-card p-6 sm:p-10 rounded-3xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 border-b border-[var(--border)] pb-8">
            <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Sparkles size={26} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">Engine Features</h1>
              <p className="text-[11px] font-mono text-muted uppercase tracking-widest">GoalForge Core Systems</p>
            </div>
          </div>
          <p className="text-[14px] font-medium text-muted leading-relaxed">
            Explore the advanced mathematical pacing modules that make GoalForge the ultimate execution tracker. Built for doers, engineered for reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((F, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <F.icon size={18} />
              </div>
              <h3 className="text-[16px] font-bold text-primary mb-2">{F.title}</h3>
              <p className="text-[13px] text-muted leading-relaxed">{F.desc}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
