"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Check, Pizza, Heart, ChevronDown, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const PizzaSupportSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPizza, setSelectedPizza] = useState<number | null>(null);
    const [paymentDone, setPaymentDone] = useState(false);

    const pizzaMenu = [
        { name: "Classic Margherita", price: "$5", desc: "Basic fuel for minor bug fixes.", icon: "🧀" },
        { name: "Paneer Powerhouse", price: "$12", desc: "Premium energy for complex logic engines. I love this one!", icon: "🔥", favorite: true },
        { name: "Double Pepperoni", price: "$18", desc: "Sustenance for overnight feature sprints.", icon: "🍕" },
        { name: "The Forge Master", price: "$25", desc: "Unlocks ultimate developer focus mode.", icon: "👑" },
    ];

    const handlePizzaSelect = (idx: number) => {
        setSelectedPizza(idx);
        setPaymentDone(false);
    };

    return (
        <div id="pizza-manifesto" className="mt-24 sm:mt-40 mb-20 px-4 sm:px-6">
            <div className="relative group max-w-5xl mx-auto">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] sm:rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-16 overflow-hidden">
                    <div className="absolute -top-12 -right-12 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none hidden sm:block">
                        <Pizza size={320} />
                    </div>

                    <div className="max-w-4xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest mb-6 sm:mb-8">
                            The &quot;Anti-SaaS&quot; Manifesto
                        </div>
                        <h2 className="text-3xl sm:text-6xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.95]">
                            We&apos;re funded by <br />
                            <span className="text-muted opacity-40 italic">Margherita & Logic.</span>
                        </h2>
                        <p className="text-[14px] sm:text-[18px] text-muted font-medium leading-relaxed mb-8 sm:mb-12 max-w-2xl">
                            GoalForge is a labor of love for executors. We don&apos;t have venture capital, and we don&apos;t want it.
                            Our only &quot;shareholders&quot; are the people who use the matrix to win.
                            If you&apos;re one of them, help us keep the code clean and the servers hot.
                        </p>

                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(!isMenuOpen);
                                        if (isMenuOpen) {
                                            setSelectedPizza(null);
                                            setPaymentDone(false);
                                        }
                                    }}
                                    className="gf-btn gf-btn-primary w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-[14px] sm:text-[15px] font-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] group"
                                >
                                    <Pizza className={`w-5 h-5 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                    {isMenuOpen ? 'Close Pizza Menu' : 'Support Development'}
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-surface)] bg-primary/10 flex items-center justify-center">
                                        <Heart size={14} className="text-primary/40 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] sm:text-[13px] font-black italic">Be the first to support</span>
                                        <span className="text-[10px] sm:text-[11px] text-muted font-bold uppercase tracking-widest">Initialization Pending</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Menu Container */}
                            <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isMenuOpen ? 'max-h-[1500px] sm:max-h-[800px] opacity-100 mt-12' : 'max-h-0 opacity-0'}`}>
                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                    {/* Table / List Container */}
                                    <div className="flex-1 bg-[var(--bg-base)]/50 border border-[var(--border)] rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl w-full">
                                        {/* Desktop Table View */}
                                        <div className="hidden sm:block">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-[var(--border)] bg-primary/5">
                                                        <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-muted">Category</th>
                                                        <th className="px-6 py-4 text-[12px] font-black uppercase tracking-widest text-muted text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pizzaMenu.map((item, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className={`group/row border-b border-[var(--border)] last:border-0 hover:bg-primary/10 transition-colors cursor-pointer ${selectedPizza === idx ? 'bg-primary/5' : ''}`}
                                                            onClick={() => handlePizzaSelect(idx)}
                                                        >
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">{item.icon}</span>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-black text-[15px]">{item.name}</span>
                                                                            {item.favorite && (
                                                                                <span className="px-2 py-0.5 rounded-full bg-primary text-[var(--bg-base)] text-[9px] font-black flex items-center gap-1">
                                                                                    <Sparkles size={8} /> DEV FAVORITE
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-[12px] text-muted font-medium">{item.desc}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                <span className="font-mono font-black text-lg">{item.price}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile List View */}
                                        <div className="sm:hidden divide-y divide-[var(--border)]">
                                            {pizzaMenu.map((item, idx) => (
                                                <div 
                                                    key={idx}
                                                    className={`p-5 space-y-3 cursor-pointer transition-colors ${selectedPizza === idx ? 'bg-primary/5' : 'hover:bg-primary/10'}`}
                                                    onClick={() => handlePizzaSelect(idx)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{item.icon}</span>
                                                            <div>
                                                                <div className="font-black text-[15px]">{item.name}</div>
                                                                {item.favorite && (
                                                                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-primary text-[var(--bg-base)] text-[8px] font-black items-center gap-1">
                                                                        <Sparkles size={8} /> DEV FAVORITE
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="font-mono font-black text-primary">{item.price}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted font-medium leading-relaxed">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-primary text-[var(--bg-base)] text-center text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">
                                            Select a slice to initialize transaction
                                        </div>
                                    </div>

                                    {/* QR Code Column */}
                                    <div className={`transition-all duration-500 ease-out ${selectedPizza !== null ? 'opacity-100 translate-x-0 scale-100 w-full lg:w-72' : 'opacity-0 translate-y-4 scale-95 h-0 overflow-hidden pointer-events-none'}`}>
                                        <div className="bg-[var(--bg-surface)] border border-primary/20 rounded-2xl sm:rounded-3xl p-6 text-center space-y-4 shadow-[0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden group/qr-card">
                                            {/* Flash effect */}
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover/qr-card:opacity-100 transition-opacity">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmerLoop_2s_infinite]" />
                                            </div>

                                            {paymentDone ? (
                                                <div className="py-8 sm:py-12 animate-in zoom-in-95 duration-500 text-center">
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20"></div>
                                                        <Heart className="text-primary fill-primary" size={32} />
                                                    </div>
                                                    <h3 className="text-xl sm:text-2xl font-black mb-3 tracking-tighter">You&apos;re a Legend!</h3>
                                                    <p className="text-[13px] sm:text-[14px] text-muted font-medium leading-relaxed px-2">
                                                        Your support is the high-octane fuel that keeps GoalForge evolving.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setPaymentDone(false);
                                                            setSelectedPizza(null);
                                                        }}
                                                        className="mt-8 gf-btn gf-btn-secondary px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em]"
                                                    >
                                                        Back to Matrix
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative group/qr max-w-[240px] mx-auto lg:max-w-none">
                                                        <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover/qr:opacity-100 transition duration-700 animate-pulse"></div>
                                                        <img
                                                            src="/QR_Code.jpg"
                                                            alt="Support QR Code"
                                                            className="relative rounded-xl border border-[var(--border)] w-full aspect-square object-cover"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[12px] font-black uppercase tracking-tighter text-muted">Scan to Forge</p>
                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-[14px] sm:text-[15px] text-primary font-black uppercase tracking-widest">
                                                                {selectedPizza !== null ? pizzaMenu[selectedPizza].name : ''}
                                                            </p>
                                                            <p className="text-[18px] sm:text-[20px] text-primary font-black font-mono">
                                                                {selectedPizza !== null ? pizzaMenu[selectedPizza].price : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6 border-t border-[var(--border)] space-y-4">
                                                        <div className="space-y-1.5">
                                                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">Payment completed?</p>
                                                            <p className="text-[10px] text-muted italic font-medium">&quot;I trust you, you won&apos;t lie.&quot;</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setPaymentDone(true)}
                                                            className="w-full py-4 rounded-xl bg-emerald-500 text-white text-[12px] font-black hover:bg-emerald-600 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group/btn"
                                                        >
                                                            <Check size={14} strokeWidth={4} className="group-hover/btn:scale-125 transition-transform" />
                                                            Yes, Payment Done
                                                        </button>
                                                    </div>

                                                    <div className="pt-2">
                                                        <div className="text-[9px] font-black text-primary/40 flex items-center justify-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping"></span>
                                                            AWAITING PAYLOAD
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-primary font-sans selection:bg-primary selection:text-[var(--bg-base)]">
            <nav className="fixed top-0 w-full z-50 bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border)] transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <Logo size={28} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-extrabold text-xl tracking-tight text-primary">GoalForge.</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>
                        <Link href="/why-adaptive" className="text-[13px] font-bold text-muted hover:text-primary transition-colors hidden sm:block">
                            Why Adaptive?
                        </Link>
                        <Link href="/login?mode=signup" className="gf-btn gf-btn-primary px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:-translate-y-0.5 transition-all">
                            Start Forging Free
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 max-w-7xl mx-auto">
                <div className="px-6">
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-primary mb-6">
                            Pure Performance. <span className="text-muted opacity-50 italic">Zero Paywalls.</span>
                        </h1>
                        <p className="text-[16px] sm:text-[20px] text-muted max-w-2xl mx-auto leading-relaxed font-medium">
                            GoalForge is 100% free for high-intensity execution. We don&apos;t believe in paywalling your self-improvement.
                        </p>
                    </div>
                </div>
                <PizzaSupportSection />
            </main>
        </div>
    );
}