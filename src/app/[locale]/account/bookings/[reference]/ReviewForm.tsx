"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

type Labels = {
  heading: string;
  intro: string;
  ratingLabel: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  submit: string;
  submitting: string;
  thanks: string;
  thanksBody: string;
};

export function ReviewForm({
  reference,
  labels,
  alreadySubmitted,
}: {
  reference: string;
  labels: Labels;
  alreadySubmitted: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [rating, setRating] = React.useState(5);
  const [body, setBody] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(alreadySubmitted);
  const [error, setError] = React.useState<string | null>(null);

  if (done) {
    return (
      <div className="border border-forest-700/30 bg-forest-700/5 p-6 text-center">
        <p className="font-display italic text-xl text-ink-700">{labels.thanks}</p>
        <p className="mt-2 text-sm text-ink-600">{labels.thanksBody}</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 10) {
      setError("min 10");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference, rating, body: body.trim(), locale }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.hint ?? data.error ?? "Failed");
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="border border-ink-700/15 p-8 space-y-6">
      <div>
        <p className="editorial-caps text-forest-700">{labels.heading}</p>
        <p className="mt-3 text-ink-600 leading-relaxed">{labels.intro}</p>
      </div>

      <div>
        <span className="editorial-caps text-forest-700 mb-2 block">{labels.ratingLabel}</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n}`}
              onClick={() => setRating(n)}
              className={`w-9 h-9 flex items-center justify-center transition-colors ${
                n <= rating ? "text-forest-700" : "text-ink-700/20"
              }`}
            >
              <Star />
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="editorial-caps text-forest-700 mb-2 block">{labels.bodyLabel}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder={labels.bodyPlaceholder}
          minLength={10}
          maxLength={1500}
          className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700 resize-none placeholder:text-ink-400"
        />
      </label>

      {error && <p className="text-sm text-seal">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="editorial-caps border border-ink-700 bg-ink-700 text-parchment-50 px-7 py-3 hover:bg-ink-800 disabled:opacity-50 transition-colors"
        >
          {pending ? labels.submitting : labels.submit}
        </button>
      </div>
    </form>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden>
      <path
        d="M 8 1 L 9.8 5.8 L 15 6.2 L 11 9.6 L 12.4 14.6 L 8 12 L 3.6 14.6 L 5 9.6 L 1 6.2 L 6.2 5.8 Z"
        fill="currentColor"
      />
    </svg>
  );
}
