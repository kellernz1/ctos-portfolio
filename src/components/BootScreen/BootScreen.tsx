import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  onComplete: () => void;
}

const bootLines = [
  ["SYSTEM", "INITIALIZING KERNEL", "OK"],
  ["SYSTEM", "MOUNTING /home/operator", "OK"],
  ["NET", "ESTABLISHING SECURE TUNNEL", "OK"],
  ["AUTH", "VERIFYING IDENTITY", "ACCESS GRANTED"],
  ["SYSTEM", "LOADING PROFILE_OS v1.0", "DONE"],
];

export function BootScreen({ onComplete }: Props) {
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? bootLines.length : 0);

  const shouldSkipBoot = useMemo(() => localStorage.getItem("hacker-os.skipBootOnReturn") === "true", []);

  useEffect(() => {
    if (shouldSkipBoot) {
      onComplete();
      return undefined;
    }

    const skip = () => {
      localStorage.setItem("hacker-os.skipBootOnReturn", "true");
      onComplete();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        skip();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onComplete, shouldSkipBoot]);

  useEffect(() => {
    if (shouldSkipBoot) return undefined;
    if (reducedMotion) {
      const timeout = window.setTimeout(() => {
        localStorage.setItem("hacker-os.skipBootOnReturn", "true");
        onComplete();
      }, 450);
      return () => window.clearTimeout(timeout);
    }

    const interval = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= bootLines.length) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            localStorage.setItem("hacker-os.skipBootOnReturn", "true");
            onComplete();
          }, 520);
          return count;
        }
        return count + 1;
      });
    }, 520);

    return () => window.clearInterval(interval);
  }, [onComplete, reducedMotion, shouldSkipBoot]);

  const skip = () => {
    localStorage.setItem("hacker-os.skipBootOnReturn", "true");
    onComplete();
  };

  return (
    <motion.section className="boot-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Sequencia de inicializacao">
      <div className="boot-panel">
        <p className="boot-kicker">PROFILE_OS SECURE BOOT</p>
        {bootLines.slice(0, visibleCount).map(([scope, message, status]) => (
          <p className="boot-line" key={message}>
            <span>[ {scope.padEnd(6)} ]</span>
            <span>{message.padEnd(34, ".")}</span>
            <strong>{status}</strong>
          </p>
        ))}
        <button type="button" className="boot-skip" onClick={skip}>
          Skip boot
        </button>
      </div>
    </motion.section>
  );
}
