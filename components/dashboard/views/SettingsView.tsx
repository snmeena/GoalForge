import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
    UserCircle, Hash, Edit3, CheckCircle2, Shield, 
    DownloadCloud, Activity, Trash2, Sun, Moon, Globe,
    Pizza, ChevronDown, Check, Heart, Sparkles, Zap, BellRing
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useAccountActions } from "@/lib/hooks/useAccountActions";

import { Theme } from "@/components/ThemeProvider";
import { Mounted } from "@/components/Mounted";

export const SettingsView = ({
    activeView,
    theme,
    setTheme,
    setIsDeactivateModalOpen,
    setIsDeleteModalOpen,
    setAccountActionPassword,
    setAccountActionError
}: {
    activeView: string;
    theme: Theme | undefined;
    setTheme: (theme: Theme) => void;
    setIsDeactivateModalOpen: (is: boolean) => void;
    setIsDeleteModalOpen: (is: boolean) => void;
    setAccountActionPassword: (pass: string) => void;
    setAccountActionError: (error: string) => void;
}) => {
    const { 
        userProfile, 
        activeSettingsTab, 
        setActiveSettingsTab,
        notifications,
        setNotifications,
        isUploading,
        setUserProfile
    } = useDashboardStore();

    const { 
        handleUpdateProfile, 
        handleUpdateUsername, 
        handleAvatarUpload,
        handleUpdateNotificationSetting 
    } = useUserProfile();

    const { 
        handleVerifyPassword: verifyPasswordAction, 
        handleUpdatePassword: updatePasswordAction 
    } = useAccountActions();

    const isActive = activeView === "settings";
    const [isExporting, setIsExporting] = useState(false);
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Local form state
    const [name, setName] = useState(userProfile.name);
    const [bio, setBio] = useState(userProfile.bio);
    const [twitterUrl, setTwitterUrl] = useState(userProfile.twitterUrl);
    const [githubUrl, setGithubUrl] = useState(userProfile.githubUrl);
    const [newUsernameInput, setNewUsernameInput] = useState(userProfile.username);
    const [canChangeUsername, setCanChangeUsername] = useState(userProfile.canChangeUsername);

    // Password State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passStep, setPassStep] = useState<"current" | "new" | "success">("current");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passError, setPassError] = useState("");

    // Sync local state with userProfile when it changes (e.g. after fetch or user switch)
    const [prevProfileId, setPrevProfileId] = useState(userProfile.id);
    if (userProfile.id !== prevProfileId) {
        setPrevProfileId(userProfile.id);
        setName(userProfile.name);
        setBio(userProfile.bio);
        setTwitterUrl(userProfile.twitterUrl);
        setGithubUrl(userProfile.githubUrl);
        setNewUsernameInput(userProfile.username);
        setCanChangeUsername(userProfile.canChangeUsername);
    }

    const handleVerifyPassword = async () => {
        try {
            await verifyPasswordAction(currentPassword);
            setPassStep("new");
            setPassError("");
        } catch (error: unknown) {
            setPassError(error instanceof Error ? error.message : String(error));
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await updatePasswordAction(newPassword);
            setPassStep("success");
            setTimeout(() => {
                setIsChangingPassword(false);
                setPassStep("current");
                setCurrentPassword("");
                setNewPassword("");
            }, 2000);
        } catch (error: unknown) {
            setPassError(error instanceof Error ? error.message : String(error));
        }
    };

    const onUpdateProfile = () => {
        handleUpdateProfile(name, bio, twitterUrl, githubUrl);
    };

    const onAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleAvatarUpload(file);
        }
    };

    const updateNotification = (key: keyof typeof notifications, value: string | boolean) => {
        setNotifications({ [key]: value } as Partial<typeof notifications>);
        handleUpdateNotificationSetting(key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`), value);
    };

    // Billing State
    const [isPizzaMenuOpen, setIsPizzaMenuOpen] = useState(false);
    const [selectedPizza, setSelectedPizza] = useState<number | null>(null);
    const [paymentDone, setPaymentDone] = useState(false);

    const pizzaMenu = [
        { name: "Classic Margherita", price: "$5", desc: "Basic fuel for minor bug fixes.", icon: "🧀" },
        { name: "Paneer Powerhouse", price: "$12", desc: "Premium energy for complex logic engines.", icon: "🔥", favorite: true },
        { name: "Double Pepperoni", price: "$18", desc: "Sustenance for overnight feature sprints.", icon: "🍕" },
        { name: "The Forge Master", price: "$25", desc: "Unlocks ultimate developer focus mode.", icon: "👑" },
    ];

    const handlePizzaSelect = (idx: number) => {
        setSelectedPizza(idx);
        setPaymentDone(false);
    };

    const handleExportData = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Initializing Data Export Protocol...");
        
        try {
            setIsExporting(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("Auth Error:", authError);
                alert("Session expired. Please refresh the page.");
                return;
            }

            console.log("Fetching User Matrices and Execution Logs...");
            
            // Fetch data in parallel for efficiency
            const [goalsRes, logsRes] = await Promise.all([
                supabase.from('user_goals').select('*').eq('user_id', user.id),
                supabase.from('goal_logs').select('*').eq('user_id', user.id)
            ]);

            if (goalsRes.error) throw goalsRes.error;
            if (logsRes.error) throw logsRes.error;

            const exportData = {
                metadata: {
                    platform: "GoalForge",
                    version: "2.0.4",
                    exported_at: new Date().toISOString(),
                    user_id: user.id,
                },
                summary: {
                    total_goals: goalsRes.data?.length || 0,
                    total_logs: logsRes.data?.length || 0
                },
                data: {
                    goals: goalsRes.data || [],
                    logs: logsRes.data || []
                }
            };

            if (exportData.summary.total_goals === 0 && exportData.summary.total_logs === 0) {
                alert("System Alert: Your execution matrix is empty. No data found to export.");
                return;
            }

            console.log("Synthesizing JSON Blob...");
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `goalforge-matrix-export-${new Date().toISOString().split('T')[0]}.json`;

            document.body.appendChild(link);
            link.click();

            // Tactical Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            console.log("Export Successful.");

        } catch (error: unknown) {
            console.error("Critical Export Error:", error);
            alert(`Forge Error: ${error instanceof Error ? error.message : "Unknown error during synchronization"}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className={`max-w-4xl mx-auto space-y-8 pb-20 transition-all duration-500 w-full ${isActive ? "opacity-100 visible translate-y-0 relative z-20" : "opacity-0 invisible translate-y-4 pointer-events-none absolute top-0 z-0"}`}>

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary mb-1 capitalize">{activeSettingsTab} Configuration</h1>
                <p className="text-[14px] font-medium text-muted">Manage your personal data, workspace preferences, and security settings.</p>
            </div>

            {activeSettingsTab === "account" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="glass-card p-6 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <h3 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2"><UserCircle size={18} className="text-muted" /> Personal Information</h3>

                        <div className="flex flex-col sm:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                                <div className="w-24 h-24 rounded-full bg-[var(--bg-base)] border-2 border-[var(--border)] flex items-center justify-center text-[32px] font-bold text-primary shadow-inner overflow-hidden relative group/avatar">
                                    {userProfile.avatarUrl ? (
                                        <img src={userProfile.avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        name.split(' ').map(n => n[0]).join('')
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-[var(--bg-base)]/60 backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    name="avatar-upload"
                                    ref={fileInputRef}
                                    onChange={onAvatarUpload}
                                    accept="image/*"
                                    className="hidden"
                                    aria-label="Upload profile image"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="text-[11px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-colors border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg shadow-sm disabled:opacity-50"
                                >
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </button>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <label htmlFor="display-name" className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Display Name</label>
                                    <input type="text" id="display-name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-primary focus:bg-[var(--bg-surface)] focus:border-primary transition-all outline-none shadow-inner" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">GoalForge Handle</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] flex-1 shadow-inner">
                                            <Hash size={14} className="text-muted" />
                                            <span className="text-[13.5px] font-mono font-bold text-primary">{userProfile.username || "loading_handle..."}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCanChangeUsername(true);
                                                setNewUsernameInput(userProfile.username);
                                            }}
                                            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                                            title="Edit Handle"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email-address" className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Email Address (Read Only)</label>
                                    <input type="email" id="email-address" name="email" value={userProfile.email} readOnly className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-muted opacity-60 cursor-not-allowed outline-none font-mono" />
                                </div>
                                <div>
                                    <label htmlFor="short-bio" className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Short Bio</label>
                                    <textarea 
                                        id="short-bio"
                                        name="bio"
                                        value={bio} 
                                        onChange={(e) => setBio(e.target.value)} 
                                        placeholder="Describe your execution philosophy..."
                                        rows={2}
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-primary focus:bg-[var(--bg-surface)] focus:border-primary transition-all outline-none shadow-inner resize-none" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="twitter-handle" className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">X/Twitter Handle</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">@</span>
                                            <input 
                                                type="text" 
                                                id="twitter-handle"
                                                name="twitter"
                                                value={twitterUrl} 
                                                onChange={(e) => setTwitterUrl(e.target.value.replace(/^@/, ''))} 
                                                placeholder="handle"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-8 pr-4 text-[13.5px] text-primary focus:bg-[var(--bg-surface)] focus:border-primary transition-all outline-none shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="github-handle" className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">GitHub Handle</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">@</span>
                                            <input 
                                                type="text" 
                                                id="github-handle"
                                                name="github"
                                                value={githubUrl} 
                                                onChange={(e) => setGithubUrl(e.target.value.replace(/^@/, ''))} 
                                                placeholder="username"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-8 pr-4 text-[13.5px] text-primary focus:bg-[var(--bg-surface)] focus:border-primary transition-all outline-none shadow-inner" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {canChangeUsername && (
                            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 animate-in slide-in-from-left-4 duration-500">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-[14px] font-bold text-primary flex items-center gap-2">
                                            <Edit3 size={16} /> Claim Your Unique Handle
                                        </h4>
                                        <p className="text-[12px] text-muted mt-1">You are using a generated handle. Claim a professional one before it&apos;s taken.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input
                                                type="text"
                                                id="new-handle"
                                                name="new-handle"
                                                value={newUsernameInput}
                                                onChange={(e) => setNewUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                placeholder="new_handle"
                                                className="bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2 pl-8 pr-3 text-[13px] font-bold text-primary outline-none focus:border-primary w-40"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleUpdateUsername(newUsernameInput)}
                                            disabled={isUploading || newUsernameInput.length < 3}
                                            className="px-4 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-base)] text-[12px] font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                                        >
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end pt-5 border-t border-[var(--border)]">
                            <button
                                onClick={onUpdateProfile}
                                disabled={isUploading}
                                className="gf-btn gf-btn-primary px-6 py-2.5 rounded-xl text-[13px] shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle2 size={16} /> {isUploading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <h3 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2"><Shield size={18} className="text-muted" /> Security</h3>

                        {!isChangingPassword ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[13px] font-bold text-primary">{userProfile.hasPassword ? "Security Matrix" : "Initialize Security Matrix"}</p>
                                    <p className="text-[12px] text-muted">{userProfile.hasPassword ? "Update your password to keep your account secure." : "Setup a password to enable manual login alongside your social account."}</p>
                                </div>
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className={`px-4 py-2 rounded-xl border text-[12px] font-bold transition-all ${!userProfile.hasPassword ? 'bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] hover:opacity-90' : 'border-[var(--border)] bg-[var(--bg-base)] text-primary hover:border-primary'}`}
                                >
                                    {userProfile.hasPassword ? "Change Password" : "Set Password"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                {passStep === "current" && userProfile.hasPassword && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label htmlFor="current-password" className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-1">Current Password</label>
                                                <Link href="/forgotpass" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</Link>
                                            </div>
                                            <input
                                                type="password"
                                                id="current-password"
                                                name="current-password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-primary focus:border-primary transition-all outline-none shadow-inner"
                                            />
                                        </div>
                                        {passError && <p className="text-[11px] font-bold text-red-500 ml-1">{passError}</p>}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleVerifyPassword}
                                                disabled={isUploading || !currentPassword}
                                                className="flex-1 gf-btn gf-btn-primary py-2.5 rounded-xl text-[12px] font-bold disabled:opacity-50 shadow-sm"
                                            >
                                                {isUploading ? "Verifying..." : "Verify Password"}
                                            </button>
                                            <button
                                                onClick={() => { setIsChangingPassword(false); setPassError(""); setCurrentPassword(""); }}
                                                className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[12px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {passStep === "new" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="new-password" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">New Password</label>
                                            <input
                                                type="password"
                                                id="new-password"
                                                name="new-password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter at least 6 characters"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-primary focus:border-primary transition-all outline-none shadow-inner"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="verify-password" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Verify New Password</label>
                                            <input
                                                type="password"
                                                id="verify-password"
                                                name="verify-password"
                                                placeholder="Re-enter new password"
                                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13.5px] text-primary focus:border-primary transition-all outline-none shadow-inner"
                                                onChange={(e) => {
                                                    if (e.target.value !== newPassword && e.target.value !== "") {
                                                        setPassError("Passwords do not match.");
                                                    } else {
                                                        setPassError("");
                                                    }
                                                }}
                                            />
                                        </div>
                                        {passError && <p className="text-[11px] font-bold text-red-500 ml-1">{passError}</p>}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleUpdatePassword}
                                                disabled={isUploading || !newPassword || passError !== ""}
                                                className="flex-1 gf-btn gf-btn-primary py-2.5 rounded-xl text-[12px] font-bold disabled:opacity-50 shadow-sm"
                                            >
                                                {isUploading ? "Updating..." : userProfile.hasPassword ? "Update Password" : "Set Password"}
                                            </button>
                                            {!userProfile.hasPassword && (
                                                <button
                                                    onClick={() => { setIsChangingPassword(false); setPassError(""); setNewPassword(""); }}
                                                    className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[12px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {passStep === "success" && (
                                    <div className="flex flex-col items-center py-4 text-center animate-bounce">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <p className="text-[14px] font-bold text-primary">Security Matrix {userProfile.hasPassword ? "Updated" : "Initialized"} Successfully!</p>
                                        <p className="text-[12px] text-muted mt-1">Your security matrix has been updated.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-6 sm:p-6 rounded-3xl border border-red-500/20 bg-red-500/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                        <h3 className="text-[15px] font-bold text-red-500 mb-2 flex items-center gap-2"><Shield size={18} /> Danger Zone</h3>
                        <p className="text-[13px] text-muted mb-6">Permanently remove your personal matrices and account data. This action cannot be reversed.</p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                type="button"
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-primary hover:bg-[var(--bg-base)] hover:-translate-y-0.5 text-[13px] font-bold text-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group/export cursor-pointer relative z-30"
                            >

                                <DownloadCloud size={16} className={`group-hover/export:scale-110 transition-transform ${isExporting ? 'animate-bounce' : ''}`} />
                                {isExporting ? "Compiling Matrix..." : "Export My Data"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeactivateModalOpen(true);
                                    setAccountActionPassword("");
                                    setAccountActionError("");
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] hover:border-amber-500/50 text-[13px] font-bold text-muted hover:text-amber-500 transition-all shadow-sm"
                            >
                                <Activity size={16} /> Deactivate Account
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setAccountActionPassword("");
                                    setAccountActionError("");
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-[13px] font-bold text-red-500 transition-all shadow-sm"
                            >
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeSettingsTab === "preferences" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="glass-card p-6 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <h3 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2"><Sun size={18} className="text-muted" /> App Theme</h3>
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            <button onClick={() => setTheme("light")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-[13px] transition-all ${theme === "light" ? "border-[var(--text-primary)] text-primary bg-[var(--bg-base)]" : "border-[var(--border)] text-muted hover:border-[var(--text-primary)]/50"}`}>
                                <Sun size={16} /> Light
                            </button>
                            <button onClick={() => setTheme("dark")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-[13px] transition-all ${theme === "dark" ? "border-[var(--text-primary)] text-primary bg-[var(--bg-base)]" : "border-[var(--border)] text-muted hover:border-[var(--text-primary)]/50"}`}>
                                <Moon size={16} /> Dark
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6 sm:p-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <h3 className="text-[15px] font-bold text-primary mb-5 flex items-center gap-2"><Globe size={18} className="text-muted" /> Temporal Synchronization</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest">Local Timezone</p>
                                        <Mounted>
                                        <p className="text-[14px] font-mono font-bold text-primary">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                                    </Mounted>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                    Synced
                                </div>
                            </div>
                            <p className="text-[12px] text-muted leading-relaxed pl-1">
                                Used to accurately calculate midnight for your daily execution streaks.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeSettingsTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <BellRing size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-extrabold text-primary">Notification Channels</h3>
                                <p className="text-[12px] text-muted">Control where and how you receive execution alerts.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            {/* Email Alerts */}
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h4 className="text-[14px] font-bold text-primary group-hover:text-[var(--text-primary)] transition-colors">Email Intelligence</h4>
                                    <p className="text-[12px] text-muted max-w-[280px] sm:max-w-md">Receive weekly performance summaries and critical matrix sync alerts.</p>
                                </div>
                                <button 
                                    onClick={() => updateNotification('emailAlerts', !notifications.emailAlerts)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${notifications.emailAlerts ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-[var(--bg-base)] border-[var(--border)]'}`}
                                >
                                    <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${notifications.emailAlerts ? 'left-7 bg-[var(--bg-surface)]' : 'left-1 bg-muted'}`} />
                                </button>
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h4 className="text-[14px] font-bold text-primary group-hover:text-[var(--text-primary)] transition-colors">Native Push Alerts</h4>
                                    <p className="text-[12px] text-muted max-w-[280px] sm:max-w-md">Real-time browser notifications for immediate check-in nudges.</p>
                                </div>
                                <button 
                                    onClick={() => updateNotification('pushNotifications', !notifications.pushNotifications)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${notifications.pushNotifications ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-[var(--bg-base)] border-[var(--border)]'}`}
                                >
                                    <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${notifications.pushNotifications ? 'left-7 bg-[var(--bg-surface)]' : 'left-1 bg-muted'}`} />
                                </button>
                            </div>

                            {/* Weekly Digest */}
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h4 className="text-[14px] font-bold text-primary group-hover:text-[var(--text-primary)] transition-colors">Weekly Execution Digest</h4>
                                    <p className="text-[12px] text-muted max-w-[280px] sm:max-w-md">A comprehensive breakdown of your consistency sent every Monday.</p>
                                </div>
                                <button 
                                    onClick={() => updateNotification('weeklyDigest', !notifications.weeklyDigest)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${notifications.weeklyDigest ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-[var(--bg-base)] border-[var(--border)]'}`}
                                >
                                    <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${notifications.weeklyDigest ? 'left-7 bg-[var(--bg-surface)]' : 'left-1 bg-muted'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-base)]/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-extrabold text-primary">Smart Reminders</h3>
                                <p className="text-[12px] text-muted">Optimize when the Forge nudges you for execution.</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Reminder Time */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-[14px] font-bold text-primary">Daily Check-in Anchor</h4>
                                    <p className="text-[12px] text-muted">Primary reminder to review and log your progress.</p>
                                </div>
                                <div className="relative group/time">
                                    <input 
                                        type="time" 
                                        value={notifications.reminderTime}
                                        onChange={(e) => updateNotification('reminderTime', e.target.value)}
                                        className="bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13px] font-bold text-primary outline-none focus:border-primary shadow-inner min-w-[140px] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[var(--calendar-invert)]"
                                        style={{ "--calendar-invert": theme === "dark" ? 1 : 0 } as React.CSSProperties}
                                    />
                                </div>
                            </div>

                            {/* Pace Deficit Warnings */}
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <h4 className="text-[14px] font-bold text-primary group-hover:text-[var(--text-primary)] transition-colors">Pace Deficit Warnings</h4>
                                    <p className="text-[12px] text-muted max-w-[280px] sm:max-w-md">Immediate alerts when your execution matrix falls into critical zones.</p>
                                </div>
                                <button 
                                    onClick={() => updateNotification('paceWarnings', !notifications.paceWarnings)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${notifications.paceWarnings ? 'bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-[var(--bg-base)] border-[var(--border)]'}`}
                                >
                                    <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-300 ${notifications.paceWarnings ? 'left-7 bg-[var(--bg-surface)]' : 'left-1 bg-muted'}`} />
                                </button>
                            </div>

                            {/* Quiet Hours */}
                            <div className="pt-4 border-t border-[var(--border)]">
                                <h4 className="text-[14px] font-bold text-primary mb-4 flex items-center gap-2">
                                    <Moon size={16} className="text-muted" /> Quiet Hours
                                </h4>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1.5 block ml-1">Start</label>
                                        <input 
                                            type="time" 
                                            value={notifications.quietHoursStart}
                                            onChange={(e) => updateNotification('quietHoursStart', e.target.value)}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13px] font-bold text-primary outline-none focus:border-primary shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[var(--calendar-invert)]"
                                            style={{ "--calendar-invert": theme === "dark" ? 1 : 0 } as React.CSSProperties}
                                        />
                                    </div>
                                    <div className="hidden sm:block text-muted pt-5 font-black">→</div>
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1.5 block ml-1">End</label>
                                        <input 
                                            type="time" 
                                            value={notifications.quietHoursEnd}
                                            onChange={(e) => updateNotification('quietHoursEnd', e.target.value)}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-[13px] font-bold text-primary outline-none focus:border-primary shadow-inner [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[var(--calendar-invert)]"
                                            style={{ "--calendar-invert": theme === "dark" ? 1 : 0 } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted mt-3 italic pl-1">No notifications will be delivered during this window.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSettingsTab === "billing" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
                    <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-surface)]/50 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                            <Pizza size={240} />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-widest mb-6">
                                The &quot;Anti-SaaS&quot; Manifesto
                            </div>
                            
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-5 leading-[0.95]">
                                Funded by <br />
                                <span className="text-muted opacity-40 italic">Margherita & Logic.</span>
                            </h2>
                            
                            <p className="text-[14px] text-muted font-medium leading-relaxed mb-8 max-w-xl">
                                GoalForge is 100% free for executors. We don&apos;t have venture capital, and we don&apos;t want it. 
                                Our only &quot;shareholders&quot; are the people who use the matrix to win.
                            </p>

                            <div className="flex flex-wrap items-center gap-6">
                                <button
                                    onClick={() => {
                                        setIsPizzaMenuOpen(!isPizzaMenuOpen);
                                        if (isPizzaMenuOpen) {
                                            setSelectedPizza(null);
                                            setPaymentDone(false);
                                        }
                                    }}
                                    className="gf-btn gf-btn-primary px-8 py-3.5 text-[13px] font-black shadow-lg group flex items-center gap-2"
                                >
                                    <Pizza className={`w-4 h-4 transition-transform duration-500 ${isPizzaMenuOpen ? 'rotate-180' : ''}`} />
                                    {isPizzaMenuOpen ? 'Close Pizza Menu' : 'Support Development'}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isPizzaMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-primary/5 flex items-center justify-center">
                                        <Heart size={12} className="text-primary/40 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black italic">Free Forever</span>
                                        <span className="text-[9px] text-muted font-bold uppercase tracking-widest">Initialization Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pizza Menu & QR Code - Compact Dashboard Version */}
                        <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isPizzaMenuOpen ? 'max-h-[1500px] opacity-100 mt-10' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-col lg:flex-row gap-6 items-start">
                                {/* Table - Left Column */}
                                <div className="flex-1 bg-[var(--bg-base)]/50 border border-[var(--border)] rounded-2xl overflow-hidden backdrop-blur-xl w-full">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[var(--border)] bg-primary/5">
                                                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted">Category</th>
                                                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pizzaMenu.map((item, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className={`group/row border-b border-[var(--border)] last:border-0 hover:bg-primary/10 transition-colors cursor-pointer ${selectedPizza === idx ? 'bg-primary/5' : ''}`}
                                                        onClick={() => handlePizzaSelect(idx)}
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl shrink-0">{item.icon}</span>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-[13px] truncate">{item.name}</span>
                                                                        {item.favorite && (
                                                                            <span className="px-1.5 py-0.5 rounded-full bg-primary text-[var(--bg-base)] text-[7px] font-black flex items-center gap-1 shrink-0">
                                                                                <Sparkles size={8} /> FAV
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[11px] text-muted font-medium line-clamp-1">{item.desc}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <span className="font-mono font-black text-sm">{item.price}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-3 bg-primary text-[var(--bg-base)] text-center text-[9px] font-black uppercase tracking-[0.2em]">
                                        Select a slice to initialize transaction
                                    </div>
                                </div>

                                {/* QR Code - Right Column */}
                                <div className={`transition-all duration-500 ease-out w-full lg:w-64 shrink-0 ${selectedPizza !== null ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none hidden lg:block'}`}>
                                    <div className="bg-[var(--bg-surface)] border border-primary/20 rounded-2xl p-5 text-center space-y-4 shadow-xl relative overflow-hidden group/qr-card">
                                        {paymentDone ? (
                                            <div className="py-6 animate-in zoom-in-95 duration-500 text-center">
                                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                                                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20"></div>
                                                    <Heart className="text-primary fill-primary" size={24} />
                                                </div>
                                                <h3 className="text-xl font-black mb-2 tracking-tighter">You&apos;re a Legend!</h3>
                                                <p className="text-[12px] text-muted font-medium leading-relaxed px-2 mb-6">
                                                    Your support keeps GoalForge evolving.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setPaymentDone(false);
                                                        setSelectedPizza(null);
                                                    }}
                                                    className="w-full py-2.5 rounded-xl border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.1em] hover:bg-[var(--bg-surface)] transition-all"
                                                >
                                                    Support Again
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative group/qr max-w-[160px] mx-auto">
                                                    <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-lg opacity-0 group-hover/qr:opacity-100 transition duration-700 animate-pulse"></div>
                                                    <img
                                                        src="/QR_Code.jpg"
                                                        alt="Support QR Code"
                                                        className="relative rounded-xl border border-[var(--border)] w-full aspect-square object-cover"
                                                    />
                                                </div>
                                                
                                                <div className="space-y-4 pt-2">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted">Scan to Forge</p>
                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-[14px] text-primary font-black uppercase tracking-widest line-clamp-1">
                                                                {selectedPizza !== null ? pizzaMenu[selectedPizza].name : ''}
                                                            </p>
                                                            <p className="text-[18px] text-primary font-black font-mono">
                                                                {selectedPizza !== null ? pizzaMenu[selectedPizza].price : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setPaymentDone(true)}
                                                        className="w-full py-3 rounded-xl bg-emerald-500 text-white text-[12px] font-black hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                                    >
                                                        <Check size={14} strokeWidth={4} />
                                                        Payment Done
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        {[
                            { icon: Shield, title: "Trust", desc: "No data selling." },
                            { icon: Globe, title: "Open", desc: "Global access." },
                            { icon: Zap, title: "Fast", desc: "Local-first speed." },
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/30 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                                    <item.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-primary">{item.title}</p>
                                    <p className="text-[10px] text-muted">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
