import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Safe fetch — returns `[]` (or fallback) when Sanity isn't configured yet.
 * Use this everywhere instead of sanityClient.fetch directly so the build and
 * runtime are tolerant of missing project IDs during showcase development.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!sanityConfigured) return fallback;
  try {
    return (await sanityClient.fetch<T>(query, params)) ?? fallback;
  } catch (err) {
    console.warn("[sanity] fetch failed:", (err as Error).message);
    return fallback;
  }
}
