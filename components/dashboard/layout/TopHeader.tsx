"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
    Menu, Search, LayoutDashboard, Activity, Globe, 
    BarChart2, Settings, Bell, User, LogOut, Target, CreditCard, Share2, Star
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useDashboardNavigation } from "@/lib/hooks/useDashboardNavigation";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { ViewState, SettingsTab } from "../types";

interface TopHeaderProps {
    setProgressGoalId: (id: string | null) => void;
}

export const TopHeader = ({ setProgressGoalId }: TopHeaderProps) => {
    const { 
        activeView, 
        storedPreviousView, 
        activeSettingsTab, 
        searchQuery, 
        setSearchQuery,
        setIsMobileMenuOpen,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        userProfile,
        activeGoals
    } = useDashboardStore();

    const { handleNavigation } = useDashboardNavigation();
    const { handleSignOut } = useDashboardData();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsProfileMenuOpen]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const searchableItems = [
            { id: 'v-dash', type: 'view', label: 'Dashboard', keywords: ['main', 'home', 'matrices', 'goals'], view: 'dashboard' },
            { id: 'v-checkin', type: 'view', label: 'Daily Check-in', keywords: ['daily', 'progress', 'log', 'execution', 'today', 'tasks'], view: 'daily-check-in' },
            { id: 'v-forge', type: 'view', label: 'The Global Forge', keywords: ['community', 'challenges', 'network', 'discovery'], view: 'global-forge' },
            { id: 'v-analytics', type: 'view', label: 'Execution Analytics', keywords: ['stats', 'metrics', 'performance', 'charts', 'data'], view: 'analytics' },
            { id: 's-account', type: 'setting', label: 'Account Profile', keywords: ['username', 'email', 'avatar', 'password', 'security', 'profile'], view: 'settings', tab: 'account' },
            { id: 's-billing', type: 'setting', label: 'Billing & Plans', keywords: ['subscription', 'payment', 'money', 'pro', 'upgrade'], view: 'settings', tab: 'billing' },
            { id: 's-pref', type: 'setting', label: 'App Preferences', keywords: ['theme', 'dark', 'light', 'ui'], view: 'settings', tab: 'preferences' },
            { id: 's-notif', type: 'setting', label: 'Notifications', keywords: ['alerts', 'email', 'push'], view: 'settings', tab: 'notifications' },
            ...activeGoals.map(g => ({
                id: `g-${g.id}`,
                type: 'goal',
                label: g.title,
                keywords: [g.type, 'goal', 'matrix', 'execution'],
                view: 'dashboard',
                goalId: g.id
            }))
        ];

        return searchableItems.filter(item => {
            const itemText = (item.label + ' ' + item.keywords.join(' ')).toLowerCase();
            return keywords.every(kw => itemText.includes(kw));
        }).slice(0, 6);
    }, [searchQuery, activeGoals]);

    return (
        <header className="h-16 flex items-center justify-between px-3 sm:px-8 border-b border-[var(--border)] bg-[var(--bg-surface)]/70 backdrop-blur-3xl shrink-0 transition-all relative z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="md:hidden p-2 -ml-1 text-muted hover:text-primary rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)} title="Open Menu"><Menu size={20} /></button>
                {activeView !== "settings" ? (
                    <div className="hidden sm:flex items-center relative group animate-in fade-in slide-in-from-top-2">
                        <Search size={16} className="absolute left-3 text-muted group-focus-within:text-primary transition-colors" />
                        <input type="text" placeholder="Search systems..." className="w-64 bg-[var(--bg-base)] border border-[var(--border)] rounded-full py-1.5 pl-9 pr-4 text-[13px] text-primary focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-all outline-none shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} />
                        <div className="absolute right-3 text-[10px] font-mono text-muted border border-[var(--border)] px-1.5 rounded bg-[var(--bg-surface)]">⌘K</div>
                        {isSearchFocused && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden py-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                                {searchResults.map(result => (
                                    <button key={result.id} onClick={() => { if (result.type === 'goal' && 'goalId' in result) { handleNavigation('dashboard'); setProgressGoalId(result.goalId); } else if (result.type === 'setting' && 'tab' in result) { handleNavigation(result.view as ViewState, result.tab as SettingsTab); } else if (result.type === 'view') { handleNavigation(result.view as ViewState); } setSearchQuery(""); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-base)] text-left transition-colors">
                                        <div className="text-muted">{result.type === 'view' && <LayoutDashboard size={16} />}{result.type === 'setting' && <Settings size={16} />}{result.type === 'goal' && <Target size={16} />}</div>
                                        <div><div className="text-[13px] font-bold text-primary">{result.label}</div><div className="text-[10px] font-mono text-muted uppercase tracking-widest">{result.type}</div></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold animate-in fade-in slide-in-from-left-4">
                        <button onClick={() => handleNavigation(storedPreviousView)} className="flex items-center gap-2 px-2 py-1 rounded-md opacity-40 hover:opacity-100 hover:bg-[var(--bg-base)] text-muted hover:text-primary transition-all">
                            {storedPreviousView === "dashboard" ? <LayoutDashboard size={16} /> : storedPreviousView === "global-forge" ? <Globe size={16} /> : storedPreviousView === "daily-check-in" ? <Activity size={16} /> : <BarChart2 size={16} />}
                            <span className="capitalize">{storedPreviousView.replace("-", " ")}</span>
                        </button>
                        <span className="text-[var(--border)] opacity-40">/</span>
                        <div className="flex items-center gap-2 px-2 py-1 text-muted opacity-40"><Settings size={16} /><span>Settings</span></div>
                        <span className="text-[var(--border)] opacity-40">/</span>
                        <span className="text-primary capitalize px-2 py-1">{activeSettingsTab}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-5">
                <ThemeToggle />
                <button onClick={() => handleNavigation("settings", "notifications")} className="text-muted hover:text-primary transition-colors relative cursor-pointer group p-1.5 sm:p-0" title="View Notifications">
                    <Bell size={18} className="group-hover:shake-hover transition-transform" />
                    <span className="absolute top-1 sm:-top-0.5 right-1 sm:-right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-[var(--bg-surface)]" />
                </button>
                <div className="w-[1px] h-5 bg-[var(--border)] hidden sm:block"></div>
                <div className="relative" ref={profileMenuRef}>
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group relative z-50" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} title="Profile Menu">
                        <div className="text-right hidden sm:block">
                            <div className="text-[13px] font-bold text-primary">{userProfile.name}</div>
                            <div className="text-[10px] font-mono text-muted uppercase tracking-widest">Free Plan</div>
                        </div>
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--bg-surface)] border flex items-center justify-center text-[12px] sm:text-[13px] font-bold text-primary transition-all shadow-sm overflow-hidden ${isProfileMenuOpen ? 'border-[var(--text-primary)] ring-2 ring-primary/20 scale-105' : 'border-[var(--border)] group-hover:border-[var(--text-primary)]'}`}>
                            {userProfile.avatarUrl ? <Image src={userProfile.avatarUrl} alt={userProfile.name} width={36} height={36} unoptimized className="w-full h-full object-cover" /> : userProfile.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                    <div className={`absolute right-0 top-full mt-4 w-[240px] sm:w-[280px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden transform origin-top-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isProfileMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent backdrop-blur-2xl -z-10" />
                        <div className="p-4 border-b border-[var(--border)]/50 bg-[var(--bg-base)]/50">
                            <p className="text-[14px] font-extrabold text-primary truncate">{userProfile.name}</p>
                            <p className="text-[11px] font-mono text-muted truncate mt-0.5">@{userProfile.username}</p>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <button onClick={() => handleNavigation("settings", "account")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted hover:text-primary hover:bg-[var(--bg-base)] transition-all"><User size={16} /> Edit Profile</button>
                            <button onClick={() => handleNavigation("settings", "billing")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted hover:text-primary hover:bg-[var(--bg-base)] transition-all"><CreditCard size={16} /> Billing</button>
                            <button onClick={() => {}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted hover:text-primary hover:bg-[var(--bg-base)] transition-all"><Share2 size={16} /> Share Profile</button>
                            <button onClick={() => {}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted hover:text-primary hover:bg-[var(--bg-base)] transition-all"><Star size={16} /> Review Platform</button>
                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-muted hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"><LogOut size={16} /> Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
