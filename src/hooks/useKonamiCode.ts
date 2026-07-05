import { useEffect, useState } from "react";

const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function useKonamiCode(onUnlock: () => void) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let index = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = sequence[index];
      if (key === expected) {
        index += 1;
        if (index === sequence.length) {
          setUnlocked(true);
          onUnlock();
          index = 0;
        }
        return;
      }
      index = key === sequence[0] ? 1 : 0;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onUnlock]);

  return unlocked;
}
