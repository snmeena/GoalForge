"use client";

import React from "react";
import { Star } from "lucide-react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviewRating: number;
    setReviewRating: (rating: number) => void;
    reviewText: string;
    setReviewText: (text: string) => void;
    isSubmitting: boolean;
    reviewSuccess: boolean;
    onSubmit: () => void;
}

export const ReviewModal = ({
    isOpen,
    onClose,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
    isSubmitting,
    reviewSuccess,
    onSubmit
}: ReviewModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--bg-base)]/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl sm:rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-6 sm:p-8">
                {reviewSuccess ? (
                    <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={40} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-black text-primary mb-2">Review Submitted!</h2>
                        <p className="text-muted text-[14px]">Your feedback fuels the Forge core. Thank you.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-amber-500/10 border-amber-500/20 text-amber-500">
                                <Star size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-primary">Submit Review</h2>
                                <p className="text-[12px] font-bold text-muted uppercase tracking-widest">Platform Feedback</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setReviewRating(star)} className="transition-transform active:scale-90 hover:scale-110">
                                        <Star size={32} className={star <= reviewRating ? "text-amber-500 fill-amber-500" : "text-muted opacity-30"} />
                                    </button>
                                ))}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Your Experience</label>
                                <textarea
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell us how GoalForge has changed your execution protocol..."
                                    className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-3 px-4 text-[13px] text-primary focus:border-primary transition-all outline-none shadow-inner resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-[13px] font-bold text-muted hover:bg-[var(--bg-base)] transition-all">Cancel</button>
                                <button
                                    onClick={onSubmit}
                                    disabled={isSubmitting || !reviewText.trim()}
                                    className="flex-[1.5] py-3 rounded-xl bg-primary text-[var(--bg-base)] text-[13px] font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Send Review"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
