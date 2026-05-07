"use client";

import dynamic from "next/dynamic";

const ContactMap = dynamic(
  () => import("./ContactMap").then((m) => m.ContactMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] bg-parchment-100/50 border border-ink-700/15 flex items-center justify-center text-ink-500 italic text-sm">
        …
      </div>
    ),
  },
);

export function ContactMapWrapper(props: {
  labels: {
    popupTitle: string;
    popupAddress: string;
    popupHint: string;
    directionsLabel: string;
  };
}) {
  return <ContactMap {...props} />;
}

