import { describe, expect, it } from "vitest";

import { schedule, sessions } from "./schedule";

describe("2026 workshop programme", () => {
  it("defines the three sessions", () => {
    expect(sessions.map((session) => session.id)).toEqual([
      "session-1",
      "session-2",
      "session-3",
    ]);
  });

  it("defines the full programme order", () => {
    expect(schedule.map(({ id }) => id)).toEqual([
      "welcome",
      "device-models",
      "nvidia-compilation",
      "morning-break",
      "bloqade-pipeline",
      "roundtable",
      "lunch",
      "fault-tolerant-compilation",
      "lane-architecture",
      "entropy-guided-search",
      "iterative-diving-search",
      "decoder-aware-risk",
      "residual-aware-spacing",
      "afternoon-break",
      "elham-invited-talk",
      "hanyu-invited-talk",
      "session-three-break",
      "interactive-qec",
      "shuttling-optimization",
      "closing",
    ]);
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
