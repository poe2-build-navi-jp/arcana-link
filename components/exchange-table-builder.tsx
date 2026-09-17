'use client';

import { useMemo, useState } from 'react';
import { ExchangeTable } from '@/components/exchange-table';
import { arcanaCards } from '@/lib/arcana-cards';
import { defaultInventory, type InventoryCounts } from '@/lib/arcana-profile';
import { cardNames, romans, type ArcanaId } from '@/lib/site-i18n';
import {
  serverLabels,
  serverRegions,
  type ServerRegion,
} from '@/lib/server-region';

type Selection = 'want' | 'offer' | 'none';

export function ExchangeTableBuilder() {
  const [server, setServer] = useState<ServerRegion>('asia');
  const [selection, setSelection] = useState<Record<ArcanaId, Selection>>(
    () =>
      Object.fromEntries(
        arcanaCards.map((card) => [card.id, 'none']),
      ) as Record<ArcanaId, Selection>,
  );

  const inventory = useMemo(() => {
    const result = { ...defaultInventory } as InventoryCounts;
    for (const card of arcanaCards) {
      result[card.id] =
        selection[card.id] === 'want'
          ? 0
          : selection[card.id] === 'offer'
            ? 2
            : 1;
    }
    return result;
  }, [selection]);

  const update = (card: ArcanaId, value: Selection) => {
    setSelection((current) => ({ ...current, [card]: value }));
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
        onChange={(event) => setServer(event.target.value as ServerRegion)}
      >
        {serverRegions.map((region) => (
          <option key={region} value={region}>
            {serverLabels.ja[region]}
          </option>
        ))}
      </select>
      <p>各アルカナを「求」「譲」「対象外」から選択してください。</p>
      <div className="exchange-table-picker">
        {arcanaCards.map((card, index) => (
          <fieldset key={card.id}>
            <legend>
              {romans[index]} {cardNames.ja[card.id]}
            </legend>
            <label>
              <input
                checked={selection[card.id] === 'want'}
                name={card.slug}
                onChange={() => update(card.id, 'want')}
                type="radio"
              />
              求
            </label>
            <label>
              <input
                checked={selection[card.id] === 'offer'}
                name={card.slug}
                onChange={() => update(card.id, 'offer')}
                type="radio"
              />
              譲
            </label>
            <label>
              <input
                checked={selection[card.id] === 'none'}
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
        locale="ja"
        server={server}
        status="open"
      />
    </section>
  );
}
