"use client";

import * as React from "react";
import { Field, NumberField, TextArea, Toggle } from "@/components/admin/FormFields";

type Initial = {
  nameDe: string;
  nameEn: string;
  subtitleDe: string;
  subtitleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  capacity: number;
  basePrice: number;
  areaSqm: number;
  position: number;
  active: boolean;
};

type Labels = {
  nameDe: string;
  nameEn: string;
  subtitleDe: string;
  subtitleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  capacity: string;
  basePrice: string;
  areaSqm: string;
  position: string;
  active: string;
  save: string;
  saving: string;
  saved: string;
};

export function RoomTypeForm({
  id,
  initial,
  labels,
}: {
  id: string;
  initial: Initial;
  labels: Labels;
}) {
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
      const res = await fetch(`/api/admin/room-types/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={labels.nameDe} value={state.nameDe} onChange={(v) => set("nameDe", v)} />
        <Field label={labels.nameEn} value={state.nameEn} onChange={(v) => set("nameEn", v)} />
        <Field label={labels.subtitleDe} value={state.subtitleDe} onChange={(v) => set("subtitleDe", v)} />
        <Field label={labels.subtitleEn} value={state.subtitleEn} onChange={(v) => set("subtitleEn", v)} />
      </div>

      <TextArea
        label={labels.descriptionDe}
        value={state.descriptionDe}
        onChange={(v) => set("descriptionDe", v)}
        rows={4}
      />
      <TextArea
        label={labels.descriptionEn}
        value={state.descriptionEn}
        onChange={(v) => set("descriptionEn", v)}
        rows={4}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <NumberField label={labels.capacity} value={state.capacity} onChange={(v) => set("capacity", v)} min={1} />
        <NumberField label={labels.basePrice} value={state.basePrice} onChange={(v) => set("basePrice", v)} min={0} />
        <NumberField label={labels.areaSqm} value={state.areaSqm} onChange={(v) => set("areaSqm", v)} min={0} />
        <NumberField label={labels.position} value={state.position} onChange={(v) => set("position", v)} min={0} />
      </div>

      <Toggle label={labels.active} checked={state.active} onChange={(v) => set("active", v)} />

      {error && <p className="text-seal text-sm">{error}</p>}

      <div className="flex items-center gap-4 pt-4 border-t border-ink-700/15">
        <button
          type="submit"
          disabled={pending}
          className="editorial-caps border border-ink-700 bg-ink-700 text-parchment-50 px-7 py-3 hover:bg-ink-800 disabled:opacity-50 transition-colors"
        >
          {pending ? labels.saving : labels.save}
        </button>
        {saved && <span className="text-sm italic text-forest-700">✓ {labels.saved}</span>}
      </div>
    </form>
  );
}
