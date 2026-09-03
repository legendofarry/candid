import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Notifications now live in a full-screen overlay with no URL of their own.
 * This route is kept only so older links keep working: it bounces to the feed
 * and opens the overlay.
 */
export const Route = createFileRoute("/notifications")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { notifications: "open" } as never });
  },
});
