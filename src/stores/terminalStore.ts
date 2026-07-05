import { create } from "zustand";
import { parseCommand, splitCommandInput } from "../lib/commandParser";
import { runCommand, type CommandContext } from "../features/terminal/commands";

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "system";
  text: string;
}

interface TerminalStore {
  lines: TerminalLine[];
  history: string[];
  historyIndex: number | null;
  execute: (input: string, context: CommandContext) => void;
  clear: () => void;
  previousHistory: () => string;
  nextHistory: () => string;
}

function line(type: TerminalLine["type"], text: string): TerminalLine {
  return { id: `${Date.now()}-${Math.random()}`, type, text };
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  lines: [
    line("system", "PROFILE_OS v1.0 online. Type 'help' to inspect available modules."),
  ],
  history: [],
  historyIndex: null,
  execute: (input, context) => {
    const commands = splitCommandInput(input);
    if (commands.length === 0) {
      return;
    }

    set((state) => ({
      history: [...state.history, ...commands],
      historyIndex: null,
      lines: [...state.lines, ...commands.map((command) => line("input", `> ${command}`))],
    }));

    for (const command of commands) {
      const result = runCommand(parseCommand(command), context);
      if (result.clear) {
        set({ lines: [] });
        continue;
      }
      set((state) => ({
        lines: [...state.lines, ...result.lines.map((text) => line("output", text))],
      }));
    }
  },
  clear: () => set({ lines: [] }),
  previousHistory: () => {
    const { history, historyIndex } = get();
    if (history.length === 0) return "";
    const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
    set({ historyIndex: nextIndex });
    return history[nextIndex];
  },
  nextHistory: () => {
    const { history, historyIndex } = get();
    if (history.length === 0 || historyIndex === null) return "";
    const nextIndex = historyIndex + 1;
    if (nextIndex >= history.length) {
      set({ historyIndex: null });
      return "";
    }
    set({ historyIndex: nextIndex });
    return history[nextIndex];
  },
}));
