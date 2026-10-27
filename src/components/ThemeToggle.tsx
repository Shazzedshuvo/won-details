"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-lg transition-all duration-200 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
      title={theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode"}
    >
      <div className="w-4 h-4 flex items-center justify-center">
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-600" />
        )}
      </div>
    </button>
  );
};
