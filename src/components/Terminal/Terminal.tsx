import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { useTerminalStore } from "../../stores/terminalStore";
import { useThemeStore } from "../../stores/themeStore";
import { useWindowManagerStore, type WindowComponentKey } from "../../stores/windowManagerStore";

const suggestions = ["help", "about", "skills", "projects", "contact", "open about", "open projects", "open skills", "open contact", "theme ctos", "theme matrix", "theme cyberpunk", "whoami", "scan github", "download resume", "sudo hire me"];

interface Props {
  compact?: boolean;
  onUnlockMatrixRain: () => void;
}

export function Terminal({ compact = false, onUnlockMatrixRain }: Props) {
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement | null>(null);
  const lines = useTerminalStore((state) => state.lines);
  const execute = useTerminalStore((state) => state.execute);
  const previousHistory = useTerminalStore((state) => state.previousHistory);
  const nextHistory = useTerminalStore((state) => state.nextHistory);
  const setTheme = useThemeStore((state) => state.setTheme);
  const openWindow = useWindowManagerStore((state) => state.openWindow);
  const closeWindow = useWindowManagerStore((state) => state.closeWindow);
  const windows = useWindowManagerStore((state) => state.windows);

  const context = useMemo(
    () => ({
      openWindow,
      setTheme,
      unlockMatrixRain: onUnlockMatrixRain,
      closeWindowByComponent: (key: WindowComponentKey) => {
        const found = windows.find((window) => window.component === key);
        if (found) closeWindow(found.id);
      },
    }),
    [closeWindow, onUnlockMatrixRain, openWindow, setTheme, windows],
  );

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    execute(input, context);
    setInput("");
  };

  const autocomplete = () => {
    const match = suggestions.find((suggestion) => suggestion.startsWith(input.toLowerCase()));
    if (match) setInput(match);
  };

  return (
    <section className={compact ? "terminal compact" : "terminal"} aria-label="Command terminal">
      <header className="terminal-header">
        <span>
          <TerminalIcon size={16} aria-hidden="true" /> operator@profile_os
        </span>
        <span>aria-live: online</span>
      </header>
      <div className="terminal-output" ref={outputRef} aria-live="polite">
        {lines.map((line) => (
          <div className={`terminal-line ${line.type}`} key={line.id}>
            {line.text || " "}
          </div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span>&gt;</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setInput(previousHistory());
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setInput(nextHistory());
            }
            if (event.key === "Tab") {
              event.preventDefault();
              autocomplete();
            }
          }}
          aria-label="Terminal command input"
          placeholder="type help"
        />
      </div>
    </section>
  );
}
