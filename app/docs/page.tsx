"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Terminal, ChevronDown, Zap, Globe, Activity } from "lucide-react";

export default function DocsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sections = [
    { 
      icon: Zap, 
      title: "The Forge Engines", 
      desc: "Understand the four foundational logic models powering your goals.",
      content: (
        <div className="space-y-4">
          <p>GoalForge utilizes four specialized engines to track different types of objectives:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Volume Engine:</span> For numeric targets (e.g., 1000 pages, $5000 saved). It calculates remaining daily requirements based on your current pace.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Routine Engine:</span> For consistency (e.g., Gym 5x/week). It monitors weekly frequency and identifies recovery needs.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Pipeline Engine:</span> For sequential workflows (e.g., SaaS launch). It tracks linear progression through defined milestones.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Siege Engine:</span> For deadline-driven awareness. Best for loose tasks that require strict monitoring of time remaining.</div>
            </li>
          </ul>
        </div>
      )
    },
    { 
      icon: Activity, 
      title: "Dashboard & Analytics", 
      desc: "How to interpret your execution matrix and velocity trends.",
      content: (
        <div className="space-y-4">
          <p>Your dashboard is a live execution matrix providing real-time feedback:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Pace Engine v2.0:</span> Automatically detects if you are &quot;On Track&quot;, &quot;Behind Pace&quot;, or in &quot;Critical Deficit&quot; based on mathematical variance.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Activity Heatmap:</span> Visualizes your historical intensity over the last 60 days, highlighting peak execution periods.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Velocity Tracking:</span> Monitors completion percentage and dynamically suggests daily output adjustments to meet your deadlines.</div>
            </li>
          </ul>
        </div>
      )
    },
    { 
      icon: Globe, 
      title: "Global Synchronization", 
      desc: "Connect with the community and deploy shared systems.",
      content: (
        <div className="space-y-4">
          <p>The Global Forge allows you to synchronize your local workspace with elite community systems:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Community Challenges:</span> Join proven regimens like &quot;75 Hard&quot; or &quot;LeetCode Sprints&quot; with pre-configured engine parameters.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">System Deployment:</span> Instantly clone tracking matrices built by other operators into your private dashboard.</div>
            </li>
            <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div><span className="font-bold">Live Network:</span> Monitor global operator counts and participate in shared execution goals.</div>
            </li>
          </ul>
        </div>
      )
    }
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
            <Terminal size={26} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">Documentation</h1>
            <p className="text-[11px] font-mono text-muted uppercase tracking-widest">Manuals & System Specs</p>
          </div>
        </div>

        <div className="mb-8 text-[14px] font-medium text-primary leading-relaxed bg-[var(--bg-base)] p-5 rounded-[16px] border border-[var(--border)] shadow-inner flex items-start gap-4">
          <div className="mt-1 w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <p>Welcome to the GoalForge knowledge base. Learn how to configure your engines and master the pacing mathematics.</p>
        </div>

        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-primary bg-[var(--bg-base)] shadow-lg' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-primary/50'}`}>
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${isOpen ? 'bg-primary text-[var(--bg-base)] border-primary' : 'bg-[var(--bg-base)] border-[var(--border)] text-muted group-hover:text-primary'}`}>
                      <sec.icon size={18} />
                    </div>
                    <div>
                      <h3 className={`text-[15px] font-bold transition-colors ${isOpen ? 'text-primary' : 'text-primary'}`}>{sec.title}</h3>
                      <p className="text-[12.5px] text-muted">{sec.desc}</p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`} />
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-[14px] text-muted leading-relaxed border-t border-[var(--border)]/50 mt-2">
                      {sec.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}