"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, X } from "lucide-react";

import { Goal, ViewState, SettingsTab, EngineType, RoutineFrequency } from "@/components/dashboard/types";
import { DashboardHome } from "@/components/dashboard/views/DashboardHome";
import { DailyCheckIn } from "@/components/dashboard/views/DailyCheckIn";
import { GlobalForge } from "@/components/dashboard/views/GlobalForge";
import { Analytics } from "@/components/dashboard/views/Analytics";
import { SettingsView } from "@/components/dashboard/views/SettingsView";
import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopHeader } from "@/components/dashboard/layout/TopHeader";
import { AccountActionModal } from "@/components/dashboard/modals/AccountActionModal";
import { InviteModal } from "@/components/dashboard/modals/InviteModal";
import { ReviewModal } from "@/components/dashboard/modals/ReviewModal";

import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { QUICK_TEMPLATES, COMMUNITY_CHALLENGES } from "@/components/dashboard/constants";

function DashboardContent() {
    const searchParams = useSearchParams();

    // Store & Hooks
    const { 
        activeView, 
        activeSettingsTab, 
        setActiveView, 
        setActiveSettingsTab,
        isLoggingOut,
        activeGoals,
        userProfile,
        setActiveGoals,
    } = useDashboardStore();

    const { handleSignOut } = useDashboardData();

    const viewParam = searchParams.get("view") as ViewState;
    const tabParam = searchParams.get("tab") as SettingsTab;

    // Sync URL params with store
    useEffect(() => {
        if (viewParam && ["dashboard", "daily-check-in", "global-forge", "analytics", "settings"].includes(viewParam)) {
            if (viewParam !== activeView) setActiveView(viewParam);
        }
        if (tabParam && ["account", "preferences", "billing", "notifications"].includes(tabParam)) {
            if (tabParam !== activeSettingsTab) setActiveSettingsTab(tabParam);
        }
    }, [viewParam, tabParam, activeView, activeSettingsTab, setActiveView, setActiveSettingsTab]);

    const [progressGoalId, setProgressGoalId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const wizardRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        const handleMouseMove = (e: MouseEvent) => {
            if (backgroundRef.current) {
                animationFrameId = requestAnimationFrame(() => {
                    backgroundRef.current?.style.setProperty('--mouse-x', `${e.clientX}px`);
                    backgroundRef.current?.style.setProperty('--mouse-y', `${e.clientY}px`);
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [accountActionPassword, setAccountActionPassword] = useState("");
    const [accountActionError, setAccountActionError] = useState("");
    const [revivalMessage, setRevivalMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAccountAction = async (type: 'delete' | 'deactivate') => {
        try {
            setAccountActionError("");
            setIsUploading(true);
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) throw new Error("User session expired.");

            const { error: verifyError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: accountActionPassword
            });
            if (verifyError) throw new Error("Incorrect password. Verification failed.");

            const updateData = type === 'delete' 
                ? { deleted_at: new Date().toISOString() }
                : { is_deactivated: true };

            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);

            if (updateError) throw updateError;
            await handleSignOut();
        } catch (error) {
            setAccountActionError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsUploading(false);
        }
    };

    const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [copyStatus, setCopyStatus] = useState("Copy Link");

    const handleCopyInviteLink = () => {
        const link = `https://goalforge.app/join/${userProfile.username}`;
        navigator.clipboard.writeText(link);
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Link"), 2000);
    };

    const handleSubmitReview = async () => {
        if (!reviewText.trim()) return;
        setIsReviewSubmitting(true);
        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Auth required");
            const { error } = await supabase.from('platform_reviews').insert([{
                user_id: user.id,
                username: userProfile.username,
                rating: reviewRating,
                review_text: reviewText
            }]);
            if (error) throw error;
            setReviewSuccess(true);
            setTimeout(() => {
                setIsReviewModalOpen(false);
                setReviewSuccess(false);
                setReviewText("");
                setReviewRating(5);
            }, 2500);
        } catch (error) {
            alert("Failed to submit review: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsReviewSubmitting(false);
        }
    };

    useEffect(() => {
        if (progressGoalId || activeView === 'global-forge') {
            const targetEl = document.getElementById('focus-target');
            if (targetEl) {
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    targetEl.classList.add('slide-focus-inner');
                    setTimeout(() => targetEl.classList.remove('slide-focus-inner'), 1000);
                }, 100);
            }
        }
    }, [progressGoalId, activeView]);

    const [creationStep, setCreationStep] = useState(0);
    const [selectedEngine, setSelectedEngine] = useState<EngineType>("");
    const [goalTitle, setGoalTitle] = useState("");
    const [goalPriority, setGoalPriority] = useState("medium");
    const [volumeTarget, setVolumeTarget] = useState("");
    const [volumeUnit, setVolumeUnit] = useState("");
    const [routineFreq, setRoutineFreq] = useState<RoutineFrequency | null>(null);
    const [pipelineTasks, setPipelineTasks] = useState(() => [{ id: Date.now(), text: "" }]);
    const [siegeNotes, setSiegeNotes] = useState("");
    const [deadlineDays, setDeadlineDays] = useState(7);

    const resetEngine = () => {
        setCreationStep(0);
        setSelectedEngine("");
        setGoalTitle("");
        setGoalPriority("medium");
        setVolumeTarget("");
        setVolumeUnit("");
        setRoutineFreq(null);
        setPipelineTasks(() => [{ id: Date.now(), text: "" }]);
        setSiegeNotes("");
        setDeadlineDays(7);
        setEditingGoalId(null);
        setProgressGoalId(null);
    };

    const handleInitializeEngine = async () => {
        if (!goalTitle.trim()) return alert("Matrix Title is required.");
        
        const isDuplicate = activeGoals.some(g => g.id !== editingGoalId && g.title.toLowerCase().trim() === goalTitle.toLowerCase().trim());
        if (isDuplicate) return alert(`A matrix with the title "${goalTitle}" already exists.`);
        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");
            
            const calculatedDeadline = new Date();
            calculatedDeadline.setDate(calculatedDeadline.getDate() + deadlineDays);

            const goalData = {
                user_id: user.id,
                title: goalTitle,
                progress: 0,
                status: selectedEngine,
                deadline: selectedEngine === 'siege' ? calculatedDeadline.toISOString().split('T')[0] : null,
                priority: goalPriority,
                volume_target: volumeTarget || null,
                volume_unit: volumeUnit || null,
                routine_freq: routineFreq ? JSON.stringify(routineFreq) : null,
                pipeline_tasks: pipelineTasks.length > 0 ? pipelineTasks : null,
                siege_notes: siegeNotes || null
            };
            let result;
            if (editingGoalId) result = await supabase.from('user_goals').update(goalData).eq('id', editingGoalId).select();
            else result = await supabase.from('user_goals').insert([goalData]).select();
            if (result.error) throw result.error;
            if (result.data && result.data.length > 0) {
                const dbGoal = result.data[0];
                const mappedGoal: Goal = {
                    id: dbGoal.id,
                    title: dbGoal.title,
                    type: (dbGoal.status as EngineType) || selectedEngine,
                    deadline: dbGoal.deadline || "",
                    priority: goalPriority,
                    volumeTarget,
                    volumeUnit,
                    routineFreq,
                    pipelineTasks,
                    siegeNotes,
                    startDate: dbGoal.created_at,
                    progress: dbGoal.progress || 0
                };
                if (editingGoalId) setActiveGoals(prev => prev.map(g => g.id === editingGoalId ? mappedGoal : g));
                else setActiveGoals(prev => [mappedGoal, ...prev]);
                resetEngine();
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            alert(`Failed to save matrix: ${message}`);
        }
    };

    const scrollToWizard = () => {
        setTimeout(() => {
            if (wizardRef.current && scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const target = wizardRef.current;
                const relativeTop = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
                container.scrollTo({ top: relativeTop - 32, behavior: 'smooth' });
            }
        }, 100);
    };

    const handleModifyGoal = (goal: Goal) => {
        setEditingGoalId(goal.id);
        setGoalTitle(goal.title);
        setSelectedEngine(goal.type);
        if (goal.deadline) {
            const start = goal.startDate ? new Date(goal.startDate) : new Date();
            const end = new Date(goal.deadline);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDeadlineDays(Math.max(1, diffDays));
        }
        setGoalPriority(goal.priority);
        setVolumeTarget(goal.volumeTarget || "");
        setVolumeUnit(goal.volumeUnit || "");
        setRoutineFreq(goal.routineFreq || null);
        setPipelineTasks(goal.pipelineTasks || [{ id: Date.now(), text: "" }]);
        setSiegeNotes(goal.siegeNotes || "");
        setCreationStep(2);
        scrollToWizard();
    };

    interface GoalTemplate {
        title: string;
        desc: string;
        icon: React.ElementType;
        color: string;
        prefill: {
            type: EngineType;
            title: string;
            target?: string;
            unit?: string;
            freq?: number;
            tasks?: { id: number; text: string }[];
        };
    }

    const handleTemplateSelect = (template: GoalTemplate) => {
        resetEngine();
        setGoalTitle(template.prefill.title);
        setSelectedEngine(template.prefill.type);
        if (template.prefill.type === "volume") {
            setVolumeTarget(template.prefill.target || "");
            setVolumeUnit(template.prefill.unit || "");
        } else if (template.prefill.type === "routine") {
            // Convert number freq to RoutineFrequency
            const freqVal = template.prefill.freq || 7;
            setRoutineFreq({ type: 'flexible', count: freqVal, period: 'week' });
        } else if (template.prefill.type === "pipeline") {
            setPipelineTasks(template.prefill.tasks || [{ id: Date.now(), text: "" }]);
        }
        setCreationStep(2);
        scrollToWizard();
    };

    interface CommunityChallenge {
        title: string;
        type: EngineType;
        desc: string;
        icon: React.ElementType;
        color: string;
    }

    const handleJoinChallenge = async (challenge: CommunityChallenge) => {
        const isDuplicate = activeGoals.some(g => g.title === challenge.title && g.type === challenge.type);
        if (isDuplicate) return alert("Challenge already active.");
        try {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");
            const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const goalData = {
                user_id: user.id,
                title: challenge.title,
                progress: 0,
                status: challenge.type,
                deadline: thirtyDaysLater.toISOString().split('T')[0],
                priority: "high",
                volume_target: challenge.type === "volume" ? "50" : null,
                volume_unit: challenge.type === "volume" ? "Items" : null,
                routine_freq: challenge.type === "routine" ? JSON.stringify({ type: 'flexible', count: 7, period: 'week' }) : null,
                siege_notes: challenge.desc
            };
            const { data, error } = await supabase.from('user_goals').insert([goalData]).select();
            if (error) throw error;
            if (data && data.length > 0) {
                const dbGoal = data[0];
                setActiveGoals(prev => [{
                    id: dbGoal.id,
                    title: dbGoal.title,
                    type: (dbGoal.status as EngineType) || challenge.type,
                    deadline: dbGoal.deadline || "",
                    priority: dbGoal.priority || "high",
                    volumeTarget: dbGoal.volume_target?.toString(),
                    volumeUnit: dbGoal.volume_unit,
                    routineFreq: dbGoal.routine_freq ? (typeof dbGoal.routine_freq === 'string' ? JSON.parse(dbGoal.routine_freq) : dbGoal.routine_freq) : null,
                    siegeNotes: dbGoal.siege_notes,
                    startDate: dbGoal.created_at,
                    progress: dbGoal.progress || 0
                }, ...prev]);
                alert(`Successfully synchronized ${challenge.title}!`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            alert(`Failed to synchronize challenge: ${message}`);
        }
    };

    return (
        <div className={`flex h-[100dvh] bg-[var(--bg-base)] text-primary overflow-hidden font-sans selection:bg-primary selection:text-[var(--bg-base)] relative transition-opacity duration-500 ${isLoggingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <div ref={backgroundRef} className="mouse-tracker-container" style={{ '--mouse-x': '50vw', '--mouse-y': '50vh' } as React.CSSProperties}>
                <div className="base-dots" /><div className="spotlight-dots" />
            </div>

            <Sidebar resetEngine={resetEngine} />

            <main className="flex-1 flex flex-col min-w-0 relative z-10">
                <TopHeader setProgressGoalId={setProgressGoalId} />

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 relative z-10">
                    {revivalMessage && (
                        <div className="max-w-5xl mx-auto mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="gf-surface rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-md">
                                <div className="flex items-center gap-3 text-primary"><Sparkles size={20} className="shrink-0 animate-pulse" /><p className="text-[13px] font-bold">{revivalMessage}</p></div>
                                <button onClick={() => setRevivalMessage(null)} className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors"><X size={16} /></button>
                            </div>
                        </div>
                    )}

                    <DashboardHome
                        creationStep={creationStep} setCreationStep={setCreationStep}
                        progressGoalId={progressGoalId} setProgressGoalId={setProgressGoalId}
                        handleModifyGoal={handleModifyGoal} resetEngine={resetEngine}
                        goalTitle={goalTitle} setGoalTitle={setGoalTitle}
                        selectedEngine={selectedEngine} setSelectedEngine={setSelectedEngine}
                        goalPriority={goalPriority} setGoalPriority={setGoalPriority}
                        volumeTarget={volumeTarget} setVolumeTarget={setVolumeTarget}
                        volumeUnit={volumeUnit} setVolumeUnit={setVolumeUnit}
                        routineFreq={routineFreq} setRoutineFreq={setRoutineFreq}
                        pipelineTasks={pipelineTasks}
                        handlePipelineTaskChange={(id, text) => setPipelineTasks(tasks => tasks.map(t => t.id === id ? { ...t, text } : t))}
                        addPipelineTask={() => setPipelineTasks([...pipelineTasks, { id: Date.now(), text: "" }])}
                        removePipelineTask={(id) => setPipelineTasks(pipelineTasks.filter(t => t.id !== id))}
                        siegeNotes={siegeNotes} setSiegeNotes={setSiegeNotes}
                        deadlineDays={deadlineDays} setDeadlineDays={setDeadlineDays}
                        isPublic={isPublic} setIsPublic={setIsPublic}
                        handleInitializeEngine={handleInitializeEngine}
                        handleTemplateSelect={handleTemplateSelect}
                        handleJoinChallenge={handleJoinChallenge}
                        wizardRef={wizardRef} editingGoalId={editingGoalId}
                        QUICK_TEMPLATES={QUICK_TEMPLATES} COMMUNITY_CHALLENGES={COMMUNITY_CHALLENGES}
                    />
                    <DailyCheckIn />
                    <GlobalForge />
                    <Analytics />
                    <SettingsView 
                        activeView={activeView} theme={undefined} setTheme={() => {}}
                        setIsDeactivateModalOpen={setIsDeactivateModalOpen}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        setAccountActionPassword={setAccountActionPassword}
                        setAccountActionError={setAccountActionError}
                    />
                </div>
            </main>

            <AccountActionModal 
                isOpen={isDeleteModalOpen || isDeactivateModalOpen}
                isDeleteMode={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setIsDeactivateModalOpen(false); }}
                password={accountActionPassword} setPassword={setAccountActionPassword}
                error={accountActionError} isProcessing={isUploading}
                onConfirm={() => handleAccountAction(isDeleteModalOpen ? 'delete' : 'deactivate')}
            />

            <InviteModal 
                isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}
                username={userProfile.username} copyStatus={copyStatus} onCopy={handleCopyInviteLink}
            />

            <ReviewModal 
                isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}
                reviewRating={reviewRating} setReviewRating={setReviewRating}
                reviewText={reviewText} setReviewText={setReviewText}
                isSubmitting={isReviewSubmitting} reviewSuccess={reviewSuccess}
                onSubmit={handleSubmitReview}
            />
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen bg-[var(--bg-base)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-[12px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Initializing Forge...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
