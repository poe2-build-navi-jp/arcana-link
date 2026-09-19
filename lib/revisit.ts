const day = 86_400_000;

export type ListingTiming = 'active' | 'expires-soon' | 'expired';

export function getListingTiming(
  updatedAt: string,
  now: number,
): ListingTiming {
  const age = now - Date.parse(updatedAt);
  if (!Number.isFinite(age) || age < 6 * day) return 'active';
  return age < 7 * day ? 'expires-soon' : 'expired';
}

export function countNewExactMatches(
  matches: Array<{ exact: boolean; updatedAt: string }>,
  previousVisit: string,
) {
  const previous = Date.parse(previousVisit);
  if (!Number.isFinite(previous)) return 0;
  return matches.filter(
    (match) => match.exact && Date.parse(match.updatedAt) > previous,
  ).length;
}
