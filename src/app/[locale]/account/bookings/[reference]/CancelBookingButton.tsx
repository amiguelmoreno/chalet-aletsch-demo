"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";

export function CancelBookingButton({
  reference,
  label,
}: {
  reference: string;
  label: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const onClick = async () => {
    if (!confirm("Möchten Sie diese Reservation wirklich stornieren?")) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/bookings/${reference}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Stornierung fehlgeschlagen");
        return;
      }
      router.refresh();
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={pending}
        className="editorial-caps border border-seal/60 text-seal px-7 py-3 hover:bg-seal hover:text-parchment-50 disabled:opacity-50 transition-colors"
      >
        {pending ? "…" : label}
      </button>
      {error && <p className="text-xs text-seal">{error}</p>}
    </div>
  );
}
