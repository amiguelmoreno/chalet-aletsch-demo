"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";

export function ReviewModerationRow({
  id,
  authorName,
  rating,
  body,
  approved,
  createdAt,
  bookingReference,
  locale,
}: {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  approved: boolean;
  createdAt: string;
  bookingReference: string | null;
  locale: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [state, setState] = React.useState<"idle" | "approved" | "removed">(
    approved ? "approved" : "idle",
  );

  const setApproved = async (next: boolean) => {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ approved: next }),
      });
      if (res.ok) {
        setState(next ? "approved" : "idle");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this review permanently?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setState("removed");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  if (state === "removed") return null;

  return (
    <li className="border-b border-ink-700/15 py-7 px-2 grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-2">
        <p className="editorial-caps text-forest-700">{authorName}</p>
        <p className="text-xs italic text-ink-500 mt-1">
          {new Date(createdAt).toLocaleDateString(locale)}
        </p>
        {bookingReference && (
          <p className="text-xs font-display text-forest-700/70 mt-1">{bookingReference}</p>
        )}
        <div className="flex gap-0.5 mt-2 text-forest-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} />
          ))}
        </div>
      </div>
      <div className="col-span-12 md:col-span-7">
        <p className="text-ink-700 leading-relaxed italic">"{body}"</p>
      </div>
      <div className="col-span-12 md:col-span-3 flex flex-col gap-2 items-end">
        <span
          className={`editorial-caps text-xs px-2 py-0.5 border ${
            state === "approved"
              ? "text-forest-700 border-forest-700/40"
              : "text-seal border-seal/40"
          }`}
        >
          {state === "approved" ? "approved" : "pending"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setApproved(state !== "approved")}
            disabled={pending}
            className="editorial-caps text-xs border border-ink-700/40 hover:border-ink-700 px-3 py-1 disabled:opacity-50"
          >
            {state === "approved" ? "Unapprove" : "Approve"}
          </button>
          <button
            onClick={remove}
            disabled={pending}
            className="editorial-caps text-xs border border-seal/40 text-seal hover:border-seal hover:bg-seal hover:text-parchment-50 px-3 py-1 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M 8 1 L 9.8 5.8 L 15 6.2 L 11 9.6 L 12.4 14.6 L 8 12 L 3.6 14.6 L 5 9.6 L 1 6.2 L 6.2 5.8 Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
