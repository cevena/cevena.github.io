# Chair Speaker Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an unlinked, mobile-first CEVNAC 2026 chair brief with schedule context, supplied biographies, read-aloud introductions, pending states, and light/dark/system theme support.

**Architecture:** Extract the existing programme into one typed public data module, then join it to a separate typed chair-profile module in a new Astro page. Reuse `BaseLayout.astro` for global typography and theme behavior, add only the small metadata/accessibility hooks the chair page needs, and verify data integrity plus generated HTML with Vitest.

**Tech Stack:** Astro 6, TypeScript, vanilla CSS, Vitest, pnpm, Node.js 22+

---

## File map

- Create `src/data/2026/schedule.ts`: canonical sessions, speaker identifiers, and public schedule entries.
- Create `src/data/2026/schedule.test.ts`: schedule ordering and speaker-identity contract.
- Create `src/data/2026/chairProfiles.ts`: complete and pending chair profiles keyed by speaker identifier.
- Create `src/data/2026/chairProfiles.test.ts`: profile coverage, source, and completeness contract.
- Create `src/components/chairs/ChairScheduleEntry.astro`: one talk/remarks/intermission renderer.
- Create `src/pages/2026/chair-brief.astro`: hidden route, session navigation, grouping, and page-specific responsive styling.
- Create `tests/chair-brief-html.test.ts`: production-output contract for metadata, speaker coverage, and public non-discoverability.
- Modify `src/pages/2026/index.astro`: import the canonical schedule instead of declaring it inline; preserve the user's current `<h2>Schedule</h2>` edit.
- Modify `src/layouts/BaseLayout.astro`: optional robots metadata and accessible 44px theme/menu controls.
- Modify `package.json` and `pnpm-lock.yaml`: add the test/type-check toolchain and scripts.

## Task 1: Establish the test toolchain and canonical programme data

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/data/2026/schedule.test.ts`
- Create: `src/data/2026/schedule.ts`
- Modify: `src/pages/2026/index.astro`

- [ ] **Step 1: Install the test and Astro checking dependencies**

Run:

```bash
pnpm add -D vitest @astrojs/check typescript
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "test": "vitest run",
    "test:integration": "pnpm build && vitest run tests/chair-brief-html.test.ts"
  }
}
```

- [ ] **Step 2: Write the failing schedule contract**

Create `src/data/2026/schedule.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { schedule, sessions } from "./schedule";

describe("CEVNAC 2026 schedule", () => {
  it("keeps the three sessions in workshop order", () => {
    expect(sessions.map((session) => session.id)).toEqual([
      "session-1",
      "session-2",
      "session-3",
    ]);
    expect(schedule[0].id).toBe("welcome");
    expect(schedule.at(-1)?.id).toBe("closing");
  });

  it("gives every human speaking entry a stable speaker id", () => {
    const speakingEntries = schedule.filter((entry) =>
      entry.kind === "talk" || entry.kind === "remarks",
    );
    expect(speakingEntries).toHaveLength(15);
    expect(speakingEntries.every((entry) => entry.speakerId)).toBe(true);
    expect(new Set(speakingEntries.map((entry) => entry.speakerId)).size).toBe(12);
  });

  it("keeps non-speaker entries free of speaker ids", () => {
    const nonSpeakers = schedule.filter((entry) =>
      entry.kind === "break" || entry.kind === "roundtable",
    );
    expect(nonSpeakers.every((entry) => entry.speakerId === undefined)).toBe(true);
  });
});
```

- [ ] **Step 3: Run the schedule test and verify RED**

Run:

```bash
pnpm exec vitest run src/data/2026/schedule.test.ts
```

Expected: FAIL because `src/data/2026/schedule.ts` does not exist.

- [ ] **Step 4: Create the typed schedule module**

Create `src/data/2026/schedule.ts` with these public types and identifiers:

```ts
import { t } from "../../utils/time";

export const speakerIds = [
  "roger-luo",
  "lukas-burgholzer",
  "kyungjoo-noh",
  "tim-chen",
  "phillip-weinberg",
  "jason-ludmir",
  "yannick-stade",
  "ying-wang",
  "elham-kashefi",
  "hanyu-wang",
  "rafael-haenel",
  "jixuan-ruan",
] as const;

