import React, { useState, useEffect } from "react";
import { 
    ChevronLeft, Zap, CheckCircle2, Activity, Calendar, 
    Target, Shield, Info, ListTodo, MessageSquare, 
    Navigation, ArrowRight, AlertTriangle, GitGraph, Check 
} from "lucide-react";
import { Goal } from "../types";
import { calculatePace, PaceInput } from "@/lib/page-engine";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/Logo";

interface SmartTrackingModalProps {
    goal: Goal;
    onClose: () => void;
}

export const SmartTrackingModal = ({ goal, onClose }: SmartTrackingModalProps) => {
    const supabase = createClient();
    const [logs, setLogs] = useState<{ date: string, progress_added: number, execution_notes?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('goal_logs')
                    .select('date, progress_added, execution_notes')
                    .eq('goal_id', goal.id)
                    .order('date', { ascending: false });

                if (!error && data) {
                    setLogs(data);
                }
            } catch (err) {
                console.error("Error fetching logs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [goal.id]);

    const today = new Date();
    
    let deadline = goal.deadline;
    let start = goal.startDate ? new Date(goal.startDate) : new Date(today);
    
    if (!goal.startDate) {
        const fallbackStart = new Date(today);
        fallbackStart.setDate(today.getDate() - 7);
        start = fallbackStart;
    }
    
    if (!deadline) {
        const future = new Date(today);
        future.setDate(today.getDate() + 30);
        deadline = future.toISOString().split("T")[0];
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysTotal = Math.max(1, Math.round((new Date(deadline).getTime() - start.getTime()) / msPerDay) + 1);

    let calculatedTargetValue = 100;
    if (goal.type === "volume" && goal.volumeTarget) {
        calculatedTargetValue = parseInt(goal.volumeTarget);
    } else if (goal.type === "routine" && goal.routineFreq) {
        const count = goal.routineFreq.type === 'flexible' ? goal.routineFreq.count : goal.routineFreq.days.length;
        calculatedTargetValue = Math.ceil((daysTotal / 7) * count);
    } else if (goal.type === "pipeline" && goal.pipelineTasks) {
        calculatedTargetValue = goal.pipelineTasks.length;
    }

    const paceInput: PaceInput = {
        targetValue: Math.max(1, calculatedTargetValue),
        startDate: start.toISOString().split("T")[0],
        endDate: deadline,
        completedValue: goal.progress || 0
    };

    const paceResult = calculatePace(paceInput);

    const isBrandNew = paceResult.status === "NOT_STARTED" || (goal.progress === 0 && paceResult.daysElapsed <= 1);
    const isSiege = goal.type === "siege";
    const isPipeline = goal.type === "pipeline";

    const statusMap = {
        "NOT_STARTED": { text: "text-muted", bg: "bg-muted/10", bgSoft: "bg-muted/5", border: "border-[var(--border)]", label: "Initialized", icon: <Target size={14} /> },
        "AHEAD": { text: "text-blue-500/70", bg: "bg-blue-500/20", bgSoft: "bg-blue-500/5", border: "border-blue-500/10", label: "Ahead of Pace", icon: <Zap size={14} /> },
        "ON_TRACK": { text: "text-green-500/70", bg: "bg-green-500/20", bgSoft: "bg-green-500/5", border: "border-green-500/10", label: "On Track", icon: <CheckCircle2 size={14} /> },
        "BEHIND": { text: "text-amber-500/70", bg: "bg-amber-500/20", bgSoft: "bg-amber-500/5", border: "border-amber-500/10", label: "Behind Pace", icon: <Activity size={14} /> },
        "CRITICAL": { text: "text-red-500/70", bg: "bg-red-500/20", bgSoft: "bg-red-500/5", border: "border-red-500/10", label: "Critical Deficit", icon: <Activity size={14} /> },
        "COMPLETED": { text: "text-green-500/70", bg: "bg-green-500/20", bgSoft: "bg-green-500/5", border: "border-green-500/10", label: "Completed", icon: <CheckCircle2 size={14} /> },
        "FAILED": { text: "text-red-500/70", bg: "bg-red-500/20", bgSoft: "bg-red-500/5", border: "border-red-500/10", label: "Failed", icon: <Shield size={14} /> }
    };
    const currentStatus = statusMap[paceResult.status];

    const heatmapDays = Array.from({ length: 60 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (59 - i));
        const dateStr = d.toISOString().split('T')[0];
        const dayLogs = logs.filter(l => l.date === dateStr);
        const totalProgress = dayLogs.reduce((acc, curr) => acc + curr.progress_added, 0);
        return { date: dateStr, value: totalProgress };
    });

    return (
        <div id="focus-target" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* ── HEADER NAVIGATION ── */}
            <div className="flex items-center justify-between pb-6 mb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 rounded-xl border border-[var(--border)] text-muted/50 hover:text-primary hover:bg-primary/5 transition-all">
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-primary/80 tracking-tight leading-none">Matrix Intelligence</h2>
                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.2em] mt-2">Deep Execution Analysis</p>
                    </div>
                </div>
                {!isSiege && (
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${currentStatus.bgSoft} ${currentStatus.border} ${currentStatus.text}`}>
                        {currentStatus.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{currentStatus.label}</span>
                    </div>
                )}
            </div>

            {/* ── MAIN CONTENT CARD ── */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl transition-all duration-500">
                
                {/* ── BROWSER DECO ── */}
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[9px] font-bold text-muted/30 tracking-[0.2em] uppercase flex items-center gap-2">
                        <Logo size={12} className="opacity-40" /> Pace Engine v2.0 Live
                    </span>
                    <div className="w-8" /> {/* Spacer for balance */}
                </div>

                <div className="p-5 sm:p-12 space-y-8 sm:space-y-12">
                    {/* ── TITLE & PROGRESS OVERVIEW ── */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-[var(--bg-base)] border border-[var(--border)] text-muted/60">
                                    {goal.type} ENGINE
                                </span>
                                {goal.priority === 'high' && (
                                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500/50 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10">
                                        <AlertTriangle size={10} /> HIGH PRIORITY
                                    </span>
                                )}
                            </div>
                            <h3 className="text-3xl sm:text-5xl font-black text-primary/90 tracking-tighter leading-tight">{goal.title || "Unnamed Matrix"}</h3>
                            <div className="p-4 rounded-2xl bg-[var(--bg-base)]/30 border border-[var(--border)] max-w-lg">
                                <p className="text-[12px] sm:text-[13px] font-medium text-muted/60 leading-relaxed italic">
                                    &quot;{goal.siegeNotes || "No detailed strategic intelligence notes provided for this execution matrix."}&quot;
                                </p>
                            </div>
                        </div>

                        {!isSiege && (
                            <div className="bg-gradient-to-br from-[var(--bg-base)] to-transparent p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border)] w-full sm:w-auto sm:min-w-[240px] shadow-inner text-center sm:text-right">
                                <div className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em] mb-2">Execution Quota</div>
                                <div className={`text-4xl sm:text-5xl font-mono font-black tracking-tighter ${isBrandNew ? 'text-muted/20' : currentStatus.text}`}>
                                    {goal.progress || 0} <span className="text-lg sm:text-xl text-muted/20 font-normal">/ {paceInput.targetValue}</span>
                                </div>
                                <div className="text-[9px] sm:text-[10px] font-bold text-muted/20 uppercase tracking-widest mt-1">Total {goal.volumeUnit || "Units"}</div>
                            </div>
                        )}
                    </div>

                    {/* ── VELOCITY BAR ── */}
                    {!isSiege && !isPipeline && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="text-[11px] font-bold text-muted/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Activity size={14} className="opacity-40" /> Progress Velocity
                                </div>
                                <span className={`font-mono text-sm font-bold ${isBrandNew ? 'text-muted/40' : 'text-primary/70'}`}>{paceResult.percentComplete}%</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)] relative p-[1px]">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden ${isBrandNew ? 'bg-muted/10' : currentStatus.bg}`}
                                    style={{ width: `${paceResult.percentComplete}%` }}
                                >
                                    {!isBrandNew && <div className="shimmer-progress opacity-20" />}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STATS ANALYTICS ── */}
                    {!isSiege && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {[
                                { label: "Remaining", val: paceResult.daysLeft, sub: "Days", icon: Calendar },
                                { label: isPipeline ? "Steps Left" : "Req. Pace", val: isPipeline ? (goal.pipelineTasks?.length || 0) - (goal.progress || 0) : Math.ceil(paceResult.adjustedDailyQuota), sub: isPipeline ? "" : "/Day", icon: Zap },
                                { label: "Variance", val: isBrandNew ? "0" : (paceResult.gap > 0 ? "+" + Math.round(paceResult.gap) : Math.round(paceResult.gap)), sub: "Units", icon: Target },
                                { label: "Status", val: isBrandNew ? "Ready" : paceResult.status.replace('_', ' '), sub: "", icon: Activity }
                            ].map((stat, i) => (
                                <div key={i} className="bg-[var(--bg-base)]/20 border border-[var(--border)] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all hover:bg-[var(--bg-base)]/40 hover:border-primary/10 shadow-sm group">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-500">
                                        <stat.icon size={14} className="text-muted/40 group-hover:text-primary/40" />
                                    </div>
                                    <div className={`text-lg sm:text-xl font-mono font-black tracking-tight mb-0.5 sm:mb-1 ${isBrandNew ? 'text-muted/40' : 'text-primary/70'}`}>{stat.val}</div>
                                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-muted/30">{stat.label} <span className="hidden sm:inline">{stat.sub}</span></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── EXECUTION LOGS (HEATMAP) ── */}
                    <div className="bg-gradient-to-b from-[var(--bg-base)]/40 to-transparent p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border)] shadow-inner">
                        <div className="text-[10px] sm:text-[11px] font-bold text-muted/40 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center justify-between">
                            <span className="flex items-center gap-2"><GitGraph size={14} className="opacity-40" /> Consistency Telemetry</span>
                            <span className="text-[8px] sm:text-[9px] font-mono opacity-20 lowercase">{isBrandNew ? "(awaiting data)" : "(60-day window)"}</span>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-start">
                            {heatmapDays.map((day, i) => {
                                const intensity = day.value === 0 ? 0 : (day.value > 5 ? 3 : (day.value > 2 ? 2 : 1));
                                return (
                                    <div
                                        key={i}
                                        title={`${day.date}: ${day.value} logged`}
                                        className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-[2px] sm:rounded-[3px] transition-all duration-700 ${intensity === 0 ? 'bg-[var(--bg-surface)] border border-[var(--border)] opacity-20 hover:opacity-50' : intensity === 1 ? 'bg-primary/10 border border-primary/5' : intensity === 2 ? 'bg-primary/30' : 'bg-primary/60 shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)] scale-110'}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* ── PIPELINE FLOW ── */}
                    {isPipeline && (
                        <div className="space-y-6">
                            <div className="text-[11px] font-bold text-muted/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <ListTodo size={14} className="opacity-40" /> Sequential Milestones
                            </div>
                            <div className="space-y-3">
                                {goal.pipelineTasks?.map((task, idx) => {
                                    const isDone = idx < (goal.progress || 0);
                                    const isNext = idx === (goal.progress || 0);
                                    return (
                                        <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isDone ? 'bg-green-500/[0.02] border-green-500/10 opacity-40' : isNext ? 'bg-primary/[0.02] border-primary/20 scale-[1.01] shadow-sm' : 'bg-transparent border-[var(--border)] opacity-20'}`}>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold ${isDone ? 'bg-green-500/10 border-green-500/20 text-green-500/50' : isNext ? 'border-primary/40 text-primary/40' : 'border-[var(--border)] text-muted/20'}`}>
                                                {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
                                            </div>
                                            <span className={`text-[14px] font-bold ${isDone ? 'text-primary/30 line-through' : 'text-primary/70'}`}>
                                                {task.text}
                                            </span>
                                            {isNext && <ArrowRight size={14} className="ml-auto text-primary/30 animate-pulse" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── SYSTEM FEEDBACK ── */}
                    {!isSiege && (
                        <div className={`p-6 rounded-2xl border text-[13px] font-medium flex items-start gap-4 transition-all ${currentStatus.bgSoft} ${currentStatus.border} ${currentStatus.text}`}>
                            <div className={`mt-0.5 shrink-0 opacity-60 ${isBrandNew ? 'animate-pulse' : ''}`}>
                                <Info size={18} />
                            </div>
                            <p className="leading-relaxed opacity-80">{paceResult.message}</p>
                        </div>
                    )}

                    {/* ── EXECUTION LOGS ── */}
                    {logs.length > 0 && (
                        <div className="space-y-6">
                            <div className="text-[11px] font-bold text-muted/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <MessageSquare size={14} className="opacity-40" /> Historical Logs
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-[var(--bg-base)]/40 border border-[var(--border)] flex flex-col gap-2 hover:bg-[var(--bg-base)] transition-all">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-muted/30">{log.date}</span>
                                            <span className="text-[10px] font-black text-primary/40 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">+{log.progress_added}</span>
                                        </div>
                                        {log.execution_notes && (
                                            <p className="text-[12px] font-medium text-muted/60 leading-relaxed">&quot;{log.execution_notes}&quot;</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};