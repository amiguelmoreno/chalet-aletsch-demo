"use client";

import * as React from "react";

export function PayDepositButton({ reference, label }: { reference: string; label: string }) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onClick = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.hint ?? data.error ?? "Etwas ist schiefgegangen.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Etwas ist schiefgegangen.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <button
        onClick={onClick}
        disabled={pending}
        className="editorial-caps border border-ink-700 bg-ink-700 text-parchment-50 px-10 py-4 hover:bg-ink-800 disabled:opacity-50 transition-colors"
      >
        {pending ? "…" : label}
      </button>
      {error && <p className="mt-4 text-seal text-sm">{error}</p>}
    </div>
  );
}