export type SpeakerId = (typeof speakerIds)[number];
export type SessionId = "session-1" | "session-2" | "session-3";
export type ScheduleEntryKind = "talk" | "remarks" | "break" | "roundtable";

export interface WorkshopSession {
  id: SessionId;
  label: string;
  title: string;
  start: number;
  end: number;
}

export interface WorkshopScheduleEntry {
  id: string;
  sessionId: SessionId;
  kind: ScheduleEntryKind;
  start: number;
  end: number;
  title: string;
  speaker: string;
  abstract: string;
  speakerId?: SpeakerId;
}

export const sessions: WorkshopSession[] = [
  { id: "session-1", label: "Session 1", title: "Opening & landscape", start: t(10, 0), end: t(11, 30) },
  { id: "session-2", label: "Session 2", title: "Architecture, compilation & tools", start: t(13, 0), end: t(14, 32) },
  { id: "session-3", label: "Session 3", title: "Verification, scheduling & community", start: t(15, 0), end: t(16, 30) },
];
```

Move the existing `schedule` array from `src/pages/2026/index.astro` into this module without changing any existing title, abstract, time, or public speaker string. Add the following exact metadata to the entries, in order:

```ts
const entryMetadata = [
  ["welcome", "session-1", "remarks", "roger-luo"],
  ["device-models", "session-1", "talk", "lukas-burgholzer"],
  ["nvidia-compilation", "session-1", "talk", "kyungjoo-noh"],
  ["morning-break", "session-1", "break", undefined],
  ["bloqade-pipeline", "session-1", "talk", "roger-luo"],
  ["roundtable", "session-1", "roundtable", undefined],
  ["lunch", "session-1", "break", undefined],
  ["fault-tolerant-compilation", "session-2", "talk", "tim-chen"],
  ["lane-architecture", "session-2", "talk", "phillip-weinberg"],
  ["entropy-guided-search", "session-2", "talk", "jason-ludmir"],
  ["iterative-diving-search", "session-2", "talk", "yannick-stade"],
  ["decoder-aware-risk", "session-2", "talk", "ying-wang"],
  ["residual-aware-spacing", "session-2", "talk", "ying-wang"],
  ["afternoon-break", "session-2", "break", undefined],
  ["elham-invited-talk", "session-3", "talk", "elham-kashefi"],
  ["hanyu-invited-talk", "session-3", "talk", "hanyu-wang"],
  ["session-three-break", "session-3", "break", undefined],
  ["interactive-qec", "session-3", "talk", "rafael-haenel"],
  ["shuttling-optimization", "session-3", "talk", "jixuan-ruan"],
  ["closing", "session-3", "remarks", "roger-luo"],
] as const;
```

Use those values directly on each object rather than keeping `entryMetadata` at runtime. Export the result as `schedule satisfies WorkshopScheduleEntry[]`.

- [ ] **Step 5: Switch the public page to the canonical module**

In `src/pages/2026/index.astro`:

```ts
import { schedule } from "../../data/2026/schedule";
```

Remove only the local schedule declaration, from `const schedule = [` through its closing `];`. Preserve every other user-visible string, especially the current `<h2>Schedule</h2>` heading. Keep `const breaks = new Set(["Lunch", "Break"]);` and the existing calendar generation unchanged.

- [ ] **Step 6: Verify GREEN and public-page stability**

Run:

```bash
pnpm exec vitest run src/data/2026/schedule.test.ts
pnpm check
pnpm build
```

Expected: all commands PASS; `/2026/` still builds with the same schedule content.

- [ ] **Step 7: Commit the shared programme data**

The pre-existing `Order of the Day` → `Schedule` heading edit belongs to the user. Stage the new import/removal hunks from `src/pages/2026/index.astro`, but leave that heading hunk unstaged:

```bash
git add package.json pnpm-lock.yaml src/data/2026/schedule.ts src/data/2026/schedule.test.ts
git add -p src/pages/2026/index.astro
git diff --cached --check
git commit -m "refactor(schedule): share 2026 programme data"
```

In the interactive staging prompt, answer `y` for the schedule import and local-array removal hunks and `n` for the heading-only hunk. After the commit, `git status --short` must still show the user's `src/pages/2026/index.astro` modification.

## Task 2: Add complete and pending chair profiles

**Files:**
- Create: `src/data/2026/chairProfiles.test.ts`
- Create: `src/data/2026/chairProfiles.ts`

- [ ] **Step 1: Write the failing profile-coverage tests**

Create `src/data/2026/chairProfiles.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { schedule, speakerIds } from "./schedule";
import { chairProfiles } from "./chairProfiles";

