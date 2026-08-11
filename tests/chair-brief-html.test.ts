import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readBuilt = (path: string) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");

describe("built chair brief", () => {
  it("is unindexed and absent from public-page links", () => {
    const chair = readBuilt("2026/chair-brief/index.html");
    const publicPage = readBuilt("2026/index.html");

    expect(chair).toMatch(/<meta name="robots" content="noindex, nofollow"\s*\/?>/);
    expect(publicPage).not.toContain("/2026/chair-brief/");
  });
});
