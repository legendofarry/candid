# Phase 5 — Notifications as a toggle-able full-screen overlay

Notifications stop being a page. The bell becomes a toggle that opens a full-screen
overlay on top of whatever screen the user is on, with no URL change (no
`/notifications` in the address bar).

## The toggle question

Recommendation: never disable the bell. Disabled controls feel broken, and the user
must always be able to escape the overlay.

Behaviour:
- Overlay closed -> bell opens it on the main list.
- Overlay open on the main list -> bell closes it.
- Overlay open on a nested view (a notification's detail sheet, the per-notification
  action menu, a confirm dialog) -> bell first steps back to the main list, and a
  second press closes. The bell gets a subtle "back" affordance in that state so the
  two-step is obvious.
- Escape key and the overlay's own back arrow follow the same one-step-back rule;
  the Android/browser back gesture closes the nested view before the overlay.

This gives exactly the safety of "you must be on the main view to toggle it off"
without ever locking the button.

## What the overlay contains

- Full-screen, glass-panel, spring-animated entry (slide-up on mobile, fade+scale on
  desktop), body scroll locked, focus trapped.
- Header: title, unread count, "Mark all read", overflow menu, close/back.
- Grouped list: Today / Earlier, unread accent, kind icons, time ago.
- Empty and loading states.

## Interactions

- Click a notification:
  - actionable (reply, mention, follow, message, badge claim) -> closes the overlay and
    routes to the target screen;
  - informational -> opens a nested full-screen detail card with a close control, no
    route change.
- Mobile: long-press opens an action sheet; every row also has a three-dot menu;
  swipe left = delete, swipe right = mark read/unread, both with a confirm step.
- Desktop: hover reveals the three-dot menu with the same actions; no swipe.
- Every destructive or state-changing action confirms before executing.

## Auto-expiring system notices

Notifications tagged `system` and one-time get an `expiresAt` stamp when first read
(read time + 7 days). A sweep on overlay open and on app start drops expired ones from
local storage; the same rule is applied server-side when notifications move to
Firestore, so storage does not grow forever.

## Technical notes

- New `src/components/site/notifications-overlay.tsx` rendered once in `SiteShell`,
  driven by overlay state in `src/lib/notifications-store.ts`
  (`openNotifications`, `closeNotifications`, `toggleNotifications`, `useNotificationsOpen`,
  plus a `view` field: `list` | `detail:<id>`).
- Store gains: `type` (`system` | `social` | `action`), optional `link` (route + params)
  and `expiresAt`; `pruneExpired()` runs in `hydrate()` and on overlay open.
- The bell in the shell header switches from `<Link to="/notifications">` to a button
  bound to the toggle, keeping the unread badge.
- `src/routes/notifications.tsx` is removed and `/notifications` redirects to `/` with
  the overlay opened, so old links keep working.
- Animations via `motion` (already installed); rows use `AnimatePresence` for
  enter/exit; swipe via drag constraints on mobile widths only.
- Restrictions/messaging notifications reuse the same `link` shape, so Phase 6
  (messaging) can push them without further store changes.
