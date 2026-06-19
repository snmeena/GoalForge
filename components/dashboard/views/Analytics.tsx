import React, { useState, useMemo } from "react";
import { Zap, Hash, Repeat, BarChart2, LayoutDashboard } from "lucide-react";
import { useDashboardStore } from "@/lib/store/useDashboardStore";

import { Database } from "@/lib/database.types";

type GoalLog = Database['public']['Tables']['goal_logs']['Row'];

export const Analytics = () => {
    const { activeGoals, activeView } = useDashboardStore();
    const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
    const [logs] = useState<GoalLog[]>([]);
    const [streak] = useState(0);
    const [efficiency] = useState(0);
    const chartData = useMemo(() => {
        const range = timeRange === '7d' ? 7 : 30;
        const days = Array.from({ length: range }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (range - 1 - i));
            return d.toISOString().split('T')[0];
        });

        return days.map(date => {
            const dateObj = new Date(date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleDateString('en-US', { month: 'narrow' });
            
            return {
                fullDate: date,
                label: timeRange === '7d' 
                    ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                    : `${day} ${month}`,
                count: logs.filter(l => l.date === date).length || 0
            };
        });
    }, [timeRange, logs]);

    const isActive = activeView === "analytics";

    return (
        <div className={`max-w-5xl mx-auto space-y-10 pb-32 transition-all duration-500 w-full ${isActive ? "opacity-100 visible translate-y-0 relative" : "opacity-0 invisible translate-y-4 pointer-events-none absolute top-0"}`}>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary mb-1 flex items-center gap-4">
                        Execution <span className="text-muted opacity-30 italic">Analytics.</span>
                    </h1>
                    <p className="text-[14px] font-medium text-muted mt-2">
                        Quantitative analysis of your goal-seeking behavior and engine efficiency.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[var(--bg-surface)]/50 border border-[var(--border)] p-1.5 rounded-2xl backdrop-blur-md">
                    <div className="px-4 py-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-[11px] font-black text-primary uppercase tracking-widest shadow-inner">
                        Live Feed
                    </div>
                    <div className="px-4 py-2 text-[11px] font-bold text-muted uppercase tracking-widest">
                        Historical
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Engine Efficiency", val: `${efficiency}%`, icon: Zap, color: "text-amber-500" },
                    { label: "Total Logs", val: logs.length.toString(), icon: Hash, color: "text-blue-500" },
                    { label: "Active Matrices", val: activeGoals.length.toString(), icon: LayoutDashboard, color: "text-primary" },
                    { label: "Consistency Streak", val: `${streak} Days`, icon: Repeat, color: "text-green-500" }
                ].map((stat, i) => (
                    <div key={i} className="group bg-[var(--bg-surface)]/80 border-2 border-[var(--border)] rounded-2xl p-5 flex flex-col hover:border-primary/30 transition-all backdrop-blur-md relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={40} className={stat.color} />
                        </div>
                        <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3 relative z-10">{stat.label}</div>
                        <div className="text-3xl font-mono font-black text-primary relative z-10 tracking-tighter">{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--bg-surface)]/50 border border-[var(--border)] rounded-[2.5rem] p-6 sm:p-6 backdrop-blur-md relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                    <div className="flex items-center justify-between mb-10">
                        <div className="text-[12px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Performance Matrix
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d')}
                            className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[11px] font-bold text-muted outline-none focus:border-primary transition-all cursor-pointer"
                            aria-label="Select time range"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>

                    <div className={`h-64 flex items-end justify-between ${timeRange === '7d' ? 'gap-4 px-4' : 'gap-1 px-1'} pb-4`}>
                        {chartData.map((data, idx) => {
                            const maxCount = Math.max(...chartData.map(d => d.count), 1);
                            const height = (data.count / maxCount) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group/bar">
                                    <div className={`w-full bg-[var(--bg-base)] relative border border-[var(--border)] h-48 ${timeRange === '30d' ? 'rounded-md' : 'rounded-xl'}`}>
                                        <div 
                                            className={`absolute bottom-0 w-full bg-primary/40 group-hover/bar:bg-primary transition-all duration-700 ${timeRange === '30d' ? 'rounded-b-md rounded-t-[4px]' : 'rounded-b-xl rounded-t-lg'}`} 
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--bg-surface)] border border-[var(--border)] px-2 py-1 rounded-md text-[9px] font-black text-primary opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                                {data.count} Logs
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-bold text-muted uppercase tracking-tighter ${timeRange === '30d' ? 'text-[8px] scale-90' : ''}`}>
                                        {data.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--bg-surface)]/50 border border-[var(--border)] rounded-[2.5rem] p-6 backdrop-blur-md shadow-sm">
                        <h3 className="text-[14px] font-black text-primary uppercase tracking-widest mb-6">Engine Distribution</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Volume', count: activeGoals.filter(g => g.type === 'volume').length, color: 'bg-blue-500' },
                                { label: 'Routine', count: activeGoals.filter(g => g.type === 'routine').length, color: 'bg-green-500' },
                                { label: 'Pipeline', count: activeGoals.filter(g => g.type === 'pipeline').length, color: 'bg-amber-500' },
                                { label: 'Siege', count: activeGoals.filter(g => g.type === 'siege').length, color: 'bg-red-500' }
                            ].map(item => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                        <span className="text-muted">{item.label}</span>
                                        <span className="text-primary">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} opacity-60`}
                                            style={{ width: `${(item.count / (activeGoals.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary text-[var(--bg-base)] rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[var(--bg-base)]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-[14px] font-black uppercase tracking-widest mb-4 opacity-80">Predictive Pace</h3>
                        <div className="text-4xl font-black tracking-tighter mb-2">{efficiency > 50 ? 'Steady.' : 'At Risk.'}</div>
                        <p className="text-[12px] font-medium opacity-70 leading-relaxed">
                            Based on current velocity, you are on track to complete all active matrices within {
                                (() => {
                                    const remainingTargets = activeGoals.reduce((acc, g) => acc + Math.max(0, (parseInt(g.volumeTarget || "0") || 0) - (g.progress || 0)), 0);
                                    return remainingTargets > 0 ? Math.max(1, Math.ceil(remainingTargets / Math.max(1, efficiency * 0.25))) : 0;
                                })()
                            } days of their deadlines.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
