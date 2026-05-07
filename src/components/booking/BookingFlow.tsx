"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { StepIndicator } from "./StepIndicator";
import { StepDates } from "./StepDates";
import { StepRoom } from "./StepRoom";
import { StepExtras } from "./StepExtras";
import { StepDetails } from "./StepDetails";
import { StepReview } from "./StepReview";
import { initialState, reducer, type RoomOption } from "./types";

const KNOWN_ERRORS = new Set([
  "network",
  "invalid_dates",
  "too_many_guests",
  "min_stay",
  "room_unavailable",
  "missing_fields",
  "invalid_json",
  "service_unavailable",
  "generic",
]);

function translateError(t: (k: string) => string, code?: string) {
  const key = code && KNOWN_ERRORS.has(code) ? code : "generic";
  return t(`errors.${key}`);
}

export function BookingFlow() {
  const t = useTranslations("booking");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [state, dispatch] = React.useReducer(reducer, initialState, (s) => ({
    ...s,
    checkIn: searchParams.get("from") ?? "",
    checkOut: searchParams.get("to") ?? "",
    adults: parseInt(searchParams.get("adults") ?? "2", 10),
    children: parseInt(searchParams.get("children") ?? "0", 10),
    selectedRoomSlug: searchParams.get("room"),
  }));

  const checkAvailability = React.useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          guests: state.adults + state.children,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: "SET_ERROR", error: data.hint ?? translateError(t, data.error) });
        return;
      }
      const rooms = data.rooms as RoomOption[];
      dispatch({ type: "SET_ROOMS", rooms });
      // If the user arrived from a per-room reserve button (?room=slug),
      // and that room is in the available list, skip the room-picker step
      // and jump straight to extras.
      const pre = state.selectedRoomSlug;
      const preIsAvailable = pre && rooms.some((r) => r.slug === pre);
      dispatch({ type: "SET_STEP", step: preIsAvailable ? "extras" : "room" });
    } catch {
      dispatch({ type: "SET_ERROR", error: t("errors.network") });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, [state.checkIn, state.checkOut, state.adults, state.children, t]);

  const submitBooking = React.useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          adults: state.adults,
          children: state.children,
          roomTypeSlug: state.selectedRoomSlug,
          guestEmail: state.details.email,
          guestName: state.details.name,
          phone: state.details.phone,
          notes: state.details.notes,
          locale,
          marketingConsent: state.marketingConsent,
          extras: Object.entries(state.extras)
            .filter(([, q]) => q > 0)
            .map(([slug, quantity]) => ({ slug, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.reference) {
        dispatch({ type: "SET_ERROR", error: data.hint ?? translateError(t, data.error) });
        return;
      }

      // Try to start a Stripe Checkout Session; fall back to the confirm page
      // if Stripe is not configured.
      const checkout = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reference: data.reference }),
      });
      if (checkout.ok) {
        const { url } = await checkout.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }
      router.push(`/booking/${data.reference}/confirm` as never);
    } catch {
      dispatch({ type: "SET_ERROR", error: t("errors.network") });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, [state, locale, router, t]);

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="mb-12">
          <StepIndicator current={state.step} />
        </div>

        <OrnamentRule className="mb-16 max-w-4xl mx-auto" />

        {state.step === "dates" && (
          <StepDates state={state} dispatch={dispatch} onContinue={checkAvailability} />
        )}
        {state.step === "room" && (
          <StepRoom
            state={state}
            dispatch={dispatch}
            onContinue={() => dispatch({ type: "SET_STEP", step: "extras" })}
            onBack={() => dispatch({ type: "SET_STEP", step: "dates" })}
          />
        )}
        {state.step === "extras" && (
          <StepExtras
            state={state}
            dispatch={dispatch}
            onContinue={() => dispatch({ type: "SET_STEP", step: "details" })}
            onBack={() => dispatch({ type: "SET_STEP", step: "room" })}
          />
        )}
        {state.step === "details" && (
          <StepDetails
            state={state}
            dispatch={dispatch}
            onContinue={() => dispatch({ type: "SET_STEP", step: "review" })}
            onBack={() => dispatch({ type: "SET_STEP", step: "extras" })}
          />
        )}
        {state.step === "review" && (
          <StepReview
            state={state}
            dispatch={dispatch}
            onSubmit={submitBooking}
            onBack={() => dispatch({ type: "SET_STEP", step: "details" })}
          />
        )}

        {state.error && state.step === "dates" && (
          <p className="mt-8 text-center text-seal max-w-xl mx-auto">{state.error}</p>
        )}
      </Container>
    </section>
  );
}
