"use client";

import * as React from "react";

const STATUSES = [
  "pending_payment",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
] as const;

type Status = (typeof STATUSES)[number];

export function StatusEditor({ id, initial }: { id: string; initial: Status }) {
  const [status, setStatus] = React.useState<Status>(initial);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onChange = async (next: Status) => {
    setStatus(next);
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Update failed");
        setStatus(initial);
      }
    } catch {
      setError("Network error");
      setStatus(initial);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as Status)}
        className="editorial-caps border border-ink-700/40 hover:border-ink-700 bg-transparent px-4 py-2 text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      {pending && <span className="text-xs italic text-ink-500">…</span>}
      {error && <span className="text-xs text-seal">{error}</span>}
    </div>
  );
}
