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

  it("contains nine complete, substantive profiles", () => {
    const completeProfiles = Object.values(chairProfiles).filter(
      (profile) => profile.status === "complete",
    );

    expect(completeProfiles).toHaveLength(9);
    for (const profile of completeProfiles) {
      expect(profile.bio.length).toBeGreaterThan(120);
      expect(profile.introduction.length).toBeGreaterThan(80);
      expect(["email", "submission", "public-web"]).toContain(profile.source);
    }
  });

  it("identifies the two approved public-web profiles", () => {
    const publicWebProfileIds = Object.entries(chairProfiles)
      .filter(([, profile]) => profile.status === "complete" && profile.source === "public-web")
      .map(([id]) => id)
      .sort();

    expect(publicWebProfileIds).toEqual(["jason-ludmir", "ying-wang"]);
  });

  it("keeps every supplied introduction within a 20–30 second reading length", () => {
    const completeProfiles = Object.values(chairProfiles).filter(
      (profile) => profile.status === "complete",
    );

    for (const profile of completeProfiles) {
      const wordCount = profile.introduction.trim().split(/\s+/).length;
      expect(wordCount, profile.name).toBeGreaterThanOrEqual(45);
      expect(wordCount, profile.name).toBeLessThanOrEqual(65);
    }
  });

  it("contains three pending profiles without unsupported copy", () => {
    const pendingProfiles = Object.values(chairProfiles).filter(
      (profile) => profile.status === "pending",
    );

    expect(pendingProfiles).toHaveLength(3);
    for (const profile of pendingProfiles) {
      expect(profile.source).toBe("pending");
      expect(profile.statusNote.length).toBeGreaterThan(20);
      expect(profile).not.toHaveProperty("bio");
      expect(profile).not.toHaveProperty("introduction");
    }
  });
});
