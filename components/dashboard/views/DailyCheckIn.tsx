import React, { useState } from "react";
import { 
    Hash, Repeat, ListTodo, Flame, 
    CheckCircle2, ArrowRight, X, Plus, 
    Activity, ShieldCheck, Cpu, 
    BarChart3, AlertCircle
} from "lucide-react";

import { Goal, ViewState } from "../types";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useGoalMutations } from "@/lib/hooks/useGoalMutations";
import { Mounted } from "@/components/Mounted";

const getSiegeStats = (goal: Goal) => {
    const startDate = goal.startDate ? new Date(goal.startDate) : new Date();
    const deadline = goal.deadline ? new Date(goal.deadline) : new Date();
    const now = new Date();

    const totalDays = Math.max(1, Math.ceil((deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const pct = Math.min(200, Math.round((elapsedDays / totalDays) * 100));

    let level = 'Cold';
    let color = 'bg-blue-500';
    let textColor = 'text-blue-500';
    let borderColor = 'border-blue-500/20';
    let glow = '';

    if (pct >= 175) { level = 'Breach'; color = 'bg-red-900'; textColor = 'text-red-500'; borderColor = 'border-red-900/50'; glow = 'shadow-[0_0_20px_rgba(153,27,27,0.8)] border-red-900'; }
    else if (pct >= 150) { level = 'Siege'; color = 'bg-red-800'; textColor = 'text-red-500'; borderColor = 'border-red-800/50'; glow = 'animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(153,27,27,0.6)] border-red-800'; }
    else if (pct >= 125) { level = 'Critical'; color = 'bg-red-700'; textColor = 'text-red-500'; borderColor = 'border-red-700/50'; glow = 'shadow-[0_0_10px_rgba(185,28,28,0.5)] border-red-700'; }
    else if (pct >= 100) { level = 'Overdue'; color = 'bg-red-600'; textColor = 'text-red-500'; borderColor = 'border-red-600/50'; glow = 'shadow-[0_0_5px_rgba(220,38,38,0.4)] border-red-600'; }
    else if (pct >= 75) { level = 'Hot'; color = 'bg-orange-500'; textColor = 'text-orange-500'; borderColor = 'border-orange-500/20'; }
    else if (pct >= 50) { level = 'Warm'; color = 'bg-amber-500'; textColor = 'text-amber-500'; borderColor = 'border-amber-500/20'; }

    return { pct, daysRemaining, level, color, glow, totalDays, textColor, borderColor };
};

export const DailyCheckIn = () => {
    const { activeGoals, checkedInGoals, activeView, setActiveView } = useDashboardStore();
    const { handleDailyCheckIn, handleUndoCheckIn } = useGoalMutations();

    const isActive = activeView === "daily-check-in";
    const [inputs, setInputs] = useState<Record<string, { value: string; notes: string }>>({});

    const handleInputChange = (goalId: string, field: 'value' | 'notes', val: string) => {
        setInputs(prev => ({
            ...prev,
            [goalId]: {
                ...prev[goalId] || { value: "", notes: "" },
                [field]: val
            }
        }));
    };

    const handleNavigation = (view: ViewState) => {
        setActiveView(view);
    };

    const pendingGoals = activeGoals
        .filter(g => !checkedInGoals.includes(g.id))
        .sort((a, b) => {
            if (a.type === 'siege' && b.type === 'siege') {
                return getSiegeStats(b).pct - getSiegeStats(a).pct;
            }
            if (a.type === 'siege') return -1;
            if (b.type === 'siege') return 1;
            return 0;
        });
    const completedGoalsCount = checkedInGoals.length;
    const totalGoalsCount = activeGoals.length;
    const velocityPercentage = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

    return (
        <div className={`max-w-5xl mx-auto pb-32 transition-all duration-700 w-full ${isActive ? "opacity-100 visible translate-y-0 relative" : "opacity-0 invisible translate-y-12 pointer-events-none absolute top-0"}`}>

            {/* ── TOP MISSION CONTROL ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-end">
                <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary animate-in fade-in duration-1000">
                        <Cpu size={12} className="animate-pulse" /> Operational Pulse
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-primary leading-[0.95]">
                        Daily <span className="text-muted opacity-40 italic">Sync.</span>
                    </h1>
                    <p className="text-[15px] sm:text-[16px] text-muted font-medium max-w-xl leading-relaxed">
                        <Mounted>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Mounted>
                        <span className="mx-4 opacity-10">|</span>
                        Transmit intelligence and sustain peak execution velocity across all active matrices.
                    </p>
                </div>

                {totalGoalsCount > 0 && (
                    <div className="lg:col-span-4 group relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-6 shadow-xl backdrop-blur-xl flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-muted uppercase tracking-[0.25em]">Velocity Index</span>
                                <BarChart3 size={16} className="text-primary opacity-40" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div className="text-5xl font-mono font-black text-primary tracking-tighter">
                                    {velocityPercentage}<span className="text-lg opacity-20 ml-1">%</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[18px] font-black text-primary/80 flex items-center gap-1.5 justify-end">
                                        {completedGoalsCount}<span className="text-muted/20 text-sm">/</span>{totalGoalsCount}
                                    </div>
                                    <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Modules Ready</div>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)] relative p-[1px] shadow-inner">
                                <div 
                                    className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                    style={{ width: `${velocityPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── EXECUTION PORTAL ── */}
            {totalGoalsCount === 0 ? (
                <div className="h-[400px] border border-dashed border-[var(--border)] rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-[var(--bg-surface)]/20 backdrop-blur-md animate-in fade-in zoom-in-95 duration-1000 group">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-muted shadow-lg relative transition-all group-hover:scale-105 duration-500">
                        <Activity size={32} className="opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[var(--bg-base)] shadow-xl animate-ping" />
                    </div>
                    <div className="text-center space-y-2 px-6">
                        <h3 className="text-primary font-black text-2xl tracking-tight">Systems Idle</h3>
                        <p className="text-muted/50 text-[14px] font-medium max-w-xs mx-auto">No active operational matrices detected. Initialize a sequence to begin tracking.</p>
                    </div>
                    <button 
                        onClick={() => handleNavigation("dashboard")} 
                        className="gf-btn gf-btn-primary px-8 py-4 text-[13px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] flex items-center gap-3"
                    >
                        <Plus size={18} strokeWidth={3} /> Initialize Matrix
                    </button>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Pending Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 opacity-30 group/header">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-3 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Mission Queue
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
                        </div>

                        {pendingGoals.length === 0 ? (
                            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] p-12 text-center animate-in zoom-in-95 duration-700 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-10" />
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-primary mb-2 tracking-tight">Phase Finalized.</h3>
                                <p className="text-[14px] text-muted font-medium max-w-xs mx-auto leading-relaxed">
                                    All operational matrices for this cycle are synchronized and verified.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingGoals.map(goal => {
                                    const currentInput = inputs[goal.id] || { value: "", notes: "" };
                                    const isVolume = goal.type === 'volume';
                                    const isRoutine = goal.type === 'routine';
                                    const isPipeline = goal.type === 'pipeline';
                                    const isSiege = goal.type === 'siege';
                                    const nextStep = isPipeline ? goal.pipelineTasks?.[goal.progress || 0] : null;
                                    const siegeStats = isSiege ? getSiegeStats(goal) : null;

                                    return (
                                        <div key={goal.id} className={`group relative bg-[var(--bg-surface)] border ${isSiege ? siegeStats!.borderColor : 'border-[var(--border)] hover:border-primary/20'} rounded-[1.75rem] p-5 sm:p-6 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-0.5 overflow-hidden ${isSiege ? siegeStats!.glow : ''}`}>
                                            {/* Accent glow */}
                                            <div className={`absolute -left-20 -top-20 w-40 h-40 ${isSiege ? siegeStats!.color : 'bg-primary/5'} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                            
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 relative z-10">
                                                {/* Meta Info */}
                                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                                    <div className={`w-14 h-14 shrink-0 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-center text-muted opacity-40 group-hover:${isSiege ? siegeStats!.textColor : 'text-primary'} group-hover:opacity-100 group-hover:${isSiege ? siegeStats!.color : 'bg-primary/5'} transition-all duration-500 group-hover:scale-105 shadow-inner`}>
                                                        {goal.type === "volume" && <Hash size={24} />}
                                                        {goal.type === "routine" && <Repeat size={24} />}
                                                        {goal.type === "pipeline" && <ListTodo size={24} />}
                                                        {goal.type === "siege" && <Flame size={24} />}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-3 mb-1.5">
                                                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-primary/60 transition-colors">
                                                                {goal.type} Engine
                                                            </span>
                                                            {isSiege && siegeStats && (
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${siegeStats.color} text-white`}>
                                                                    {siegeStats.level} ({siegeStats.pct}%)
                                                                </span>
                                                            )}
                                                            {goal.priority === 'high' && !isSiege && <span className="flex items-center gap-1 text-[8px] font-bold text-red-500/50 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 uppercase"><AlertCircle size={8} /> High Priority</span>}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-primary tracking-tight truncate">{goal.title}</h3>
                                                        {!isSiege && !isPipeline && (
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <div className="h-1 w-16 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)]">
                                                                    <div className="h-full bg-primary/30 rounded-full" style={{ width: `${Math.min(100, (goal.progress || 0) / (goal.volumeTarget ? parseInt(goal.volumeTarget) : 100) * 100)}%` }} />
                                                                </div>
                                                                <span className="text-[10px] font-mono font-bold text-muted/40 uppercase tracking-widest">
                                                                    {goal.progress || 0} / {goal.volumeTarget || "∞"}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {isSiege && siegeStats && (
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <div className="h-1 w-16 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)]">
                                                                    <div className={`h-full ${siegeStats.color} transition-all duration-500`} style={{ width: `${Math.min(100, siegeStats.pct)}%` }} />
                                                                </div>
                                                                <span className="text-[10px] font-mono font-bold text-muted/40 uppercase tracking-widest">
                                                                    {siegeStats.daysRemaining > 0 ? `${siegeStats.daysRemaining}d left` : `${Math.abs(siegeStats.daysRemaining)}d overdue`}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Controls */}
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:min-w-[400px] justify-end">
                                                    {isVolume && (
                                                        <>
                                                            <div className="relative flex-1 group/input sm:max-w-[140px]">
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="00"
                                                                    className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3.5 px-4 text-sm font-mono font-black text-primary focus:border-primary/40 outline-none shadow-inner transition-all"
                                                                    value={currentInput.value}
                                                                    onChange={(e) => handleInputChange(goal.id, 'value', e.target.value)}
                                                                />
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted opacity-10 pointer-events-none uppercase tracking-widest">
                                                                    {goal.volumeUnit || "Units"}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDailyCheckIn(goal.id, parseInt(currentInput.value))}
                                                                disabled={!currentInput.value || parseInt(currentInput.value) <= 0}
                                                                className="gf-btn gf-btn-primary px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg disabled:opacity-5 disabled:grayscale transition-all"
                                                            >
                                                                Sync
                                                            </button>
                                                        </>
                                                    )}

                                                    {isRoutine && (
                                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                                            <button 
                                                                onClick={() => handleDailyCheckIn(goal.id, 1)}
                                                                className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-primary text-[var(--bg-base)] text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-lg"
                                                            >
                                                                Completed
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    handleInputChange(goal.id, 'notes', "Missed today.");
                                                                    handleDailyCheckIn(goal.id, 0, "Missed");
                                                                }}
                                                                className="px-5 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-muted/40 text-[11px] font-black uppercase tracking-[0.2em] hover:text-red-500/60 hover:bg-red-500/5 hover:border-red-500/10 transition-all"
                                                            >
                                                                Skip
                                                            </button>
                                                        </div>
                                                    )}

                                                    {isPipeline && (
                                                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                                            {nextStep ? (
                                                                <button 
                                                                    onClick={() => handleDailyCheckIn(goal.id, 1)}
                                                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-[var(--bg-base)] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                                                                >
                                                                    Execute Stage <ArrowRight size={14} strokeWidth={3} />
                                                                </button>
                                                            ) : (
                                                                <div className="px-6 py-3 rounded-xl bg-green-500/5 border border-green-500/10 text-green-500/60 text-[10px] font-black uppercase tracking-[0.2em]">Finalized</div>
                                                            )}
                                                            {nextStep && <p className="text-[10px] text-muted opacity-40 font-bold uppercase tracking-widest hidden sm:block">Next: {nextStep.text}</p>}
                                                        </div>
                                                    )}

                                                    {isSiege && (
                                                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-end">
                                                            <button 
                                                                onClick={() => {
                                                                    const unlock = prompt("What finally unlocked this?");
                                                                    if (unlock) {
                                                                        handleDailyCheckIn(goal.id, 1, `Unlocked: ${unlock}`);
                                                                    }
                                                                }}
                                                                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl ${siegeStats!.color} text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3`}
                                                            >
                                                                Mark Done
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Finalized Section */}
                    {completedGoalsCount > 0 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="flex items-center gap-6 opacity-20 group/header">
                                <h2 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] flex items-center gap-3 shrink-0">
                                    <ShieldCheck size={14} className="text-green-500/60" />
                                    Operational Log
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {activeGoals.filter(g => checkedInGoals.includes(g.id)).map(goal => (
                                    <div key={goal.id} className="group flex items-center justify-between bg-[var(--bg-surface)]/40 border border-[var(--border)] rounded-2xl p-4 transition-all duration-500 hover:bg-[var(--bg-surface)]">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center justify-center text-green-500/40">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-[13px] font-bold text-primary truncate opacity-40 group-hover:opacity-80 transition-opacity">{goal.title}</h3>
                                                <p className="text-[8px] font-black text-muted/30 uppercase tracking-[0.2em]">Verified Update</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUndoCheckIn(goal.id)}
                                            className="p-2 rounded-lg text-muted opacity-0 group-hover:opacity-40 hover:text-red-500 hover:bg-red-500/5 transition-all"
                                            title="Undo Protocol"
                                        >
                                            <X size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};