# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BAHUR Terminal — premium perfume wholesale price list with Liquid Glass (Glassmorphism) iOS-style design. Russian-language UI. Mobile First. Data loaded from Google Sheets CSV.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run start` — Railway deployment preview (uses $PORT)
- `npm run lint` — ESLint

No test runner configured.

## Tech Stack

- **Vite 7** + **React 19** (JSX, no TypeScript)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Custom CSS design system with CSS variables for 10 themes (5 dark, 5 light)
- Deployment target: Railway.app

## Architecture

Single-page app. All logic lives in `src/App.jsx` as a single component (mirrors the original Vue SFC pattern).

**Key systems:**
- **Theme engine** — 10 themes defined in `T` object, applied via CSS custom properties on root `.bahur-terminal` div
- **Data pipeline** — fetches CSV from Google Sheets → `parseCSV()` → products array → filtered/sorted via `useMemo` chains
- **Popup system** — `Popup` component uses `createPortal` to render menus to `document.body`, positioned via `calcPopup()` relative to trigger button refs
- **Filter chain** — `products` → `filteredProducts` → `sortedProducts`, each a `useMemo` depending on filter state (gender, factory, quality, brand, status, search)

**Data source URL** is hardcoded in `DATA_URL` constant. CSV columns: ID, Link, Brand, Name, Gender, Factory, Quality, Price50g, Price500g, Price1kg, Status, Sales6m, SalesAll.

## CSS Architecture

`src/index.css` contains Tailwind import + the full design system (~170 CSS rules). Classes use short abbreviated names matching the original Vue project (`.sn` = sticky nav, `.gt` = grid table, `.ao` = aura overlay, etc.). Theme switching works via CSS custom properties (`--bg`, `--text`, `--glass-base`, etc.) set inline on the root element.

## Conventions

- ESLint: unused vars starting with uppercase or `_` are allowed
- UI text is in Russian
- CSS class names are terse/abbreviated — refer to comments in index.css for meaning
- Fonts: Nunito (UI), JetBrains Mono (numbers), Kollektif (headings/brands)
