import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");

describe("BaseLayout source safeguards", () => {
  it("keeps the logo link at least 44 by 44 CSS pixels", () => {
    const navBrandRule = source.match(/\.nav-brand\s*{([\s\S]*?)}/)?.[1] ?? "";
    const navLogoRule = source.match(/\.nav-logo\s*{([\s\S]*?)}/)?.[1] ?? "";

    expect(navBrandRule).toContain("min-width: 44px");
    expect(navBrandRule).toContain("min-height: 44px");
    expect(navBrandRule).toContain("justify-content: center");
    expect(navLogoRule).toContain("height: 24px");
  });

  it("sanitizes persisted and DOM theme modes", () => {
    expect(source).toContain('type ThemeMode = "light" | "dark" | "system"');
    expect(source).toContain("const sanitizeThemeMode");
    expect(source).toMatch(/localStorage\.removeItem\(['"]theme['"]\)/);
    expect(source).toContain("Record<ThemeMode, ThemeMode>");
  });

  it("disables smooth scrolling when reduced motion is requested", () => {
    expect(source).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*{\s*html\s*{\s*scroll-behavior:\s*auto;/,
    );
  });
});
