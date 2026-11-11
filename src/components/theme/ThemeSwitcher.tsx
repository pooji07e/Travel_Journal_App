"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-typewriter uppercase tracking-wider rounded border border-vintage-border bg-paper-warm hover:bg-paper-aged transition-colors text-ink shadow-stamp focus:outline-none"
      title={`Switch to ${theme === "sepia" ? "Midnight" : "Sepia"} theme`}
      aria-label="Toggle vintage theme"
    >
      {theme === "sepia" ? (
        <>
          <Moon className="w-3.5 h-3.5 text-teal" />
          <span>Midnight</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-mustard" />
          <span>Sepia</span>
        </>
      )}
    </button>
  );
}
