import {
  neededCards,
  offeredCards,
  type ExchangeProfile,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { type ArcanaId } from '@/lib/site-i18n';
import { type ServerRegion } from '@/lib/server-region';

export type MatchResult = {
  give: ArcanaId[];
  receive: ArcanaId[];
  exact: boolean;
};

type MatchableProfile = {
  server: ServerRegion;
  inventory: InventoryCounts;
};

export function filterCompatibleServer<T extends { server: ServerRegion }>(
  currentServer: ServerRegion | '',
  candidates: T[],
) {
  if (!currentServer) return [];
  return candidates.filter((candidate) => candidate.server === currentServer);
}

export function evaluateMatch(
  currentUser: MatchableProfile,
  candidate: MatchableProfile,
): MatchResult | null {
  if (currentUser.server !== candidate.server) return null;
  const currentNeeds = new Set(neededCards(currentUser.inventory));
  const currentOffers = new Set(offeredCards(currentUser.inventory));
  const candidateNeeds = new Set(neededCards(candidate.inventory));
  const candidateOffers = new Set(offeredCards(candidate.inventory));
  const give = [...currentOffers].filter((card) => candidateNeeds.has(card));
  const receive = [...currentNeeds].filter((card) => candidateOffers.has(card));
  if (!give.length && !receive.length) return null;
  return { give, receive, exact: give.length > 0 && receive.length > 0 };
}

export function isExactMatch(
  currentUser: MatchableProfile,
  candidate: MatchableProfile,
) {
  return evaluateMatch(currentUser, candidate)?.exact === true;
}

export function compatibleProfiles(
  currentUser: MatchableProfile,
  candidates: ExchangeProfile[],
) {
  return filterCompatibleServer(currentUser.server, candidates).filter(
    (candidate) => evaluateMatch(currentUser, candidate),
  );
}
