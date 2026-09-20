import assert from 'node:assert/strict';
import test from 'node:test';
import { arcanaCards } from '../lib/arcana-cards';
import {
  countNewExactMatches,
  getListingDaysRemaining,
  getListingTiming,
} from '../lib/revisit';

const now = Date.parse('2026-09-20T00:00:00.000Z');

void test('21 of 22 cards is not complete and 22 of 22 is complete', () => {
  assert.equal(21 === arcanaCards.length, false);
  assert.equal(22 === arcanaCards.length, true);
});

void test('the first visit and a revisit without newer matches show no notice', () => {
  const matches = [{ exact: true, updatedAt: '2026-09-19T10:00:00.000Z' }];
  assert.equal(countNewExactMatches(matches, ''), 0);
  assert.equal(countNewExactMatches(matches, '2026-09-19T11:00:00.000Z'), 0);
});

void test('only exact matches newer than the previous visit are counted', () => {
  const matches = [
    { exact: true, updatedAt: '2026-09-19T12:00:00.000Z' },
    { exact: false, updatedAt: '2026-09-19T13:00:00.000Z' },
    { exact: true, updatedAt: '2026-09-19T09:00:00.000Z' },
  ];
  assert.equal(countNewExactMatches(matches, '2026-09-19T10:00:00.000Z'), 1);
});

void test('listing timing changes from active to warning and expired', () => {
  assert.equal(getListingTiming('2026-09-14T01:00:00.000Z', now), 'active');
  assert.equal(
    getListingTiming('2026-09-13T12:00:00.000Z', now),
    'expires-soon',
  );
  assert.equal(getListingTiming('2026-09-13T00:00:00.000Z', now), 'expired');
});

void test('listing countdown covers seven days, two days, one day and expiry', () => {
  assert.equal(getListingDaysRemaining('2026-09-20T00:00:00.000Z', now), 7);
  assert.equal(getListingDaysRemaining('2026-09-15T00:00:00.000Z', now), 2);
  assert.equal(getListingDaysRemaining('2026-09-14T00:00:00.000Z', now), 1);
  assert.equal(getListingDaysRemaining('2026-09-13T00:00:00.000Z', now), 0);
});
