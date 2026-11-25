import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Recherche tolerante aux accents/casse, portee de ui.js (IvoireUI.normalizeString + searchPlaces) */
export function normalizeString(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .trim();
}

import type { Place } from "./types";

export function searchPlaces(places: Place[], query: string): Place[] {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = normalizeString(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return places
    .filter((place) => {
      const fullSearchPool = [place.name, place.commune, place.categoryName || "", place.landmark || "", ...(place.aliases || [])]
        .map((s) => normalizeString(s))
        .join(" ");
      return queryTokens.every((token) => fullSearchPool.includes(token));
    })
    .slice(0, 7);
}
