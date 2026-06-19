"use client";

import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { ViewState, SettingsTab } from "@/components/dashboard/types";

export function useDashboardNavigation() {
    const router = useRouter();
    const { 
        activeView, 
        activeSettingsTab, 
        setIsMobileMenuOpen,
        setIsProfileMenuOpen,
        setStoredPreviousView,
    } = useDashboardStore();

    const handleNavigation = (view: ViewState, tab?: SettingsTab) => {
        if (view === activeView && tab === activeSettingsTab) return;

        if (view !== "settings") {
            setStoredPreviousView(view);
        }

        const params = new URLSearchParams();
        params.set("view", view);
        if (tab) params.set("tab", tab);
        
        router.push(`?${params.toString()}`);

        if (window.innerWidth < 768) {
            if (view === "settings" && !tab) {
                setIsMobileMenuOpen(true);
            } else {
                setIsMobileMenuOpen(false);
            }
        }
        setIsProfileMenuOpen(false);
    };

    return { handleNavigation };
}
