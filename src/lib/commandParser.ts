export interface ParsedCommand {
  raw: string;
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseCommand(raw: string): ParsedCommand {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const commandParts: string[] = [];
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (const part of parts) {
    if (part.startsWith("--")) {
      const [name, value] = part.slice(2).split("=");
      flags[name] = value ?? true;
      continue;
    }
    if (commandParts.length === 0 || (commandParts[0] === "sudo" && commandParts.length < 3) || (commandParts[0] === "download" && commandParts.length < 2) || (commandParts[0] === "scan" && commandParts.length < 2)) {
      commandParts.push(part.toLowerCase());
    } else {
      args.push(part);
    }
  }

  return {
    raw,
    command: commandParts.join(" "),
    args,
    flags,
  };
}

export function splitCommandInput(input: string) {
  return input
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}
