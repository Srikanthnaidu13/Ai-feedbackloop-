"use client";

import { useTheme } from "@/components/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-5
        py-2.5
        text-sm
        font-medium
        text-gray-200
        backdrop-blur-xl
        transition-all
        hover:border-blue-500/30
        hover:bg-white/10
      "
    >
      {theme === "dark"
        ? "Switch to Light Mode"
        : "Switch to Dark Mode"}
    </button>
  );
}