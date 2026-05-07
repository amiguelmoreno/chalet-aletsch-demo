"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="editorial-caps border border-ink-700/40 px-7 py-3 text-ink-700 hover:border-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
    >
      {label}
    </button>
  );
}
