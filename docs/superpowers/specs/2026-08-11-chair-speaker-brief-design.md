# CEVNAC 2026 Chair Speaker Brief Design

## Purpose

Create an unlinked, mobile-first page that helps CEVNAC 2026 program chairs run the workshop. The page gives the chair the live schedule context, the full talk abstract and speaker biography, and a polished 20–30 second introduction that can be read aloud.

The page is operational material, not a secure system. It will be publicly reachable by anyone who knows its URL, but it will not be linked from the public workshop site and will ask search engines not to index or follow it.

## Route and discoverability

- Route: `/2026/chair-brief/`.
- Do not link the route from public navigation, schedules, footers, sitemaps, or other visible site content.
- Add page-level `robots` metadata with `noindex, nofollow`.
- Do not describe the route as private or access-controlled.
- Continue to use GitHub Pages; authentication is outside this feature's scope.

## Information architecture

Use a schedule-first rundown that follows the workshop order exactly and groups entries into Sessions 1–3.

Each speaking entry displays:

1. Start and end time.
2. Speaker name and affiliation.
3. Talk title.
4. A visually prominent 20–30 second introduction labeled for reading aloud.
5. Full talk abstract in a disclosure section.
6. Full supplied biography in a disclosure section.
7. A clear pending-material notice when any required content is unavailable.

Breaks and lunch appear as compact timeline dividers. The roundtable remains a schedule entry but does not create a separate speaker profile for “All speakers.” Closing and opening remarks by Roger Luo may use the same profile material without duplicating the underlying chair data.

## Mobile-first interaction

Phone use is the primary design target.

- Use a single content column with no horizontal scrolling.
- Place the time above each speaker on narrow screens rather than reserving a thin timeline column.
- Keep speaker, affiliation, title, and read-aloud introduction visible without opening controls.
- Collapse the full abstract and full bio by default using native, accessible disclosure controls.
- Provide a compact sticky header with the current page identity and quick jumps to Sessions 1–3.
- Use touch targets of at least 44 CSS pixels.
- Set comfortable body text and line height so the page is readable without zooming.
- Allow long scientific titles and affiliations to wrap naturally.
- Enhance the same layout with additional spacing and a time column at wider breakpoints; do not create a separate desktop interaction model.

## Visual direction and themes

Use a restrained editorial field-guide aesthetic that fits the existing CEVNAC website: warm paper-like light surfaces, a dark ink theme, serif display typography, and terracotta/gold accents. The read-aloud introduction is the strongest visual element on each card.

Reuse the theme behavior in `BaseLayout.astro`:

- Modes: light, dark, and system.
- Default: system preference.
- Persist an explicit selection in local storage.
- While in system mode, react to device theme changes.
- Maintain accessible text, border, link, and accent contrast in both resolved themes.
- Preserve visible focus styles and correct labels for all interactive controls.

## Data boundaries

Extract the public 2026 schedule into one typed data source shared by the public program and the chair brief. This prevents times, titles, abstracts, and affiliations from drifting between pages.

Keep chair-only material in a separate typed source keyed by a stable speaker identifier. A chair profile contains:

- Full name.
- Affiliation as presented at the workshop.
- Full supplied biography, if available.
- Read-aloud introduction, if available.
- Source classification: `email`, `submission`, or `pending`.
- Optional status note for promised forthcoming material.

Chair profile data must never be rendered by the public schedule accidentally. The public schedule imports only the public schedule source; the chair page combines schedule entries with chair profiles.

## Source precedence and current completeness

Use source material in this order:

1. Speaker-supplied mailbox content.
2. Biography in the attached original workshop submission.
3. Existing public program data for talk details.

Do not add unsupported claims. Read-aloud introductions should faithfully condense the supplied biography and may smooth grammar for oral delivery without changing facts.

Bio sources currently confirmed:

| Speaker | Source | Status |
| --- | --- | --- |
| Tim (Yi-Ting) Chen | Mailbox | Complete |
| Jixuan Ruan | Mailbox | Complete |
| Hanyu Wang | Mailbox | Complete |
| Xiu-Zhe (Roger) Luo | Original submission | Complete |
| Phillip Weinberg | Original submission | Complete |
| Rafael Haenel | Original submission | Complete |
| Yannick Stade | Original submission | Complete |
| Lukas Burgholzer | Original submission | Complete |
| Kyungjoo Noh | Mailbox follow-up | Bio and abstract forthcoming |
| Jason Ludmir | None found | Pending bio |
| Ying Wang | None found | Pending bio |
| Elham Kashefi | None found | Pending title, abstract, and bio |

The chair page must still render every scheduled speaker. Pending information appears as a calm, explicit “Pending speaker material” state rather than an empty region or an invented introduction.

## Error and edge-case behavior

- A scheduled speaker without a chair profile renders a pending profile state and remains in schedule order.
- Missing title, abstract, or biography is labeled individually so chairs know exactly what is unavailable.
- Repeated speakers reuse one underlying profile while each talk retains its own time, title, and abstract.
- Non-speaking schedule entries never trigger missing-profile warnings.
- Anchor identifiers remain stable and unique even when a person appears more than once.
- JavaScript is not required to read any content; theme persistence is the only existing progressive enhancement.

## Verification strategy

Verification must cover:

- Every scheduled human speaker appears in the chair brief.
- Speaker entries and session groupings match public schedule order.
- Repeated speakers reuse profile data without duplicate-source drift.
- Break, lunch, roundtable, and remarks entries render intentionally.
- Missing material produces the correct pending state.
- `noindex, nofollow` metadata is present.
- Theme control exposes and persists light, dark, and system modes.
- The layout works at representative phone widths, including 320, 375, and 430 CSS pixels, without horizontal overflow.
- Disclosure controls are keyboard-accessible and touch-friendly.
- Light and dark modes preserve legible contrast and visible focus.
- Astro type checking and the production build succeed.

Visual verification should inspect representative phone and desktop renders in all three theme modes, with special attention to the sticky header, long titles, pending cards, and expanded biography/abstract controls.

## Out of scope

- Password protection, authentication, or chair accounts.
- Editing chair notes in the browser.
- Automatically importing future emails.
- Speaker photographs.
- Publishing pending biographies sourced from general web research without explicit approval.
