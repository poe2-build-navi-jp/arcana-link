import { readCardStats } from '@/lib/arcana-db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { arcanaCards, cardBySlug } from '@/lib/arcana-cards';
import {
  cardNames,
  languageAlternates,
  localizedPath,
  type SiteLocale,
} from '@/lib/site-i18n';

const base = 'https://arcana-card-link.pages.dev';

export const cardStaticParams = arcanaCards.map((card) => ({
  slug: card.slug,
}));

export async function buildCardMetadata(locale: SiteLocale, slug: string): Promise<Metadata> {
  const card = cardBySlug[slug];
  if (!Object.hasOwn(cardBySlug, slug) || !card) notFound();
  const stats=await readCardStats(card.id);
  const hasListings=!!stats?.some(row=>row.wanting>0 || row.offering>0);
  const name = cardNames[locale][card.id];
  const content = {
    ja: {
      title: `${name}｜原神 月諭アルカナ交換相手を探す`,
      description: `原神の月諭アルカナ「${name}」を探している人、交換に出せる人を相互条件で探せます。所持数を登録すると交換内容を自動計算します。`,
    },
    en: {
      title: `${name} Lunar Arcana Trade Listings`,
      description: `Find players who can offer ${name} Lunar Arcana and match the duplicate cards you have. Register your 22-card collection for automatic matching.`,
    },
    'zh-cn': {
      title: `${name}月谕圣牌交换招募`,
      description: `查找可提供“${name}”月谕圣牌、且需要你所持重复圣牌的玩家。登记22种持有数量后即可自动匹配。`,
    },
  }[locale];
  const path = `genshin-arcana/${slug}`;
  const canonical = localizedPath(locale, path);
  return {
    title: `${content.title} | ARCANA LINK`,
    description: content.description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    robots: { index: hasListings, follow: true },
    openGraph: {
      type: 'article',
      title: content.title,
      description: content.description,
      url: canonical,
      locale: locale === 'ja' ? 'ja_JP' : locale === 'en' ? 'en_US' : 'zh_CN',
    },
    twitter: {
      card: 'summary',
      title: content.title,
      description: content.description,
    },
  };
}

export function cardStructuredData(locale: SiteLocale, slug: string) {
  const card = cardBySlug[slug];
  if (!card) return null;
  const name = cardNames[locale][card.id];
  const headline =
    locale === 'ja'
      ? `${name}のアルカナ交換募集`
      : locale === 'en'
        ? `${name} Lunar Arcana Trade Listings`
        : `${name}月谕圣牌交换招募`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    inLanguage: locale === 'zh-cn' ? 'zh-CN' : locale,
    datePublished: '2026-09-06',
    dateModified: '2026-09-14',
    author: { '@type': 'Organization', name: 'ARCANA LINK' },
    publisher: { '@type': 'Organization', name: 'ARCANA LINK' },
    mainEntityOfPage: `${base}${localizedPath(locale, `genshin-arcana/${slug}`)}`,
  };
}
