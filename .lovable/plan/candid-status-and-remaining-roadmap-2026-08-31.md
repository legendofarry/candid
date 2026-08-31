# Candid — status and remaining roadmap

## Done so far (phases 1-3)

- Username-driven onboarding: unique username, live availability check, confirmed-available suggestions, animated two-step screen, optional social links, redirect straight after registration.
- Posts, comments and profiles show `@username` instead of "Anonymous".
- Account type detection (individual / company / unknown) with owner-override hooks.
- Verification badge: eligibility rules, full-screen animated claim popup (snoozable), fallback claim card on the profile.
- TikTok-style comment thread on the post detail screen: official company replies pinned to the top of the whole list (even a reply-of-a-reply floats its thread up), engagement ranking, collapsible nested replies, per-comment like, per-comment 3-dot menu.
- Reporting: modern multi-reason picker for posts and comments, one report per user per target, button greys out to "Reported" afterwards.

## What is left

### Phase 4 — Social graph and story following
Post likes, follow/unfollow accounts with followers/following counts shown only on the profile detail screen, follow-a-story with a "Followed stories" section in the profile, and an AI catch-up summary ("here's what happened since you last looked") presented as a clean minimal card.

### Phase 5 — Notifications overlay
Notifications become a full-screen overlay modal toggled from anywhere with no URL change. Deep-link notifications jump to the exact place needing action; informational ones open a full-screen modal with a close button. Mobile gets long-press options and swipe-left/right actions; desktop gets a 3-dot menu. Every action asks for confirmation. One-off system notices auto-expire from the database after a retention window.

### Phase 6 — Messaging and restrictions
Inbox and chat screens with reactions/emoji, attachments, read state, and typing affordances. Tapping the name or avatar at the top of a chat opens that profile. A seeded verified "Candid" owner account can message anyone. Privacy controls: who can message me, blocking, non-follower restrictions — with Candid messages always allowed.

### Phase 7 — Navigation restructure
Search leaves the bottom nav and lives in the feed header. Leaderboards and salaries move out of the bottom nav into contextual, discoverable places. Nested screens (company detail, story detail, chat, profile detail) hide the bottom nav and always show a back button. Footer appears only on the feed tab. Back navigation added to the safety/rights, guidelines, privacy and terms screens.

### Phase 8 — Filters and feed header
Minimal dropdown filters pinned at the top of the feed and the company directory, with inline search and a reset-filters control, styled so it reads as part of the feed rather than a separate panel.

### Phase 9 — Company intelligence
Rating a company only from its detail screen, gated behind a short tap-only questionnaire (no free typing) that saves rating plus reasons. "Me too", "% would work here" and red-flag breakdown become user-contributed and interactive wherever they appear. Company location prompt for company accounts (auto-pin or paste a map URL) and a full-screen map modal when a post's location tag is tapped; the tag is hidden when no company location exists.

### Phase 10 — Salaries directory
Company-first listing; opening a company reveals a paginated, sortable table broken down by position with average pay and contributor counts per position. Typical ranges only display once enough contributions exist. Contributing requires picking a company from the in-app list — no free-text company names.

### Phase 11 — Polish and account-type nudges
Candid Pulse redesigned with a clear stated purpose and live animated data. About screen with rich app info and an owner-updatable "how to reach us" block. Sign-out flow asks once whether to remember the session for next launch. Account-type escalation: if the app still cannot classify an account past the expected window, it prompts the user with questions or a support contact path.

## Technical notes

- All server work stays in `createServerFn` modules with Firestore access behind `*.server.ts` helpers, matching the existing `actions.functions.ts` / `firebase-data.server.ts` split.
- New collections: `follows`, `story_follows`, `story_likes`, `notifications`, `conversations`, `messages`, `message_reactions`, `privacy_settings`, `blocks`, `company_locations`, `company_rating_answers`.
- Notification expiry runs as a cleanup pass in the public owner API route plus a lazy sweep on read, avoiding a dedicated scheduler.
- AI story catch-up reuses `ai.server.ts` (OpenRouter) and degrades gracefully without a key.
- Nested-screen detection driven by a route-metadata map consumed by the shell, so the bottom nav and footer rules stay in one place.

Suggested order: 4 → 7 → 8 → 5 → 6 → 9 → 10 → 11, so navigation and feed feel right before the heavier messaging work lands.
