import type { MetadataRoute } from 'next';
import { arcanaCards, englishCardSlugById } from '@/lib/arcana-cards';
import { localizedPath, type SiteLocale } from '@/lib/site-i18n';
import { serverPageSlugs } from '@/lib/international-seo';

const base = 'https://arcana-card-link.pages.dev';

// Keep the XML sitemap focused on the locales that currently have the most
// complete, independently written public content. Other locales remain
// accessible to users but are not pushed to Google until their editorial depth
// is comparable.
const searchLocales = ['ja', 'en', 'zh-cn'] as const satisfies readonly SiteLocale[];

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
  const mainPages = searchLocales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified: new Date('2026-09-17'),
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === 'genshin-arcana' ? 0.9 : 0.7,
    })),
  );
  const cardPages = searchLocales.flatMap((locale) =>
    arcanaCards.map((card) => ({
      url: `${base}${localizedPath(locale, locale === 'en' ? `lunar-arcana/${englishCardSlugById[card.id]}` : `genshin-arcana/${card.slug}`)}`,
      lastModified: new Date('2026-09-17'),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  );
  const serverPages = searchLocales.flatMap((locale) =>
    serverPageSlugs.map((slug) => ({
      url: `${base}${localizedPath(locale, `genshin-arcana/${slug}`)}`,
      lastModified: new Date('2026-09-17'),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  );
  return [...mainPages, ...serverPages, ...cardPages];
}
