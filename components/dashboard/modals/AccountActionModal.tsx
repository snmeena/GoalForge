"use client";

import React from "react";
import { Trash2, Activity, Info } from "lucide-react";

interface AccountActionModalProps {
    isOpen: boolean;
    isDeleteMode: boolean;
    onClose: () => void;
    password: string;
    setPassword: (pass: string) => void;
    error: string;
    isProcessing: boolean;
    onConfirm: () => void;
}

export const AccountActionModal = ({
    isOpen,
    isDeleteMode,
    onClose,
    password,
    setPassword,
    error,
    isProcessing,
    onConfirm
}: AccountActionModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--bg-base)]/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl sm:rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className={`p-6 sm:p-8 ${isDeleteMode ? 'bg-red-500/5' : 'bg-amber-500/5'}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDeleteMode ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                            {isDeleteMode ? <Trash2 size={24} /> : <Activity size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-primary">
                                {isDeleteMode ? "Delete Account" : "Deactivate Account"}
                            </h2>
                            <p className="text-[12px] font-bold text-muted uppercase tracking-widest">Verification Required</p>
                        </div>
                    </div>

                    <p className="text-[14px] text-muted leading-relaxed mb-6">
                        {isDeleteMode
                            ? "Your account will be marked for deletion. You have 30 days to revive it by logging in again with your current credentials. After 30 days, all data will be permanently wiped."
                            : "Your account will be temporarily disabled. Your data remains safe, but you will be signed out. Simply log back in to reactivate your account at any time."
                        }
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="account-action-password" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Confirm Password</label>
                            <input
                                type="password"
                                id="account-action-password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[14px] text-primary focus:border-primary transition-all outline-none shadow-inner"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[12px] font-bold flex items-start gap-2 animate-in slide-in-from-left-2">
                                <Info size={14} className="mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-[13px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isProcessing || !password}
                                className={`flex-1 py-3 rounded-xl text-[13px] font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${isDeleteMode ? 'gf-btn-primary bg-red-600 border-red-600' : 'gf-btn-primary bg-amber-600 border-amber-600'}`}
                            >
                                {isProcessing ? "Verifying..." : (isDeleteMode ? "Confirm Deletion" : "Deactivate Now")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
