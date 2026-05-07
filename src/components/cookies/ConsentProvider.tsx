"use client";

import * as React from "react";
import {
  ConsentState,
  DEFAULT_CONSENT,
  loadConsent,
  saveConsent,
  clearConsent,
} from "@/lib/cookies";

type Ctx = {
  consent: ConsentState;
  hasDecided: boolean;
  banner: { open: boolean; setOpen: (v: boolean) => void };
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  saveCustom: (next: Pick<ConsentState, "analytics" | "marketing">) => void;
  reopen: () => void;
  reset: () => void;
};

const ConsentContext = React.createContext<Ctx | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<ConsentState>(DEFAULT_CONSENT);
  const [hasDecided, setHasDecided] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Hydrate from storage once on mount.
  React.useEffect(() => {
    const loaded = loadConsent();
    if (loaded?.decidedAt) {
      setConsent(loaded);
      setHasDecided(true);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const persist = React.useCallback((next: ConsentState) => {
    saveConsent(next);
    setConsent(next);
    setHasDecided(true);
    setOpen(false);
  }, []);

  const acceptAll = React.useCallback(() => {
    persist({ necessary: true, analytics: true, marketing: true, decidedAt: Date.now() });
  }, [persist]);

  const acceptNecessaryOnly = React.useCallback(() => {
    persist({ necessary: true, analytics: false, marketing: false, decidedAt: Date.now() });
  }, [persist]);

  const saveCustom = React.useCallback(
    (next: Pick<ConsentState, "analytics" | "marketing">) => {
      persist({
        necessary: true,
        analytics: !!next.analytics,
        marketing: !!next.marketing,
        decidedAt: Date.now(),
      });
    },
    [persist],
  );

  const reopen = React.useCallback(() => setOpen(true), []);
  const reset = React.useCallback(() => {
    clearConsent();
    setConsent(DEFAULT_CONSENT);
    setHasDecided(false);
    setOpen(true);
  }, []);

  const value: Ctx = {
    consent,
    hasDecided,
    banner: { open, setOpen },
    acceptAll,
    acceptNecessaryOnly,
    saveCustom,
    reopen,
    reset,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = React.useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider");
  return ctx;
}
