"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>("dark");

 useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    queueMicrotask(() => {
      setTheme(savedTheme);
    });
  }
}, []);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      theme
    );

    document.documentElement.classList.remove(
  "light",
  "dark"
);

document.documentElement.classList.add(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) =>
      prev === "dark"
        ? "light"
        : "dark"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}