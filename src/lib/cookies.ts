export type CookieCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
  /** Epoch ms when the choice was made. */
  decidedAt?: number;
};

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const STORAGE_KEY = "chalet:consent";
const COOKIE_KEY = "chalet_consent";

export function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function saveConsent(consent: ConsentState) {
  if (typeof window === "undefined") return;
  const payload: ConsentState = {
    ...consent,
    necessary: true,
    decidedAt: consent.decidedAt ?? Date.now(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  // Mirror to a 1st-party cookie so SSR can read it on next request if needed.
  // 6 months retention.
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(
    `${payload.analytics ? "a" : ""}${payload.marketing ? "m" : ""}` || "n",
  )}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}
