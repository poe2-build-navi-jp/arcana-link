import assert from 'node:assert/strict';
import test from 'node:test';
import { arcanaIds, siteLocales } from '../lib/site-i18n';
import { inventoryFromQuickSelection } from '../lib/arcana-profile';
import { readSharedConditions, sharedTradeUrl, tradeShareText, shareWeight } from '../lib/trade-sharing';
import { evaluateMatch } from '../lib/matching';

const inventory = inventoryFromQuickSelection(['世界'], ['魔術師']);
void test('each language shares conditions without private fields or profile identifiers', () => {
  for (const locale of siteLocales) {
    const url = new URL(sharedTradeUrl({server:'asia', inventory},locale));
    assert.equal(url.pathname, locale === 'ja' ? '/' : `/${locale}`);
    assert.equal(url.searchParams.get('locale'),locale);
    assert.deepEqual([...url.searchParams.keys()].sort(), ['shared','server','locale','want','offer','utm_source','utm_medium','utm_campaign'].sort());
    assert.deepEqual(readSharedConditions(url.searchParams),{server:'asia',inventory});
  }
});
void test('invalid card/server conditions cannot be imported as another user inventory', () => {
  for (const query of ['shared=1&server=invalid&want=sekai&offer=majutsushi','shared=1&server=asia&want=<script>&offer=majutsushi','shared=1&server=asia&want=sekai&offer=sekai','server=asia&want=sekai&offer=majutsushi','shared=1&server=asia']) {
    assert.equal(readSharedConditions(new URLSearchParams(query)),null);
  }
});
void test('a shared draft compares both directions and preserves receiver quantity 3+', () => {
  const receiver = inventoryFromQuickSelection(['魔術師'], ['世界']);
  receiver['世界']=3;
  const snapshot = structuredClone(receiver);
  const sender = readSharedConditions(new URL(sharedTradeUrl({server:'asia',inventory},'ja')).searchParams)!;
  assert.equal(evaluateMatch({server:'asia',inventory:receiver},sender)?.exact,true);
  assert.equal(evaluateMatch({server:'america',inventory:receiver},sender),null);
  assert.equal(evaluateMatch({server:'asia',inventory},sender),null);
  assert.deepEqual(receiver,snapshot);
});
void test('X posts fit conservative 280 weighted limit for every locale and card distribution', () => {
  for (const locale of siteLocales) {
    for (let split=0;split<=22;split++) {
      const draft={server:'tw_hk_mo' as const,inventory:inventoryFromQuickSelection(arcanaIds.slice(0,split),arcanaIds.slice(split))};
      const text=tradeShareText(draft,locale,'x');
      assert.ok(shareWeight(text)<=280,`${locale} ${split}`);
      assert.ok(text.includes('Server: TW / HK / MO'));
      const url=text.split('\n').find(line=>line.startsWith('https://'))!;
      assert.deepEqual(readSharedConditions(new URL(url).searchParams),draft);
    }
  }
});
