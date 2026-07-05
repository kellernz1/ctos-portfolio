import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  intense?: boolean;
}

export function CodeRainCanvas({ intense = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || reducedMotion) {
      return undefined;
    }

    let animationId = 0;
    let visible = document.visibilityState === "visible";
    const fontSize = intense ? 15 : 18;
    const characters = "01@#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let drops: number[] = [];

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * pixelRatio);
      canvas.height = Math.floor(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drops = Array.from({ length: Math.ceil(window.innerWidth / fontSize) }, () => Math.random() * -30);
    };

    const draw = () => {
      if (!visible) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      context.fillStyle = intense ? "rgba(5, 7, 10, 0.11)" : "rgba(5, 7, 10, 0.18)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = `${fontSize}px JetBrains Mono, monospace`;
      context.fillStyle = intense ? "#00ffb2" : "rgba(0, 255, 178, 0.45)";

      drops.forEach((drop, index) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        context.fillText(text, index * fontSize, drop * fontSize);
        if (drop * fontSize > window.innerHeight && Math.random() > (intense ? 0.94 : 0.975)) {
          drops[index] = 0;
        } else {
          drops[index] = drop + 1;
        }
      });
      animationId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intense, reducedMotion]);

  if (reducedMotion) {
    return <div className="static-noise" aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className="code-rain" aria-hidden="true" />;
}
