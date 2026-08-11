import { describe, expect, it } from "vitest";

import { schedule, sessions } from "./schedule";

describe("2026 workshop programme", () => {
  it("defines the three sessions and schedule boundaries", () => {
    expect(sessions.map((session) => session.id)).toEqual([
      "session-1",
      "session-2",
      "session-3",
    ]);
    expect(schedule[0]?.id).toBe("welcome");
    expect(schedule.at(-1)?.id).toBe("closing");
  });

  it("associates every speaking entry with one of twelve speakers", () => {
    const speakingEntries = schedule.filter(
      (entry) => entry.kind === "talk" || entry.kind === "remarks",
    );

    expect(speakingEntries).toHaveLength(15);
    expect(speakingEntries.every((entry) => entry.speakerId !== undefined)).toBe(true);
    expect(new Set(speakingEntries.map((entry) => entry.speakerId)).size).toBe(12);
  });

  it("does not associate breaks or roundtables with a speaker", () => {
    const nonSpeakingEntries = schedule.filter(
      (entry) => entry.kind === "break" || entry.kind === "roundtable",
    );

    expect(nonSpeakingEntries.every((entry) => entry.speakerId === undefined)).toBe(true);
  });
});
