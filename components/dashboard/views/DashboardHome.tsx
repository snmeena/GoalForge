import React, { useMemo, useState } from "react";
import { Plus, Hash, Repeat, ListTodo, Navigation, Calendar, Edit3, Trash2, ArrowRight, Zap, X, Globe, Info, ChevronLeft, AlignLeft } from "lucide-react";
import { Goal, EngineType, RoutineFrequency } from "../types";
import { SmartTrackingModal } from "../ui/SmartTrackingModal";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useGoalMutations } from "@/lib/hooks/useGoalMutations";
import { createClient } from "@/utils/supabase/client";
import { calculatePace, PaceInput } from "@/lib/page-engine";

interface TemplatePrefill {
    type: EngineType;
    title: string;
    target?: string;
    unit?: string;
    freq?: number;
    tasks?: { id: number, text: string }[];
}

interface QuickTemplate {
    title: string;
    desc: string;
    icon: React.ElementType;
    color: string;
    prefill: TemplatePrefill;
}

interface CommunityChallenge {
    title: string;
    type: EngineType;
    desc: string;
    icon: React.ElementType;
    color: string;
}

export interface DashboardHomeProps {
    creationStep: number;
    setCreationStep: (step: number) => void;
    progressGoalId: string | null;
    setProgressGoalId: (id: string | null) => void;
    handleModifyGoal: (goal: Goal) => void;
    resetEngine: () => void;
    goalTitle: string;
    setGoalTitle: (title: string) => void;
    selectedEngine: EngineType;
    setSelectedEngine: (engine: EngineType) => void;
    goalPriority: string;
    setGoalPriority: (priority: string) => void;
    volumeTarget: string;
    setVolumeTarget: (target: string) => void;
    volumeUnit: string;
    setVolumeUnit: (unit: string) => void;
    routineFreq: RoutineFrequency | null;
    setRoutineFreq: (freq: RoutineFrequency | null) => void;
    pipelineTasks: { id: number, text: string }[];
    handlePipelineTaskChange: (id: number, text: string) => void;
    addPipelineTask: () => void;
    removePipelineTask: (id: number) => void;
    siegeNotes: string;
    setSiegeNotes: (notes: string) => void;
    deadlineDays: number;
    setDeadlineDays: (days: number) => void;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
    handleInitializeEngine: () => void;
    handleTemplateSelect: (template: QuickTemplate) => void;
    handleJoinChallenge: (challenge: CommunityChallenge) => void;
    wizardRef: React.RefObject<HTMLDivElement | null>;
    editingGoalId: string | null;
    QUICK_TEMPLATES: QuickTemplate[];
    COMMUNITY_CHALLENGES: CommunityChallenge[];
}

