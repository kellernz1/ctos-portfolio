import { motion } from "framer-motion";
import { Maximize2, Minus, X } from "lucide-react";
import type { ReactNode } from "react";
import type { WindowState } from "../../stores/windowManagerStore";
import { useWindowManagerStore } from "../../stores/windowManagerStore";

interface Props {
  windowState: WindowState;
  children: ReactNode;
}

export function Window({ windowState, children }: Props) {
  const focusWindow = useWindowManagerStore((state) => state.focusWindow);
  const closeWindow = useWindowManagerStore((state) => state.closeWindow);
  const minimizeWindow = useWindowManagerStore((state) => state.minimizeWindow);
  const toggleMaximize = useWindowManagerStore((state) => state.toggleMaximize);
  const updatePosition = useWindowManagerStore((state) => state.updatePosition);
  const focusedId = useWindowManagerStore((state) => state.focusedId);
  const focused = focusedId === windowState.id;

  if (windowState.isMinimized) return null;

  return (
    <motion.section
      className={`os-window ${focused ? "focused" : ""} ${windowState.isMaximized ? "maximized" : ""}`}
      style={{
        left: windowState.isMaximized ? 12 : windowState.position.x,
        top: windowState.isMaximized ? 58 : windowState.position.y,
        width: windowState.isMaximized ? "calc(100vw - 24px)" : windowState.size.width,
        height: windowState.isMaximized ? "calc(100vh - 86px)" : windowState.size.height,
        zIndex: windowState.zIndex,
      }}
      drag={!windowState.isMaximized}
      dragMomentum={false}
      dragListener={false}
      onPointerDown={() => focusWindow(windowState.id)}
      onDragEnd={(_event, info) => updatePosition(windowState.id, { x: windowState.position.x + info.offset.x, y: windowState.position.y + info.offset.y })}
      aria-label={windowState.title}
    >
      <motion.header className="window-header" drag={!windowState.isMaximized} dragMomentum={false} dragConstraints={{ left: -20, right: window.innerWidth, top: 48, bottom: window.innerHeight }} onDragStart={() => focusWindow(windowState.id)}>
        <span>{windowState.title}</span>
        <div className="window-actions">
          <button type="button" onClick={() => minimizeWindow(windowState.id)} aria-label="Minimize window">
            <Minus size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => toggleMaximize(windowState.id)} aria-label="Maximize window">
            <Maximize2 size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => closeWindow(windowState.id)} aria-label="Close window">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      </motion.header>
      <div className="window-body">{children}</div>
    </motion.section>
  );
}
