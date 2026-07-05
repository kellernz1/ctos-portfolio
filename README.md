# Hacker OS Portfolio

Frontend-only portfolio that behaves like a breached operating system: boot sequence, command terminal, draggable windows, animated skill scanner, project explorer, contact module, code-rain canvas, and three CSS-variable themes.

## Commands

```bash
npm install
npm run dev
npm run test
npm run build
```

## Implemented MVP

- Boot sequence with click/Esc skip and `localStorage` persistence.
- Desktop with module shortcuts, topbar clock, theme indicator, and `sudo hire me` CTA.
- Terminal with `help`, `about`, `skills`, `projects --stack=x`, `open`, `close`, `theme`, `whoami`, `scan github`, `download resume`, `sudo hire me`, `history`, `man`, autocomplete, command history, `aria-live`, and semicolon command splitting.
- Zustand stores for terminal, theme, and window manager.
- Floating windows with focus, close, minimize, maximize, desktop drag, and mobile fullscreen behavior.
- Skill scanner animation respecting `prefers-reduced-motion`.
- Project explorer with multi-stack filters and accessible status labels.
- Decorative Konami unlock for intense matrix rain.

Replace `public/resume.pdf` with the final resume PDF and update `src/data/profile.ts` with the final LinkedIn/email details.