export const DashboardHome = ({
    creationStep,
    setCreationStep,
    progressGoalId,
    setProgressGoalId,
    handleModifyGoal,
    resetEngine,
    goalTitle,
    setGoalTitle,
    selectedEngine,
    setSelectedEngine,
    goalPriority,
    setGoalPriority,
    volumeTarget,
    setVolumeTarget,
    volumeUnit,
    setVolumeUnit,
    routineFreq,
    setRoutineFreq,
    pipelineTasks,
    handlePipelineTaskChange,
    addPipelineTask,
    removePipelineTask,
    siegeNotes,
    setSiegeNotes,
    deadlineDays,
    setDeadlineDays,
    isPublic,
    setIsPublic,
    handleInitializeEngine,
    handleTemplateSelect,
    handleJoinChallenge,
    wizardRef,
    editingGoalId,
    QUICK_TEMPLATES,
    COMMUNITY_CHALLENGES
}: DashboardHomeProps) => {
    const { activeGoals, activeView } = useDashboardStore();
    const { handleDeleteGoal } = useGoalMutations();
    
    const isActive = activeView === "dashboard";
    const [publishGoal, setPublishGoal] = useState<Goal | null>(null);
    const [publishDescription, setPublishDescription] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    const completionRate = useMemo(() => {
        const totalProgress = activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0);
        const totalTarget = activeGoals.reduce((acc, g) => acc + (g.volumeTarget ? parseInt(g.volumeTarget) : 100), 0);
        return totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;
    }, [activeGoals]);

    const handlePublishToForge = async () => {
        if (!publishGoal || !publishDescription.trim()) return;
        setIsPublishing(true);
        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");

            const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
            const creatorName = profile?.username || "Anonymous Forger";

            interface PublishData {
                creator_id: string;
                creator_name: string;
                title: string;
                engine_type: EngineType;
                description: string;
                notes: string | null;
                is_official: boolean;
                deadline_days: number;
                tags: string[];
                cloned_count: number;
                volume_target?: string;
                volume_unit?: string;
                routine_freq?: RoutineFrequency | null;
                pipeline_tasks?: { id: number, text: string }[];
            }

            const publishData: PublishData = {
                creator_id: user.id,
                creator_name: creatorName,
                title: publishGoal.title,
                engine_type: publishGoal.type,
                description: publishDescription,
                notes: publishGoal.siegeNotes || null,
                is_official: false,
                deadline_days: 30,
                tags: [publishGoal.type as string, "community"],
                cloned_count: 0
            };

            if (publishGoal.type === "volume") {
                publishData.volume_target = publishGoal.volumeTarget || "100";
                publishData.volume_unit = publishGoal.volumeUnit || "Units";
            } else if (publishGoal.type === "routine") {
                publishData.routine_freq = publishGoal.routineFreq || { type: 'flexible', count: 7, period: 'week' };
            } else if (publishGoal.type === "pipeline") {
                publishData.pipeline_tasks = publishGoal.pipelineTasks || [{id: 1, text: "Step 1"}];
            }

            const { error } = await supabase.from('public_blueprints').insert([publishData]);
            if (error) throw error;

            alert("Successfully published to the Global Forge!");
            setPublishGoal(null);
            setPublishDescription("");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Publish Error:", message);
            alert("Failed to publish: " + message);
        } finally {
            setIsPublishing(false);
        }
    };

    const recoverySprints = useMemo(() => {
        return activeGoals.filter(goal => {
            if (goal.type !== 'volume' || !goal.volumeTarget) return false;
            
            const today = new Date();
            let deadline = goal.deadline;
            const start = new Date(today);
            start.setDate(today.getDate() - 7); 
            
            if (!deadline) {
                const future = new Date(today);
                future.setDate(today.getDate() + 30);
                deadline = future.toISOString().split("T")[0];
            }

            const paceInput: PaceInput = {
                targetValue: parseInt(goal.volumeTarget),
                startDate: start.toISOString().split("T")[0],
                endDate: deadline,
                completedValue: goal.progress || 0
            };
            const res = calculatePace(paceInput);
            return res.status === "BEHIND" || res.status === "CRITICAL";
        }).length;
    }, [activeGoals]);

    return (
        <div className={`max-w-5xl mx-auto space-y-8 pb-20 transition-all duration-300 w-full ${isActive ? "opacity-100 visible translate-y-0 relative" : "opacity-0 invisible translate-y-4 pointer-events-none absolute top-0"}`}>

            {publishGoal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[var(--bg-base)]/70 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPublishGoal(null)} />

                    <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-primary/10 border-primary/20 text-primary">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-primary">Publish Blueprint</h2>
                                <p className="text-[12px] font-bold text-muted uppercase tracking-widest">Global Forge</p>
                            </div>
                        </div>

                        <p className="text-[14px] text-muted leading-relaxed mb-6">
                            Share <strong>&quot;{publishGoal.title}&quot;</strong> with the community. Personal data and progress will be stripped.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Blueprint Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain the strategy and goals of this matrix..."
                                    value={publishDescription}
                                    onChange={(e) => setPublishDescription(e.target.value)}
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[13px] text-primary focus:border-primary transition-all outline-none shadow-inner resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setPublishGoal(null)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-[13px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePublishToForge}
                                    disabled={isPublishing || !publishDescription.trim()}
                                    className="flex-[1.5] py-3 rounded-xl bg-primary text-[var(--bg-base)] text-[13px] font-bold shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPublishing ? "Publishing..." : "Publish to Forge"} <Globe size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!progressGoalId && (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary mb-1">
                                {activeGoals.length > 0 ? "Execution Matrices." : "Workspace Initialized."}
                            </h1>
                            <p className="text-[14px] font-medium text-muted">
                                {activeGoals.length > 0 ? "Track and adapt your current goals below." : "Your execution matrix is empty. Ready to build momentum?"}
                            </p>
                        </div>
                        {activeGoals.length > 0 && creationStep === 0 && (
                            <button onClick={() => setCreationStep(1)} className="gf-btn gf-btn-primary px-5 py-2.5 rounded-xl text-[13px] flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all">
                                <Plus size={16} /> New Matrix
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Active Goals", val: activeGoals.length.toString() },
                            { label: "Current Pace", val: activeGoals.length > 0 ? (completionRate > 10 ? "Optimal" : "Initializing") : "N/A" },
                            { label: "Completion Rate", val: `${completionRate}%` },
                            { label: "Recovery Sprints", val: recoverySprints.toString() }
                        ].map((stat, i) => (
                            <div key={i} className="bg-gradient-to-br from-[var(--bg-surface)]/60 to-[var(--bg-base)]/40 border border-[var(--border)] rounded-2xl p-4 flex flex-col justify-center backdrop-blur-md shadow-sm">
                                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 opacity-50">{stat.label}</div>
                                <div className="text-2xl font-mono font-black text-primary/70 tracking-tight">{stat.val}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {progressGoalId && activeGoals.find(g => g.id === progressGoalId) && (
                <SmartTrackingModal
                    goal={activeGoals.find(g => g.id === progressGoalId)!}
                    onClose={() => setProgressGoalId(null)}
                />
            )}

            {!progressGoalId && activeGoals.length > 0 && creationStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    {activeGoals.map(goal => (
                        <div key={goal.id} className="group relative bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border)] hover:border-primary/20 rounded-2xl p-6 transition-all flex flex-col h-[220px] shadow-sm hover:shadow-xl">

                            <div className="absolute inset-0 bg-[var(--bg-base)]/90 z-10 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl border border-primary/5 backdrop-blur-md">
                                <div className="flex flex-col items-center gap-3 w-full px-12">
                                    <button
                                        onClick={() => setProgressGoalId(goal.id)}
                                        className="w-full py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-primary/60 hover:text-primary hover:border-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold text-[13px]"
                                    >
                                        <Info size={16} strokeWidth={2} /> See Details
                                    </button>
                                    <button
                                        onClick={() => handleModifyGoal(goal)}
                                        className="w-full py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-primary/60 hover:text-primary hover:border-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold text-[13px]"
                                    >
                                        <Edit3 size={16} /> Edit Engine
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                                className="absolute top-3 right-3 z-20 p-2 rounded-xl text-muted/30 hover:text-red-500/50 transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Matrix"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted/50 flex items-center gap-2">
                                    {goal.type === "volume" && <Hash size={10} />}
                                    {goal.type === "routine" && <Repeat size={10} />}
                                    {goal.type === "pipeline" && <ListTodo size={10} />}
                                    {goal.type === "siege" && <Navigation size={10} />}
                                    {goal.type}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${goal.priority === 'high' ? 'bg-red-500/30' : goal.priority === 'medium' ? 'bg-amber-500/30' : 'bg-green-500/30'}`} />
                            </div>

                            <h3 className="text-xl font-bold text-primary/80 mb-2 line-clamp-1 tracking-tight">{goal.title}</h3>
                            <p className="text-[12px] text-muted/50 font-medium line-clamp-2 mb-4 leading-relaxed">
                                {goal.type === 'volume' ? `Targeting ${goal.volumeTarget} ${goal.volumeUnit} by ${goal.deadline || 'undetermined date'}.` :
                                    goal.type === 'routine' ? `Committed to ${goal.routineFreq} days per week consistency.` :
                                        goal.type === 'pipeline' ? `Processing ${goal.pipelineTasks?.length || 0} sequential development milestones.` :
                                            `Monitoring critical siege parameters and deadlines.`}
                            </p>

                            <div className="mt-auto flex items-center justify-between border-t border-[var(--border)]/50 pt-4">
                                <div className="text-[10px] font-mono text-muted/40 flex items-center gap-1.5">
                                    <Calendar size={12} /> {goal.deadline || "Open-ended"}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="text-[9px] font-mono text-muted/50 font-bold tracking-widest">{Math.round(((goal.progress || 0) / (goal.volumeTarget ? parseInt(goal.volumeTarget) : 100)) * 100)}%</div>
                                    <div className="h-1 w-20 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)]">
                                        <div
                                            className="h-full bg-primary/20 transition-all duration-1000"
                                            style={{ width: `${Math.round(((goal.progress || 0) / (goal.volumeTarget ? parseInt(goal.volumeTarget) : 100)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!progressGoalId && (
                <div ref={wizardRef} className={`relative group mt-4 transition-all duration-500 ${creationStep !== 0 || activeGoals.length === 0 ? "block" : "hidden"}`}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/5 to-transparent rounded-[2rem] blur-xl opacity-20 pointer-events-none" />

                    <div className={`relative glass-card rounded-[2rem] border border-[var(--border)] flex flex-col items-center justify-center shadow-lg bg-gradient-to-b from-[var(--bg-surface)]/40 to-transparent transition-all duration-500 overflow-hidden ${creationStep === 0 ? "p-8 sm:p-12 text-center hover:bg-[var(--bg-surface)]/50" : "p-6 sm:p-8 items-stretch"}`}>

                        {creationStep === 0 && (
                            <div className="animate-in fade-in duration-300 w-full max-w-md mx-auto flex flex-col items-center">
                                <div
                                    className="w-14 h-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center justify-center text-muted/40 mb-6 shadow-inner relative group-hover:scale-105 group-hover:text-primary/50 transition-all duration-500 cursor-pointer"
                                    onClick={() => setCreationStep(1)}
                                >
                                    <Plus size={24} />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-primary/70 tracking-tight mb-2">Initialize New Matrix</h2>
                                <p className="text-[13px] font-medium text-muted/50 mb-8 leading-relaxed">
                                    Deploy a new tracking engine customized mathematically for your specific goal type.
                                </p>
                                <button onClick={() => setCreationStep(1)} className="gf-btn gf-btn-primary px-8 py-3.5 rounded-xl text-[13px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg">
                                    Select Model <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {creationStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                                <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-primary/70 tracking-tight">{editingGoalId ? "Modify Logic Engine" : "Select Tracking Model"}</h2>
                                        <p className="text-[12px] text-muted/50 font-medium mt-0.5">Choose the foundational logic engine for this matrix.</p>
                                    </div>
                                    <button onClick={resetEngine} className="p-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-muted/30 hover:text-red-500/50 hover:border-red-500/10 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: "volume", icon: Hash, title: "The Volume Engine", tag: "Count / Challenge", desc: "For specific numerical targets. E.g., 100 LeetCode problems, read 50 pages." },
                                        { id: "routine", icon: Repeat, title: "The Routine Engine", tag: "Regular / Daily", desc: "For consistency tracking. E.g., Gym 5 days a week, daily meditation." },
                                        { id: "pipeline", icon: ListTodo, title: "The Pipeline Engine", tag: "Checklist / To-Do", desc: "For multi-step projects requiring order. E.g., Build hardware prototype." },
                                        { id: "siege", icon: Navigation, title: "The Siege Engine", tag: "Task / Avoidance", desc: "For deadline-driven tasks. Heat levels based on % deadline elapsed." }
                                    ].map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => { setSelectedEngine(model.id as EngineType); setCreationStep(2); }}
                                            className={`flex flex-col items-start p-5 rounded-2xl border transition-all group/card ${selectedEngine === model.id ? 'bg-[var(--bg-surface)] border-primary/30 shadow-sm' : 'bg-[var(--bg-base)]/30 border border-[var(--border)] hover:border-primary/10 hover:bg-[var(--bg-surface)]/20'}`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-3">
                                                <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-muted/40 group-hover/card:text-primary/50 group-hover/card:scale-105 transition-all">
                                                    <model.icon size={16} />
                                                </div>
                                                <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-muted/30">
                                                    {model.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-primary/70 mb-1">{model.title}</h3>
                                            <p className="text-[12px] text-muted/40 leading-relaxed text-left line-clamp-2">{model.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {creationStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setCreationStep(1)} className="p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-muted hover:text-primary transition-colors">
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-extrabold text-primary tracking-tight">Configure Engine Parameters</h2>
                                            <p className="text-[12px] font-mono text-muted uppercase tracking-widest mt-0.5">Mode: {selectedEngine}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-5">
                                        <div>
                                            <label htmlFor="goal-title" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Matrix Title</label>
                                            <input
                                                type="text"
                                                id="goal-title"
                                                name="goal-title"
                                                placeholder="e.g., Master Data Structures, Gym Phase 1"
                                                value={goalTitle}
                                                onChange={(e) => setGoalTitle(e.target.value)}
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[14px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-all outline-none shadow-inner font-bold"
                                            />
                                        </div>

                                        {selectedEngine === "volume" && (
                                            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                                <div>
                                                    <label htmlFor="volume-target" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Target Number</label>
                                                    <input 
                                                        type="number" 
                                                        id="volume-target" 
                                                        name="volume-target" 
                                                        min="1" 
                                                        placeholder="100" 
                                                        value={volumeTarget} 
                                                        onChange={(e) => setVolumeTarget(e.target.value)} 
                                                        className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[14px] text-primary focus:border-[var(--text-primary)] transition-all outline-none shadow-inner font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="volume-unit" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Metric Unit</label>
                                                    <input type="text" id="volume-unit" name="volume-unit" placeholder="Problems, Pages, Kg" value={volumeUnit} onChange={(e) => setVolumeUnit(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[14px] text-primary focus:border-[var(--text-primary)] transition-all outline-none shadow-inner" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedEngine === "routine" && (
                                            <div className="animate-in fade-in duration-300 space-y-4">
                                                <div className="flex bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border)]">
                                                    <button 
                                                        onClick={() => setRoutineFreq({ type: 'flexible', count: 3, period: 'week' })}
                                                        className={`flex-1 py-2 rounded-lg text-[12px] font-bold transition-all ${routineFreq?.type === 'flexible' ? 'bg-[var(--bg-surface)] shadow-sm' : 'text-muted'}`}
                                                    >Flexible</button>
                                                    <button 
                                                        onClick={() => setRoutineFreq({ type: 'fixed', days: [] })}
                                                        className={`flex-1 py-2 rounded-lg text-[12px] font-bold transition-all ${routineFreq?.type === 'fixed' ? 'bg-[var(--bg-surface)] shadow-sm' : 'text-muted'}`}
                                                    >Fixed</button>
                                                </div>

                                                {routineFreq?.type === 'flexible' && (
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="number" 
                                                            min="1"
                                                            value={routineFreq.count}
                                                            onChange={(e) => setRoutineFreq({ ...routineFreq, count: parseInt(e.target.value) })}
                                                            className="w-16 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg py-2 px-3 text-[13px] text-primary focus:border-primary outline-none text-center font-mono"
                                                        />
                                                        <span className="text-[12px] text-muted font-bold">days per</span>
                                                        <select 
                                                            value={routineFreq.period}
                                                            onChange={(e) => setRoutineFreq({ ...routineFreq, period: e.target.value as 'week' | 'month' })}
                                                            className="flex-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg py-2 px-3 text-[13px] text-primary focus:border-primary outline-none"
                                                        >
                                                            <option value="week">Week</option>
                                                            <option value="month">Month</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {routineFreq?.type === 'fixed' && (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Last-Month'].map((day) => (
                                                            <button 
                                                                key={day}
                                                                onClick={() => {
                                                                    const days = routineFreq.days.includes(day) 
                                                                        ? routineFreq.days.filter(d => d !== day)
                                                                        : [...routineFreq.days, day];
                                                                    setRoutineFreq({ ...routineFreq, days });
                                                                }}
                                                                className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${routineFreq.days.includes(day) ? 'bg-primary text-[var(--bg-base)] border-primary' : 'bg-[var(--bg-base)] border-[var(--border)] text-muted'}`}
                                                            >
                                                                {day}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedEngine === "pipeline" && (
                                            <div className="animate-in fade-in duration-300 space-y-3">
                                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Execution Steps (Order matters)</label>
                                                {pipelineTasks.map((task, index) => (
                                                    <div key={task.id} className="flex items-center gap-2 relative group">
                                                        <div className="w-6 text-center text-[10px] font-mono text-muted">{index + 1}.</div>
                                                        <input type="text" id={`pipeline-task-${task.id}`} name={`pipeline-task-${task.id}`} placeholder={`Step ${index + 1}...`} value={task.text} onChange={(e) => handlePipelineTaskChange(task.id, e.target.value)} className="flex-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg py-2 px-3 text-[13px] text-primary focus:border-[var(--text-primary)] outline-none shadow-inner" />
                                                        <button onClick={() => removePipelineTask(task.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-500 text-muted transition-colors opacity-0 group-hover:opacity-100">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button onClick={addPipelineTask} className="text-[12px] font-bold text-primary hover:underline ml-8 flex items-center gap-1">
                                                    <Plus size={12} /> Add Step
                                                </button>
                                            </div>
                                        )}

                                        {selectedEngine === "siege" && (
                                            <div className="animate-in fade-in duration-300 space-y-4">
                                                <div>
                                                    <label htmlFor="deadline-days" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1 flex items-center gap-1">Deadline in Days</label>
                                                    <input 
                                                        type="number" 
                                                        id="deadline-days" 
                                                        name="deadline-days" 
                                                        min="1" 
                                                        placeholder="7" 
                                                        value={deadlineDays} 
                                                        onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 1)} 
                                                        className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[14px] text-primary focus:border-[var(--text-primary)] transition-all outline-none shadow-inner font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="siege-notes" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1 flex items-center gap-1"><AlignLeft size={12} /> Context / Notes</label>
                                                    <textarea id="siege-notes" name="siege-notes" rows={3} placeholder="Add brief details or links needed to complete this task..." value={siegeNotes} onChange={(e) => setSiegeNotes(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[13px] text-primary focus:border-[var(--text-primary)] transition-all outline-none shadow-inner resize-none" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-5 bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl p-5 shadow-inner">
                                        <div>
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">Priority Tag</label>
                                            <div className="flex flex-col gap-2">
                                                {['high', 'medium', 'casual'].map((level) => (
                                                    <button key={level} onClick={() => setGoalPriority(level)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] font-bold capitalize transition-all ${goalPriority === level ? 'bg-[var(--bg-surface)] border-primary text-primary shadow-sm' : 'bg-transparent border-transparent text-muted hover:bg-[var(--bg-surface)]/50'}`}>
                                                        <div className={`w-2 h-2 rounded-full ${level === 'high' ? 'bg-red-500' : level === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                                        {level} Priority
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--border)] mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-bold text-primary flex items-center gap-2">
                                                        <Globe size={14} className={isPublic ? "text-primary" : "text-muted"} /> Public Forge Target
                                                    </span>
                                                    <span className="text-[10px] text-muted font-medium">Contribute this to the Global Forge network.</span>
                                                </div>
                                                <button 
                                                    onClick={() => setIsPublic(!isPublic)}
                                                    className={`w-12 h-6 rounded-full relative transition-all ${isPublic ? 'bg-primary' : 'bg-[var(--bg-base)] border border-[var(--border)]'}`}
                                                    aria-label="Toggle Public Status"
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isPublic ? 'left-7 bg-[var(--bg-base)]' : 'left-1 bg-muted'}`} />
                                                </button>
                                            </div>

                                            {isPublic && (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <label htmlFor="forge-description" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block">Forge Description</label>
                                                    <textarea 
                                                        id="forge-description"
                                                        name="forge-description"
                                                        rows={3}
                                                        value={siegeNotes}
                                                        onChange={(e) => setSiegeNotes(e.target.value)}
                                                        placeholder="Provide a brief strategic overview for the community..."
                                                        className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13px] text-primary focus:border-primary transition-all outline-none resize-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--border)] mt-2">
                                    <button onClick={resetEngine} className="px-5 py-2.5 rounded-xl border border-transparent hover:bg-[var(--bg-base)] text-[13px] font-bold text-muted hover:text-red-500 transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleInitializeEngine} className="gf-btn gf-btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                        {editingGoalId ? "Update Configuration" : "Initialize Engine"} <Zap size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!progressGoalId && (
                <div className="pt-8 border-t border-[var(--border)] mt-12 animate-in fade-in duration-700 space-y-12">
                    <div>
                        <div className="text-[12px] font-black text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[var(--border)]"></span> Reference Templates
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {QUICK_TEMPLATES.map((temp, i) => (
                                <div key={i} onClick={() => handleTemplateSelect(temp)} className="group bg-[var(--bg-surface)]/50 border border-[var(--border)] rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden flex flex-col hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative z-10 flex flex-col items-start text-left h-full">
                                        <div className={`p-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] mb-4 ${temp.color} group-hover:scale-110 transition-transform`}><temp.icon size={20} /></div>
                                        <h3 className="text-[15px] font-bold text-primary mb-2 tracking-tight">{temp.title}</h3>
                                        <p className="text-[12px] text-muted leading-relaxed mb-6 line-clamp-2 font-medium">{temp.desc}</p>
                                        <div className="mt-auto flex items-center text-[11px] font-black text-primary tracking-widest uppercase opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                                            Deploy <ArrowRight size={14} className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-[12px] font-black text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[var(--border)]"></span> Community Highlights
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {COMMUNITY_CHALLENGES.map((challenge, i) => (
                                <div key={i} className="group relative bg-[var(--bg-surface)]/70 border-2 border-[var(--border)] rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-center ${challenge.color} group-hover:scale-110 transition-transform shadow-inner`}>
                                            <challenge.icon size={18} />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-[var(--bg-base)] border border-[var(--border)] px-2.5 py-1 rounded-full shadow-sm">
                                            Official Blueprint
                                        </div>
                                    </div>

                                    <h3 className="text-[16px] font-bold text-primary mb-2 line-clamp-1 tracking-tight">{challenge.title}</h3>
                                    <p className="text-[12.5px] text-muted leading-relaxed line-clamp-2 mb-6 font-medium">{challenge.desc}</p>

                                    <div className="mt-auto border-t border-[var(--border)] pt-4 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{challenge.type} Engine</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleJoinChallenge(challenge); }} className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-all hover:translate-x-1">
                                            Join <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
