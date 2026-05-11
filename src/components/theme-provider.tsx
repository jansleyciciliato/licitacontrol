"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const salvo = localStorage.getItem("licitacontrol-theme") as Theme | null;
    const inicial = salvo ?? "dark";
    setTheme(inicial);
    document.documentElement.classList.toggle("dark", inicial === "dark");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const proximo: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("licitacontrol-theme", proximo);
      document.documentElement.classList.toggle("dark", proximo === "dark");
      return proximo;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
