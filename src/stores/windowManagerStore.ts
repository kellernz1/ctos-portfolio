import { create } from "zustand";

export type WindowComponentKey = "about" | "projects" | "skills" | "contact";

export interface WindowState {
  id: string;
  title: string;
  component: WindowComponentKey;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowManagerStore {
  windows: WindowState[];
  focusedId: string | null;
  openWindow: (key: WindowComponentKey) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updatePosition: (id: string, pos: { x: number; y: number }) => void;
  closeAll: () => void;
}

const titles: Record<WindowComponentKey, string> = {
  about: "profile.about",
  projects: "project.explorer",
  skills: "skill.scanner",
  contact: "secure.contact",
};

const sizes: Record<WindowComponentKey, { width: number; height: number }> = {
  about: { width: 560, height: 420 },
  projects: { width: 780, height: 560 },
  skills: { width: 680, height: 500 },
  contact: { width: 560, height: 460 },
};

let zIndexSeed = 20;

export const useWindowManagerStore = create<WindowManagerStore>((set, get) => ({
  windows: [],
  focusedId: null,
  openWindow: (key) => {
    const existing = get().windows.find((window) => window.component === key);
    if (existing) {
      get().focusWindow(existing.id);
      set((state) => ({
        windows: state.windows.map((window) => (window.id === existing.id ? { ...window, isMinimized: false } : window)),
      }));
      return;
    }

    zIndexSeed += 1;
    const offset = get().windows.length * 28;
    const id = `${key}-${Date.now()}`;
    set((state) => ({
      focusedId: id,
      windows: [
        ...state.windows,
        {
          id,
          title: titles[key],
          component: key,
          position: { x: 72 + offset, y: 92 + offset },
          size: sizes[key],
          zIndex: zIndexSeed,
          isMinimized: false,
          isMaximized: false,
        },
      ],
    }));
  },
  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
      focusedId: state.focusedId === id ? null : state.focusedId,
    })),
  focusWindow: (id) => {
    zIndexSeed += 1;
    set((state) => ({
      focusedId: id,
      windows: state.windows.map((window) => (window.id === id ? { ...window, zIndex: zIndexSeed } : window)),
    }));
  },
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, isMinimized: true } : window)),
      focusedId: state.focusedId === id ? null : state.focusedId,
    })),
  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, isMaximized: !window.isMaximized, isMinimized: false } : window)),
    })),
  updatePosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === id ? { ...window, position } : window)),
    })),
  closeAll: () => set({ windows: [], focusedId: null }),
}));
