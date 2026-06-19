"use client";

import React from "react";
import { 
    LayoutDashboard, Activity, Globe, BarChart2, 
    Settings, LogOut, ChevronLeft 
} from "lucide-react";
import Logo from "@/components/Logo";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { ViewState, SettingsTab } from "../types";
import { useDashboardNavigation } from "@/lib/hooks/useDashboardNavigation";

interface SidebarProps {
  resetEngine: () => void;
}

export const Sidebar = ({ resetEngine }: SidebarProps) => {
    const { 
        activeView, 
        activeSettingsTab, 
        setActiveSettingsTab,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        storedPreviousView,
        activeGoals,
        checkedInGoals,
    } = useDashboardStore();

    const { handleSignOut } = useDashboardData();
    const { handleNavigation } = useDashboardNavigation();

    return (
        <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-[var(--bg-surface)]/80 backdrop-blur-3xl border-r border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="h-16 flex items-center px-6 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => handleNavigation("dashboard")}>
                    <Logo size={24} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-extrabold text-[16px] tracking-tight text-primary">GoalForge.</span>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeView !== "settings" ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"}`}>
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 px-2">Main Menu</div>
                        <button onClick={() => { handleNavigation("dashboard"); resetEngine(); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all group ${activeView === 'dashboard' ? 'bg-[var(--bg-base)] border border-[var(--border)] text-primary shadow-sm' : 'hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary'}`}>
                            <LayoutDashboard size={18} /> <span className="text-[13px]">Dashboard</span>
                        </button>
                        <button onClick={() => handleNavigation("daily-check-in")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all group ${activeView === 'daily-check-in' ? 'bg-[var(--bg-base)] border border-[var(--border)] text-primary shadow-sm' : 'hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary'}`}>
                            <Activity size={18} /> <span className="text-[13px]">Daily Check-in</span>
                            {activeGoals.length > checkedInGoals.length && (
                                <div className="ml-auto flex items-center justify-center">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--text-primary)] text-[11px] font-black text-[var(--bg-base)] shadow-sm">
                                        {activeGoals.length - checkedInGoals.length}
                                    </div>
                                </div>
                            )}
                        </button>
                        <button onClick={() => handleNavigation("global-forge")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all group ${activeView === 'global-forge' ? 'bg-[var(--bg-base)] border border-[var(--border)] text-primary shadow-sm' : 'hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary'}`}>
                            <Globe size={18} /> <span className="text-[13px]">The Global Forge</span>
                        </button>
                        <button onClick={() => handleNavigation("analytics")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all group ${activeView === 'analytics' ? 'bg-[var(--bg-base)] border border-[var(--border)] text-primary shadow-sm' : 'hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary'}`}>
                            <BarChart2 size={18} /> <span className="text-[13px]">Execution Analytics</span>
                        </button>
                    </nav>
                    <div className="p-4 border-t border-[var(--border)] space-y-2 shrink-0">
                        <button onClick={() => handleNavigation("settings")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary font-semibold transition-all group">
                            <Settings size={18} /> <span className="text-[13px]">Settings</span>
                        </button>
                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-muted hover:text-red-500 font-semibold transition-all group">
                            <LogOut size={18} /> <span className="text-[13px]">Sign Out</span>
                        </button>
                    </div>
                </div>

                <div className={`absolute inset-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeView === "settings" ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"}`}>
                    <div className="p-4 border-b border-[var(--border)] shrink-0">
                        <button onClick={() => handleNavigation(storedPreviousView)} className="flex items-center gap-2 text-[13px] font-bold text-muted transition-transform group px-2 py-1.5 w-full hover:-translate-x-1 hover:bg-[var(--bg-base)] hover:text-primary rounded-lg">
                            <ChevronLeft size={16} /> Back to Engine
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 px-2 mt-2">Configurations</div>
                        {[
                            { id: "account", icon: UserCircle, label: "Account Profile" },
                            { id: "preferences", icon: Sliders, label: "Preferences" },
                            { id: "notifications", icon: BellRing, label: "Notifications" },
                            { id: "billing", icon: CreditCard, label: "Billing & Plans" },
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id as SettingsTab)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all group ${activeSettingsTab === tab.id ? "bg-[var(--bg-base)] border border-[var(--border)] text-primary shadow-sm" : "hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] text-muted hover:text-primary"}`}>
                                <tab.icon size={18} /> <span className="text-[13px]">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-6 text-[10px] font-mono text-muted text-center border-t border-[var(--border)] shrink-0">GoalForge v2.0.4</div>
                </div>
            </div>
        </aside>
    );
};

// Internal icons needed for sidebar
import { 
    UserCircle, Sliders, BellRing, CreditCard 
} from "lucide-react";
