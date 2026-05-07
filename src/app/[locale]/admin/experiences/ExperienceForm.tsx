"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import {
  Field,
  NumberField,
  TextArea,
  Toggle,
  SelectField,
} from "@/components/admin/FormFields";

type Initial = {
  slug: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  descriptionEn: string;
  unitPrice: number;
  unit: string;
  active: boolean;
};

type Labels = {
  slug: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  descriptionEn: string;
  unitPrice: string;
  unit: string;
  active: string;
  units: { person: string; day: string; piece: string; hour: string };
  save: string;
  saving: string;
  saved: string;
  delete: string;
  deleting: string;
  confirmDelete: string;
};

export function ExperienceForm({
  id,
  propertyId,
  initial,
  labels,
}: {
  id: string | null;
  propertyId?: string;
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
      const url = id ? `/api/admin/experiences/${id}` : "/api/admin/experiences";
      const method = id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...state,
          propertyId,
          descriptionDe: state.descriptionDe || null,
          descriptionEn: state.descriptionEn || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed");
        return;
      }
      const data = await res.json();
      if (!id && data.id) {
        router.push(`/admin/experiences/${data.id}` as never);
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
      const res = await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/experiences");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <Field label={labels.slug} value={state.slug} onChange={(v) => set("slug", v)} required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={labels.nameDe} value={state.nameDe} onChange={(v) => set("nameDe", v)} required />
        <Field label={labels.nameEn} value={state.nameEn} onChange={(v) => set("nameEn", v)} required />
      </div>

      <TextArea label={labels.descriptionDe} value={state.descriptionDe} onChange={(v) => set("descriptionDe", v)} rows={3} />
      <TextArea label={labels.descriptionEn} value={state.descriptionEn} onChange={(v) => set("descriptionEn", v)} rows={3} />

      <div className="grid grid-cols-2 gap-6">
        <NumberField label={labels.unitPrice} value={state.unitPrice} onChange={(v) => set("unitPrice", v)} step={1} min={0} />
        <SelectField
          label={labels.unit}
          value={state.unit}
          onChange={(v) => set("unit", v)}
          options={[
            { value: "person", label: labels.units.person },
            { value: "day", label: labels.units.day },
            { value: "piece", label: labels.units.piece },
            { value: "hour", label: labels.units.hour },
          ]}
        />
      </div>

      <Toggle label={labels.active} checked={state.active} onChange={(v) => set("active", v)} />

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
