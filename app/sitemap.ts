import { readCardStats } from '@/lib/arcana-db';
import type { MetadataRoute } from 'next';
import { arcanaCards } from '@/lib/arcana-cards';
import { localizedPath, siteLocales } from '@/lib/site-i18n';

const base = 'https://arcana-card-link.pages.dev';

const paths = [
  '',
  'genshin-arcana',
  'guide',
  'arcana',
  'about',
  'privacy',
  'terms',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const available = await Promise.all(arcanaCards.map(async card=>({card,stats:await readCardStats(card.id)})));
  const indexedCards=available.filter(item=>item.stats?.some(row=>row.wanting>0||row.offering>0)).map(item=>item.card);
  const mainPages = siteLocales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified: new Date('2026-09-17'),
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === 'genshin-arcana' ? 0.9 : 0.7,
    })),
  );
  const cardPages = siteLocales.flatMap((locale) =>
    indexedCards.map((card) => ({
      url: `${base}${localizedPath(locale, `genshin-arcana/${card.slug}`)}`,
      lastModified: new Date('2026-09-17'),
      changeFrequency: 'daily' as const,
      priority: 0.75,
    })),
  );
  return [...mainPages, ...cardPages, {url:base+'/contact',lastModified:new Date('2026-09-17'),changeFrequency:'monthly',priority:0.3}, {url:base+'/genshin-arcana/exchange-table',lastModified:new Date('2026-09-17'),changeFrequency:'monthly',priority:0.8}];
}
