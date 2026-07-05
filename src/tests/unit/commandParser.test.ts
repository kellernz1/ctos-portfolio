import { describe, expect, it } from "vitest";
import { parseCommand, splitCommandInput } from "../../lib/commandParser";

describe("commandParser", () => {
  it("parses flags and arguments", () => {
    expect(parseCommand("projects --stack=React")).toEqual({
      raw: "projects --stack=React",
      command: "projects",
      args: [],
      flags: { stack: "React" },
    });
  });

  it("supports multi-word commands", () => {
    expect(parseCommand("sudo hire me").command).toBe("sudo hire me");
    expect(parseCommand("download resume").command).toBe("download resume");
    expect(parseCommand("scan github").command).toBe("scan github");
  });

  it("splits semicolon command input", () => {
    expect(splitCommandInput("help; open projects ; theme matrix")).toEqual(["help", "open projects", "theme matrix"]);
  });
});
