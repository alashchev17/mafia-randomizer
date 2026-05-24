# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn** (CI uses yarn; husky/lint-staged invoke `yarn format:write`). Don't switch to npm/pnpm.

- `yarn dev` — Vite dev server at http://localhost:5173
- `yarn build` — type-check (`tsc`) then Vite production build (build fails on any TS error; `tsconfig.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`)
- `yarn lint` — ESLint, `--max-warnings 0` (warnings fail). `no-console` is an error.
- `yarn format:check` / `yarn format:write` — Prettier
- `yarn test` — Vitest **watch mode** (default script). For one-shot use `yarn vitest run` or `yarn test:coverage`. Run a single file: `yarn vitest run path/to/file.test.tsx`. Filter by test name: `yarn vitest run -t "name"`.
- `yarn test:ui` — Vitest UI
- `yarn cy:run` — boots dev server via `start-server-and-test` then runs Cypress headless (this is what CI uses; do NOT run `yarn test:e2e` standalone — it expects the server already up)
- `yarn cy:open` — same but opens Cypress UI

Pre-commit (husky → lint-staged): runs Prettier + ESLint on staged `.ts/.tsx`. CI pipeline order: format:check → lint → `tsc --noEmit` → vitest → build → cy:run. Match this locally before pushing.

## Architecture

React 18 + TypeScript + Vite SPA. Router is `react-router-dom` v6 mounted in `src/main.tsx` (`BrowserRouter`), with routes declared in `src/App.tsx`. `/` redirects to `/welcome` via a `useEffect` in `App.tsx` — do not add a `<Route path="/">`, the redirect is intentional.

### State — transitional, two systems coexist

The app is mid-migration from React Context to Redux Toolkit. Both are present:

- **Legacy Context** (`src/contexts/SessionContext.tsx`, `LanguageContext.tsx`) — still wired into pages for session/queueing state.
- **Redux Toolkit** (`src/store/`) — `sessionSlice` (players, queueingPlayers) and `statsSlice` (phase, counter, gameLog) using `createSlice` with built-in `selectors`. Typed hooks live in `src/hooks/useAppDispatch.ts` and `src/hooks/useAppSelector.ts` (`useDispatch.withTypes` / `useSelector.withTypes` pattern — use these, not bare `useDispatch`/`useSelector`).
- ⚠️ Store is configured in `src/store/index.ts` but `<Provider store>` is **not yet** wrapping the app in `main.tsx`. Adding Redux usage to a component currently requires adding the Provider first. This is in-progress work — confirm with user before refactoring around it.

App-level `ISettings` state (player count, game mode) lives in `App.tsx` `useState` and is passed as props to `SetupPage`/`SettingsPage`. Notifications also flow via prop-drilled `handleNotification` from `App.tsx`.

### Game logic

- `src/utils/roleDistribution.ts` — single source of truth for role counts per `(playersAmount, gameMode)`. Game modes are stored as **Russian strings** (`"Классический"`, `"Расширенный"`); `normalizeGameMode` accepts the English `"Extended"` alias. Role names (`"Мирный житель"`, `"Шериф"`, `"Мафия"`, `"Дон"`, `"Доктор"`) are also Russian-keyed in code; localized display strings come from `titleKey` lookups in i18n. Don't rename role string values without updating randomizer/UI usage.
- `src/utils/rolesRandomizer.ts` — Fisher–Yates shuffle over the flattened distribution. Returns `{ mafiaPlayers, innocentPlayers, generatedArray }`.
- Mafia count rule: `floor(players/3)`; Don is always 1 of those; Sheriff always 1; Doctor only in Extended mode.

### i18n

`react-i18next` + `i18next-browser-languagedetector`. Resources in `src/locales/{en,ru}.json`. Fallback `en`, but `LanguageContext` defaults user to `ru` if no `localStorage` value. Language persisted to `localStorage["i18nextLng"]`.

### Testing

- Vitest config: `vitest.config.ts`, env `happy-dom`, globals enabled, setup `src/setupTests.ts` extends `expect` with `@testing-library/jest-dom` matchers and runs `cleanup()` after each test. Path alias `@` → `./src`.
- Co-located `__tests__/` folders next to source (e.g. `src/utils/__tests__`, `src/contexts/__tests__`). Top-level `src/__tests__/App.test.tsx`.
- Cypress base URL `http://localhost:5173`; specs in `cypress/e2e/`.

### Styling

SCSS, no CSS-in-JS. Globals: `reset.scss`, `settings.scss`, `media.scss` imported in `main.tsx`; `App.scss` and per-component `index.scss` files imported where used.

### Deploy

Vercel (`vercel.json`, `.github/workflows/deploy.yml`). Build artifact `dist/`.
