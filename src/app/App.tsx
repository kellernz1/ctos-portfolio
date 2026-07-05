import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Contact, FileDown, Github, Layers3, Shield, TerminalSquare, UserRound } from "lucide-react";
import { BootScreen } from "../components/BootScreen/BootScreen";
import { CodeRainCanvas } from "../components/CodeRainCanvas/CodeRainCanvas";
import { DesktopIcon } from "../components/DesktopIcon/DesktopIcon";
import { Terminal } from "../components/Terminal/Terminal";
import { WindowManager } from "../components/Window/WindowManager";
import { profile } from "../data/profile";
import { useKonamiCode } from "../hooks/useKonamiCode";
import { useThemeStore } from "../stores/themeStore";
import { useWindowManagerStore } from "../stores/windowManagerStore";

function Clock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  return <time dateTime={time.toISOString()}>{time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</time>;
}

export function App() {
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [matrixIntense, setMatrixIntense] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const openWindow = useWindowManagerStore((state) => state.openWindow);
  const closeAll = useWindowManagerStore((state) => state.closeAll);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const triggerMatrix = useCallback(() => {
    setMatrixIntense(true);
    window.setTimeout(() => setMatrixIntense(false), 1400);
  }, []);

  useKonamiCode(triggerMatrix);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (event.key === "`") {
        event.preventDefault();
        setTerminalOpen((open) => !open);
      }
      if (event.key === "Escape" && !editing) {
        closeAll();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  const cycleTheme = () => {
    setTheme(theme === "ctos" ? "matrix" : theme === "matrix" ? "cyberpunk" : "ctos");
  };

  return (
    <div className="app-shell">
      <CodeRainCanvas intense={matrixIntense || theme === "matrix"} />
      <AnimatePresence>{!booted ? <BootScreen onComplete={() => setBooted(true)} /> : null}</AnimatePresence>
      {booted ? (
        <motion.main className="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="topbar">
            <div className="system-id">
              <Shield size={18} aria-hidden="true" />
              <span>PROFILE_OS</span>
            </div>
            <nav aria-label="System controls">
              <button type="button" onClick={cycleTheme}>theme:{theme}</button>
              <a href={`${profile.links.email}?subject=Mission%20brief`}>sudo hire me</a>
              <Clock />
            </nav>
          </header>

          <section className="desktop-grid" aria-label="Desktop modules">
            <DesktopIcon label="about" icon={UserRound} onOpen={() => openWindow("about")} />
            <DesktopIcon label="projects" icon={BriefcaseBusiness} onOpen={() => openWindow("projects")} />
            <DesktopIcon label="skills" icon={Layers3} onOpen={() => openWindow("skills")} />
            <DesktopIcon label="contact" icon={Contact} onOpen={() => openWindow("contact")} />
            <a className="desktop-icon" href={profile.links.github} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={26} />
              <span>github</span>
            </a>
            <a className="desktop-icon" href={profile.links.resumeUrl} target="_blank" rel="noreferrer">
              <FileDown aria-hidden="true" size={26} />
              <span>resume</span>
            </a>
          </section>

          <WindowManager />

          <button type="button" className="terminal-toggle" onClick={() => setTerminalOpen((open) => !open)} aria-label="Toggle terminal">
            <TerminalSquare size={20} aria-hidden="true" />
          </button>

          <AnimatePresence>
            {terminalOpen ? (
              <motion.div className="terminal-dock" initial={{ y: 280, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 280, opacity: 0 }}>
                <Terminal compact onUnlockMatrixRain={triggerMatrix} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.main>
      ) : null}
    </div>
  );
}
