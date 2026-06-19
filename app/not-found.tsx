"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      
      {/* Background Huge Animated Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <h1 className="text-[40vw] font-black tracking-tighter animate-pulse">404</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 text-center px-4">
        
        {/* Main Glowing 404 */}
        <div className="relative">
          {/* Animated Glow Effect */}
          <div className="absolute -inset-6 bg-[var(--text-primary)]/10 blur-3xl rounded-full z-[-1] animate-pulse"></div>
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter drop-shadow-sm">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Lost in the void</h2>
          <p className="text-muted text-[13px] font-medium max-w-[250px] mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Smart Routing Buttons */}
        <div className="flex items-center gap-3 pt-4">
          {/* History Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent text-[13px] font-bold hover:bg-[var(--text-primary)]/5 transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          {/* Safe Fallback Button */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-base)] text-[13px] font-bold shadow-md hover:opacity-90 transition-all"
          >
            <Home size={16} />
            Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}