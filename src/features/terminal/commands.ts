import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { skills } from "../../data/skills";
import type { ThemeName } from "../../stores/themeStore";
import type { WindowComponentKey } from "../../stores/windowManagerStore";
import type { ParsedCommand } from "../../lib/commandParser";

export interface CommandContext {
  openWindow: (key: WindowComponentKey) => void;
  closeWindowByComponent: (key: WindowComponentKey) => void;
  setTheme: (theme: ThemeName) => void;
  unlockMatrixRain: () => void;
}

export interface CommandResult {
  lines: string[];
  clear?: boolean;
}

type Handler = (parsed: ParsedCommand, context: CommandContext) => CommandResult;

const moduleNames = ["about", "projects", "skills", "contact"] as const;
const themeNames = ["ctos", "matrix", "cyberpunk"] as const;

function isModule(value: string): value is WindowComponentKey {
  return moduleNames.includes(value as WindowComponentKey);
}

function isTheme(value: string): value is ThemeName {
  return themeNames.includes(value as ThemeName);
}

function bar(value: number) {
  const filled = Math.round(value / 10);
  return `${"█".repeat(filled)}${"░".repeat(10 - filled)}`;
}

function projectLines(stackFilter?: string) {
  const filtered = stackFilter
    ? projects.filter((project) => project.stack.some((stack) => stack.toLowerCase() === stackFilter.toLowerCase()))
    : projects;

  if (filtered.length === 0) {
    return [`No project files match stack=${stackFilter}.`];
  }

  return filtered.map((project, index) => {
    const status = project.status.toUpperCase();
    const stack = project.stack.join(", ");
    return `[${String(index + 1).padStart(2, "0")}] ${project.name.padEnd(18)} [${status}] ${project.codename ?? "NO_CODENAME"} :: ${stack}`;
  });
}

const helpLines = [
  "SYSTEM COMMANDS",
  "  help                 list available commands",
  "  clear                clear terminal output",
  "  history              show command history",
  "  man <command>        show command details",
  "",
  "MODULES",
  "  about                open profile module",
  "  skills               run skill scanner",
  "  projects [--stack=x] list project files",
  "  contact              show secure contact links",
  "  open <window>        open about/projects/skills/contact",
  "  close <window>       close a module window",
  "",
  "OPERATIONS",
  "  theme <name>         switch ctos/matrix/cyberpunk",
  "  whoami               inspect decorative visitor profile",
  "  scan github          query public profile link",
  "  download resume      open static resume PDF",
  "  sudo hire me         contact CTA",
];

const manPages: Record<string, string[]> = {
  help: ["help", "Prints grouped command list. No flags."],
  open: ["open <window>", "Opens one desktop module: about, projects, skills, contact."],
  close: ["close <window>", "Closes the first open module with that component name."],
  projects: ["projects [--stack=x]", "Lists project files. Example: projects --stack=React"],
  theme: ["theme <ctos|matrix|cyberpunk>", "Switches CSS variable theme and persists it in localStorage."],
  whoami: ["whoami", "Shows a mocked decorative visitor profile. No real IP collection is performed."],
  skills: ["skills", "Runs the skill scanner and opens the skills window."],
  contact: ["contact", "Shows contact links and opens the secure contact window."],
};

export const commandHandlers: Record<string, Handler> = {
  help: () => ({ lines: helpLines }),
  clear: () => ({ lines: [], clear: true }),
  history: () => ({ lines: ["History is shown from the terminal store with ↑ / ↓ navigation."] }),
  about: (_parsed, context) => {
    context.openWindow("about");
    return {
      lines: [
        `HANDLE: ${profile.handle}`,
        `NAME: ${profile.realName}`,
        `ROLE: ${profile.role}`,
        `LOCATION: ${profile.location}`,
        `STATUS: ${profile.status.toUpperCase()} / CLEARANCE ${profile.clearanceLevel}`,
        profile.bio,
      ],
    };
  },
  skills: (_parsed, context) => {
    context.openWindow("skills");
    return {
      lines: ["SCANNING SKILLS...", "[========================================] 100%", ...skills.map((skill) => `${skill.name.padEnd(24)} ${bar(skill.proficiency)} ${skill.proficiency}% (${skill.yearsOfExperience ?? 1}y)`)],
    };
  },
  projects: (parsed, context) => {
    context.openWindow("projects");
    const stack = typeof parsed.flags.stack === "string" ? parsed.flags.stack : undefined;
    return { lines: projectLines(stack) };
  },
  contact: (_parsed, context) => {
    context.openWindow("contact");
    return {
      lines: [
        `EMAIL: ${profile.links.email.replace("mailto:", "")}`,
        `GITHUB: ${profile.links.github}`,
        `LINKEDIN: ${profile.links.linkedin}`,
        "Use sudo hire me to trigger the secure channel.",
      ],
    };
  },
  open: (parsed, context) => {
    const target = parsed.args[0]?.toLowerCase();
    if (!target || !isModule(target)) {
      return { lines: ["Usage: open about|projects|skills|contact"] };
    }
    context.openWindow(target);
    return { lines: [`WINDOW_OPENED: ${target}`] };
  },
  close: (parsed, context) => {
    const target = parsed.args[0]?.toLowerCase();
    if (!target || !isModule(target)) {
      return { lines: ["Usage: close about|projects|skills|contact"] };
    }
    context.closeWindowByComponent(target);
    return { lines: [`WINDOW_CLOSED: ${target}`] };
  },
  theme: (parsed, context) => {
    const target = parsed.args[0]?.toLowerCase();
    if (!target || !isTheme(target)) {
      return { lines: ["Usage: theme ctos|matrix|cyberpunk"] };
    }
    context.setTheme(target);
    return { lines: [`THEME_SWITCHED: ${target}`] };
  },
  whoami: () => ({
    lines: [
      "VISITOR_PROFILE: DECORATIVE_ONLY",
      `TIMEZONE: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      `AGENT: ${navigator.userAgent.split(" ").slice(0, 3).join(" ")}`,
      "IP: 127.0.0.1 (mocked, no visitor tracking)",
    ],
  }),
  "scan github": () => ({
    lines: [
      "SCAN_TARGET: github.com/kellernz1",
      "MODE: public-link fallback",
      "RESULT: profile URL ready. API scan can be enabled with cached client-side fetch.",
      profile.links.github,
    ],
  }),
  "download resume": () => {
    window.open(profile.links.resumeUrl, "_blank", "noopener,noreferrer");
    return { lines: [`DOWNLOAD_REQUESTED: ${profile.links.resumeUrl}`] };
  },
  "sudo hire me": () => {
    window.location.href = `${profile.links.email}?subject=Mission%20brief%3A%20hire%20Keller&body=ACCESS%20GRANTED.%20Let%27s%20talk%20about%20the%20role.`;
    return { lines: ["ROOT ACCESS GRANTED.", "Opening secure contact channel..."] };
  },
  man: (parsed) => {
    const target = parsed.args[0]?.toLowerCase();
    return { lines: target && manPages[target] ? manPages[target] : ["No manual page found. Try: man projects"] };
  },
  "matrix rain": (_parsed, context) => {
    context.unlockMatrixRain();
    return { lines: ["HIDDEN_COMMAND_ACCEPTED: matrix rain intense mode armed."] };
  },
};

export function runCommand(parsed: ParsedCommand, context: CommandContext): CommandResult {
  const handler = commandHandlers[parsed.command];
  if (!handler) {
    return { lines: [`command not found: ${parsed.raw}. Try 'help'.`] };
  }
  return handler(parsed, context);
}
