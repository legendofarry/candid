# Notification hygiene — stop the inbox filling with noise

I agree with you completely. Right now every single toast in the app is also saved
into the notifications inbox — 39 call sites, including things like "Fetching the
latest content", "Local cache cleared", "Comment posted anonymously", "Report sent
to moderators" and raw errors such as "Firebase: Error (auth/unauthorized-domain)".
Those are feedback for an action the user just performed; they have zero value five
seconds later. The inbox should only hold things the user would be sad to miss.

## The rule

Two separate channels:

- **Toast (transient only)** — confirmations and errors for an action the user just
  took. Shows for a few seconds, never stored, never counts toward the unread badge.
- **Inbox (persistent)** — things that happened while the user was not looking, or
  that need an action later. These are the only items that persist and badge.

Inbox-worthy in Candid:
- Someone replied to your story or comment, or mentioned you
- A new follower, or a story you follow got activity
- Your badge claim / verification outcome, account-type requests
- Moderation outcomes on your content (removed, restored, report resolved)
- Messages from other users and from Candid (Phase 6)
- Rare real account/security notices (new sign-in, unlock enabled)

Never inbox-worthy: "Comment posted", "Report sent", "Fetching latest content",
"Cache cleared", "Welcome back", form validation errors, network/SDK errors.

## Changes

1. `notify.*` becomes toast-only by default (`persist: false`), so all 39 existing
   call sites instantly stop polluting the inbox. No behaviour change on screen.
2. A separate `inbox.*` API (`pushInboxNotification`) for the durable kinds listed
   above, with `category` and an optional deep `link`. Only these badge the bell.
3. Existing call sites reviewed one by one; the handful that are genuinely durable
   (badge claimed / rejected, biometric unlock enabled, story submitted for
   moderator review) get moved to `inbox.*`. Everything else stays toast-only.
4. Never store raw SDK/error strings in the inbox — errors stay toasts; the inbox
   only gets human-written moderation/account outcomes.
5. Caps and hygiene: inbox capped at 60 (already), plus a per-key de-dupe so the
   same event within 60s does not stack, and the existing 7-day TTL sweep for
   read one-time system notices stays.
6. A one-time migration on hydrate clears any legacy stored toast items so existing
   users open a clean inbox instead of 22 "Report sent to moderators" rows.

## Also worth adding (small)

- Empty-state copy in the overlay that reads as intentional ("You're all caught up")
  rather than a bug.
- Group headers stay Today / Earlier; unread accent unchanged.

## Technical notes

- `src/lib/notifications-store.ts`: flip `pushNotification` default to non-persistent,
  export `pushInboxNotification` + `inbox` helper mirroring `notify`, add
  `dedupeKey` handling and a `candid.notifications.v2` storage key so the v1 blob is
  dropped once.
- Call-site edits are one-line swaps (`toast.` -> `inbox.`) in `profile.tsx`,
  `post.tsx`, `badge-claim-modal.tsx`.
- No change to the overlay UI, the bell toggle, or Phase 6 messaging plans —
  messaging will push through `inbox.*` with a `link` to the chat screen.
