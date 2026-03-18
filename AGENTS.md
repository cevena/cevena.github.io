# CEVENA Workshop Website

Workshop website for "Compilation, Emulation and Verification of Neutral Atom Programs" at IEEE QCE 2026.

## Tech Stack

- **Framework**: Astro (static site generation)
- **Styling**: Vanilla CSS with CSS custom properties (no Tailwind)
- **Fonts**: EB Garamond (serif headings) + Inter (sans body)
- **Package manager**: pnpm (do NOT use npm)
- **Deployment**: GitHub Pages at https://cevena.github.io

## Commit Convention

All commits MUST follow **Conventional Commits** (https://www.conventionalcommits.org/).

Format: `<type>(<scope>): <description>`

Types:
- `feat`: new feature or section
- `fix`: bug fix
- `style`: styling/CSS changes (no logic change)
- `docs`: documentation only
- `chore`: build, config, dependencies
- `refactor`: code restructuring without behavior change

Examples:
- `feat(schedule): add detailed session descriptions`
- `fix(dark-mode): correct nav background in system theme`
- `style(speakers): adjust card spacing on mobile`
- `chore: update astro to v6.1`

## Project Structure

- `src/layouts/BaseLayout.astro` — shared layout (nav, footer, theme toggle, global CSS)
- `src/utils/time.ts` — time helpers (t, fmt, minsToIcs)
- `src/utils/calendar.ts` — calendar link generation (Google, Outlook, .ics)
- `src/pages/index.astro` — redirects to latest year (/2026/)
- `src/pages/2026/index.astro` — 2026 workshop page (data + page-specific content/styles)
- `public/` — static assets (favicon, images)
- `astro.config.mjs` — Astro configuration with GitHub Pages site URL
