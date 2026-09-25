import { arcanaIds, type ArcanaId, type SiteLocale } from '@/lib/site-i18n';
import { type ExchangeStatus } from '@/lib/v2-i18n';
import { type ServerRegion } from '@/lib/server-region';

export type CardCount = 0 | 1 | 2 | 3;
export type InventoryCounts = Record<ArcanaId, CardCount>;

export type ExchangeProfile = {
  publicId: string;
  displayName: string;
  uid: string;
  server: ServerRegion;
  note: string;
  status: ExchangeStatus;
  locale: SiteLocale;
  inventory: InventoryCounts;
  updatedAt: string;
  sample?: boolean;
};

export const defaultInventory = Object.fromEntries(
  arcanaIds.map((card) => [card, 0]),
) as InventoryCounts;

export function inventoryFromQuickSelection(
  missingCards: Iterable<ArcanaId>,
  duplicateCards: Iterable<ArcanaId>,
): InventoryCounts {
  const missing = new Set(missingCards);
  const duplicates = new Set(duplicateCards);
  return Object.fromEntries(
    arcanaIds.map((card) => [
      card,
      missing.has(card) ? 0 : duplicates.has(card) ? 2 : 1,
    ]),
  ) as InventoryCounts;
}

export function normalizeInventory(value: unknown): InventoryCounts | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const normalized = {} as InventoryCounts;
  for (const card of arcanaIds) {
    const count = record[card];
    if (!Number.isInteger(count) || Number(count) < 0 || Number(count) > 3) {
      return null;
    }
    normalized[card] = Number(count) as CardCount;
  }
  return normalized;
}

export function neededCards(inventory: InventoryCounts) {
  return arcanaIds.filter((card) => inventory[card] === 0);
}

export function offeredCards(inventory: InventoryCounts) {
  return arcanaIds.filter((card) => inventory[card] >= 2);
}

export function collectedTypeCount(inventory: InventoryCounts) {
  return arcanaIds.filter((card) => inventory[card] > 0).length;
}
