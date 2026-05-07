"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

export function SignInActions({
  googleEnabled,
  emailEnabled,
}: {
  googleEnabled: boolean;
  emailEnabled: boolean;
}) {
  const t = useTranslations("signIn");
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState<null | "google" | "email">(null);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending("email");
    await signIn("resend", { email, callbackUrl: "/de/account" });
    setPending(null);
  };

  const handleGoogle = async () => {
    setPending("google");
    await signIn("google", { callbackUrl: "/de/account" });
    setPending(null);
  };

  return (
    <div className="space-y-8">
      {googleEnabled && (
        <button
          onClick={handleGoogle}
          disabled={pending !== null}
          className="w-full editorial-caps border border-ink-700 px-6 py-3.5 bg-ink-700 text-parchment-50 hover:bg-ink-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-3"
        >
          <GoogleMark />
          {pending === "google" ? t("loading") : t("withGoogle")}
        </button>
      )}

      {googleEnabled && emailEnabled && (
        <div className="flex items-center gap-4 text-forest-700/60">
          <span className="flex-1 h-px bg-current opacity-40" />
          <span className="editorial-caps text-xs">{t("or")}</span>
          <span className="flex-1 h-px bg-current opacity-40" />
        </div>
      )}

      {emailEnabled && (
        <form onSubmit={handleEmail} className="space-y-5">
          <label className="block">
            <span className="editorial-caps text-forest-700 mb-2 block">
              {t("emailLabel")}
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anna@example.ch"
              className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700 placeholder:text-ink-400"
            />
          </label>
          <button
            type="submit"
            disabled={pending !== null}
            className="w-full editorial-caps border border-ink-700 px-6 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 disabled:opacity-60 transition-colors"
          >
            {pending === "email" ? t("loading") : t("withEmail")}
          </button>
        </form>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden>
      <path
        fill="#fff"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.61z"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.47-.81 5.95-2.18l-2.9-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.97v2.32A9 9 0 0 0 9 18z"
        opacity=".75"
      />
      <path
        fill="#fff"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.16.29-1.71V4.97H.97A9 9 0 0 0 0 9c0 1.45.35 2.82.97 4.03l3-2.32z"
        opacity=".55"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57A9 9 0 0 0 9 0 9 9 0 0 0 .97 4.97l3 2.32C4.68 5.16 6.66 3.58 9 3.58z"
        opacity=".4"
      />
    </svg>
  );
}
