import type { MetadataRoute } from 'next';
import { arcanaCards, englishCardSlugById } from '@/lib/arcana-cards';
import { localizedPath, siteLocales } from '@/lib/site-i18n';
import { seoTopicSlugs, serverPageSlugs } from '@/lib/international-seo';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages = siteLocales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified: new Date('2026-09-11'),
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === 'genshin-arcana' ? 0.9 : 0.7,
    })),
  );
  const cardPages = siteLocales.flatMap((locale) =>
    arcanaCards.map((card) => ({
      url: `${base}${localizedPath(locale, locale === 'en' ? `lunar-arcana/${englishCardSlugById[card.id]}` : `genshin-arcana/${card.slug}`)}`,
      lastModified: new Date('2026-09-11'),
      changeFrequency: 'daily' as const,
      priority: 0.75,
    })),
  );
  const guidePages = siteLocales.flatMap((locale) =>
    [...seoTopicSlugs, ...serverPageSlugs].map((slug) => ({
      url: `${base}${localizedPath(locale, `genshin-arcana/${slug}`)}`,
      lastModified: new Date('2026-09-11'),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  );
  return [...mainPages, ...guidePages, ...cardPages];
}
