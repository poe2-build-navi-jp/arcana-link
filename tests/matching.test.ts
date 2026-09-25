import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateMatch,
  filterCompatibleServer,
  isExactMatch,
} from '../lib/matching';
import { arcanaIds, type ArcanaId, type SiteLocale } from '../lib/site-i18n';
import {
  inventoryFromQuickSelection,
  type InventoryCounts,
  type ExchangeProfile,
} from '../lib/arcana-profile';
import { type ServerRegion } from '../lib/server-region';

function inventory(want: ArcanaId, offer: ArcanaId) {
  const result = Object.fromEntries(
    arcanaIds.map((card) => [card, 1]),
  ) as InventoryCounts;
  result[want] = 0;
  result[offer] = 2;
  return result;
}

function profile(
  server: ServerRegion,
  locale: SiteLocale,
  want: ArcanaId,
  offer: ArcanaId,
  publicId: string,
): ExchangeProfile {
  return {
    publicId,
    displayName: publicId,
    uid: '800123456',
    server,
    note: '',
    status: 'open',
    locale,
    inventory: inventory(want, offer),
    updatedAt: new Date(0).toISOString(),
  };
}

test('same-server reciprocal cards are an exact match', () => {
  const userA = profile('asia', 'ja', '太陽', '月', 'a');
  const userB = profile('asia', 'en', '月', '太陽', 'b');
  assert.equal(isExactMatch(userA, userB), true);
});

test('different servers never produce a match', () => {
  const userA = profile('asia', 'ja', '太陽', '月', 'a');
  const userB = profile('america', 'en', '月', '太陽', 'b');
  assert.equal(evaluateMatch(userA, userB), null);
});

test('language does not affect the selected Asia server', () => {
  const user = profile('asia', 'en', '太陽', '月', 'a');
  const candidate = profile('asia', 'ja', '月', '太陽', 'b');
  assert.equal(isExactMatch(user, candidate), true);
});

test('Japanese users can match on America', () => {
  const user = profile('america', 'ja', '太陽', '月', 'a');
  const candidate = profile('america', 'en', '月', '太陽', 'b');
  assert.equal(isExactMatch(user, candidate), true);
});

test('Chinese users can match on Europe', () => {
  const user = profile('europe', 'zh-cn', '太陽', '月', 'a');
  const candidate = profile('europe', 'en', '月', '太陽', 'b');
  assert.equal(isExactMatch(user, candidate), true);
});

test('unset server returns no candidates', () => {
  const candidates = [profile('asia', 'ja', '月', '太陽', 'b')];
  assert.deepEqual(filterCompatibleServer('', candidates), []);
});

test('changing server immediately changes the compatible candidate set', () => {
  const asia = profile('asia', 'ja', '月', '太陽', 'asia');
  const america = profile('america', 'en', '月', '太陽', 'america');
  assert.deepEqual(
    filterCompatibleServer('asia', [asia, america]).map(
      (candidate) => candidate.publicId,
    ),
    ['asia'],
  );
  assert.deepEqual(
    filterCompatibleServer('america', [asia, america]).map(
      (candidate) => candidate.publicId,
    ),
    ['america'],
  );
});

test('quick selection converts missing, duplicate and remaining cards', () => {
  const inventory = inventoryFromQuickSelection(['世界'], ['月', '太陽']);
  assert.equal(inventory['世界'], 0);
  assert.equal(inventory['月'], 2);
  assert.equal(inventory['太陽'], 2);
  assert.equal(inventory['魔術師'], 1);
});
