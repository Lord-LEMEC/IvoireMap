"use client";

import { useEffect, useState } from "react";
import { useIvoireStore } from "@/store/useIvoireStore";

/**
 * Applique data-theme="dark" sur <html> selon le store (persiste, cf. initTheme() dans l'ancien ui.js).
 * Le rendu est differe d'un tick pour laisser zustand/persist hydrater depuis localStorage
 * sans provoquer de mismatch SSR/CSR.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIvoireStore((s) => s.darkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode, mounted]);

  return <>{children}</>;
}
