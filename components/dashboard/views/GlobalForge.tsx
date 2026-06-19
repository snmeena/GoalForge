import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { 
    Search, Users, Zap, Shield, Star, 
    X, Calendar, Hash, MessageSquare, 
    User as UserIcon, ArrowLeft, Clock, Filter
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ForgeTarget, ForgeMember, EngineType, RoutineFrequency } from "../types";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import Logo from "@/components/Logo";

const MOCK_TARGETS: ForgeTarget[] = [
    {
        id: 'official-1',
        creator_id: 'system',
        creator_name: 'Forge_Official',
        title: '75 Hard Mental Toughness',
        description: 'The ultimate discipline test designed to reprogram your mental operational capacity. 75 days of zero compromise.',
        notes: 'Rule 1: If you miss a day, you start over at Day 1.\nRule 2: Workouts must be 45 minutes each, one must be outdoors.\nRule 3: No alcohol or cheat meals.',
        type: 'routine',
        engine_type: 'routine',
        is_official: true,
        frequency: { type: 'flexible', count: 7, period: 'week' },
        deadline_days: 75,
        tags: ['discipline', 'fitness'],
        created_at: new Date().toISOString(),
        joined_count: 0,
        cloned_count: 0
    },
    {
        id: 'official-2',
        creator_id: 'system',
        creator_name: 'Forge_Official',
        title: 'Algorithm Mastery Sprint',
        description: 'Synchronized solve of 100 high-impact data structure problems. Optimize your problem-solving latency.',
        notes: 'Focus on Graphs, DP, and Trees. Aim for 3-4 problems per day.',
        type: 'volume',
        engine_type: 'volume',
        is_official: true,
        target_value: 100,
        target_unit: 'Problems',
        deadline_days: 30,
        tags: ['coding', 'career'],
        created_at: new Date().toISOString(),
        joined_count: 0,
        cloned_count: 0
    },
    {
        id: 'official-3',
        creator_id: 'system',
        creator_name: 'Forge_Official',
        title: 'SaaS Architecture MVP',
        description: 'A 6-stage rapid deployment pipeline for taking conceptual ideas to production-ready prototypes.',
        notes: 'Stage 1: Schema & Auth\nStage 2: Core Engine\nStage 3: Dashboard UI\nStage 4: Landing Page\nStage 5: Beta Testing\nStage 6: Public Launch',
        type: 'pipeline',
        engine_type: 'pipeline',
        is_official: true,
        tasks: [
            { id: 1, text: 'Schema Design' },
            { id: 2, text: 'MVP Core' }
        ],
        deadline_days: 14,
        tags: ['startup', 'dev'],
        created_at: new Date().toISOString(),
        joined_count: 0,
        cloned_count: 0
    }
];

import { Database } from "@/lib/database.types";
type PublicBlueprint = Database['public']['Tables']['public_blueprints']['Row'];

