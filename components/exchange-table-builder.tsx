'use client';

import { useEffect, useState } from 'react';
import { ExchangeTable } from '@/components/exchange-table';
import { arcanaCards } from '@/lib/arcana-cards';
import { inventoryFromQuickSelection, normalizeInventory, type InventoryCounts } from '@/lib/arcana-profile';
import { cardNames, romans, type ArcanaId } from '@/lib/site-i18n';
import {
  normalizeServerRegion,
  serverLabels,
  serverRegions,
  type ServerRegion,
} from '@/lib/server-region';

import { inventoryStorageKeys, readStoredJson } from '@/lib/inventory-storage';

type Selection = 'want' | 'offer' | 'none';

export function ExchangeTableBuilder() {
  const [server, setServer] = useState<ServerRegion | ''>('');
  const [inventory, setInventory] = useState<InventoryCounts>(() => inventoryFromQuickSelection([], []));
  const [ready, setReady] = useState(false);
  const [changed, setChanged] = useState(false);
  /* oxlint-disable react/react-compiler -- Hydrate the shared browser draft after mount. */
  useEffect(() => {
    const saved = normalizeInventory(readStoredJson(inventoryStorageKeys.inventory));
    if (saved) setInventory(saved);
    setServer(normalizeServerRegion(localStorage.getItem(inventoryStorageKeys.server)) || '');
    setReady(true);
  }, []);
  /* oxlint-enable react/react-compiler */
  useEffect(() => {
    if (!ready || !changed) return;
    localStorage.setItem(inventoryStorageKeys.inventory, JSON.stringify(inventory));
    localStorage.setItem(inventoryStorageKeys.reviewed, JSON.stringify(arcanaCards.map(card => card.id)));
    if (server) localStorage.setItem(inventoryStorageKeys.server, server);
  }, [ready, changed, inventory, server]);
  const update = (card: ArcanaId, value: Selection) => {
    setInventory(current => ({...current, [card]: value === 'want' ? 0 : value === 'offer' ? Math.max(2, current[card]) : 1} as InventoryCounts));
    setChanged(true);
  };

  return (
    <section
      className="exchange-table-builder"
      aria-labelledby="exchange-tool-heading"
    >
      <h2 id="exchange-tool-heading">交換表ツール</h2>
      <label htmlFor="exchange-server">サーバー</label>
      <select
        id="exchange-server"
        value={server}
        onChange={(event) => {setServer(event.target.value as ServerRegion);setChanged(true);}}
      >
        <option value="" disabled>サーバーを選択</option>
        {serverRegions.map((region) => (
          <option key={region} value={region}>
            {serverLabels.ja[region]}
          </option>
        ))}
      </select>
      <p>登録済みの所持数を引き継いでいます。「求」は0枚、「譲」は2枚以上、「対象外」は1枚です。変更は相手探しにも反映されます。</p>
      <div className="exchange-table-picker">
        {arcanaCards.map((card, index) => (
          <fieldset key={card.id}>
            <legend>
              {romans[index]} {cardNames.ja[card.id]}
            </legend>
            <label>
              <input
                checked={inventory[card.id] === 0}
                name={card.slug}
                onChange={() => update(card.id, 'want')}
                type="radio"
              />
              求
            </label>
            <label>
              <input
                checked={inventory[card.id] >= 2}
                name={card.slug}
                onChange={() => update(card.id, 'offer')}
                type="radio"
              />
              譲
            </label>
            <label>
              <input
                checked={inventory[card.id] === 1}
                name={card.slug}
                onChange={() => update(card.id, 'none')}
                type="radio"
              />
              対象外
            </label>
          </fieldset>
        ))}
      </div>
      <h2>生成結果</h2>
      <ExchangeTable
        inventory={inventory}
        onMatch={() => {localStorage.setItem(inventoryStorageKeys.inventory, JSON.stringify(inventory));localStorage.setItem(inventoryStorageKeys.reviewed, JSON.stringify(arcanaCards.map(card => card.id)));if(server)localStorage.setItem(inventoryStorageKeys.server,server);}}
        locale="ja"
        server={server}
        status="open"
      />
    </section>
  );
}
