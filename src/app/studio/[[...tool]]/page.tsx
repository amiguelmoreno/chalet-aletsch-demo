/**
 * Embedded Sanity Studio at /studio.
 * Outside the [locale] segment so it doesn't compete with i18n.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
