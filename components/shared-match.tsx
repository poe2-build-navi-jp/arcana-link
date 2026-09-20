'use client';

import { useEffect, useState } from 'react';
import { arcanaCards } from '@/lib/arcana-cards';
import {
  normalizeInventory,
  type InventoryCounts,
} from '@/lib/arcana-profile';
import { track } from '@/lib/analytics';
import { evaluateMatch } from '@/lib/matching';
import {
  normalizeServerRegion,
  type ServerRegion,
} from '@/lib/server-region';

type Comparison = 'unregistered' | 'exact' | 'different-server' | 'no-match';

export function SharedMatch({
  server,
  inventory,
  active,
}: {
  server: ServerRegion;
  inventory: InventoryCounts;
  active: boolean;
}) {
  const [comparison, setComparison] = useState<Comparison>('unregistered');
  const [ownServer, setOwnServer] = useState<ServerRegion | null>(null);

  /* oxlint-disable react/react-compiler -- Comparison depends on browser-only saved inventory. */
  useEffect(() => {
    try {
      const own = normalizeInventory(
        JSON.parse(localStorage.getItem('arcana-link-v2-inventory') || 'null'),
      );
      const savedServer = normalizeServerRegion(
        localStorage.getItem('arcana_server'),
      );
      const reviewed = JSON.parse(
        localStorage.getItem('arcana-link-v2-reviewed') || '[]',
      ) as unknown;
      const complete =
        Array.isArray(reviewed) && reviewed.length === arcanaCards.length;
      setOwnServer(savedServer);
      if (!own || !savedServer || !complete) return;
      if (savedServer !== server) {
        setComparison('different-server');
        return;
      }
      const result = evaluateMatch(
        { server: savedServer, inventory: own },
        { server, inventory },
      );
      setComparison(result?.exact ? 'exact' : 'no-match');
    } catch {
      // Browser storage may be unavailable; registration remains usable.
    }
  }, [server, inventory]);
  /* oxlint-enable react/react-compiler */

  const params = new URLSearchParams({
    server: ownServer ?? server,
    utm_source: 'shared_listing',
    utm_medium: 'referral',
    compare: '1',
  });
  if (comparison !== 'unregistered' && comparison !== 'exact') {
    params.set('publish', '1');
  }

  if (!active) {
    return (
      <section className="shared-compare is-inactive">
        <h2>この募集は現在受付中ではありません</h2>
        <p>あなたの所持状況を登録すると、受付中の別の募集と比較できます。</p>
        <a href={`/?${params.toString()}#inventory`}>受付中の交換相手を探す</a>
      </section>
    );
  }

  if (comparison === 'exact') {
    return (
      <section className="shared-compare is-match">
        <h2>🎉 この募集と条件が一致しています</h2>
        <p>同じサーバーで、お互いの求・譲が一致しています。</p>
        <a
          href={`/?${params.toString()}#matches`}
          onClick={() => track('shared_listing_compare_start', { server })}
        >
          交換を進める
        </a>
      </section>
    );
  }

  const registered = comparison !== 'unregistered';
  return (
    <section className="shared-compare">
      <h2>
        {registered
          ? '今回は完全一致ではありませんでした'
          : 'あなたのカードと条件が合うか確認'}
      </h2>
      <p>
        {registered
          ? 'あなたも募集を公開しておくと、別のユーザーと条件が合う可能性があります。'
          : '22種類の所持数を登録すると、この募集との条件を自動比較できます。'}
      </p>
      <a
        href={`/?${params.toString()}#inventory`}
        onClick={() => track('shared_listing_compare_start', { server })}
      >
        {registered ? '自分の募集を公開する' : 'あなたのカードと条件が合うか確認'}
      </a>
    </section>
  );
}
