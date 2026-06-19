"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Zap, ShieldAlert, BarChart, Rocket, Target, Heart } from "lucide-react";

export default function WhyAdaptivePage() {
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

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-primary mb-6">
            The End of the <span className="text-muted opacity-50 italic">Streak.</span>
          </h1>
          <p className="text-[16px] sm:text-[20px] text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            Traditional habit trackers use streaks to weaponize guilt. We use math to build resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
              Legacy Systems
            </div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Traditional Trackers</h2>
            <div className="space-y-4">
              {[
                { icon: ShieldAlert, title: "Fragile Mindset", text: "One missed day resets your streak to zero, leading to the &apos;What-the-Hell Effect&apos; where you give up entirely." },
                { icon: BarChart, title: "Static Data", text: "Fails to account for reality. If you miss a workout, it doesn&apos;t tell you how to adjust—it just shows a red &apos;X&apos;." },
                { icon: Target, title: "Guilt-Driven", text: "Relies on negative reinforcement and anxiety to keep you &apos;engaged&apos; with the app." }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg-surface)]/30 border border-[var(--border)] rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-3 text-red-500/70">
                    <item.icon size={20} />
                    <h3 className="font-bold text-[15px] uppercase tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest text-primary">
              The Matrix Engine
            </div>
            <h2 className="text-3xl font-black tracking-tight text-primary">GoalForge Adaptive</h2>
            <div className="space-y-4">
              {[
                { icon: Zap, title: "Resilient Logic", text: "No streaks. If you miss a day, our math engine simply recalibrates your required daily volume to stay on track." },
                { icon: Rocket, title: "Dynamic Pacing", text: "Calculates &apos;Recovery Sprints&apos; to neutralize variance. You always know exactly what&apos;s required to win." },
                { icon: Heart, title: "Performance-Focused", text: "Zero guilt. We treat your goals as mathematical matrices, rewarding total volume and long-term consistency." }
              ].map((item, i) => (
                <div key={i} className="bg-primary/5 border border-primary/30 rounded-2xl p-5 space-y-2 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                      <item.icon size={48} />
                   </div>
                  <div className="flex items-center gap-3 text-primary">
                    <item.icon size={20} />
                    <h3 className="font-bold text-[15px] uppercase tracking-tight">{item.title}</h3>
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[3rem] p-8 sm:p-16 text-center space-y-8 relative overflow-hidden">
           <div 
             className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] opacity-20 pointer-events-none" 
             style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 70%, transparent 100%)' }}
           />
           <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-primary relative z-10">Stop Tracking. Start Executing.</h2>
           <p className="text-[15px] sm:text-[18px] text-muted max-w-2xl mx-auto leading-relaxed relative z-10 font-medium">
             GoalForge is for people who care more about their final outcome than an arbitrary number of consecutive days. It is the tracker for the resilient.
           </p>
           <div className="pt-4 relative z-10">
             <Link href="/login?mode=signup" className="gf-btn gf-btn-primary px-10 py-4 rounded-2xl text-[15px] font-black shadow-xl hover:-translate-y-1 transition-all inline-flex items-center gap-3">
               Initialize Adaptive Engine <Zap size={20} />
             </Link>
           </div>
        </div>
      </main>
    </div>
  );
}
