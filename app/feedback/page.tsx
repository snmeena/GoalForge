"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { 
    MessageSquare, 
    Send, 
    ArrowLeft, 
    Bug, 
    Lightbulb, 
    Zap, 
    ShieldCheck, 
    Info,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function FeedbackPage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [type, setType] = useState<"bug" | "suggestion" | "feature" | "other">("suggestion");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                setEmail(user.email || "");
            }
        };
        checkUser();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('platform_feedback')
                .insert([{
                    user_id: userId,
                    type,
                    title,
                    description,
                    email: email.trim() || null,
                    status: 'pending'
                }]);

            if (error) throw error;
            
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert("Execution Error: Failed to transmit payload. " + message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-primary selection:bg-primary selection:text-[var(--bg-base)] relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-[var(--border)] bg-[var(--bg-base)]/70 backdrop-blur-xl">
                <div className="container-constrained h-full flex items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <Logo size={28} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-black text-xl tracking-tighter">GoalForge.</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/" className="gf-btn gf-btn-secondary px-5 py-2 text-[13px] font-bold flex items-center gap-2">
                            <ArrowLeft size={16} /> Back
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container-constrained pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {isSuccess ? (
                        <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-700">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                <CheckCircle2 size={48} className="text-primary" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 leading-tight">Payload Received.</h1>
                            <p className="text-[16px] sm:text-[18px] text-muted font-medium leading-relaxed max-w-lg mx-auto mb-10">
                                Your intelligence report has been successfully transmitted to the Forge core. Our engineers will analyze the data immediately.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse">
                                <Sparkles size={16} /> Redirecting to Matrix...
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Hero Section */}
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                                    Strategic Intelligence
                                </div>
                                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.95]">
                                    Report or <span className="text-muted opacity-40 italic">Suggest.</span>
                                </h1>
                                <p className="text-[16px] sm:text-[18px] text-muted font-medium leading-relaxed max-w-xl mx-auto">
                                    Help us optimize the Forge. Whether it&apos;s a tactical bug or a visionary feature suggestion, your input shapes the matrix.
                                </p>
                            </div>

                            {/* Form Section */}
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                                    <MessageSquare size={180} />
                                </div>

                                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                    {/* Type Selection */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { id: 'bug', icon: Bug, label: 'Bug' },
                                            { id: 'suggestion', icon: Lightbulb, label: 'Suggest' },
                                            { id: 'feature', icon: Zap, label: 'Feature' },
                                            { id: 'other', icon: Info, label: 'Other' }
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setType(item.id as "bug" | "suggestion" | "feature" | "other")}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${type === item.id ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-[var(--bg-base)]/50 border-[var(--border)] text-muted hover:border-primary/40'}`}
                                            >
                                                <item.icon size={20} strokeWidth={type === item.id ? 3 : 2} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Inputs */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Brief summary of your report..."
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[15px] font-medium text-primary focus:border-primary transition-all outline-none shadow-inner"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Provide detailed intelligence. Steps to reproduce for bugs, or use-cases for suggestions..."
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[15px] font-medium text-primary focus:border-primary transition-all outline-none shadow-inner resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Contact Email (Optional)</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="engineer@example.com"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[15px] font-medium text-primary focus:border-primary transition-all outline-none shadow-inner"
                                            />
                                            <p className="text-[10px] text-muted font-bold italic ml-1 opacity-60">We may contact you for further technical details.</p>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !title.trim() || !description.trim()}
                                        className="gf-btn gf-btn-primary w-full py-5 text-[15px] font-black shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all group"
                                    >
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        {isSubmitting ? "Transmitting..." : "Submit Intelligence Report"}
                                    </button>
                                </form>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8 border-t border-[var(--border)] opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={20} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Encrypted Transmission</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={20} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Rapid Response Protocol</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={20} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Community Driven Forge</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