export const GlobalForge = () => {
    const { activeView } = useDashboardStore();
    const supabase = createClient();
    const [targets, setTargets] = useState<ForgeTarget[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [selectedTarget, setSelectedTarget] = useState<ForgeTarget | null>(null);
    const [members, setMembers] = useState<ForgeMember[]>([]);
    const [isJoining, setIsJoining] = useState(false);

    const fetchForgeTargets = useCallback(async () => {
        try {
            setLoading(prev => prev ? prev : true);
            const { data, error } = await supabase
                .from('public_blueprints')
                .select('*')
                .order('cloned_count', { ascending: false });

            if (error) {
                console.warn("Public blueprints table not found or error:", error.message);
                setTargets(MOCK_TARGETS);
            } else if (data) {
                const mappedTargets: ForgeTarget[] = (data as PublicBlueprint[]).map((t) => ({
                    id: t.id,
                    creator_id: t.creator_id || "",
                    creator_name: t.creator_name || "Anonymous",
                    creator_avatar: undefined,
                    title: t.title,
                    description: t.description || "",
                    notes: undefined,
                    engine_type: t.engine_type as EngineType,
                    type: t.engine_type as EngineType,
                    is_official: false,
                    target_value: 0,
                    target_unit: "",
                    volume_target: t.volume_target || undefined,
                    volume_unit: t.volume_unit || undefined,
                    routine_freq: t.routine_freq ? (typeof t.routine_freq === 'string' ? JSON.parse(t.routine_freq) : t.routine_freq) : undefined,
                    frequency: t.routine_freq ? (typeof t.routine_freq === 'string' ? JSON.parse(t.routine_freq) : t.routine_freq) : undefined,
                    tasks: [],
                    pipeline_tasks: (t.pipeline_tasks as { id: number; text: string }[]) || [],
                    deadline_days: 30,
                    tags: [],
                    created_at: t.created_at || new Date().toISOString(),
                    joined_count: t.cloned_count || 0,
                    cloned_count: t.cloned_count || 0
                }));
                setTargets([...MOCK_TARGETS, ...mappedTargets]);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setTargets(MOCK_TARGETS);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    // Using a ref to track if we've already fetched to avoid multiple calls if activeView toggles
    const hasFetched = useRef(false);

    useEffect(() => {
        if (activeView === "global-forge" && !hasFetched.current) {
            fetchForgeTargets();
            hasFetched.current = true;
        }
    }, [activeView, fetchForgeTargets]);

    const fetchMembers = async (targetId: string) => {
        try {
            const { data, error } = await supabase
                .from('forge_members')
                .select(`
                    *,
                    profiles:user_id (username, avatar_url)
                `)
                .eq('target_id', targetId);

            if (error) {
                console.warn("Members fetch error (likely table missing):", error.message);
                setMembers([]);
                return;
            }
            
            if (data) {
                interface RawMember {
                    user_id: string;
                    joined_at: string;
                    profiles: {
                        username: string | null;
                        avatar_url: string | null;
                    } | null;
                }
                const mappedMembers: ForgeMember[] = (data as unknown as RawMember[]).map((m) => ({
                    user_id: m.user_id,
                    username: m.profiles?.username || "Unknown",
                    avatar_url: m.profiles?.avatar_url || undefined,
                    joined_at: m.joined_at,
                    is_online: false 
                }));
                setMembers(mappedMembers);
            }
        } catch (err) {
            setMembers([]);
        }
    };

    const handleSelectTarget = (target: ForgeTarget) => {
        setSelectedTarget(target);
        fetchMembers(target.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleJoinForgeTarget = async (target: ForgeTarget) => {
        setIsJoining(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please log in to synchronize blueprints.");
                return;
            }

            const thirtyDaysLater = new Date(Date.now() + (target.deadline_days || 30) * 24 * 60 * 60 * 1000);
            
            interface NewGoalData {
                user_id: string;
                title: string;
                status: EngineType;
                deadline: string;
                priority: string;
                siege_notes: string;
                volume_target?: string;
                volume_unit?: string;
                routine_freq?: RoutineFrequency | null;
                pipeline_tasks?: { id: number, text: string }[];
            }

            const goalData: NewGoalData = {
                user_id: user.id,
                title: target.title,
                status: (target.engine_type || target.type || 'siege') as EngineType,
                deadline: thirtyDaysLater.toISOString().split('T')[0],
                priority: "high",
                siege_notes: target.description + "\n\nNotes: " + (target.notes || "")
            };

            const type = target.engine_type || target.type;
            if (type === "volume") {
                goalData.volume_target = target.target_value?.toString() || target.volume_target || "100";
                goalData.volume_unit = target.target_unit || target.volume_unit || "Units";
            } else if (type === "routine") {
                const freq = target.frequency || target.routine_freq || { type: 'flexible', count: 7, period: 'week' };
                goalData.routine_freq = typeof freq === 'number' ? { type: 'flexible', count: freq, period: 'week' } : freq;
            } else if (type === "pipeline") {
                goalData.pipeline_tasks = target.tasks || target.pipeline_tasks || [{id: 1, text: "Step 1"}];
            }

            const { data: result, error: goalError } = await supabase.from('user_goals').insert([goalData]).select();

            if (goalError) throw goalError;

            const newCount = (target.cloned_count || 0) + 1;
            await supabase
                .from('public_blueprints')
                .update({ cloned_count: newCount })
                .eq('id', target.id);

            alert(`Synchronized "${target.title}" to your workspace!`);
            
            if (result && result.length > 0) {
                const dbGoal = result[0];
                const { setActiveGoals } = useDashboardStore.getState();
                setActiveGoals(prev => [{
                    id: dbGoal.id,
                    title: dbGoal.title,
                    type: (dbGoal.status as EngineType) || (target.engine_type as EngineType) || (target.type as EngineType) || 'siege',
                    deadline: dbGoal.deadline || "",
                    priority: dbGoal.priority || "high",
                    volumeTarget: dbGoal.volume_target?.toString(),
                    volumeUnit: dbGoal.volume_unit,
                    routineFreq: dbGoal.routine_freq,
                    siegeNotes: dbGoal.siege_notes,
                    progress: dbGoal.progress || 0
                }, ...prev]);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("Join Error:", message);
            alert("Synchronization failed: " + message);
        } finally {
            setIsJoining(false);
        }
    };

    const filteredTargets = useMemo(() => {
        return targets.filter(t => {
            const type = t.engine_type || t.type || "";
            const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  t.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === "All" || 
                                 (activeFilter === "Official" && t.is_official) ||
                                 (activeFilter === "Community" && !t.is_official) ||
                                 (activeFilter.toLowerCase() === type.toLowerCase());
            return matchesSearch && matchesFilter;
        });
    }, [targets, searchQuery, activeFilter]);

    return (
        <div className={`max-w-7xl mx-auto space-y-12 pb-32 transition-all duration-700 w-full ${activeView === "global-forge" ? "opacity-100 visible translate-y-0 relative" : "opacity-0 invisible translate-y-4 pointer-events-none absolute top-0"}`}>

            <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--bg-surface)] border-2 border-[var(--border)] p-6 sm:p-12 text-center shadow-md">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full -mr-96 -mt-96 blur-[150px] pointer-events-none" />
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-[clamp(3rem,8vw,6rem)] break-words hyphens-auto font-black tracking-tighter text-primary mb-8 leading-[0.85]">
                        The Global <span className="text-primary/30 italic font-serif">Forge.</span>
                    </h1>
                    <p className="text-[18px] sm:text-[20px] font-bold text-primary/80 leading-relaxed max-w-2xl mx-auto">
                        A decentralized collective for high-performance executors. Share strategic blueprints, synchronize with community-vetted goals, and accelerate through shared accountability.
                    </p>
                </div>
            </div>

            {!selectedTarget && (
                <div className="flex flex-col md:flex-row gap-6 items-center px-4 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex-1 relative group w-full">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-10" />
                        <input 
                            type="text" 
                            id="forge-search"
                            name="forge-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search blueprints, engines, or creators..." 
                            className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-2xl py-4 pl-14 pr-6 text-[14px] text-primary focus:border-primary transition-all outline-none font-bold shadow-md"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto min-h-[50px]">
                        {['All', 'Official', 'Community', 'Volume', 'Routine', 'Pipeline'].map((filter) => (
                            <button 
                                key={filter} 
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap h-[42px] flex items-center justify-center ${
                                    activeFilter === filter 
                                    ? "bg-primary text-[var(--bg-base)] border-primary shadow-[0_8px_20px_rgba(var(--primary-rgb),0.2)]" 
                                    : "bg-[var(--bg-base)] border-[var(--border)] text-primary hover:border-primary/50"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedTarget && (
                <div id="focus-target" className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl relative slide-focus-inner">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                    
                    <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[var(--border)] p-6 space-y-8 bg-[var(--bg-base)]/40 no-scrollbar relative">
                            <div className="sticky top-0 z-50 bg-[var(--bg-surface)]/90 backdrop-blur-md pb-2 pt-1 border-b border-[var(--border)] -mx-6 px-6 mb-4">
                                <button 
                                    onClick={() => setSelectedTarget(null)}
                                    className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest p-2 rounded-lg hover:-translate-x-1 hover:bg-[var(--bg-base)] transition-transform"
                                >
                                    <ArrowLeft size={14} /> Back
                                </button>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-4">Metrics</h4>
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted"><Users size={14} /> Nodes</div>
                                        <span className="text-[12px] font-black text-primary">0</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted"><Clock size={14} /> Duration</div>
                                        <span className="text-[12px] font-black text-primary">{selectedTarget.deadline_days}d</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted"><Shield size={14} /> Security</div>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-4">Registry</h4>
                                <div className="space-y-3 no-scrollbar max-h-[200px] overflow-hidden">
                                    {members.length > 0 ? members.map((member, i) => (
                                        <div key={i} className="flex items-center gap-3 group/node">
                                            <div className="w-7 h-7 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                                                {member.avatar_url ? <img src={member.avatar_url} alt={member.username} /> : <UserIcon size={12} className="text-muted" />}
                                            </div>
                                            <span className="text-[11px] font-bold text-primary">@{member.username}</span>
                                        </div>
                                    )) : (
                                        <div className="text-[10px] font-bold text-muted/30 uppercase tracking-widest px-1">Offline Registry</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-8 sm:p-10 flex flex-col no-scrollbar">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 flex items-center justify-center text-primary group/logo relative">
                                        {selectedTarget.is_official ? (
                                            <Logo size={48} className="relative z-10" />
                                        ) : (
                                            <div className="relative z-10 p-3.5 rounded-2xl bg-[var(--bg-base)] border border-primary/20">
                                                {selectedTarget.type === "volume" && <Zap size={24} />}
                                                {selectedTarget.type === "routine" && <Calendar size={24} />}
                                                {selectedTarget.type === "pipeline" && <Hash size={24} />}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1">
                                            <h2 className="text-3xl font-black tracking-tighter text-primary">{selectedTarget.title}</h2>
                                            {selectedTarget.is_official && <Star size={18} className="text-amber-500 fill-amber-500 animate-pulse" />}
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <p className="text-[12px] font-bold text-muted">
                                                @{selectedTarget.creator_name}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-[var(--bg-base)] px-2 py-0.5 rounded border border-[var(--border)]">
                                                0 Nodes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTarget(null)}
                                    className="p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-muted hover:text-primary transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div>
                                    <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-3">Protocol Objective</h4>
                                    <p className="text-[15px] font-medium text-primary leading-relaxed">
                                        {selectedTarget.description}
                                    </p>
                                </div>

                                {selectedTarget.notes && (
                                    <div className="p-6 rounded-[1.5rem] bg-[var(--bg-base)]/60 border border-[var(--border)] relative overflow-hidden">
                                        <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                            <MessageSquare size={12} /> Notes
                                        </h4>
                                        <p className="text-[13px] font-medium text-muted leading-normal whitespace-pre-wrap">
                                            {selectedTarget.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)]/40">
                                        <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2">Framework</div>
                                        <div className="text-[13px] font-bold text-primary capitalize flex items-center gap-2">
                                            <Zap size={14} className="text-primary" /> {selectedTarget.type}
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-base)]/40">
                                        <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2">Metric</div>
                                        <div className="text-[13px] font-bold text-primary flex items-center gap-2">
                                            <Star size={14} className="text-amber-500" />
                                            {selectedTarget.type === "volume" && `${selectedTarget.target_value} ${selectedTarget.target_unit}`}
                                            {selectedTarget.type === "routine" && `${selectedTarget.frequency}x Weekly`}
                                            {selectedTarget.type === "pipeline" && `${selectedTarget.tasks?.length || 0} Stages`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-[var(--border)] flex flex-col gap-6">
                                <div className="flex items-center gap-3 w-full">
                                    <button 
                                        onClick={() => setSelectedTarget(null)}
                                        className="flex-1 py-4 rounded-xl border border-[var(--border)] text-[11px] font-black uppercase tracking-widest text-primary bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button 
                                        onClick={() => handleJoinForgeTarget(selectedTarget)}
                                        disabled={isJoining}
                                        className="flex-[1.5] py-4 rounded-xl bg-primary text-[var(--bg-base)] text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                                    >
                                        {isJoining ? "Syncing..." : "Sync Protocol"} <Zap size={14} fill="currentColor" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center gap-3 text-muted/50 bg-[var(--bg-base)]/20 py-3 rounded-xl border border-[var(--border)]/30">
                                    <Shield size={14} className="text-green-500/30" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Matrix Synchronization Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!selectedTarget && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 min-h-[400px]">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-64 rounded-[2rem] bg-[var(--bg-surface)] border-2 border-[var(--border)] animate-pulse" />
                        ))
                    ) : filteredTargets.length > 0 ? (
                        filteredTargets.map((target) => (
                            <div 
                                key={target.id} 
                                onClick={() => handleSelectTarget(target)}
                                className="group relative bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-[2.2rem] p-7 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-12 h-12 rounded-2xl bg-[var(--bg-base)] border-2 border-[var(--border)] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                                        {target.is_official ? (
                                            <Logo size={24} />
                                        ) : (
                                            <>
                                                {target.type === "volume" && <Zap size={22} />}
                                                {target.type === "routine" && <Calendar size={22} />}
                                                {target.type === "pipeline" && <Hash size={22} />}
                                            </>
                                        )}
                                    </div>
                                    {target.is_official ? (
                                        <div className="px-3 py-1 rounded-full bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Star size={10} fill="currentColor" /> Official
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 rounded-full bg-primary/5 border-2 border-[var(--border)] text-muted text-[9px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                                            Community
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-[17px] font-black text-primary mb-2 tracking-tight line-clamp-1">{target.title}</h3>
                                <p className="text-[12px] text-muted leading-relaxed mb-8 font-medium line-clamp-2">
                                    {target.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-[var(--border)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--bg-base)] border-2 border-[var(--border)] overflow-hidden flex items-center justify-center">
                                            {target.creator_avatar ? <Image src={target.creator_avatar} alt={target.creator_name || "Creator"} width={24} height={24} unoptimized className="w-full h-full object-cover" /> : <UserIcon size={12} className="text-muted" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted truncate max-w-[80px]">@{target.creator_name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-muted uppercase tracking-widest">
                                        <Users size={12} /> 0
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border)] flex items-center justify-center mx-auto mb-6 text-muted">
                                <Filter size={24} />
                            </div>
                            <h3 className="text-[14px] font-black uppercase tracking-widest text-primary">No blueprints detected</h3>
                            <p className="text-[12px] text-muted mt-2">Adjust filters or initiate a new forge sequence.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
