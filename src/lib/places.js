import { api } from '../api';

/** City + location names from the masters, loaded once per session. */
let cached;
export async function placeOptions() {
  if (cached) return cached;
  try {
    const [cities, locations] = await Promise.all([
      api.cities().catch(() => []),
      api.locations().catch(() => []),
    ]);
    cached = [...new Set([
      ...cities.map((c) => c.name),
      ...locations.map((l) => l.name),
    ].filter(Boolean))].sort();
  } catch {
    cached = [];
  }
  return cached;
}
