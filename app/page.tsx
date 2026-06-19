// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Zap, TrendingUp, BarChart2, RefreshCw,
  ArrowRight, CheckCircle2,
  Code, Dumbbell,
  Activity, Star, Users, Copy, Globe, Flame, GitGraph, Pizza,
  ChevronDown, ChevronUp, Mail, ShieldCheck, Check
} from "lucide-react";
import { useScrollReveal, useMagnetic } from "@/lib/hooks";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Mounted } from "@/components/Mounted";
import { calculatePace } from "@/lib/pacing";

// ==========================================================================
// ADVANCED MULTI-SCENARIO PACE DEMO
// ==========================================================================
// ... (omitted for brevity, will use specific context below)
const SCENARIOS = [
  { id: "volume", icon: Code, label: "Volume", title: "100 LeetCode Problems in 30 Days", type: 'volume' as const },
  { id: "routine", icon: Dumbbell, label: "Routine", title: "7-Day Fitness Streak", type: 'routine' as const },
  { id: "siege", icon: Flame, label: "Siege", title: "Market Research Scan", type: 'siege' as const },
  { id: "pipeline", icon: GitGraph, label: "Pipeline", title: "Product MVP Roadmap", type: 'pipeline' as const },
];

function PaceDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [volumeDone, setVolumeDone] = useState(24);
  const [routineDays, setRoutineDays] = useState([true, false, true, true, false, false, false]);
  const [siegePoints, setSiegePoints] = useState(4);
  const [pipelineStages, setPipelineStages] = useState([
    { title: "Frontend", isOpen: false, subs: [{ text: "React Setup", done: true }, { text: "UI Layout", done: true }, { text: "State", done: false }] },
    { title: "Backend", isOpen: false, subs: [{ text: "Database", done: false }, { text: "Auth API", done: false }, { text: "Endpoints", done: false }] },
    { title: "Deploy", isOpen: false, subs: [{ text: "Vercel Build", done: false }, { text: "Custom Domain", done: false }, { text: "Go Live", done: false }] }
  ]);

  const { target, done, needed, gap, daysLeft, msg, pct, status } = useMemo(() => {
    let target = 0, done = 0, expected = 0, daysLeft = 17;

    if (activeTab === 0) {
      target = 100; done = volumeDone; expected = 43; daysLeft = 17;
    } else if (activeTab === 1) {
      target = 5; done = routineDays.filter(Boolean).length; expected = 4; daysLeft = 2;
    } else if (activeTab === 2) {
      target = 15; done = siegePoints; expected = 8; daysLeft = 10;
    } else if (activeTab === 3) {
      target = 3; done = pipelineStages.filter(s => s.subs.every(sub => sub.done)).length; expected = 2; daysLeft = 5;
    }

    const result = calculatePace(target, done, expected, daysLeft, SCENARIOS[activeTab].type);

    return { 
      target, 
      done, 
      needed: result.needed, 
      gap: result.gap, 
      daysLeft, 
      msg: result.message, 
      pct: result.pct, 
      status: result.status 
    };
  }, [activeTab, volumeDone, routineDays, siegePoints, pipelineStages]);

  const statusMap = {
    "on-track": { text: "text-green-500", bg: "bg-green-500", bgSoft: "bg-green-500/10", border: "border-green-500/25", accent: "accent-green-500", label: "On Track", icon: <CheckCircle2 size={14} /> },
    "behind": { text: "text-amber-500", bg: "bg-amber-500", bgSoft: "bg-amber-500/10", border: "border-amber-500/25", accent: "accent-amber-500", label: "Behind Pace", icon: <Activity size={14} /> },
    "critical": { text: "text-red-500", bg: "bg-red-500", bgSoft: "bg-red-500/10", border: "border-red-500/25", accent: "accent-red-500", label: "Critical", icon: <Activity size={14} /> }
  };
  const currentStatus = statusMap[status as keyof typeof statusMap];

  return (
    <div className="glass-card overflow-hidden max-w-[640px] mx-auto transition-all duration-300">
      <div className="px-5 py-2.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-surface)]">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />
        </div>
        <span className="text-[10px] font-mono text-muted tracking-wider uppercase flex items-center gap-1.5">
          <Logo size={12} />
          Pace Engine v2.0 Live
        </span>
        {activeTab < 2 && (
          <div className={`flex items-center gap-1 ${currentStatus.text}`}>
            {currentStatus.icon}
            <span className="text-[10px] font-semibold">{currentStatus.label}</span>
          </div>
        )}
      </div>

      <div className="flex border-b border-[var(--border)] bg-base">
        {SCENARIOS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            title={`Switch to ${tab.label} scenario`}
            className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs transition-all duration-300 cursor-pointer
              ${activeTab === idx ? "bg-[var(--bg-surface)] text-[var(--text-primary)] border-b-2 border-[var(--text-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"}`}
          >
            <tab.icon size={13} className="sm:w-[14px] sm:h-[14px]" />
            <span className={activeTab === idx ? "inline" : "hidden sm:inline"}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="text-[9px] sm:text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Active Target</div>
            <div className="text-base sm:text-lg font-extrabold text-primary tracking-tight truncate max-w-[200px] sm:max-w-none">{SCENARIOS[activeTab].title}</div>
          </div>
          <div className="flex justify-between sm:block sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border)]">
            <div className="text-[9px] sm:text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Completed</div>
            <div className={`text-xl sm:text-2xl font-mono font-extrabold ${currentStatus.text}`}>
              {done} <span className="text-xs text-muted">/ {target}</span>
            </div>
          </div>
        </div>

        {activeTab < 2 && (
          <>
            <div className="relative">
              <div className="flex justify-between text-[10px] sm:text-[11px] text-muted mb-2 font-medium">
                <span>Progress Velocity</span>
                <span className="font-mono">{Math.min(pct, 100)}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-[var(--border)] rounded-full overflow-hidden relative">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out overflow-hidden ${currentStatus.bg}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                >
                  <div className="shimmer-progress" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Remaining", val: daysLeft, sub: "Days" },
                { label: "Req. Pace", val: needed, sub: "/Day" },
                { label: "Variance", val: (gap > 0 ? "+" : "") + gap, sub: "Units" }
              ].map((stat, i) => (
                <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl py-2.5 sm:py-3 text-center">
                  <div className="text-base sm:text-lg font-mono font-bold text-primary">{stat.val}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-muted mt-0.5">{stat.label} <span className="hidden sm:inline">{stat.sub}</span></div>
                </div>
              ))}
            </div>

            <div className={`px-4 py-2.5 rounded-xl border text-[11px] sm:text-xs font-medium flex items-start gap-3 ${currentStatus.bgSoft} ${currentStatus.border} ${currentStatus.text}`}>
              <Activity size={14} className="mt-0.5 shrink-0" />
              <span className="leading-relaxed">{msg}</span>
            </div>
          </>
        )}

        {activeTab === 2 && (
          <div className="py-2 sm:py-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${i < siegePoints ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] scale-110' : 'bg-[var(--bg-surface)] border-[var(--border)] text-muted/30'}`}>
                  <Flame size={16} className={i < siegePoints ? 'opacity-100' : 'opacity-30'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="relative pt-2 pb-2">
            <div className="hidden sm:block absolute top-[26px] left-[16%] right-[16%] h-0.5 bg-[var(--border)] z-0" />
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
              {pipelineStages.map((stage, sIdx) => {
                const isDone = stage.subs.every(s => s.done);
                return (
                  <div key={sIdx} className="flex-1 flex flex-col gap-2.5">
                    <button 
                      onClick={() => {
                        const newS = [...pipelineStages];
                        newS[sIdx].isOpen = !newS[sIdx].isOpen;
                        setPipelineStages(newS);
                      }}
                      className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between sm:justify-center gap-2 transition-all duration-300 ${isDone ? 'bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] shadow-md' : 'bg-[var(--bg-base)] border-[var(--border)] text-primary hover:border-primary/50'}`}>
                      <span className="font-bold text-[11px] sm:text-xs tracking-wide uppercase">{stage.title}</span>
                      <span className="sm:hidden">{stage.isOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
                      <span className="hidden sm:block">{isDone ? <CheckCircle2 size={14} className="text-[var(--bg-base)]"/> : <div className="w-1.5 h-1.5 rounded-full bg-muted"/>}</span>
                    </button>

                    <div className={`flex-col gap-2 ${stage.isOpen ? 'flex' : 'hidden sm:flex'}`}>
                      {stage.subs.map((sub, subIdx) => (
                        <button 
                          key={subIdx} 
                          onClick={() => {
                            const newS = [...pipelineStages];
                            newS[sIdx].subs[subIdx].done = !newS[sIdx].subs[subIdx].done;
                            setPipelineStages(newS);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg border text-[10px] sm:text-[11px] font-medium transition-all duration-200 flex items-center gap-2.5 
                            ${sub.done 
                              ? 'bg-primary/10 border-primary/50 text-primary' 
                              : 'bg-[var(--bg-surface)] border-[var(--border)] text-muted hover:border-primary/30 hover:text-primary/70'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-sm border flex flex-shrink-0 items-center justify-center transition-colors
                            ${sub.done ? 'bg-primary border-primary text-[var(--bg-base)]' : 'border-muted'}`}>
                            {sub.done && <Check size={10} strokeWidth={4} />}
                          </div>
                          <span className="truncate">{sub.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab < 3 && (
          <div className="pt-4 border-t border-[var(--border)]">
            <div className="text-[10px] text-muted font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
              <Zap size={11} /> Test the Algorithm:
            </div>

            {activeTab === 0 && (
              <div className="px-1">
                <input
                  type="range"
                  min={0}
                  max={target}
                  value={volumeDone}
                  onChange={(e) => setVolumeDone(Number(e.target.value))}
                  aria-label="Adjust completed progress"
                  title="Adjust completed progress"
                  className={`w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer outline-none ${currentStatus.accent}`}
                />
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <button key={i}
                    onClick={() => {
                      const newDays = [...routineDays];
                      newDays[i] = !newDays[i];
                      setRoutineDays(newDays);
                    }}
                    title={`Toggle ${day} workout status`}
                    className={`aspect-square sm:w-10 sm:h-10 rounded-lg font-bold text-[10px] sm:text-sm transition-all duration-300 border cursor-pointer flex items-center justify-center
                      ${routineDays[i] 
                        ? 'bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] scale-105 sm:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <div className="flex items-center justify-center gap-6 sm:gap-8">
                <button onClick={() => setSiegePoints(Math.max(0, siegePoints - 1))}
                  title="Decrease scan points"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-300 cursor-pointer">
                  <ChevronDown size={18} />
                </button>
                <div className="text-xl sm:text-2xl font-mono font-extrabold w-10 sm:w-12 text-center">{siegePoints}</div>
                <button onClick={() => setSiegePoints(siegePoints + 1)}
                  title="Increase scan points"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all duration-300 cursor-pointer">
                  <ChevronUp size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const PizzaSupportSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPizza, setSelectedPizza] = useState<number | null>(null);
    const [paymentDone, setPaymentDone] = useState(false);

    const pizzaMenu = [
        { name: "Classic Margherita", price: "$5", desc: "Basic fuel for minor bug fixes.", icon: "🍕" },
        { name: "Paneer Powerhouse", price: "$12", desc: "Premium energy for complex logic engines.", icon: "🌶️" },
        { name: "Double Pepperoni", price: "$18", desc: "Sustenance for overnight feature sprints.", icon: "🥓" },
        { name: "The Forge Master", price: "$25", desc: "Unlocks ultimate developer focus mode.", icon: "🔥" }
    ];

    const handlePizzaSelect = (index: number) => {
        setSelectedPizza(index);
        setPaymentDone(false); // Reset payment status when a new pizza is selected
    };

    const selectedPizzaDetails = selectedPizza !== null ? pizzaMenu[selectedPizza] : null;

    return (
        <section className="py-20 md:py-28 relative overflow-hidden text-center">
            <div className="container-constrained relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 reveal-on-scroll">
                    <Pizza size={12} /> Support the Forge
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-primary reveal-on-scroll">
                    Fuel the Development.
                </h2>
                <p className="text-muted text-base mb-12 reveal-on-scroll">
                    GoalForge is currently maintained by a solo developer. If you&apos;re one of them, help us keep the code clean and the servers running by sponsoring the development with a virtual pizza.
                </p>

                <div className="space-y-6 reveal-on-scroll">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                        <button
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen);
                                if (isMenuOpen) {
                                    setSelectedPizza(null);
                                    setPaymentDone(false);
                                }
                            }}
                            className="gf-btn gf-btn-primary px-8 py-3.5 text-[13px] font-bold uppercase tracking-wide group"
                        >
                            {isMenuOpen ? "Close Menu" : "View Pizza Menu"}
                            <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                        </button>

                        {selectedPizzaDetails && (
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-muted font-medium">Selected:</span>
                                <span className="text-[15px] font-bold text-primary">{selectedPizzaDetails.name}</span>
                                <span className="text-[15px] font-bold text-primary">{selectedPizzaDetails.price}</span>
                            </div>
                        )}
                    </div>

                    {isMenuOpen && (
                        <div className="glass-card p-4 sm:p-6 text-left border border-[var(--border)] bg-[var(--bg-surface)]">
                            <h3 className="text-lg font-bold text-primary mb-4">Pizza Support Tiers</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[var(--border)]">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider">Pizza</th>
                                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider">Impact</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {pizzaMenu.map((pizza, idx) => (
                                            <tr
                                                key={idx}
                                                className={`group/row border-b border-[var(--border)] cursor-pointer transition-colors duration-200
                                                            ${selectedPizza === idx ? 'bg-primary/10 text-primary' : 'hover:bg-[var(--glass-bg)]'}`}
                                                onClick={() => handlePizzaSelect(idx)}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold flex items-center gap-2">
                                                    <span>{pizza.icon}</span> {pizza.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-[13px] text-primary font-mono font-semibold">
                                                    {pizza.price}
                                                </td>
                                                <td className="px-4 py-3 text-[13px] text-muted max-w-[250px]">{pizza.desc}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {selectedPizza === idx && <CheckCircle2 size={16} className="text-primary" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedPizzaDetails && (
                        <div className="glass-card p-4 sm:p-6 border border-[var(--border)] bg-[var(--bg-surface)] text-left">
                            <h3 className="text-lg font-bold text-primary mb-4">Confirm Your Order</h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[13px] text-muted font-medium">Your selection:</span>
                                <span className="text-[15px] font-bold text-primary">{selectedPizzaDetails.name} {selectedPizzaDetails.price}</span>
                            </div>
                            <button
                                onClick={() => setPaymentDone(true)}
                                disabled={paymentDone}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm tracking-wide uppercase
                                           hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {paymentDone ? "Thanks for your support!" : `Sponsor with ${selectedPizzaDetails.price}`}
                            </button>
                            {paymentDone && (
                                <p className="text-[11px] text-green-500 mt-2 text-center">
                                    Thank you! Your virtual pizza has been delivered.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};


function FeatureCard({ icon: Icon, title, desc, tag }: { icon: React.ElementType, title: string, desc: string, tag?: string }) {
  return (
    <div className="glass-card feature-card-hover p-6 sm:p-8 flex flex-col gap-5 reveal-on-scroll">
      <div className="feature-icon-wrapper w-12 h-12 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center justify-center transition-all duration-300 text-muted">
        <Icon size={20} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[17px] font-bold text-primary tracking-tight">{title}</h3>
          {tag && (
            <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-muted uppercase">
              {tag}
            </span>
          )}
        </div>
        <p className="text-[14px] text-muted leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3);
  useScrollReveal();

  return (
    <div className="gf-layout-wrapper">
      <div className="bg-dots-container"><div className="bg-dots" /></div>

      <nav className="glass-nav">
        <div className="container-full h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <Logo size={26} />
            <span className="font-extrabold text-[17px] sm:text-[19px] tracking-tighter text-primary">GoalForge.</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-6">
              <Link href="/login?mode=login" className="text-[14px] font-bold text-primary hover:text-primary transition-colors link-underline pb-0.5">
                Sign In
              </Link>
              <Link href="/login?mode=signup" className="text-[14px] font-bold text-primary hover:opacity-80 transition-opacity link-underline pb-0.5">
                Sign Up
              </Link>
            </div>

            <div className="sm:hidden flex items-center">
              <Link href="/login?mode=login" className="text-[13px] font-bold text-[var(--bg-base)] bg-[var(--text-primary)] px-4 py-1.5 rounded-full hover:scale-105 transition-transform shadow-md">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow relative z-10">
        <section className="pt-20 pb-8 md:pt-24 md:pb-10 text-center px-4 overflow-x-hidden">
          <div className="container-constrained max-w-4xl">
            <div className="reveal-on-scroll inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] glass-card text-[11px] font-bold text-muted uppercase tracking-widest mb-6 shadow-sm">
              <Zap size={12} className="text-primary" /> Pace Engine v2.0
            </div>

            <h1 className="reveal-on-scroll text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.1] sm:leading-[1.02] tracking-tighter mb-4 text-primary">
              Build habits without <br className="hidden sm:block" />
              <span className="text-muted">the guilt trips.</span>
            </h1>

            <p className="reveal-on-scroll text-[clamp(1.1rem,1.5vw,1.25rem)] text-muted leading-relaxed mb-6 max-w-2xl mx-auto font-medium">
              Mathematically recalculates targets when life happens. No broken streak anxiety. Just pure execution.
            </p>

            <div className="reveal-on-scroll flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-4 px-4">
              <Link
                href="/login?mode=signup"
                ref={ctaRef}
                className="gf-btn gf-btn-primary w-full sm:w-auto px-8 py-4 text-base group whitespace-nowrap"
              >
                Start Forging Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="gf-btn gf-btn-secondary w-full sm:w-auto px-8 py-4 text-base whitespace-nowrap">
                Pricing
              </Link>
              <a href="#demo" className="gf-btn gf-btn-secondary w-full sm:w-auto px-8 py-4 text-base whitespace-nowrap hidden md:flex">
                See it live
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 mb-24 relative overflow-hidden max-w-[100vw]">
          <div className="absolute inset-0 bg-[var(--bg-surface)] border-y border-[var(--border)] -skew-y-2 origin-top-left z-0" />
          <div className="container-constrained relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 reveal-on-scroll">
              {[
                { val: "100%", label: "Core Features Free", icon: ShieldCheck },
                { val: "&lt; 3s", label: "Sync Latency", icon: Zap },
                { val: "Zero", label: "Guilt Installed", icon: CheckCircle2 },
                { val: "O(1)", label: "Algorithm Time", icon: Activity },
              ].map((s, i) => (
                <div key={i} className="glass-card p-5 sm:p-6 flex flex-col items-center text-center">
                  <s.icon size={20} className="text-muted mb-3" />
                  <div className="text-2xl font-extrabold font-mono text-primary tracking-tight mb-1" dangerouslySetInnerHTML={{ __html: s.val }} />
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="pb-12 md:pb-16 pt-6 overflow-x-hidden">
          <div className="container-constrained text-center">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-primary">Check how it works.</h2>
            <p className="reveal-on-scroll text-muted text-base max-w-lg mx-auto mb-12 font-medium">
              Try the interactive demo below to see how our engine handles real-world interruptions and dynamically recalibrates your pace.
            </p>
            <div className="reveal-on-scroll">
              <PaceDemo />
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden bg-[var(--bg-base)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
          <div className="container-constrained relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4">
                <Globe size={12} /> Community Blueprints
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-primary">The Global Forge.</h2>
              <p className="text-muted text-base">Don&apos;t start from scratch. Clone proven systems from top performers worldwide.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "75 Hard Tracker", author: "Andy F.", clones: "12.4k", desc: "The definitive mental toughness program logic with auto-restart triggers." },
                { title: "Y-Combinator MVP Sprint", author: "StartupHub", clones: "8.2k", desc: "Aggressive 4-week shipping cadence optimized for fast feedback loops." },
                { title: "Deep Work Protocol", author: "Cal N.", clones: "24.1k", desc: "Focus volume tracking with diminishing returns calculation for cognitive load." }
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 flex flex-col gap-6 group hover:slide-focus-inner reveal-on-scroll bg-[var(--bg-surface)]/40 hover:bg-[var(--bg-surface)] transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Zap size={18} />
                    </div>
                    <div className="text-[10px] font-bold text-faint flex items-center gap-1">
                      <Users size={12} /> {item.clones} clones
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{item.title}</h3>
                    <p className="text-[13px] text-muted leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-faint">by {item.author}</span>
                    <button className="flex items-center gap-2 text-[11px] font-extrabold text-primary hover:opacity-70 transition-opacity uppercase tracking-widest cursor-pointer">
                      <Copy size={12} /> Clone
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[var(--bg-surface)] border-y border-[var(--border)] overflow-x-hidden">
          <div className="container-constrained">
            <div className="text-center max-w-2xl mx-auto mb-20 reveal-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-primary">Engineered for Results.</h2>
              <p className="text-muted text-base">Data-driven tools to hit goals consistently. Hover over the modules below.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={RefreshCw} title="Adaptive Targets" tag="CORE" desc="Quotas auto-recalculate based on remaining volume. No manual input needed." />
              <FeatureCard icon={TrendingUp} title="Recovery Sprints" tag="AI" desc="Generate rigid 3, 5, or 7 day sprint plans to recover deficits mathematically." />
              <FeatureCard icon={BarChart2} title="Developer Analytics" tag="DATA" desc="View GitHub-style matrices, rolling averages, and raw data trends over time." />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 overflow-x-hidden">
          <div className="container-constrained">
            <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-primary">Built for Doers.</h2>
              <p className="text-muted text-base">Early feedback from our closed beta testers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-5 sm:p-6 flex flex-col justify-between gap-6 reveal-on-scroll">
                <p className="text-[14px] text-muted leading-relaxed font-medium">&quot;The lack of red Xs when I miss a day is liberating. It just tells me to do 2 extra problems tomorrow. Incredible UX.&quot;</p>
                <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-primary">JD</div>
                  <div>
                    <div className="text-[13px] font-bold text-primary">John D.</div>
                    <div className="text-[11px] font-medium text-faint">Software Engineer</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-5 sm:p-6 flex flex-col justify-between gap-6 reveal-on-scroll delay-75">
                <p className="text-[14px] text-muted leading-relaxed font-medium">&quot;Finally a tracker that understands rest days. My hypertrophy program requires 5 days, not 7. The logic here is flawless.&quot;</p>
                <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-primary">DM</div>
                  <div>
                    <div className="text-[13px] font-bold text-primary">Sonu M.</div>
                    <div className="text-[11px] font-medium text-faint">Computer Science (IIT)</div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-5 sm:p-6 flex flex-col justify-between gap-6 reveal-on-scroll delay-150">
                <p className="text-[14px] text-muted leading-relaxed font-medium">&quot;Tracking study hours used to stress me out. GoalForge&apos;s pacing algorithm acts like a personal project manager.&quot;</p>
                <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-primary">SM</div>
                  <div>
                    <div className="text-[13px] font-bold text-primary">Sarah M.</div>
                    <div className="text-[11px] font-medium text-faint">Medical Student</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



      </main>

      <PizzaSupportSection />

      <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-16 relative z-10">
        <div className="container-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <Logo size={24} />
                <span className="font-extrabold tracking-tighter text-xl text-primary">GoalForge.</span>
              </div>
              <p className="text-sm text-muted mb-6 leading-relaxed font-medium">
                Adaptive tracking for serious goals. Built with precision and a touch of optimism.
              </p>

              <div className="flex items-center gap-5 text-muted">
                <a href="https://x.com/about_sonu" target="_blank" rel="noopener noreferrer" className="social-icon flex items-center justify-center" aria-label="X/Twitter" title="Follow on X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
                <a href="https://github.com/snmeena/" target="_blank" rel="noopener noreferrer" className="social-icon flex items-center justify-center" aria-label="Github" title="View on Github">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/snmeena/" target="_blank" rel="noopener noreferrer" className="social-icon flex items-center justify-center" aria-label="LinkedIn" title="Connect on LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <Link href="/contact" className="social-icon flex items-center justify-center" aria-label="Mail" title="Email Us">
                  <Mail size={18} />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-extrabold text-primary uppercase tracking-widest mb-5">Product</h4>
              <ul className="flex flex-col gap-4 text-[14px] text-muted font-semibold">
                <li><Link href="#demo" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Pace Engine</Link></li>
                <li><Link href="/features" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-extrabold text-primary uppercase tracking-widest mb-5">Resources</h4>
              <ul className="flex flex-col gap-4 text-[14px] text-muted font-semibold">
                <li><Link href="/philosophy" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Philosophy</Link></li>
                <li><Link href="/why-adaptive" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Why Adaptive?</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">FAQ</Link></li>
                <li><Link href="/feedback" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Report or Suggest</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-extrabold text-primary uppercase tracking-widest mb-5">Legal</h4>
              <ul className="flex flex-col gap-4 text-[14px] text-muted font-semibold">
                <li><Link href="/privacy" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors link-underline inline-block pb-0.5">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted font-bold">
              &copy; <Mounted>{new Date().getFullYear()}</Mounted> GoalForge Tracker. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[13px] text-muted font-bold">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
