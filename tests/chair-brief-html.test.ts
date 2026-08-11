import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readBuilt = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");
const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

describe("built chair brief", () => {
  it("is unindexed and absent from public-page links", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const publicPage = readBuilt("2026/index.html");
    const publicHrefs = [...publicPage.matchAll(/\bhref="([^"]+)"/g)].map(([, href]) =>
      new URL(href, "https://cevnac.github.io/2026/"),
    );

    expect(chair).toMatch(/<meta name="robots" content="noindex, nofollow"\s*\/?>/);
    expect(publicHrefs.some(({ pathname }) => normalizePathname(pathname) === "/2026/chair-brief")).toBe(false);
  });

  it("renders the complete three-session running order", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const speakerIds = [...chair.matchAll(/data-speaker-id="([^"]+)"/g)].map(([, id]) => id);
    const scheduleEntries = [...chair.matchAll(/data-schedule-entry="([^"]+)"/g)].map(([, id]) => id);

    expect(chair).toContain('id="session-1"');
    expect(chair).toContain('id="session-2"');
    expect(chair).toContain('id="session-3"');
    expect(speakerIds).toHaveLength(15);
    expect(new Set(speakerIds).size).toBe(12);
    expect(scheduleEntries).toEqual([
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

  it("includes supplied introductions and expandable source material", () => {
    const chair = readBuilt("2026/chair-brief/index.html");

    expect(chair).toContain("Wednesday, September 16 · Metro Toronto Convention Centre");
    expect(chair).toContain("20–30 second introduction");
    expect(chair).toContain("Tim (Yi-Ting) Chen");
    expect(chair).toContain("Jixuan Ruan");
    expect(chair).toContain("<details");
    expect(chair).toContain("Full supplied bio");
    expect(chair).toContain("Talk abstract");
  });

  it("marks exactly five unique speakers as pending", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const pendingArticles = [...chair.matchAll(/<article\b[^>]*data-speaker-id="([^"]+)"[^>]*data-profile-status="pending"[^>]*>/g)];
    const pendingIds = pendingArticles.map(([, id]) => id);

    expect(new Set(pendingIds).size).toBe(5);
    expect(chair).toContain("Pending speaker material");
  });
});
