export interface Project {
  id: string;
  name: string;
  codename?: string;
  description: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  status: "planned" | "building" | "completed";
  featured?: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    id: "poke-berry-farmer",
    name: "poke-berry-farmer.exe",
    codename: "BERRY_PROTOCOL",
    description: "Pokemon-inspired farming project focused on cozy loops, resource progression, and playful browser interactions.",
    stack: ["React", "TypeScript", "Game UI", "State"],
    githubUrl: "https://github.com/kellernz1/poke-berry-farmer",
    status: "completed",
    featured: true,
    year: 2026,
  },
  {
    id: "mcmod-manager",
    name: "mcmod-manager.sys",
    codename: "MOD_LOADER",
    description: "Desktop-style manager for Minecraft mods, built around practical library organization and release packaging.",
    stack: ["Electron", "React", "TypeScript", "Vite"],
    githubUrl: "https://github.com/kellernz1/mcmod-manager",
    status: "building",
    featured: true,
    year: 2026,
  },
  {
    id: "pokedex",
    name: "pokedex.dll",
    codename: "DEX_ARCHIVE",
    description: "Pokedex interface for browsing creature data with fast lookup patterns and compact detail presentation.",
    stack: ["React", "TypeScript", "API", "Catalog"],
    githubUrl: "https://github.com/kellernz1/pokedex",
    status: "completed",
    featured: true,
    year: 2026,
  },
  {
    id: "cozy-harvest-gacha",
    name: "cozy-harvest-gacha.bin",
    codename: "HARVEST_DROP",
    description: "Cozy farming and gacha-themed experience with collection loops, reward pacing, and soft game UI direction.",
    stack: ["React", "TypeScript", "Game UI", "Animation"],
    githubUrl: "https://github.com/kellernz1/cozy-harvest-gacha",
    status: "completed",
    year: 2026,
  },
  {
    id: "dungeon-quest",
    name: "dungeon-quest.exe",
    codename: "DUNGEON_NODE",
    description: "Dungeon adventure project exploring quest flow, progression systems, and interactive fantasy UI.",
    stack: ["React", "TypeScript", "Game UI", "State"],
    githubUrl: "https://github.com/kellernz1/dungeon-quest",
    status: "building",
    year: 2026,
  },
  {
    id: "chatbridge",
    name: "chatbridge.sys",
    codename: "BRIDGE_SIGNAL",
    description: "Messaging bridge project focused on communication flow, integration logic, and reliable interface feedback.",
    stack: ["Node.js", "Integration", "Messaging", "Automation"],
    githubUrl: "https://github.com/kellernz1/chatbridge",
    status: "completed",
    year: 2026,
  },
  {
    id: "anime-season-catalog",
    name: "anime-season-catalog.db",
    codename: "SEASON_INDEX",
    description: "Anime season catalog for scanning releases, comparing entries, and presenting media data in a focused browser UI.",
    stack: ["React", "TypeScript", "Catalog", "API"],
    githubUrl: "https://github.com/kellernz1/anime-season-catalog",
    status: "completed",
    year: 2026,
  },
];
