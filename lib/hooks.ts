// lib/hooks.ts
import { useEffect, useRef } from "react";

// ==========================================================================
// SCROLL REVEAL HOOK (MOBILE OPTIMIZED)
// ==========================================================================
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Performance boost: stop observing once it's visible
          obs.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0, // Trigger the moment it enters the viewport
      rootMargin: "50px" // Start revealing slightly before it scrolls into view
    });

    // Small delay ensures Next.js has fully painted the DOM before tracking
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

// ==========================================================================
// THEME HOOK
// ==========================================================================
import { useThemeProvider } from "@/components/ThemeProvider";

export function useTheme() {
  return useThemeProvider();
}

// ==========================================================================
// MAGNETIC BUTTON HOOK
// ==========================================================================
export function useMagnetic<T extends HTMLElement>(strength = 0.2) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${dx}px,${dy}px,0)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.45s cubic-bezier(0.23,1,0.32,1)";
      el.style.transform = "translate3d(0,0,0)";
    };
    const onEnter = () => { el.style.transition = "transform 0.1s ease-out"; };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseenter", onEnter);
    };
  }, [strength]);
  return ref;
}
