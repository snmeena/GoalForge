"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/hooks";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or nothing to match the server-side render
    return <div className={`p-1.5 w-[32px] h-[32px] ${className}`} />;
  }

  return (
    <button 
      onClick={toggleTheme} 
      className={`p-1.5 text-muted transition-colors rounded-md group cursor-pointer hover:bg-primary/5 ${className}`} 
      aria-label="Toggle Theme" 
      title="Toggle Light/Dark Mode"
    >
      {theme === "light" ?
        <Moon size={20} className="icon-shimmer-hover" /> :
        <Sun size={20} className="icon-spin-hover" />
      }
    </button>
  );
};

export default ThemeToggle;
