"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  ArrowLeft, Mail, Lock, User, 
  CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles,
  Hash 
} from "lucide-react";
import { useScrollReveal } from "@/lib/hooks";
import Logo from "@/components/Logo";

// ==========================================================================
// PASSWORD STRENGTH ENGINE
// ==========================================================================
function calculateStrength(password: string) {
  let score = 0;
  if (!password) return 0;
  if (password.length > 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  return Math.min(score, 100);
}

// ==========================================================================
// AUTH CONTENT COMPONENT
// ==========================================================================
function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = searchParams.get("mode") === "signup" ? false : true;
  
  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  // Form States
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Supabase Client
  const supabase = createClient();

  // Initialize Scroll Reveal
  useScrollReveal();

  // OAuth Login Handler
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
    }
  };

  // Instant Validation States
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  
  const emailValid = emailRegex.test(email);
  const usernameValid = usernameRegex.test(username);
  const loginIdentifierValid = isLogin ? (emailRegex.test(email) || usernameRegex.test(email)) : emailValid;
  
  const passStrength = calculateStrength(password);
  const passValid = passStrength >= 80;
  const nameValid = name.trim().length >= 2;

  // Determine if form is ready to submit
  const isFormValid = isLogin 
    ? (loginIdentifierValid && password.length > 0) 
    : (emailValid && usernameValid && passValid && nameValid);

  // Handle Submit (Login or Send Confirmation Link)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    setAuthError(null);
    setSignupSuccess(false);

    try {
      if (isLogin) {
        let loginEmail = email;

        // If it's a username (not an email format), try to resolve it to an email
        if (!emailRegex.test(email)) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', email)
            .single();
          
          if (profileError || !data) {
            throw new Error("Invalid username or email.");
          }
          loginEmail = data.email;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Incorrect email/username or password. Please try again.");
          }
          throw error;
        }
        
        router.push("/dashboard");
      } else {
        // Setup Account with Email Confirmation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
              username: username,
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          setSignupSuccess(true);
        } else {
          throw new Error("Failed to initialize account setup. Please try again.");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAuthError(message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check Username Availability
  const checkUsername = async () => {
    if (!usernameValid) return;
    setIsLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) throw error;
      if (data) {
        setAuthError("This username is already taken. Please choose another one.");
      } else {
        alert("Username is available!");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gf-layout-wrapper min-h-[100dvh] flex items-center justify-center relative p-4 selection:bg-primary selection:text-[var(--bg-base)] overflow-hidden font-sans">
      
      {/* ── BACKGROUND ── */}
      <div className="bg-dots-container absolute inset-0 -z-10">
        <div className="bg-dots" />
      </div>

      {/* ── TOP NAV (Back to Home) ── */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-all group px-4 py-2 rounded-full hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border)] backdrop-blur-md"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* ── GLASS AUTH CARD ── */}
      <div className="glass-card w-full max-w-[420px] p-6 sm:p-8 relative z-10 rounded-3xl bg-[var(--bg-surface)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)] hover:bg-[var(--bg-surface)]/90">
        
        {/* BRAND LOGO (Concentric Rings) */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-base)] text-primary flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Logo size={28} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary mb-1.5">
            {isLogin ? "Welcome back." : "Start Forging."}
          </h1>
          <p className="text-[13px] font-medium text-muted">
            {isLogin ? "Enter your details to access your dashboard." : "Create an account to track your goals seamlessly."}
          </p>
        </div>

        {/* ── FLOATING TOGGLE SWITCH ── */}
        <div className="relative flex p-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-[14px] mb-6 shadow-inner backdrop-blur-md">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-sm"
            style={{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setShowPassword(false); setAuthError(null); setSignupSuccess(false); }}
            className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isLogin ? 'text-primary' : 'text-muted hover:text-primary'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setShowPassword(false); setAuthError(null); setSignupSuccess(false); }}
            className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${!isLogin ? 'text-primary' : 'text-muted hover:text-primary'}`}
          >
            Sign Up
          </button>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Dynamic Registration Field: Name */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogin ? 'max-h-0 opacity-0 m-0' : 'max-h-[80px] opacity-100 mb-4'}`}>
            <label htmlFor="full-name" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
            <div className="relative group">
              <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${nameValid ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
              <input 
                type="text" 
                id="full-name"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-10 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-colors duration-300 outline-none shadow-inner"
              />
              {nameValid && <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
            </div>
          </div>

          {/* Dynamic Registration Field: Username */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogin ? 'max-h-0 opacity-0 m-0' : 'max-h-[80px] opacity-100 mb-4'}`}>
            <label htmlFor="auth-username" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">Username</label>
            <div className="relative group">
              <Hash size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${usernameValid ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
              <input 
                type="text" 
                id="auth-username"
                name="username"
                placeholder="unique_username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-24 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-colors duration-300 outline-none shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {usernameValid && <CheckCircle2 size={16} className="text-green-500" />}
                <button 
                  type="button"
                  onClick={checkUsername}
                  className="px-2 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border)] text-[9px] font-bold uppercase tracking-tighter text-muted hover:text-primary hover:border-primary transition-all"
                >
                  Check
                </button>
              </div>
            </div>
            {username.length > 0 && !usernameValid && (
              <p className="text-[9px] text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">3-20 chars, alphanumeric & underscores only.</p>
            )}
          </div>

          {/* Email / Identifier Field */}
          <div>
            <label htmlFor="auth-identifier" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block ml-1">
              {isLogin ? "Email or Username" : "Email Address"}
            </label>
            <div className="relative group">
              {isLogin ? (
                <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${loginIdentifierValid ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
              ) : (
                <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${emailValid ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
              )}
              <input 
                type={isLogin ? "text" : "email"} 
                id="auth-identifier"
                name={isLogin ? "login" : "email"}
                placeholder={isLogin ? "Enter email or username" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-10 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-colors duration-300 outline-none shadow-inner"
              />
              {(isLogin ? loginIdentifierValid : emailValid) && <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="auth-password" className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 ml-1 flex justify-between items-center">
              <span>Password</span>
              {isLogin && (
                <Link href="/forgotpass" className="text-primary hover:underline capitalize tracking-normal transition-colors">
                  Forgot?
                </Link>
              )}
            </label>
            <div className="relative group">
              <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${(!isLogin && passValid) ? 'text-green-500' : 'text-muted group-focus-within:text-primary'}`} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="auth-password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-10 text-[13px] text-primary focus:bg-[var(--bg-surface)] focus:border-[var(--text-primary)] focus:shadow-[0_0_0_1px_var(--text-primary)] transition-colors duration-300 outline-none shadow-inner"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Smooth Password Strength Indicator */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-[40px] opacity-100 mt-2.5'}`}>
              <div className="flex gap-1 h-1.5 w-full">
                {[25, 50, 75, 100].map((threshold, idx) => (
                  <div key={idx} className="h-full flex-1 rounded-full bg-[var(--border)] overflow-hidden">
                    <div 
                      className={`h-full w-full transition-all duration-500 ${
                        passStrength >= threshold 
                          ? passStrength < 50 ? 'bg-red-500' 
                          : passStrength < 80 ? 'bg-yellow-500' 
                          : 'bg-green-500'
                          : 'bg-transparent'
                      }`} 
                    />
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted mt-1.5 font-medium flex justify-between px-1">
                <span>{passStrength === 0 ? "Enter password" : passStrength < 50 ? "Weak" : passStrength < 80 ? "Good" : "Excellent"}</span>
                {!passValid && passStrength > 0 && <span className="text-yellow-500 flex items-center gap-1"><AlertCircle size={10}/> Needs numbers & symbols</span>}
              </div>
            </div>
          </div>

          {/* ── NOTIFICATION AREA (Errors & Success) ── */}
          <div className="min-h-[20px] flex flex-col gap-2">
            {authError && (
              <div className="flex items-start gap-2 text-[11px] font-bold text-red-500 bg-red-500/5 border border-red-500/20 p-2.5 rounded-xl animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {signupSuccess && (
              <div className="flex items-start gap-2 text-[11px] font-bold text-green-500 bg-green-500/5 border border-green-500/20 p-2.5 rounded-xl animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <span>Email sent successfully! You can now access your dashboard using the link provided in your email.</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!isFormValid || isLoading}
            className={`gf-btn w-full py-3 rounded-xl relative overflow-hidden font-bold tracking-wide transition-all duration-300 group ${
              isFormValid 
                ? 'gf-btn-primary bg-primary text-[var(--bg-base)] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5' 
                : 'bg-[var(--bg-base)] text-muted cursor-not-allowed border border-[var(--border)]'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-2 text-[13px]">
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-[var(--bg-base)] border-t-transparent animate-spin" />
              ) : (
                <>
                  {isLogin ? "Access Dashboard" : "Setup Account"}
                  {!isLogin && <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                </>
              )}
            </div>
          </button>
        </form>

        {/* ── SOCIAL LOGINS ── */}
        <div className="mt-6 pt-5 relative border-t border-[var(--border)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-muted uppercase tracking-widest text-center px-3 bg-[var(--bg-surface)]">
            Or continue with
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button 
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-primary text-[13px] font-semibold transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-md group"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="group-hover:scale-110 transition-transform">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border)] text-primary text-[13px] font-semibold transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-md group"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[11px] text-faint font-medium">
          By continuing, you agree to GoalForge&apos;s <br className="sm:hidden"/>
          <Link href="/terms" className="text-muted hover:text-primary transition-colors underline decoration-[var(--border)] underline-offset-2 mx-1">Terms of Service</Link> 
          and 
          <Link href="/privacy" className="text-muted hover:text-primary transition-colors underline decoration-[var(--border)] underline-offset-2 mx-1">Privacy Policy</Link>.
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// MAIN AUTH PAGE WRAPPER
// ==========================================================================
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-base flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
