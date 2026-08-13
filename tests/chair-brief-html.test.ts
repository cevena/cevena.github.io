import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { chairProfiles } from "../src/data/2026/chairProfiles";
import { schedule } from "../src/data/2026/schedule";
import { fmt } from "../src/utils/time";

const readBuilt = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");
const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, "") || "/";
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const readableText = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/(?:&#39;|&apos;)/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

    const profileStatuses = [...chair.matchAll(/data-profile-status="(complete|pending)"/g)].map(
      ([, status]) => status,
    );
    expect(profileStatuses.filter((status) => status === "complete")).toHaveLength(14);
    expect(profileStatuses.filter((status) => status === "pending")).toHaveLength(1);

    for (const entry of schedule) {
      if (entry.kind !== "talk" && entry.kind !== "remarks") continue;

      const article = chair.match(
        new RegExp(`<article\\b[^>]*data-schedule-entry="${escapeRegex(entry.id)}"[^>]*>[\\s\\S]*?<\\/article>`),
      );
      expect(article, entry.id).not.toBeNull();

      const text = readableText(article![0]);
      const profile = chairProfiles[entry.speakerId];
      expect(text, `${entry.id} time`).toContain(`${fmt(entry.start)} – ${fmt(entry.end)}`);
      expect(text, `${entry.id} name`).toContain(profile.name);
      expect(text, `${entry.id} affiliation`).toContain(profile.affiliation);
      expect(text, `${entry.id} title`).toContain(entry.title);
    }
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

  it("marks exactly one unique speaker as pending", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const pendingArticles = [...chair.matchAll(/<article\b[^>]*data-speaker-id="([^"]+)"[^>]*data-profile-status="pending"[^>]*>/g)];
    const pendingIds = pendingArticles.map(([, id]) => id);

    expect(new Set(pendingIds).size).toBe(1);
    expect(chair).toContain("Pending speaker material");
  });

  it("labels approved web research separately from speaker-supplied bios", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const publicWebProfiles = chair.match(/Public-source bio/g) ?? [];

    expect(publicWebProfiles).toHaveLength(3);
    expect(chair).toContain("Jason Ludmir is a Computer Science PhD student at Rice University");
    expect(chair).toContain("Ying Wang is an Associate Professor of Systems Engineering at Stevens Institute of Technology");
  });
});
