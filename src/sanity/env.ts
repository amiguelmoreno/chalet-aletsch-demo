export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-12-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "production",
);

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";

/** True when the project is connected to a real Sanity dataset. */
export const sanityConfigured = projectId !== "placeholder";

function assertValue<T>(v: T | undefined, fallback: T): T {
  return v ?? fallback;
}
