# Import kenya-connect-clone into this Lovable project

## What the repo is
`github.com/legendofarry/kenya-connect-clone` is a TanStack Start app (same framework as this project) — a Kenyan community/content platform with:

- **Routes**: home feed, stories (`stories.$id`), companies (`companies.$slug`, index), salaries, leaderboards, search, notifications, post, profile, auth, about/guidelines/privacy/rights
- **UI**: full shadcn component set + custom site components (site shell, splash screen, story cards, biometric gate, notification banners)
- **Backend integrations**: Firebase auth + Firestore (`src/integrations/firebase/*`, `src/lib/firebase.server.ts`), an AI gateway (`src/lib/ai.server.ts`), and an owner API (`src/lib/owner-api.server.ts`)
- **Config**: netlify.toml, bunfig.toml, components.json

## Safest import approach (no data loss)

1. **Snapshot first** — Lovable already versions every change, so the current empty template stays recoverable via version history. Nothing to lose.
2. **Copy the code in wholesale** (same stack, so no rewrite):
   - `src/` → routes, components, hooks, lib, integrations, styles
   - `public/` assets
   - Keep Lovable template's `src/router.tsx` / Vite config where the repo's differ, merging rather than blindly overwriting (template has platform-specific wiring)
3. **Reconcile configs**: merge `package.json` dependencies (install missing ones), tsconfig, components.json, styles. Drop `netlify.toml` (Lovable hosts it).
4. **Environment variables**: the repo uses Firebase + other server keys. I'll list every required env var found in code and have you add them via Lovable's secrets manager (never committed to code).
5. **Build & verify**: fix any import/type errors, run the dev server, click through key routes (home, stories, companies, auth) with the browser tool to confirm screens render.
6. **GitHub sync (optional, after it works)**: connect GitHub from the editor to push this project to a repo you choose — sync is Lovable → GitHub, so future work here stays backed up.

## Notes / decisions
- **Firebase stays as-is** for now (keys via secrets) — migrating auth/DB to Lovable Cloud would be a separate, larger task. Say the word if you'd rather migrate.
- Any secret values currently hardcoded in the repo will be moved to env vars before this project is ever made public/remixable.

## Outcome
The full app from the repo running in this Lovable project, editable here going forward, with the original repo untouched.
