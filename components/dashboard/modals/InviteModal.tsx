"use client";

import React from "react";
import { Share2 } from "lucide-react";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    copyStatus: string;
    onCopy: () => void;
}

export const InviteModal = ({
    isOpen,
    onClose,
    username,
    copyStatus,
    onCopy
}: InviteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--bg-base)]/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl sm:rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-primary/10 border-primary/20 text-primary">
                        <Share2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-primary">Invite a Friend</h2>
                        <p className="text-[12px] font-bold text-muted uppercase tracking-widest">Growth Protocol</p>
                    </div>
                </div>
                <p className="text-[14px] text-muted leading-relaxed mb-6">Invite your network to the Forge. Share your personal join link to help them start their execution journey.</p>
                <div className="space-y-4">
                    <div className="relative group">
                        <input 
                            readOnly 
                            value={`https://goalforge.app/join/${username}`}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[13px] font-mono text-primary outline-none shadow-inner"
                        />
                        <button 
                            onClick={onCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-[var(--bg-base)] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                            {copyStatus}
                        </button>
                    </div>
                    <button onClick={onClose} className="w-full py-3 rounded-xl border border-[var(--border)] text-[13px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};
