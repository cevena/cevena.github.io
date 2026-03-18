# CEVENA Workshop Website

Workshop website for "Compilation, Emulation and Verification of Neutral Atom Programs" at IEEE QCE 2026.

## Tech Stack

- **Framework**: Astro (static site generation)
- **Styling**: Vanilla CSS with CSS custom properties (no Tailwind)
- **Fonts**: EB Garamond (serif headings) + Inter (sans body)
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

- `src/pages/index.astro` — single landing page (all content and styles)
- `public/` — static assets (favicon, images)
- `astro.config.mjs` — Astro configuration with GitHub Pages site URL
