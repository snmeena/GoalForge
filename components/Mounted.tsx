"use client";

import { useState, useLayoutEffect } from "react";

/**
 * Ensures content is only rendered on the client to avoid hydration mismatches.
 */
export const Mounted = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
};
