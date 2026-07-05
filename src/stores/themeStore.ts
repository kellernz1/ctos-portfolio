import { create } from "zustand";

export type ThemeName = "ctos" | "matrix" | "cyberpunk";

interface ThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const storageKey = "hacker-os.theme";

function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(storageKey);
  return stored === "matrix" || stored === "cyberpunk" || stored === "ctos" ? stored : "ctos";
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(storageKey, theme);
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
}));
