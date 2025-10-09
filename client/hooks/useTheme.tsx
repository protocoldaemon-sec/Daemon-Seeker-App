import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "system" | "light" | "dark";

type Ctx = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);

function getSystem(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  console.log('Applied theme to HTML:', resolved, 'Classes:', root.className);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;
    return stored || "system";
  });
  
  const [resolved, setResolved] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;
    if (!stored || stored === "system") {
      return getSystem();
    }
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const update = () => setResolved(getSystem());
      mq.addEventListener?.("change", update);
      update();
      return () => mq.removeEventListener?.("change", update);
    } else {
      setResolved(theme === "dark" ? "dark" : "light");
    }
  }, [theme]);

  useEffect(() => {
    console.log('Applying theme:', resolved);
    applyTheme(resolved);
  }, [resolved]);

  // Force apply theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;
    if (stored) {
      const resolvedTheme = stored === "system" ? getSystem() : (stored === "dark" ? "dark" : "light");
      console.log('Force applying theme on mount:', resolvedTheme);
      applyTheme(resolvedTheme);
    }
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    console.log('Setting theme to:', mode);
    setThemeState(mode);
    localStorage.setItem("theme", mode);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ theme, resolvedTheme: resolved, setTheme }),
    [theme, resolved, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
