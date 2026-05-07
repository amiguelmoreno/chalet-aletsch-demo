"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import { Field, NumberField, DateField, TextArea } from "@/components/admin/FormFields";

type Initial = {
  name: string;
  dateFrom: string;
  dateTo: string;
  multiplier: number;
  flatAdjust: number;
  minStay: number;
  priority: number;
  notes: string;
};

type Labels = {
  name: string;
  dateFrom: string;
  dateTo: string;
  multiplier: string;
  flatAdjust: string;
  minStay: string;
  priority: string;
  notes: string;
  save: string;
  saving: string;
  saved: string;
  delete: string;
  deleting: string;
  confirmDelete: string;
};

export function PricingRuleForm({
  id,
  initial,
  labels,
}: {
  id: string | null;
  initial: Initial;
  labels: Labels;
}) {
  const router = useRouter();
  const [state, setState] = React.useState<Initial>(initial);
  const [pending, setPending] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const set = <K extends keyof Initial>(k: K, v: Initial[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const url = id ? `/api/admin/pricing-rules/${id}` : "/api/admin/pricing-rules";
      const method = id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...state,
          flatAdjust: state.flatAdjust || null,
          minStay: state.minStay || null,
          notes: state.notes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed");
        return;
      }
      const data = await res.json();
      if (!id && data.id) {
        router.push(`/admin/pricing/${data.id}` as never);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!confirm(labels.confirmDelete)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/pricing-rules/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/pricing");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <Field label={labels.name} value={state.name} onChange={(v) => set("name", v)} required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateField label={labels.dateFrom} value={state.dateFrom} onChange={(v) => set("dateFrom", v)} />
        <DateField label={labels.dateTo} value={state.dateTo} onChange={(v) => set("dateTo", v)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <NumberField label={labels.multiplier} value={state.multiplier} onChange={(v) => set("multiplier", v)} step={0.05} min={0} />
        <NumberField label={labels.flatAdjust} value={state.flatAdjust} onChange={(v) => set("flatAdjust", v)} step={1} />
        <NumberField label={labels.minStay} value={state.minStay} onChange={(v) => set("minStay", v)} min={0} />
        <NumberField label={labels.priority} value={state.priority} onChange={(v) => set("priority", v)} min={0} />
      </div>

      <TextArea label={labels.notes} value={state.notes} onChange={(v) => set("notes", v)} rows={3} />

      {error && <p className="text-seal text-sm">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-ink-700/15">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="editorial-caps border border-ink-700 bg-ink-700 text-parchment-50 px-7 py-3 hover:bg-ink-800 disabled:opacity-50 transition-colors"
          >
            {pending ? labels.saving : labels.save}
          </button>
          {saved && <span className="text-sm italic text-forest-700">✓ {labels.saved}</span>}
        </div>
        {id && (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="editorial-caps text-seal border border-seal/40 hover:border-seal hover:bg-seal hover:text-parchment-50 px-5 py-2.5 disabled:opacity-50 transition-colors"
          >
            {pending ? labels.deleting : labels.delete}
          </button>
        )}
      </div>
    </form>
  );
}
