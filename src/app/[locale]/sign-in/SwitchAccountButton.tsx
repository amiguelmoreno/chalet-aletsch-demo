"use client";

import { signOut } from "next-auth/react";

/**
 * Click → terminate the current session (server-side delete + cookie clear)
 * and reload the sign-in page so the user lands on a fresh form. Used when
 * a guest is already signed in but wants to switch to a different account.
 */
export function SwitchAccountButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({ callbackUrl: typeof window !== "undefined" ? window.location.pathname : "/" })
      }
      className="editorial-caps text-forest-700 underline decoration-forest-700/40 underline-offset-4 hover:text-seal hover:decoration-seal/60 transition-colors"
    >
      {label} →
    </button>
  );
}