describe("chair profiles", () => {
  it("covers every scheduled speaker exactly once", () => {
    expect(Object.keys(chairProfiles).sort()).toEqual([...speakerIds].sort());
    const scheduled = new Set(schedule.flatMap((entry) => entry.speakerId ? [entry.speakerId] : []));
    expect([...scheduled].sort()).toEqual([...speakerIds].sort());
  });

  it("keeps complete profiles ready to introduce", () => {
    const complete = Object.values(chairProfiles).filter((profile) => profile.status === "complete");
    expect(complete).toHaveLength(7);
    for (const profile of complete) {
      expect(profile.bio.length).toBeGreaterThan(120);
      expect(profile.introduction.length).toBeGreaterThan(80);
      expect(["email", "submission"]).toContain(profile.source);
    }
  });

  it("labels the five unavailable profiles without invented copy", () => {
    const pending = Object.values(chairProfiles).filter((profile) => profile.status === "pending");
    expect(pending).toHaveLength(5);
    for (const profile of pending) {
      expect(profile.source).toBe("pending");
      expect(profile.statusNote.length).toBeGreaterThan(20);
      expect("bio" in profile).toBe(false);
      expect("introduction" in profile).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run the profile test and verify RED**

Run:

```bash
pnpm exec vitest run src/data/2026/chairProfiles.test.ts
```

Expected: FAIL because `chairProfiles.ts` does not exist.

- [ ] **Step 3: Implement the profile types and records**

Create `src/data/2026/chairProfiles.ts`:

```ts
import type { SpeakerId } from "./schedule";

interface ProfileBase {
  name: string;
  affiliation: string;
}

interface CompleteChairProfile extends ProfileBase {
  status: "complete";
  source: "email" | "submission";
  bio: string;
  introduction: string;
}

interface PendingChairProfile extends ProfileBase {
  status: "pending";
  source: "pending";
  statusNote: string;
}

export type ChairProfile = CompleteChairProfile | PendingChairProfile;

export const chairProfiles = {
  // The exact records are listed in Appendix A of this plan.
} satisfies Record<SpeakerId, ChairProfile>;
```

Replace the explanatory comment with every exact record from Appendix A. Do not retain the comment in the finished file.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
pnpm exec vitest run src/data/2026/chairProfiles.test.ts
pnpm check
```

Expected: both commands PASS.

- [ ] **Step 5: Commit the profile data**

```bash
git add src/data/2026/chairProfiles.ts src/data/2026/chairProfiles.test.ts
git commit -m "feat(chairs): add speaker profile data"
```

## Task 3: Add layout metadata and theme-control accessibility

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Create: `tests/chair-brief-html.test.ts`

- [ ] **Step 1: Write the first failing generated-HTML test**

Create `tests/chair-brief-html.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the integration test and verify RED**

Run:

```bash
pnpm build && pnpm exec vitest run tests/chair-brief-html.test.ts
```

Expected: FAIL with `ENOENT` for `dist/2026/chair-brief/index.html`.

- [ ] **Step 3: Add optional robots metadata to the shared layout**

Extend `Props` and the prop destructuring in `src/layouts/BaseLayout.astro`:

```ts
interface Props {
  title: string;
  description: string;
  navBrand: string;
  navYear: string;
  navLinks: { label: string; href: string }[];
  footerText: string;
  contactEmail: string;
  robots?: string;
  brandHref?: string;
}

const {
  title,
  description,
  navBrand,
  navYear,
  navLinks,
  footerText,
  contactEmail,
  robots,
  brandHref = "#",
} = Astro.props;
```

Render the optional metadata immediately after the description, and use `brandHref` on the brand anchor:

```astro
<meta name="description" content={description} />
{robots && <meta name="robots" content={robots} />}

<a href={brandHref} class="nav-brand" aria-label={`${navBrand} ${navYear}`}>
```

- [ ] **Step 4: Make the existing theme and menu controls phone-accessible**

Add `min-width: 44px; min-height: 44px;` to `#theme-toggle`, and the same minimum dimensions plus centering to `.menu-toggle`.

Add this helper beside `applyTheme` and call it at the end of `applyTheme` and once after function declaration:

```ts
function updateThemeControl(mode: string) {
  const next = cycle[mode];
  const label = `Theme: ${mode}. Switch to ${next}.`;
  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);
}
```

Because the initial inline head script already sets `data-theme-mode`, initialize with:

```ts
updateThemeControl(document.documentElement.getAttribute("data-theme-mode") || "system");
```

- [ ] **Step 5: Keep the integration test red for the right reason**

Run:

```bash
pnpm check
pnpm build && pnpm exec vitest run tests/chair-brief-html.test.ts
```

Expected: `pnpm check` PASS; the integration test still FAILS only because the chair page has not been created.

## Task 4: Build the schedule-first chair page

**Files:**
- Modify: `tests/chair-brief-html.test.ts`
- Create: `src/components/chairs/ChairScheduleEntry.astro`
- Create: `src/pages/2026/chair-brief.astro`

- [ ] **Step 1: Expand the failing output contract**

Add these tests to `tests/chair-brief-html.test.ts`:

```ts
it("renders all sessions and all fifteen speaking entries", () => {
  const chair = readBuilt("2026/chair-brief/index.html");
  expect(chair).toContain('id="session-1"');
  expect(chair).toContain('id="session-2"');
  expect(chair).toContain('id="session-3"');

  const speakerEntries = [...chair.matchAll(/data-speaker-id="([^"]+)"/g)].map((match) => match[1]);
  expect(speakerEntries).toHaveLength(15);
  expect(new Set(speakerEntries).size).toBe(12);
});

it("renders supplied introductions and five explicit pending profiles", () => {
  const chair = readBuilt("2026/chair-brief/index.html");
  expect(chair).toContain("20–30 second introduction");
  expect(chair).toContain("Tim (Yi-Ting) Chen");
  expect(chair).toContain("Jixuan Ruan");
  expect(chair.match(/<strong>Pending speaker material<\/strong>/g)).toHaveLength(5);
});

it("keeps full biographies and abstracts in native disclosure controls", () => {
  const chair = readBuilt("2026/chair-brief/index.html");
  expect(chair).toContain("<details");
  expect(chair).toContain("Full supplied bio");
  expect(chair).toContain("Talk abstract");
});
```

Run the integration command again and confirm these assertions fail with the missing output file.

- [ ] **Step 2: Implement the reusable schedule-entry renderer**

Create `src/components/chairs/ChairScheduleEntry.astro`. Its frontmatter must accept one `WorkshopScheduleEntry`, look up `chairProfiles[entry.speakerId]` only for `talk` and `remarks`, and format time with `fmt`.

Use this rendering contract:

```astro
---
import type { WorkshopScheduleEntry } from "../../data/2026/schedule";
import { chairProfiles } from "../../data/2026/chairProfiles";
import { fmt } from "../../utils/time";

interface Props { entry: WorkshopScheduleEntry }
const { entry } = Astro.props;
const profile = entry.speakerId ? chairProfiles[entry.speakerId] : undefined;
const isSpeakerEntry = entry.kind === "talk" || entry.kind === "remarks";
---

{isSpeakerEntry && profile ? (
  <article class="chair-entry" id={entry.id} data-speaker-id={entry.speakerId}>
    <p class="entry-time">{fmt(entry.start)}–{fmt(entry.end)}</p>
    <div class="entry-body">
      <p class="entry-kind">{entry.kind === "remarks" ? "Workshop remarks" : "Speaker"}</p>
      <h3>{profile.name}</h3>
      <p class="entry-affiliation">{profile.affiliation}</p>
      <h4>{entry.title}</h4>
      {profile.status === "complete" ? (
        <section class="read-aloud" aria-labelledby={`${entry.id}-intro`}>
          <p class="read-aloud-label" id={`${entry.id}-intro`}>20–30 second introduction · read aloud</p>
          <p>{profile.introduction}</p>
        </section>
      ) : (
        <section class="pending" aria-label="Pending speaker material">
          <strong>Pending speaker material</strong>
          <p>{profile.statusNote}</p>
        </section>
      )}
      {entry.abstract ? (
        <details><summary>Talk abstract</summary><p>{entry.abstract}</p></details>
      ) : (
        <p class="missing-field">Talk abstract pending</p>
      )}
      {profile.status === "complete" && (
        <details><summary>Full supplied bio</summary><p>{profile.bio}</p></details>
      )}
    </div>
  </article>
) : (
  <div class:list={["chair-interlude", `chair-interlude--${entry.kind}`]} id={entry.id}>
    <span>{fmt(entry.start)}–{fmt(entry.end)}</span>
    <strong>{entry.title}</strong>
  </div>
)}
```

Keep styles in the page so the component remains a semantic renderer with no duplicated theme tokens.

- [ ] **Step 3: Create the hidden route and group entries by session**

Create `src/pages/2026/chair-brief.astro` using `BaseLayout`, `ChairScheduleEntry`, `schedule`, `sessions`, and `fmt`.

Pass these exact layout props:

```astro
<BaseLayout
  title="Chair's Brief — CEVNAC 2026"
  description="Workshop running order, speaker biographies, and read-aloud introductions for CEVNAC 2026 program chairs."
  robots="noindex, nofollow"
  navBrand="CEVNAC"
  navYear="2026"
  brandHref="#top"
  navLinks={[]}
  footerText="CEVNAC 2026 — Program Chair Brief"
  contactEmail="rluo@quera.com"
>
```

The page body must contain:

```astro
<main id="top" class="chair-brief">
  <header class="brief-hero">
    <p class="eyebrow">CEVNAC 2026 · Program chair field guide</p>
    <h1>Chair's Brief</h1>
    <p>Wednesday, September 16 · Metro Toronto Convention Centre</p>
    <p class="privacy-note">Unlisted public URL · chair-use material</p>
  </header>

  <nav class="session-jumps" aria-label="Jump to workshop session">
    {sessions.map((session) => <a href={`#${session.id}`}>{session.label}</a>)}
  </nav>

  {sessions.map((session) => (
    <section class="chair-session" id={session.id} aria-labelledby={`${session.id}-title`}>
      <header class="session-heading">
        <p>{session.label} · {fmt(session.start)}–{fmt(session.end)}</p>
        <h2 id={`${session.id}-title`}>{session.title}</h2>
      </header>
      {schedule.filter((entry) => entry.sessionId === session.id).map((entry) => (
        <ChairScheduleEntry entry={entry} />
      ))}
    </section>
  ))}
</main>
```

- [ ] **Step 4: Add mobile-first styling**

In the page `<style>`, use existing global tokens and implement these required declarations:

```css
.chair-brief { max-width: 760px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
.brief-hero { padding: 1.5rem 0 1.25rem; }
.brief-hero h1 { font-family: var(--font-display); font-size: clamp(2.4rem, 12vw, 4.75rem); line-height: .95; }
.eyebrow, .privacy-note, .entry-time, .entry-kind, .read-aloud-label, .session-heading > p { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .1em; }
.session-jumps { position: sticky; top: 61px; z-index: 50; display: grid; grid-template-columns: repeat(3, 1fr); background: var(--c-nav-bg); border: 1px solid var(--c-border); backdrop-filter: blur(10px); }
.session-jumps a { min-height: 44px; display: grid; place-items: center; color: var(--c-text); font: .68rem var(--font-mono); text-decoration: none; border-right: 1px solid var(--c-border); }
.chair-session { scroll-margin-top: 125px; padding-top: 2.75rem; }
.session-heading { border-bottom: 2px solid var(--c-accent); padding-bottom: .85rem; }
.chair-entry { display: grid; grid-template-columns: 1fr; gap: .65rem; padding: 1.75rem 0; border-bottom: 1px solid var(--c-border); }
.entry-time { color: var(--c-accent); font-size: .74rem; font-variant-numeric: tabular-nums; }
.entry-body h3 { margin: 0; font-size: 1.65rem; }
.entry-body h4 { margin: .8rem 0 1rem; font-family: var(--font-serif); font-size: 1.05rem; line-height: 1.35; }
.entry-affiliation { color: var(--c-text-secondary); font-size: .9rem; }
.read-aloud { margin: 1rem 0; padding: 1rem; background: var(--c-bg-alt); border-left: 4px solid var(--c-ochre); }
.read-aloud > p:last-child { font-size: 1.05rem; line-height: 1.55; }
.read-aloud-label { color: var(--c-text-secondary); font-size: .62rem; margin-bottom: .5rem; }
.pending { margin: 1rem 0; padding: 1rem; border: 1px dashed var(--c-rule); color: var(--c-text-secondary); }
.missing-field { color: var(--c-text-secondary); font-style: italic; font-size: .9rem; }
.entry-body details { margin-top: .65rem; border: 1px solid var(--c-border); }
.entry-body summary { min-height: 44px; display: flex; align-items: center; padding: .65rem .8rem; cursor: pointer; font-family: var(--font-mono); font-size: .72rem; }
.entry-body details p { padding: 0 .8rem .9rem; font-size: .92rem; line-height: 1.6; }
.chair-interlude { display: flex; justify-content: space-between; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--c-border); color: var(--c-text-secondary); font-size: .85rem; }

@media (min-width: 700px) {
  .chair-brief { padding-inline: 1.5rem; }
  .chair-entry { grid-template-columns: 96px minmax(0, 1fr); gap: 1.5rem; }
  .entry-time { padding-top: .35rem; }
  .read-aloud { padding: 1.25rem 1.4rem; }
}
```

Add focus-visible outlines using `2px solid var(--c-accent)` with a `3px` offset for session links, summaries, and theme/menu buttons. Ensure every declaration uses variables that already have light and dark values.

- [ ] **Step 5: Run the full automated suite and verify GREEN**

Run:

```bash
pnpm test
pnpm check
pnpm test:integration
```

Expected: all tests, Astro checking, and production build PASS.

- [ ] **Step 6: Commit the functional chair brief**

```bash
git add src/layouts/BaseLayout.astro src/components/chairs/ChairScheduleEntry.astro src/pages/2026/chair-brief.astro tests/chair-brief-html.test.ts
git commit -m "feat(chairs): add mobile speaker brief"
```

## Task 5: Visual and accessibility verification

**Files:**
- Modify if verification exposes defects: `src/pages/2026/chair-brief.astro`
- Modify if verification exposes shared-control defects: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Start the production preview**

Run:

```bash
pnpm build
pnpm preview
```

Open `/2026/chair-brief/` in the in-app browser.

- [ ] **Step 2: Verify representative phone widths**

Inspect at 320×700, 375×812, and 430×932. At each size confirm:

- no horizontal overflow;
- session links and theme control are at least 44px;
- sticky navigation does not cover section headings;
- scientific titles wrap without clipping;
- read-aloud copy is visible without expanding controls;
- abstract and bio disclosures open and remain readable;
- all five pending cards are visually clear but not alarming.

- [ ] **Step 3: Verify all theme modes**

Cycle system → light → dark → system. Confirm icon/label changes, explicit modes persist on reload, system mode follows the browser preference, and focus/contrast remains legible in both resolved themes.

- [ ] **Step 4: Verify desktop enhancement**

Inspect at 1280×900. Confirm the time column aligns cleanly, the reading measure remains under 760px, and the phone-first hierarchy is preserved.

- [ ] **Step 5: Re-run checks after any visual refinements**

Run:

```bash
pnpm test
pnpm check
pnpm test:integration
git diff --check
```

Expected: all commands PASS with no whitespace errors.

- [ ] **Step 6: Commit only if verification required changes**

```bash
git add src/pages/2026/chair-brief.astro src/layouts/BaseLayout.astro
git commit -m "style(chairs): refine responsive chair brief"
```

## Appendix A: Exact chair profile records

Use these values in `chairProfiles.ts`.

```ts
"roger-luo": {
  name: "Xiu-Zhe (Roger) Luo",
  affiliation: "QuEra Computing",
  status: "complete",
  source: "submission",
  introduction: "Roger Luo is Director of Scientific Software at QuEra Computing, where he leads compiler infrastructure, numerical tools, and algorithms for neutral-atom platforms. He trained at the University of Waterloo and Perimeter Institute and is a long-time contributor to open-source scientific computing, including Yao.jl, Julia, and PyTorch.",
  bio: "Xiu-Zhe (Roger) Luo is the Director of Scientific Software at QuEra Computing, where he leads the development of quantum compiler infrastructure, numerical tools, and algorithms for neutral atom platforms. Roger did his PhD work at the University of Waterloo and the Perimeter Institute studying computational quantum many-body physics and machine learning methods. He is the recipient of the 2020 Wittek Quantum Prize for his outstanding contributions to open-source quantum software. He is the lead developer of Yao.jl, a high-performance and differentiable quantum circuit simulation framework, and the primary architect of QuEra's compiler pipeline for neutral atom systems. He has also contributed to a number of widely used open-source projects in the scientific computing ecosystem, including the Julia compiler and PyTorch.",
},
"lukas-burgholzer": {
  name: "Lukas Burgholzer",
  affiliation: "Technical University of Munich",
  status: "complete",
  source: "submission",
  introduction: "Lukas Burgholzer is a postdoctoral researcher at the Technical University of Munich and CTO of the Munich Quantum Software Company. He is a key contributor to the Munich Quantum Toolkit and works on practical, open-source software that connects quantum research with usable compiler and design tools.",
  bio: "Lukas Burgholzer is a postdoc at the Technical University of Munich as well as the CTO of the Munich Quantum Software Company, where he is on a mission to build actually useful software for quantum computers. As one of the masterminds behind the Munich Quantum Toolkit (MQT) and a key player in the Munich Quantum Software Stack (MQSS) project, he is dedicated to creating tools that do not just work but work for the community. His work has earned him accolades like the EDAA Outstanding Dissertation Award and the Heinz Zemanek Prize, but he is most proud of building bridges in the open-source quantum world.",
},
"kyungjoo-noh": {
  name: "Kyungjoo Noh",
  affiliation: "NVIDIA",
  status: "pending",
  source: "pending",
  statusNote: "Bio and talk abstract are forthcoming; Kyungjoo replied on August 11 that they should arrive within a day or two.",
},
"tim-chen": {
  name: "Tim (Yi-Ting) Chen",
  affiliation: "Amazon Braket",
  status: "complete",
  source: "email",
  introduction: "Tim Chen is an Applied Scientist on the Amazon Braket team, working on programming models and compilation for quantum computers. His work spans fault-tolerant software architecture, OpenQASM analysis, dynamic circuits, and verification across the quantum hardware–software stack.",
  bio: "Tim (Yi-Ting) Chen is an Applied Scientist on the Amazon Braket team, where he works on programming models and compilation for quantum computers. His work includes architecting the software stack for fault-tolerant quantum computing, building OpenQASM program analysis and compilation infrastructure, and extending the programming model to support dynamic circuits. Previously, he focused test suites and statistical methods for verifying the quantum stack across hardware and software. He received his PhD in Applied Physics from Stanford University, where he used atom manipulation to probe the microscopic structure of electrons in condensed matter systems.",
},
"phillip-weinberg": {
  name: "Phillip Weinberg",
  affiliation: "QuEra Computing",
  status: "complete",
  source: "submission",
  introduction: "Phillip Weinberg is a Senior Scientific Software Engineer at QuEra Computing and leads development of Bloqade, QuEra's open-source SDK and compiler infrastructure. His work spans high-level programming interfaces, atom movement and trap scheduling, and software contributions to major neutral-atom hardware demonstrations.",
  bio: "Phillip Weinberg is a Senior Scientific Software Engineer at QuEra Computing, where he leads the development of Bloqade, QuEra's open-source SDK and compiler infrastructure for neutral atom quantum computers. Phillip did his PhD work at Boston University studying non-equilibrium quantum dynamics under Anatoli Polkovnikov and Anders Sandvik. After completing his PhD, he held a postdoctoral position at Northeastern University before joining QuEra in 2022. At QuEra, his work spans the full neutral atom software stack—from high-level circuit programming interfaces to low-level hardware control via Bloqade Shuttle, which provides abstractions for atom movement and trap scheduling on neutral atom devices. He has also contributed to key experimental milestones at QuEra, including the Aquila 256-qubit neutral atom quantum computer and the recent demonstration of logical magic state distillation.",
},
"jason-ludmir": {
  name: "Jason Ludmir",
  affiliation: "Rice University",
  status: "pending",
  source: "pending",
  statusNote: "The talk title and abstract are available, but no speaker-supplied biography was found in the mailbox or attached submission.",
},
"yannick-stade": {
  name: "Yannick Stade",
  affiliation: "Technical University of Munich",
  status: "complete",
  source: "submission",
  introduction: "Yannick Stade is a doctoral researcher at the Technical University of Munich working at the intersection of neutral-atom quantum computing and compiler design. He develops placement, routing, scheduling, and hardware-interface techniques, and is a main contributor to the Quantum Device Management Interface.",
  bio: "Yannick Stade is a doctoral researcher at the Technical University of Munich, working at the intersection of quantum computing based on neutral atoms and compiler design. In this domain, he has contributed several state-of-the-art techniques for placement, routing, and scheduling on zoned neutral-atom architectures, including the first routing-aware placement approach that significantly reduces qubit-rearrangement overheads. He is the main contributor to the Quantum Device Management Interface (QDMI), a low-latency C-based interface enabling seamless integration of diverse quantum hardware into the Munich Quantum Software Stack. His work also engages with community-driven efforts toward common circuit exchange formats and MLIR-based compiler infrastructures, helping bridge the gap between classical compiler engineering and quantum-software needs. Yannick has authored more than two dozen scientific publications across leading venues in quantum computing, design automation, and HPC, and collaborates with academic and industrial partners worldwide.",
},
"ying-wang": {
  name: "Ying Wang",
  affiliation: "Stevens Institute of Technology",
  status: "pending",
  source: "pending",
  statusNote: "Two contributed talk abstracts are available, but no speaker-supplied biography was found in the mailbox or attached submission.",
},
"elham-kashefi": {
  name: "Elham Kashefi",
  affiliation: "University of Edinburgh",
  status: "pending",
  source: "pending",
  statusNote: "The invited slot is scheduled, but the talk title, abstract, and speaker biography have not yet been supplied.",
},
"hanyu-wang": {
  name: "Hanyu Wang",
  affiliation: "University of California, Los Angeles",
  status: "pending",
  source: "pending",
  statusNote: "Title, abstract, and biography are forthcoming; Hanyu replied on August 11 that the material would be prepared later that day.",
},
"rafael-haenel": {
  name: "Rafael Haenel",
  affiliation: "QuEra Computing",
  status: "complete",
  source: "submission",
  introduction: "Rafael Haenel is a Senior Scientific Software Developer in Quantum Error Correction at QuEra Computing. His work focuses on scalable error-correction software and hardware–software co-design for neutral-atom platforms, building on experience in quantum computing, strongly correlated matter, and QLDPC-code development.",
  bio: "Rafael Haenel is a Senior Scientific Software Developer in Quantum Error Correction at QuEra Computing, developing quantum error correction software for neutral atom platforms. Rafael did his PhD work at the University of British Columbia studying quantum computing, superconductivity, and strongly correlated quantum matter, with a research focus on scientific numerical computing and data analysis. After completing his PhD, Rafael worked as a Quantum Software Engineer at Vancouver-based startup Photonic Inc, where he focused on scientific software for discovery and development of QLDPC codes. He later joined QuEra where he works on building scalable quantum error correction software at the intersection of hardware and software co-design.",
},
"jixuan-ruan": {
  name: "Jixuan Ruan",
  affiliation: "University of California, San Diego",
  status: "complete",
  source: "email",
  introduction: "Jixuan Ruan is a PhD student at the University of California, San Diego, advised by Professor Yufei Ding. Her research focuses on neutral-atom compilation, compiler–architecture co-design, extensible intermediate representations, and AI-assisted optimization for quantum programs.",
  bio: "Jixuan Ruan is a second-year Ph.D. student at the University of California San Diego, advised by Professor Yufei Ding. Her research focuses on quantum compilation for neutral-atom systems, particularly on incorporating emerging hardware capabilities and identifying key compiler-architecture co-design principles. She develops high-level intermediate representations and data structures to support efficient and extensible compilation, and also explores AI-assisted, circuit-specific optimization for quantum programs.",
},
```
