import { describe, expect, it } from "vitest";

import { chairProfiles } from "./chairProfiles";
import { schedule, speakerIds } from "./schedule";

describe("chairProfiles", () => {
  it("covers every declared and scheduled speaker exactly", () => {
    const profileIds = Object.keys(chairProfiles).sort();
    const declaredIds = [...speakerIds].sort();
    const scheduledIds = [
      ...new Set(schedule.flatMap((entry) => ("speakerId" in entry ? [entry.speakerId] : []))),
    ].sort();

    expect(profileIds).toEqual(declaredIds);
    expect(scheduledIds).toEqual(declaredIds);
  });

  it("contains seven complete, substantive profiles", () => {
    const completeProfiles = Object.values(chairProfiles).filter(
      (profile) => profile.status === "complete",
    );

    expect(completeProfiles).toHaveLength(7);
    for (const profile of completeProfiles) {
      expect(profile.bio.length).toBeGreaterThan(120);
      expect(profile.introduction.length).toBeGreaterThan(80);
      expect(["email", "submission"]).toContain(profile.source);
    }
  });

  it("contains five pending profiles without unsupported copy", () => {
    const pendingProfiles = Object.values(chairProfiles).filter(
      (profile) => profile.status === "pending",
    );

    expect(pendingProfiles).toHaveLength(5);
    for (const profile of pendingProfiles) {
      expect(profile.source).toBe("pending");
      expect(profile.statusNote.length).toBeGreaterThan(20);
      expect(profile).not.toHaveProperty("bio");
      expect(profile).not.toHaveProperty("introduction");
    }
  });
});
