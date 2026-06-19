"use client";

import { useSmartEnterNavigation } from "@/lib/hooks/useSmartEnter";

/**
 * Global provider to enable smart Enter-key navigation across the entire application.
 * Included in the root layout to ensure consistent behavior.
 */
export function SmartEnterProvider({ children }: { children: React.ReactNode }) {
  useSmartEnterNavigation();
  return <>{children}</>;
}
